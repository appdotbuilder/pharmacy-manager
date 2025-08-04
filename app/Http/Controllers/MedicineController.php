<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMedicineRequest;
use App\Http\Requests\UpdateMedicineRequest;
use App\Models\Medicine;
use App\Models\Manufacturer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineController extends Controller
{
    /**
     * Display a listing of medicines.
     */
    public function index(Request $request)
    {
        $query = Medicine::with(['manufacturer', 'batches']);
        
        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('generic_name', 'like', "%{$search}%");
            });
        }
        
        // Form filter
        if ($request->filled('form')) {
            $query->where('form', $request->form);
        }
        
        // Manufacturer filter
        if ($request->filled('manufacturer_id')) {
            $query->where('manufacturer_id', $request->manufacturer_id);
        }
        
        $medicines = $query->latest()->paginate(20);
        $manufacturers = Manufacturer::orderBy('name')->get();
        $forms = Medicine::distinct('form')->pluck('form');
        
        return Inertia::render('medicines/index', [
            'medicines' => $medicines,
            'manufacturers' => $manufacturers,
            'forms' => $forms,
            'filters' => $request->only(['search', 'form', 'manufacturer_id']),
        ]);
    }

    /**
     * Show the form for creating a new medicine.
     */
    public function create()
    {
        $manufacturers = Manufacturer::orderBy('name')->get();
        
        return Inertia::render('medicines/create', [
            'manufacturers' => $manufacturers,
        ]);
    }

    /**
     * Store a newly created medicine.
     */
    public function store(StoreMedicineRequest $request)
    {
        $medicine = Medicine::create($request->validated());

        return redirect()->route('medicines.show', $medicine)
            ->with('success', 'Medicine created successfully.');
    }

    /**
     * Display the specified medicine.
     */
    public function show(Medicine $medicine)
    {
        $medicine->load(['manufacturer', 'batches.supplier']);
        
        return Inertia::render('medicines/show', [
            'medicine' => $medicine,
        ]);
    }

    /**
     * Show the form for editing the specified medicine.
     */
    public function edit(Medicine $medicine)
    {
        $manufacturers = Manufacturer::orderBy('name')->get();
        
        return Inertia::render('medicines/edit', [
            'medicine' => $medicine,
            'manufacturers' => $manufacturers,
        ]);
    }

    /**
     * Update the specified medicine.
     */
    public function update(UpdateMedicineRequest $request, Medicine $medicine)
    {
        $medicine->update($request->validated());

        return redirect()->route('medicines.show', $medicine)
            ->with('success', 'Medicine updated successfully.');
    }

    /**
     * Remove the specified medicine.
     */
    public function destroy(Medicine $medicine)
    {
        $medicine->delete();

        return redirect()->route('medicines.index')
            ->with('success', 'Medicine deleted successfully.');
    }
}