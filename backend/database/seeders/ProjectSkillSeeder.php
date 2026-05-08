<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Skill;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = Skill::pluck('id')->toArray();

        foreach (Project::all() as $project) {
            // give each user 2-5 random skills
            $randomSkills = collect($skills)->random(rand(2,5))->toArray();

            $project->skills()->sync($randomSkills);
        }
    }
}
