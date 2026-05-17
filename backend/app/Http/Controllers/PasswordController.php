<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetCodeMail;

class PasswordController extends Controller
{
    public function send_reset_code(Request $request) {
        $request->validate(['email' => ['required','email','exists:users,email']]);

        $user = User::where('email', $request->email)->first();

        $code = random_int(100000, 999999);
        $user->passwordResetCode()->updateOrCreate(
            // ['user_id' => $user->id],
            ['code' => Hash::make($code),
            'expires_at' => now()->addMinutes(10),]
        );
        Mail::to($user->email)->send(
            new PasswordResetCodeMail($user, $code)
        );

        return response()->json(['message' => 'Password Reset code sent!']);
    }

    public function verify_reset_code(Request $request) {
        $request->validate([
            'email' => ['required','exists:users,email'],
            'code' => ['required','digits:6']
        ]);

        $user = User::where('email', $request->email)->first();

        $record = $user->passwordResetCode;
        if (!$record || $record->expires_at->isPast() || !Hash::check($request->code, $record->code))  abort(422, 'Invalid verification code.');

        return response()->json(['message' => 'Valid reset code.']);
    }

    public function reset_password(Request $request) {
        $fields = $request->validate([
            'email' => ['required','email','exists:users,email'],
            'code' => ['required','digits:6'],
            'password' => ['required','string','confirmed']
        ]);

        $user = User::where('email', $fields['email'])->first();
        
        $record = $user->passwordResetCode;
        if (!$record || $record->expires_at->isPast() || !Hash::check($request->code, $record->code))  abort(422, 'Invalid verification code.');

        $user->update(['password' => Hash::make($fields['password'])]);
        $record->delete();
        return response()->json(['message' => 'Password reset successfully, Ty signing in now.']);
    }
}
