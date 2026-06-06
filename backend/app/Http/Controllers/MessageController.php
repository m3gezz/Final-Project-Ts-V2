<?php

namespace App\Http\Controllers;

use App\Events\Message as EventsMessage;
use App\Models\Message;
use App\Http\Controllers\Controller;
use App\Models\Workspace;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $workspace = Workspace::findOrFail($request->workspace_id);
        $messages = $workspace->messages()->with(['user', 'attachment', 'replied_to_message' => function ($q) {
            $q->with(['user', 'attachment']);
        }])->get();
        return response()->json($messages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate(
            [
                'workspace_id' => ['required', 'exists:workspaces,id'],
                'message' => ['required', 'string', 'min:1'],
                'replied_to' => ['nullable', 'exists:messages,id'],
            ]
        );

        $fields['replied_to'] = $fields['replied_to'] ?? null;

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
        $this->authorize('update',$message);
        $fields = $request->validate(
            [
                'message' => ['sometimes', 'string', 'min:1'],
                'isPinned' => ['sometimes', 'boolean'],
                'isStared' => ['sometimes', 'boolean'],
            ]
        );

        if ($message->isDeleted) return response()->json(['message' => 'Message was deleted already.']);

        $message->update($fields);

        if (isset($fields['message'])) {
            $message->update(['isEdited' => 1]);
        }

        broadcast(new EventsMessage('updated', $message->workspace_id));
        return response()->json(['message' => 'Message updated successfully.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        $this->authorize('delete',$message);
        
        if ($message->attachment) {
            Storage::disk('public')->delete($message->attachment->file_path);
            $message->attachment()->delete();
        }

        $message->update(['message' => 'This message has been deleted.', 'isDeleted' => 1, 'replied_to' => null]);
        broadcast(new EventsMessage('deleted', $message->workspace_id));
        return response()->json(['message' => 'Message deleted successfully']);
    }
}
