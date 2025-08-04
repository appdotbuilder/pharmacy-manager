<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Manufacturer
 *
 * @property int $id
 * @property string $name
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $address
 * @property string|null $contact_person
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Medicine> $medicines
 * @property-read int|null $medicines_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Manufacturer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Manufacturer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Manufacturer query()
 * @method static \Illuminate\Database\Eloquent\Builder|Manufacturer whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Manufacturer whereContactPerson($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Manufacturer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Manufacturer whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Manufacturer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Manufacturer whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Manufacturer wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Manufacturer whereUpdatedAt($value)
 * @method static \Database\Factories\ManufacturerFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Manufacturer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'contact_person',
    ];

    /**
     * Get the medicines for this manufacturer.
     */
    public function medicines(): HasMany
    {
        return $this->hasMany(Medicine::class);
    }
}