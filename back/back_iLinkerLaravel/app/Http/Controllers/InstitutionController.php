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
    public function index()
    {
        $institutions = Institutions::with('user')->get();
        return response()->json($institutions);
    }

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
            'phone' => 'nullable|string',
            'email' => 'nullable|email|unique:institutions|max:255',
            'responsible_name' => 'required|string|max:255',
            'responsible_phone' => 'nullable|string',
            'responsible_email' => 'required|email|unique:institutions|max:255',
            'institution_position' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->all();

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name'], '_');
            }

            if (Auth::check()) {
                $data['user_id'] = Auth::id();
            } else if (!isset($data['user_id']) || empty($data['user_id'])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Authentication required',
                    'errors' => ['user_id' => ['User ID is required.']]
                ], 401);
            }

            $institution = Institutions::create($data);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Institution created successfully',
                'data' => $institution
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating institution: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error creating institution'
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $institution = Institutions::with('user')->findOrFail($id);
            return response()->json([
                'status' => 'success',
                'data' => $institution
            ]);
        } catch (\Exception $e) {
            Log::error('Error finding institution: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Institution not found'
            ], 404);
        }
    }

    public function update(Request $request)
    {
        try {
            // First verify we have an ID
            if (!$request->has('id')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Institution ID is required'
                ], 422);
            }

            $institution = Institutions::findOrFail($request->id);

            // Different validation rules based on whether we're handling file uploads
            if ($request->hasFile('logo') || $request->hasFile('cover')) {
                $validator = Validator::make($request->all(), [
                    'id' => 'required|exists:institutions,id',
                    'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
                    'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120'
                ]);
            } else {
                $validator = Validator::make($request->all(), [
                    'id' => 'required|exists:institutions,id',
                    'name' => ['nullable', 'string', Rule::unique('institutions')->ignore($institution->id)],
                    'slogan' => 'nullable|string',
                    'about' => 'nullable|string',
                    'type' => 'nullable|string',
                    'location' => 'nullable|string',
                    'size' => 'nullable|string',
                    'founded_year' => 'nullable|string',
                    'languages' => 'nullable|array',
                    'specialties' => 'nullable|array',
                    'website' => 'nullable|string',
                    'phone' => 'nullable|string',
                    'email' => ['nullable', 'email', Rule::unique('institutions')->ignore($institution->id)]
                ]);
            }

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Handle file uploads if present
            if ($request->hasFile('logo')) {
                $fileName = "logo_{$institution->id}." . $request->file('logo')->getClientOriginalExtension();
                $request->file('logo')->move(storage_path('app/public/institutions'), $fileName);
                $institution->logo = "institutions/{$fileName}";
                $institution->save();
            }

            if ($request->hasFile('cover')) {
                $fileName = "cover_{$institution->id}." . $request->file('cover')->getClientOriginalExtension();
                $request->file('cover')->move(storage_path('app/public/institutions'), $fileName);
                $institution->cover = "institutions/{$fileName}";
                $institution->save();
            }

            // Update regular fields if this is not a file upload request
            if (!$request->hasFile('logo') && !$request->hasFile('cover')) {
                $data = $request->except(['logo', 'cover', 'id']);
                $institution->update($data);
            }

            // Prepare response with full URLs
            $baseUrl = url('storage');
            $responseData = array_merge($institution->fresh()->toArray(), [
                'logo_url' => $institution->logo ? "{$baseUrl}/{$institution->logo}" : null,
                'cover_url' => $institution->cover ? "{$baseUrl}/{$institution->cover}" : null
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Institution updated successfully',
                'data' => $responseData
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating institution: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error updating institution: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $institution = Institutions::findOrFail($id);
            $institution->delete();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Institution deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting institution: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error deleting institution'
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

            $baseUrl = url('storage');
            $responseData = array_merge($institution->toArray(), [
                'logo_url' => $institution->logo ? "{$baseUrl}/{$institution->logo}" : null,
                'cover_url' => $institution->cover ? "{$baseUrl}/{$institution->cover}" : null
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Institution found',
                'data' => $responseData
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
