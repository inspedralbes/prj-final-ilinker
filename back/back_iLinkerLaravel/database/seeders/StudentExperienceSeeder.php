<?php

namespace Database\Seeders;

use App\Models\StudentExperience;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentExperienceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta = './resources/json/student_experience.json';
        $json = json_decode(file_get_contents($ruta), true);

        foreach ($json as $experience) {
            StudentExperience::create([
                'student_id' => $experience['student_id'],
                'company_id' => $experience['company_id'],
                'company_name' => $experience['company_name'],
                'department' => $experience['department'],
                'employee_type' => $experience['employee_type'],
                'company_address' => $experience['company_address'],
                'location_type' => $experience['location_type'],
                'start_date' => $experience['start_date'],
                'end_date' => $experience['end_date'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
