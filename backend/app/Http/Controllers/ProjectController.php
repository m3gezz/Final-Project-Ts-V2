<?php

namespace App\Http\Controllers;


use App\Models\Project;
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

        $query = Project::where('private', false)->with(['user','category'])->withCount(['comments', 'likes']);

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
                'image' => ['sometimes', 'image', 'max:2048'],
                'title' => ['required', 'string', 'min:3', 'max:255'],
                'description' => ['required', 'string', 'min:10'],
                'category_id' => ['required', 'exists:categories,id'],
                'private' => ['required', 'boolean'],
                'manifesto' => ['required', 'string', 'min:20'],
                'skills'=>['sometimes','array'],
                'skills.*' => ['sometimes', 'exists:skills,id'],
            ]
        );
        
        if ($request->hasFile('image')) {
            $fields['image'] = $request->file('image')->store('projectImages', 'public');
        }
        
        $project = $request->user()->projects()->create($fields);
        $workspace = $project->workspace()->create();
        $workspace->memberships()->create([
            'user_id' => $project->user_id,
            'role' => "owner",
        ]);
        
        if ($request->has('skills')) {
            $project->skills()->sync($fields['skills']);
        }

        $project = $project->id;
        return response()->json($project);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project, Request $request)
    {
        $this->authorize('view', $project);
        $project->load(['user','workspace.memberships.user','category','skills','comments'])->loadCount(['comments','likes']);

        $project['isLiked'] = $project->likes()->where('user_id', $request->user()->id)->exists();
        $project['isRequested'] = $project->workspace->requests()->where('user_id', $request->user()->id)->exists() 
            || $project->workspace->memberships()->where('user_id', $request->user()->id)->exists();

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
                'image' => ['sometimes', 'image', 'max:2048'],
                'title' => ['required', 'string', 'min:3', 'max:255'],
                'description' => ['required', 'string', 'min:10'],
                'category_id' => ['required', 'exists:categories,id'],
                'private' => ['required', 'boolean'],
                'manifesto' => ['required', 'string', 'min:20'],
                'skills'=>['sometimes','array'],
                'skills.*' => ['sometimes', 'exists:skills,id'],
            ]
        );

        if ($request->hasFile('image')) {
            if ($project->image !== null && $project->image !== 'default/default-project-image.jpg') {
                Storage::disk('public')->delete($project->image);
            }
            $fields['image'] = $request->file('image')->store('projectImages', 'public');
        }

        if ($request->has('skills')) {
            $project->skills()->sync($fields['skills']);
        }

        $project->update($fields);
        return response()->json('updated');
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

    /**
     * Checks if the user can edit this project.
     */
    public function canEdit(Project $project)
    {
        $this->authorize('canEdit', $project);
        $project->load(['category','skills']);
        return response()->json($project);
    }
}
