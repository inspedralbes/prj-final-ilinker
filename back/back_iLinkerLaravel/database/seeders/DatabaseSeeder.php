<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        /*
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);*/

        $this->call([
            SkillSeeder::class,
            SectorSeeder::class,
            CoursesSeeder::class,
            UserSeeder::class,
            CompanySeeder::class,
            InstitutionsSeeder::class,
            StudentSeeder::class,
            OfferSeeder::class,
            StudentEducationSeeder::class,
            StudentExperienceSeeder::class,
            StudentSkillsSeeder::class,
            StudentProjectSeeder::class,
            PublicationsSeeder::class,
        ]);
    }
}
