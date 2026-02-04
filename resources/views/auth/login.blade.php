<!DOCTYPE html>
<html lang="en"> 
<head>
    <meta charset="UTF-8">
    <title>VIMSYS SAAS APPLICATION GINGOOG BRANCH - Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Animate.css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <link rel="icon" href="https://ectpl-vimsys.com/vims-v4.0.0/uploads/logo-1738897187.png" type="image/png">
    <link rel="stylesheet" href="{{ asset('css/login.blade.css') }}">
    <link rel="stylesheet" href="{{ asset('css/app.blade.css') }}">
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <div class="login-left">
                <div class="login-left-content">
                    <div class="version-badge">v5.0.0 (APO Release)</div>
                    <div class="logo-container">
                        <img src="{{ asset('logo.png') }}" alt="Logo" class="logo">
                        <div class="system-name">VIMSYS SAAS APPLICATION GINGOOG BRANCH</div>
                        <div class="system-description">Vehicle Insurance Management System</div>
                    </div>
                    <ul class="features-list">
                        <li><i class="fas fa-check feature-icon"></i> Improved user interface</li>
                        <li><i class="fas fa-check feature-icon"></i> Enhanced security features</li>
                        <li><i class="fas fa-check feature-icon"></i> Bug fixes and performance improvements</li>
                        <li><i class="fas fa-check feature-icon"></i> Added activity log for user clicks</li>
                        <li><i class="fas fa-check feature-icon"></i> Integrated AI assistant for support</li>
                        <li><i class="fas fa-check feature-icon"></i> Backup and restore functionality</li>
                    </ul>
                    <div class="mt-4 text-center">
                        <p class="mb-0">Need help? Click the chat icon to talk with our AI assistant.</p>
                    </div>
                </div>
            </div>
            <div class="login-right">
                <h2 class="mb-4 animate__animated animate__fadeIn">Login to Your Account</h2>
                @if($errors->any())
                    <div class="error-msg">
                        @foreach($errors->all() as $error)
                            <div>{{ $error }}</div>
                        @endforeach
                    </div>
                @endif
                <form method="POST" action="{{ route('login.post') }}" id="login-frm">
                    @csrf
                    <div class="form-floating mb-3 animate__animated animate__fadeInUp animate__delay-1s">
                        <input type="text" class="form-control" id="email" name="email" placeholder="Email" required autofocus value="{{ old('email') }}">
                        <label for="email">Email</label>
                    </div>
                    <div class="form-floating mb-3 animate__animated animate__fadeInUp animate__delay-2s">
                        <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
                        <label for="password">Password</label>
                    </div>
                    <div class="terms-check form-check mb-3 animate__animated animate__fadeInUp animate__delay-3s">
                        <input class="form-check-input" type="checkbox" id="accept-eula" name="accept-eula" required>
                        <label class="form-check-label" for="accept-eula">
                            I accept the <a href="#" target="_blank">End-User Agreement (EULA)</a>
                        </label>
                    </div>
                    <div class="terms-check form-check mb-4 animate__animated animate__fadeInUp animate__delay-4s">
                        <input class="form-check-input" type="checkbox" id="accept-nda" name="accept-nda" required>
                        <label class="form-check-label" for="accept-nda">
                            I accept <a href="#" target="_blank">Non-Disclosure Agreement (NDA)</a>
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary btn-login w-100 mb-3 animate__animated animate__fadeInUp animate__delay-5s">
                        <i class="fas fa-sign-in-alt me-2"></i> Log In
                    </button>
                    <div class="copyright animate__animated animate__fadeInUp animate__delay-5s">
                        © 2025 SaaS System | All Rights Reserved
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- AI Chatbot Bubble -->
    <div class="chat-bubble" onclick="toggleChatWindow()">
        <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="AI Icon">
        <div class="notification" id="notificationCount">0</div>
    </div>
    <!-- AI Chatbot Window -->
    <div class="chat-window" id="chatWindow">
        <div class="chat-header">
            <span><i class="fas fa-robot me-2"></i> Vimsys AI Assistant</span>
            <div>
                <button onclick="toggleMaximize()" id="maximizeBtn"><i class="fas fa-expand"></i></button>
                <button onclick="toggleChatWindow()"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <div class="chat-box" id="chatBox">
            <div class="welcome-message">
                Hello! I'm your Vimsys AI assistant. How can I help you today?
            </div>
            <div class="chat-message ai-message">
                <div class="ai-tag">VIMSYS AI</div>
                You can ask me about system features, account issues, or server top-up instructions.
                <div class="message-time">{{ date('h:i A') }}</div>
            </div>
        </div>
        <div class="input-container">
            <input type="text" id="userInput" placeholder="Type your message here..." onkeypress="handleKeyPress(event)">
            <button onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
    <!-- JS Libraries -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</body>
</html>
