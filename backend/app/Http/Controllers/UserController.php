<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Project;
use App\Models\Workspace;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $skill_id = $request->skill_id;
        $sort = $request->sort;

        $query = User::with(['skills','badges'])->orderByDesc('created_at');

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

        if ($skill_id && $skill_id != 0) {
            $query->orWhereHas('skills', function ($q) use ($skill_id) {
                $q->where('id',$skill_id);
            });
        }

        $users = $query->paginate(8);
        return response()->json($users);
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
    public function show(User $user)
    {
        $this->authorize('view', $user);

        $user->load(['skills', 'badges'])->loadCount([
            'projects as owned_count' => function ($q) {$q->where('private', false);},
            'memberships as worked_count' => function ($q) {$q->where('private', false)->where('role', '!=', 'owner');}
        ]);

      
        $owned = Project::where('private', false)->where('user_id', $user->id)->with(['user', 'category'])->withCount(['comments', 'likes'])->orderByDesc('likes_count')->limit(5)->get();
        $worked = Project::where('private', false)->whereHas(
            'workspace.memberships', function ($q) use($user) {$q->where('user_id',$user->id)->where('role','!=','owner');})
            ->with(['user', 'category'])->withCount(['comments', 'likes'])->orderByDesc('likes_count')->limit(5)->get(); 
   
        $user['owned'] = $owned;
        $user['worked'] = $worked;

        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);
        $fields = $request->validate([
            'avatar' => ['nullable', 'image', 'max:2048'],
            'full_name' => ['nullable', 'string', 'min:3', 'max:255'],
            'username' => ['nullable', 'string', 'min:3', 'max:50','unique:users,username,' . $user->id],
            'professional_title' => ['nullable', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:160'],
            'about' => ['nullable','string'],
            'email' => ['nullable','string','email','unique:users,email,' . $user->id],
            'password' => ['nullable','string'],
            'new_password' => ['nullable', 'string', 'min:6', 'confirmed'],
            'private' => ['nullable','boolean'],
            'skills'=>['nullable','array'],
            'skills.*' => ['nullable', 'exists:skills,id'],
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar !== null) {
                Storage::disk('public')->delete($user->avatar);
            }

            $fields['avatar'] = $request->file('avatar')->store('usersImages', 'public');
        }

        if ($request->has('skills')) {
            $user->skills()->sync($fields['skills']);
        }

        if ($request->has('password') && $request->has('new_password')) {
            if (!Hash::check($fields['password'], $user->password)) {
                throw ValidationException::withMessages([
                    'password' => ['The provided credentials are incorrect.'],
                ]);
            }

            $user->update(['password' => Hash::make($fields['new_password'])]);
            return response()->json('updated');
        }

        if ($fields['email'] !== $user->email) {
            $user->update(['email' => $fields['email']]);
            $user->email_verified_at = null;
        }

        unset($fields['email']);
        $user->update($fields);
        return response()->json('updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, User $user)
    {
        $this->authorize('delete', $user);
        $fields = $request->validate(
            [
                'password' => ['required', 'string', 'confirmed'],
            ]
        );

        if (!Hash::check($fields['password'], $user->password)) { 
            throw ValidationException::withMessages([
                'password' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user->tokens()->delete();
        $user->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function UserDashboard(Request $request) 
    {
        $user = $request->user()->loadCount(['projects','requests' => function ($q) {
            $q->where('status', 'pending');
        }]);

        $user['workspaces_count'] = Workspace::whereHas('memberships', 
            function($q) use($request) {
                $q->where('user_id', $request->user()->id);
            })->count();

        $projects = Project::where('private', false)->with(['user', 'category'])->withCount(['comments', 'likes'])->orderByDesc('likes_count')->limit(3)->get();
        $workspaces = Workspace::whereHas('memberships', 
            function ($q) use($request) {
                $q->where('user_id', $request->user()->id)->where('role', 'owner');
            })->with(['memberships.user','project'=> function($q) {
                $q->with(['user', 'skills', 'category'])->withCount(['comments','likes'])->orderByDesc('likes_count');
            }])->limit(3)->get();

        $dashboard['user'] = $user;
        $dashboard['workspaces'] = $workspaces;
        $dashboard['projects'] = $projects;
        return response()->json($dashboard);
    }
}
