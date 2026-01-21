<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use DataTables;

class CategoryController extends Controller
{
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

 
}