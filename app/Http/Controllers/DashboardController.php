<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client; 
use App\Models\Insurance; 

class DashboardController extends Controller
{
    public function index()
    {
        $activeClients = Client::count();
        $insuredVehicles = Insurance::where('status', 1)->count();
        $expiredVehicles = Insurance::where('status', 0)->count(); 
    
        return view('dashboard', [
            'activeClients' => $activeClients,
            'insuredVehicles' => $insuredVehicles,
            'expiredVehicles' => $expiredVehicles,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        $officeId = auth()->user()->office_id ?? null;

        $results = Insurance::where('office_id', $officeId)
            ->where(function($q) use ($query) {
                $q->where('coc_no', 'LIKE', "%$query%")
                  ->orWhere('registration_no', 'LIKE', "%$query%");
            })
            ->with('client:id,firstname,lastname')
            ->get(['id', 'coc_no', 'registration_no', 'client_id']);

        return response()->json($results);
    }
}

