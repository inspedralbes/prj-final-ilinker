<?php

namespace App\Http\Controllers;

use App\Services\StudentEducationService;
use Illuminate\Http\Request;
use function Symfony\Component\Translation\t;

class StudentEducationController extends Controller
{
    protected $studentEducationService;

    public function __construct(StudentEducationService $studentEducationService)
    {
        $this->studentEducationService = $studentEducationService;
    }


    public function create(Request $request)
    {
        $validate = $request->validate([
            'student_id' => 'required',
            'courses_id' => 'required',
            'institution_id' => 'required',
            'institute' => 'required',
            'degree' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
        ]);

        $education = $this->studentEducationService->createStudentEducation($validate);

        return response()->json(['status' => 'success', 'education' => $education]);
    }
}
