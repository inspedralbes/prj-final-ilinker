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
        $ruta = './resources/json/student_skills.json';
        $json = json_decode(file_get_contents($ruta), true);
        foreach ($json as $skills) {
            StudentSkills::create([
                'student_id' => $skills['student_id'],
                'skill_id' => $skills['skill_id'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
