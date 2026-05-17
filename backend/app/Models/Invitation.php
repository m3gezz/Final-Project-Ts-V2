<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    /** @use HasFactory<\Database\Factories\InvitationFactory> */
    use HasFactory;

    protected $fillable = ['workspace_id','user_id','status'];

    public function workspace() {
        return $this->belongsTo(Workspace::class);
    }
        
    public function user() {
        return $this->belongsTo(User::class);
    }
    
}
