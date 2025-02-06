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

    public function assignment(Request $request)
    {
        $validated = $request->validate([
           'student_id' => 'required',
           'skills_id' => 'required',
        ]);

        DB::beginTransaction();

        try{

            $skill = $this->skillService->assignStudent($validated);
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

    public function delete(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
        ]);

        DB::beginTransaction();

        try{

            $skills = $this->skillService->deleteSkill($validated['id']);
            if (!$skills) {
                throw new \Exception('Error al eliminar una skill');
            }

            DB::commit();
            return response()->json(['status' => 'success', 'message'=>'Skill eliminada correctamente' ,'skills' => $skills]);

        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
