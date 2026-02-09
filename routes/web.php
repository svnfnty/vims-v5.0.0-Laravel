<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\InsuranceController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\PolicySeriesController;
use App\Http\Controllers\UsageHistoryController;
use App\Http\Controllers\LTOTransactionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\WalkinController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\ActivityController;
use App\Models\SystemInfo;

Route::get('/login', function () {
    $systemName = SystemInfo::where('meta_field', 'system_name')->value('meta_value') ?? 'VEHICLE INSURANCE MANAGEMENT SYSTEM';
    $systemShortName = SystemInfo::where('meta_field', 'system_shortname')->value('meta_value') ?? 'VIMSYS SAAS 2026';
    return view('auth.login', compact('systemName', 'systemShortName'));
})->name('login')->middleware('guest');

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
        $request->session()->regenerate();
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

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/search', [DashboardController::class, 'search'])->name('dashboard.search');

    // Client Routes
    Route::group(['prefix' => 'clients'], function () {
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
    Route::group(['prefix' => 'insurances'], function () {
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
    Route::get('/usage-history', [UsageHistoryController::class, 'index'])->name('usage.history');
    Route::get('/lto-transactions', [LTOTransactionController::class, 'index'])->name('lto.transactions');
    Route::get('/categories', [CategoryController::class, 'getAll'])->name('categories.all');
    // Policy Routes
    Route::group(['prefix' => 'policies'], function () {
        Route::get('/', [PolicyController::class, 'index'])->name('policies.index');
        Route::post('/', [PolicyController::class, 'store'])->name('policies.store');
        Route::get('/data', [PolicyController::class, 'data'])->name('policies.data');
        Route::get('/stats', [PolicyController::class, 'stats'])->name('policies.stats');
        Route::put('/{id}', [PolicyController::class, 'update'])->name('policies.update');
        Route::delete('/{id}', [PolicyController::class, 'destroy'])->name('policies.destroy');
    });
    // Walkin Routes
    Route::group(['prefix' => 'walkin'], function () {
        Route::get('/', [WalkinController::class, 'index'])->name('walkin.index');
        Route::post('/', [WalkinController::class, 'store'])->name('walkin.store');
        Route::get('/data', [WalkinController::class, 'data'])->name('walkin.data');
        Route::get('/stats', [WalkinController::class, 'stats'])->name('walkin.stats');
        Route::put('/{id}', [WalkinController::class, 'update'])->name('walkin.update');
        Route::delete('/{id}', [WalkinController::class, 'destroy'])->name('walkin.destroy');
    });

    // Office Routes
    Route::group(['prefix' => 'office'], function () {
        Route::get('/', [OfficeController::class, 'index'])->name('office.index');
        Route::post('/', [OfficeController::class, 'store'])->name('office.store');
        Route::get('/data', [OfficeController::class, 'data'])->name('office.data');
        Route::get('/stats', [OfficeController::class, 'stats'])->name('office.stats');
        Route::get('/{id}', [OfficeController::class, 'show'])->name('office.show');
        Route::put('/{id}', [OfficeController::class, 'update'])->name('office.update');
        Route::delete('/{id}', [OfficeController::class, 'destroy'])->name('office.destroy');
    });
    // User Routes
    Route::group(['prefix' => 'users'], function () {
        Route::get('/', [UserController::class, 'index'])->name('users.index');
        Route::post('/', [UserController::class, 'store'])->name('users.store');
        Route::get('/data', [UserController::class, 'data'])->name('users.data');
        Route::get('/stats', [UserController::class, 'stats'])->name('users.stats');
        Route::get('/{id}', [UserController::class, 'show'])->name('users.show');
        Route::put('/{id}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/{id}', [UserController::class, 'destroy'])->name('users.destroy');
    });
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');
    Route::get('/activity', [ActivityController::class, 'index'])->name('activity');
});

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return view('welcome', ['wrapperClass' => 'table-responsive']);
})->name('welcome');

