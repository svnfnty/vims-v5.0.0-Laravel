<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\ChatHistory;
use Illuminate\Support\Str;

class ChatbotController extends Controller
{

    /**
     * Display the chatbot interface
     */
    public function index()
    {
        return view('chatbot.index');
    }

    /**
     * Handle chat messages from the AI chatbot with conversation history
     * Automatically switches to alternative free model if rate limited
     */
    public function chat(Request $request)
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return response()->json([
                'error' => 'Authentication required. Please log in to use the chatbot.'
            ], 401);
        }

        $request->validate([
            'message' => 'required|string|max:2000',
            'session_id' => 'nullable|string',
        ]);

        $message = $request->input('message');
        $userId = auth()->id();
        
        // Validate and get session ID - ensures session belongs to user or creates new one
        $sessionId = ChatHistory::getOrCreateSession($userId, $request->input('session_id'));
        
        // Determine provider and get configuration
        $provider = config('chatbot.provider', 'openrouter');
        $model = config('chatbot.model', 'meta-llama/llama-3.1-8b-instruct');
        
        // Get API key based on provider
        if ($provider === 'openrouter') {
            $apiKey = config('chatbot.openrouter_api_key');
            $endpoint = config('chatbot.openrouter_endpoint');
        } else {
            $apiKey = config('chatbot.openai_api_key');
            $endpoint = config('chatbot.openai_endpoint');
        }
        
        // If no API key is configured, return a helpful message
        if (empty($apiKey)) {
            $keyName = $provider === 'openrouter' ? 'OPENROUTER_API_KEY' : 'OPENAI_API_KEY';
            return response()->json([
                'error' => "API key is not configured. Please add your API key to the .env file as {$keyName}=your-api-key-here",
                'session_id' => $sessionId
            ], 400);
        }

        try {
            // Build messages array with conversation history
            $messages = $this->buildMessagesWithHistory($userId, $sessionId, $message);
            
            // Prepare headers
            $headers = [
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ];
            
            // Add OpenRouter specific headers if using OpenRouter
            if ($provider === 'openrouter') {
                $httpReferer = config('chatbot.openrouter_http_referer');
                // If config value is default/empty, use the actual request URL
                if (empty($httpReferer) || $httpReferer === 'http://localhost') {
                    $httpReferer = request()->getSchemeAndHttpHost();
                }
                $headers['HTTP-Referer'] = $httpReferer;
                $headers['X-Title'] = config('chatbot.openrouter_x_title', 'VIMS AI Chatbot');
            }

            // Make request to AI API
            $response = Http::withHeaders($headers)->post($endpoint, [
                'model' => $model,
                'messages' => $messages,
                'max_tokens' => config('chatbot.max_tokens', 500),
                'temperature' => config('chatbot.temperature', 0.7),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['choices'][0]['message']['content'] ?? 'Sorry, I could not process your request.';
                
                // Save conversation to history
                $this->saveConversation($userId, $sessionId, $message, $reply, $model);
                
                return response()->json([
                    'reply' => $reply,
                    'session_id' => $sessionId,
                    'model_used' => $model
                ]);
            } else {
                $errorBody = $response->body();
                $statusCode = $response->status();
                Log::error('AI API error: ' . $errorBody);
                
                // Check if it's a rate limit error (429) or rate limit message
                $errorData = json_decode($errorBody, true);
                $errorMessage = $errorData['error']['message'] ?? '';
                
                $isRateLimit = $statusCode === 429 || 
                    stripos($errorMessage, 'rate limit') !== false ||
                    stripos($errorMessage, 'too many requests') !== false ||
                    stripos($errorMessage, 'quota exceeded') !== false;
                
                // If rate limited, try alternative free model automatically
                if ($isRateLimit && $provider === 'openrouter') {
                    $alternativeModel = $this->getAlternativeModel($model);
                    
                    if ($alternativeModel !== $model) {
                        Log::info("Rate limited on {$model}, trying alternative: {$alternativeModel}");
                        
                        // Retry with alternative model
                        $retryResponse = Http::withHeaders($headers)->post($endpoint, [
                            'model' => $alternativeModel,
                            'messages' => $messages,
                            'max_tokens' => config('chatbot.max_tokens', 500),
                            'temperature' => config('chatbot.temperature', 0.7),
                        ]);
                        
                        if ($retryResponse->successful()) {
                            $data = $retryResponse->json();
                            $reply = $data['choices'][0]['message']['content'] ?? 'Sorry, I could not process your request.';
                            
                            // Save conversation to history
                            $this->saveConversation($userId, $sessionId, $message, $reply, $alternativeModel);
                            
                            return response()->json([
                                'reply' => $reply,
                                'session_id' => $sessionId,
                                'model_used' => $alternativeModel,
                                'notice' => "Automatically switched to {$alternativeModel} due to rate limits on previous model."
                            ]);
                        }
                    }
                }
                
                // If retry failed or not rate limit, return error
                return response()->json([
                    'error' => "API Error: {$errorMessage}. Please try again in a moment or check your API key.",
                    'session_id' => $sessionId,
                    'is_rate_limit' => $isRateLimit
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Chatbot error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Sorry, something went wrong. Please make sure your API key is configured correctly in the .env file.',
                'session_id' => $sessionId
            ], 500);
        }
    }


    /**
     * Build messages array with conversation history
     */
    private function buildMessagesWithHistory($userId, $sessionId, $currentMessage)
    {
        $messages = [];
        
        // Add system prompt
        $messages[] = [
            'role' => 'system',
            'content' => config('chatbot.system_prompt')
        ];
        
        // Add conversation history if enabled
        if (config('chatbot.enable_history', true)) {
            $history = ChatHistory::getRecentContext($userId, $sessionId, config('chatbot.max_history_messages', 20));
            
            foreach ($history as $chat) {
                $messages[] = [
                    'role' => $chat->role,
                    'content' => $chat->content
                ];
            }
        }
        
        // Add current message
        $messages[] = [
            'role' => 'user',
            'content' => $currentMessage
        ];
        
        return $messages;
    }

    /**
     * Save conversation to database
     */
    private function saveConversation($userId, $sessionId, $userMessage, $assistantReply, $model)
    {
        if (!config('chatbot.enable_history', true)) {
            return;
        }
        
        // Save user message
        ChatHistory::create([
            'user_id' => $userId,
            'session_id' => $sessionId,
            'role' => 'user',
            'content' => $userMessage,
            'model_used' => $model,
        ]);
        
        // Save assistant reply
        ChatHistory::create([
            'user_id' => $userId,
            'session_id' => $sessionId,
            'role' => 'assistant',
            'content' => $assistantReply,
            'model_used' => $model,
        ]);
    }

    /**
     * Get conversation history for a session
     */
    public function getHistory(Request $request)
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return response()->json([
                'error' => 'Authentication required. Please log in to view chat history.',
                'history' => []
            ], 401);
        }

        $request->validate([
            'session_id' => 'required|string',
        ]);
        
        $userId = auth()->id();
        $sessionId = $request->input('session_id');
        
        // Validate session ownership
        if (!ChatHistory::validateSessionOwnership($userId, $sessionId)) {
            return response()->json([
                'error' => 'Session not found or access denied',
                'history' => []
            ], 403);
        }
        
        $history = ChatHistory::getSessionMessages($userId, $sessionId);
        
        return response()->json([
            'history' => $history,
            'session_id' => $sessionId,
            'message_count' => $history->count()
        ]);
    }

    /**
     * Get all sessions for the authenticated user
     */
    public function getUserSessions(Request $request)
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return response()->json([
                'error' => 'Authentication required. Please log in to view sessions.',
                'sessions' => []
            ], 401);
        }

        $userId = auth()->id();
        $limit = $request->input('limit', 10);
        
        $sessions = ChatHistory::getUserSessions($userId, $limit);
        
        // Enhance sessions with first message preview
        $enhancedSessions = $sessions->map(function ($session) use ($userId) {
            $firstMessage = ChatHistory::getSessionFirstMessage($userId, $session->session_id);
            return [
                'session_id' => $session->session_id,
                'message_count' => $session->message_count,
                'last_activity' => $session->last_activity,
                'started_at' => $session->started_at,
                'preview' => $firstMessage ? substr($firstMessage->content, 0, 50) . '...' : 'New Conversation'
            ];
        });
        
        return response()->json([
            'sessions' => $enhancedSessions,
            'current_session' => $request->input('current_session')
        ]);
    }

    /**
     * Delete a specific session
     */
    public function deleteSession(Request $request)
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return response()->json([
                'error' => 'Authentication required. Please log in to delete sessions.'
            ], 401);
        }

        $request->validate([
            'session_id' => 'required|string',
        ]);
        
        $userId = auth()->id();
        $sessionId = $request->input('session_id');
        
        // Validate session ownership before deletion
        if (!ChatHistory::validateSessionOwnership($userId, $sessionId)) {
            return response()->json([
                'error' => 'Session not found or access denied'
            ], 403);
        }
        
        ChatHistory::deleteSession($userId, $sessionId);
        
        return response()->json([
            'message' => 'Session deleted successfully',
            'session_id' => $sessionId
        ]);
    }

    /**
     * Clear conversation history for a session
     */
    public function clearHistory(Request $request)
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return response()->json([
                'error' => 'Authentication required. Please log in to clear history.'
            ], 401);
        }

        $request->validate([
            'session_id' => 'required|string',
        ]);
        
        $userId = auth()->id();
        $sessionId = $request->input('session_id');
        
        // Validate session ownership
        if (!ChatHistory::validateSessionOwnership($userId, $sessionId)) {
            return response()->json([
                'error' => 'Session not found or access denied'
            ], 403);
        }
        
        ChatHistory::clearSession($userId, $sessionId);
        
        return response()->json([
            'message' => 'Conversation history cleared successfully',
            'session_id' => $sessionId
        ]);
    }


    /**
     * Get available models for the chatbot (FREE models only)
     */
    public function getModels()
    {
        $models = config('chatbot.available_models', []);
        $currentModel = config('chatbot.model');
        
        // Add free model notice
        $freeModelNotice = "These models are FREE on OpenRouter with rate limits. Recommended: Llama 3.1 8B for best balance of quality and speed.";
        
        return response()->json([
            'models' => $models,
            'current' => $currentModel,
            'provider' => config('chatbot.provider'),
            'notice' => $freeModelNotice,
            'is_free_tier' => true
        ]);
    }

    /**
     * Get alternative free model when current one is rate limited
     */
    private function getAlternativeModel($currentModel)
    {
        $freeModels = array_keys(config('chatbot.available_models', []));
        
        // Remove current model from alternatives to get a different one
        $alternatives = array_diff($freeModels, [$currentModel]);
        
        // Return first alternative, or default if no alternatives
        return array_values($alternatives)[0] ?? 'meta-llama/llama-3.1-8b-instruct';
    }


    /**
     * Handle rate limit errors with fallback to alternative free models
     */
    private function handleRateLimitError($currentModel)
    {
        $freeModels = [
            'meta-llama/llama-3.1-8b-instruct',
            'meta-llama/llama-3-8b-instruct',
            'google/gemini-flash-1.5',
            'mistralai/mistral-7b-instruct'
        ];
        
        // Remove current model from alternatives
        $alternatives = array_diff($freeModels, [$currentModel]);
        
        return array_values($alternatives)[0] ?? 'meta-llama/llama-3.1-8b-instruct';
    }

    /**
     * Format AI response with enhanced HTML/markdown support
     * Converts markdown-style formatting to HTML for better display
     */
    private function formatResponse($content)
    {
        // Convert markdown-style formatting to HTML
        $formatted = $content;
        
        // Headers
        $formatted = preg_replace('/^### (.*$)/m', '<h3>$1</h3>', $formatted);
        $formatted = preg_replace('/^## (.*$)/m', '<h2>$1</h2>', $formatted);
        $formatted = preg_replace('/^# (.*$)/m', '<h1>$1</h1>', $formatted);
        
        // Bold and Italic
        $formatted = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', $formatted);
        $formatted = preg_replace('/__(.*?)__/', '<strong>$1</strong>', $formatted);
        $formatted = preg_replace('/\*(.*?)\*/', '<em>$1</em>', $formatted);
        $formatted = preg_replace('/_(.*?)_/', '<em>$1</em>', $formatted);
        
        // Code blocks with language support
        $formatted = preg_replace_callback('/```(\w+)?\n(.*?)\n```/s', function($matches) {
            $language = $matches[1] ?? 'code';
            $code = htmlspecialchars($matches[2]);
            return "<div class=\"code-block-header\"><span>{$language}</span></div><pre><code>{$code}</code></pre>";
        }, $formatted);
        
        // Inline code
        $formatted = preg_replace('/`([^`]+)`/', '<code>$1</code>', $formatted);
        
        // Lists
        $formatted = preg_replace('/^- (.*$)/m', '<li>$1</li>', $formatted);
        $formatted = preg_replace('/(<li>.*<\/li>\n?)+/', '<ul>$0</ul>', $formatted);
        
        // Numbered lists
        $formatted = preg_replace('/^\d+\. (.*$)/m', '<li>$1</li>', $formatted);
        
        // Blockquotes
        $formatted = preg_replace('/^> (.*$)/m', '<blockquote>$1</blockquote>', $formatted);
        
        // Links
        $formatted = preg_replace('/\[([^\]]+)\]\(([^)]+)\)/', '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>', $formatted);
        
        // Auto-link URLs
        $formatted = preg_replace('/(https?:\/\/[^\s<]+)/', '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>', $formatted);
        
        // Line breaks (preserve existing HTML)
        $formatted = nl2br($formatted);
        
        // Clean up - remove br tags after block elements
        $formatted = preg_replace('/(<\/(h[1-4]|ul|ol|li|blockquote|pre)>)\s*<br\s*\/?>/', '$1', $formatted);
        
        return $formatted;
    }

    /**
     * Create an info card response
     */
    private function createInfoCard($title, $content)
    {
        return [
            'type' => 'info_card',
            'title' => $title,
            'content' => $content,
            'html' => "<div class=\"info-card\"><div class=\"info-card-title\"><i class=\"bi bi-info-circle\"></i> {$title}</div>{$content}</div>"
        ];
    }

    /**
     * Create a warning card response
     */
    private function createWarningCard($title, $content)
    {
        return [
            'type' => 'warning_card',
            'title' => $title,
            'content' => $content,
            'html' => "<div class=\"warning-card\"><div class=\"warning-card-title\"><i class=\"bi bi-exclamation-triangle\"></i> {$title}</div>{$content}</div>"
        ];
    }

    /**
     * Create a success card response
     */
    private function createSuccessCard($title, $content)
    {
        return [
            'type' => 'success_card',
            'title' => $title,
            'content' => $content,
            'html' => "<div class=\"success-card\"><div class=\"success-card-title\"><i class=\"bi bi-check-circle\"></i> {$title}</div>{$content}</div>"
        ];
    }

    /**
     * Create a step-by-step guide response
     */
    private function createStepGuide($steps)
    {
        $html = '<div class="step-guide">';
        foreach ($steps as $index => $step) {
            $stepNum = $index + 1;
            $html .= "<div class=\"step-item\"><div class=\"step-number\">{$stepNum}</div><div class=\"step-content\">{$step}</div></div>";
        }
        $html .= '</div>';
        
        return [
            'type' => 'step_guide',
            'steps' => $steps,
            'html' => $html
        ];
    }

    /**
     * Format error message with enhanced styling
     */
    private function formatErrorMessage($error, $suggestion = null)
    {
        $formatted = "<div class=\"error-card\"><div class=\"error-card-title\"><i class=\"bi bi-exclamation-circle\"></i> Error</div>";
        $formatted .= "<p>{$error}</p>";
        
        if ($suggestion) {
            $formatted .= "<p style=\"margin-top: 8px; font-size: 13px;\"><strong>Suggestion:</strong> {$suggestion}</p>";
        }
        
        $formatted .= "</div>";
        
        return $formatted;
    }

    /**
     * Detect if response contains structured data and format accordingly
     */
    private function detectAndFormatStructure($content)
    {
        // Check for step-by-step instructions
        if (preg_match('/(?:step|Step)\s*\d+[:.]/i', $content) || preg_match('/^\d+\.\s+/m', $content)) {
            // Extract steps
            preg_match_all('/(?:step\s*\d+[:.]?\s*|\d+\.\s*)(.+?)(?=(?:step\s*\d+[:.]?\s*|\d+\.\s*)|$)/is', $content, $matches);
            if (!empty($matches[1])) {
                return $this->createStepGuide(array_map('trim', $matches[1]));
            }
        }
        
        // Check for important/warning notes
        if (preg_match('/(?:important|warning|note|alert|caution)[:!]/i', $content)) {
            // Extract the warning section
            if (preg_match('/(?:important|warning|note|alert|caution)[:!]\s*(.+?)(?=\n\n|\Z)/is', $content, $match)) {
                $warningContent = $match[1];
                $title = ucfirst(strtolower($match[0]));
                return $this->createWarningCard($title, $warningContent);
            }
        }
        
        return null;
    }

}
