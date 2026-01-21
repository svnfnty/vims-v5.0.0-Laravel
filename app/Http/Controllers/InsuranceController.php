<?php
 
namespace App\Http\Controllers;

use App\Models\Insurance;
use Illuminate\Http\Request;
use DataTables;

class InsuranceController extends Controller
{
    public function index()
    {
        // Return the insurance list view
        return view('insurances.insurance'); // Fixed the view path
    }

    public function data()
    {
        try {
            $insurances = \DB::table('insurance_list')
                ->join('client_list', 'insurance_list.client_id', '=', 'client_list.id')
                ->join('policy_list', 'insurance_list.policy_id', '=', 'policy_list.id')
                ->select(
                    'insurance_list.id',
                    \DB::raw("CONCAT(client_list.firstname, ' ', client_list.middlename, ' ', client_list.lastname) AS client_name"),
                    'policy_list.name AS policy_name', // Fetch the name of the policy
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
                    'insurance_list.remarks'
                )
                ->get();

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
        try {
            $insuranceId = $request->query('id');
            $identifier = $request->query('identifier');

            if ($insuranceId === 'new') {
                // Prepare a blank insurance object for new records
                $insurance = (object) [
                    'mvfile_no' => '',
                    'make' => '',
                    'chassis_no' => '',
                    'engine_no' => '',
                    'coc_no' => '',
                    'policy_no' => '',
                    'or_no' => '',
                    'vehicle_model' => '',
                    'vehicle_color' => '',
                    'registration_date' => ''
                ];

                return view('insurances.manage_insurance', [
                    'insurance' => $insurance,
                    'identifier' => $identifier
                ]);
            }

            if (!$insuranceId || !is_numeric($insuranceId)) {
                \Log::error('Invalid Insurance ID provided', ['insuranceId' => $insuranceId]);
                return response()->json(['error' => 'Invalid or missing Insurance ID'], 400);
            }

            $insurance = \DB::table('insurance_list')
                ->join('client_list', 'insurance_list.client_id', '=', 'client_list.id')
                ->join('policy_list', 'insurance_list.policy_id', '=', 'policy_list.id')
                ->select(
                    'insurance_list.*',
                    \DB::raw("CONCAT(client_list.firstname, ' ', client_list.lastname) AS client_name"),
                    'policy_list.name AS policy_name'
                )
                ->where('insurance_list.id', $insuranceId)
                ->first();

            if (!$insurance) {
                \Log::error('Insurance record not found', ['insuranceId' => $insuranceId]);
                return response()->json(['error' => 'Insurance record not found'], 404);
            }

            return view('insurances.manage_insurance', [
                'insurance' => $insurance,
                'identifier' => $identifier
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in manageInsurance', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'insuranceId' => $request->query('id'),
                'identifier' => $request->query('identifier')
            ]);
            return response()->json(['error' => 'An unexpected error occurred.'], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:client_list,id',
            'policy_id' => 'required|exists:policy_list,id',
            'code' => 'required|unique:insurance_list,code',
            'registration_no' => 'required',
            'chassis_no' => 'required',
            'engine_no' => 'required',
            'vehicle_model' => 'required',
            'vehicle_color' => 'required',
            'registration_date' => 'required|date',
            'expiration_date' => 'required|date|after:registration_date'
        ]);

        $insurance = Insurance::create($request->all());
        
        return response()->json(['success' => true, 'message' => 'Insurance created successfully']);
    }

    public function show($id)
    {
        $insurance = Insurance::with('client')->findOrFail($id);
        return response()->json($insurance);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'client_id' => 'required|exists:client_list,id',
            'policy_id' => 'required|exists:policy_list,id',
            'code' => 'required|unique:insurance_list,code,'.$id,
            'registration_no' => 'required',
            'chassis_no' => 'required',
            'engine_no' => 'required',
            'vehicle_model' => 'required',
            'vehicle_color' => 'required',
            'registration_date' => 'required|date',
            'expiration_date' => 'required|date|after:registration_date'
        ]);

        $insurance = Insurance::findOrFail($id);
        $insurance->update($request->all());
        
        return response()->json(['success' => true, 'message' => 'Insurance updated successfully']);
    }

    public function destroy($id)
    {
        $insurance = Insurance::findOrFail($id);
        $insurance->delete();
        
        return response()->json(['success' => true, 'message' => 'Insurance deleted successfully']);
    }
}
