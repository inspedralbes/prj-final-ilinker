<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Publication;
use App\Models\PublicationComment;
use App\Models\PublicationMedia;
use App\Models\PublicationLike;
use Illuminate\Support\Facades\File;

class PublicationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Leer el archivo JSON
        $jsonPath = resource_path('json/publications.json');
        $jsonData = json_decode(File::get($jsonPath), true);

        if (!isset($jsonData['publications'])) {
            $this->command->error('No se encontraron publicaciones en el archivo JSON');
            return;
        }

        foreach ($jsonData['publications'] as $publicationData) {
            // Crear la publicación
            $publication = Publication::create([
                'user_id' => $publicationData['user_id'],
                'content' => $publicationData['content'],
                'location' => $publicationData['location'],
                'comments_enabled' => $publicationData['comments_enabled'],
                'status' => $publicationData['status'],
                'has_media' => isset($publicationData['media']),
                'likes_count' => isset($publicationData['likes']) ? count($publicationData['likes']) : 0,
                'comments_count' => isset($publicationData['comments']) ? count($publicationData['comments']) : 0
            ]);

            // Crear los medios asociados
            if (isset($publicationData['media'])) {
                foreach ($publicationData['media'] as $mediaData) {
                    PublicationMedia::create([
                        'publication_id' => $publication->id,
                        'file_path' => $mediaData['url'],
                        'media_type' => $mediaData['type'],
                        'display_order' => $mediaData['display_order']
                    ]);
                }
            }

            // Crear los comentarios asociados
            if (isset($publicationData['comments'])) {
                foreach ($publicationData['comments'] as $commentData) {
                    PublicationComment::create([
                        'publication_id' => $publication->id,
                        'user_id' => $commentData['user_id'],
                        'content' => $commentData['content']
                    ]);
                }
            }

            // Crear los likes asociados
            if (isset($publicationData['likes'])) {
                foreach ($publicationData['likes'] as $userId) {
                    PublicationLike::create([
                        'publication_id' => $publication->id,
                        'user_id' => $userId
                    ]);
                }
            }
        }
    }
}
