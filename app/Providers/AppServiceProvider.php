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
         // Skip during config cache
         if (app()->runningInConsole() && in_array('config:cache', $_SERVER['argv'] ?? [])) {
             return;
         }
         
         URL::forceScheme('https');
     
         // Use environment variables instead of database
         $systemName = env('APP_NAME', 'VIMS');
         $systemShortName = env('APP_SHORT_NAME', 'SAAS');
         
         View::share('systemName', $systemName);
         View::share('systemShortName', $systemShortName);
     
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
