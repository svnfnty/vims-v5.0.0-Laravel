{{-- Chatbot Floating Button and Chat Interface --}}
<style>
    /* Chatbot Styles */
    .chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .chatbot-toggle-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #0d6efd;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(13, 110, 253, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .chatbot-toggle-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(13, 110, 253, 0.5);
    }


    .chatbot-toggle-btn i {
        color: white;
        font-size: 24px;
    }

    .chatbot-close-btn {
        display: none;
    }

    .chatbot-window {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 380px;
        height: 500px;
        max-height: calc(100vh - 120px);
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .chatbot-window.show {
        display: flex;
    }

    .chatbot-toggle-btn .chatbot-open-btn {
        display: block;
    }

    .chatbot-toggle-btn .chatbot-close-btn {
        display: none;
    }

    .chatbot-window.show + .chatbot-toggle-btn .chatbot-open-btn {
        display: none;
    }

    .chatbot-window.show + .chatbot-toggle-btn .chatbot-close-btn {
        display: block;
    }

    .chatbot-header {
        background: #0d6efd;
        color: white;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .chatbot-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
    }

    .chatbot-header .chatbot-status {
        font-size: 11px;
        opacity: 0.9;
    }

    .chatbot-session-selector {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
    }

    .chatbot-session-dropdown {
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        min-width: 150px;
    }

    .chatbot-session-dropdown option {
        background: #0d6efd;
        color: white;
    }

    .chatbot-new-chat-btn {
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 0.2s;
    }

    .chatbot-new-chat-btn:hover {
        background: rgba(255,255,255,0.3);
    }

    .chatbot-loading-history {
        text-align: center;
        padding: 20px;
        color: #6b7280;
        font-size: 13px;
    }

    .chatbot-empty-history {
        text-align: center;
        padding: 30px 20px;
        color: #9ca3af;
        font-size: 13px;
    }

    .chatbot-session-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        border-bottom: 1px solid #e5e7eb;
        cursor: pointer;
        transition: background 0.2s;
    }

    .chatbot-session-item:hover {
        background: #f3f4f6;
    }

    .chatbot-session-item.active {
        background: #dbeafe;
        border-left: 3px solid #0d6efd;
    }

    .chatbot-session-preview {
        font-size: 12px;
        color: #374151;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
    }

    .chatbot-session-meta {
        font-size: 10px;
        color: #9ca3af;
    }

    .chatbot-sessions-panel {
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        background: white;
        border-bottom: 1px solid #e5e7eb;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .chatbot-sessions-panel.show {
        display: block;
    }

    .chatbot-messages {
        flex: 1 1 auto;
        padding: 20px;
        padding-bottom: 100px;
        overflow-y: auto;
        overflow-x: hidden;
        background: #f8f9fa;
        display: flex;
        flex-direction: column;
        min-height: 0;
        position: relative;
    }

    .chatbot-message {
        margin-bottom: 16px;
        display: flex;
        align-items: flex-start;
        width: 100%;
        max-width: 100%;
        flex-shrink: 0;
        box-sizing: border-box;
    }

    .chatbot-message.bot {
        flex-direction: row;
    }

    .chatbot-message.user {
        flex-direction: row-reverse;
    }

    .chatbot-message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        flex-shrink: 0;
    }

    .chatbot-message.bot .chatbot-message-avatar {
        background: #0d6efd;
        color: white;
        margin-right: 10px;
    }


    .chatbot-message.user .chatbot-message-avatar {
        background: #10b981;
        color: white;
        margin-left: 10px;
    }

    .chatbot-message-content {
        max-width: 75%;
        min-width: 0;
        padding: 12px 27px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.6;
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
        flex: 0 1 auto;
        box-sizing: border-box;
    }

    .chatbot-message.bot .chatbot-message-content {
        background: white;
        color: #333;
        border-bottom-left-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        margin-right: auto;
        align-self: flex-start;
    }

    .chatbot-message.user .chatbot-message-content {
        background: #0d6efd;
        color: white;
        border-bottom-right-radius: 4px;
        margin-left: auto;
        align-self: flex-end;
    }

    /* Enhanced Message Content Styling */
    .chatbot-message-content h1,
    .chatbot-message-content h2,
    .chatbot-message-content h3,
    .chatbot-message-content h4 {
        margin: 12px 0 8px 0;
        font-weight: 600;
        color: #1a1a1a;
    }

    .chatbot-message-content h1 { font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; }
    .chatbot-message-content h2 { font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    .chatbot-message-content h3 { font-size: 15px; }
    .chatbot-message-content h4 { font-size: 14px; }

    .chatbot-message-content p {
        margin: 8px 0;
    }

    .chatbot-message-content ul,
    .chatbot-message-content ol {
        margin: 8px 0;
        padding-left: 24px;
        list-style-position: outside;
    }

    .chatbot-message-content li {
        margin: 4px 0;
        padding-left: 4px;
    }

    .chatbot-message-content strong {
        font-weight: 600;
        color: #1a1a1a;
    }

    .chatbot-message-content em {
        font-style: italic;
        color: #555;
    }

    .chatbot-message-content code {
        background: #f3f4f6;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 13px;
        color: #d63384;
    }

    .chatbot-message-content pre {
        background: #1e1e1e;
        color: #d4d4d4;
        padding: 16px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 12px 0;
        position: relative;
        max-width: 100%;
        white-space: pre-wrap;
        word-wrap: break-word;
        box-sizing: border-box;
    }

    .chatbot-message-content pre code {
        background: transparent;
        color: inherit;
        padding: 0;
        font-size: 13px;
        line-height: 1.5;
    }

    .code-block-header {
        background: #2d2d2d;
        color: #fff;
        padding: 8px 12px;
        border-radius: 8px 8px 0 0;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: -8px;
    }

    .code-block-header span {
        font-weight: 500;
    }

    .copy-code-btn {
        background: #404040;
        border: none;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        transition: background 0.2s;
    }

    .copy-code-btn:hover {
        background: #505050;
    }

    .chatbot-message-content blockquote {
        border-left: 4px solid #0d6efd;
        margin: 12px 0;
        padding: 8px px;
        background: #f8f9fa;
        border-radius: 0 8px 8px 0;
        font-style: italic;
        color: #555;
    }

    .chatbot-message-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 12px 0;
        font-size: 13px;
        display: block;
        overflow-x: auto;
        max-width: 100%;
        box-sizing: border-box;
    }

    .chatbot-message-content th,
    .chatbot-message-content td {
        border: 1px solid #e5e7eb;
        padding: 8px 12px;
        text-align: left;
    }

    .chatbot-message-content th {
        background: #f8f9fa;
        font-weight: 600;
    }

    .chatbot-message-content tr:nth-child(even) {
        background: #f9fafb;
    }

    .chatbot-message-content a {
        color: #0d6efd;
        text-decoration: none;
        border-bottom: 1px dotted #0d6efd;
        transition: all 0.2s;
    }

    .chatbot-message-content a:hover {
        color: #0a58ca;
        border-bottom: 1px solid #0a58ca;
    }

    /* Info Cards */
    .info-card {
        background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
        border-left: 4px solid #0ea5e9;
        padding: 12px 16px;
        border-radius: 8px;
        margin: 12px 0;
        max-width: 100%;
        box-sizing: border-box;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    .info-card-title {
        font-weight: 600;
        color: #0369a1;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .warning-card {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border-left: 4px solid #f59e0b;
        padding: 12px 16px;
        border-radius: 8px;
        margin: 12px 0;
        max-width: 100%;
        box-sizing: border-box;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    .warning-card-title {
        font-weight: 600;
        color: #b45309;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .success-card {
        background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        border-left: 4px solid #10b981;
        padding: 12px 16px;
        border-radius: 8px;
        margin: 12px 0;
        max-width: 100%;
        box-sizing: border-box;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    .success-card-title {
        font-weight: 600;
        color: #047857;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .error-card {
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        border-left: 4px solid #ef4444;
        padding: 12px 16px;
        border-radius: 8px;
        margin: 12px 0;
        max-width: 100%;
        box-sizing: border-box;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    .error-card-title {
        font-weight: 600;
        color: #b91c1c;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    /* Message Actions */
    .message-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        opacity: 0;
        transition: opacity 0.2s;
    }

    .chatbot-message:hover .message-actions {
        opacity: 1;
    }

    .message-action-btn {
        background: #f3f4f6;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        color: #6b7280;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .message-action-btn:hover {
        background: #e5e7eb;
        color: #374151;
    }

    .message-timestamp {
        font-size: 11px;
        color: #9ca3af;
        margin-top: 4px;
        text-align: right;
    }

    .chatbot-message.bot .message-timestamp {
        text-align: left;
    }

    /* Enhanced Scrollbar */
    .chatbot-messages::-webkit-scrollbar {
        width: 6px;
    }

    .chatbot-messages::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    .chatbot-messages::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }

    .chatbot-messages::-webkit-scrollbar-thumb:hover {
        background: #a1a1a1;
    }

    /* Step by Step Guide */
    .step-guide {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px;
        margin: 12px 0;
        max-width: 100%;
        box-sizing: border-box;
    }

    .step-item {
        display: flex;
        gap: 12px;
        margin: 8px 0;
        align-items: flex-start;
    }

    .step-number {
        background: #0d6efd;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        flex-shrink: 0;
    }

    .step-content {
        flex: 1;
        padding-top: 2px;
    }

    /* Quick Actions */
    .quick-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
    }

    .quick-action-btn {
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        padding: 6px 12px;
        border-radius: 16px;
        cursor: pointer;
        font-size: 12px;
        color: #374151;
        transition: all 0.2s;
    }

    .quick-action-btn:hover {
        background: #0d6efd;
        color: white;
        border-color: #0d6efd;
    }

    .chatbot-message.user .chatbot-message-content {
        background: #0d6efd;
        color: white;
        border-bottom-right-radius: 4px;
    }


    .chatbot-input-container {
        padding: 16px;
        background: white;
        border-top: 1px solid #eee;
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;
    }

    .chatbot-input {
        flex: 1;
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 24px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.3s ease;
    }

    .chatbot-input:focus {
        border-color: #0d6efd;
    }


    .chatbot-send-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #0d6efd;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
    }


    .chatbot-send-btn:hover {
        transform: scale(1.05);
    }

    .chatbot-send-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .chatbot-send-btn i {
        color: white;
        font-size: 18px;
    }

    .chatbot-typing {
        display: none;
        padding: 12px 16px;
        background: white;
        border-radius: 16px;
        border-bottom-left-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        margin-bottom: 16px;
        align-items: flex-start;
    }

    .chatbot-typing.show {
        display: flex;
    }

    .chatbot-typing-dot {
        width: 8px;
        height: 8px;
        background: #0d6efd;
        border-radius: 50%;
        margin: 0 2px;
        animation: typingBounce 1.4s infinite ease-in-out both;
    }


    .chatbot-typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .chatbot-typing-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typingBounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }

    .chatbot-error {
        background: #fee;
        color: #c00;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 13px;
    }

    /* Responsive */
    @media (max-width: 480px) {
        .chatbot-window {
            position: fixed;
            width: calc(100vw - 40px);
            height: calc(100vh - 120px);
            right: 20px;
            left: 20px;
            bottom: 90px;
            max-height: calc(100vh - 120px);
        }

        .chatbot-message-content {
            max-width: 80%;
            font-size: 13px;
        }

        .message-actions {
            opacity: 1;
        }

        .chatbot-container {
            right: 10px;
            bottom: 10px;
        }
    }

    /* Animations */
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    .bot-avatar-pulse {
        animation: pulse 2s infinite;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .chatbot-message.bot {
        animation: slideIn 0.3s ease;
    }
</style>

<div class="chatbot-container">
    <!-- Chat Window -->
    <div class="chatbot-window" id="chatbotWindow">
        <!-- Header -->
        <div class="chatbot-header">
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h3>VIMSYS AI 🤖</h3>
                        <span class="chatbot-status" id="chatbotStatus">Online • Ready to help</span>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="toggleSessionsPanel()" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;" title="Manage conversations">
                            <i class="bi bi-list-ul"></i>
                        </button>
                        <button onclick="clearConversation()" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;" title="Clear conversation">
                            <i class="bi bi-trash"></i>
                        </button>
                        <button class="chatbot-toggle-minimize" onclick="toggleChatbot()" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;">
                            <i class="bi bi-dash-lg"></i>
                        </button>
                    </div>
                </div>
                <div class="chatbot-session-selector">
                    <select class="chatbot-session-dropdown" id="sessionDropdown" onchange="switchSession(this.value)">
                        <option value="">Current Conversation</option>
                    </select>
                    <button class="chatbot-new-chat-btn" onclick="startNewConversation()">
                        <i class="bi bi-plus-lg"></i> New Chat
                    </button>
                </div>
            </div>
        </div>

        <!-- Sessions Panel -->
        <div class="chatbot-sessions-panel" id="sessionsPanel">
            <div style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; font-size: 13px; color: #374151;">
                Your Conversations
            </div>
            <div id="sessionsList">
                <!-- Sessions will be loaded here -->
            </div>
        </div>

        <!-- Messages -->
        <div class="chatbot-messages" id="chatbotMessages">
            <!-- Welcome Message -->
            <div class="chatbot-message bot">
                <div class="chatbot-message-avatar">
                    <i class="bi bi-robot"></i>
                </div>
                <div class="chatbot-message-content">
                    Hey there! 👋 I'm VIMSY, your friendly AI assistant! I'm here to help you with insurance policies, client questions, or anything about the system. What can I do for you today? 😊
                </div>
            </div>

            <!-- Typing Indicator -->
            <div class="chatbot-typing" id="chatbotTyping">
                <div class="chatbot-message-avatar">
                    <i class="bi bi-robot"></i>
                </div>
                <div style="display: flex; gap: 4px;">
                    <span class="chatbot-typing-dot"></span>
                    <span class="chatbot-typing-dot"></span>
                    <span class="chatbot-typing-dot"></span>
                </div>
            </div>
        </div>


        <!-- Input -->
        <div class="chatbot-input-container">
            <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Type your message..." autocomplete="off">
            <button class="chatbot-send-btn" id="chatbotSendBtn" onclick="sendMessage()">
                <i class="bi bi-send"></i>
            </button>
        </div>
    </div>

    <!-- Toggle Button -->
    <button class="chatbot-toggle-btn" onclick="toggleChatbot()">
        <i class="bi bi-chat-dots-fill chatbot-open-btn"></i>
        <i class="bi bi-x-lg chatbot-close-btn"></i>
    </button>
</div>

<script>
    let isChatbotOpen = false;
    let sessionId = localStorage.getItem('chatbot_session_id') || null;
    let userSessions = [];
    let isLoadingHistory = false;

    function toggleChatbot() {
        const window = document.getElementById('chatbotWindow');
        const btn = document.querySelector('.chatbot-toggle-btn');
        
        if (isChatbotOpen) {
            window.classList.remove('show');
            btn.style.transform = 'rotate(0deg)';
        } else {
            window.classList.add('show');
            btn.style.transform = 'rotate(90deg)';
            // Load conversation history and user sessions when opening
            loadUserSessions();
            if (sessionId) {
                loadConversationHistory();
            }
        }
        isChatbotOpen = !isChatbotOpen;
    }

    function toggleSessionsPanel() {
        const panel = document.getElementById('sessionsPanel');
        panel.classList.toggle('show');
    }

    function startNewConversation() {
        // Clear current session and start fresh
        sessionId = null;
        localStorage.removeItem('chatbot_session_id');
        
        // Clear messages except welcome
        const messagesContainer = document.getElementById('chatbotMessages');
        const welcomeMessage = messagesContainer.querySelector('.chatbot-message');
        const typingIndicator = document.getElementById('chatbotTyping');
        
        messagesContainer.innerHTML = '';
        if (welcomeMessage) messagesContainer.appendChild(welcomeMessage);
        messagesContainer.appendChild(typingIndicator);
        
        // Update UI
        updateSessionDropdown();
        document.getElementById('chatbotStatus').textContent = 'New Conversation • Start chatting!';
        
        // Close sessions panel if open
        document.getElementById('sessionsPanel').classList.remove('show');
        
        // Focus input
        document.getElementById('chatbotInput').focus();
    }

    function switchSession(newSessionId) {
        if (!newSessionId || newSessionId === sessionId) return;
        
        sessionId = newSessionId;
        localStorage.setItem('chatbot_session_id', sessionId);
        
        // Clear and reload messages
        const messagesContainer = document.getElementById('chatbotMessages');
        const welcomeMessage = messagesContainer.querySelector('.chatbot-message');
        const typingIndicator = document.getElementById('chatbotTyping');
        
        messagesContainer.innerHTML = '';
        if (welcomeMessage) messagesContainer.appendChild(welcomeMessage);
        messagesContainer.appendChild(typingIndicator);
        
        // Load history for new session
        loadConversationHistory();
        updateSessionDropdown();
        
        // Close sessions panel
        document.getElementById('sessionsPanel').classList.remove('show');
    }

    async function loadUserSessions() {
        try {
            const response = await fetch('{{ route("chatbot.sessions") }}?current_session=' + sessionId);
            const data = await response.json();
            
            if (data.sessions) {
                userSessions = data.sessions;
                updateSessionDropdown();
                updateSessionsPanel();
            }
        } catch (error) {
            console.error('Error loading sessions:', error);
        }
    }

    function updateSessionDropdown() {
        const dropdown = document.getElementById('sessionDropdown');
        dropdown.innerHTML = '<option value="">Select a conversation...</option>';
        
        userSessions.forEach(session => {
            const option = document.createElement('option');
            option.value = session.session_id;
            option.textContent = session.preview || 'Conversation';
            if (session.session_id === sessionId) {
                option.selected = true;
                option.textContent += ' (Active)';
            }
            dropdown.appendChild(option);
        });
        
        // Add current session if not in list
        if (sessionId && !userSessions.find(s => s.session_id === sessionId)) {
            const option = document.createElement('option');
            option.value = sessionId;
            option.textContent = 'Current Conversation (Active)';
            option.selected = true;
            dropdown.appendChild(option);
        }
    }

    function updateSessionsPanel() {
        const panel = document.getElementById('sessionsList');
        panel.innerHTML = '';
        
        if (userSessions.length === 0) {
            panel.innerHTML = '<div class="chatbot-empty-history">No previous conversations</div>';
            return;
        }
        
        userSessions.forEach(session => {
            const item = document.createElement('div');
            item.className = 'chatbot-session-item' + (session.session_id === sessionId ? ' active' : '');
            item.onclick = () => switchSession(session.session_id);
            
            const date = new Date(session.last_activity).toLocaleDateString();
            const time = new Date(session.last_activity).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            item.innerHTML = `
                <div style="flex: 1; min-width: 0;">
                    <div class="chatbot-session-preview">${session.preview || 'Conversation'}</div>
                    <div class="chatbot-session-meta">${date} ${time} • ${session.message_count} messages</div>
                </div>
                <button onclick="event.stopPropagation(); deleteSession('${session.session_id}')" 
                        style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px;"
                        title="Delete conversation">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            
            panel.appendChild(item);
        });
    }

    async function deleteSession(sessionIdToDelete) {
        if (!confirm('Delete this conversation? This cannot be undone.')) return;
        
        try {
            const response = await fetch('{{ route("chatbot.sessions.delete", ["session_id" => "__SESSION_ID__"]) }}'.replace('__SESSION_ID__', sessionIdToDelete), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // If deleted current session, start new one
                if (sessionIdToDelete === sessionId) {
                    startNewConversation();
                }
                // Reload sessions list
                loadUserSessions();
            } else {
                alert(data.error || 'Failed to delete conversation');
            }
        } catch (error) {
            console.error('Error deleting session:', error);
            alert('Failed to delete conversation');
        }
    }

    function clearConversation() {
        if (!sessionId) return;
        
        if (confirm('Clear this conversation? This will remove all messages.')) {
            fetch('{{ route("chatbot.clear") }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
                body: JSON.stringify({ session_id: sessionId })
            })
            .then(() => {
                // Clear messages except welcome message
                const messagesContainer = document.getElementById('chatbotMessages');
                const welcomeMessage = messagesContainer.querySelector('.chatbot-message');
                const typingIndicator = document.getElementById('chatbotTyping');
                
                messagesContainer.innerHTML = '';
                if (welcomeMessage) messagesContainer.appendChild(welcomeMessage);
                messagesContainer.appendChild(typingIndicator);
                
                // Reset session
                sessionId = null;
                localStorage.removeItem('chatbot_session_id');
            });
        }
    }

    async function loadConversationHistory() {
        if (!sessionId || isLoadingHistory) return;
        
        isLoadingHistory = true;
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingIndicator = document.getElementById('chatbotTyping');
        
        // Show loading state
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'chatbot-loading-history';
        loadingDiv.id = 'historyLoading';
        loadingDiv.innerHTML = '<i class="bi bi-hourglass-split"></i> Loading conversation...';
        
        // Insert after welcome message
        const welcomeMessage = messagesContainer.querySelector('.chatbot-message');
        if (welcomeMessage) {
            welcomeMessage.after(loadingDiv);
        } else {
            messagesContainer.prepend(loadingDiv);
        }
        
        try {
            const response = await fetch(`{{ route("chatbot.history") }}?session_id=${sessionId}`);
            const data = await response.json();
            
            // Remove loading indicator
            const loading = document.getElementById('historyLoading');
            if (loading) loading.remove();
            
            if (response.status === 403) {
                // Session doesn't belong to user, start new
                console.warn('Session access denied, starting new conversation');
                startNewConversation();
                return;
            }
            
            if (data.history && data.history.length > 0) {
                // Clear existing messages except welcome
                const welcome = messagesContainer.querySelector('.chatbot-message');
                messagesContainer.innerHTML = '';
                if (welcome) messagesContainer.appendChild(welcome);
                
                // Add history messages with timestamps
                data.history.forEach(chat => {
                    if (chat.role !== 'system') {
                        const timestamp = new Date(chat.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        });
                        addMessageWithTimestamp(
                            chat.content, 
                            chat.role === 'user' ? 'user' : 'bot', 
                            timestamp,
                            false
                        );
                    }
                });
                
                messagesContainer.appendChild(typingIndicator);
                scrollToBottom();
                
                // Update status
                document.getElementById('chatbotStatus').textContent = 
                    `Loaded ${data.message_count} messages • Last active ${new Date().toLocaleTimeString()}`;
            } else {
                // No history - show empty state
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'chatbot-empty-history';
                emptyDiv.innerHTML = '<i class="bi bi-chat-square-text"></i><br>No messages yet. Start the conversation!';
                
                const welcome = messagesContainer.querySelector('.chatbot-message');
                if (welcome) {
                    welcome.after(emptyDiv);
                }
                
                setTimeout(() => {
                    emptyDiv.remove();
                }, 3000);
            }
        } catch (error) {
            console.error('Error loading history:', error);
            const loading = document.getElementById('historyLoading');
            if (loading) {
                loading.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Failed to load history';
                loading.style.color = '#ef4444';
                setTimeout(() => loading.remove(), 3000);
            }
        } finally {
            isLoadingHistory = false;
        }
    }

    function addMessageWithTimestamp(content, sender, timestamp, animate = true) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typing = document.getElementById('chatbotTyping');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;
        if (animate) {
            messageDiv.style.animation = 'fadeIn 0.3s ease';
        }
        
        const isError = false;
        const avatarIcon = sender === 'bot' ? 'bi bi-robot' : 'bi bi-person';
        const avatarBg = sender === 'bot' ? '#0d6efd' : '#10b981';
        const formattedContent = sender === 'bot' ? formatMessage(content) : content;

        messageDiv.innerHTML = `
            <div class="chatbot-message-avatar ${sender === 'bot' ? 'bot-avatar-pulse' : ''}" style="background: ${avatarBg};">
                <i class="${avatarIcon}"></i>
            </div>
            <div class="chatbot-message-content">
                ${formattedContent}
                <div class="message-timestamp">${timestamp}</div>
                ${sender === 'bot' ? `
                <div class="message-actions">
                    <button class="message-action-btn" onclick="copyMessage(this)">
                        <i class="bi bi-clipboard"></i> Copy
                    </button>
                    <button class="message-action-btn" onclick="rateMessage(this, 'helpful')">
                        <i class="bi bi-hand-thumbs-up"></i> Helpful
                    </button>
                    <button class="message-action-btn" onclick="rateMessage(this, 'not-helpful')">
                        <i class="bi bi-hand-thumbs-down"></i> Not helpful
                    </button>
                </div>
                ` : ''}
            </div>
        `;
        
        messagesContainer.insertBefore(messageDiv, typing);
    }


    function sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        const typing = document.getElementById('chatbotTyping');
        typing.classList.add('show');

        // Scroll to bottom
        scrollToBottom();

        // Send to server with session ID
        fetch('{{ route("chatbot.chat") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({ 
                message: message,
                session_id: sessionId 
            })
        })
        .then(response => response.json())
        .then(data => {
            typing.classList.remove('show');
            
            // Save session ID
            if (data.session_id) {
                sessionId = data.session_id;
                localStorage.setItem('chatbot_session_id', sessionId);
            }
            
            if (data.error) {
                addMessage(data.error, 'bot', true);
            } else {
                // Show notice if model was automatically switched
                if (data.notice) {
                    addSystemNotice(data.notice);
                }
                addMessage(data.reply, 'bot');
            }
        })

        .catch(error => {
            typing.classList.remove('show');
            addMessage('Sorry, something went wrong. Please try again later! 😅', 'bot', true);
        });
    }


    function formatMessage(content) {
        // Convert markdown-style formatting to HTML
        let formatted = content
            // Escape HTML first
            .replace(/&/g, '&amp;')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            // Code blocks
            .replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, lang, code) {
                const language = lang || 'code';
                return `<div class="code-block-header"><span>${language}</span><button class="copy-code-btn" onclick="copyToClipboard(this, \`${code.replace(/`/g, '\\`')}\`)"><i class="bi bi-clipboard"></i> Copy</button></div><pre><code>${code.trim()}</code></pre>`;
            })
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h4>')
            // Lists
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
            // Numbered lists
            .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
            // Blockquotes
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            // Tables (simple markdown)
            .replace(/\|(.+)\|/g, function(match, content) {
                const cells = content.split('|').map(c => c.trim()).filter(c => c);
                if (cells.length === 0) return '';
                return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
            })
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            // Auto-link URLs
            .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
            // Line breaks
            .replace(/\n/g, '<br>');

        // Wrap tables
        formatted = formatted.replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>');
        
        // Clean up empty paragraphs
        formatted = formatted.replace(/<p><\/p>/g, '');
        
        return formatted;
    }

    function addMessage(content, sender, isError = false, animate = true) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typing = document.getElementById('chatbotTyping');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;
        if (animate) {
            messageDiv.style.animation = 'fadeIn 0.3s ease';
        }
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (isError) {
            messageDiv.innerHTML = `
                <div class="chatbot-message-avatar">
                    <i class="bi bi-exclamation-triangle"></i>
                </div>
                <div class="chatbot-message-content" style="background: #fee; color: #c00;">
                    ${content}
                    <div class="message-timestamp">${timestamp}</div>
                </div>
            `;
        } else {
            const avatarIcon = sender === 'bot' ? 'bi bi-robot' : 'bi bi-person';
            const avatarBg = sender === 'bot' ? '#0d6efd' : '#10b981';
            const formattedContent = sender === 'bot' ? formatMessage(content) : content;

            messageDiv.innerHTML = `
                <div class="chatbot-message-avatar ${sender === 'bot' ? 'bot-avatar-pulse' : ''}" style="background: ${avatarBg};">
                    <i class="${avatarIcon}"></i>
                </div>
                <div class="chatbot-message-content">
                    ${formattedContent}
                    <div class="message-timestamp">${timestamp}</div>
                    ${sender === 'bot' ? `
                    <div class="message-actions">
                        <button class="message-action-btn" onclick="copyMessage(this)">
                            <i class="bi bi-clipboard"></i> Copy
                        </button>
                        <button class="message-action-btn" onclick="rateMessage(this, 'helpful')">
                            <i class="bi bi-hand-thumbs-up"></i> Helpful
                        </button>
                        <button class="message-action-btn" onclick="rateMessage(this, 'not-helpful')">
                            <i class="bi bi-hand-thumbs-down"></i> Not helpful
                        </button>
                    </div>
                    ` : ''}
                </div>
            `;
        }
        
        messagesContainer.insertBefore(messageDiv, typing);
        scrollToBottom();
    }

    function copyToClipboard(btn, text) {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check"></i> Copied!';
            btn.style.background = '#10b981';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '#404040';
            }, 2000);
        });
    }

    function copyMessage(btn) {
        const messageContent = btn.closest('.chatbot-message-content').cloneNode(true);
        // Remove action buttons and timestamp from clone
        messageContent.querySelector('.message-actions')?.remove();
        messageContent.querySelector('.message-timestamp')?.remove();
        
        let text = messageContent.innerText;
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check"></i> Copied!';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 2000);
        });
    }

    function rateMessage(btn, rating) {
        // Visual feedback
        const actions = btn.closest('.message-actions');
        actions.querySelectorAll('.message-action-btn').forEach(b => {
            b.style.opacity = '0.5';
        });
        btn.style.opacity = '1';
        btn.style.background = rating === 'helpful' ? '#d1fae5' : '#fee2e2';
        btn.style.color = rating === 'helpful' ? '#047857' : '#b91c1c';
        
        // Here you could send feedback to server
        console.log('Message rated:', rating);
    }


    function scrollToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addSystemNotice(notice) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typing = document.getElementById('chatbotTyping');
        
        const noticeDiv = document.createElement('div');
        noticeDiv.className = 'chatbot-system-notice';
        noticeDiv.style.cssText = 'text-align: center; margin: 8px 0; font-size: 12px; color: #666; font-style: italic;';
        noticeDiv.innerHTML = `<span style="background: #fff3cd; padding: 4px 8px; border-radius: 12px; border: 1px solid #ffeaa7;">⚠️ ${notice}</span>`;
        
        messagesContainer.insertBefore(noticeDiv, typing);
        scrollToBottom();
    }


    // Handle Enter key
    document.getElementById('chatbotInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // Add helpful functions for creating formatted responses
    function createInfoCard(title, content) {
        return `<div class="info-card"><div class="info-card-title"><i class="bi bi-info-circle"></i> ${title}</div>${content}</div>`;
    }

    function createWarningCard(title, content) {
        return `<div class="warning-card"><div class="warning-card-title"><i class="bi bi-exclamation-triangle"></i> ${title}</div>${content}</div>`;
    }

    function createSuccessCard(title, content) {
        return `<div class="success-card"><div class="success-card-title"><i class="bi bi-check-circle"></i> ${title}</div>${content}</div>`;
    }

    function createStepGuide(steps) {
        let html = '<div class="step-guide">';
        steps.forEach((step, index) => {
            html += `<div class="step-item"><div class="step-number">${index + 1}</div><div class="step-content">${step}</div></div>`;
        });
        html += '</div>';
        return html;
    }

    function createQuickActions(actions) {
        let html = '<div class="quick-actions">';
        actions.forEach(action => {
            html += `<button class="quick-action-btn" onclick="sendQuickAction('${action}')">${action}</button>`;
        });
        html += '</div>';
        return html;
    }

    function sendQuickAction(action) {
        document.getElementById('chatbotInput').value = action;
        sendMessage();
    }

    // Load history and sessions on page load
    document.addEventListener('DOMContentLoaded', function() {
        loadUserSessions();
        if (sessionId) {
            loadConversationHistory();
        }
    });

    // Close sessions panel when clicking outside
    document.addEventListener('click', function(e) {
        const panel = document.getElementById('sessionsPanel');
        const header = document.querySelector('.chatbot-header');
        if (panel.classList.contains('show') && !panel.contains(e.target) && !header.contains(e.target)) {
            panel.classList.remove('show');
        }
    });
</script>
