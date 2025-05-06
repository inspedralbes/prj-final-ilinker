<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Publications;
use App\Models\PublicationComment;
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
            $publication = Publications::create([
                'user_id' => 1, // Asignar al primer usuario por defecto
                'content' => $publicationData['content'],
                'location' => $publicationData['location'],
                'comments_enabled' => $publicationData['comments_enabled'],
                'status' => $publicationData['status'],
                'has_media' => isset($publicationData['media']),
                'likes_count' => 0
            ]);

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
        }

        $this->command->info('Publicaciones y comentarios creados exitosamente.');
    }
} 