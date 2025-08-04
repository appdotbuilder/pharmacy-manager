<?php

namespace Database\Seeders;

use App\Models\Manufacturer;
use App\Models\Supplier;
use App\Models\Medicine;
use App\Models\Batch;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class PharmacySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create manufacturers
        $manufacturers = Manufacturer::factory(10)->create();
        
        // Create suppliers
        $suppliers = Supplier::factory(5)->create();
        
        // Create medicines
        $medicines = collect();
        foreach ($manufacturers as $manufacturer) {
            $medicineCount = random_int(3, 8);
            $manufacturerMedicines = Medicine::factory($medicineCount)->create([
                'manufacturer_id' => $manufacturer->id
            ]);
            $medicines = $medicines->merge($manufacturerMedicines);
        }
        
        // Create batches for medicines
        foreach ($medicines as $medicine) {
            $batchCount = random_int(1, 4);
            foreach (range(1, $batchCount) as $i) {
                Batch::factory()->create([
                    'medicine_id' => $medicine->id,
                    'supplier_id' => $suppliers->random()->id,
                ]);
            }
        }
        
        // Create customers
        Customer::factory(50)->create();
        
        // Create users if none exist
        if (User::count() === 0) {
            User::factory()->create([
                'name' => 'Pharmacy Admin',
                'email' => 'admin@pharmacy.com',
            ]);
        }
        
        // Create some sample sales
        $users = User::all();
        $customers = Customer::all();
        
        foreach (range(1, 30) as $i) {
            $sale = Sale::factory()->create([
                'user_id' => $users->random()->id,
                'customer_id' => $customers->random(70)->first() ? $customers->random()->id : null, // 70% chance of having a customer
            ]);
            
            // Create sale items for each sale
            $itemCount = random_int(1, 5);
            $availableMedicines = $medicines->filter(function ($medicine) {
                return $medicine->batches()->inStock()->count() > 0;
            });
            
            foreach (range(1, $itemCount) as $j) {
                $medicine = $availableMedicines->random();
                $batch = $medicine->batches()->inStock()->first();
                
                if ($batch) {
                    $quantity = random_int(1, min(5, $batch->current_quantity));
                    $unitType = collect(['piece', 'strip', 'box'])->random();
                    
                    // Calculate price based on customer type
                    $customer = $sale->customer;
                    $basePrice = $medicine->getPriceForCustomer($customer ? $customer->type : 'general');
                    
                    $unitPrice = match ($unitType) {
                        'strip' => $basePrice * $medicine->units_per_strip,
                        'box' => $basePrice * $medicine->units_per_strip * $medicine->strips_per_box,
                        default => $basePrice,
                    };
                    
                    SaleItem::factory()->create([
                        'sale_id' => $sale->id,
                        'medicine_id' => $medicine->id,
                        'batch_id' => $batch->id,
                        'quantity' => $quantity,
                        'unit_type' => $unitType,
                        'unit_price' => $unitPrice,
                        'total_price' => $quantity * $unitPrice,
                        'cost_price' => $batch->purchase_price,
                    ]);
                    
                    // Update batch quantity
                    $quantityInPieces = match ($unitType) {
                        'strip' => $quantity * $medicine->units_per_strip,
                        'box' => $quantity * $medicine->units_per_strip * $medicine->strips_per_box,
                        default => $quantity,
                    };
                    
                    $batch->decrement('current_quantity', $quantityInPieces);
                }
            }
            
            // Update sale totals
            $items = $sale->items;
            $subtotal = $items->sum('total_price');
            $discountPercentage = $sale->customer ? $sale->customer->discount_percentage : 0;
            $discountAmount = ($subtotal * $discountPercentage) / 100;
            $totalAmount = $subtotal - $discountAmount;
            
            $sale->update([
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'paid_amount' => $totalAmount,
            ]);
        }
    }
}