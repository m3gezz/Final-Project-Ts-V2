<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class BadgeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $badges = Badge::all();
        return response()->json($badges);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', [Badge::class]);

        $fields = $request->validate(
            [
                'name' => ['required','string','min:5'],
                'description' => ['required','string','min:5'],
            ]
        );

        $badge = Badge::create($fields);

        return response()->json($badge);
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
        $fields = $request->validate(
            [
                'name' => ['sometimes','string','min:5'],
                'description' => ['sometimes','string','min:5'],
            ]
        );

        $badge->update($fields);

        return response()->json($badge);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Badge $badge)
    {
        Gate::authorize('delete', $badge);

        $badge->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
