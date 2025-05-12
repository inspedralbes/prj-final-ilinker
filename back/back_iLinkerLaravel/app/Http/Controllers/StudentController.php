<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Services\StudentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{

    protected $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    public function getStudent($uuid)
    {

        $student = Student::with(['user', 'education.institution', 'experience', 'projects', 'skills' => function ($query) {
            $query->select('skills.id', 'skills.name');
        }])->where('uuid', $uuid)->first();

        if (!$student) {
            return response()->json(['status' => 'error', 'message' => 'Student not found']);
        }

        // Agrupar las experiencias por company_id
        $groupedExperience = $student->experience->groupBy('company_id');

        return response()->json([
            'status' => 'success',
            'student' => $student,
            'experience_grouped' => $groupedExperience
        ]);
    }

    public function getEducationById(Request $request)
    {


        $student = Student::with(['education.institution'])->where('uuid', $request->uuid)->first();

        if (!$student) {
            return response()->json(['status' => 'error', 'message' => 'Student not found']);
        }

        return response()->json(['status' => 'success', 'education' => $student]);
    }

    public function getOfferData()
    {
        try {
            $user = Auth::user();

            $student = Student::with('education')
                ->where('user_id', $user->id)
                ->first();

            return response()->json(['status' => 'success', 'student' => $student]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e ->getMessage()]);
        }
    }
}
