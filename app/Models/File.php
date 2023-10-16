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

    public function comment()
    {
        return $this->belongsTo(Comment::class);
    }
}
