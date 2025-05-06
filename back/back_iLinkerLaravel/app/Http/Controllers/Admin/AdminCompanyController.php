<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

class AdminCompanyController extends Controller
{
    public function index()
    {
        try {
            $companies = Company::with(['user', 'sectors'])
                ->withCount('offers')
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $companies
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $company = Company::with(['user', 'sectors', 'offers'])
                ->withCount('offers')
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $company
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Empresa no encontrada'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $company = Company::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'CIF' => 'sometimes|string|max:9|unique:companies,CIF,' . $id,
                'email' => 'sometimes|email|unique:companies,email,' . $id,
                'phone' => 'sometimes|numeric|nullable',
                'website' => 'sometimes|url|nullable',
                'active' => 'sometimes|boolean',
                'responsible_name' => 'sometimes|string|max:255|nullable',
                'responsible_email' => 'sometimes|email|nullable',
                'responsible_phone' => 'sometimes|numeric|nullable',
                'address' => 'sometimes|string|max:255|nullable',
                'city' => 'sometimes|string|max:255|nullable',
                'postal_code' => 'sometimes|numeric|nullable',
                'country' => 'sometimes|string|max:255|nullable',
                'short_description' => 'sometimes|string|nullable',
                'description' => 'sometimes|string|nullable',
                'num_people' => 'sometimes|integer|nullable',
            ]);

            $company->update($validated);

            return response()->json([
                'success' => true,
                'data' => $company->load(['user', 'sectors'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la empresa: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $company = Company::findOrFail($id);

            // Opcional: Desasociar primero las ofertas
            $company->offers()->update(['company_id' => null]);

            $company->delete();

            return response()->json([
                'success' => true,
                'message' => 'Empresa eliminada correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la empresa: ' . $e->getMessage()
            ], 500);
        }
    }
}
