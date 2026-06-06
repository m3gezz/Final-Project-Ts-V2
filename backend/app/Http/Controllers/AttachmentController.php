<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\Message as EventsMessage;
use Illuminate\Support\Str;

class AttachmentController extends Controller
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
        $fields = $request->validate(
            [
                'workspace_id' => ['required', 'exists:workspaces,id'],
                'message' => ['nullable', 'string'],
                'file' => ['required', 'file', 'max:10240'],
            ]
        );

        $user = $request->user();
        $message = $user->messages()->create([
            'message' => $fields['message'] ?? ' ',
            'workspace_id' => $fields['workspace_id'],
        ]);
        $mimeGroup = Str::before($request->file('file')->getClientMimeType(), '/');
        $message->attachment()->create([
            'file_path' => $request->file('file')->store('attachments', 'public'),
            'file_name' => $request->file('file')->getClientOriginalName(),
            'file_size' => $request->file('file')->getSize(),
            'file_type' => match ($mimeGroup) {
                'image' => 'image',
                'video' => 'video',
                default => 'document',
            },
        ]);
        broadcast(new EventsMessage('created', $fields['workspace_id']));
        return response()->json(['message' => 'Attachment created successfully.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attachment $attachment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attachment $attachment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attachment $attachment)
    {
        //
    }
}
