<?php

namespace App\Http\Controllers;

use App\Models\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRequestRequest;
use App\Http\Requests\UpdateRequestRequest;
use App\Models\ProjectMember;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Validation\ValidationException;

class RequestController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(HttpRequest $rq)
    {
        $user = $rq->user();
        
        $data = $user->requests()->with(['project' => function ($q) {
            $q->with('user');
        },'user'])->get();

        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(HttpRequest $rq)
    {
        $fields = $rq->validate(
            [
                'project_id' => ['required','exists:projects,id'],
                'type' => ['sometimes'],
                'message' => ['required','string','min:10','max:255']
            ]
        );

        $alreadyMember = ProjectMember::where('project_id', $fields['project_id'])->where('user_id', $rq->user()->id)->exists();
        $haRequest = Request::where('project_id', $fields['project_id'])->where('user_id', $rq->user()->id)->exists();

        if ($alreadyMember || $haRequest) 
            throw ValidationException::withMessages([
                'message' => ['You either already a member, or you have a request.'],
            ]);

        $rq->user()->requests()->create($fields);

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
        $fields = $rq->validate(
            [
                'status' => ['required','string'],
            ]
        );

        $request->update($fields);

        if ($fields['status'] === 'accepted') {
            $projectMember = [
                'project_id' => $request->project_id,
                'user_id' => $request->user_id,
                'invited_by' => $rq->user()->only(['id', 'full_name', 'username', 'avatar'])
            ];
            ProjectMember::create($projectMember);
        }

        if ($fields['status'] != 'pending') {
            $request->delete();
            return response()->json(['message' => 'Request ' . $fields['status'] . ' successfully']);
        }

        return response()->json('updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $this->authorize('delete', $request);

        $request->delete();

        return response()->json('deleted');
    }
}
