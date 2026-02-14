<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Office;
use Illuminate\Http\Request;
use DataTables;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index()
    {
        $offices = Office::where('delete_flag', 0)->get();
        return view('user.user', compact('offices'));
    }

    public function stats()
    {
        try {
            $user = auth()->user();
            $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
            
            if ($isSuperAdmin) {
                // Superadmin sees all users
                $stats = [
                    'total' => User::where('id', '!=', 1)->count(),
                    'active' => User::where('id', '!=', 1)->where('status', 1)->count(),
                    'inactive' => User::where('id', '!=', 1)->where('status', 0)->count(),
                ];
            } else {
                $officeId = $user->office_id ?? null;
                if (!$officeId) {
                    return response()->json([
                        'total' => 0,
                        'active' => 0,
                        'inactive' => 0,
                    ]);
                }
                $stats = [
                    'total' => User::where('office_id', $officeId)->where('id', '!=', 1)->count(),
                    'active' => User::where('office_id', $officeId)->where('id', '!=', 1)->where('status', 1)->count(),
                    'inactive' => User::where('office_id', $officeId)->where('id', '!=', 1)->where('status', 0)->count(),
                ];
            }

            return response()->json($stats);
        } catch (\Exception $e) {
            \Log::error('Error fetching user stats', [
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
        
        if ($isSuperAdmin) {
            // Superadmin sees all users
            $users = User::where('id', '!=', 1) // Exclude superadmin
                ->select([
                    'id',
                    'firstname',
                    'middlename',
                    'lastname',
                    'username',
                    'email',
                    'avatar',
                    'type',
                    'status',
                    'permissions',
                    'credit',
                    'office_id',
                    'created_at',
                    // Subscription fields
                    'subscription_type',
                    'subscription_start_date',
                    'subscription_end_date',
                    'last_payment_date',
                    'subscription_amount',
                    'notification_sent',
                    // QR Code fields
                    'gcash_qr_path',
                    'maya_qr_path'
                ]);
        } else {
            $officeId = $user->office_id ?? null;
            $users = User::where('office_id', $officeId)
                ->where('id', '!=', 1) // Exclude superadmin
                ->select([
                    'id',
                    'firstname',
                    'middlename',
                    'lastname',
                    'username',
                    'email',
                    'avatar',
                    'type',
                    'status',
                    'permissions',
                    'credit',
                    'office_id',
                    'created_at',
                    // Subscription fields
                    'subscription_type',
                    'subscription_start_date',
                    'subscription_end_date',
                    'last_payment_date',
                    'subscription_amount',
                    'notification_sent',
                    // QR Code fields
                    'gcash_qr_path',
                    'maya_qr_path'
                ]);
        }

        return DataTables::of($users)
            ->addColumn('full_name', function($user) {
                return $user->firstname . ' ' . ($user->middlename ? $user->middlename . ' ' : '') . $user->lastname;
            })
            ->addColumn('status_badge', function($user) {
                $status_class = $user->status == 1 ? 'badge-success' : 'badge-secondary';
                $status_text = $user->status == 1 ? 'Verified' : 'Not Verified';
                return '<span class="badge '.$status_class.'">'.$status_text.'</span>';
            })
            ->addColumn('subscription_badge', function($user) {
                if (!$user->subscription_type) {
                    return '<span class="badge badge-secondary">No Subscription</span>';
                }
                
                $now = \Carbon\Carbon::now();
                $endDate = $user->subscription_end_date 
                    ? \Carbon\Carbon::parse($user->subscription_end_date)
                    : ($user->last_payment_date 
                        ? \Carbon\Carbon::parse($user->last_payment_date)->addMonth()
                        : null);
                
                if (!$endDate) {
                    return '<span class="badge badge-warning">Unknown</span>';
                }
                
                $daysLeft = $now->diffInDays($endDate, false);
                
                if ($daysLeft < 0) {
                    return '<span class="badge badge-danger">Expired</span>';
                } elseif ($daysLeft <= 7) {
                    return '<span class="badge badge-warning">Expires in '.$daysLeft.' days</span>';
                } else {
                    return '<span class="badge badge-success">Active ('.$user->subscription_type.')</span>';
                }
            })
            ->addColumn('permissions_badge', function($user) {
                $perm_text = match($user->permissions) {
                    0 => 'No Access',
                    1 => 'Can Modify And Delete',
                    2 => 'Can Modify Only',
                    default => 'Unknown'
                };
                return '<span class="badge badge-info">'.$perm_text.'</span>';
            })
            ->addColumn('action', function($user) {
                return '
                    <button type="button" class="btn btn-sm btn-info view-user" data-id="'.$user->id.'">View</button>
                    <button type="button" class="btn btn-sm btn-primary edit-user" data-id="'.$user->id.'">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger delete-user" data-id="'.$user->id.'">Delete</button>
                ';
            })
            ->rawColumns(['status_badge', 'subscription_badge', 'permissions_badge', 'action'])
            ->make(true);
    }

    public function store(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'lastname' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'avatar' => 'nullable|string',
            'type' => 'required|integer',
            'status' => 'required|in:0,1',
            'permissions' => 'required|in:0,1,2',
            'credit' => 'nullable|numeric',
            'office_id' => 'required|integer',
            // Subscription fields
            'subscription_type' => 'nullable|string|in:monthly,yearly,free_trial',
            'subscription_start_date' => 'nullable|date',
            'subscription_end_date' => 'nullable|date',
            'last_payment_date' => 'nullable|date',
            'subscription_amount' => 'nullable|numeric',
            // QR Code validation
            'gcash_qr' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'maya_qr' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->only([
            'firstname', 'middlename', 'lastname', 'username', 'email', 'avatar',
            'type', 'status', 'permissions', 'credit', 'office_id',
            // Subscription fields
            'subscription_type', 'subscription_start_date', 'subscription_end_date',
            'last_payment_date', 'subscription_amount'
        ]);
        $data['firstname'] = strtoupper($data['firstname']);
        $data['middlename'] = strtoupper($data['middlename'] ?? '');
        $data['lastname'] = strtoupper($data['lastname']);
        $data['username'] = strtoupper($data['username']);
        $data['avatar'] = strtoupper($data['avatar'] ?? '');
        $data['password'] = Hash::make($request->password);
        $data['date_added'] = now();

        // Set default subscription dates if subscription type is provided
        if (!empty($data['subscription_type']) && empty($data['subscription_start_date'])) {
            $data['subscription_start_date'] = now();
        }
        if (!empty($data['subscription_type']) && empty($data['subscription_end_date'])) {
            $data['subscription_end_date'] = now()->addMonth(); // Default 1 month for monthly
        }

        // Handle QR Code uploads
        if ($request->hasFile('gcash_qr')) {
            $data['gcash_qr_path'] = $request->file('gcash_qr')->store('qr_codes', 'public');
        }
        if ($request->hasFile('maya_qr')) {
            $data['maya_qr_path'] = $request->file('maya_qr')->store('qr_codes', 'public');
        }

        $user = User::create($data);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'user' => $user
        ]);
    }

    public function show($id)
    {
        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id ?? null;
        
        $userQuery = User::where('id', $id);
        
        if (!$isSuperAdmin) {
            $userQuery->where('office_id', $officeId);
        }
        
        $user = $userQuery->firstOrFail();
        
        // Add full URLs for QR codes
        if ($user->gcash_qr_path) {
            $user->gcash_qr_url = asset('storage/' . $user->gcash_qr_path);
        }
        if ($user->maya_qr_path) {
            $user->maya_qr_url = asset('storage/' . $user->maya_qr_path);
        }
        
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'lastname' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,'.$id,
            'email' => 'required|email|unique:users,email,'.$id,
            'password' => 'nullable|string|min:8',
            'avatar' => 'nullable|string',
            'type' => 'required|integer',
            'status' => 'required|in:0,1',
            'permissions' => 'required|in:0,1,2',
            'credit' => 'nullable|numeric',
            'office_id' => 'nullable|integer',
            // Subscription fields
            'subscription_type' => 'nullable|string|in:monthly,yearly,free_trial',
            'subscription_start_date' => 'nullable|date',
            'subscription_end_date' => 'nullable|date',
            'last_payment_date' => 'nullable|date',
            'subscription_amount' => 'nullable|numeric',
            // QR Code validation
            'gcash_qr' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'maya_qr' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        
        if ($isSuperAdmin) {
            // Superadmin can update any user
            $user = User::findOrFail($id);
        } else {
            $officeId = $user->office_id ?? null;
            $user = User::where('office_id', $officeId)->findOrFail($id);
        }

        $data = $request->only([
            'firstname', 'middlename', 'lastname', 'username', 'email', 'avatar',
            'type', 'status', 'permissions', 'credit', 'office_id',
            // Subscription fields
            'subscription_type', 'subscription_start_date', 'subscription_end_date',
            'last_payment_date', 'subscription_amount'
        ]);
        $data['firstname'] = strtoupper($data['firstname']);
        $data['middlename'] = strtoupper($data['middlename'] ?? '');
        $data['lastname'] = strtoupper($data['lastname']);
        $data['username'] = strtoupper($data['username']);
        $data['avatar'] = strtoupper($data['avatar'] ?? '');
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }
        $data['date_updated'] = now();

        // Reset notification flag if subscription is renewed
        if ($request->filled('last_payment_date')) {
            $data['notification_sent'] = false;
            $data['notification_sent_at'] = null;
        }

        // Handle QR Code uploads
        if ($request->hasFile('gcash_qr')) {
            // Delete old QR code if exists
            if ($user->gcash_qr_path && Storage::disk('public')->exists($user->gcash_qr_path)) {
                Storage::disk('public')->delete($user->gcash_qr_path);
            }
            $data['gcash_qr_path'] = $request->file('gcash_qr')->store('qr_codes', 'public');
        }
        if ($request->hasFile('maya_qr')) {
            // Delete old QR code if exists
            if ($user->maya_qr_path && Storage::disk('public')->exists($user->maya_qr_path)) {
                Storage::disk('public')->delete($user->maya_qr_path);
            }
            $data['maya_qr_path'] = $request->file('maya_qr')->store('qr_codes', 'public');
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        
        if ($isSuperAdmin) {
            // Superadmin can delete any user
            $user = User::findOrFail($id);
        } else {
            $officeId = $user->office_id ?? null;
            $user = User::where('office_id', $officeId)->findOrFail($id);
        }
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }
}
