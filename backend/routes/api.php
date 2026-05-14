<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\PasswordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BadgeController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\WorkspaceController;

Route::get('/', function () {return ['api' => 'ready'];});
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::post('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

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
    Route::apiResource('users', UserController::class)->except(['store']);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('workspaces', WorkspaceController::class)->only(['index', 'show']);
    Route::apiResource('requests', RequestController::class)->except(['show']);
    Route::apiResource('memberships', MembershipController::class)->only(['destroy','update']);
    Route::apiResource('invitations', InvitationController::class)->only(['index','store','destroy','update']);
    Route::apiResource('comments', CommentController::class);
    Route::apiResource('likes', LikeController::class)->only(['store']);
    Route::apiResource('categories', CategoryController::class)->only(['index']);
    Route::apiResource('badges', BadgeController::class);
    Route::apiResource('skills', SkillController::class)->only(['index']);
    Route::get('home', [UserController::class, 'home']);
    Route::get('/projects-edit/{project}', [ProjectController::class, 'edit']);
});