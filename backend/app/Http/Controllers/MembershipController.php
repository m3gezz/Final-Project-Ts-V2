<?php

namespace App\Http\Controllers;

use App\Models\Membership;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMembershipRequest;
use App\Http\Requests\UpdateMembershipRequest;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate(
            [
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
    public function show(Membership $membership)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMembershipRequest $request, Membership $membership)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Membership $membership)
    {
        //
    }
}
