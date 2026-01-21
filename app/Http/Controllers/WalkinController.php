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

    public function data()
    {
        $walkins = Walkin::select([
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
            'name' => 'required',
            'contact' => 'required',
            'email' => 'required|email',
            'address' => 'required',
            'vehicle_type' => 'required',
            'plate_number' => 'required',
            'engine_number' => 'required',
            'chassis_number' => 'required',
            'make' => 'required',
            'model' => 'required',
            'color' => 'required',
            'year' => 'required|numeric',
            'service_type' => 'required',
            'amount' => 'required|numeric'
        ]);

        $data = $request->all();
        $data['payment_status'] = $request->has('payment_status') ? 1 : 0;
        $data['status'] = 0; // Pending
        $data['date_created'] = now();

        $walkin = Walkin::create($data);
        
        return response()->json([
            'success' => true, 
            'message' => 'Walk-in client record created successfully',
            'walkin' => $walkin
        ]);
    }

    public function show($id)
    {
        $walkin = Walkin::findOrFail($id);
        return response()->json($walkin);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'contact' => 'required',
            'email' => 'required|email',
            'address' => 'required',
            'vehicle_type' => 'required',
            'plate_number' => 'required',
            'engine_number' => 'required',
            'chassis_number' => 'required',
            'make' => 'required',
            'model' => 'required',
            'color' => 'required',
            'year' => 'required|numeric',
            'service_type' => 'required',
            'amount' => 'required|numeric'
        ]);

        $walkin = Walkin::findOrFail($id);
        $data = $request->all();
        $data['payment_status'] = $request->has('payment_status') ? 1 : 0;
        $data['date_updated'] = now();
        
        $walkin->update($data);
        
        return response()->json([
            'success' => true, 
            'message' => 'Walk-in client record updated successfully',
            'walkin' => $walkin
        ]);
    }

    public function destroy($id)
    {
        $walkin = Walkin::findOrFail($id);
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

        $walkin = Walkin::findOrFail($id);
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
        $walkin = Walkin::findOrFail($id);
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