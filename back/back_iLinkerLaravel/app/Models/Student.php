<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use HasFactory;

    public function student()
    {
        return $this->hasOne(Student::class, 'user_id');
    }

    public function education()
    {
        return $this->HasMany(StudentEducation::class, 'student_id');
    }

    public function experience()
    {
        return $this->HasMany(StudentExperience::class, 'student_id');
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'student_skills', 'student_id', 'skill_id');
    }

    public function projects()
    {
        return $this->HasMany(StudentProject::class, 'student_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
