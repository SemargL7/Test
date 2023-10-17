<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index()
    {
        $comments = Comment::all();

        return response()->json(['comments' => $comments], 200);
    }

    public function showMainComment(Request $request) {
        $sort = $request->input('sort');
        $filterWord = $request->input('filter_word');

        $query = Comment::query()->where('parent_id', null);

        if ($filterWord) {
            $query->where('user_name', 'LIKE', "%$filterWord%");
        }

        if ($sort === 'true') {
            $query->orderBy('created_at', 'asc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $comments = $query->withCount('replies as replies_count')->with('files')->get();


        return response()->json(['comments' => $comments], 200);
    }

    public function showChildComment($parent_id) {
        $comments = Comment::query()->where('parent_id', $parent_id)->withCount('replies as replies_count')->with('files')->get();

        return response()->json(['comments' => $comments], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_name' => 'required|string',
            'email' => 'required|email',
            'text' => 'required|string',
            'parent_id' => 'nullable|integer',
            'file' => 'nullable|mimes:jpeg,png,gif,txt',
        ]);

        $comment = Comment::create([
            'user_name' => $request->input('user_name'),
            'email' => $request->input('email'),
            'home_page' => $request->input('home_page'),
            'text' => $request->input('text'),
            'parent_id' => $request->input('parent_id'),
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $file->storeAs('uploads', $fileName);

            $comment->files()->create([
                'file_name' => $fileName,
                'file_type' => $file->getClientMimeType(),
                'path' => 'uploads/' . $fileName,
            ]);
        }

        return response()->json(['comment' => $comment], 201);
    }

    public function show($id)
    {

        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Коментар не знайдено'], 404);
        }

        return response()->json(['comment' => $comment], 200);
    }

    public function update(Request $request, $id)
    {

        $request->validate([
            'user_name' => 'required|string',
            'email' => 'required|email',
            'text' => 'required|string',
        ]);

        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Коментар не знайдено'], 404);
        }


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
