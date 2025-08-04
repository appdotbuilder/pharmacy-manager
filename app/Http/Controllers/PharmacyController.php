<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\Batch;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Manufacturer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PharmacyController extends Controller
{
    /**
     * Display the main dashboard with key metrics.
     */
    public function index()
    {
        // Get key statistics
        $totalMedicines = Medicine::active()->count();
        $totalStock = Batch::inStock()->sum('current_quantity');
        $todaySales = Sale::whereDate('created_at', today())->completed()->sum('total_amount');
        $expiredBatches = Batch::expired()->count();
        $nearExpiryBatches = Batch::nearExpiry()->count();
        
        // Recent sales
        $recentSales = Sale::with(['customer', 'user'])
            ->latest()
            ->take(5)
            ->get();
        
        // Low stock medicines (less than 50 pieces)
        $lowStockMedicines = Medicine::with(['manufacturer', 'batches'])
            ->active()
            ->get()
            ->filter(function ($medicine) {
                return $medicine->total_stock < 50;
            })
            ->take(10);
        
        // Expiring soon medicines
        $expiringSoon = Batch::with(['medicine', 'supplier'])
            ->nearExpiry()
            ->inStock()
            ->orderBy('expiry_date')
            ->take(10)
            ->get();
        
        // Monthly sales trend (last 6 months)
        $monthlySales = collect();
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $sales = Sale::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->completed()
                ->sum('total_amount');
            
            $monthlySales->push([
                'month' => $month->format('M Y'),
                'sales' => $sales
            ]);
        }
        
        return Inertia::render('welcome', [
            'stats' => [
                'totalMedicines' => $totalMedicines,
                'totalStock' => $totalStock,
                'todaySales' => $todaySales,
                'expiredBatches' => $expiredBatches,
                'nearExpiryBatches' => $nearExpiryBatches,
            ],
            'recentSales' => $recentSales,
            'lowStockMedicines' => $lowStockMedicines,
            'expiringSoon' => $expiringSoon,
            'monthlySales' => $monthlySales,
        ]);
    }


}