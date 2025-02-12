<?php

namespace App\Http\Controllers;

use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    protected $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function create(Request $request)
    {

        $validate = $request->validate([
            'user_id' => 'required',
            'name' => 'required',
            'description' => 'required',
            'link' => 'required',
            'pictures' => 'required',
            'end_project' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $project = $this->projectService->createProject($validate);

            if (!$project) {
                Db::rollBack();
                return response()->json(['status' => 'warning', 'message' => 'Project creation failed']);
            }

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Project created', 'project' => $project]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'error' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request)
    {
        $validate = $request->validate([
            'id' => 'required',
            'name' => 'required',
            'description' => 'required',
            'link' => 'required',
            'pictures' => 'required',
            'end_project' => 'required',
        ]);

        DB::beginTransaction();

        try {
            $project = $this->projectService->updateProject($validate);

            if (!$project) {
                Db::rollBack();
                return response()->json(['status' => 'warning', 'message' => 'Project update failed']);
            }

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Project updated', 'project' => $project]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'error' => $e->getMessage()], 400);
        }
    }

    public function delete(Request $request)
    {
        $validate = $request->validate([
            'id' => 'required',
        ]);

        DB::beginTransaction();

        try {
            $project = $this->projectService->deleteProject($validate);

            if (!$project) {
                Db::rollBack();
                return response()->json(['status' => 'warning', 'message' => 'Project delete failed']);
            }

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Project deleted']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'error' => $e->getMessage()], 400);
        }
    }
}
