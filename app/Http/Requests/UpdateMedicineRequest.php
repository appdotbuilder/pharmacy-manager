<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMedicineRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'strength' => 'nullable|string|max:100',
            'form' => 'required|string|max:100',
            'manufacturer_id' => 'required|exists:manufacturers,id',
            'function' => 'nullable|string',
            'usage_instructions' => 'nullable|string',
            'side_effects' => 'nullable|string',
            'prescription_required' => 'required|in:yes,no,controlled',
            'general_price' => 'required|numeric|min:0',
            'doctor_price' => 'required|numeric|min:0',
            'prescription_price' => 'required|numeric|min:0',
            'units_per_strip' => 'required|integer|min:1',
            'strips_per_box' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Medicine name is required.',
            'form.required' => 'Medicine form (tablet, capsule, etc.) is required.',
            'manufacturer_id.required' => 'Please select a manufacturer.',
            'general_price.required' => 'General customer price is required.',
            'doctor_price.required' => 'Doctor/clinic price is required.',
            'prescription_price.required' => 'Prescription-based price is required.',
            'units_per_strip.required' => 'Units per strip is required.',
            'strips_per_box.required' => 'Strips per box is required.',
        ];
    }
}