<?php

namespace App\Http\Controllers;

use App\Events\CommentCreated;
use App\Models\Comment;
use App\Rules\ValidComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function index()
    {
        $comments = Comment::all();

        return response()->json(['comments' => $comments], 200);
    }

    public function showMainComment(Request $request) {
        $perPage = 25;
        $sort = $request->input('sort');
        $filterType = $request->input('filter_type');
        $filterWord = $request->input('filter_word');
        $filterColumn = '';

        $query = Comment::query()->where('parent_id', null);

        if($filterType == "username"){
            $filterColumn = 'user_name';
        } else if($filterType == 'email'){
            $filterColumn = 'email';
        } else {
            $filterColumn = 'text';
        }

        if ($filterWord) {
            $query->where( $filterColumn, 'LIKE', "%$filterWord%");
        }

        if ($sort === 'true') {
            $query->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('created_at', 'asc');
        }

        $comments = $query
            ->withCount('replies as replies_count')
            ->with('files')
            ->paginate($perPage);

        return response()->json(['comments' => $comments], 200);
    }

    public function showChildComment($parent_id) {
        $comments = Comment::query()->where('parent_id', $parent_id)->withCount('replies as replies_count')->with('files')->get();

        return response()->json(['comments' => $comments], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_name' => 'required|string',
            'email' => 'required|email',
            'text' => ['required', 'string', new ValidComment],
            'parent_id' => 'nullable|integer',
            'file' => 'nullable|mimes:jpeg,png,gif,txt',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request) {

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
                $fileType = $file->getClientOriginalExtension();

                if ($fileType === 'txt' && $file->getSize() > 100000) {
                    return response()->json(['errors' => 'The text file size exceeds the limit.'], 422);
                }

                if ($fileType === 'jpeg' || $fileType === 'jpg' || $fileType === 'png' || $fileType === 'gif') {
                    $image = Image::make($file);

                    $maxWidth = 320;
                    $maxHeight = 240;

                    $image->resize($maxWidth, $maxHeight, function ($constraint) {
                        $constraint->aspectRatio();
                    });

                    $image->save(storage_path('app/uploads/' . $fileName));
                } else {
                    $file->storeAs('uploads', $fileName);
                }

                $comment->files()->create([
                    'file_name' => $fileName,
                    'file_type' => $fileType,
                    'path' => 'uploads/' . $fileName,
                ]);
            }
            event(new CommentCreated($comment));

            return response()->json(['comment' => $comment], 201);
        });
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
