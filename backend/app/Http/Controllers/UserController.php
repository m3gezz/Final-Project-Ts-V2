<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Project;
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

        if ($skill_id && $skill_id != 0) {
            $query->orWhereHas('skills', function ($q) use ($skill_id) {
                $q->where('id',$skill_id);
            });
        }

        if ($sort == 1) {
            // $query->orderByDesc('likes_count'); needs work
        } else {   
            $query->orderByDesc('created_at');
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

    public function getUserProjects(User $user,Request $request) {
            
        if ($request->type === 'owned') {
            $data = Project::where('user_id', $user->id)->with(['user', 'category'])->withCount(['comments', 'likes']);
        } else {
            $data = Project::whereHas('members', function ($q) use($user) {
                $q->where('user_id',$user->id)->where('role','!=','owner');
            })->with(['user', 'category'])->withCount(['comments', 'likes']); 
        }

        $data = $data->paginate(4);

        return response()->json($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);
        $user->load(['skills', 'badges'])->loadCount([ 'projects','memberships as worked_count' => function ($q) {
            $q->where('role', '!=', 'owner');
        }]);

      
        $owned = Project::where('user_id', $user->id)->with(['user', 'category'])->withCount(['comments', 'likes'])->orderByDesc('likes_count')->limit(5)->get();
     
        $worked = Project::whereHas('members', function ($q) use($user) {
            $q->where('user_id',$user->id)->where('role','!=','owner');
        })->with(['user', 'category'])->withCount(['comments', 'likes'])->orderByDesc('likes_count')->limit(5)->get(); 
   
        $user['owned'] = $owned;
        $user['worked'] = $worked;
        
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
            'email' => ['sometimes','email','unique:users,email,' . $user->id],
            'password' => ['sometimes'],
            'new_password' => ['sometimes','confirmed'],
            'skills' => ['sometimes']
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar !== null) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $request->file('avatar')->store('usersImages', 'public');
            $fields['avatar'] = $path;
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
