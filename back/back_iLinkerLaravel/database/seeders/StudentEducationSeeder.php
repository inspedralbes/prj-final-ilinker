<?php

namespace Database\Seeders;

use App\Models\StudentEducation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentEducationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta_json = './resources/json/student_education.json';
        $educations = json_decode(file_get_contents($ruta_json), true);
        foreach ($educations as $education) {
            StudentEducation::create([
                'student_id' => $education['student_id'],
                'course_id' => $education['course_id'],
                'institution_id' => $education['institution_id'],
                'institute' => $education['institute'],
                'degree' => $education['degree'],
                'start_date' => $education['start_date'],
                'end_date' => $education['end_date'],
            ]);
        }
    }
}
