<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $type = $request->type;

        $query = Workspace::with(['memberships.user',
            'project' => function ($q) {
                $q->with(['skills', 'category'])->withCount(['comments', 'likes']);
            }
        ]);

        if ($search) {
            $query->whereHas('project', 
                function ($q) use ($search) {
                    $q->where('title', 'like', "%$search%")
                        ->orWhere('description', 'like', "%$search%")
                        ->orWhereHas('skills', 
                            function ($q) use ($search) {
                                $q->where('label','like', "%$search%");
                            })
                        ->orWhereHas('category', 
                            function ($q) use ($search) {
                                $q->where('label','like', "%$search%");
                            })
                        ->orWhereHas('user', 
                            function ($q) use ($search) {
                                $q->where('full_name','like', "%$search%")->orWhere('username','like', "%$search%");
                            });
                });
        }

        if ($type == 'owned') {
            $query->whereHas('memberships', function ($q) use($request) {
                $q->where('user_id', $request->user()->id)->where('role', 'owner');
            });
        } else {   
            $query->whereHas('memberships', function ($q) use($request) {
                $q->where('user_id', $request->user()->id)->where('role', '!=', 'owner');
            });
        }

        $workspaces = $query->paginate(8);

        return response()->json($workspaces);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Workspace $workspace, Request $request)
    {
        if ($request->dataType === 'overview') {
            $workspace
                ->load(['project', 'tasks.user'])
                ->loadCount(['memberships',
                    'tasks as open_tasks_count' => function ($q) {
                        $q->where('status','!=', 'done');
                    }, 'tasks'
            ]);
        }

        if ($request->dataType === 'members') {
            $workspace->load(['project','memberships.user', 'requests.user', 'invitations.user']);
        }

        if ($request->dataType === 'tasks') {
            $workspace->load(['project','memberships.user', 'tasks.user']);
        }
        
        return response()->json($workspace);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Workspace $workspace)
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
