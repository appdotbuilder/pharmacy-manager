<?php

namespace Database\Factories;

use App\Models\Medicine;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Batch>
 */
class BatchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $manufactureDate = $this->faker->dateTimeBetween('-2 years', '-1 month');
        $expiryDate = (clone $manufactureDate)->modify('+' . random_int(12, 36) . ' months');
        $quantity = random_int(100, 1000);
        
        return [
            'batch_number' => 'BTH' . $this->faker->unique()->numerify('######'),
            'medicine_id' => Medicine::factory(),
            'supplier_id' => Supplier::factory(),
            'manufacture_date' => $manufactureDate,
            'expiry_date' => $expiryDate,
            'purchase_price' => $this->faker->randomFloat(2, 0.25, 25),
            'initial_quantity' => $quantity,
            'current_quantity' => random_int(0, $quantity),
            'is_consignment' => $this->faker->boolean(20), // 20% chance of being consignment
            'notes' => $this->faker->sentence(),
        ];
    }
}