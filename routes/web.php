<?php

use App\Http\Controllers\PharmacyController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\MedicineController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - Pharmacy Dashboard
Route::get('/', [PharmacyController::class, 'index'])->name('home');

// POS and Sales routes
Route::resource('pos', PosController::class)->only(['index', 'show']);
Route::post('/api/sales', [SaleController::class, 'store']);

// Resource routes
Route::resource('sales', SaleController::class)->only(['index', 'show']);
Route::resource('medicines', MedicineController::class);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [PharmacyController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
