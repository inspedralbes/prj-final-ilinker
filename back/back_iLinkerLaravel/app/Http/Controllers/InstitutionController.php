<?php

namespace App\Http\Controllers;

use App\Models\Institutions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class InstitutionController extends Controller
{
    // Mostrar todas las instituciones
    public function index()
    {
        $institutions = Institutions::with('user')->get();
        return response()->json($institutions);
    }

    // Para crear una nueva institución
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:institutions|max:255',
            'slug' => 'nullable|string|max:255',
            'custom_url' => 'nullable|string|max:255',
            'slogan' => 'nullable|string|max:255',
            'about' => 'nullable|string',
            'NIF' => 'required|string|unique:institutions|max:255',
            'type' => 'nullable|string|max:255',
            'academic_sector' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'size' => 'nullable|string|max:255',
            'sector' => 'nullable|string|max:255',
            'founded_year' => 'nullable|string|max:255',
            'languages' => 'nullable|array',
            'logo' => 'nullable|string|max:255',
            'cover' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'phone' => 'nullable|integer',
            'email' => 'nullable|email|unique:institutions|max:255',
            'responsible_name' => 'required|string|max:255',
            'responsible_phone' => 'nullable|integer',
            'responsible_email' => 'required|email|unique:institutions|max:255',
            'institution_position' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        // Generate el slug a partir del name 
        if(empty($data['slug'])){
            $data['slug'] = Str::slug($data['name'], '_');
        }

        if (Auth::check()) {
            $data['user_id'] = Auth::id();
        } else if (!isset($data['user_id']) || empty($data['user_id'])) {
            return response()->json([
                'message' => 'Authentication required. Please login or provide a valid user_id.',
                'errors' => ['user_id' => ['User ID is required.']]
            ], 401);
        }

        $institution = Institutions::create($data);
        return response()->json($institution, 201);
    }

    // Mostrar una institución por id
    public function show(string $id)
    {
        $institution = Institutions::with('user')->findOrFail($id);
        return response()->json($institution);
    }

    // Actualizar la institución
    public function update(Request $request, string $id)
    {
        $institution = Institutions::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => ['nullable', 'string', Rule::unique('institutions')->ignore($institution->id), 'max:255'],
            'slug' => 'nullable|string|max:255',
            'custom_url' => 'nullable|string|max:255',
            'slogan' => 'nullable|string|max:255',
            'about' => 'nullable|string',
            'NIF' => ['nullable', 'string', Rule::unique('institutions')->ignore($institution->id), 'max:255'],
            'type' => 'nullable|string|max:255',
            'academic_sector' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'size' => 'nullable|string|max:255',
            'sector' => 'nullable|string|max:255',
            'founded_year' => 'nullable|string|max:255',
            'languages' => 'nullable|array',
            'logo' => 'nullable|string|max:255',
            'cover' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'phone' => 'nullable|integer',
            'email' => ['nullable', 'email', Rule::unique('institutions')->ignore($institution->id), 'max:255'],
            'responsible_name' => 'nullable|string|max:255',
            'responsible_phone' => 'nullable|integer',
            'responsible_email' => ['nullable', 'email', Rule::unique('institutions')->ignore($institution->id), 'max:255'],
            'institution_position' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $institution->update($request->all());
        return response()->json([
            'status' => 'success',
            'message' => 'Institution updated',
            'data' => $institution,

        ]);
    }

    // borrar las institución
    public function destroy(string $id)
    {
        $institution = Institutions::findOrFail($id);
        $institution->delete();
        // return response()->json(null, 204);
        return response()->json([
            'status' => 'success',
            'message' => 'Institution deleted'

        ]);
    }

    public function getByCustomUrl(string $customUrl)
    {
        $institution = Institutions::where('custom_url', $customUrl)
            ->with('user')
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'message' => 'Institution found',
            'data' => $institution
        ]);
    }
}
