<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;

class SkillsController extends Controller
{
    //
    public function getSkills()
    {
        try {
            $skills = Skill::all("id", "name");

            return response()->json([
                'status' => 'success',
                'data' => $skills
            ], 200);
        } catch (\Exception $e) {
            return response()->json( [
                'status' => 'error',
                'message' => 'Error retrieving skills.',
                'error' => $e-> getMessage()
            ], 500);
        }
    }
}
