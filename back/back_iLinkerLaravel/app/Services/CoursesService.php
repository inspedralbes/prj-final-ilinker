<?php

namespace App\Services;

use App\Models\Courses;
use function PHPSTORM_META\map;

class CoursesService
{

    public function __construct()
    {

    }

    public function getCourses(){
        $courses = Courses::whereNotNull('id_parent')->get()->map(function ($course) {
            return [
                'id' => $course->id,
                'parent_id' => $course->id_parent,
                'name' => $course->name,
            ];
        });

        return $courses;
    }
}
