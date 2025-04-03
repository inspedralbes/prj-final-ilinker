<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyFactory> */
    use HasFactory;

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
