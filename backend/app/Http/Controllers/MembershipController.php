<?php

namespace App\Http\Controllers;

use App\Models\Membership;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $workspace_id = $request->workspace_id;

        $query = User::whereDoesntHave('memberships',function ($q) use($workspace_id) {
                $q->where('workspace_id', $workspace_id);
            })
            ->whereDoesntHave('requests',function ($q) use($workspace_id) {
                $q->where('workspace_id', $workspace_id);
            })->whereDoesntHave('invitations',function ($q) use($workspace_id) {
                $q->where('workspace_id', $workspace_id);
            });

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%$search%");
                $q->orWhere('username', 'like', "%$search%");
                $q->orWhere('bio', 'like', "%$search%");

                $q->orWhereHas('skills', function ($q) use ($search) {
                    $q->where('label','like', "%$search%");
                });
            });
        }

        $non_members = $query->paginate(8);
        return response()->json($non_members);
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
    public function show(Membership $membership)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Membership $membership)
    {
        $this->authorize('update', $membership);
        $fields = $request->validate([
            'role' => 'string'
        ]);

        $membership->update($fields);
        return response()->json('updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Membership $membership)
    {
        $this->authorize('delete', $membership);
        $membership->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
