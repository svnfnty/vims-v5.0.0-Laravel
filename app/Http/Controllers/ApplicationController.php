<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Client;
use App\Models\Insurance;
use Illuminate\Http\Request;
use DataTables;

class ApplicationController extends Controller
{
    public function index()
    {
        $clients = Client::all();
        $insurances = Insurance::all();
        return view('applications.index', compact('clients', 'insurances'));
    }

    public function data()
    {
        $applications = Application::with(['client', 'insurance'])
            ->select([
                'application_list.*',
                \DB::raw('DATE_FORMAT(date_created, "%Y-%m-%d") as formatted_date')
            ]);

        return DataTables::of($applications)
            ->addColumn('client_name', function($application) {
                return $application->client ? 
                    $application->client->firstname . ' ' . $application->client->lastname : 'N/A';
            })
            ->addColumn('insurance_name', function($application) {
                return $application->insurance ? $application->insurance->code : 'N/A';
            })
            ->addColumn('status_badge', function($application) {
                $status_class = match($application->status) {
                    0 => 'badge-secondary',
                    1 => 'badge-success',
                    2 => 'badge-danger',
                    default => 'badge-info'
                };
                $status_text = match($application->status) {
                    0 => 'Pending',
                    1 => 'Approved',
                    2 => 'Rejected',
                    default => 'Unknown'
                };
                return '<span class="badge '.$status_class.'">'.$status_text.'</span>';
            })
            ->addColumn('action', function($application) {
                return '
                    <button type="button" class="btn btn-sm btn-info view-application" data-id="'.$application->id.'">View</button>
                    <button type="button" class="btn btn-sm btn-primary edit-application" data-id="'.$application->id.'">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger delete-application" data-id="'.$application->id.'">Delete</button>
                ';
            })
            ->rawColumns(['status_badge', 'action'])
            ->make(true);
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:client_list,id',
            'insurance_id' => 'required|exists:insurance_list,id',
            'vehicle_type' => 'required',
            'plate_number' => 'required',
            'engine_number' => 'required',
            'chassis_number' => 'required',
            'model' => 'required',
            'make' => 'required',
            'color' => 'required',
            'year' => 'required|numeric'
        ]);

        $data = $request->all();
        $data['date_created'] = now();
        $data['status'] = 0; // Pending status

        $application = Application::create($data);
        
        return response()->json([
            'success' => true, 
            'message' => 'Application submitted successfully',
            'application' => $application
        ]);
    }

    public function show($id)
    {
        $application = Application::with(['client', 'insurance'])->findOrFail($id);
        return response()->json($application);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'client_id' => 'required|exists:client_list,id',
            'insurance_id' => 'required|exists:insurance_list,id',
            'vehicle_type' => 'required',
            'plate_number' => 'required',
            'engine_number' => 'required',
            'chassis_number' => 'required',
            'model' => 'required',
            'make' => 'required',
            'color' => 'required',
            'year' => 'required|numeric',
            'status' => 'required|in:0,1,2'
        ]);

        $application = Application::findOrFail($id);
        $data = $request->all();
        $data['date_updated'] = now();
        
        $application->update($data);
        
        return response()->json([
            'success' => true, 
            'message' => 'Application updated successfully',
            'application' => $application
        ]);
    }

    public function destroy($id)
    {
        $application = Application::findOrFail($id);
        $application->delete();
        
        return response()->json([
            'success' => true, 
            'message' => 'Application deleted successfully'
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:0,1,2',
            'remarks' => 'required_if:status,2'
        ]);

        $application = Application::findOrFail($id);
        $application->status = $request->status;
        $application->remarks = $request->remarks;
        $application->date_updated = now();
        $application->save();

        $status_text = match($request->status) {
            0 => 'marked as pending',
            1 => 'approved',
            2 => 'rejected',
            default => 'updated'
        };

        return response()->json([
            'success' => true,
            'message' => "Application {$status_text} successfully"
        ]);
    }
}