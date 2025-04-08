<?php

namespace App\Http\Controllers;

use App\Services\SkillService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SkillController extends Controller
{
    protected $skillService;

    public function __construct(SkillService $skillService)
    {
        $this->skillService = $skillService;
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
           'name' => 'required',
        ]);

        DB::beginTransaction();

        try{

            $skill = $this->skillService->createSkill($validated);

            if (!$skill) {
                throw new \Exception('Error al crear una skill');
            }

            DB::commit();
            return response()->json(['status' => 'success', 'skill' => $skill]);


        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }

    }

    public function assigment(Request $request)
    {
        $validated = $request->validate([
           'student_id' => 'required',
           'skill_id' => 'required',
        ]);

        DB::beginTransaction();

        try{

            //$skill =

        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
