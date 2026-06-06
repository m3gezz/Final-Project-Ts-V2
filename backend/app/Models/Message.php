<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    /** @use HasFactory<\Database\Factories\MessageFactory> */
    use HasFactory;

    protected $fillable = ['workspace_id','user_id','message','isDeleted', 'isEdited', 'isPinned','replied_to'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function workspace() {
        return $this->belongsTo(Workspace::class);
    }

    public function attachment() {
        return $this->hasOne(Attachment::class);
    }

    public function replied_to_message() {
        return $this->belongsTo(Message::class, 'replied_to');
    }

    public function replies() {
        return $this->hasMany(Message::class, 'replied_to');
    }

}
