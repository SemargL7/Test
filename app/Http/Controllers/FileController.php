<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FileController extends Controller
{
    public function download($filePath)
    {
        $fullPath = storage_path("app/$filePath");

        if (file_exists($fullPath)) {
            return response()->file($fullPath);
        } else {
            return response()->json(['error' => 'File not found'], 404);
        }
    }
}
