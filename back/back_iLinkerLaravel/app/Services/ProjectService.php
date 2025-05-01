<?php

namespace App\Services;

use App\Models\StudentProject;
use DateTime;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectService
{
    public function __construct()
    {

    }

    public function createProject(Request $request)
    {
        Log::info("Objetos 2", $request->all());
        $project = new StudentProject();

        $project->student_id = $request->student_id;
        $project->name = $request->name;
        $project->description = $request->description;
        $project->link = $request->link;

        $picturePaths = [];

        if ($request->hasFile('pictures') && count($request->file('pictures')) > 0) {
            foreach ($request->file('pictures') as $image) {
                $folderName = Str::slug($request->name);
                $fileName = $image->getClientOriginalName();
                $path = $image->storeAs("projects/{$folderName}", $fileName, 'public');
                $picturePaths[] = $fileName;
            }
        } else {
            // Si no se han subido imágenes, asigna null
            $project->pictures = null;
        }

        if (count($picturePaths) > 0) {
            $project->pictures = json_encode($picturePaths, JSON_UNESCAPED_UNICODE);
        }

        if ($request->filled('end_project')) {
            $date = \DateTime::createFromFormat('d/m/Y', $request->end_project)
                ?: \DateTime::createFromFormat('Y-m-d', $request->end_project);

            if ($date) {
                $project->end_project = $date->format('Y-m-d');
            } else {
                throw new \Exception("Formato de fecha inválido: " . $request->end_project);
            }
        }

        $project->save();

        return $project;
    }

    public function updateProject(Request $request)
    {

        Log::info("Objetos UPDATE", $request->all());

        $project = StudentProject::findOrFail($request->id);
        $project->name = $request->name;
        $project->description = $request->description;
        $project->link = $request->link;

        //$project->pictures = is_string($data['pictures']) ? $data['pictures'] : json_encode($data['pictures'], JSON_UNESCAPED_UNICODE);

        // Obtener las imágenes existentes (si las hay)
        $existingPictures = [];
        if ($request->has('existing_pictures')) {
            $existingPictures = json_decode($request->existing_pictures, true) ?: [];
        } else if ($project->pictures) {
            // Si no se recibió existing_pictures pero hay imágenes en la base de datos, las conservamos
            $existingPictures = json_decode($project->pictures, true) ?: [];
        }

        // Manejar nuevas imágenes
        $newPicturePaths = [];
        if ($request->hasFile('pictures') && count($request->file('pictures')) > 0) {
            $folderName = Str::slug($request->name);

            foreach ($request->file('pictures') as $image) {
                $fileName = $image->getClientOriginalName();
                $path = $image->storeAs("projects/{$folderName}", $fileName, 'public');
                $newPicturePaths[] = $fileName;
            }
        }

        // Combinar imágenes existentes con nuevas
        $allPictures = array_merge($existingPictures, $newPicturePaths);

        // Guardar todas las imágenes en el proyecto
        if (count($allPictures) > 0) {
            $project->pictures = json_encode($allPictures, JSON_UNESCAPED_UNICODE);
        } else {
            $project->pictures = null;
        }



        if (!empty($request['end_project'])) {
            $date = DateTime::createFromFormat('d/m/Y', $request['end_project']);

            if (!$date) {
                $date = DateTime::createFromFormat('Y-m-d', $request['end_project']);
            }

            if ($date) {
                $project->end_project = $date->format('Y-m-d'); // Asignar correctamente la fecha
            } else {
                throw new Exception("Formato de fecha inválido: " . $request['end_project']);
            }
        }
        $project->save();

        return $project;
    }

    public function deleteProject($data)
    {
        // Encontrar el proyecto
        $project = StudentProject::findOrFail($data['id']);

        // Eliminar las imágenes almacenadas
        if ($project->pictures) {
            try {
                // Decodificar la lista de imágenes
                $pictures = json_decode($project->pictures, true);

                // Obtener el nombre de la carpeta basado en el nombre del proyecto
                $folderName = Str::slug($project->name);
                $folderPath = "projects/{$folderName}";

                // Eliminar cada archivo individualmente primero (opcional, pero seguro)
                if (is_array($pictures)) {
                    foreach ($pictures as $picture) {
                        $filePath = "{$folderPath}/{$picture}";
                        if (Storage::disk('public')->exists($filePath)) {
                            Storage::disk('public')->delete($filePath);
                        }
                    }
                }

                // Eliminar el directorio completo
                if (Storage::disk('public')->exists($folderPath)) {
                    Storage::disk('public')->deleteDirectory($folderPath);
                    \Log::info("Directorio eliminado: {$folderPath}");
                }
            } catch (\Exception $e) {
                \Log::error("Error al eliminar archivos del proyecto: " . $e->getMessage());
                // Continuar con la eliminación del proyecto incluso si falla la eliminación de archivos
            }
        }

        // Eliminar el proyecto de la base de datos
        $project->delete();

        return $project;
    }
}
