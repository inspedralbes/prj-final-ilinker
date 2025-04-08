<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruta_json = './resources/json/users.json';
        if (file_exists($ruta_json)) {
            $json = file_get_contents($ruta_json);
            $users = json_decode($json, true);
            foreach ($users as $user) {
                User::create([
                    'name' => $user['name'],
                    'surname' => $user['surname'],
                    'birthday' => $user['birthday'],
                    'email' => $user['email'],
                    'active' => $user['active'],
                    'email_verified_at' => $user['email_verified_at'],
                    'password' => Hash::make($user['password']),
                    'rol' => $user['rol'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
