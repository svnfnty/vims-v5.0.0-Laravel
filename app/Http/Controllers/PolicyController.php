<?php

namespace App\Http\Controllers;
    
use App\Models\Policy;
use App\Models\Category;
use Illuminate\Http\Request;
use DataTables;

class PolicyController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return view('policies.policies', compact('categories'));
    }

    public function stats()
    {
        $total = Policy::count();
        $active = Policy::where('status', 1)->count();
        $inactive = Policy::where('status', 0)->count();

        return response()->json([
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive
        ]);
    }

    public function data()
    {
        $policies = Policy::with('category')->select([
            'policy_list.id',
            'policy_list.category_id',
            'policy_list.code',
            'policy_list.name',
            'policy_list.description',
            'policy_list.description1',
            'policy_list.description2',
            'policy_list.duration',
            'policy_list.third_party_liability',
            'policy_list.personal_accident',
            'policy_list.tppd',
            'policy_list.documentary_stamps',
            'policy_list.value_added_tax',
            'policy_list.local_gov_tax',
            'policy_list.cost',
            'policy_list.doc_path',
            'policy_list.status',
            'policy_list.delete_flag',
            'policy_list.date_created',
            'policy_list.date_updated',
            'policy_list.office_id',
            \DB::raw('DATE_FORMAT(policy_list.date_created, "%Y-%m-%d") as formatted_date')
        ]);

        return DataTables::of($policies)
            ->addColumn('category_name', function($policy) {
                return $policy->category ? $policy->category->name : 'N/A';
            })
            ->addColumn('status_badge', function($policy) {
                return $policy->status ? 
                    '<span class="badge badge-success">Active</span>' : 
                    '<span class="badge badge-danger">Inactive</span>';
            })
            ->addColumn('action', function($policy) {
                return '
                    <button type="button" class="btn btn-sm btn-primary edit-policy" data-id="'.$policy->id.'">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger delete-policy" data-id="'.$policy->id.'">Delete</button>
                ';
            })
            ->rawColumns(['status_badge', 'action'])
            ->make(true);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:category_list,id',
            'code' => 'required|unique:policy_list,code',
            'name' => 'required',
            'description' => 'nullable'
        ]);

        $data = $request->all();
        $data['status'] = $request->has('status') ? 1 : 0;
        $data['date_created'] = now();

        $policy = Policy::create($data);
        
        return response()->json([
            'success' => true, 
            'message' => 'Policy created successfully',
            'policy' => $policy
        ]);
    }

    public function show($id)
    {
        $policy = Policy::with('category')->findOrFail($id);
        return response()->json($policy);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'category_id' => 'required|exists:category_list,id',
            'code' => 'required|unique:policy_list,code,'.$id,
            'name' => 'required',
            'description' => 'nullable'
        ]);

        $policy = Policy::findOrFail($id);
        $data = $request->all();
        $data['status'] = $request->has('status') ? 1 : 0;
        $data['date_updated'] = now();
        
        $policy->update($data);
        
        return response()->json([
            'success' => true, 
            'message' => 'Policy updated successfully',
            'policy' => $policy
        ]);
    }

    public function destroy($id)
    {
        $policy = Policy::findOrFail($id);
        
        // Check if policy is being used
        if ($policy->insurances()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete policy. It is being used by one or more insurances.'
            ], 422);
        }

        $policy->delete();
        
        return response()->json([
            'success' => true, 
            'message' => 'Policy deleted successfully'
        ]);
    }

    public function toggleStatus($id)
    {
        $policy = Policy::findOrFail($id);
        $policy->status = !$policy->status;
        $policy->save();

        return response()->json([
            'success' => true,
            'message' => 'Policy status updated successfully',
            'status' => $policy->status
        ]);
    }
}