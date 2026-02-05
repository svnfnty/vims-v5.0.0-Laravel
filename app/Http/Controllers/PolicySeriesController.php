<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Series;
use Illuminate\Support\Facades\Auth;

class PolicySeriesController extends Controller
{
    public function index()
    {
        // Return the policy series view
        return view('series.series');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'range_start' => 'required|integer|min:1',
            'range_stop' => 'required|integer|min:1|gte:range_start',
            'status' => 'required|integer|in:0,1',
            'type' => 'required|integer|in:0,1,3',
        ]);

        $user = Auth::user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id;
        $newStart = $request->range_start;
        $newStop = $request->range_stop;

        // Check for overlapping or adjacent series
        $overlappingQuery = Series::where(function($query) use ($newStart, $newStop) {
            $query->where('range_start', '<=', $newStop)
                  ->where('range_stop', '>=', $newStart);
        })
        ->orWhere(function($query) use ($newStart, $newStop) {
            $query->where('range_stop', $newStart - 1)
                  ->orWhere('range_start', $newStop + 1);
        });
        
        if (!$isSuperAdmin) {
            $overlappingQuery->where('office_id', $officeId);
        }
        
        $overlapping = $overlappingQuery->get();

        if ($overlapping->isNotEmpty()) {
            // Merge: find min start and max stop
            $minStart = min($overlapping->pluck('range_start')->push($newStart)->toArray());
            $maxStop = max($overlapping->pluck('range_stop')->push($newStop)->toArray());

            // Update the first overlapping series
            $series = $overlapping->first();
            $series->update([
                'name' => $request->name,
                'range_start' => $minStart,
                'range_stop' => $maxStop,
                'status' => $request->status,
                'type' => $request->type,
            ]);

            // Delete other overlapping series
            $overlapping->skip(1)->each->delete();

            return response()->json(['message' => 'Series merged and updated successfully', 'data' => $series], 200);
        } else {
            // No overlap, create new
            $seriesData = [
                'name' => $request->name,
                'range_start' => $request->range_start,
                'range_stop' => $request->range_stop,
                'status' => $request->status,
                'type' => $request->type,
            ];
            
            if (!$isSuperAdmin) {
                $seriesData['office_id'] = $officeId;
            }
            
            $series = Series::create($seriesData);

            return response()->json(['message' => 'Series created successfully', 'data' => $series], 201);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'range_start' => 'required|integer|min:1',
            'range_stop' => 'required|integer|min:1|gte:range_start',
            'status' => 'required|integer|in:0,1',
            'type' => 'required|integer|in:0,1,3',
        ]);

        $user = Auth::user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id;
        
        $seriesQuery = Series::where('id', $id);
        
        if (!$isSuperAdmin) {
            $seriesQuery->where('office_id', $officeId);
        }
        
        $series = $seriesQuery->firstOrFail();
        $newStart = $request->range_start;
        $newStop = $request->range_stop;

        // Check for overlapping or adjacent series, excluding the current one
        $overlappingQuery = Series::where('id', '!=', $id)
            ->where(function($query) use ($newStart, $newStop) {
                $query->where('range_start', '<=', $newStop)
                      ->where('range_stop', '>=', $newStart);
            })
            ->orWhere(function($query) use ($newStart, $newStop) {
                $query->where('range_stop', $newStart - 1)
                      ->orWhere('range_start', $newStop + 1);
            });
            
        if (!$isSuperAdmin) {
            $overlappingQuery->where('office_id', $officeId);
        }
        
        $overlapping = $overlappingQuery->get();

        if ($overlapping->isNotEmpty()) {
            // Merge: find min start and max stop, including the new range
            $minStart = min($overlapping->pluck('range_start')->push($newStart)->toArray());
            $maxStop = max($overlapping->pluck('range_stop')->push($newStop)->toArray());

            // Update the current series with merged range
            $series->update([
                'name' => $request->name,
                'range_start' => $minStart,
                'range_stop' => $maxStop,
                'status' => $request->status,
                'type' => $request->type,
            ]);

            // Delete other overlapping series
            $overlapping->each->delete();

            return response()->json(['message' => 'Series merged and updated successfully', 'data' => $series]);
        } else {
            // No overlap, just update
            $series->update([
                'name' => $request->name,
                'range_start' => $request->range_start,
                'range_stop' => $request->range_stop,
                'status' => $request->status,
                'type' => $request->type,
            ]);

            return response()->json(['message' => 'Series updated successfully', 'data' => $series]);
        }
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id;
        
        $seriesQuery = Series::where('id', $id);
        
        if (!$isSuperAdmin) {
            $seriesQuery->where('office_id', $officeId);
        }
        
        $series = $seriesQuery->firstOrFail();
        $series->delete();

        return response()->json(['message' => 'Series deleted successfully']);
    }

    public function data()
    {
        $user = Auth::user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        
        $seriesQuery = Series::query();
        
        if (!$isSuperAdmin) {
            $seriesQuery->where('office_id', $user->office_id);
        }
        
        $series = $seriesQuery->get();
        return response()->json(['data' => $series]);
    }

    public function stats()
    {
        $user = Auth::user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id;
        
        if ($isSuperAdmin) {
            $total = Series::count();
            $active = Series::where('status', 1)->count();
            $inactive = Series::where('status', 0)->count();
        } else {
            $total = Series::where('office_id', $officeId)->count();
            $active = Series::where('office_id', $officeId)->where('status', 1)->count();
            $inactive = Series::where('office_id', $officeId)->where('status', 0)->count();
        }

        return response()->json([
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive,
        ]);
    }

    public function getSeries(Request $request)
    {
        $seriesId = $request->query('id');
        if (!$seriesId || !is_numeric($seriesId)) {
            return response()->json(['error' => 'Invalid or missing Series ID'], 400);
        }

        try {
            $user = Auth::user();
            $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
            $officeId = $user->office_id;
            
            $seriesQuery = Series::where('id', $seriesId);
            
            if (!$isSuperAdmin) {
                $seriesQuery->where('office_id', $officeId);
            }
            
            $seriesData = $seriesQuery->first();
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
