<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\MaintenanceMode;
use Illuminate\Support\Facades\Auth;

class MaintenanceModeMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if maintenance mode is enabled
        if (MaintenanceMode::isEnabled()) {
            $user = Auth::user();
            
            // Allow access only to admin users (id=1 is the main admin)
            $isAdmin = $user && $user->id == 1;
            
            if (!$isAdmin) {
                // Regular users see maintenance page
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'System is under maintenance. Please try again later.',
                        'maintenance' => true
                    ], 503);
                }
                
                return response()->view('errors.maintenance', [
                    'maintenanceMessage' => MaintenanceMode::getStatus()['activity']
                ], 503);
            }
        }

        return $next($request);
    }
}
