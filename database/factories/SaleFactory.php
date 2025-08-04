<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale>
 */
class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 10, 500);
        $discountAmount = $subtotal * $this->faker->randomFloat(2, 0, 0.1); // 0-10% discount
        $taxAmount = 0; // Assuming no tax for simplicity
        $totalAmount = $subtotal - $discountAmount + $taxAmount;
        $paidAmount = $totalAmount;
        
        return [
            'invoice_number' => 'INV-' . date('Ymd') . '-' . $this->faker->unique()->numberBetween(1000, 9999),
            'customer_id' => $this->faker->boolean(70) ? Customer::factory() : null, // 70% have customers
            'user_id' => User::factory(),
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'tax_amount' => $taxAmount,
            'total_amount' => $totalAmount,
            'paid_amount' => $paidAmount,
            'change_amount' => 0,
            'payment_method' => $this->faker->randomElement(['cash', 'card', 'credit']),
            'status' => 'completed',
            'notes' => $this->faker->sentence(),
        ];
    }
}