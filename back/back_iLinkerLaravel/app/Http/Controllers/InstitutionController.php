<?php

namespace App\Http\Controllers;

use App\Models\Institutions;
use App\Services\InstitutionService;
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
            'type' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'size' => 'nullable|string|max:255',
            'sector' => 'nullable|string|max:255',
            'founded_year' => 'nullable|string|max:255',
            'languages' => 'nullable|array',
            'specialties' => 'nullable|array',
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

            if (Auth::check()) {
                $data['user_id'] = Auth::id();
            }

            // Generate slug from name if not provided
            if (!isset($data['slug']) || empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);

                // Ensure slug uniqueness
                $slug = $data['slug'];
                $counter = 1;
                while (Institutions::where('slug', $data['slug'])->exists()) {
                    $data['slug'] = $slug . '-' . $counter;
                    $counter++;
                }
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
            if (!Auth::check()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 401);
            }

            if (!$request->has('id')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Institution ID is required'
                ], 422);
            }

            $institution = Institutions::findOrFail($request->id);

            // Check if authenticated user owns this institution
            if ($institution->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to update this institution'
                ], 403);
            }

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

                        // Update slug if name changes
                        if ($key === 'name') {
                            $newSlug = Str::slug($value);
                            $originalSlug = $newSlug;
                            $counter = 1;

                            // Ensure slug uniqueness excluding current institution
                            while (Institutions::where('slug', $newSlug)
                                ->where('id', '!=', $institution->id)
                                ->exists()) {
                                $newSlug = $originalSlug . '-' . $counter;
                                $counter++;
                            }

                            $institution->slug = $newSlug;
                        }
                    }
                }

                $institution->save();
            }

            // Prepare response with full URLs
            $responseData = $institution->fresh()->toArray();
            $baseUrl = config('app.url') . '/storage';
            $responseData['logo_url'] = $institution->logo ? $baseUrl . '/' . ltrim($institution->logo, '/') : null;
            $responseData['cover_url'] = $institution->cover ? $baseUrl . '/' . ltrim($institution->cover, '/') : null;

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

            $baseUrl = config('app.url') . '/storage';
            $responseData = $institution->toArray();
            $responseData['logo_url'] = $institution->logo ? $baseUrl . '/' . ltrim($institution->logo, '/') : null;
            $responseData['cover_url'] = $institution->cover ? $baseUrl . '/' . ltrim($institution->cover, '/') : null;

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

    public function getInstitution($slug)
    {
        $institution = Institutions::where('slug', $slug)->with('user')->first();

        if (!$institution) {
            return response()->json([
                'status' => 'error',
                'message' => 'Institution not found'
            ], 404);
        }

        $baseUrl = config('app.url') . '/storage';
        $responseData = $institution->toArray();
        $responseData['logo_url'] = $institution->logo ? $baseUrl . '/' . ltrim($institution->logo, '/') : null;
        $responseData['cover_url'] = $institution->cover ? $baseUrl . '/' . ltrim($institution->cover, '/') : null;

        return response()->json([
            'status' => 'success',
            'data' => $responseData
        ]);
    }

    public function getByCustomUrl($customUrl)
    {
        $institution = Institutions::where('slug', $customUrl)->orWhere('custom_url', $customUrl)->with('user')->first();

        if (!$institution) {
            return response()->json([
                'status' => 'error',
                'message' => 'Institution not found'
            ], 404);
        }

        $baseUrl = config('app.url') . '/storage';
        $responseData = $institution->toArray();
        $responseData['logo_url'] = $institution->logo ? $baseUrl . '/' . ltrim($institution->logo, '/') : null;
        $responseData['cover_url'] = $institution->cover ? $baseUrl . '/' . ltrim($institution->cover, '/') : null;

        return response()->json([
            'status' => 'success',
            'data' => $responseData
        ]);
    }

    public function checkOwner(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'institution_id' => 'required|exists:institutions,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $institution = Institutions::findOrFail($request->institution_id);
            $isOwner = $institution->user_id === $request->user_id;

            return response()->json([
                'status' => 'success',
                'isOwner' => $isOwner
            ]);
        } catch (\Exception $e) {
            Log::error('Error checking institution ownership: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error checking institution ownership'
            ], 500);
        }
    }
}
