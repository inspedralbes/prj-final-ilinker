<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institutions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminInstitutionController extends Controller
{
    public function index()
    {
        try {
            $institutions = Institutions::with(['user'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $institutions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar instituciones: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $institution = Institutions::with(['user'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $institution
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Institución no encontrada'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $institution = Institutions::find($id);

            if (!$institution) {
                return response()->json([
                    'success' => false,
                    'message' => 'Institución no encontrada'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255|unique:institutions,name,' . $id,
                // ... otras reglas de validación ...
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->only([
                'name',
                'slug',
                'NIF',
                'type',
                'email',
                'phone',
                'website',
                'responsible_name',
                'responsible_email',
                'responsible_phone',
                'founded_year',
                'specialties'
            ]);

            // Convertir arrays a JSON si existen
            if (isset($data['languages']) && is_array($data['languages'])) {
                $data['languages'] = json_encode($data['languages']);
            }

            if (isset($data['specialties']) && is_array($data['specialties'])) {
                $data['specialties'] = json_encode($data['specialties']);
            }

            $institution->update($data);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $institution->fresh(['user'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar institución',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $institution = Institutions::findOrFail($id);
            $institution->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Institución eliminada correctamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar institución: ' . $e->getMessage()
            ], 500);
        }
    }
}
