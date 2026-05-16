<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    /** @use HasFactory<\Database\Factories\WorkspaceFactory> */
    use HasFactory;

    protected $fillable = ['project_id', 'status'];

    public function project() {
        return $this->belongsTo(Project::class);
    }

    public function memberships() {
        return $this->hasMany(Membership::class);
    }

    public function requests() {
        return $this->hasMany(Request::class);
    }

    public function invitations() {
        return $this->hasMany(Invitation::class);
    }

    public function tasks() {
        return $this->hasMany(Task::class);
    }

    public function messages() {
        return $this->hasMany(Message::class);
    }
}
