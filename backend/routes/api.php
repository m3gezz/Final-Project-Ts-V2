<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\PasswordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectMemberController;
use App\Http\Controllers\InvitationRequestController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BadgeController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\SkillController;

Route::get('/', function () {return ['api' => 'ready'];});
Route::post('/refresh', [AuthController::class, 'refresh']);//I use this route to keep the user logged in, I send a cookie then get a token (the cookie is created during sign in/up)
Route::post('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');//I use this route to get the user

//Authentication routes
Route::post('/sign-up', [AuthController::class, 'sign_up']);
Route::post('/sign-in', [AuthController::class, 'sign_in']);
Route::post('/sign-out', [AuthController::class, 'sign_out'])->middleware('auth:sanctum');

//Email verification routes
Route::post('/email/resend-code', [EmailController::class, 'resend_verification_code'])->middleware('auth:sanctum');
Route::post('/email/verify-code', [EmailController::class, 'verify_email_code'])->middleware('auth:sanctum');

//Password reset routes
Route::post('/password/send-code', [PasswordController::class, 'send_reset_code']);
Route::post('/password/verify-code', [PasswordController::class, 'verify_reset_code']);
Route::post('/password/reset-password', [PasswordController::class, 'reset_password']);

//Data routes
Route::middleware('auth:sanctum')->group(function() {
    Route::apiResource('users', UserController::class);
    Route::get('home', [UserController::class, 'home']);
    Route::apiResource('projects', ProjectController::class);
    Route::get('/projects-edit/{project}', [ProjectController::class, 'edit']);
    Route::apiResource('project-members', ProjectMemberController::class);
    Route::apiResource('invitation-requests', InvitationRequestController::class);
    Route::apiResource('requests', RequestController::class);
    Route::apiResource('comments', CommentController::class);
    Route::apiResource('likes', LikeController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('badges', BadgeController::class);
    Route::apiResource('skills', SkillController::class);
});