<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Project;
use App\Models\Workspace;
use Carbon\Carbon;
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
            return response()->json(['message' => 'Password updated successfully.']);
        }

        if ($fields['email'] !== $user->email) {
            $user->update(['email' => $fields['email']]);
            $user->email_verified_at = null;
        }

        unset($fields['email']);
        $user->update($fields);
        return response()->json(['message' => 'Profile updated successfully.']);
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
        return response()->json(['message' => 'Profile deleted successfully']);
    }

    public function UserDashboard(Request $request) 
    {
        $user = $request->user();

        $counts = [
            'projects'=>$user->projects()->count(),
            'requests'=>$user->requests()->where('status', 'pending')->count(),
            'workspaces'=>$user->memberships()->count(),
        ];

        $workspaces = Workspace::whereHas('memberships', function ($q) use ($user) {
            $q->where('user_id', $user->id)->where('role', 'owner');
        })->with(['memberships.user','project' => function ($q) {
                $q->with(['category'])->withCount(['likes'])->orderByDesc('likes_count');
            }
        ])
        ->withCount([
            'tasks', 
            'tasks as open_tasks_count' => function ($q) {
                $q->where('status', '!=', 'done');
            }
        ])->limit(5)->get()->map(function ($w) {
            $total = $w->tasks_count;
            $open = $w->open_tasks_count;

            $w->progress = $total > 0 
                ? (int) round((($total - $open) * 100) / $total) 
                : 0;

            return $w;
        });

        

        $data['counts'] = $counts;
        $data['tasks'] = $user->tasks()->orderBy('updated_at')->limit(3)->get();
        $data['workspaces'] = $workspaces;
        $data['projects'] = Project::where('private', false)->with(['user', 'category'])->withCount(['comments', 'likes'])->orderByDesc('likes_count')->limit(5)->get();
        return response()->json($data);
    }

    public function adminDashboard() 
    {
        $this->authorize('admin', User::class);
        $startOfThisMonth = Carbon::now()->startOfMonth();
        $startOfLastMonth = Carbon::now()->subMonth()->startOfMonth();
        $endOfLastMonth   = Carbon::now()->subMonth()->endOfMonth();

        $dashboard['count']['users'] = User::count();
        $dashboard['count']['workspaces'] = Workspace::count();
        $dashboard['count']['projects'] = Project::count();
        $activeUsersCount = User::whereHas('tokens', function ($query) use ($startOfThisMonth) {$query->where('created_at', '>=', $startOfThisMonth);})->count();
        $dashboard['count']['active_users'] = $activeUsersCount;
        
        $getGrowth = function ($modelClass) use ($startOfThisMonth, $startOfLastMonth, $endOfLastMonth) {
            $thisMonth = $modelClass::where('created_at', '>=', $startOfThisMonth)->count();
            $lastMonth = $modelClass::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

            if ($lastMonth > 0) {
                return round((($thisMonth - $lastMonth) / $lastMonth) * 100, 1);
            }
            return $thisMonth > 0 ? 100 : 0;
        };

        $dashboard['growth']['users'] = $getGrowth(User::class);
        $dashboard['growth']['workspaces'] = $getGrowth(Workspace::class);
        $dashboard['growth']['projects'] = $getGrowth(Project::class);
        
        $activeThisMonth = $activeUsersCount;

        $activeLastMonth = User::whereHas('tokens', function ($query) use ($startOfLastMonth, $endOfLastMonth) {
            $query->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth]);
        })->count();

        if ($activeLastMonth > 0) {
            $dashboard['growth']['active_users'] = round((($activeThisMonth - $activeLastMonth) / $activeLastMonth) * 100, 1);
        } else {
            $dashboard['growth']['active_users'] = $activeThisMonth > 0 ? 100 : 0;
        }

        $dashboard['new_users'] = User::withExists(['tokens as is_active' => function ($query) use ($startOfThisMonth) {
            $query->where('created_at', '>=', $startOfThisMonth);
        }])->latest()->limit(5)->get();

        return response()->json($dashboard);
    }
}
