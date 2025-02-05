<?php

namespace App\Services;

use App\Models\Student;

class StudentService
{
    public function ___construct()
    {

    }

    public function createStudent($data, $student)
    {

        $students = new Student();

        $students->user_id = $data['id'];
        $students->name = $data['name'];
        $students->surname = $data['surname'];
        $students->type_document = $student['type_document'];
        $students->id_document = $student['id_document'];
        $students->nationality = $student['nationality'];
        $students->photo_pic = $student['photo_pic'];
        $students->birthday = $data['birthday'];
        $students->gender = $student['gender'];
        $students->phone = $student['phone'];
        $students->address = $student['address'];
        $students->city = $student['city'];
        $students->country = $student['country'];
        $students->postal_code = $student['postal_code'];
        //$students->languages = $student['languages'];
        $students->languages = is_string($student['languages']) ? $student['languages'] : json_encode($student['languages'], JSON_UNESCAPED_UNICODE);

        $students->save();

        return $students;
    }

    public function updateStudent($data, $student)
    {
        $students = Student::findOrFail($data['id']);

        $students->type_document = $student['type_document'];
        $students->id_document = $student['id_document'];
        $students->nationality = $student['nationality'];
        $students->photo_pic = $student['photo_pic'];
        $students->gender = $student['gender'];
        $students->phone = $student['phone'];
        $students->address = $student['address'];
        $students->city = $student['city'];
        $students->country = $student['country'];
        $students->postal_code = $student['postal_code'];
        $students->languages = is_string($student['languages']) ? $student['languages'] : json_encode($student['languages'], JSON_UNESCAPED_UNICODE);

        $students->save();

        return $students;
    }


}
