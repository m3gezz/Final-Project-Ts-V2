<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Skill;

class SkillUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = Skill::pluck('id')->toArray();

        foreach (User::all() as $user) {
            // give each user 2-5 random skills
            $randomSkills = collect($skills)->random(rand(2,5))->toArray();

            $user->skills()->sync($randomSkills);
        }
    }
}
