<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckSubscriptionPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        if ($user && $user->permissions === 0) {
            // User has no permissions - check if this is a write operation
            $isWriteOperation = in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE']);
            
            // Check if user is trying to access create/update/delete routes
            $isRestrictedRoute = $this->isRestrictedRoute($request);
            
            if ($isWriteOperation || $isRestrictedRoute) {
                // Return subscription renewal required response
                if ($request->expectsJson() || $request->ajax()) {
                    return response()->json([
                        'success' => false,
                        'subscription_expired' => true,
                        'message' => 'Your subscription has expired. Please renew your subscription to continue using this feature.',
                        'title' => 'Subscription Required',
                        'type' => 'error',
                        'renewal_url' => route('account.setting') // Or your payment/renewal page
                    ], 403);
                }
                
                // For regular requests, redirect with error
                return redirect()->back()->with('error', 'Your subscription has expired. Please renew to continue.');
            }
        }

        return $next($request);
    }
    
    /**
     * Check if the current route is restricted for users with no permissions
     */
    protected function isRestrictedRoute(Request $request): bool
    {
        $restrictedPatterns = [
            '*/store',
            '*/create',
            '*/update',
            '*/destroy',
            '*/delete',
            '*/edit',
            '*/clients/*',
            '*/insurances/*',
            '*/applications/*',
            '*/policies/*',
            '*/walkin/*',
            '*/users/*',
            '*/category/*',
            '*/series/*',
            '*/office/*',
        ];
        
        $path = $request->path();
        
        foreach ($restrictedPatterns as $pattern) {
            // Convert wildcard pattern to regex
            $regex = '#^' . str_replace('*', '.*', $pattern) . '$#';
            if (preg_match($regex, $path)) {
                return true;
            }
        }
        
        return false;
    }
}
