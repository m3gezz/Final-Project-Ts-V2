<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'private',
        'manifesto',
        'image',
        'user_id',
        'category_id',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function workspace() {
        return $this->hasOne(Workspace::class);
    }

    public function skills() {
        return $this->belongsToMany(Skill::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

    public function likes() {
        return $this->hasMany(Like::class);
    }

    public function invitationsRequests() {
        return $this->hasMany(InvitationRequest::class);
    }
}
