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
            'custom_url' => 'nullable|string|max:255',
            'slogan' => 'nullable|string|max:255',
            'about' => 'nullable|string',
            'type' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'size' => 'nullable|string|max:255',
            'sector' => 'nullable|string|max:255',
            'founded_year' => 'nullable|string|max:255',
            'languages' => 'nullable|array',
            'website' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:institutions|max:255',
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

    public function update(Request $request)
    {
        try {
            if (!$request->has('id')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Institution ID is required'
                ], 422);
            }

            $institution = Institutions::findOrFail($request->id);
            
            // si hay archivos de logo o cover se actualizan 
            if ($request->hasFile('logo') || $request->hasFile('cover')) {
                if ($request->hasFile('logo')) {
                    $fileName = "logo_{$institution->id}." . $request->file('logo')->getClientOriginalExtension();
                    $request->file('logo')->move(storage_path('app/public/institutions'), $fileName);
                    $institution->logo = "institutions/{$fileName}";
                }

                if ($request->hasFile('cover')) {
                    $fileName = "cover_{$institution->id}." . $request->file('cover')->getClientOriginalExtension();
                    $request->file('cover')->move(storage_path('app/public/institutions'), $fileName);
                    $institution->cover = "institutions/{$fileName}";
                }

                $institution->save();
            } else {
                // For regular data updates
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
                    'languages.*' => 'string',
                    'specialties' => 'nullable|array',
                    'specialties.*' => 'string',
                    'website' => 'nullable|string',
                    'phone' => 'nullable|string',
                    'email' => ['nullable', 'email', Rule::unique('institutions')->ignore($institution->id)]
                ]);

                if ($validator->fails()) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Validation failed',
                        'errors' => $validator->errors()
                    ], 422);
                }

                $updateData = $request->only([
                    'name', 'slogan', 'about', 'type', 'location', 
                    'size', 'founded_year', 'languages', 'specialties', 
                    'website', 'phone', 'email'
                ]);

                foreach ($updateData as $key => $value) {
                    if ($value !== null) {
                        $institution->$key = $value;
                    }
                }

                $institution->save();
            }

            // Prepare response with full URLs
            $responseData = $institution->fresh()->toArray();
            $baseUrl = url('storage');
            $responseData['logo_url'] = $institution->logo ? "{$baseUrl}/{$institution->logo}" : null;
            $responseData['cover_url'] = $institution->cover ? "{$baseUrl}/{$institution->cover}" : null;

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

    public function show(string $id)
    {
        try {
            $institution = Institutions::with('user')->findOrFail($id);
            
            $baseUrl = url('storage');
            $responseData = $institution->toArray();
            $responseData['logo_url'] = $institution->logo ? "{$baseUrl}/{$institution->logo}" : null;
            $responseData['cover_url'] = $institution->cover ? "{$baseUrl}/{$institution->cover}" : null;

            return response()->json([
                'status' => 'success',
                'data' => $responseData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Institution not found'
            ], 404);
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
            $responseData = $institution->toArray();
            $responseData['logo_url'] = $institution->logo ? "{$baseUrl}/{$institution->logo}" : null;
            $responseData['cover_url'] = $institution->cover ? "{$baseUrl}/{$institution->cover}" : null;

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
