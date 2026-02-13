<?php

namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use App\Models\SystemInfo;
use App\Models\Office;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Default system values when database is not available
     */
    private const DEFAULT_SYSTEM_NAME = 'VEHICLE INSURANCE MANAGEMENT SYSTEM';
    private const DEFAULT_SYSTEM_SHORTNAME = 'VIMSYS SAAS 2026';
    private const DEFAULT_LOGO = '';
    private const DEFAULT_COVER = '';

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Check if database connection is available and SystemInfo table exists
     */
    private function isDatabaseAvailable(): bool
    {
        try {
            // Check if we can connect to database
            DB::connection()->getPdo();
            
            // Check if SystemInfo table exists
            if (!Schema::hasTable('system_info')) {
                return false;
            }
            
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get system config safely with fallback to defaults
     */
    private function getSystemConfig(string $field, string $default): string
    {
        if (!$this->isDatabaseAvailable()) {
            return $default;
        }

        try {
            return SystemInfo::where('meta_field', $field)->value('meta_value') ?? $default;
        } catch (\Exception $e) {
            return $default;
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Always set forceScheme
        //URL::forceScheme('https');
        
        // Get system info safely - works even when database is not available
        $systemName = $this->getSystemConfig('system_name', self::DEFAULT_SYSTEM_NAME);
        $systemShortName = $this->getSystemConfig('system_shortname', self::DEFAULT_SYSTEM_SHORTNAME);
        $systemLogo = $this->getSystemConfig('logo', self::DEFAULT_LOGO);
        $systemCover = $this->getSystemConfig('cover', self::DEFAULT_COVER);
        
        View::share('systemName', $systemName);
        View::share('systemShortName', $systemShortName);
        View::share('systemLogo', $systemLogo);
        View::share('systemCover', $systemCover);
        
        View::composer('layouts.app', function ($view) {
            $officeName = self::DEFAULT_SYSTEM_NAME;
            
            // Only query if user is logged in AND database is available
            if (!app()->runningInConsole() && auth()->check() && auth()->user()->office_id) {
                try {
                    // Check database availability before querying
                    if (Schema::hasTable('offices')) {
                        $office = Office::find(auth()->user()->office_id);
                        if ($office) {
                            $officeName = $office->office_name;
                        }
                    }
                } catch (\Exception $e) {
                    // Keep default
                }
            }
            
            $view->with('officeName', $officeName);
        });
    }
}
