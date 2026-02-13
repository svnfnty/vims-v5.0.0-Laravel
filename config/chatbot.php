<?php

return [
    /*
    |--------------------------------------------------------------------------
    | AI Provider Configuration
    |--------------------------------------------------------------------------
    |
    | This configuration file contains settings for the AI chatbot integration.
    | Supports OpenAI and OpenRouter for access to multiple AI models.
    |
    | For OpenAI: OPENAI_API_KEY=your-openai-key
    | For OpenRouter: OPENROUTER_API_KEY=your-openrouter-key
    |
    */

    'provider' => env('AI_PROVIDER', 'openrouter'), // 'openai' or 'openrouter'

    /*
    |--------------------------------------------------------------------------
    | API Keys
    |--------------------------------------------------------------------------
    */

    'openai_api_key' => env('OPENAI_API_KEY', ''),
    
    'openrouter_api_key' => env('OPENROUTER_API_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | API Endpoints
    |--------------------------------------------------------------------------
    */

    'openai_endpoint' => 'https://api.openai.com/v1/chat/completions',
    
    'openrouter_endpoint' => 'https://openrouter.ai/api/v1/chat/completions',

    /*
    |--------------------------------------------------------------------------
    | Available Models (OpenRouter) - FREE MODELS ONLY
    |--------------------------------------------------------------------------
    |
    | These models are available for FREE on OpenRouter (with rate limits):
    | - meta-llama/llama-3.1-8b-instruct (Free tier)
    | - meta-llama/llama-3-8b-instruct (Free tier)
    | - google/gemini-flash-1.5 (Free tier)
    | - mistralai/mistral-7b-instruct (Free tier)
    | - microsoft/phi-3-mini-128k-instruct (Free tier)
    | - huggingfaceh4/zephyr-7b-beta (Free tier)
    |
    | Note: Free models have rate limits. For production use, consider upgrading.
    |
    */

    'model' => env('AI_MODEL', 'meta-llama/llama-3.1-8b-instruct'),

    /*
    |--------------------------------------------------------------------------
    | Model Recommendations by Use Case - FREE ONLY
    |--------------------------------------------------------------------------
    |
    | Free models available: Llama 3.1 8B, Llama 3 8B, Gemini Flash, Mistral 7B
    |
    */

    'available_models' => [
        'meta-llama/llama-3.1-8b-instruct' => 'Llama 3.1 8B (Free - Recommended)',
        'meta-llama/llama-3-8b-instruct' => 'Llama 3 8B (Free)',
        'google/gemini-flash-1.5' => 'Gemini Flash 1.5 (Free)',
        'mistralai/mistral-7b-instruct' => 'Mistral 7B (Free)',
        'microsoft/phi-3-mini-128k-instruct' => 'Phi-3 Mini (Free)',
        'huggingfaceh4/zephyr-7b-beta' => 'Zephyr 7B (Free)',
    ],


    /*
    |--------------------------------------------------------------------------
    | Chatbot Settings
    |--------------------------------------------------------------------------
    */

    'max_tokens' => env('AI_MAX_TOKENS', 500),
    
    'temperature' => env('AI_TEMPERATURE', 0.7),

    /*
    |--------------------------------------------------------------------------
    | System Prompt
    |--------------------------------------------------------------------------
    |
    | This is the system prompt that defines the chatbot's behavior and context.
    | For more human-like conversations, use a personality-driven prompt.
    |
    */

    'system_prompt' => env('CHATBOT_SYSTEM_PROMPT', 'You are VIMSY, a friendly and knowledgeable AI assistant for the Vehicle Insurance Management System (VIMS). You help users navigate the system and understand all features.

## SYSTEM OVERVIEW:
VIMS is a comprehensive Vehicle Insurance Management System with these main modules:

### 1. DASHBOARD
- Central hub showing system overview
- Search functionality for quick lookups
- Access: Click "Dashboard" in sidebar or go to /dashboard

### 2. CLIENT MANAGEMENT
- View all clients: Click "Client List" in sidebar
- Add new client: Click + button, fill form (name, contact, address, etc.)
- Edit client: Click edit icon on client row
- Delete client: Click delete icon (with confirmation)
- View client details: Click on client name
- Search/filter clients using DataTables

### 3. INSURANCE MANAGEMENT
- View all insurance records: Click "Insurance" in sidebar
- Add new insurance: Fill form with COC number, MV File number, policy details
- Validation: System checks for duplicate COC and MV File numbers
- Edit/Delete insurance records
- Categories: Organize insurance by type/category

### 4. POLICY MANAGEMENT
- View policies: Click "Policies" in sidebar
- Policy Series: Manage policy number series/sequences
- Add new policy: Link to client and insurance
- Track policy status and details

### 5. WALK-IN MANAGEMENT
- Track walk-in customers
- Record inquiries and visits
- Convert walk-ins to clients

### 6. OFFICE MANAGEMENT
- Manage office locations/branches
- Assign users to offices
- Track office-specific data

### 7. USER MANAGEMENT
- View all users: Click "Users" in sidebar
- Add new users: Set name, email, role, password
- Edit user details and permissions
- Delete users (admin only)

### 8. ACCOUNT SETTINGS
- Access: Click user dropdown → "My Account"
- Update profile information
- Change password
- View account details

### 9. SYSTEM SETTINGS
- Access: Click "System Settings" in sidebar
- Configure system name, logo, cover image
- Set system short name
- Toggle maintenance mode (admin only)

## COMMON WORKFLOWS:

**Adding a New Client:**
1. Go to Client List → Click Add
2. Fill: Name, Contact Number, Email, Address
3. Save → Client appears in list

**Creating Insurance Policy:**
1. Go to Insurance → Click Add
2. Fill: COC Number, MV File Number, Policy Details
3. Select Category
4. Link to Client
5. Save → Policy created

**Processing a Walk-in:**
1. Go to Walk-in section
2. Add new walk-in record
3. Record details and inquiry
4. Follow up or convert to client

**Managing Users (Admin):**
1. Go to Users section
2. Add/Edit/Delete users
3. Set roles and permissions

## NAVIGATION TIPS:
- Sidebar menu for all main sections
- Use search in Dashboard for quick finds
- DataTables provide sorting, filtering, pagination
- Confirmation dialogs for destructive actions
- Toast notifications for success/error feedback

## HELPFUL PHRASES:
- "I\'d be happy to walk you through that!"
- "Here\'s how you can do that..."
- "Great question! Let me explain..."
- "You can find that in the [Module] section"
- "Would you like step-by-step instructions?"

Always be encouraging, clear, and specific about which buttons to click and what forms to fill. If unsure about technical details, guide users to the appropriate section of the system.'),


    /*
    |--------------------------------------------------------------------------
    | Conversation History Settings
    |--------------------------------------------------------------------------
    |
    | Enable conversation history to remember context across messages.
    |
    */

    'enable_history' => env('CHATBOT_ENABLE_HISTORY', true),

    'max_history_messages' => env('CHATBOT_MAX_HISTORY', 20), // Number of previous messages to remember

    'session_timeout' => env('CHATBOT_SESSION_TIMEOUT', 60), // Minutes before starting fresh conversation

    /*
    |--------------------------------------------------------------------------
    | Human-like Conversation Settings
    |--------------------------------------------------------------------------
    |
    | Adjust these to make responses more natural and human-like.
    |
    */

    'personality' => env('CHATBOT_PERSONALITY', 'friendly'), // friendly, professional, casual

    'use_emojis' => env('CHATBOT_USE_EMOJIS', true), // Occasionally use emojis

    'greeting_enabled' => env('CHATBOT_GREETING', true), // Enable personalized greetings

    /*
    |--------------------------------------------------------------------------
    | OpenRouter Optional Headers
    |--------------------------------------------------------------------------
    */

    'openrouter_http_referer' => env('OPENROUTER_HTTP_REFERER', 'http://localhost'),
    
    'openrouter_x_title' => env('OPENROUTER_X_TITLE', 'VIMS AI Chatbot'),

];
