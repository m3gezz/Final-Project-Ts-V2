<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Project;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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

        $query = User::with(['skills','badges'])->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%$search%");
                $q->orWhere('last_name', 'like', "%$search%");
                $q->orWhere('bio', 'like', "%$search%");

                $q->orWhereHas('skills', function ($q) use ($search) {
                    $q->where('name','like', "%$search%");
                });
            });
        }

        $users = $query->paginate(10);

        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    public function getUserProjects(User $user,Request $request) {

        $data = Project::whereHas('members', function ($q) use($user) {
            $q->where('user_id',$user->id)->where('role','!=','admin');
        })->with(['user', 'category'])->withCount(['comments', 'likes']); 
            
        if ($request->type === 'owned') {
            $data = Project::where('user_id', $user->id)->with(['user', 'category'])->withCount(['comments', 'likes']);
        }

        $data = $data->paginate(2);

        return response()->json($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);
        $user->load(['skills', 'badges'])->loadCount([ 'memberships as total_projects','projects','memberships as membershipProjects_count' => function ($q) {
            $q->where('role', '!=', 'admin');
        }]);

        $links = [];

        if ($user->github) {
            $links = [...$links, [
                "label"=> "Git",
                "link"=> $user->github,
                "desc"=> "See Repositories",
                ]
            ];
        }

        if ($user->twitter) {
            $links = [...$links, [
                "label"=> "Twitter/X",
                "link"=> $user->twitter,
                "desc"=> "See Repositories",
                ]
            ];
        }

        if ($user->linkedin) {
            $links = [...$links, [
                "label"=> "Linked In",
                "link"=> $user->linkedin,
                "desc"=> "See Repositories",
                ]
            ];
        }

        if ($user->personal_web) {
            $links = [...$links, [
                "label"=> "Portfolio",
                "link"=> $user->personal_web,
                "desc"=> "See Repositories",
                ]
            ];
        }

        $user['links'] = $links;
        $data = ['profile' => $user];

        return response()->json($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $fields = $request->validate([
            'full_name' => ['sometimes','min:5','max:30'],
            'username' => ['sometimes'],
            'professional_title' => ['sometimes'],
            'avatar' => ['sometimes'],
            'bio' => ['sometimes'],
            'about' => ['sometimes'],
            'private' => ['sometimes'],
            'email' => ['sometimes','email','unique:users,email'],
            'password' => ['sometimes'],
            'new_password' => ['sometimes','confirmed'],
            'skills' => ['sometimes']
        ]);

        //needs work

        // if ($request->hasFile('avatar_url')) {
        //     $path = $request->file('avatar_url')->store('usersImages', 'public');
        //     $fields['avatar_url'] = $path;
        // }

        if ($request->has('skills')) {
            $user->skills()->sync($fields['skills']);
        }

        if ($request->has('password') && $request->has('new_password')) {

            if (!Hash::check($fields['password'], $user->password)) {
                throw ValidationException::withMessages([
                    'password' => ['The provided credentials are incorrect.'],
                ]);
            }

            $user->password = Hash::make($fields['new_password']);
            $user->save();

            $data = ['user' => $user->load('skills')];
            return response()->json($data);
        }

        if ($request->has('email')) {
            $user->update(['email' => $fields['email']]);
            $user->email_verified_at = null;
        }

        $user->update($fields);
        $user->save();

        $data = ['user' => $user->load('skills')];
        
        return response()->json($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, User $user)
    {
        $this->authorize('delete', $user);

        $fields = $request->validate(
            [
                'password' => ['required','confirmed'],
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
}
