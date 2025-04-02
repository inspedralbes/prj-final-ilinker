<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta_json = './resources/json/student.json';
        if(file_exists($ruta_json)){
            $json = file_get_contents($ruta_json);
            $students = json_decode($json, true);
            foreach($students as $student){
                Student::create([
                    'user_id' => $student['user_id'],
                    'uuid' => uuid_create(),
                    'name' => $student['name'],
                    'surname' => $student['surname'],
                    'type_document' => $student['type_document'],
                    'id_document' => $student['id_document'],
                    'nationality' => $student['nationality'],
                    'photo_pic'=> $student['photo_pic'],
                    'birthday' => $student['birthday'],
                    'gender' => $student['gender'],
                    'phone' => $student['phone'],
                    'address' => $student['address'],
                    'city' => $student['city'],
                    'country' => $student['country'],
                    'postal_code' => $student['postal_code'],
                    'languages' => is_string($student['languages']) ? $student['languages'] : json_encode($student['languages'], JSON_UNESCAPED_UNICODE),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
