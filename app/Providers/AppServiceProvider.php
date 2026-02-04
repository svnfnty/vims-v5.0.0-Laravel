<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use App\Models\SystemInfo;

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
        //URL::forceScheme('https');

        // Share system info with all views
        $systemName = SystemInfo::where('meta_field', 'system_name')->value('meta_value') ?? 'VIMS';
        $systemShortName = SystemInfo::where('meta_field', 'system_shortname')->value('meta_value') ?? 'SAAS';
        View::share('systemName', $systemName);
        View::share('systemShortName', $systemShortName);
    }

}
