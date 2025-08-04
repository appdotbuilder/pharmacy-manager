<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Supplier>
 */
class SupplierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company() . ' Pharmaceuticals',
            'email' => $this->faker->companyEmail(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'contact_person' => $this->faker->name(),
            'credit_limit' => $this->faker->randomFloat(2, 10000, 100000),
            'current_balance' => $this->faker->randomFloat(2, 0, 50000),
            'is_active' => true,
        ];
    }
}