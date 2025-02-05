<?php

namespace Database\Seeders;

use App\Models\Courses;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CoursesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta_json = './resources/json/courses.json';
        if (file_exists($ruta_json)) {
            $json = file_get_contents($ruta_json);
            $courses = json_decode($json, true);
            foreach ($courses as $course) {
                Courses::create([
                    'id_parent' => $course['id_parent'],
                    'name' => $course['name'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }
}
