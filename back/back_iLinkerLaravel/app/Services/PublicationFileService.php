<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PublicationFileService
{
    /**
     * guardar archivos de publicación (imagen o video)
     *
     * @param UploadedFile $file
     * @param int $userId
     * @return string
     */
    public function storeFile(UploadedFile $file, int $userId): string
    {
        // crear el directorio del usuario si no existe
        $userPath = "publications/user_{$userId}";
        if (!Storage::disk('publications')->exists($userPath)) {
            Storage::disk('publications')->makeDirectory($userPath);
        }

        // Generar un nombre de archivo único
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid() . '.' . $extension;

        // guardar el archivo
        $file->storeAs($userPath, $filename, 'publications');

        return "publications/user_{$userId}/{$filename}";
    }

    /**
     * Delete a publication file
     *
     * @param string $filePath
     * @return bool
     */
    public function deleteFile(string $filePath): bool
    {
        return Storage::disk('publications')->delete($filePath);
    }

    /**
     * coger la URL completa para un archivo de publicación
     *
     * @param string $filePath
     * @return string
     */
    public function getFileUrl(string $filePath): string
    {
        return asset("storage/{$filePath}");
    }
} 