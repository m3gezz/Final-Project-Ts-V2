<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvitationRequest extends Model
{
    /** @use HasFactory<\Database\Factories\InvitationRequestFactory> */
    use HasFactory;

    protected $fillable = [
        'project_id',
        'user_id',
        'receiver_id',
        'message',
        'status',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function project() {
        return $this->belongsTo(Project::class);
    }

    public function receiver() {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
