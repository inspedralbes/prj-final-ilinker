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

    /**
     * @OA\Post(
     *     path="/api/project/create",
     *     summary="Crea un nou projecte utilitzant el servei projectService",
     *     description="Inicia una transacció a la base de dades per assegurar la integritat. Si la creació falla, es fa rollback i es retorna un missatge d'advertència.",
     *     operationId="createProject",
     *     tags={"Projectes"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         description="Camps requerits pel servei projectService",
     *         @OA\JsonContent(
     *             required={"name", "description"},
     *             @OA\Property(property="name", type="string", example="Projecte Exemple"),
     *             @OA\Property(property="description", type="string", example="Descripció del projecte"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2025-01-01"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2025-12-31"),
     *             @OA\Property(property="status", type="string", example="active"),
     *             @OA\Property(property="owner_id", type="integer", example=1)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Projecte creat correctament",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Project created"),
     *             @OA\Property(property="project", type="object", description="Objecte del projecte creat")
     *         )
     *     ),
     *
     *
     *     @OA\Response(
     *         response=400,
     *         description="Creació fallida amb advertència",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="warning"),
     *             @OA\Property(property="message", type="string", example="Project creation failed")
     *         )
     *     )
     * )
     */
    public function create(Request $request)
    {

        DB::beginTransaction();

        try {

            $project = $this->projectService->createProject($request);

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


    /**
     * @OA\Put(
     *     path="/api/project/update",
     *     summary="Actualitza un projecte existent utilitzant el servei projectService",
     *     description="Inicia una transacció a la base de dades per garantir la integritat. Si l'actualització falla, es fa rollback i es retorna un missatge d'advertència.",
     *     operationId="updateProject",
     *     tags={"Projectes"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         description="Camps requerits pel servei projectService per a actualitzar un projecte",
     *         @OA\JsonContent(
     *             required={"id", "name", "description"},
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="Projecte Actualitzat"),
     *             @OA\Property(property="description", type="string", example="Descripció actualitzada del projecte"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2025-01-01"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2025-12-31"),
     *             @OA\Property(property="status", type="string", example="completed"),
     *             @OA\Property(property="owner_id", type="integer", example=1)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Projecte actualitzat correctament",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Project updated"),
     *             @OA\Property(property="project", type="object", description="Objecte del projecte actualitzat")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=400,
     *         description="Error en l'actualització del projecte",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="error", type="string", example="Descripció de l'error")
     *         )
     *     ),
     *
     * )
     */
    public function update(Request $request)
    {

        DB::beginTransaction();

        try {
            $project = $this->projectService->updateProject($request);

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


    /**
     * @OA\Delete(
     *     path="/api/project/delete",
     *     summary="Elimina un projecte especificat pel seu ID",
     *     description="Esborra un projecte de la base de dades basant-se en l'ID proporcionat. Si falla, retorna un missatge d'advertència o error.",
     *     operationId="deleteProject",
     *     tags={"Projectes"},
     *     security={{"bearerAuth":{}}},
     *     summary="Ruta protegida",
     *     @OA\RequestBody(
     *         required=true,
     *         description="ID del projecte a eliminar",
     *         @OA\JsonContent(
     *             required={"id"},
     *             @OA\Property(property="id", type="integer", example=1)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Projecte eliminat correctament",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Project deleted")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=400,
     *         description="No s'ha pogut eliminar el projecte",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="warning"),
     *             @OA\Property(property="message", type="string", example="Project delete failed")
     *         )
     *     ),
     *
     * )
     *
     * @throws \Illuminate\Validation\ValidationException Si el paràmetre 'id' no es passa o és invàlid.
     */
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
