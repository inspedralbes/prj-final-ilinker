<?php

namespace App\Services;

use App\Models\Company;
use App\Models\StudentExperience;
use DateTime;
use Exception;

class ExperienceService
{
    public function ___construct(){

    }

    public function createExperience($data)
    {

        $experience = new StudentExperience();

        $experience->student_id = $data['student_id'];

        if($data['company_id'] === null){
            $experience->company_id = null;
            $experience->company_name = $data['company_name'] ?? null;
            $experience->company_address = $data['company_address'] ?? null;
        }else{
            $company = Company::findOrFail($data['company_id']);

            if($company){
                $experience->company_id = $company->id;
                $experience->company_name = $company->name;
                $experience->company_address = $company->address;
            }else{
                $experience->company_id = null;
                $experience->company_name = $data['company_name'] ?? null;
                $experience->company_address = $data['company_address']??null;
            }
        }

        $experience->department = $data['department'];
        $experience->employee_type = $data['employee_type'];
        $experience->location_type = $data['location_type'];

        if (!empty( $data['start_date'])) {
            $fecha = DateTime::createFromFormat('d/m/Y',  $data['start_date']);
            if ($fecha) {
                $experience->start_date = $fecha->format('Y-m-d'); // Convertir al formato SQL
            } else {
                // Manejar error de formato
                throw new Exception("Formato de fecha inválido: " . $data['start_date']);
            }
        }

        if (!empty( $data['end_date'])) {
            $fecha = DateTime::createFromFormat('d/m/Y',  $data['end_date']);
            if ($fecha) {
                $experience->end_date = $fecha->format('Y-m-d'); // Convertir al formato SQL
            } else {
                // Manejar error de formato
                throw new Exception("Formato de fecha inválido: " . $data['end_date']);
            }
        }


        $experience->save();

        return $experience;
    }
    public function updateExperience($data)
    {
        $experience = StudentExperience::findOrFail($data['id']);

        if($data['company_id'] === null){
            $experience->company_id = null;
            $experience->company_name = $data['company_name'] ?? null;
            $experience->company_address = $data['company_address'] ?? null;
        }else{
            $company = Company::findOrFail($data['company_id']);
            if($company){
                $experience->company_id = $company->id;
                $experience->company_name = $company->name;
                $experience->company_address = $company->address;
            }else{
                $experience->company_id = null;
                $experience->company_name = $data['company_name'] ?? null;
                $experience->company_address = $data['company_address']??null;
            }
        }

        $experience->department = $data['department'];
        $experience->employee_type = $data['employee_type'];
        $experience->location_type = $data['location_type'];

        if (!empty( $data['start_date'])) {
            $fecha = DateTime::createFromFormat('d/m/Y',  $data['start_date']);
            if ($fecha) {
                $experience->start_date = $fecha->format('Y-m-d'); // Convertir al formato SQL
            } else {
                // Manejar error de formato
                throw new Exception("Formato de fecha inválido: " . $data['start_date']);
            }
        }

        if (!empty( $data['end_date'])) {
            $fecha = DateTime::createFromFormat('d/m/Y',  $data['end_date']);
            if ($fecha) {
                $experience->end_date = $fecha->format('Y-m-d'); // Convertir al formato SQL
            } else {
                // Manejar error de formato
                throw new Exception("Formato de fecha inválido: " . $data['end_date']);
            }
        }

        $experience->save();

        return $experience;
    }

    public function deleteExperience($data)
    {
        $experience = StudentExperience::findOrFail($data['id']);
        if($experience){
            $experience->delete();
            return $experience;
        }
        return null;
    }
}
