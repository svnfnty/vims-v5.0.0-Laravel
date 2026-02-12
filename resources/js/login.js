// Login page JavaScript - Chatbot functionality

// Chat window state
let isChatOpen = false;
let isMaximized = false;

/**
 * Toggle chat window visibility
 */
function toggleChatWindow() {
    const chatWindow = document.getElementById('chatWindow');
    const notificationCount = document.getElementById('notificationCount');
    
    if (isChatOpen) {
        chatWindow.style.display = 'none';
        isChatOpen = false;
    } else {
        chatWindow.style.display = 'flex';
        isChatOpen = true;
        // Reset notification count when opening
        if (notificationCount) {
            notificationCount.textContent = '0';
            notificationCount.style.display = 'none';
        }
    }
}

/**
 * Toggle chat window maximize state
 */
function toggleMaximize() {
    const chatWindow = document.getElementById('chatWindow');
    const maximizeBtn = document.getElementById('maximizeBtn');
    
    if (isMaximized) {
        chatWindow.classList.remove('maximized');
        if (maximizeBtn) {
            maximizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
        isMaximized = false;
    } else {
        chatWindow.classList.add('maximized');
        if (maximizeBtn) {
            maximizeBtn.innerHTML = '<i class="fas fa-compress"></i>';
        }
        isMaximized = true;
    }
}

/**
 * Handle key press in chat input
 * @param {KeyboardEvent} event
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

/**
 * Send message in chat
 */
function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'chat-message user-message';
    userMessageDiv.innerHTML = `
        <div class="user-tag" style="font-weight: 600; margin-bottom: 5px; color: #3b5998;">You</div>
        ${escapeHtml(message)}
        <div class="message-time" style="font-size: 12px; color: #999; margin-top: 5px; text-align: right;">${getCurrentTime()}</div>
    `;
    chatBox.appendChild(userMessageDiv);
    
    // Clear input
    userInput.value = '';
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Simulate AI response (in production, this would be an API call)
    setTimeout(() => {
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'chat-message ai-message';
        aiMessageDiv.innerHTML = `
            <div class="ai-tag">VIMSYS AI</div>
            Thank you for your message. I'm currently in demo mode. In production, I would provide helpful responses about system features, account issues, or server top-up instructions.
            <div class="message-time">${getCurrentTime()}</div>
        `;
        chatBox.appendChild(aiMessageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Get current time in 12-hour format
 * @returns {string}
 */
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
}

/**
 * Update notification count
 * @param {number} count
 */
function updateNotificationCount(count) {
    const notificationCount = document.getElementById('notificationCount');
    if (notificationCount) {
        notificationCount.textContent = count;
        notificationCount.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Make functions globally available
window.toggleChatWindow = toggleChatWindow;
window.toggleMaximize = toggleMaximize;
window.handleKeyPress = handleKeyPress;
window.sendMessage = sendMessage;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add any initialization logic here
    console.log('Login page loaded');

    // Password toggle functionality
    const passwordToggle = document.getElementById('password-toggle');
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('password-icon');

    if (passwordToggle && passwordInput && passwordIcon) {
        passwordToggle.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordIcon.classList.remove('fa-eye');
                passwordIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                passwordIcon.classList.remove('fa-eye-slash');
                passwordIcon.classList.add('fa-eye');
            }
        });
    }
});
