<?php

namespace App\Services;

use App\Models\Courses;
use App\Models\Institutions;
use App\Models\StudentEducation;
use DateTime;
use Exception;

class StudentEducationService
{

    public function __construct()
    {

    }

    public function createStudentEducation($data)
    {
        $studentEducation = new StudentEducation();

        $studentEducation->student_id = $data['student_id'];

        // Manejo de courses_id
        if ($data['courses_id'] === null) {
            $studentEducation->courses_id = null;
            $studentEducation->degree = $data['degree'] ?? null;
        } else {
            $courses = Courses::find($data['courses_id']);
            if ($courses) {
                $studentEducation->courses_id = $courses->id;
                $studentEducation->degree = $data['degree'] ?? $courses->name;
            } else {
                $studentEducation->courses_id = null;
                $studentEducation->degree = $data['degree'] ?? null;
            }
        }

        // Manejo de institution_id
        if ($data['institution_id'] === null) {
            $studentEducation->institution_id = null;
            $studentEducation->institute = $data['institute'] ?? null;
        } else {
            $institution = Institutions::find($data['institution_id']);
            if ($institution) {
                $studentEducation->institution_id = $institution->id;
                $studentEducation->institute = $institution->name;
            } else {
                $studentEducation->institution_id = null;
                $studentEducation->institute = $data['institute'] ?? null;
            }
        }

        if (!empty( $data['start_date'])) {
            $fecha = DateTime::createFromFormat('d/m/Y',  $data['start_date']);
            if ($fecha) {
                $studentEducation->start_date = $fecha->format('Y-m-d'); // Convertir al formato SQL
            } else {
                // Manejar error de formato
                throw new Exception("Formato de fecha inválido: " . $data['start_date']);
            }
        }

        if (!empty( $data['end_date'])) {
            $fecha = DateTime::createFromFormat('d/m/Y',  $data['end_date']);
            if ($fecha) {
                $studentEducation->end_date = $fecha->format('Y-m-d'); // Convertir al formato SQL
            } else {
                // Manejar error de formato
                throw new Exception("Formato de fecha inválido: " . $data['end_date']);
            }
        }

        $studentEducation->save();

        return $studentEducation;
    }
}
