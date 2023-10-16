<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index()
    {
        // Отримайте всі коментарі тут і поверніть їх у відповідь
        $comments = Comment::all();

        return response()->json(['comments' => $comments], 200);
    }

    public function store(Request $request)
    {
        // Валідація введених даних
        $request->validate([
            'user_name' => 'required|string',
            'email' => 'required|email',
            'text' => 'required|string',
        ]);

        // Створення нового коментаря
        $comment = Comment::create([
            'user_name' => $request->input('user_name'),
            'email' => $request->input('email'),
            'home_page' => $request->input('home_page'),
            'text' => $request->input('text'),
            'parent_id' => $request->input('parent_id'),
        ]);

        return response()->json(['comment' => $comment], 201);
    }

    public function show($id)
    {
        // Отримайте коментар за ідентифікатором
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Коментар не знайдено'], 404);
        }

        return response()->json(['comment' => $comment], 200);
    }

    public function update(Request $request, $id)
    {
        // Валідація введених даних для оновлення
        $request->validate([
            'user_name' => 'required|string',
            'email' => 'required|email',
            'text' => 'required|string',
        ]);

        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Коментар не знайдено'], 404);
        }

        // Оновлення коментаря
        $comment->update([
            'user_name' => $request->input('user_name'),
            'email' => $request->input('email'),
            'home_page' => $request->input('home_page'),
            'text' => $request->input('text'),
        ]);

        return response()->json(['comment' => $comment], 200);
    }

    public function destroy($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Коментар не знайдено'], 404);
        }

        $comment->delete();

        return response()->json(['message' => 'Коментар успішно видалено'], 200);
    }
}
