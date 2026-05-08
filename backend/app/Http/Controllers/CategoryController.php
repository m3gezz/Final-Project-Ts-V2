<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::all();

        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', [Category::class]);

        $fields = $request->validate(
            [
                'category' => ['required','string','min:5','max:50']
            ]
        );

        $category = Category::create($fields);

        return response()->json($category);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        Gate::authorize('update', $category);

        $fields = $request->validate(['category' => ['required','string','min:5','max:50']]);

        $category = Category::update($fields);

        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        Gate::authorize('delete', $category);

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully.']);
    }
}
