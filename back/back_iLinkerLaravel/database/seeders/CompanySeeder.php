<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta_json = './resources/json/company.json';
        if(file_exists($ruta_json)){
            $json = file_get_contents($ruta_json);
            $company = json_decode($json, true);
            foreach ($company as $key => $value) {
                Company::create([
                    'user_id' => $value['user_id'],
                    'name' => $value['name'],
                    'slug' => $value['slug'],
                    'CIF' => $value['CIF'],
                    'num_people' => $value['num_people'],
                    'logo' => $value['logo'],
                    'short_description' => $value['short_description'],
                    'description' => $value['description'],
                    'email' => $value['email'],
                    'phone' => $value['phone'],
                    'website' => $value['website'],
                    'responsible_name' => $value['responsible_name'],
                    'responsible_phone' => $value['responsible_phone'],
                    'responsible_email' => $value['responsible_email'],
                    'company_position' => $value['company_position'],
                    'address' => $value['address'],
                    'city' => $value['city'],
                    'postal_code' => $value['postal_code'],
                    'country' => $value['country'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
