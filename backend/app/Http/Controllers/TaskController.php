<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    use AuthorizesRequests;
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
        $fields = $request->validate(
            [
                'workspace_id' => ['required', 'exists:workspaces,id'],
                'title' => ['required', 'string', 'min:1', 'max:255'],
                'description' => ['nullable', 'string'],
                'user_id' => ['required', 'exists:users,id'],
            ]
        );

        Task::create($fields);
        return response()->json('created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        $fields = $request->validate(
            [
                'status' => ['required', 'string', 'in:todo,doing,done'],
            ]
        );

        $task->update($fields);
        return response()->json('updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $task->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
