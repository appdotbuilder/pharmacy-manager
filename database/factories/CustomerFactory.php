<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['general', 'doctor', 'clinic'];
        $type = $this->faker->randomElement($types);
        
        // Different discount rates based on customer type
        $discountPercentage = match ($type) {
            'doctor' => $this->faker->randomFloat(2, 5, 15),
            'clinic' => $this->faker->randomFloat(2, 10, 20),
            default => $this->faker->randomFloat(2, 0, 5),
        };
        
        return [
            'name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->email(),
            'address' => $this->faker->address(),
            'type' => $type,
            'discount_percentage' => $discountPercentage,
            'credit_limit' => $this->faker->randomFloat(2, 1000, 10000),
            'current_balance' => $this->faker->randomFloat(2, 0, 5000),
            'is_active' => true,
        ];
    }
}