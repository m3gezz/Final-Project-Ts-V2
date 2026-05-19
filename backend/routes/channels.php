<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('workspace.{workspace_id}', function (User $user, $workspace_id) {
    return $user->memberships()->where('workspace_id', $workspace_id)->exists();
});
