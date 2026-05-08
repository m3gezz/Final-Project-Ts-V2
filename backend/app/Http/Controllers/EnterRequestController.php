<?php

namespace App\Http\Controllers;

use App\Models\EnterRequest;
use App\Models\ProjectMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class EnterRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->has('project_id')) {
            $request->validate(['project_id' => ['required','exists:projects,id']]);
            $enterRequests = EnterRequest::with('user')->where('project_id', $request->project_id)->where('status', 'pending')->paginate(20);
            return response()->json($enterRequests);
        }
        $enterRequests = $request->user()->enterRequests()->with('project')->paginate(20);

        return response()->json($enterRequests);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate(
            [
                'project_id' => ['required','exists:projects,id'],
                'message' => ['required','string','min:10','max:255']
            ]
        );

        $alreadyMember = ProjectMember::where('project_id', $fields['project_id'])->where('user_id', $request->user()->id)->exists();
        $haRequest = EnterRequest::where('project_id', $fields['project_id'])->where('user_id', $request->user()->id)->exists();

        if ($alreadyMember || $haRequest) abort(400, 'You either already a member, or you have a request');

        $enterRequest = $request->user()->enterRequests()->create($fields);

        return response()->json($enterRequest->load('user'));
    }

    /**
     * Display the specified resource.
     */
    public function show(EnterRequest $enterRequest)
    {
        return response()->json($enterRequest->load('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EnterRequest $enterRequest)
    {
        Gate::authorize('update', $enterRequest);
        $fields = $request->validate(
            [
                'status' => ['required','string'],
                'seen' => ['sometimes'.'boolean']
            ]
        );

        $enterRequest->update($fields);

        if ($fields['status'] === 'accepted') {
            $projectMember = [
                'project_id' => $enterRequest->project_id,
                'user_id' => $enterRequest->user_id,
                'invited_by' => $request->user()->only(['id', 'first_name', 'last_name', 'avatar_url'])
            ];

            ProjectMember::create($projectMember);
        }

        if ($fields['status'] != 'pending') {
            $enterRequest->delete();
            return response()->json(['message' => 'Request ' . $fields['status'] . ' successfully']);
        }

        return response()->json($enterRequest->load('user'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EnterRequest $enterRequest)
    {
        Gate::authorize('delete', $enterRequest);
        
        $enterRequest->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
