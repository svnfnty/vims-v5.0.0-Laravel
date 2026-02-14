<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Request;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\InsuranceController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\PolicySeriesController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\WalkinController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\ChatbotController;
use App\Models\SystemInfo;
use App\Http\Middleware\MaintenanceModeMiddleware;

// Helper function to safely get system config with database availability check
function getSystemConfigSafe(string $field, string $default): string {
    try {
        // Check if we can connect to database
        DB::connection()->getPdo();
        
        // Check if SystemInfo table exists
        if (!Schema::hasTable('system_info')) {
            return $default;
        }
        
        return SystemInfo::where('meta_field', $field)->value('meta_value') ?? $default;
    } catch (\Exception $e) {
        return $default;
    }
}

Route::get('/login', function () {
    $systemName = getSystemConfigSafe('system_name', 'VEHICLE INSURANCE MANAGEMENT SYSTEM');
    $systemShortName = getSystemConfigSafe('system_shortname', 'VIMSYS SAAS 2026');
    $systemLogo = getSystemConfigSafe('logo', '');
    $systemCover = getSystemConfigSafe('cover', '');
    return view('auth.login', compact('systemName', 'systemShortName', 'systemLogo', 'systemCover'));
})->name('login')->middleware('guest');

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
        $request->session()->regenerate();
        
        // Check subscription status
        $user = Auth::user();
        $subscriptionMessage = null;
        $subscriptionAlert = null;
        
        if ($user->subscription_type) {
            $now = \Carbon\Carbon::now();
            $endDate = $user->subscription_end_date 
                ? \Carbon\Carbon::parse($user->subscription_end_date)
                : ($user->last_payment_date 
                    ? \Carbon\Carbon::parse($user->last_payment_date)->addMonth()
                    : null);
            
            if ($endDate) {
                $daysLeft = $now->diffInDays($endDate, false);
                
                if ($daysLeft < 0) {
                    // Subscription expired
                    $subscriptionAlert = 'Your subscription has expired. Please renew to continue using all features.';
                    $user->update(['status' => 0]);
                } elseif ($daysLeft <= 7) {
                    // Subscription expiring soon
                    $subscriptionMessage = "Your subscription expires in {$daysLeft} day(s). Please renew soon to avoid interruption.";
                }
            }
        }
        
        // Store messages in session
        if ($subscriptionMessage) {
            session()->flash('subscription_warning', $subscriptionMessage);
        }
        if ($subscriptionAlert) {
            session()->flash('subscription_alert', $subscriptionAlert);
        }
        
        return redirect()->intended(route('dashboard'));
    }

    return back()->withErrors([
        'email' => 'The provided credentials do not match our records.',
    ])->withInput();
})->middleware('guest')->name('login.post');

Route::post('/logout', function () {
    Auth::logout();
    return redirect('/login');
})->name('logout');

Route::middleware(['auth', MaintenanceModeMiddleware::class])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/search', [DashboardController::class, 'search'])->name('dashboard.search');

    // Client Routes
    Route::group(['prefix' => 'clients', 'middleware' => 'check.subscription'], function () {
        Route::get('/', [ClientController::class, 'index'])->name('clients.index');
        Route::post('/', [ClientController::class, 'store'])->name('clients.store');
        Route::get('/data', [ClientController::class, 'data'])->name('clients.data');
        Route::get('/stats', [ClientController::class, 'stats'])->name('clients.stats');
        Route::put('/{id}', [ClientController::class, 'update'])->name('clients.update');
        Route::delete('/{id}', [ClientController::class, 'destroy'])->name('clients.destroy');
    });

    // Category Routes
    Route::group(['prefix' => 'category'], function () {
        Route::get('/', [CategoryController::class, 'index'])->name('category.index');
        Route::post('/', [CategoryController::class, 'store'])->name('category.store');
        Route::get('/data', [CategoryController::class, 'data'])->name('category.data');
        Route::get('/stats', [CategoryController::class, 'stats'])->name('category.stats');
        Route::put('/{id}', [CategoryController::class, 'update'])->name('category.update');
        Route::delete('/{id}', [CategoryController::class, 'destroy'])->name('category.destroy');
    });

    // Insurance Routes
    Route::group(['prefix' => 'insurances', 'middleware' => 'check.subscription'], function () {
        Route::get('/', [InsuranceController::class, 'index'])->name('insurances.index');
        Route::get('/data', [InsuranceController::class, 'data'])->name('insurance.data');
        Route::get('/manage_insurance', [InsuranceController::class, 'manageInsurance'])->name('insurance.manageInsurance');
        Route::get('/next-code', [InsuranceController::class, 'getNextCode'])->name('insurance.nextCode');
        Route::get('/{id}', [InsuranceController::class, 'show'])->name('insurance.show');
        Route::post('/', [InsuranceController::class, 'store'])->name('insurance.store');
        Route::put('/{id}', [InsuranceController::class, 'update'])->name('insurance.update');
        Route::delete('/{id}', [InsuranceController::class, 'destroy'])->name('insurance.destroy');
    });

    // Insurance Validation Routes (keep these as standalone since they're POST)
    Route::post('/insurance/validate-coc', [InsuranceController::class, 'validateCoc'])->name('insurance.validateCoc');
    Route::post('/insurance/validate-mvfile', [InsuranceController::class, 'validateMvFile'])->name('insurance.validateMvFile');

    // Other Routes
    Route::get('/application', [ApplicationController::class, 'form'])->name('application.form');

    // Series Routes
    Route::group(['prefix' => 'series'], function () {
        Route::get('/', [PolicySeriesController::class, 'index'])->name('policy.series');
        Route::post('/', [PolicySeriesController::class, 'store'])->name('series.store');
        Route::get('/data', [PolicySeriesController::class, 'data'])->name('series.data');
        Route::get('/stats', [PolicySeriesController::class, 'stats'])->name('series.stats');
        Route::put('/{id}', [PolicySeriesController::class, 'update'])->name('series.update');
        Route::delete('/{id}', [PolicySeriesController::class, 'destroy'])->name('series.destroy');
    });

    Route::get('/series/api/getseries', [PolicySeriesController::class, 'getSeries'])->name('series.api.getseries');
    Route::get('/categories', [CategoryController::class, 'getAll'])->name('categories.all');
    // Policy Routes
    Route::group(['prefix' => 'policies', 'middleware' => 'check.subscription'], function () {
        Route::get('/', [PolicyController::class, 'index'])->name('policies.index');
        Route::post('/', [PolicyController::class, 'store'])->name('policies.store');
        Route::get('/data', [PolicyController::class, 'data'])->name('policies.data');
        Route::get('/stats', [PolicyController::class, 'stats'])->name('policies.stats');
        Route::put('/{id}', [PolicyController::class, 'update'])->name('policies.update');
        Route::delete('/{id}', [PolicyController::class, 'destroy'])->name('policies.destroy');
    });
    // Walkin Routes
    Route::group(['prefix' => 'walkin', 'middleware' => 'check.subscription'], function () {
        Route::get('/', [WalkinController::class, 'index'])->name('walkin.index');
        Route::post('/', [WalkinController::class, 'store'])->name('walkin.store');
        Route::get('/data', [WalkinController::class, 'data'])->name('walkin.data');
        Route::get('/stats', [WalkinController::class, 'stats'])->name('walkin.stats');
        Route::put('/{id}', [WalkinController::class, 'update'])->name('walkin.update');
        Route::delete('/{id}', [WalkinController::class, 'destroy'])->name('walkin.destroy');
    });

    // Office Routes
    Route::group(['prefix' => 'office', 'middleware' => 'check.subscription'], function () {
        Route::get('/', [OfficeController::class, 'index'])->name('office.index');
        Route::post('/', [OfficeController::class, 'store'])->name('office.store');
        Route::get('/data', [OfficeController::class, 'data'])->name('office.data');
        Route::get('/stats', [OfficeController::class, 'stats'])->name('office.stats');
        Route::get('/{id}', [OfficeController::class, 'show'])->name('office.show');
        Route::put('/{id}', [OfficeController::class, 'update'])->name('office.update');
        Route::delete('/{id}', [OfficeController::class, 'destroy'])->name('office.destroy');
    });
    // User Routes
    Route::group(['prefix' => 'users', 'middleware' => 'check.subscription'], function () {
        Route::get('/', [UserController::class, 'index'])->name('users.index');
        Route::post('/', [UserController::class, 'store'])->name('users.store');
        Route::get('/data', [UserController::class, 'data'])->name('users.data');
        Route::get('/stats', [UserController::class, 'stats'])->name('users.stats');
        Route::get('/{id}', [UserController::class, 'show'])->name('users.show');
        Route::put('/{id}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/{id}', [UserController::class, 'destroy'])->name('users.destroy');
    });

    // Account Routes
    Route::get('/account/setting', [AccountController::class, 'setting'])->name('account.setting');
    Route::put('/account/setting', [AccountController::class, 'update'])->name('account.update');
    
    // Payment Routes
    Route::post('/account/payment', [AccountController::class, 'processPayment'])->name('account.payment');
    Route::get('/account/payment/history', [AccountController::class, 'paymentHistory'])->name('account.payment.history');
    Route::get('/account/payment/amount', [AccountController::class, 'getSubscriptionAmount'])->name('account.payment.amount');
    
    // Payment Proof Image Route
    Route::get('/account/payment/proof/{payment}', [AccountController::class, 'viewPaymentProof'])->name('account.payment.proof');
    
    // Admin Payment Management Routes (Admin only: id=1, office_id=0)
    Route::get('/admin/payments', [AccountController::class, 'adminPayments'])->name('admin.payments');
    Route::post('/admin/payments/{payment}/approve', [AccountController::class, 'approvePayment'])->name('admin.payments.approve');
    Route::post('/admin/payments/{payment}/reject', [AccountController::class, 'rejectPayment'])->name('admin.payments.reject');

    // System Settings Routes
    Route::get('/system/settings', [SettingsController::class, 'index'])->name('system.settings');
    Route::put('/system/settings', [SettingsController::class, 'update'])->name('system.settings.update');
    
    // Maintenance Mode Toggle Route (Admin only)
    Route::post('/system/maintenance/toggle', [SettingsController::class, 'toggleMaintenance'])->name('system.maintenance.toggle');

    // Chatbot Routes
    Route::get('/chatbot', [ChatbotController::class, 'index'])->name('chatbot.index');
    Route::post('/chatbot/chat', [ChatbotController::class, 'chat'])->name('chatbot.chat');
    Route::get('/chatbot/models', [ChatbotController::class, 'getModels'])->name('chatbot.models');
    Route::get('/chatbot/history', [ChatbotController::class, 'getHistory'])->name('chatbot.history');
    Route::post('/chatbot/clear', [ChatbotController::class, 'clearHistory'])->name('chatbot.clear');

    // Chatbot Session Management Routes
    Route::get('/chatbot/sessions', [ChatbotController::class, 'getUserSessions'])->name('chatbot.sessions');
    Route::delete('/chatbot/sessions/{session_id}', [ChatbotController::class, 'deleteSession'])->name('chatbot.sessions.delete');
});

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return view('welcome', ['wrapperClass' => 'table-responsive']);
})->name('welcome');
