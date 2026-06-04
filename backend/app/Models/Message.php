<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    /** @use HasFactory<\Database\Factories\MessageFactory> */
    use HasFactory;

    protected $fillable = ['workspace_id','user_id','message','isDeleted', 'isEdited', 'isPinned'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function workspace() {
        return $this->belongsTo(Workspace::class);
    }
}
