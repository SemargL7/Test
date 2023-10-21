<?php

namespace App\Events;

use App\Models\Comment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CommentCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    private Comment $comment;


    /**
     * Create a new event instance.
     */
    public function __construct(Comment $comment)
    {
        Log::info('CommentCreated event const');
        $this->comment = $comment;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return[
            new Channel('comment-store'),
        ];
    }
    public function broadcastAs(): string
    {
        Log::info('comment-store event CommentCreated');
        return 'comment-event';
    }

    public function broadcastWith()
    {
        return [
            $this->comment
        ];
    }

    public function broadcast(): Channel
    {
        Log::info('comment-store event broadcasted');
        return new Channel('comment-store');
    }
}
