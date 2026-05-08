<?php

namespace App\Http\Controllers;

use App\Models\InvitationRequest;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class InvitationRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->has('project_id')) {
            $request->validate(['project_id' => ['required','exists:projects,id']]);

            $invitationRequests = InvitationRequest::where('project_id', $request->project_id)->with(['project', 'user'])->get();
            return response()->json($invitationRequests);
        }

        $invitationRequests = $request->user()->invitationRequestsReceived()->with(['project', 'user'])->get();

        return response()->json($invitationRequests);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $project = Project::findOrFail($request->project_id);
        Gate::authorize('create', [InvitationRequest::class, $project]);

        $fields = $request->validate([
            'project_id' => ['required','exists:projects,id'],
            'receiver_id' => ['required','exists:users,id'],
            'message' => ['required','string','min:5'],
        ]);

        $alreadyMember = ProjectMember::where('project_id', $fields['project_id'])->where('user_id', $fields['receiver_id'])->exists();
        $hasInvitation = InvitationRequest::where('project_id', $fields['project_id'])->where('receiver_id', $fields['receiver_id'])->exists();

        if ($alreadyMember || $hasInvitation) abort(400, 'The receiver is either already a member, or has an invitation');
        
        $invitationRequest = $request->user()->invitationRequestsSent()->create($fields);
        return response()->json($invitationRequest);
    }

    /**
     * Display the specified resource.
     */
    public function show(InvitationRequest $invitationRequest)
    {
        return response()->json($invitationRequest->load(['project', 'user']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InvitationRequest $invitationRequest)
    {
        Gate::authorize('update', $invitationRequest);

        $fields = $request->validate([
            'status' => ['required','string'],
            'seen' => ['sometimes','boolean']
        ]);

        $invitationRequest->update($fields);

        if ($fields['status'] === 'accepted') {
            $projectMember = [
                'project_id' => $invitationRequest->project_id,
                'invited_by' => User::findOrFail($invitationRequest->user_id)->only(['id', 'first_name', 'last_name', 'avatar_url'])
            ];

            $request->user()->projectMemberships()->create($projectMember);
        }

        if ($fields['status'] != 'pending') {
            $invitationRequest->delete();
            return response()->json(['message' => 'Invitation ' . $fields['status'] . ' successfully']);
        }

        return response()->json($invitationRequest->load('user'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InvitationRequest $invitationRequest)
    {
        Gate::authorize('delete', $invitationRequest);

        $invitationRequest->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
