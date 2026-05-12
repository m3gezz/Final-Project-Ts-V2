<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWorkspaceRequest;
use App\Http\Requests\UpdateWorkspaceRequest;
use App\Models\Project;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $status = $request->status;
        $type = $request->type;

        $query = Project::where('private', false)->with(['workspace','members.user', 'skills', 'category'])->withCount(['comments', 'likes']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%$search%")
                ->orWhere('description', 'like', "%$search%")
                ->orWhereHas('skills', function ($q) use ($search) {
                    $q->where('label','like', "%$search%");
                })
                ->orWhereHas('user', function ($q) use ($search) {
                    $q->where('full_name','like', "%$search%")->orWhere('username','like', "%$search%");
                });
            });
        }

        if ($status && $status != 0) {
            $query->whereHas('workspace', function ($q) use($status) {
                $q->where('status', $status);
            });
        }

        if ($type == 'owned') {
            $query->where('user_id', $request->user()->id);
        } else {   
            $query->whereHas('members', function ($q) use($request) {
                $q->where('user_id', $request->user()->id)->where('role', '!=', 'owner');
            });
        }

        $projects = $query->paginate(8);

        return response()->json($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkspaceRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Workspace $workspace, Request $request)
    {
        if ($request->dataType === 'overview') {
            $workspace->load(['project'])->loadCount(['project as members_count' => function ($q){
                $q->withCount('members');
            }]);
        } else {
            $workspace->load(['project.members.user']);
        }
        return response()->json($workspace);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWorkspaceRequest $request, Workspace $workspace)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Workspace $workspace)
    {
        //
    }
}
