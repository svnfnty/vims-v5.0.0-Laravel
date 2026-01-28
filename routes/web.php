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
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\ActivityController;

Route::get('/login', function () {
    return view('auth.login');
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

    Route::get('/insurances', [InsuranceController::class, 'index'])->name('insurances.index');
    Route::get('/insurances/data', [InsuranceController::class, 'data'])->name('insurance.data');

    Route::get('/application', [ApplicationController::class, 'form'])->name('application.form');

    Route::get('/policy-series', [PolicySeriesController::class, 'index'])->name('policy.series');
    Route::get('/series/api/getseries', [PolicySeriesController::class, 'getSeries'])->name('series.api.getseries');

    Route::get('/usage-history', [UsageHistoryController::class, 'index'])->name('usage.history');
    Route::get('/lto-transactions', [LTOTransactionController::class, 'index'])->name('lto.transactions');
    
    Route::get('/category', [CategoryController::class, 'index'])->name('category.index');
    Route::get('/category/data', [CategoryController::class, 'data'])->name('category.data');

    Route::get('/policies', [PolicyController::class, 'index'])->name('policies.index');
    Route::get('/policies/data',[PolicyController::class, 'data'])->name('policies.data'); 

    Route::get('/walkin', [WalkinController::class, 'index'])->name('walkin.index');
    Route::get('/walkin/data', [WalkinController::class, 'data'])->name('walkin.data');
    
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::get('/activity', [ActivityController::class, 'index'])->name('activity');
    Route::post('/insurance/validate-coc', [InsuranceController::class, 'validateCoc'])->name('insurance.validateCoc');
    Route::post('/insurance/validate-mvfile', [InsuranceController::class, 'validateMvFile'])->name('insurance.validateMvFile');
    Route::get('/insurances/manage_insurance', [InsuranceController::class, 'manageInsurance'])->name('insurance.manageInsurance');
});

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return view('welcome', ['wrapperClass' => 'table-responsive']);
})->name('welcome');

