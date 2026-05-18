<?php

namespace App\Http\Controllers;

use App\Models\Request;
use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\Workspace;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Validation\ValidationException;

class RequestController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(HttpRequest $req)
    {   
        $requests = $req->user()->requests()->with(['workspace.project.user'])->get();
        return response()->json($requests);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(HttpRequest $req)
    {
        $fields = $req->validate(
            [
                'project_id' => ['required','exists:projects,id'],
            ]
        );

        $workspace = Workspace::where('project_id', $fields['project_id'])->first();

        $isMember = $req->user()->memberships()->where('workspace_id', $workspace->id)->exists();
        $hasRequest = $req->user()->requests()->where('workspace_id', $workspace->id)->exists();

        if ($isMember || $hasRequest) 
            throw ValidationException::withMessages([
                'message' => ['You either already a member, or you have a request.'],
            ]);

        $fields['workspace_id'] = $workspace->id;
        $req->user()->requests()->create($fields);
        return response()->json('created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(HttpRequest $rq, Request $request)
    {
        $this->authorize('update', $request);
        $fields = $rq->validate(
            [
                'status' => ['required','string'],
            ]
        );

        $request->update($fields);

        if ($fields['status'] === 'accepted') {
            Membership::create([
                'workspace_id' => $request->workspace_id,
                'user_id' => $request->user_id,
            ]);
        }
        
        if ($fields['status'] !== 'pending') {
            $request->delete();
        }

        return response()->json('updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $request->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
