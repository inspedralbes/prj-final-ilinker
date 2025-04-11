<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentEducation extends Model
{
    /** @use HasFactory<\Database\Factories\StudentEducationFactory> */
    use HasFactory;

    public function institution()
    {
        return $this->hasOne(Institutions::class, 'id', 'institution_id');
    }
}
