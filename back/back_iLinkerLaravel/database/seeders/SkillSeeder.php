<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta_json = './resources/json/skills.json';
        $json = file_get_contents($ruta_json);
        $skills = json_decode($json, true);
        foreach ($skills as $skill) {
            Skill::create([
                'name' => $skill['name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
