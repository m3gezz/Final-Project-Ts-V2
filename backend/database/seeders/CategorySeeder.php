<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            ['label' => 'Web Development', 'created_at' => now(), 'updated_at' => now()],
            ['label' => 'Mobile Development', 'created_at' => now(), 'updated_at' => now()],
            ['label' => 'UI / UX Design', 'created_at' => now(), 'updated_at' => now()],
            ['label' => 'Data Science', 'created_at' => now(), 'updated_at' => now()],
            ['label' => 'DevOps', 'created_at' => now(), 'updated_at' => now()],
            ['label' => 'Cybersecurity', 'created_at' => now(), 'updated_at' => now()],
            ['label' => 'Game Development', 'created_at' => now(), 'updated_at' => now()],
            ['label' => 'Artificial Intelligence', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
