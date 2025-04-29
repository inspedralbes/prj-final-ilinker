<?php

namespace Database\Seeders;

use App\Models\StudentProject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta = './resources/json/student_projects.json';
        $json = json_decode(file_get_contents($ruta), true);

        foreach ($json as $project) {
            StudentProject::create([
                'student_id' => $project['student_id'],
                'name' => $project['name'],
                'description' => $project['description'],
                'link' => $project['link'],
                'pictures' => json_encode($project['pictures']),
                'end_project' => $project['end_project'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
