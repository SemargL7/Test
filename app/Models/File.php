<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        'comment_id',
        'file_name',
        'file_type',
        'file_data',
    ];

    // Додайте відношення до коментаря, до якого належить файл
    public function comment()
    {
        return $this->belongsTo(Comment::class);
    }
}
