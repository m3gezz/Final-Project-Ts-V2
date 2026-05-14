<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'full_name',
        'username',
        'professional_title',
        'avatar',
        'bio',
        'about',
        'private',
        'email',
        'password',
    ];

    public function projects() {
        return $this->hasMany(Project::class);
    }

    public function memberships() {
        return $this->hasMany(Membership::class);
    }

    public function requests() {
        return $this->hasMany(Request::class);
    }

    public function skills() {
        return $this->belongsToMany(Skill::class);
    }

    public function badges() {
        return $this->belongsToMany(Badge::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    public function emailVerificationCode() {
        return $this->hasOne(EmailVerificationCode::class); 
    }

    public function passwordResetCode() {
        return $this->hasOne(PasswordResetCode::class); 
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

    public function likes() {
        return $this->hasMany(Like::class);
    }

    public function sentInvitations() {
        return $this->hasMany(Invitation::class);
    }

    public function receivedInvitations() {
        return $this->hasMany(Invitation::class, 'receiver_id');
    }
}
