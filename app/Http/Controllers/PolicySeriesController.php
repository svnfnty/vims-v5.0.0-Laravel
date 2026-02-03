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

        $officeId = Auth::user()->office_id;
        $newStart = $request->range_start;
        $newStop = $request->range_stop;

        // Check for overlapping or adjacent series
        $overlapping = Series::where('office_id', $officeId)
            ->where(function($query) use ($newStart, $newStop) {
                $query->where('range_start', '<=', $newStop)
                      ->where('range_stop', '>=', $newStart);
            })
            ->orWhere(function($query) use ($newStart, $newStop) {
                $query->where('range_stop', $newStart - 1)
                      ->orWhere('range_start', $newStop + 1);
            })
            ->get();

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
            $series = Series::create([
                'name' => $request->name,
                'range_start' => $request->range_start,
                'range_stop' => $request->range_stop,
                'status' => $request->status,
                'type' => $request->type,
                'office_id' => $officeId,
            ]);

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

        $officeId = Auth::user()->office_id;
        $series = Series::where('office_id', $officeId)->findOrFail($id);
        $officeId = Auth::user()->office_id;
        $newStart = $request->range_start;
        $newStop = $request->range_stop;

        // Check for overlapping or adjacent series, excluding the current one
        $overlapping = Series::where('office_id', $officeId)
            ->where('id', '!=', $id)
            ->where(function($query) use ($newStart, $newStop) {
                $query->where('range_start', '<=', $newStop)
                      ->where('range_stop', '>=', $newStart);
            })
            ->orWhere(function($query) use ($newStart, $newStop) {
                $query->where('range_stop', $newStart - 1)
                      ->orWhere('range_start', $newStop + 1);
            })
            ->get();

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
        $officeId = Auth::user()->office_id;
        $series = Series::where('office_id', $officeId)->findOrFail($id);
        $series->delete();

        return response()->json(['message' => 'Series deleted successfully']);
    }

    public function data()
    {
        $series = Series::where('office_id', Auth::user()->office_id)->get();
        return response()->json(['data' => $series]);
    }

    public function stats()
    {
        $officeId = Auth::user()->office_id;
        $total = Series::where('office_id', $officeId)->count();
        $active = Series::where('office_id', $officeId)->where('status', 1)->count();
        $inactive = Series::where('office_id', $officeId)->where('status', 0)->count();

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
            $officeId = Auth::user()->office_id;
            $seriesData = Series::where('office_id', $officeId)->find($seriesId);
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
