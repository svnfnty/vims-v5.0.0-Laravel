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

    /**
     * Get all sessions for a user with message count and last activity
     */
    public static function getUserSessions($userId, $limit = 10)
    {
        return self::where('user_id', $userId)
            ->select('session_id')
            ->selectRaw('COUNT(*) as message_count')
            ->selectRaw('MAX(created_at) as last_activity')
            ->selectRaw('MIN(created_at) as started_at')
            ->groupBy('session_id')
            ->orderBy('last_activity', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get first message of a session (for session naming)
     */
    public static function getSessionFirstMessage($userId, $sessionId)
    {
        return self::where('user_id', $userId)
            ->where('session_id', $sessionId)
            ->where('role', 'user')
            ->orderBy('created_at', 'asc')
            ->first();
    }

    /**
     * Delete a specific session
     */
    public static function deleteSession($userId, $sessionId)
    {
        return self::where('user_id', $userId)
            ->where('session_id', $sessionId)
            ->delete();
    }

    /**
     * Validate session belongs to user
     */
    public static function validateSessionOwnership($userId, $sessionId)
    {
        return self::where('user_id', $userId)
            ->where('session_id', $sessionId)
            ->exists();
    }

    /**
     * Get or create session for user
     */
    public static function getOrCreateSession($userId, $sessionId = null)
    {
        if ($sessionId && self::validateSessionOwnership($userId, $sessionId)) {
            return $sessionId;
        }
        
        return \Illuminate\Support\Str::uuid()->toString();
    }
}
