<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Institutions extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug', 
        'custom_url',
        'slogan',
        'about',
        'NIF',
        'type',
        'academic_sector',
        'location',
        'size',
        'sector',
        'founded_year',
        'languages',
        'specialties',
        'logo',
        'cover',
        'website',
        'phone',
        'email',
        'responsible_name',
        'responsible_phone',
        'responsible_email',
        'institution_position',
        'address',
        'city',
        'country',
        'postal_code'
    ];

    protected $casts = [
        'languages' => 'array',
        'specialties' => 'array'
    ];

    /**
     * Get the user that owns the institution.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the courses associated with the institution.
     */
    public function courses()
    {
        return $this->hasMany(Courses::class);
    }
}
