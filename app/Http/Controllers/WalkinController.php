<?php

namespace App\Http\Controllers;
 
use App\Models\Walkin;
use Illuminate\Http\Request;
use DataTables;

class WalkinController extends Controller
{
    public function index()
    {
        return view('walkin.walkin');
    }

    public function stats()
    {
        try {
            $user = auth()->user();
            $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
            $officeId = $user->office_id ?? null;
            
            if (!$isSuperAdmin && !$officeId) {
                return response()->json([
                    'total' => 0,
                    'active' => 0,
                    'inactive' => 0,
                ]);
            }
            
            if ($isSuperAdmin) {
                $stats = [
                    'total' => Walkin::where('delete_flag', 0)->count(),
                    'active' => Walkin::where('status', 1)->where('delete_flag', 0)->count(),
                    'inactive' => Walkin::where('status', 0)->where('delete_flag', 0)->count(),
                ];
            } else {
                $stats = [
                    'total' => Walkin::where('office_id', $officeId)->where('delete_flag', 0)->count(),
                    'active' => Walkin::where('office_id', $officeId)->where('status', 1)->where('delete_flag', 0)->count(),
                    'inactive' => Walkin::where('office_id', $officeId)->where('status', 0)->where('delete_flag', 0)->count(),
                ];
            }

            return response()->json($stats);
        } catch (\Exception $e) {
            \Log::error('Error fetching walkin stats', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch stats.'], 500);
        }
    }

    public function data()
    {
        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id ?? null;
        
        $walkinsQuery = Walkin::where('delete_flag', 0);
        
        if (!$isSuperAdmin) {
            $walkinsQuery->where('office_id', $officeId);
        }
        
        $walkins = $walkinsQuery->select([
            'id',
            'email',
            'accountID',
            'name',
            'color',
            'status',
            'description',
            'office_id'
        ]);

        return DataTables::of($walkins)
            ->addColumn('payment_badge', function($walkin) {
                return $walkin->payment_status ? 
                    '<span class="badge badge-success">Paid</span>' : 
                    '<span class="badge badge-warning">Pending</span>';
            })
            ->addColumn('status_badge', function($walkin) {
                $status_class = match($walkin->status) {
                    0 => 'badge-secondary',
                    1 => 'badge-success',
                    2 => 'badge-danger',
                    default => 'badge-info'
                };
                $status_text = match($walkin->status) {
                    0 => 'Pending',
                    1 => 'Completed',
                    2 => 'Cancelled',
                    default => 'Unknown'
                };
                return '<span class="badge '.$status_class.'">'.$status_text.'</span>';
            })
            ->addColumn('action', function($walkin) {
                return '
                    <button type="button" class="btn btn-sm btn-info view-walkin" data-id="'.$walkin->id.'">View</button>
                    <button type="button" class="btn btn-sm btn-primary edit-walkin" data-id="'.$walkin->id.'">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger delete-walkin" data-id="'.$walkin->id.'">Delete</button>
                ';
            })
            ->rawColumns(['payment_badge', 'status_badge', 'action'])
            ->make(true);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'accountID' => 'required',
            'name' => 'required',
            'color' => 'required',
            'description' => 'required',
            'office_id' => 'required',
            'status' => 'required|in:0,1'
        ]);

        $data = $request->only(['email', 'accountID', 'name', 'color', 'description', 'office_id', 'status']);

        $walkin = Walkin::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Walkin record created successfully',
            'walkin' => $walkin
        ]);
    }

    public function show($id)
    {
        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id ?? null;
        
        $walkinQuery = Walkin::where('id', $id);
        
        if (!$isSuperAdmin) {
            $walkinQuery->where('office_id', $officeId);
        }
        
        $walkin = $walkinQuery->firstOrFail();
        return response()->json($walkin);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'email' => 'required|email',
            'accountID' => 'required',
            'name' => 'required',
            'color' => 'required',
            'description' => 'required',
            'office_id' => 'required',
            'status' => 'required|in:0,1'
        ]);
        
        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id ?? null;

        $walkinQuery = Walkin::where('id', $id);
        
        if (!$isSuperAdmin) {
            $walkinQuery->where('office_id', $officeId);
        }
        
        $walkin = $walkinQuery->firstOrFail();
        $data = $request->only(['email', 'accountID', 'name', 'color', 'description', 'office_id', 'status']);

        $walkin->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Walkin record updated successfully',
            'walkin' => $walkin
        ]);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id ?? null;
        
        $walkinQuery = Walkin::where('id', $id);
        
        if (!$isSuperAdmin) {
            $walkinQuery->where('office_id', $officeId);
        }
        
        $walkin = $walkinQuery->firstOrFail();
        $walkin->delete();

        return response()->json([
            'success' => true,
            'message' => 'Walk-in client record deleted successfully'
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:0,1,2',
            'remarks' => 'required_if:status,2'
        ]);

        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id ?? null;
        
        $walkinQuery = Walkin::where('id', $id);
        
        if (!$isSuperAdmin) {
            $walkinQuery->where('office_id', $officeId);
        }
        
        $walkin = $walkinQuery->firstOrFail();
        $walkin->status = $request->status;
        $walkin->remarks = $request->remarks;
        $walkin->date_updated = now();
        $walkin->save();

        $status_text = match($request->status) {
            0 => 'marked as pending',
            1 => 'marked as completed',
            2 => 'cancelled',
            default => 'updated'
        };

        return response()->json([
            'success' => true,
            'message' => "Walk-in client record {$status_text} successfully"
        ]);
    }

    public function updatePayment(Request $request, $id)
    {
        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id ?? null;
        
        $walkinQuery = Walkin::where('id', $id);
        
        if (!$isSuperAdmin) {
            $walkinQuery->where('office_id', $officeId);
        }
        
        $walkin = $walkinQuery->firstOrFail();
        $walkin->payment_status = !$walkin->payment_status;
        $walkin->date_updated = now();
        $walkin->save();

        return response()->json([
            'success' => true,
            'message' => 'Payment status updated successfully',
            'payment_status' => $walkin->payment_status
        ]);
    }
}
