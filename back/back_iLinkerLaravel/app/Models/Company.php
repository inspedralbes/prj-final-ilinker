<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'CIF',
        'num_people',
        'short_description',
        'description',
        'email',
        'phone',
        'website',
        'responsible_phone',
        'company_position',
        'address',
        'city',
        'postal_code',
        'country',
        'slogan',
        'logo',
        'cover_photo',
        'user_id',
        'company_email',
        'founded_year'
    ];
    public function sectors()
    {
        return $this->hasManyThrough(Sector::class, CompanySector::class, 'company_id', 'id', 'id', 'sector_id');
    }

    public function skills()
    {
        return $this->hasManyThrough(Sector::class, CompanySkills::class, 'company_id', 'id', 'id', 'skill_id');
    }

    public function offers()
    {
        return $this->hasMany(Offer::class, 'company_id', 'id');
    }
}
