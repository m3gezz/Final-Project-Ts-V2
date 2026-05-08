<?php

namespace App\Policies;

use App\Models\InvitationRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class InvitationRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, InvitationRequest $invitationRequest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Project $project): bool
    {
        $adminIds = $project->members
            ->where('role', 'admin')
            ->pluck('user_id');

        return $adminIds->contains($user->id) || $user->admin;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, InvitationRequest $invitationRequest): bool
    {
        return $user->id === $invitationRequest->receiver_id || $user->admin;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, InvitationRequest $invitationRequest): bool
    {
        return $user->id === $invitationRequest->user_id || $user->admin;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, InvitationRequest $invitationRequest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, InvitationRequest $invitationRequest): bool
    {
        return false;
    }
}
