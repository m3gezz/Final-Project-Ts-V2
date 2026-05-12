<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectMember;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $category_id = $request->category_id;
        $sort = $request->sort;

        $query = Project::where('private', false)->with(['user','members.user', 'skills', 'category'])->withCount(['comments', 'likes']);

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

        if ($category_id && $category_id != 0) {
            $query->where('category_id', $category_id);
        }

        if ($sort === 'likes') {
            $query->orderByDesc('likes_count');
        } else {   
            $query->orderByDesc('created_at');
        }

        $projects = $query->paginate(8);

        return response()->json($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate(
            [
                'title' => ['required'],
                'description' => ['required'],
                'category_id' => ['required'],
                'private'=>['required','boolean'],
                'manifesto'=>['required'],
                'image'=>[ 'image'],
                'skills'=>['sometimes'],
            ]
        );
        
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projectImages', 'public');
            $fields['image'] = $path;
        }

        $project = $request->user()->projects()->create($fields);
        
        if ($request->has('skills')) {
            $project->skills()->sync($fields['skills']);
        }


        $projectMember = [
            'project_id' => $project->id,
            'user_id' => $project->user_id,
            'role' => "owner",
        ];

        $project->workspace()->create();
        
        ProjectMember::create($projectMember);

        $project->load(['members.user', 'category']);

        return response()->json($project);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project, Request $request)
    {
        $this->authorize('view', $project);
        $project->load(['user' => function ($q) {
            $q->withCount(['projects']);
        },'members.user','category','skills','comments'=> function ($q) {
            $q->latest()->with('user');
        }])->loadCount(['comments','likes']);

        $project['isLiked'] = $project->likes()->where('user_id', $request->user()->id)->exists();
        $project['isRequested'] = $project->requests()->where('user_id', $request->user()->id)->exists();

        $membersIds = $project->members->pluck('id')->toArray();
        foreach ($project['comments'] as $comment) {
            $comment['isMember'] = in_array($request->user()->id, $membersIds);
            $comment['isOwner'] = $comment->user_id === $project->user_id;
        }

        return response()->json($project);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $fields = $request->validate(
            [
                'title' => ['sometimes','string','min:5','max:255'],
                'description' => ['sometimes','string','min:10'],
                'category_id' => ['sometimes','exists:categories,id'],
                'private'=>['sometimes','boolean'],
                'manifesto'=>['sometimes'],
                'image'=>['sometimes'],
                'skills'=>['sometimes'],
            ]
        );

        if ($request->has('skills')) {
            $project->skills()->sync($fields['skills']);
        }

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($project->image);
            $path = $request->file('image')->store('projectImages', 'public');
            $fields['image'] = $path;
        }

        $project->update($fields);

        $project->load(['members.user', 'category']);

        return response()->json($project);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);
        
        $project->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    public function edit(Project $project, Request $request)
    {
        $this->authorize('edit', $project);
        $project->load(['category','skills']);
        return response()->json($project);
    }
}
