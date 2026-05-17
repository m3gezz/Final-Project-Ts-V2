<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\User;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $invitations = $request->user()->receivedInvitations()->with(['user','workspace.project.user'])->get();
        return response()->json($invitations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'workspace_id' => ['required'],
            'user_id' => ['required','exists:users,id']
        ]);

        $receiver = User::findOrFail($fields['user_id']);

        $isMember = $receiver->memberships()->where('workspace_id', $fields['workspace_id'])->exists();
        $hasInvitation =$receiver->invitations()->where('workspace_id', $fields['workspace_id'])->exists();
        $hasRequest =$receiver->requests()->where('workspace_id', $fields['workspace_id'])->exists();

        if ($isMember || $hasInvitation || $hasRequest) abort(403, 'You either already a member, or you have a request.');

        $receiver->invitations()->create($fields);
        return response()->json('created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invitation $invitation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invitation $invitation)
    {
         $fields = $request->validate(
            [
                'status' => ['required','string'],
            ]
        );

        $invitation->update($fields);

        if ($fields['status'] === 'accepted') {
            Membership::create([
                'workspace_id' => $invitation->workspace_id,
                'user_id' => $invitation->receiver_id,
            ]);
        }

        if ($fields['status'] !== 'pending') {
            $invitation->delete();
        }

        return response()->json('updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invitation $invitation)
    {
        $invitation->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
