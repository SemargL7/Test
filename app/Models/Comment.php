<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'user_name',
        'email',
        'home_page',
        'text',
        'parent_id',
    ];

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function getRepliesCountAttribute()
    {
        return $this->replies()->count();
    }
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }
}
