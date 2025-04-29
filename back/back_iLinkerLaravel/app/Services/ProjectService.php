<?php

namespace App\Services;

use App\Models\StudentProject;
use DateTime;
use Exception;

class ProjectService
{
    public function __construct()
    {

    }

    public function createProject($data)
    {
        $project = new StudentProject();

        $project->user_id = $data['user_id'];
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
