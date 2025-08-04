<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PosController extends Controller
{
    /**
     * Display the POS interface.
     */
    public function index()
    {
        $medicines = Medicine::with(['manufacturer', 'batches' => function ($query) {
            $query->inStock()->orderBy('expiry_date');
        }])
        ->active()
        ->orderBy('name')
        ->get();
        
        $customers = Customer::active()->orderBy('name')->get();
        
        return Inertia::render('pos', [
            'medicines' => $medicines,
            'customers' => $customers,
        ]);
    }

    /**
     * Search for medicines in POS.
     */
    public function show(Request $request)
    {
        $query = $request->get('q');
        
        $medicines = Medicine::with(['manufacturer', 'batches' => function ($q) {
            $q->inStock()->orderBy('expiry_date');
        }])
        ->active()
        ->where(function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
              ->orWhere('generic_name', 'like', "%{$query}%");
        })
        ->orderBy('name')
        ->take(20)
        ->get();
        
        return response()->json($medicines);
    }
}