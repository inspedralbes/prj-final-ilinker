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
                $path = $image->store("projects/{$folderName}", 'public');
                $picturePaths[] = Storage::url($path);
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

    public function updateProject($data)
    {
        $project = StudentProject::findOrFail($data['id']);
        $project->name = $data['name'];
        $project->description = $data['description'];
        $project->link = $data['link'];
        $project->pictures = is_string($data['pictures']) ? $data['pictures'] : json_encode($data['pictures'], JSON_UNESCAPED_UNICODE);
        if (!empty($data['end_project'])) {
            $date = DateTime::createFromFormat('d/m/Y', $data['end_project']);

            if (!$date) {
                $date = DateTime::createFromFormat('Y-m-d', $data['end_project']);
            }

            if ($date) {
                $project->end_project = $date->format('Y-m-d'); // Asignar correctamente la fecha
            } else {
                throw new Exception("Formato de fecha inválido: " . $data['end_project']);
            }
        }
        $project->save();

        return $project;
    }

    public function deleteProject($data)
    {
        $project = StudentProject::findOrFail($data['id']);
        $project->delete();

        return $project;
    }
}
