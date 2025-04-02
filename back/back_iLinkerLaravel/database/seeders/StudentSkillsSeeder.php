<?php

namespace Database\Seeders;

use App\Models\StudentSkills;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentSkillsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta = './resources/json/students_skills.json';
        $json = json_decode(file_get_contents($ruta), true);
        foreach ($json as $skills) {
            StudentSkills::created([
                'student_id' => $skills['id'],
                'skill_id' => $skills['skill_id'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
