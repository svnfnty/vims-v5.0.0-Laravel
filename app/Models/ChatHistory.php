<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'role',
        'content',
        'model_used',
    ];

    /**
     * Get messages for a specific user session
     */
    public static function getSessionMessages($userId, $sessionId, $limit = 50)
    {
        return self::where('user_id', $userId)
            ->where('session_id', $sessionId)
            ->orderBy('created_at', 'asc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get recent messages for context (last 10 messages)
     */
    public static function getRecentContext($userId, $sessionId, $limit = 10)
    {
        return self::where('user_id', $userId)
            ->where('session_id', $sessionId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->reverse()
            ->values();
    }

    /**
     * Clear session history
     */
    public static function clearSession($userId, $sessionId)
    {
        return self::where('user_id', $userId)
            ->where('session_id', $sessionId)
            ->delete();
    }
}
