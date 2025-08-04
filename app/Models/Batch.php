<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Batch
 *
 * @property int $id
 * @property string $batch_number
 * @property int $medicine_id
 * @property int $supplier_id
 * @property \Illuminate\Support\Carbon|null $manufacture_date
 * @property \Illuminate\Support\Carbon $expiry_date
 * @property float $purchase_price
 * @property int $initial_quantity
 * @property int $current_quantity
 * @property bool $is_consignment
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Medicine $medicine
 * @property-read \App\Models\Supplier $supplier
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SaleItem> $saleItems
 * @property-read int|null $sale_items_count
 * @property-read bool $is_expired
 * @property-read bool $is_near_expiry
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Batch newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Batch newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Batch query()
 * @method static \Illuminate\Database\Eloquent\Builder|Batch expired()
 * @method static \Illuminate\Database\Eloquent\Builder|Batch nearExpiry($days = 30)
 * @method static \Illuminate\Database\Eloquent\Builder|Batch inStock()
 * @method static \Illuminate\Database\Eloquent\Builder|Batch consignment()
 * @method static \Illuminate\Database\Eloquent\Builder|Batch whereBatchNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Batch whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Batch whereCurrentQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Batch whereExpiryDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Batch whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Batch whereInitialQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Batch whereIsConsignment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Batch whereManufactureDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Batch whereMedicineId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Batch whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Batch wherePurchasePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Batch whereSupplierId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Batch whereUpdatedAt($value)
 * @method static \Database\Factories\BatchFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Batch extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'batch_number',
        'medicine_id',
        'supplier_id',
        'manufacture_date',
        'expiry_date',
        'purchase_price',
        'initial_quantity',
        'current_quantity',
        'is_consignment',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'manufacture_date' => 'date',
        'expiry_date' => 'date',
        'purchase_price' => 'decimal:2',
        'is_consignment' => 'boolean',
        'initial_quantity' => 'integer',
        'current_quantity' => 'integer',
    ];

    /**
     * Get the medicine for this batch.
     */
    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class);
    }

    /**
     * Get the supplier for this batch.
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the sale items for this batch.
     */
    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    /**
     * Check if the batch is expired.
     *
     * @return bool
     */
    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date < now()->toDateString();
    }

    /**
     * Check if the batch is near expiry (within 30 days).
     *
     * @return bool
     */
    public function getIsNearExpiryAttribute(): bool
    {
        return $this->expiry_date <= now()->addDays(30)->toDateString() && !$this->is_expired;
    }

    /**
     * Scope a query to only include expired batches.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now()->toDateString());
    }

    /**
     * Scope a query to only include batches near expiry.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int  $days
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeNearExpiry($query, $days = 30)
    {
        return $query->where('expiry_date', '<=', now()->addDays($days)->toDateString())
                    ->where('expiry_date', '>=', now()->toDateString());
    }

    /**
     * Scope a query to only include batches with stock.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeInStock($query)
    {
        return $query->where('current_quantity', '>', 0);
    }

    /**
     * Scope a query to only include consignment batches.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeConsignment($query)
    {
        return $query->where('is_consignment', true);
    }
}