<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Batch;
use App\Models\Medicine;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    /**
     * Display a listing of sales.
     */
    public function index(Request $request)
    {
        $query = Sale::with(['customer', 'user', 'items.medicine']);
        
        // Filter by date range
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        
        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }
        
        // Filter by customer
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }
        
        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        $sales = $query->latest()->paginate(20);
        $customers = Customer::active()->orderBy('name')->get();
        
        return Inertia::render('sales/index', [
            'sales' => $sales,
            'customers' => $customers,
            'filters' => $request->only(['from_date', 'to_date', 'customer_id', 'status']),
        ]);
    }

    /**
     * Display the specified sale.
     */
    public function show(Sale $sale)
    {
        $sale->load(['customer', 'user', 'items.medicine.manufacturer', 'items.batch']);
        
        return Inertia::render('sales/show', [
            'sale' => $sale,
        ]);
    }

    /**
     * Store a newly created sale.
     */
    public function store(StoreSaleRequest $request)
    {
        try {
            DB::beginTransaction();
            
            // Create the sale
            $sale = Sale::create([
                'invoice_number' => Sale::generateInvoiceNumber(),
                'customer_id' => $request->customer_id,
                'user_id' => auth()->id(),
                'subtotal' => $request->subtotal,
                'discount_amount' => $request->discount_amount ?? 0,
                'tax_amount' => $request->tax_amount ?? 0,
                'total_amount' => $request->total_amount,
                'paid_amount' => $request->paid_amount,
                'change_amount' => $request->change_amount ?? 0,
                'payment_method' => $request->payment_method,
                'status' => 'completed',
                'notes' => $request->notes,
            ]);
            
            // Process each sale item
            foreach ($request->items as $item) {
                $medicine = Medicine::findOrFail($item['medicine_id']);
                $batch = Batch::findOrFail($item['batch_id']);
                
                // Check if enough stock is available
                $quantityInPieces = match ($item['unit_type']) {
                    'strip' => $item['quantity'] * $medicine->units_per_strip,
                    'box' => $item['quantity'] * $medicine->units_per_strip * $medicine->strips_per_box,
                    default => $item['quantity'],
                };
                
                if ($batch->current_quantity < $quantityInPieces) {
                    throw new \Exception("Not enough stock for {$medicine->name}. Available: {$batch->current_quantity}, Required: {$quantityInPieces}");
                }
                
                // Create sale item
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'medicine_id' => $item['medicine_id'],
                    'batch_id' => $item['batch_id'],
                    'quantity' => $item['quantity'],
                    'unit_type' => $item['unit_type'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                    'cost_price' => $batch->purchase_price,
                ]);
                
                // Update batch quantity
                $batch->decrement('current_quantity', $quantityInPieces);
            }
            
            // Update customer balance if credit sale
            if ($request->payment_method === 'credit' && $request->customer_id) {
                $customer = Customer::find($request->customer_id);
                if ($customer) {
                    $customer->increment('current_balance', $request->total_amount - $request->paid_amount);
                }
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'sale_id' => $sale->id,
                'invoice_number' => $sale->invoice_number,
                'message' => 'Sale completed successfully',
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }


}