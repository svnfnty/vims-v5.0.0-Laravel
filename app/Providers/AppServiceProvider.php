<?php

namespace App\Providers;

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
        
        // Skip database initialization during config:cache
        $isConfigCache = app()->runningInConsole() && 
        in_array('config:cache', $_SERVER['argv'] ?? []);

            if ($isConfigCache) {
            // Prevent DB queries
            DB::preventAccessingMissingAttributes();
            return;
            }
            
        //URL::forceScheme('https');

        // Share system info with all views
        $systemName = SystemInfo::where('meta_field', 'system_name')->value('meta_value') ?? 'VIMS';
        $systemShortName = SystemInfo::where('meta_field', 'system_shortname')->value('meta_value') ?? 'SAAS';
        View::share('systemName', $systemName);
        View::share('systemShortName', $systemShortName);

        // Share office name for authenticated users in the layout
        View::composer('layouts.app', function ($view) {
            $officeName = 'VEHICLE INSURANCE MANAGEMENT SYSTEM'; // default
            if (auth()->check() && auth()->user()->office_id) {
                $office = Office::find(auth()->user()->office_id);
                if ($office) {
                    $officeName = $office->office_name;
                }
            }
            $view->with('officeName', $officeName);
        });
    }

}
