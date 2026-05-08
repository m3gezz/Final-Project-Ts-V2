<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
class CommentController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->has('project_id')) {
            $request->validate(['project_id' => ['required','exists:projects,id']]);
            $comments = Comment::where('project_id', $request->project_id)->paginate(20);
            return response()->json($comments);
        }

        $comments = $request->user()->comments()->paginate(20);
        return response()->json($comments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate(
            [
                'project_id' => ['required','exists:projects,id'],
                'content' => ['required','string','min:1']
            ]
        );

        $fields['owner'] = $request->user()->only(['id', 'full_name', 'username', 'avatar_url']);
        $comment = $request->user()->comments()->create($fields);
        
        return response()->json($comment);
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        return response()->json($comment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $fields = $request->validate(['content' => ['required','string','min:1']]);

        $comment->update($fields);

        return response()->json($comment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
