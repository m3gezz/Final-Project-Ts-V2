<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class BadgeController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('admin', User::class);
        $badges = Badge::latest()->get();
        return response()->json($badges);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('admin', User::class);
        $fields = $request->validate([
            'label' => ['required','string','min:1','unique:categories,label'],
            'description' => ['required','string','min:1'],
        ]);

        Badge::create($fields);
        return response()->json(['message' => 'Badge created successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Badge $badge)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Badge $badge)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Badge $badge)
    {
        $this->authorize('admin', User::class);
        $badge->delete();
        return response()->json(['message' => 'Badge deleted successfully']);
    }
}
