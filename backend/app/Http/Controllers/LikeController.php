<?php

namespace App\Http\Controllers;
use App\Models\Like;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate(['project_id' => ['required','exists:projects,id']]);

        $like = Like::where('project_id', $fields['project_id'])->where('user_id', $request->user()->id);

        if ($like->exists()) return $like->delete();
        

        $fields['owner'] = $request->user()->only(['id', 'full_name', 'username', 'avatar_url']);
        
        $newLike = $request->user()->likes()->create($fields);

        return response()->json($newLike);
    }

    /**
     * Display the specified resource.
     */
    public function show(Like $like)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Like $like)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Like $like)
    {
        //
    }
}
