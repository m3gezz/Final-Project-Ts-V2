<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::pluck('id')->toArray();

        for ($i = 0; $i < 15; $i++) {

            // pick random owner
            $ownerId = collect($users)->random();

            $project = Project::create([
                'user_id' => $ownerId,
                'title' => fake()->sentence(3),
                'description' => fake()->paragraph(),
                'category_id' => rand(1, 5),
            ]);

            // choose members excluding owner
            $members = collect($users)
                ->reject(fn ($id) => $id == $ownerId)
                ->random(rand(2,5));

            foreach ($members as $memberId) {
                ProjectMember::create([
                    'project_id' => $project->id,
                    'user_id' => $memberId,
                ]);
            }
        }
    }
}
