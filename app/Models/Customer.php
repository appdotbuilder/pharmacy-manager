<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Customer
 *
 * @property int $id
 * @property string $name
 * @property string|null $phone
 * @property string|null $email
 * @property string|null $address
 * @property string $type
 * @property float $discount_percentage
 * @property float $credit_limit
 * @property float $current_balance
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Sale> $sales
 * @property-read int|null $sales_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Customer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer query()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer active()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereCreditLimit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereCurrentBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereDiscountPercentage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereUpdatedAt($value)
 * @method static \Database\Factories\CustomerFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Customer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'phone',
        'email',
        'address',
        'type',
        'discount_percentage',
        'credit_limit',
        'current_balance',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'credit_limit' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the sales for this customer.
     */
    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    /**
     * Scope a query to only include active customers.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}