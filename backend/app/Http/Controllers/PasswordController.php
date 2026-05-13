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
        $request->validate(
            ['email' => ['required','email','exists:users,email']]
        );

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
        $request->validate(['email' => ['required','exists:users,email']]);

        $user = User::where('email', $request->email)->first();
        $record = $user->passwordResetCode;
        
        if (!$record) {
            abort(404, 'No reset code found.');
        }
        
        $request->validate(['code' => ['required','digits:6']]);
            
        if ($record->expires_at->isPast()) {
            $record->delete();
            abort(410, 'Reset code expired.');
        }

        if (!Hash::check($request->code, $record->code)) abort(422, 'Invalid reset code.');

        return response()->json(['message' => 'Valid reset code.',], 200);
    }

    public function reset_password(Request $request) {
        $fields = $request->validate([
            'email' => ['required','email','exists:users,email'],
            'password' => ['required','string','confirmed'],
            'code' => ['required','digits:6']
        ]);

        $user = User::where('email', $fields['email'])->first();
        $record = $user->passwordResetCode;
        
        if (!$record) abort(404, 'No reset code found.');
        
        if ($record->expires_at->isPast()) {
            $record->delete();
            abort(410, 'Reset code expired.');
        }

        if (!Hash::check($fields['code'], $record->code)) abort(422, 'Invalid reset code.');

        $user->password = Hash::make($fields['password']);
        $user->save();
        $record->delete();

        return response()->json([
            'message' => 'Password reset successfully, Ty signing in now.'
        ]);
    }
}
