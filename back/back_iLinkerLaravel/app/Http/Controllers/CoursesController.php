<?php

namespace App\Http\Controllers;

use App\Services\CoursesService;
use Illuminate\Http\Request;

class CoursesController extends Controller
{
    protected $coursesService;

    public function __construct(CoursesService $coursesService)
    {
        $this->coursesService = $coursesService;
    }


    public function getCourses()
    {
        try {
            $courses = $this->coursesService->getCourses();

            return response()->json(['status' => 'success', 'courses' => $courses]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
