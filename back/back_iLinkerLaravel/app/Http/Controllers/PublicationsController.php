<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\PublicationMedia;
use App\Models\PublicationLike;
use App\Models\PublicationComment;
use App\Services\PublicationFileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class PublicationsController extends Controller
{
    protected $fileService;

    public function __construct(PublicationFileService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function index()
    {
        try {
            $userId = Auth::id();
            $publications = Publication::with([
                'user:id,name',
                'media',
                'comments.user:id,name',
                'likes'
            ])
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

            // Add liked status and transform media URLs for each publication
            $publications->getCollection()->transform(function ($publication) use ($userId) {
                $publication->liked = $publication->likes->contains('user_id', $userId);

                // Transform media to include full URLs
                if ($publication->media && count($publication->media) > 0) {
                    foreach ($publication->media as $media) {
                        $media->file_path = $this->fileService->getFileUrl($media->file_path);
                    }
                }

                return $publication;
            });

            return response()->json([
                'status' => 'success',
                'data' => $publications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error retrieving publications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            // Increase the file size limits in the validation rules
            $validator = Validator::make($request->all(), [
                'content' => 'required_without:media|string|nullable',
                'location' => 'nullable|string',
                'comments_enabled' => 'boolean',
                'status' => 'in:published,draft,archived',
                'media.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:50000', // Increased to 50MB per file
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $publication = Publication::create([
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
                'message' => 'Error creating publication',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $publication = Publication::with([
                'user:id,name',
                'media',
                'comments.user:id,name',
                'likes'
            ])->findOrFail($id);

            // Transform media to include full URLs
            if ($publication->media && count($publication->media) > 0) {
                foreach ($publication->media as $media) {
                    $media->file_path = $this->fileService->getFileUrl($media->file_path);
                }
            }

            return response()->json([
                'status' => 'success',
                'data' => $publication
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Publication not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error retrieving publication',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $publication = Publication::findOrFail($id);

            if ($publication->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to update this publication'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'content' => 'nullable|string',
                'location' => 'nullable|string',
                'comments_enabled' => 'boolean',
                'status' => 'in:published,draft,archived',
                'media.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:50000', // Increased to 50MB per file
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

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
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Publication not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error updating publication',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $publication = Publication::findOrFail($id);

            if ($publication->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to delete this publication'
                ], 403);
            }

            // Delete associated media files
            foreach ($publication->media as $media) {
                $this->fileService->deleteFile($media->file_path);
                $media->delete();
            }

            // Delete associated likes and comments
            $publication->likes()->delete();
            $publication->comments()->delete();

            $publication->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Publication deleted successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Publication not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error deleting publication',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // mejorar el manejo de los archivos de media para que se puedan subir mas de un archivo de media
    private function handleMediaUpload($files, Publication $publication)
    {
        if (!is_array($files)) {
            $files = [$files];
        }

        $order = $publication->media()->max('display_order') ?? 0;

        foreach ($files as $file) {

                $order++;
                $mediaType = strpos($file->getMimeType(), 'video') !== false ? 'video' : 'image';

                // Store file using the file service
                $filePath = $this->fileService->storeFile($file, Auth::id());

                PublicationMedia::create([
                    'publication_id' => $publication->id,
                    'file_path' => $filePath,
                    'media_type' => $mediaType,
                    'display_order' => $order
                ]);

        }
    }

    public function removeMedia($publicationId, $mediaId)
    {
        try {
            $publication = Publication::findOrFail($publicationId);

            if ($publication->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to modify this publication'
                ], 403);
            }

            $media = PublicationMedia::where('publication_id', $publicationId)
                ->where('id', $mediaId)
                ->firstOrFail();

            // Delete file from storage
            $this->fileService->deleteFile($media->file_path);
            $media->delete();

            if ($publication->media()->count() === 0) {
                $publication->update(['has_media' => false]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Media removed successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Publication or media not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error removing media',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function myPublications()
    {
        try {
            $userId = Auth::id();
            $publications = Publication::with([
                'media',
                'comments.user:id,name',
                'likes.user.student:id,user_id,name,uuid,photo_pic',
                'likes.user.company:id,user_id,name,slug,logo',
                'likes.user.institutions:id,user_id,name,slug,logo',
            ])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

            // Add liked status and transform media URLs for each publication
            $publications->getCollection()->transform(function ($publication) use ($userId) {
                $publication->liked = $publication->likes->contains('user_id', $userId);

                // Transform media to include full URLs
                if ($publication->media && count($publication->media) > 0) {
                    foreach ($publication->media as $media) {
                        $media->file_path = $this->fileService->getFileUrl($media->file_path);
                    }
                }

                return $publication;
            });

            return response()->json([
                'status' => 'success',
                'data' => $publications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error retrieving your publications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function myLikedPublications(){
        try {
            $userId = Auth::id();
            $idsLikedPublications = PublicationLike::where('user_id', $userId)
                ->get()
                ->pluck('publication_id');

            $publications = Publication::with([
                'media',
                'comments.user:id,name',
                'likes.user.student:id,user_id,name,uuid,photo_pic',
                'likes.user.company:id,user_id,name,slug,logo',
                'likes.user.institutions:id,user_id,name,slug,logo',
            ])
                ->whereIn('id', $idsLikedPublications)
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            // Add liked status and transform media URLs for each publication
            $publications->getCollection()->transform(function ($publication) use ($userId) {
                $publication->liked = $publication->likes->contains('user_id', $userId);

                // Transform media to include full URLs
                if ($publication->media && count($publication->media) > 0) {
                    foreach ($publication->media as $media) {
                        $media->file_path = $this->fileService->getFileUrl($media->file_path);
                    }
                }

                return $publication;
            });

            return response()->json([
                'status' => 'success',
                'data' => $publications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error recogiendo tus me gusta.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function toggleLike($publicationId, Request $request)
    {
        try {
            $publication = Publication::findOrFail($publicationId);

            Log::info("Usuario logueado", ["user" => Auth::user()]);
            Log::info("Usuario Reques", ["user" => $request->all()]);

            $existingLike = PublicationLike::where('publication_id', $publicationId)
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
                PublicationLike::create([
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
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Publication not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error toggling like',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
