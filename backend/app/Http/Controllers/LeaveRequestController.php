<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\ProjectMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->has('project_id')) {
            $request->validate(['project_id' => ['required','exists:projects,id']]);

            $leaveRequests = LeaveRequest::where('project_id', $request->project_id)->with(['project', 'user'])->get();
            return response()->json($leaveRequests);
        }

        $leaveRequests = $request->user()->leaveRequestsSent()->with(['project'])->get();

        return response()->json($leaveRequests);
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
        $haRequest = LeaveRequest::where('project_id', $fields['project_id'])->where('user_id', $request->user()->id)->exists();

        if (!$alreadyMember || $haRequest) abort(400, 'You either not a member, or you have a request');

        $leaveRequest = $request->user()->leaveRequests()->create($fields);

        return response()->json($leaveRequest->load('user'));
    }

    /**
     * Display the specified resource.
     */
    public function show(LeaveRequest $leaveRequest)
    {
        return response()->json($leaveRequest);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LeaveRequest $leaveRequest)
    {
        Gate::authorize('update', $leaveRequest);
        $fields = $request->validate(
            [
                'status' => ['required','string'],
                'seen' => ['sometimes','boolean']
            ]
        );

        $leaveRequest->update($fields);

        if ($fields['status'] === 'accepted') ProjectMember::where('user_id',$leaveRequest->user_id)->delete();

        if ($fields['status'] != 'pending') {
            $leaveRequest->delete();

            return response()->json(['message' => 'Request ' . $fields['status'] . ' successfully']);
        }

        return response()->json($leaveRequest->load('user'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeaveRequest $leaveRequest)
    {
        Gate::authorize('delete', $leaveRequest);
        
        $leaveRequest->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
