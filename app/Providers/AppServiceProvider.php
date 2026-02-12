<?php

namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use App\Models\SystemInfo;
use App\Models\Office;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Always set forceScheme
        URL::forceScheme('https');
        
        
        // Get system info from database - only if not in console
        // OR if it's a console command that needs DB (like migrate)
        $systemName = SystemInfo::where('meta_field', 'system_name')->value('meta_value') ?? 'VEHICLE INSURANCE MANAGEMENT SYSTEM';
        $systemShortName = SystemInfo::where('meta_field', 'system_shortname')->value('meta_value') ?? 'VIMSYS SAAS 2026';
        $systemLogo = SystemInfo::where('meta_field', 'logo')->value('meta_value') ?? '';
        $systemCover = SystemInfo::where('meta_field', 'cover')->value('meta_value') ?? '';
        
        View::share('systemName', $systemName);
        View::share('systemShortName', $systemShortName);
        View::share('systemLogo', $systemLogo);
        View::share('systemCover', $systemCover);
        
        View::composer('layouts.app', function ($view) {
            $officeName = 'VEHICLE INSURANCE MANAGEMENT SYSTEM';
            
            // Only query if user is logged in AND we're not in a console command
            if (!app()->runningInConsole() && auth()->check() && auth()->user()->office_id) {
                try {
                    $office = Office::find(auth()->user()->office_id);
                    if ($office) {
                        $officeName = $office->office_name;
                    }
                } catch (\Exception $e) {
                    // Keep default
                }
            }
            
            $view->with('officeName', $officeName);
        });
    }
}