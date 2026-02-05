<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Walkin;
use App\Models\Office;
use Illuminate\Http\Request;
use DataTables;
 
class ClientController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id ?? null;
        
        $walkinQuery = Walkin::where('delete_flag', 0);
        
        if (!$isSuperAdmin) {
            $walkinQuery->where('office_id', $officeId);
        }
        
        $walkin_list = $walkinQuery->get();
        
        // Get offices list for superadmin dropdown
        $offices = [];
        if ($isSuperAdmin) {
            $offices = Office::where('delete_flag', 0)
                            ->where('status', 1)
                            ->orderBy('office_name')
                            ->get();
        }
        
        return view('clients.client', compact('walkin_list', 'offices', 'isSuperAdmin'));
    }

    public function data()
    {
        try {
            $user = auth()->user();
            $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
            $officeId = $user->office_id ?? null;
            
            $clientsQuery = Client::select([
                'id',
                'firstname',
                'middlename',
                'lastname',
                'date_created',
                'email',
                'address',
                'status',
                'office_id'
            ])->with('office')->where('delete_flag', 0);
            
            if (!$isSuperAdmin) {
                $clientsQuery->where('office_id', $officeId);
            }
            
            $clients = $clientsQuery->orderBy('id', 'DESC')->get();

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
            $user = auth()->user();
            $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
            $officeId = $user->office_id ?? null;
            
            if ($isSuperAdmin) {
                $stats = [
                    'total' => Client::where('delete_flag', 0)->count(),
                    'active' => Client::where('status', 1)->where('delete_flag', 0)->count(),
                    'inactive' => Client::where('status', 0)->where('delete_flag', 0)->count(),
                    'email' => Client::whereNotNull('email')->where('email', '!=', '')->where('delete_flag', 0)->count(),
                ];
            } else {
                $stats = [
                    'total' => Client::where('office_id', $officeId)->where('delete_flag', 0)->count(),
                    'active' => Client::where('office_id', $officeId)->where('status', 1)->where('delete_flag', 0)->count(),
                    'inactive' => Client::where('office_id', $officeId)->where('status', 0)->where('delete_flag', 0)->count(),
                    'email' => Client::where('office_id', $officeId)->whereNotNull('email')->where('email', '!=', '')->where('delete_flag', 0)->count(),
                ];
            }

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
                'walkin_list' => 'required|string|max:255',
                'status' => 'required|in:0,1'
            ]);

            // Get the office_id from the authenticated user
            $user = auth()->user();
            $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
            $officeId = $user->office_id ?? null;

            // Generate auto code: YYYYMMDD-XXX
            $code = $this->generateClientCode();
            
            // Determine office_id: superadmin can assign to any office, regular users assign to their own office
            $clientOfficeId = $isSuperAdmin ? ($request->office_id ?? $officeId) : $officeId;
            
            $client = Client::create([
                'code' => $code,
                'firstname' => $validated['firstname'],
                'middlename' => $validated['middlename'] ?? '',
                'lastname' => $validated['lastname'],
                'email' => $validated['email'] ?? '',
                'address' => $validated['address'],
                'markup' => $validated['walkin_list'],
                'status' => $validated['status'],
                'date_created' => now(),
                'delete_flag' => 0,
                'office_id' => $clientOfficeId
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
                'walkin_list' => 'required|string|max:255',
                'status' => 'required|in:0,1'
            ]);

            $user = auth()->user();
            $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
            $officeId = $user->office_id ?? null;
            
            $clientQuery = Client::where('id', $id);
            
            if (!$isSuperAdmin) {
                $clientQuery->where('office_id', $officeId);
            }
            
            $client = $clientQuery->firstOrFail();
            $client->update([
                'firstname' => $validated['firstname'],
                'middlename' => $validated['middlename'] ?? '',
                'lastname' => $validated['lastname'],
                'email' => $validated['email'] ?? '',
                'address' => $validated['address'],
                'markup' => $validated['walkin_list'],
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

    /**
     * Generate auto code: YYYYMMDD-XXX
     * Example: 20240115-001, 20240115-002, etc.
     */
    private function generateClientCode()
    {
        $today = now()->format('Ymd'); // Format: 20240115
        
        // Count clients created today
        $todayCount = Client::whereRaw('DATE_FORMAT(date_created, "%Y%m%d") = ?', [$today])
                            ->count();
        
        // Generate sequential number (001, 002, etc.)
        $sequence = str_pad($todayCount + 1, 3, '0', STR_PAD_LEFT);
        
        return $today . '-' . $sequence;
    }
}
