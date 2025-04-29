<?php

namespace Database\Seeders;

use App\Models\Institutions;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InstitutionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta_json = './resources/json/institutions.json';
        if(file_exists($ruta_json)){
            $json = file_get_contents($ruta_json);
            $institutions = json_decode($json, true);
            foreach($institutions as $institution){
                Institutions::create([
                    'user_id' => $institution['user_id'],
                    'name' => $institution['name'],
                    'slug' => \Illuminate\Support\Str::slug($institution['name']),
                    'NIF' => $institution['NIF'],
                    'type' => $institution['type'],
                    'academic_sector' => $institution['academic_sector'],
                    'logo' => $institution['logo'],
                    'phone' => $institution['phone'],
                    'email' => $institution['email'],
                    'website' => $institution['website'],
                    'responsible_name' => $institution['responsible_name'],
                    'responsible_phone' => $institution['responsible_phone'],
                    'responsible_email' => $institution['responsible_email'],
                    'institution_position' => $institution['institution_position'],
                    'address' => $institution['address'],
                    'city' => $institution['city'],
                    'country' => $institution['country'],
                    'postal_code' => $institution['postal_code'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}