<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use DataTables;

class ClientController extends Controller
{
    public function index()
    {
        return view('clients.client'); 
    }

    public function data()
    {
        try {
            $clients = Client::select([
                'id', 
                'firstname',
                'middlename', 
                'lastname',
                'date_created', 
                'email', 
                'address', 
                'status'
            ])->where('delete_flag', 0)->orderBy('id', 'DESC')->get();
            
            return response()->json([
                'data' => $clients
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching client data', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch client data.'], 500);
        }
    }

    public function stats()
    {
        try {
            $stats = [
                'total' => Client::where('delete_flag', 0)->count(),
                'active' => Client::where('status', 1)->where('delete_flag', 0)->count(),
                'inactive' => Client::where('status', 0)->where('delete_flag', 0)->count(),
                'email' => Client::whereNotNull('email')->where('email', '!=', '')->where('delete_flag', 0)->count(),
            ];
            
            return response()->json($stats);
        } catch (\Exception $e) {
            \Log::error('Error fetching client stats', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch stats.'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'firstname' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'middlename' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'address' => 'required|string|max:500',
                'status' => 'required|in:0,1'
            ]);

            $client = Client::create([
                'firstname' => $validated['firstname'],
                'middlename' => $validated['middlename'] ?? '',
                'lastname' => $validated['lastname'],
                'email' => $validated['email'] ?? '',
                'address' => $validated['address'],
                'status' => $validated['status'],
                'date_created' => now(),
                'delete_flag' => 0
            ]);
            
            return response()->json([
                'success' => true, 
                'message' => 'Client created successfully', 
                'data' => $client
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating client', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to create client.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'firstname' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'middlename' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'address' => 'required|string|max:500',
                'status' => 'required|in:0,1'
            ]);

            $client = Client::findOrFail($id);
            $client->update([
                'firstname' => $validated['firstname'],
                'middlename' => $validated['middlename'] ?? '',
                'lastname' => $validated['lastname'],
                'email' => $validated['email'] ?? '',
                'address' => $validated['address'],
                'status' => $validated['status'],
            ]);
            
            return response()->json([
                'success' => true, 
                'message' => 'Client updated successfully', 
                'data' => $client
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error updating client', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to update client.'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $client = Client::findOrFail($id);
            $client->update(['delete_flag' => 1]);
            
            return response()->json([
                'success' => true, 
                'message' => 'Client deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error deleting client', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to delete client.'], 500);
        }
    }
}
