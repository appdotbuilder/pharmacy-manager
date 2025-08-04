<?php

namespace Database\Factories;

use App\Models\Sale;
use App\Models\Medicine;
use App\Models\Batch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SaleItem>
 */
class SaleItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = random_int(1, 10);
        $unitPrice = $this->faker->randomFloat(2, 1, 50);
        $totalPrice = $quantity * $unitPrice;
        
        return [
            'sale_id' => Sale::factory(),
            'medicine_id' => Medicine::factory(),
            'batch_id' => Batch::factory(),
            'quantity' => $quantity,
            'unit_type' => $this->faker->randomElement(['piece', 'strip', 'box']),
            'unit_price' => $unitPrice,
            'total_price' => $totalPrice,
            'cost_price' => $unitPrice * 0.7, // Assuming 30% markup
        ];
    }
}