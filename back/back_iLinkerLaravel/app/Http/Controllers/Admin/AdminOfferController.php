<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class AdminOfferController extends Controller
{
    public function index()
    {
        try {
            $offers = Offer::with(['company'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $offers->items(), // Esto devuelve solo los items del paginador
                // O si prefieres el paginador completo:
                // 'data' => $offers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar ofertas: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $offer = Offer::with(['company', 'usersInterested'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $offer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Oferta no encontrada'
            ], 404);
        }
    }

    public function update(Request $request, $id)
{
    DB::beginTransaction();
    try {
        $offer = Offer::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'skills' => 'nullable|array',
            'salary' => 'sometimes|string|max:100',
            'location_type' => 'nullable|in:hibrido,remoto,presencial',
            'city' => 'sometimes|string|max:100',
            'vacancies' => '',
            'active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Solo toma los campos que son fillable
        $fillableFields = $offer->getFillable();
        $data = $request->only($fillableFields);

        // Convertir skills a JSON si es un array
        if (isset($data['skills'])) {
            $data['skills'] = is_array($data['skills'])
                ? json_encode($data['skills'])
                : $data['skills'];
        }

        $offer->update($data);

        DB::commit();

        return response()->json([
            'success' => true,
            'data' => $offer->fresh(['company'])
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Error al actualizar oferta',
            'error' => env('APP_DEBUG') ? $e->getMessage() : null
        ], 500);
    }
}

    public function updateStatus(Request $request, $id)
    {
        try {
            $offer = Offer::findOrFail($id);

            $request->validate([
                'active' => 'required|boolean'
            ]);

            $offer->update(['active' => $request->active]);

            return response()->json([
                'success' => true,
                'data' => $offer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar estado: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $offer = Offer::findOrFail($id);
            $offer->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Oferta eliminada correctamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar oferta: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getApplications($id)
    {
        try {
            $offer = Offer::with(['usersInterested' => function ($query) {
                $query->withPivot(['status', 'created_at']);
            }])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $offer->usersInterested
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar aplicaciones: ' . $e->getMessage()
            ], 500);
        }
    }
}
