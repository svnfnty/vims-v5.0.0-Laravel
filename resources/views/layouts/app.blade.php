{{-- filepath: c:\xampp\htdocs\vims-v5.0.0\resources\views\layouts\app.blade.php --}}

<!DOCTYPE html>
<html lang="en">
<head> 
    <meta charset="UTF-8">
    <title>{{ $systemName }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="icon" href="{{ $systemLogo ? asset('storage/' . $systemLogo) : asset('logo.png') }}" type="image/png">
    <!-- Vite Assets -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <!-- Include jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Include DataTables CSS and JS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css">
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
    <!-- Include SweetAlert library -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
</head>
<body class="bg-gray-50">
    <!-- Mobile Navigation -->
    <div class="mobile-nav">
        <span class="menu-toggle text-2xl cursor-pointer">☰</span>
        <span class="brand text-xl font-bold">VIMSYS</span>
    </div>
    
    <!-- Sidebar -->
    <div class="sidebar custom-scrollbar" id="sidebar">
        <div class="sidebar-header flex items-center justify-between mb-3">
            <div class="flex items-center">
                <img src="{{ $systemLogo ? asset('storage/' . $systemLogo) : asset('logo.png') }}" width="32" class="mr-2 logo-img" alt="Logo"/>
                <span class="font-bold nav-text">{{ $systemShortName }}</span>
            </div>
            <button class="minimize-btn hidden lg:flex" id="minimizeBtn" title="Minimize">
                <i class="bi bi-chevron-left"></i>
            </button>
        </div>
        <nav class="flex flex-col px-2 space-y-1">
            <a class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">
                <i class="bi bi-speedometer2"></i> <span class="nav-text">Dashboard</span>
            </a>
            <a class="nav-link {{ request()->routeIs('clients.index') ? 'active' : '' }}" href="{{ route('clients.index') }}">
                <i class="bi bi-people"></i> <span class="nav-text">Client List</span>
            </a>
            <a class="nav-link {{ request()->routeIs('insurances.index') ? 'active' : '' }}" href="{{ route('insurances.index') }}">
                <i class="bi bi-journal-check"></i> <span class="nav-text">Issue Insurances</span>
            </a>
            
            <!-- Report Dropdown -->
            <div class="nav-dropdown">
                <button class="nav-link nav-dropdown-toggle">
                    <i class="bi bi-file-earmark-text"></i> 
                    <span class="nav-text">Report</span>
                    <i class="bi bi-chevron-down ml-auto arrow"></i>
                </button>
                <div class="nav-dropdown-menu">
                    <a class="nav-link {{ request()->routeIs('policy.series') ? 'active' : '' }}" href="{{ route('policy.series') }}">
                        <i class="bi bi-card-list"></i> <span class="nav-text">Policy Series</span>
                    </a>
                </div>
            </div>
            
            <!-- Maintenance Dropdown -->
            <div class="nav-dropdown">
                <button class="nav-link nav-dropdown-toggle">
                    <i class="bi bi-tools"></i> 
                    <span class="nav-text">Maintenance</span>
                    <i class="bi bi-chevron-down ml-auto arrow"></i>
                </button>
                <div class="nav-dropdown-menu">
                    <a class="nav-link {{ request()->routeIs('policies.index') ? 'active' : '' }}" href="{{ route('policies.index') }}">
                        <i class="bi bi-list-check"></i> <span class="nav-text">Policies List</span>
                    </a>
                    <a class="nav-link {{ request()->routeIs('category.index') ? 'active' : '' }}" href="{{ route('category.index') }}">
                        <i class="bi bi-tags"></i> <span class="nav-text">Category List</span>
                    </a>
                    <a class="nav-link {{ request()->routeIs('walkin.index') ? 'active' : '' }}" href="{{ route('walkin.index') }}">
                        <i class="bi bi-person-lines-fill"></i> <span class="nav-text">Walkin List</span>
                    </a>
                </div>
            </div>
            
            @if(Auth::user()->id == 1 && Auth::user()->type == 1)
            <!-- Admin Dropdown -->
            <div class="nav-dropdown">
                <button class="nav-link nav-dropdown-toggle">
                    <i class="bi bi-shield-lock"></i> 
                    <span class="nav-text">Admin</span>
                    <i class="bi bi-chevron-down ml-auto arrow"></i>
                </button>
                <div class="nav-dropdown-menu">
                    <a class="nav-link {{ request()->routeIs('users.index') ? 'active' : '' }}" href="{{ route('users.index') }}">
                        <i class="bi bi-people-fill"></i> <span class="nav-text">User List</span>
                    </a>
                    <a class="nav-link {{ request()->routeIs('office.index') ? 'active' : '' }}" href="{{ route('office.index') }}">
                        <i class="bi bi-building"></i> <span class="nav-text">Office List</span>
                    </a>
                    <a class="nav-link {{ request()->routeIs('system.settings') ? 'active' : '' }}" href="{{ route('system.settings') }}">
                        <i class="bi bi-gear"></i> <span class="nav-text">System</span>
                    </a>
                </div>
            </div>
            @endif
        </nav>
    </div>

    
    <!-- Main Content -->
    <div class="main-content">
        <!-- Top Navbar -->
        <div class="top-navbar" id="topNavbar">
            <div class="flex items-center">
                <span class="sidebar-toggle hidden lg:inline mr-3 text-2xl cursor-pointer" id="sidebarToggle" title="Toggle Sidebar">☰</span>
                <span class="minimize-toggle hidden lg:inline mr-2 text-xl cursor-pointer" id="minimizeToggle" title="Minimize Sidebar">
                    <i class="bi bi-chevron-double-left"></i>
                </span>
                <span class="font-bold text-base md:text-lg lg:text-sl">{{ $officeName }} - Admin</span>
            </div>
            <div class="flex items-center">
                <i class="bi bi-github text-xl mr-3 hidden md:inline"></i>
            <div class="relative">
                    <span class="font-bold cursor-pointer flex items-center" id="userDropdown">
                        {{ Auth::user()->firstname }} {{ Auth::user()->lastname }}
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </span>
                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden z-50" id="userDropdownMenu">
                        <a href="{{ route('account.setting') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Account</a>
                        <form action="{{ route('logout') }}" method="POST" class="px-4 py-2">
                            @csrf
                            <button type="submit" class="w-full text-left text-red-600 hover:text-red-800 text-sm font-medium">Logout</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Subscription Notification Banner -->
        @php
        $currentUser = Auth::user();
        $bannerMessage = null;
        $bannerConfig = null;
        $subscriptionLabel = null;
        $progressPercentage = 100;
        $daysLeft = null;
        
        // Skip banner completely for super admin (id = 1 and office_id = 0 or null)
        $isSuperAdmin = ($currentUser && (int)$currentUser->id === 1 && ((int)$currentUser->office_id === 0 || $currentUser->office_id === null));
        
        if (!$isSuperAdmin) {
            if ($currentUser && $currentUser->subscription_type) {
                $now = \Carbon\Carbon::now();
                $endDate = $currentUser->subscription_end_date 
                    ? \Carbon\Carbon::parse($currentUser->subscription_end_date)
                    : ($currentUser->last_payment_date 
                        ? \Carbon\Carbon::parse($currentUser->last_payment_date)->addMonth()
                        : null);
                
                // Set subscription label based on type
                switch($currentUser->subscription_type) {
                    case 'free_trial':
                        $subscriptionLabel = 'Free Trial';
                        break;
                    case 'monthly':
                        $subscriptionLabel = 'Monthly Subscription';
                        break;
                    case 'yearly':
                        $subscriptionLabel = 'Yearly Subscription';
                        break;
                    default:
                        $subscriptionLabel = ucfirst($currentUser->subscription_type);
                }
                
                if ($endDate) {
                    $daysLeft = $now->diffInDays($endDate, false);
                    $totalDays = 30; // Assume 30 days for calculation
                    $progressPercentage = max(0, min(100, ($daysLeft / $totalDays) * 100));
                    
                    if ($daysLeft < 0) {
                        $bannerMessage = "Your {$subscriptionLabel} has expired. Please renew immediately to continue using all features.";
                        $bannerConfig = [
                            'gradient' => 'from-red-500 via-red-600 to-rose-600',
                            'icon' => 'bi-exclamation-circle-fill',
                            'iconColor' => 'text-red-100',
                            'buttonGradient' => 'from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800',
                            'pulse' => true
                        ];
                    } elseif ($daysLeft <= 7) {
                        if ($currentUser->subscription_type === 'free_trial') {
                            $bannerMessage = "Your Free Trial expires in {$daysLeft} day(s). Upgrade now to continue enjoying all features!";
                            $bannerConfig = [
                                'gradient' => 'from-orange-400 via-orange-500 to-amber-500',
                                'icon' => 'bi-clock-fill',
                                'iconColor' => 'text-orange-100',
                                'buttonGradient' => 'from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700',
                                'pulse' => true
                            ];
                        } else {
                            $bannerMessage = "Your {$subscriptionLabel} expires in {$daysLeft} day(s). Please renew soon to avoid interruption.";
                            $bannerConfig = [
                                'gradient' => 'from-amber-400 via-yellow-500 to-orange-500',
                                'icon' => 'bi-clock-history',
                                'iconColor' => 'text-amber-100',
                                'buttonGradient' => 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
                                'pulse' => true
                            ];
                        }
                    } elseif ($daysLeft <= 7) {
                        if ($currentUser->subscription_type === 'free_trial') {
                            $bannerMessage = "Your Free Trial will expire in {$daysLeft} days. Don't miss out - upgrade to a paid plan!";
                            $bannerConfig = [
                                'gradient' => 'from-blue-400 via-blue-500 to-indigo-500',
                                'icon' => 'bi-info-circle-fill',
                                'iconColor' => 'text-blue-100',
                                'buttonGradient' => 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
                                'pulse' => false
                            ];
                        } else {
                            $bannerMessage = "Your {$subscriptionLabel} will expire in {$daysLeft} days. Consider renewing soon.";
                            $bannerConfig = [
                                'gradient' => 'from-sky-400 via-blue-500 to-cyan-500',
                                'icon' => 'bi-calendar-event-fill',
                                'iconColor' => 'text-sky-100',
                                'buttonGradient' => 'from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700',
                                'pulse' => false
                            ];
                        }
                    } else {
                        // Active subscription with more than 30 days left - show subtle info
                        if ($currentUser->subscription_type === 'free_trial') {
                            $bannerMessage = "You're on a Free Trial. {$daysLeft} days remaining. Upgrade anytime!";
                            $bannerConfig = [
                                'gradient' => 'from-emerald-400 via-green-500 to-teal-500',
                                'icon' => 'bi-check-circle-fill',
                                'iconColor' => 'text-emerald-100',
                                'buttonGradient' => 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
                                'pulse' => false
                            ];
                        }
                    }
                } else {
                    // No end date but has subscription type
                    if ($currentUser->subscription_type === 'free_trial') {
                        $bannerMessage = "You're currently on a Free Trial. Enjoy exploring all features!";
                        $bannerConfig = [
                            'gradient' => 'from-emerald-400 via-green-500 to-teal-500',
                            'icon' => 'bi-stars',
                            'iconColor' => 'text-emerald-100',
                            'buttonGradient' => 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
                            'pulse' => false
                        ];
                    }
                }
            } else {
                // No subscription at all
                $bannerMessage = "You don't have an active subscription. Please subscribe to access all features.";
                $bannerConfig = [
                    'gradient' => 'from-slate-400 via-gray-500 to-zinc-500',
                    'icon' => 'bi-exclamation-triangle-fill',
                    'iconColor' => 'text-slate-100',
                    'buttonGradient' => 'from-slate-500 to-zinc-600 hover:from-slate-600 hover:to-zinc-700',
                    'pulse' => false
                ];
            }
        }
        @endphp

        @if($bannerMessage && $bannerConfig)
        <div class="relative z-0 overflow-hidden rounded-xl shadow-lg mx-2 md:mx-3 lg:mx-4 mt-3 animate-fade-in-down" role="alert">
            <!-- Gradient Background -->
            <div class="absolute inset-0 bg-gradient-to-r {{ $bannerConfig['gradient'] }} opacity-95"></div>
            
            <!-- Glassmorphism Overlay -->
            <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            
            <!-- Content -->
            <div class="relative z-10 px-4 py-4 md:px-6 md:py-5">
                <div class="flex flex-col md:flex-row md:items-center gap-4">
                    <!-- Icon and Message -->
                    <div class="flex items-start gap-4 flex-1">
                        <div class="flex-shrink-0 {{ $bannerConfig['pulse'] ? 'animate-pulse' : '' }}">
                            <i class="bi {{ $bannerConfig['icon'] }} {{ $bannerConfig['iconColor'] }} text-2xl md:text-3xl drop-shadow-md"></i>
                        </div>
                        <div class="flex-1">
                            <p class="text-white font-semibold text-sm md:text-base leading-relaxed drop-shadow-sm">
                                {{ $bannerMessage }}
                            </p>
                            @if($daysLeft !== null && $daysLeft > 0)
                            <div class="mt-2 flex items-center gap-2">
                                <div class="flex-1 bg-white/30 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                                    <div class="h-full bg-white rounded-full transition-all duration-1000 ease-out" 
                                         style="width: {{ $progressPercentage }}%"></div>
                                </div>
                                <span class="text-white/90 text-xs font-medium whitespace-nowrap">{{ $daysLeft }} days left</span>
                            </div>
                            @endif
                        </div>
                    </div>
                    
                    <!-- Action Button -->
                    <div class="flex items-center gap-3 md:ml-4">
                        @if($currentUser && $currentUser->subscription_type && ($currentUser->subscription_type === 'free_trial' || $currentUser->subscription_end_date || $currentUser->last_payment_date))
                            <a href="{{ route('account.setting') }}" 
                               class="inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r {{ $bannerConfig['buttonGradient'] }} text-white font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm bg-white/20">
                                <i class="bi {{ $currentUser->subscription_type === 'free_trial' ? 'bi-arrow-up-circle' : 'bi-arrow-repeat' }} mr-2"></i>
                                {{ $currentUser->subscription_type === 'free_trial' ? 'Upgrade Now' : 'Renew Now' }}
                            </a>
                        @else
                            <a href="{{ route('account.setting') }}" 
                               class="inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r {{ $bannerConfig['buttonGradient'] }} text-white font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm bg-white/20">
                                <i class="bi bi-credit-card mr-2"></i>
                                Subscribe Now
                            </a>
                        @endif
                        
                        <!-- Close Button -->
                        <button onclick="this.closest('[role=alert]').style.display='none'" 
                                class="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all duration-200 hover:rotate-90 backdrop-blur-sm">
                            <i class="bi bi-x-lg text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Decorative Elements -->
            <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <style>
            @keyframes fade-in-down {
                0% {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .animate-fade-in-down {
                animation: fade-in-down 0.5s ease-out;
            }
        </style>
        @endif

        <!-- Content Area -->
        <div class="px-2 md:px-3 lg:px-4">
            <header>
                @yield('content')
            </header>
        </div>
    </div>
    
    <!-- Scripts -->
    <script>
        // Sidebar Toggle Functionality
        document.getElementById('sidebarToggle').addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.querySelector('.main-content');
            const header = document.querySelector('.top-navbar');
            
            // Check if sidebar is minimized
            const isMinimized = sidebar.classList.contains('sidebar-minimized');
            
            if (isMinimized) {
                // If minimized, first expand it, then hide it after a short delay
                sidebar.classList.remove('sidebar-minimized');
                mainContent.classList.remove('main-content-minimized');
                header.classList.remove('top-navbar-minimized');
                
                // Update minimize button icon
                updateMinimizeIcon(false);
                
                // Small delay to allow expansion before hiding
                setTimeout(() => {
                    sidebar.classList.add('sidebar-hidden');
                    mainContent.classList.add('fullscreen');
                    header.classList.add('top-navbar-fullscreen');
                }, 50);
            } else {
                // Normal toggle behavior
                sidebar.classList.toggle('sidebar-hidden');
                mainContent.classList.toggle('fullscreen');
                header.classList.toggle('top-navbar-fullscreen');
            }
        });

        // Minimize Toggle Functionality
        const minimizeBtn = document.getElementById('minimizeBtn');
        const minimizeToggle = document.getElementById('minimizeToggle');
        
        function toggleMinimize() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.querySelector('.main-content');
            const header = document.querySelector('.top-navbar');
            
            const isMinimized = sidebar.classList.contains('sidebar-minimized');
            
            if (isMinimized) {
                // Expand
                sidebar.classList.remove('sidebar-minimized');
                mainContent.classList.remove('main-content-minimized');
                header.classList.remove('top-navbar-minimized');
                updateMinimizeIcon(false);
                localStorage.setItem('sidebarMinimized', 'false');
            } else {
                // Minimize
                sidebar.classList.add('sidebar-minimized');
                mainContent.classList.add('main-content-minimized');
                header.classList.add('top-navbar-minimized');
                updateMinimizeIcon(true);
                localStorage.setItem('sidebarMinimized', 'true');
            }
        }
        
        function updateMinimizeIcon(isMinimized) {
            const icon = minimizeBtn.querySelector('i');
            const toggleIcon = minimizeToggle.querySelector('i');
            if (isMinimized) {
                icon.classList.remove('bi-chevron-left');
                icon.classList.add('bi-chevron-right');
                toggleIcon.classList.remove('bi-chevron-double-left');
                toggleIcon.classList.add('bi-chevron-double-right');
            } else {
                icon.classList.remove('bi-chevron-right');
                icon.classList.add('bi-chevron-left');
                toggleIcon.classList.remove('bi-chevron-double-right');
                toggleIcon.classList.add('bi-chevron-double-left');
            }
        }
        
        minimizeBtn.addEventListener('click', toggleMinimize);
        minimizeToggle.addEventListener('click', toggleMinimize);

        // Restore minimize state on page load
        document.addEventListener('DOMContentLoaded', function() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.querySelector('.main-content');
            const header = document.querySelector('.top-navbar');
            
            const isMinimized = localStorage.getItem('sidebarMinimized') === 'true';
            if (isMinimized) {
                sidebar.classList.add('sidebar-minimized');
                mainContent.classList.add('main-content-minimized');
                header.classList.add('top-navbar-minimized');
                updateMinimizeIcon(true);
            }
        });

        // Mobile Menu Toggle
        document.addEventListener('DOMContentLoaded', function() {
            const sidebar = document.getElementById('sidebar');
            const menuToggle = document.querySelector('.menu-toggle');

            menuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('active');
            });
        });

        // Dropdown Toggle Functionality
        document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const dropdown = this.parentElement;
                const arrow = this.querySelector('.arrow');
                
                // Toggle active class
                dropdown.classList.toggle('active');
                
                // Rotate arrow
                if (arrow) {
                    arrow.classList.toggle('rotate');
                }
            });
        });

        // User Dropdown Toggle
        document.getElementById('userDropdown').addEventListener('click', function(event) {
            event.stopPropagation();
            const menu = document.getElementById('userDropdownMenu');
            menu.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const dropdown = document.querySelector('.relative');
            const menu = document.getElementById('userDropdownMenu');
            if (dropdown && !dropdown.contains(event.target)) {
                menu.classList.add('hidden');
            }
        });
    </script>

    
    @yield('scripts')
    
    <!-- AI Chatbot Integration -->
    @include('chatbot.index')
</body>
</html>
