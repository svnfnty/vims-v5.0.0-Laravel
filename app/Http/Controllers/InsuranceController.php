<?php
 
namespace App\Http\Controllers;

use App\Models\Insurance;
use App\Models\Client;
use App\Models\Policy;
use App\Models\Category;
use App\Models\Walkin;
use Illuminate\Http\Request;
use DataTables;

class InsuranceController extends Controller
{
    public function index() {
        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $userOfficeId = $user->office_id ?? null;
        
        $clientsQuery = Client::select('id', 'lastname', 'firstname', 'middlename')
            ->where('delete_flag', '!=', 1);
            
        if (!$isSuperAdmin) {
            $clientsQuery->where('office_id', $userOfficeId);
        }
        
        $clients = $clientsQuery->get();
        $policies = Policy::select('id', 'name', 'code')->get();
        $categories = Category::select('id', 'name', 'code')->get();
        return view('insurances.insurance', compact('clients', 'policies', 'categories'));
    }

    public function data() {
        try {
            $user = auth()->user();
            $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
            $officeId = $user->office_id ?? null;
            
            $insurancesQuery = \DB::table('insurance_list')
                ->join('client_list', 'insurance_list.client_id', '=', 'client_list.id')
                ->join('policy_list', 'insurance_list.policy_id', '=', 'policy_list.id')
                ->leftJoin('category_list', 'insurance_list.auth_no', '=', 'category_list.id') // Join with category_list
                ->leftJoin('office_list', 'insurance_list.office_id', '=', 'office_list.id') // Join with office_list
                ->select(
                    'insurance_list.id',
                    'insurance_list.office_id',
                    \DB::raw("CONCAT(client_list.firstname, ' ', client_list.middlename, ' ', client_list.lastname) AS client_name"),
                    'policy_list.name AS policy_name',
                    'insurance_list.code',
                    'insurance_list.registration_no',
                    'insurance_list.chassis_no',
                    'insurance_list.engine_no',
                    'insurance_list.vehicle_model',
                    'insurance_list.vehicle_color',
                    'insurance_list.registration_date',
                    'insurance_list.expiration_date',
                    'insurance_list.cost',
                    'insurance_list.new',
                    'insurance_list.make',
                    'insurance_list.or_no',
                    'insurance_list.coc_no',
                    'insurance_list.policy_no',
                    'insurance_list.mvfile_no',
                    'insurance_list.auth_no',
                    'insurance_list.auth_renewal',
                    'insurance_list.status',
                    'insurance_list.remarks',
                    'category_list.name AS category_name', // Add category name to the result
                    'office_list.office_name AS office_name' // Add office name to the result
                );
                
            if (!$isSuperAdmin) {
                $insurancesQuery->where('insurance_list.office_id', $officeId);
            }
            
            $insurances = $insurancesQuery->get();
            return response()->json(['data' => $insurances]);
        } catch (\Exception $e) {
            \Log::error('Error fetching insurance data', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch insurance data.'], 500);
        }
    }

    public function validateCoc(Request $request)
    {
        $cocNo = $request->input('coc_no');

        // Check if the COC Number exists in the insurance table
        $exists = Insurance::where('coc_no', $cocNo)->exists();

        // Check if the COC Number falls within the range in the series table
        $inRange = \DB::table('series')
            ->where('range_start', '<=', $cocNo)
            ->where('range_stop', '>=', $cocNo)
            ->exists();

        if (!$inRange) {
            return response()->json(['valid' => false, 'message' => 'COC Number is out of range.']);
        }

        return response()->json(['valid' => !$exists, 'message' => $exists ? 'COC Number is already used.' : 'COC Number is available.']);
    }

    public function validateMvFile(Request $request)
    {
        $mvFileNo = $request->input('mvfile_no');

        // Check if the MV File Number exists in the insurance table
        $record = \DB::table('insurance_list')
            ->join('client_list', 'insurance_list.client_id', '=', 'client_list.id')
            ->join('policy_list', 'insurance_list.policy_id', '=', 'policy_list.id')
            ->select(
                'insurance_list.id AS insurance_id',
                'insurance_list.client_id',
                'insurance_list.policy_id',
                'policy_list.name AS policy_name',
                'insurance_list.code AS insurance_code',
                'insurance_list.document_path',
                'insurance_list.registration_no',
                'insurance_list.chassis_no',
                'insurance_list.engine_no',
                'insurance_list.vehicle_model',
                'insurance_list.vehicle_color',
                'insurance_list.registration_date',
                'insurance_list.expiration_date',
                'insurance_list.cost',
                'insurance_list.new',
                'insurance_list.make',
                'insurance_list.or_no',
                'insurance_list.coc_no',
                'insurance_list.policy_no',
                'insurance_list.mvfile_no',
                'insurance_list.auth_no',
                'insurance_list.auth_renewal',
                'insurance_list.status AS insurance_status',
                'insurance_list.date_created AS insurance_date_created',
                'insurance_list.date_updated AS insurance_date_updated',
                'insurance_list.image AS insurance_image',
                'insurance_list.policy_status',
                'insurance_list.policy_daterelease',
                'insurance_list.official_datereleased',
                'insurance_list.payment',
                'insurance_list.rsu',
                'insurance_list.remarks AS insurance_remarks',
                'insurance_list.office_id AS insurance_office_id',
                'client_list.id AS client_id',
                'client_list.code AS client_code',
                'client_list.firstname',
                'client_list.middlename',
                'client_list.lastname',
                'client_list.markup',
                'client_list.dob',
                'client_list.contact',
                'client_list.email',
                'client_list.address',
                'client_list.image_path',
                'client_list.status AS client_status',
                'client_list.delete_flag',
                'client_list.date_created AS client_date_created',
                'client_list.date_updated AS client_date_updated',
                'client_list.office_id AS client_office_id'
            )
            ->where('insurance_list.mvfile_no', $mvFileNo)
            ->first();

        if ($record) {
            return response()->json(['exists' => true, 'record' => $record]);
        }

        return response()->json(['exists' => false, 'message' => 'MV File Number does not exist.']);
    }

    public function manageInsurance(Request $request)
    {
        $id = $request->input('id');
        if ($id) {
            $insurance = Insurance::with('client', 'policy')->findOrFail($id);
            // Return the insurance data with category info
            return response()->json([
                'insurance' => $insurance,
                'categories' => Category::select('id', 'name', 'code')->get() // Fixed variable name
            ]);
        }
        return response()->json(['error' => 'Insurance not found'], 404);
    }

    public function store(Request $request) {
        $request->validate([
            'mvfile_no' => 'required',
            'coc_no' => 'required',
            'client_id' => 'required|exists:client_list,id',
            'policy_id' => 'required|exists:policy_list,id',
            'category_id' => 'required|exists:category_list,id',
            'registration_no' => 'required',
            'chassis_no' => 'required',
            'engine_no' => 'required',
            'vehicle_model' => 'required',
            'vehicle_color' => 'required',
            'make' => 'required',
            'registration_date' => 'required|date',
            'expiration_date' => 'required|date|after:registration_date',
            'status' => 'required|in:0,1',
        ]);

        // Check if mvfile_no already exists
        if (Insurance::where('mvfile_no', $request->mvfile_no)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'MVR already found on records cannot issued duplicate not allowed'
            ], 422);
        }

        // Check if coc_no already exists
        if (Insurance::where('coc_no', $request->coc_no)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Duplicate COC Number. Cannot issued twice'
            ], 422);
        }

        // Get the office_id from the authenticated user
        $officeId = auth()->user()->office_id ?? null;
        // Get the policy cost from policy_list table
        $policy = Policy::select('cost')->findOrFail($request->policy_id);
        $policyCost = $policy->cost;
        
        $currentYearMonth = date('Ym');
        $lastInsurance = Insurance::where('code', 'LIKE', $currentYearMonth . '-%')
            ->orderBy('code', 'desc')
            ->first();
        if ($lastInsurance) {
            $lastCode = $lastInsurance->code;
            $sequence = (int)substr($lastCode, -4) + 1;
        } else {
            $sequence = 1;
        }
        $newCode = $currentYearMonth . '-' . str_pad($sequence, 4, '0', STR_PAD_LEFT);
      

        $insurance = Insurance::create([
            'client_id' => $request->client_id,
            'policy_id' => $request->policy_id,
            'code' => $newCode,
            'registration_no' => $request->registration_no,
            'chassis_no' => $request->chassis_no,
            'engine_no' => $request->engine_no,
            'vehicle_model' => $request->vehicle_model,
            'vehicle_color' => $request->vehicle_color,
            'registration_date' => $request->registration_date,
            'expiration_date' => $request->expiration_date,
            'cost' => $policyCost,
            'make' => $request->make,
            'or_no' => $request->or_no,
            'coc_no' => $request->coc_no,
            'policy_no' => $request->policy_no,
            'mvfile_no' => $request->mvfile_no,
            'auth_no' => $request->category_id, //intentional mapping
            'auth_renewal' => 0,
            'status' => $request->status,
            'remarks' => $request->remarks,
            'office_id' => $officeId, 
            'date_created' => now(),
            'date_updated' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Insurance created successfully',
            'insurance' => $insurance
        ]);
    }

    public function update(Request $request, $id) {
        $insurance = Insurance::findOrFail($id);
        $request->validate([
            'mvfile_no' => 'required',
            'coc_no' => 'required',
            'client_id' => 'required|exists:client_list,id',
            'policy_id' => 'required|exists:policy_list,id',
            'category_id' => 'required|exists:category_list,id',
            'registration_no' => 'required',
            'chassis_no' => 'required',
            'engine_no' => 'required',
            'vehicle_model' => 'required',
            'vehicle_color' => 'required',
            'make' => 'required',
            'registration_date' => 'required|date',
            'expiration_date' => 'required|date|after:registration_date',
            'status' => 'required|in:0,1',
        ]);

        // Get the office_id from the authenticated user
        $officeId = auth()->user()->office_id ?? null;

        // Get the policy cost from policy_list table
        $policy = Policy::select('cost')->findOrFail($request->policy_id);
        $policyCost = $policy->cost;

        $insurance->update([
            'client_id' => $request->client_id,
            'policy_id' => $request->policy_id,
            'registration_no' => $request->registration_no,
            'chassis_no' => $request->chassis_no,
            'engine_no' => $request->engine_no,
            'vehicle_model' => $request->vehicle_model,
            'vehicle_color' => $request->vehicle_color,
            'registration_date' => $request->registration_date,
            'expiration_date' => $request->expiration_date,
            'cost' => $policyCost,
            'make' => $request->make,
            'or_no' => $request->or_no,
            'coc_no' => $request->coc_no,
            'policy_no' => $request->policy_no,
            'mvfile_no' => $request->mvfile_no,
            'auth_no' => $request->category_id,
            'status' => $request->status,
            'remarks' => $request->remarks,
            'office_id' => $officeId, // Update with the current user's office_id
            'date_updated' => now(),
        ]);

        // Check if this is an AJAX request
        if ($request->ajax() || $request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Insurance updated successfully',
                'insurance' => $insurance
            ]);
        }

        // For regular form submissions, redirect back with success message
        return redirect()->back()->with('success', 'Insurance updated successfully');
    }


    public function show($id) {
        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id ?? null;
        
        $insuranceQuery = Insurance::with('client', 'policy')->where('id', $id);
        
        if (!$isSuperAdmin) {
            $insuranceQuery->where('office_id', $officeId);
        }
        
        $insurance = $insuranceQuery->firstOrFail();

        // Compare client's markup with walkin_list name column
        $legendColor = null;
        if ($insurance->client && $insurance->client->markup) {
            $walkinQuery = Walkin::where('name', $insurance->client->markup)
                            ->where('delete_flag', 0);
                            
            if (!$isSuperAdmin) {
                $walkinQuery->where('office_id', $officeId);
            }
            
            $walkin = $walkinQuery->first();
            if ($walkin) {
                $legendColor = $walkin->color;
            }
        }

        return view('insurances.view', compact('insurance', 'legendColor'));
    }

    public function destroy($id) {
        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id ?? null;
        
        $insuranceQuery = Insurance::where('id', $id);
        
        if (!$isSuperAdmin) {
            $insuranceQuery->where('office_id', $officeId);
        }
        
        $insurance = $insuranceQuery->firstOrFail();
        $insurance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Insurance record deleted successfully'
        ]);
    }

}
