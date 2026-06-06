<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\Invitation;
use App\Models\User;

class InvitationPolicy
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
    public function view(User $user, Invitation $invitation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Invitation $invitation): bool
    {
        return $user->id === $invitation->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Invitation $invitation): bool
    {
        return $user->id === $invitation->user_id ||
            $invitation->whereHas('workspace.memberships', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->where(function ($subQuery) {
                        $subQuery->where('role', 'owner')
                                ->orWhere('role', 'admin');
                    });
            })->exists();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Invitation $invitation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Invitation $invitation): bool
    {
        return false;
    }
}
