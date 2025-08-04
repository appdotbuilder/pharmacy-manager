<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Medicine
 *
 * @property int $id
 * @property string $name
 * @property string|null $generic_name
 * @property string|null $strength
 * @property string $form
 * @property int $manufacturer_id
 * @property string|null $function
 * @property string|null $usage_instructions
 * @property string|null $side_effects
 * @property string $prescription_required
 * @property float $general_price
 * @property float $doctor_price
 * @property float $prescription_price
 * @property int $units_per_strip
 * @property int $strips_per_box
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Manufacturer $manufacturer
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Batch> $batches
 * @property-read int|null $batches_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SaleItem> $saleItems
 * @property-read int|null $sale_items_count
 * @property-read int $total_stock
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine query()
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine active()
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereDoctorPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereForm($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereFunction($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereGeneralPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereGenericName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereManufacturerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine wherePrescriptionPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine wherePrescriptionRequired($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereSideEffects($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereStrength($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereStripsPerBox($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereUnitsPerStrip($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medicine whereUsageInstructions($value)
 * @method static \Database\Factories\MedicineFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Medicine extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'generic_name',
        'strength',
        'form',
        'manufacturer_id',
        'function',
        'usage_instructions',
        'side_effects',
        'prescription_required',
        'general_price',
        'doctor_price',
        'prescription_price',
        'units_per_strip',
        'strips_per_box',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'general_price' => 'decimal:2',
        'doctor_price' => 'decimal:2',
        'prescription_price' => 'decimal:2',
        'is_active' => 'boolean',
        'units_per_strip' => 'integer',
        'strips_per_box' => 'integer',
    ];

    /**
     * Get the manufacturer for this medicine.
     */
    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(Manufacturer::class);
    }

    /**
     * Get the batches for this medicine.
     */
    public function batches(): HasMany
    {
        return $this->hasMany(Batch::class);
    }

    /**
     * Get the sale items for this medicine.
     */
    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    /**
     * Scope a query to only include active medicines.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the total stock across all batches.
     *
     * @return int
     */
    public function getTotalStockAttribute(): int
    {
        return $this->batches->sum('current_quantity');
    }

    /**
     * Get the price for a specific customer type.
     *
     * @param string $customerType
     * @return float
     */
    public function getPriceForCustomer(string $customerType): float
    {
        return match ($customerType) {
            'doctor', 'clinic' => $this->doctor_price,
            'prescription' => $this->prescription_price,
            default => $this->general_price,
        };
    }
}