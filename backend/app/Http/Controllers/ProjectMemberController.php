<?php

namespace App\Http\Controllers;

use App\Models\ProjectMember;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProjectMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $members = Project::with('members.user')->findOrFail($request->project_id)->members;

        return response()->json($members);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $project = Project::findOrFail($request->project_id);
        Gate::authorize('create', [ProjectMember::class, $project]);

        $fields = $request->validate(
            [
                'user_id' => ['required','exists:users,id'],
                'project_id' => ['required','exists:projects,id'],
                'role' => ['sometimes','string'],
            ]
        );

        $exist = ProjectMember::where('project_id', $fields['project_id'])->where('user_id', $fields['user_id'])->exists();

        if ($exist) abort(422, 'User is already a member');

        $fields['invited_by'] = $request->user()->only(['id', 'first_name', 'last_name', 'avatar_url']);
        $projectMember = ProjectMember::create($fields);

        return response()->json($projectMember);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectMember $projectMember)
    {
        return response()->json($projectMember->load('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProjectMember $projectMember)
    {
        Gate::authorize('update', $projectMember);
        $fields = $request->validate(['role' => ['required','string'],]);

        $projectMember->update($fields);

        return response()->json($projectMember->load('user'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectMember $projectMember)
    {
        Gate::authorize('delete', $projectMember);

        $projectMember->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
