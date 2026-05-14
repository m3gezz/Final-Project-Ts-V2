<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvitationRequest;
use App\Http\Requests\UpdateInvitationRequest;
use App\Models\Membership;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class InvitationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $request->user()->receivedInvitations()->with(['workspace.project' => function ($q) {
            $q->with('user');
        },'user'])->get();

        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'workspace_id' => 'required',
            'receiver_id' => 'required',
        ]);

        $workspace = Workspace::find($fields['workspace_id']);
        $receiver = User::find($fields['receiver_id']);
        $isMember = $receiver->memberships()->where('workspace_id', $workspace->id)->exists();
        $hasInvitation =$receiver->receivedInvitations()->where('workspace_id', $workspace->id)->exists();
        $hasRequest =$receiver->requests()->where('workspace_id', $workspace->id)->exists();

        if ($isMember || $hasInvitation || $hasRequest) 
            throw ValidationException::withMessages([
                'message' => ['You either already a member, or you have a request.'],
            ]);

        $request->user()->sentInvitations()->create($fields);

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

        return response()->json('updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invitation $invitation)
    {
        $invitation->delete();

        return response()->json('deleted');
    }
}
