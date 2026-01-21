<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use DataTables;

class ClientController extends Controller
{
    public function index()
    {
        // Return the client list view
        return view('clients.client'); 
    }

    public function data()
    {
        try {
            $clients = Client::select([
                'id', 'date_created', \DB::raw("CONCAT(firstname, ' ', middlename, ' ', lastname) AS registered_name"),
                'email AS registered_email', 'address', 
                \DB::raw("CASE WHEN status = 1 THEN 'Active' ELSE 'Inactive' END AS status")
            ]);
            
            return DataTables::of($clients)
                ->addColumn('action', function($client) {
                    return '
                        <button type="button" class="btn btn-sm btn-primary edit-client" data-id="'.$client->id.'">Edit</button>
                        <button type="button" class="btn btn-sm btn-danger delete-client" data-id="'.$client->id.'">Delete</button>
                    ';
                })
                ->rawColumns(['action'])
                ->make(true);
        } catch (\Exception $e) {
            \Log::error('Error fetching client data', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch client data.'], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|unique:client_list,code',
            'name' => 'required',
            'contact' => 'required',
            'email' => 'required|email',
            'address' => 'required'
        ]);

        $client = Client::create($request->all());
        
        return response()->json(['success' => true, 'message' => 'Client created successfully']);
    }

    public function show($id)
    {
        $client = Client::findOrFail($id);
        return response()->json($client);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'code' => 'required|unique:client_list,code,'.$id,
            'name' => 'required',
            'contact' => 'required',
            'email' => 'required|email',
            'address' => 'required'
        ]);

        $client = Client::findOrFail($id);
        $client->update($request->all());
        
        return response()->json(['success' => true, 'message' => 'Client updated successfully']);
    }

    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();
        
        return response()->json(['success' => true, 'message' => 'Client deleted successfully']);
    }
}
