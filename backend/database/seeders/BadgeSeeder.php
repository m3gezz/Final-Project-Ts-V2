<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('badges')->insert([
            [
                'name' => 'Beginner',
                'description' => 'Joined the platform',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Collaborator',
                'description' => 'Worked with other users on projects',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Helper',
                'description' => 'Helped other members',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Problem Solver',
                'description' => 'Solved difficult problems',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Active Member',
                'description' => 'Very active in the community',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Project Creator',
                'description' => 'Created a project',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Team Player',
                'description' => 'Worked well in teams',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Expert',
                'description' => 'Highly skilled member',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
