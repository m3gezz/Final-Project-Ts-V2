<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerificationCodeMail;

class AuthController extends Controller
{
    public function sign_up(Request $request) {
        $fields = $request->validate([
            'full_name' => ['required', 'string', 'min:3', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'terms' => ['required', 'accepted'],
        ]);
        $fields['username'] = str_replace(" ", "_", $fields['full_name']);
        
        $user = User::create($fields);
        $user->badges()->syncWithoutDetaching([4]); //new user

        $access_token = $user->createToken('access-token')->plainTextToken;
        $refresh_token = $user->createToken('refresh-token')->plainTextToken;

        $code = random_int(100000, 999999);
        $user->emailVerificationCode()->create([
            'code' => Hash::make($code),
            'expires_at' => now()->addMinutes(10),
        ]);
        Mail::to($user->email)->send(
            new EmailVerificationCodeMail($user, $code)
        );

        $data = [
            'user' => $user->load(['skills']),
            'token' => $access_token,
            'message' => 'Signed up successfully.'
        ];

        return response()->json($data)->cookie('refresh_token', $refresh_token, 60*24*7,null,null,true,true);
    }

    public function sign_in(Request $request) {
        $fields = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($fields)) {
            throw ValidationException::withMessages([
                'password' => ['The provided credentials are incorrect.'],
            ]);
        }
        
        $user = Auth::user();
        $user->badges()->syncWithoutDetaching([5]); //returning user
        $access_token = $user->createToken('access-token')->plainTextToken;
        $refresh_token = $user->createToken('refresh-token')->plainTextToken;

        $data = [
            'user' => $user,
            'token' => $access_token,
            'message' => 'Signed in successfully.'
        ];

        return response()->json($data)->cookie('refresh_token', $refresh_token, 60*24*7,null,null,true,true);
    }

    public function sign_out(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Signed out successfully.'])->cookie('refresh_token', '', -1);;
    }

    public function refreshToken(Request $request) {
        $cookie = $request->cookie('refresh_token');
        if (!$cookie) abort(401, 'No refresh token');
        
        $token = PersonalAccessToken::findToken($cookie);
        if (!$token || $token->tokenable_id === null) abort(401, 'Invalid refresh token');

        $user = $token->tokenable;
        $access_token = $user->createToken('access-token')->plainTextToken;

        $data = [
            'user' => $user,
            'token' => $access_token
        ];

        return response()->json($data);
    }

    public function getMe(Request $request) 
    {
        $user = $request->user()->load(['skills']);
        return response()->json(['user'=>$user]);
    }
}
