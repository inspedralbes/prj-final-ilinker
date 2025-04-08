<?php

namespace App\Http\Controllers;

use App\Models\Institutions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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

    // Upload logo or cover image for institution
    public function uploadImage(Request $request, string $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
                'type' => 'required|in:logo,cover'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $institution = Institutions::findOrFail($id);
            
            // Check if user is authorized to update this institution
            if (Auth::id() !== $institution->user_id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $file = $request->file('image');
            $type = $request->input('type');
            
            // Generate unique filename
            $filename = $type . '_' . $institution->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            // Store file in public storage
            $path = $file->storeAs('institutions/' . $institution->id, $filename, 'public');
            
            // Generate public URL
            $url = Storage::url($path);
            
            // Update institution record
            if ($type === 'logo') {
                $institution->logo = $url;
            } else {
                $institution->cover = $url;
            }
            
            $institution->save();

            return response()->json([
                'status' => 'success',
                'message' => ucfirst($type) . ' image uploaded successfully',
                $type . '_url' => $url
            ]);

        } catch (\Exception $e) {
            Log::error('Error uploading institution image: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error uploading image: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getByCustomUrl(string $customUrl)
    {
        try {
            $institution = Institutions::where('slug', $customUrl)
                ->orWhere('custom_url', $customUrl)
                ->with('user')
                ->first();

            if (!$institution) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Institution not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Institution found',
                'data' => $institution
            ]);
        } catch (\Exception $e) {
            Log::error('Error finding institution: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error finding institution'
            ], 500);
        }
    }
}
