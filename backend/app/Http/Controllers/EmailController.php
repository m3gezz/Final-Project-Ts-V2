<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerificationCodeMail;

class EmailController extends Controller
{
    public function resend_verification_code(Request $request) {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'user' => $user,
                'message' => 'Email already verified.'
            ]);
        }

        $code = random_int(100000, 999999);

        $user->emailVerificationCode()->updateOrCreate(
            ['user_id' => $user->id],
            ['code' => Hash::make($code),
            'expires_at' => now()->addMinutes(10),]
        );

        Mail::to($user->email)->send(
            new EmailVerificationCodeMail($user, $code)
        );

        return response()->json(['message' => 'Email verification code sent!']);
    }

    public function verify_email_code(Request $request) {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'user' => $user,
                'message' => 'Email already verified.'
            ]);
        }

        $record = $user->emailVerificationCode;
        
        if (!$record)  abort(404, 'No verification code found.');
    
        $request->validate(['code' => ['required','digits:6']]);
            
        if ($record->expires_at->isPast()) {
            $record->delete();
            abort(410, 'Verification code expired.');
        }

        if (!Hash::check($request->code, $record->code)) abort(422, 'Invalid verification code.');
        

        $user->markEmailAsVerified();
        $record->delete();

        return response()->json([
            'user' => $user,
            'message' => 'Email verified successfully.'
        ]);
    }
}
