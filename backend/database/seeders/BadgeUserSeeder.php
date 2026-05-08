<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Badge;

class BadgeUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $badges = Badge::pluck('id')->toArray();

        foreach (User::all() as $user) {

            // each user gets 1–3 random badges
            $randomBadges = collect($badges)
                ->random(rand(1,3))
                ->toArray();

            $user->badges()->sync($randomBadges);
        }
    }
}
