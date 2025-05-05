<?php

namespace App\Services;

use App\Models\Student;
use App\Models\StudentSkills;
use App\Models\User;
use DateTime;
use Exception;
use Illuminate\Http\Request;

class StudentService
{
    public function ___construct()
    {

    }

    public function createStudent($data, $student)
    {

        $students = new Student();

        $students->user_id = $data['id'];
        $students->uuid = uuid_create();
        $students->name = $data['name'];
        $students->surname = $data['surname'];
        $students->type_document = $student['type_document'] ?? null;
        $students->id_document = $student['id_document'] ?? null;
        $students->nationality = $student['nationality'] ?? null;
        $students->photo_pic = $student['photo_pic'] ?? null;
        $students->birthday = $data['birthday'];
        $students->gender = $student['gender'] ?? null;
        $students->phone = $student['phone'] ?? null;
        $students->address = $student['address'] ?? null;
        $students->city = $student['city'] ?? null;
        $students->country = $student['country'] ?? null;
        $students->postal_code = $student['postal_code'] ?? null;
        //$students->languages = $student['languages'];
        $students->languages = is_string($student['languages']) ? $student['languages'] : json_encode($student['languages'], JSON_UNESCAPED_UNICODE);

        $students->save();

        return $students;
    }

    public function updateStudent($data, $skills)
    {

        $students = Student::findOrFail($data['id']);

        $students->type_document = $data['type_document'];
        $students->id_document = $data['id_document'];
        $students->photo_pic = $data ['photo_pic'];
        $students->gender = $data['gender'];
        $students->phone = $data['phone'];
        $students->cover_photo = $data['cover_photo'];

        $students->nationality = $data['nationality'];
        $students->name = $data['name'];
        $students->surname = $data['surname'];

        if (!empty($data['birthday'])) {
            $fecha = DateTime::createFromFormat('d/m/Y', $data['birthday']);
            if ($fecha) {
                $students->birthday = $fecha->format('Y-m-d'); // Convertir al formato SQL
            } else {
                // Manejar error de formato
                throw new Exception("Formato de fecha inválido: " . $data['birthday']);
            }
        }
        $students->address = $data['address'];
        $students->city = $data['city'];
        $students->country = $data['country'];
        $students->desctiption = $data['description'] ?? null;
        $students->postal_code = $data['postal_code'];
        $students->languages = is_string($data['languages']) ? $data['languages'] : json_encode($data['languages'], JSON_UNESCAPED_UNICODE);

        $students->save();

        $user = User::findOrFail($data['user_id']);

        if (!empty($data['birthday'])) {
            $fecha = DateTime::createFromFormat('d/m/Y', $data['birthday']);
            if ($fecha) {
                $user->birthday = $fecha->format('Y-m-d'); // Convertir al formato SQL
            } else {
                // Manejar error de formato
                throw new Exception("Formato de fecha inválido: " . $data['birthday']);
            }
        }

        $user->save();

        // Eliminar todas las skills existentes del estudiante
        StudentSkills::where('student_id', $students->id)->delete();


        // Insertar las nuevas skills
        foreach ($skills as $skill) {
            $skils = new StudentSkills();
            $skils->student_id = $students->id;
            $skils->skill_id = $skill['id'];

            $skils->save();
        }


        return $students;
    }

    public function searchStudent($uuid)
    {

    }


}
