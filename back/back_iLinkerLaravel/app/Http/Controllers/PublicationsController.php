<?php

namespace App\Http\Controllers;

use App\Models\Publications;
use Illuminate\Http\Request;
use App\Models\PublicationsLike;
use App\Models\PublicationsMedia;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PublicationsController extends Controller
{
    public function index()
    {
        $publications = Publications::with(['user:id,name', 'media'])->where('status', 'published')->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $publications
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required_without:media|string|nullable',
            'location' => 'nullable|string',
            'comments_enabled' => 'boolean',
            'status' => 'in:published,draft,archived',
            'media.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Crear publicación
            $publication = Publications::create([
                'user_id' => Auth::id(),
                'content' => $request->content,
                'location' => $request->location,
                'comments_enabled' => $request->input('comments_enabled', true),
                'status' => $request->input('status', 'published'),
                'has_media' => $request->hasFile('media')
            ]);

            if ($request->hasFile('media')) {
                $this->handleMediaUpload($request->file('media'), $publication);
            }

            $publication->load(['user:id,name', 'media']);

            return response()->json([
                'status' => 'success',
                'message' => 'Publication created successfully',
                'data' => $publication
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error creating publication: ' . $e->getMessage()
            ], 500);
        }
    }

    // Obtiene una publicación por su ID
    public function show($id)
    {
        $publication = Publications::with(['user:id,name', 'media', 'comments.user:id,name'])
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $publication
        ]);
    }

    public function update(Request $request, $id)
    {
        $publication = Publications::findOrFail($id);

        if ($publication->user_id != Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to update this publication'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required_without:media|string|nullable',
            'location' => 'nullable|string',
            'comments_enabled' => 'boolean',
            'status' => 'in:published,draft,archived',
            'media.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $publication->update([
                'content' => $request->input('content', $publication->content),
                'location' => $request->input('location', $publication->location),
                'comments_enabled' => $request->input('comments_enabled', $publication->comments_enabled),
                'status' => $request->input('status', $publication->status),
                'has_media' => $publication->has_media || $request->hasFile('media')
            ]);

            if ($request->hasFile('media')) {
                $this->handleMediaUpload($request->file('media'), $publication);
            }

            $publication->load(['user:id,name', 'media']);

            return response()->json([
                'status' => 'success',
                'message' => 'Publication updated successfully',
                'data' => $publication
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error updating publication: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $publication = Publications::findOrFail($id);

        if ($publication->user_id != Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No esta autorizado para eliminar esta publicación'
            ], 403);
        }

        foreach ($publication->media as $media) {
            $filePath = storage_path('app/public/' . $media->file_path);
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $publication->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Publicación eliminada exitosamente'
        ]);
    }

    // obtener mis publicaciones que he creado
    public function myPublications()
    {
        $publications = Publications::with(['media'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $publications
        ]);
    }

    private function handleMediaUpload($files, Publications $publication)
    {
        if (!is_array($files)) {
            $files = [$files];
        }

        $order = $publication->media()->max('display_order') ?? 0;
        $uploadedFiles = [];

        try {
            foreach ($files as $file) {
                $order++;

                // Validar tamaño del archivo (máximo 10MB)
                if ($file->getSize() > 10 * 1024 * 1024) {
                    throw new \Exception('File size exceeds 10MB limit');
                }

                // Determinar tipo de archivo
                $mediaType = strpos($file->getMimeType(), 'video') !== false ? 'video' : 'image';

                // Crear nombre de archivo con ID de publicación y marca de tiempo
                $fileName = "pub_{$publication->id}_{$order}_" . time() . '.' . $file->getClientOriginalExtension();

                // Mover archivo a almacenamiento
                $file->move(storage_path('app/public/publications'), $fileName);

                // Crear registro de media
                $media = PublicationsMedia::create([
                    'publication_id' => $publication->id,
                    'file_path' => 'publications/' . $fileName,
                    'media_type' => $mediaType,
                    'display_order' => $order
                ]);

                $uploadedFiles[] = $media;
            }

            return $uploadedFiles;
        } catch (\Exception $e) {
            // Si hay un error, eliminar cualquier archivo subido
            foreach ($uploadedFiles as $media) {
                $filePath = storage_path('app/public/' . $media->file_path);
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
                $media->delete();
            }
            throw $e;
        }
    }

    // togglelike es para dar like a una publicacion y deslike
    public function toggleLike($publicationId)
    {
        $publication = Publications::findOrFail($publicationId);

        $existingLike = PublicationsLike::where('publication_id', $publicationId)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $publication->decrement('likes_count');

            return response()->json([
                'status' => 'success',
                'message' => 'Publication unliked successfully',
                'liked' => false,
                'likes_count' => $publication->likes_count
            ]);
        } else {
            PublicationsLike::create([
                'publication_id' => $publicationId,
                'user_id' => Auth::id()
            ]);
            $publication->increment('likes_count');

            return response()->json([
                'status' => 'success',
                'message' => 'Publication liked successfully',
                'liked' => true,
                'likes_count' => $publication->likes_count
            ]);
        }
    }

    
}
