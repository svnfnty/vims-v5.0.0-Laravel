<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client; 
use App\Models\Insurance; 

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id ?? null;

        if ($isSuperAdmin) {
            $activeClients = Client::count();
            $insuredVehicles = Insurance::where('status', 1)->count();
            $expiredVehicles = Insurance::where('status', 0)->count();
        } else {
            $activeClients = Client::where('office_id', $officeId)->count();
            $insuredVehicles = Insurance::where('office_id', $officeId)->where('status', 1)->count();
            $expiredVehicles = Insurance::where('office_id', $officeId)->where('status', 0)->count();
        }

        return view('dashboard', [
            'activeClients' => $activeClients,
            'insuredVehicles' => $insuredVehicles,
            'expiredVehicles' => $expiredVehicles,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        $user = auth()->user();
        $isSuperAdmin = ($user->id == 1 && $user->office_id == 0);
        $officeId = $user->office_id ?? null;

        $resultsQuery = Insurance::where(function($q) use ($query) {
            $q->where('coc_no', 'LIKE', "%$query%")
              ->orWhere('registration_no', 'LIKE', "%$query%");
        });

        if (!$isSuperAdmin) {
            $resultsQuery->where('office_id', $officeId);
        }

        $results = $resultsQuery->with('client:id,firstname,lastname')
            ->get(['id', 'coc_no', 'registration_no', 'client_id']);

        return response()->json($results);
    }
}
