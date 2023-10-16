<?php

use App\Http\Controllers\CommentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Створення коментаря
Route::post('/comments', [CommentController::class, 'store']);

// Отримання всіх коментарів
Route::get('/comments', [CommentController::class, 'index']);

//Отримання основні коментарів
Route::get('/comments/main', [CommentController::class,'showMainComment']);

//Отримання основні коментарів
Route::get('/comments/parent/{parent_id}', [CommentController::class,'showParentComment']);

// Отримання коментаря за ID
Route::get('/comments/{id}', [CommentController::class, 'show']);

// Редагування коментаря
Route::put('/comments/{id}', [CommentController::class, 'update']);

// Видалення коментаря
Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

// Отримання відповідей на коментар
Route::get('/comments/{id}/replies', [CommentController::class, 'replies']);
