<?php

namespace App\Http\Controllers;

use App\Models\Office;
use Illuminate\Http\Request;
use DataTables;

class OfficeController extends Controller
{
    public function index()
    {
        return view('office.office');
    }

    public function stats()
    {
        try {
            $stats = [
                'total' => Office::count(),
                'active' => Office::where('status', 1)->count(),
                'inactive' => Office::where('status', 0)->count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            \Log::error('Error fetching office stats', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch stats.'], 500);
        }
    }

    public function data()
    {
        $offices = Office::select([
            'id',
            'office_name',
            'office_address',
            'status'
        ]);

        return DataTables::of($offices)
            ->addColumn('status_badge', function($office) {
                $status_class = $office->status == 1 ? 'badge-success' : 'badge-secondary';
                $status_text = $office->status == 1 ? 'Active' : 'Inactive';
                return '<span class="badge '.$status_class.'">'.$status_text.'</span>';
            })
            ->addColumn('action', function($office) {
                return '
                    <button type="button" class="btn btn-sm btn-info view-office" data-id="'.$office->id.'">View</button>
                    <button type="button" class="btn btn-sm btn-primary edit-office" data-id="'.$office->id.'">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger delete-office" data-id="'.$office->id.'">Delete</button>
                ';
            })
            ->rawColumns(['status_badge', 'action'])
            ->make(true);
    }

    public function store(Request $request)
    {
        $request->validate([
            'office_name' => 'required|string|max:50',
            'office_address' => 'required|string|max:50',
            'status' => 'required|in:0,1'
        ]);

        $data = $request->only(['office_name', 'office_address', 'status']);

        $office = Office::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Office record created successfully',
            'office' => $office
        ]);
    }

    public function show($id)
    {
        $office = Office::findOrFail($id);
        return response()->json($office);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'office_name' => 'required|string|max:50',
            'office_address' => 'required|string|max:50',
            'status' => 'required|in:0,1'
        ]);

        $office = Office::findOrFail($id);
        $data = $request->only(['office_name', 'office_address', 'status']);

        $office->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Office record updated successfully',
            'office' => $office
        ]);
    }

    public function destroy($id)
    {
        $office = Office::findOrFail($id);
        $office->delete();

        return response()->json([
            'success' => true,
            'message' => 'Office record deleted successfully'
        ]);
    }
}
