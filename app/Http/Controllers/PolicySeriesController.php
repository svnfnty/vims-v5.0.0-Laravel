<?php

namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\Series; 

class PolicySeriesController extends Controller
{
    public function index()
    {
        // Return the policy series view
        return view('series.series'); 
    }

    public function getSeries(Request $request)
    {
        $seriesId = $request->query('id');
        if (!$seriesId || !is_numeric($seriesId)) {
            return response()->json(['error' => 'Invalid or missing Series ID'], 400);
        }

        try {
            $seriesData = Series::find($seriesId);
            if (!$seriesData) {
                return response()->json(['error' => 'Series not found'], 404);
            }

            $insuranceData = \DB::table('insurance_list')
                ->join('client_list', 'insurance_list.client_id', '=', 'client_list.id')
                ->select(
                    'insurance_list.coc_no',
                    'insurance_list.registration_no AS plate_no',
                    \DB::raw("CONCAT(client_list.lastname, ', ', client_list.firstname) AS name"),
                    'insurance_list.cost',
                    'insurance_list.policy_status',
                    'insurance_list.registration_date AS date'
                )
                ->whereBetween('insurance_list.coc_no', [$seriesData->range_start, $seriesData->range_stop])
                ->get();

            $allocatedCocs = $insuranceData->pluck('coc_no')->toArray();
            $unallocatedCocs = [];

            for ($coc = $seriesData->range_start; $coc <= $seriesData->range_stop; $coc++) {
                if (!in_array($coc, $allocatedCocs)) {
                    $unallocatedCocs[] = [
                        'coc_no' => $coc,
                        'name' => 'Unallocated',
                        'plate_no' => 'N/A',
                        'cost' => 'N/A',
                        'policy_status' => 'Unallocated',
                        'date' => 'N/A'
                    ];
                }
            }

            $result = $insuranceData->merge($unallocatedCocs);

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred'], 500);
        }
    }
}
