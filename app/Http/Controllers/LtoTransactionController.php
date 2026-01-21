<?php

namespace App\Http\Controllers;

use App\Models\LtoTransaction;
use App\Models\Client;
use Illuminate\Http\Request;
use DataTables;

class LtoTransactionController extends Controller
{
    public function index()
    {
        $clients = Client::all();
        return view('lto.index', compact('clients'));
    }

    public function data()
    {
        $transactions = LtoTransaction::with('client')->select([
            'lto_transactions.*',
            \DB::raw('DATE_FORMAT(date_created, "%Y-%m-%d") as formatted_date')
        ]);

        return DataTables::of($transactions)
            ->addColumn('client_name', function($transaction) {
                return $transaction->client ? 
                    $transaction->client->firstname . ' ' . $transaction->client->lastname : 'N/A';
            })
            ->addColumn('status_badge', function($transaction) {
                $status_class = match($transaction->status) {
                    0 => 'badge-secondary',
                    1 => 'badge-success',
                    2 => 'badge-danger',
                    default => 'badge-info'
                };
                $status_text = match($transaction->status) {
                    0 => 'Pending',
                    1 => 'Completed',
                    2 => 'Cancelled',
                    default => 'Unknown'
                };
                return '<span class="badge '.$status_class.'">'.$status_text.'</span>';
            })
            ->addColumn('action', function($transaction) {
                return '
                    <button type="button" class="btn btn-sm btn-info view-transaction" data-id="'.$transaction->id.'">View</button>
                    <button type="button" class="btn btn-sm btn-primary edit-transaction" data-id="'.$transaction->id.'">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger delete-transaction" data-id="'.$transaction->id.'">Delete</button>
                ';
            })
            ->rawColumns(['status_badge', 'action'])
            ->make(true);
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:client_list,id',
            'transaction_type' => 'required',
            'vehicle_type' => 'required',
            'plate_number' => 'required',
            'engine_number' => 'required',
            'chassis_number' => 'required',
            'make' => 'required',
            'series' => 'required',
            'body_type' => 'required',
            'year_model' => 'required',
            'amount' => 'required|numeric',
            'or_number' => 'required|unique:lto_transactions,or_number',
            'cr_number' => 'required|unique:lto_transactions,cr_number'
        ]);

        $data = $request->all();
        $data['status'] = 0; // Pending
        $data['date_created'] = now();

        $transaction = LtoTransaction::create($data);
        
        return response()->json([
            'success' => true, 
            'message' => 'LTO Transaction created successfully',
            'transaction' => $transaction
        ]);
    }

    public function show($id)
    {
        $transaction = LtoTransaction::with('client')->findOrFail($id);
        return response()->json($transaction);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'client_id' => 'required|exists:client_list,id',
            'transaction_type' => 'required',
            'vehicle_type' => 'required',
            'plate_number' => 'required',
            'engine_number' => 'required',
            'chassis_number' => 'required',
            'make' => 'required',
            'series' => 'required',
            'body_type' => 'required',
            'year_model' => 'required',
            'amount' => 'required|numeric',
            'or_number' => 'required|unique:lto_transactions,or_number,'.$id,
            'cr_number' => 'required|unique:lto_transactions,cr_number,'.$id
        ]);

        $transaction = LtoTransaction::findOrFail($id);
        $data = $request->all();
        $data['date_updated'] = now();
        
        $transaction->update($data);
        
        return response()->json([
            'success' => true, 
            'message' => 'LTO Transaction updated successfully',
            'transaction' => $transaction
        ]);
    }

    public function destroy($id)
    {
        $transaction = LtoTransaction::findOrFail($id);
        $transaction->delete();
        
        return response()->json([
            'success' => true, 
            'message' => 'LTO Transaction deleted successfully'
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:0,1,2',
            'remarks' => 'required_if:status,2'
        ]);

        $transaction = LtoTransaction::findOrFail($id);
        $transaction->status = $request->status;
        $transaction->remarks = $request->remarks;
        $transaction->date_updated = now();
        $transaction->save();

        $status_text = match($request->status) {
            0 => 'marked as pending',
            1 => 'marked as completed',
            2 => 'cancelled',
            default => 'updated'
        };

        return response()->json([
            'success' => true,
            'message' => "LTO Transaction {$status_text} successfully"
        ]);
    }
}