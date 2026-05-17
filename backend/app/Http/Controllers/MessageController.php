<?php

namespace App\Http\Controllers;

use App\Events\Message as EventsMessage;
use App\Models\Message;
use App\Http\Controllers\Controller;
use App\Models\Workspace;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $workspace_id = $request->workspace_id;
        $workspace = Workspace::findOrFail($workspace_id);
        $data = $workspace->messages()->with('user')->get();
        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate(
            [
                'workspace_id' => ['required','exists:workspaces,id'],
                'message' => ['required','string','min:1','max:255']
            ]
        );

        $request->user()->messages()->create($fields);

        broadcast(new EventsMessage('created',$fields['workspace_id']));

        return response()->json('created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Message $message)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Message $message)
    {
        $fields = $request->validate(
            [
                'message' => ['required','string','min:1','max:255']
            ]
        );

        if ($message->isDeleted) return response()->json('deleted');

        $message->update($fields);

        broadcast(new EventsMessage('updated', $message->workspace_id));

        return response()->json('updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        $message->update(['message' => 'This message has been deleted.', 'isDeleted' => 1]);
        broadcast(new EventsMessage('deleted', $message->workspace_id));
        return response()->json('deleted');
    }
}
