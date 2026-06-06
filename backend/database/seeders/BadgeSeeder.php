<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $badges = [
        [
            'id' => 1,
            'label' => 'Icebreaker',
            'description' => 'Created your very first project. Welcome to the arena!',
        ],
        [
            'id' => 2,
            'label' => 'Decathlete',
            'description' => 'Hit the milestone of 10 created projects. There is no stopping you now!',
        ],
        [
            'id' => 3,
            'label' => 'Iterators Gonna Iterate',
            'description' => 'Published your first project update. Keep building in public!',
        ],
        [
            'id' => 4,
            'label' => 'Fresh Face',
            'description' => 'Successfully created your account. The journey begins here.',
        ],
        [
            'id' => 5,
            'label' => 'Welcome Back',
            'description' => 'Logged into the platform as a returning user. Good to see you again!',
        ],
        [
            'id' => 6,
            'label' => 'Certified Human',
            'description' => 'Verified your email address to secure your identity.',
        ],
        [
            'id' => 7,
            'label' => 'Identity Established',
            'description' => 'Updated your profile details for the first time. Let the community know who you are.',
        ],
    ];

    foreach ($badges as $badge) {
        Badge::updateOrCreate(['id' => $badge['id']], $badge);
    }
    }
}
