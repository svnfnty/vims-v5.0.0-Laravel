<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use DataTables;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return view('user.user');
    }

    public function stats()
    {
        try {
            $officeId = auth()->user()->office_id ?? null;
            if (!$officeId) {
                return response()->json([
                    'total' => 0,
                    'active' => 0,
                    'inactive' => 0,
                ]);
            }
            $stats = [
                'total' => User::where('office_id', $officeId)->count(),
                'active' => User::where('office_id', $officeId)->where('status', 1)->count(),
                'inactive' => User::where('office_id', $officeId)->where('status', 0)->count(),
            ];

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
        $officeId = auth()->user()->office_id ?? null;
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
                'created_at'
            ]);

        return DataTables::of($users)
            ->addColumn('full_name', function($user) {
                return $user->firstname . ' ' . ($user->middlename ? $user->middlename . ' ' : '') . $user->lastname;
            })
            ->addColumn('status_badge', function($user) {
                $status_class = $user->status == 1 ? 'badge-success' : 'badge-secondary';
                $status_text = $user->status == 1 ? 'Verified' : 'Not Verified';
                return '<span class="badge '.$status_class.'">'.$status_text.'</span>';
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
            ->rawColumns(['status_badge', 'permissions_badge', 'action'])
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
        ]);

        $data = $request->only([
            'firstname', 'middlename', 'lastname', 'username', 'email', 'avatar',
            'type', 'status', 'permissions', 'credit', 'office_id'
        ]);
        $data['password'] = Hash::make($request->password);
        $data['date_added'] = now();

        $user = User::create($data);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'user' => $user
        ]);
    }

    public function show($id)
    {
        $officeId = auth()->user()->office_id ?? null;
        $user = User::where('office_id', $officeId)->findOrFail($id);
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
            'office_id' => 'required|integer',
        ]);

        $officeId = auth()->user()->office_id ?? null;
        $user = User::where('office_id', $officeId)->findOrFail($id);

        $data = $request->only([
            'firstname', 'middlename', 'lastname', 'username', 'email', 'avatar',
            'type', 'status', 'permissions', 'credit', 'office_id'
        ]);
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }
        $data['date_updated'] = now();

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    public function destroy($id)
    {
        $officeId = auth()->user()->office_id ?? null;
        $user = User::where('office_id', $officeId)->findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }
}
