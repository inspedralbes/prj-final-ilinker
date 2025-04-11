<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Services\StudentService;
use Illuminate\Http\Request;

class StudentController extends Controller
{

    protected $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    public function getStudent($uuid)
    {

        $student = Student::with(['user','education.institution', 'experience', 'projects', 'skills' => function ($query) {
            $query->select('skills.id', 'skills.name');
        }])->where('uuid', $uuid)->first();

        if (!$student) {
            return response()->json(['status' => 'error', 'message' => 'Student not found']);
        }

        return response()->json(['status' => 'success', 'student' => $student]);

    }
}
