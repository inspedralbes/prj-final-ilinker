<?php

namespace App\Services;

use App\Models\Skill;

class SkillService
{
    public function __construct()
    {

    }

    public function createSkill($data)
    {
        $skill = new Skill();

        $skill->name = $data['name'];

        $skill->save();

        return $skill;
    }

    public function assignStudent($skills)
    {

    }
}
