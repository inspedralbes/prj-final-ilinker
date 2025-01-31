<?php

namespace App\Services;

use App\Models\StudentEducation;

class StudentEducationService
{

    public function __construct()
    {

    }

    public function createStudentEducation($data, $studentEducation)
    {

        dd($data);
        $studentEducation = new StudentEducation();

        $studentEducation->student_id = $data['student_id'];
        $studentEducation->courses_id =  $data['courses_id'] ?? null;
        $studentEducation->institution_id = $studentEducation['institution_id'] ?? null;
        $studentEducation->institute = $data['institute'];
        $studentEducation->degree = $data['degree'];
        $studentEducation->start_date = $data['start_date'];
        $studentEducation->end_date = $data['end_date'];

        $studentEducation->save();

        return $studentEducation;
    }
}
