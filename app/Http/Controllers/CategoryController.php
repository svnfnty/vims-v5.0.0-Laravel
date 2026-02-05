<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use DataTables;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Generate unique category code in format YYYYMM-XXXX
     */
    private function generateCategoryCode(): string
    {
        $prefix = now()->format('Ym'); // YearMonth format: 202602
        $lastCategory = Category::where('code', 'like', $prefix . '-%')
            ->orderBy('code', 'desc')
            ->first();

        if ($lastCategory) {
            $lastNumber = (int) substr($lastCategory->code, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . '-' . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    public function index()
    {
        return view('category.category');
    }

    public function data()
    {
        $categories = Category::select('*');

        return DataTables::of($categories)
            ->addColumn('status_badge', function($category) {
                return $category->status ? 
                    '<span class="badge badge-success">Active</span>' : 
                    '<span class="badge badge-danger">Inactive</span>';
            })
            ->addColumn('action', function($category) {
                return '
                    <button type="button" class="btn btn-sm btn-primary edit-category" data-id="'.$category->id.'">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger delete-category" data-id="'.$category->id.'">Delete</button>
                ';
            })
            ->addColumn('policy_count', function($category) {
                return $category->policies->count();
            })
            ->rawColumns(['status_badge', 'action'])
            ->make(true);

            $categories = Category::all();
            return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:category_list,name',
            'description' => 'nullable'
        ]);

        $data = $request->all();
        $data['status'] = $request->has('status') ? 1 : 0;
        $data['code'] = $this->generateCategoryCode();
        $data['office_id'] = auth()->user()->office_id ?? 1;

        $category = Category::create($data);
        
        return response()->json([
            'success' => true, 
            'message' => 'Category created successfully',
            'category' => $category
        ]);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|unique:category_list,name,'.$id,
            'description' => 'nullable'
        ]);

        $category = Category::findOrFail($id);
        $data = $request->all();
        $data['status'] = $request->has('status') ? 1 : 0;
        
        $category->update($data);
        
        return response()->json([
            'success' => true, 
            'message' => 'Category updated successfully',
            'category' => $category
        ]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        // Check if category has policies
        if ($category->policies()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category. It contains one or more policies.'
            ], 422);
        }

        $category->delete();
        
        return response()->json([
            'success' => true, 
            'message' => 'Category deleted successfully'
        ]);
    }

    public function toggleStatus($id)
    {
        $category = Category::findOrFail($id);
        $category->status = !$category->status;
        $category->save();

        return response()->json([
            'success' => true,
            'message' => 'Category status updated successfully',
            'status' => $category->status
        ]);
    }

    public function stats()
    {
        try {
            $stats = [
                'total' => Category::count(),
                'active' => Category::where('status', 1)->count(),
                'inactive' => Category::where('status', 0)->count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            \Log::error('Error fetching category stats', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch stats.'], 500);
        }
    }

    public function getAll(): JsonResponse
    {
        $categories = Category::select('id', 'name')->get();
        return response()->json($categories);
    }
}
