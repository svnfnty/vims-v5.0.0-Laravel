<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Maintenance - {{ $systemName ?? 'VIMS' }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }

        /* Animated background particles */
        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
        }

        .particle {
            position: absolute;
            display: block;
            list-style: none;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            animation: animate 25s linear infinite;
            bottom: -150px;
            border-radius: 50%;
        }

        .particle:nth-child(1) {
            left: 25%;
            width: 80px;
            height: 80px;
            animation-delay: 0s;
        }

        .particle:nth-child(2) {
            left: 10%;
            width: 20px;
            height: 20px;
            animation-delay: 2s;
            animation-duration: 12s;
        }

        .particle:nth-child(3) {
            left: 70%;
            width: 20px;
            height: 20px;
            animation-delay: 4s;
        }

        .particle:nth-child(4) {
            left: 40%;
            width: 60px;
            height: 60px;
            animation-delay: 0s;
            animation-duration: 18s;
        }

        .particle:nth-child(5) {
            left: 65%;
            width: 20px;
            height: 20px;
            animation-delay: 0s;
        }

        .particle:nth-child(6) {
            left: 75%;
            width: 110px;
            height: 110px;
            animation-delay: 3s;
        }

        .particle:nth-child(7) {
            left: 35%;
            width: 150px;
            height: 150px;
            animation-delay: 7s;
        }

        .particle:nth-child(8) {
            left: 50%;
            width: 25px;
            height: 25px;
            animation-delay: 15s;
            animation-duration: 45s;
        }

        .particle:nth-child(9) {
            left: 20%;
            width: 15px;
            height: 15px;
            animation-delay: 2s;
            animation-duration: 35s;
        }

        .particle:nth-child(10) {
            left: 85%;
            width: 150px;
            height: 150px;
            animation-delay: 0s;
            animation-duration: 11s;
        }

        @keyframes animate {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
                border-radius: 0;
            }
            100% {
                transform: translateY(-1000px) rotate(720deg);
                opacity: 0;
                border-radius: 50%;
            }
        }

        .maintenance-container {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 40px;
            max-width: 600px;
            width: 90%;
        }

        .maintenance-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 24px;
            padding: 50px 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.3);
            animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .icon-wrapper {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            box-shadow: 0 10px 30px rgba(245, 87, 108, 0.3);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 10px 30px rgba(245, 87, 108, 0.3);
            }
            50% {
                transform: scale(1.05);
                box-shadow: 0 15px 40px rgba(245, 87, 108, 0.4);
            }
        }

        .icon-wrapper i {
            font-size: 60px;
            color: white;
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 15px;
            letter-spacing: -0.5px;
        }

        .subtitle {
            font-size: 1.1rem;
            color: #718096;
            margin-bottom: 30px;
            line-height: 1.6;
        }

        .maintenance-message {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            border-radius: 16px;
            padding: 20px 25px;
            margin-bottom: 30px;
            border-left: 4px solid #ed8936;
        }

        .maintenance-message p {
            margin: 0;
            color: #744210;
            font-size: 1rem;
            font-weight: 500;
        }

        .maintenance-message i {
            color: #ed8936;
            margin-right: 10px;
        }

        .countdown {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 30px 0;
        }

        .countdown-item {
            background: #f7fafc;
            border-radius: 12px;
            padding: 15px 20px;
            min-width: 70px;
            border: 2px solid #e2e8f0;
        }

        .countdown-value {
            font-size: 2rem;
            font-weight: 700;
            color: #4a5568;
            display: block;
        }

        .countdown-label {
            font-size: 0.75rem;
            color: #a0aec0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn-home {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 35px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            border: none;
            cursor: pointer;
        }

        .btn-home:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
            color: white;
        }

        .btn-home i {
            font-size: 1.1rem;
        }

        .footer-text {
            margin-top: 30px;
            font-size: 0.875rem;
            color: #a0aec0;
        }

        .footer-text i {
            color: #e53e3e;
            animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        /* Responsive */
        @media (max-width: 576px) {
            .maintenance-card {
                padding: 35px 25px;
            }

            h1 {
                font-size: 1.75rem;
            }

            .icon-wrapper {
                width: 100px;
                height: 100px;
            }

            .icon-wrapper i {
                font-size: 50px;
            }

            .countdown {
                gap: 10px;
            }

            .countdown-item {
                padding: 12px 15px;
                min-width: 60px;
            }

            .countdown-value {
                font-size: 1.5rem;
            }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .maintenance-card {
                background: rgba(30, 30, 30, 0.95);
                color: white;
            }

            h1 {
                color: #f7fafc;
            }

            .subtitle {
                color: #a0aec0;
            }

            .countdown-item {
                background: #2d3748;
                border-color: #4a5568;
            }

            .countdown-value {
                color: #e2e8f0;
            }
        }
    </style>
</head>
<body>
    <!-- Animated Background Particles -->
    <ul class="particles">
        <li class="particle"></li>
        <li class="particle"></li>
        <li class="particle"></li>
        <li class="particle"></li>
        <li class="particle"></li>
        <li class="particle"></li>
        <li class="particle"></li>
        <li class="particle"></li>
        <li class="particle"></li>
        <li class="particle"></li>
    </ul>

    <div class="maintenance-container">
        <div class="maintenance-card">
            <div class="icon-wrapper">
                <i class="bi bi-tools"></i>
            </div>

            <h1>System Maintenance</h1>
            <p class="subtitle">
                We're currently performing scheduled maintenance to improve your experience. Please check back soon.
            </p>

            <!-- Countdown Timer -->
            <div class="countdown" id="countdown">
                <div class="countdown-item">
                    <span class="countdown-value" id="hours">00</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value" id="minutes">00</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value" id="seconds">00</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            </div>

            <a href="{{ url('/') }}" class="btn-home">
                <i class="bi bi-house-door-fill"></i>
                Back to Home
            </a>

            <p class="footer-text">
                Developed with <i class="bi bi-heart-fill"></i> by VIMSYS IT
            </p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Simple countdown timer (resets every hour for demo purposes)
        function updateCountdown() {
            const now = new Date();
            const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
            const diff = nextHour - now;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    </script>
</body>
</html>
