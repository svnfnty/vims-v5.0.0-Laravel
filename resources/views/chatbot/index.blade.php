{{-- Chatbot Floating Button and Chat Interface --}}
<style>
    /* Chatbot Styles */
    .chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 380px;
        height: 500px;
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
        padding: 16px 20px;
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
        font-size: 12px;
        opacity: 0.9;
    }

    .chatbot-messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        background: #f8f9fa;
    }

    .chatbot-message {
        margin-bottom: 16px;
        display: flex;
        align-items: flex-start;
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
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.5;
    }

    .chatbot-message.bot .chatbot-message-content {
        background: white;
        color: #333;
        border-bottom-left-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
            width: calc(100vw - 40px);
            height: calc(100vh - 120px);
            right: -10px;
        }
    }
</style>

<div class="chatbot-container">
    <!-- Chat Window -->
    <div class="chatbot-window" id="chatbotWindow">
        <!-- Header -->
        <div class="chatbot-header">
            <div>
                <h3>VIMSYS AI 🤖</h3>
                <span class="chatbot-status">Online • Ready to help</span>
            </div>
            <div style="display: flex; gap: 8px;">
                <button onclick="clearConversation()" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;" title="Clear conversation">
                    <i class="bi bi-trash"></i>
                </button>
                <button class="chatbot-toggle-minimize" onclick="toggleChatbot()" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;">
                    <i class="bi bi-dash-lg"></i>
                </button>
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

    function toggleChatbot() {
        const window = document.getElementById('chatbotWindow');
        const btn = document.querySelector('.chatbot-toggle-btn');
        
        if (isChatbotOpen) {
            window.classList.remove('show');
            btn.style.transform = 'rotate(0deg)';
        } else {
            window.classList.add('show');
            btn.style.transform = 'rotate(90deg)';
            // Load conversation history when opening
            if (sessionId) {
                loadConversationHistory();
            }
        }
        isChatbotOpen = !isChatbotOpen;
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

    function loadConversationHistory() {
        if (!sessionId) return;
        
        fetch(`{{ route("chatbot.history") }}?session_id=${sessionId}`)
            .then(response => response.json())
            .then(data => {
                if (data.history && data.history.length > 0) {
                    const messagesContainer = document.getElementById('chatbotMessages');
                    const typingIndicator = document.getElementById('chatbotTyping');
                    
                    // Clear existing messages except welcome
                    const welcomeMessage = messagesContainer.querySelector('.chatbot-message');
                    messagesContainer.innerHTML = '';
                    if (welcomeMessage) messagesContainer.appendChild(welcomeMessage);
                    
                    // Add history messages
                    data.history.forEach(chat => {
                        if (chat.role !== 'system') {
                            addMessage(chat.content, chat.role === 'user' ? 'user' : 'bot', false, false);
                        }
                    });
                    
                    messagesContainer.appendChild(typingIndicator);
                    scrollToBottom();
                }
            })
            .catch(error => console.error('Error loading history:', error));
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


    function addMessage(content, sender, isError = false, animate = true) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typing = document.getElementById('chatbotTyping');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;
        if (animate) {
            messageDiv.style.animation = 'fadeIn 0.3s ease';
        }
        
        if (isError) {
            messageDiv.innerHTML = `
                <div class="chatbot-message-avatar">
                    <i class="bi bi-exclamation-triangle"></i>
                </div>
                <div class="chatbot-message-content" style="background: #fee; color: #c00;">
                    ${content}
                </div>
            `;
        } else {
            const avatarIcon = sender === 'bot' ? 'bi bi-robot' : 'bi bi-person';
            const avatarBg = sender === 'bot' ? '#0d6efd' : '#10b981';

            messageDiv.innerHTML = `
                <div class="chatbot-message-avatar" style="background: ${avatarBg};">
                    <i class="${avatarIcon}"></i>
                </div>
                <div class="chatbot-message-content">
                    ${content}
                </div>
            `;
        }
        
        messagesContainer.insertBefore(messageDiv, typing);
        scrollToBottom();
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

    // Load history on page load if chat was previously open
    document.addEventListener('DOMContentLoaded', function() {
        if (sessionId) {
            loadConversationHistory();
        }
    });
</script>
