<?php

namespace App\Services;

use App\Models\Skill;
use App\Models\StudentSkills;

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

    public function assignStudent($data)
    {
        $arraySkills = [];
        foreach ($data['skills_id'] as $skill_id) {

            $skills = new StudentSkills();

            $skills->student_id = $data['student_id'];
            $skills->skill_id = $skill_id;

            $skills->save();

            array_push($arraySkills, $skill_id);
        }

        return $arraySkills;

    }

    public function deleteSkill($data)
    {
        $skills = StudentSkills::findOrFail($data);
        $skills->delete();

        return $skills;

    }

    public function getAllSkills()
    {
        return Skill::all();
    }
}
