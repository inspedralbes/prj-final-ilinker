<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySkills extends Model
{
    //
    protected $fillable =  [
        'company_id',
        'skill_id',
    ];
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }
}
