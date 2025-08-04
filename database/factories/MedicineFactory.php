<?php

namespace Database\Factories;

use App\Models\Manufacturer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Medicine>
 */
class MedicineFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $forms = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops'];
        $medicines = [
            'Paracetamol', 'Aspirin', 'Ibuprofen', 'Amoxicillin', 'Ciprofloxacin',
            'Metformin', 'Atenolol', 'Omeprazole', 'Cetirizine', 'Loratadine'
        ];
        
        $basePrice = $this->faker->randomFloat(2, 0.5, 50);
        
        return [
            'name' => $this->faker->randomElement($medicines),
            'generic_name' => $this->faker->words(2, true),
            'strength' => $this->faker->randomElement(['250mg', '500mg', '100mg', '10mg', '20mg']),
            'form' => $this->faker->randomElement($forms),
            'manufacturer_id' => Manufacturer::factory(),
            'function' => $this->faker->sentence(),
            'usage_instructions' => $this->faker->paragraph(),
            'side_effects' => $this->faker->sentence(),
            'prescription_required' => $this->faker->randomElement(['yes', 'no', 'controlled']),
            'general_price' => $basePrice,
            'doctor_price' => $basePrice * 0.85, // 15% discount for doctors
            'prescription_price' => $basePrice * 0.9, // 10% discount for prescriptions
            'units_per_strip' => $this->faker->numberBetween(10, 20),
            'strips_per_box' => $this->faker->numberBetween(5, 10),
            'is_active' => true,
        ];
    }
}