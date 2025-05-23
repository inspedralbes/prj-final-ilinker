<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySector extends Model
{
    /** @use HasFactory<\Database\Factories\CompanySectorFactory> */
    use HasFactory;

    protected $fillable = [
        'id',
        'company_id',
        'sector_id',
    ];

    public function company(){
        $this->belongsTo(Company::class);
    }

    public function sector(){
        $this->belongsTo(Sector::class);
    }
}
