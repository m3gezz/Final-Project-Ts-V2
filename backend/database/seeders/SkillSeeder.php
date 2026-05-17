<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = [

            // Backend
            'Laravel',
            'PHP',
            'Node.js',
            'Express.js',
            'Python',
            'Django',
            'Java',
            'Spring Boot',
            'C#',
            '.NET',
            // Frontend
            'JavaScript',
            'TypeScript',
            'React',
            'Vue.js',
            'Next.js',
            'Nuxt.js',
            'HTML',
            'CSS',
            'Tailwind CSS',
            'Bootstrap',

            // Mobile
            'Flutter',
            'React Native',
            'Kotlin',
            'Swift',

            // Databases
            'MySQL',
            'PostgreSQL',
            'MongoDB',
            'SQLite',
            'Redis',

            // DevOps
            'Docker',
            'Kubernetes',
            'CI/CD',
            'GitHub Actions',
            'AWS',
            'Azure',
            'Linux',

            // Tools
            'Git',
            'Figma',
            'Postman',
            'Jira',
            'Trello',

            // Concepts
            'REST APIs',
            'GraphQL',
            'Microservices',
            'Unit Testing',
            'TDD',
            'Agile',
            'Scrum',
            'Clean Architecture',
            'Design Patterns',

            // Soft Skills
            'Teamwork',
            'Communication',
            'Problem Solving',
            'Leadership',
        ];

        foreach ($skills as $skill) {
            Skill::firstOrCreate(['label' => $skill]);
        }
    }
}
