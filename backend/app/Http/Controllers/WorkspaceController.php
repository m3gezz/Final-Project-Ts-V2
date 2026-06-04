<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $type = $request->type;

        $query = Workspace::with([
            'memberships.user',
            'project' => function ($q) {
                $q->with(['category'])->withCount(['comments', 'likes']);
            }
        ])->withCount([
            'tasks',
            'tasks as open_tasks_count' => function ($q) {
                $q->where('status', '!=', 'done');
            }
        ]);

        if ($search) {
            $query->whereHas('project', function ($q) use ($search) {
                $q->where('title', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%")
                    ->orWhereHas('skills', function ($q) use ($search) {
                        $q->where('label', 'like', "%$search%");
                    })
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('label', 'like', "%$search%");
                    })
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('full_name', 'like', "%$search%")->orWhere('username', 'like', "%$search%");
                    });
            });
        }

        if ($type == 'owned') {
            $query->whereHas('memberships', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id)->where('role', 'owner');
            });
        } else {   
            $query->whereHas('memberships', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id)->where('role', '!=', 'owner');
            });
        }

        $workspaces = $query->paginate(8);

        $workspaces->through(function ($w) {
            $total = $w->tasks_count;
            $open = $w->open_tasks_count;

            $w->progress = $total > 0 
                ? (int) round((($total - $open) * 100) / $total) 
                : 0;

            return $w;
        });

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
        $this->authorize('view', $workspace);
        
        if ($request->dataType === 'overview') {
            $workspace
                ->load(['project', 'tasks.user'])
                ->loadCount(['memberships',
                    'tasks as open_tasks_count' => function ($q) {
                        $q->where('status','!=', 'done');
                    }, 'tasks'
            ]);

            $total = $workspace->tasks_count;
            $open = $workspace->open_tasks_count;

            $workspace->progress = $total > 0 
                ? (int) round((($total - $open) * 100) / $total) 
                : 0;
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
