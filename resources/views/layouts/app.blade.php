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
    <div class="sidebar custom-scrollbar">
        <div class="sidebar-header flex items-center mb-3">
            <img src="{{ $systemLogo ? asset('storage/' . $systemLogo) : asset('logo.png') }}" width="32" class="mr-2" alt="Logo"/>
            <span class="hidden xl:inline font-bold">{{ $systemShortName }}</span>
            <span class="xl:hidden font-bold">{{ $systemShortName }}</span>
        </div>
        <nav class="flex flex-col px-2 space-y-1">
            <a class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">
                <i class="bi bi-speedometer2 mr-2"></i> <span class="nav-text">Dashboard</span>
            </a>
            <a class="nav-link {{ request()->routeIs('clients.index') ? 'active' : '' }}" href="{{ route('clients.index') }}">
                <i class="bi bi-people mr-2"></i> <span class="nav-text">Client List</span>
            </a>
            <a class="nav-link {{ request()->routeIs('insurances.index') ? 'active' : '' }}" href="{{ route('insurances.index') }}">
                <i class="bi bi-journal-check mr-2"></i> <span class="nav-text">Issue Insurances</span>
            </a>
            <div class="mt-6 mb-2 text-xs uppercase text-gray-400 px-2 font-semibold tracking-wider">Report</div>
            <a class="nav-link {{ request()->routeIs('policy.series') ? 'active' : '' }}" href="{{ route('policy.series') }}">
                <i class="bi bi-card-list mr-2"></i> <span class="nav-text">Policy Series</span>
            </a>
            <div class="mt-6 mb-2 text-xs uppercase text-gray-400 px-2 font-semibold tracking-wider">Maintenance</div>
            <a class="nav-link {{ request()->routeIs('policies.index') ? 'active' : '' }}" href="{{ route('policies.index') }}">
                <i class="bi bi-list-check mr-2"></i> <span class="nav-text">Policies List</span>
            </a>
            <a class="nav-link {{ request()->routeIs('category.index') ? 'active' : '' }}" href="{{ route('category.index') }}">
                <i class="bi bi-tags mr-2"></i> <span class="nav-text">Category List</span>
            </a>
            <a class="nav-link {{ request()->routeIs('walkin.index') ? 'active' : '' }}" href="{{ route('walkin.index') }}">
                <i class="bi bi-person-lines-fill mr-2"></i> <span class="nav-text">Walkin List</span>
            </a>
            @if(Auth::user()->id == 1 && Auth::user()->type == 1)
            <a class="nav-link {{ request()->routeIs('users.index') ? 'active' : '' }}" href="{{ route('users.index') }}">
                <i class="bi bi-people-fill mr-2"></i> <span class="nav-text">User List</span>
            </a>
            <a class="nav-link {{ request()->routeIs('office.index') ? 'active' : '' }}" href="{{ route('office.index') }}">
                <i class="bi bi-person-lines-fill mr-2"></i> <span class="nav-text">Office List</span>
            </a>
            <a class="nav-link {{ request()->routeIs('system.settings') ? 'active' : '' }}" href="{{ route('system.settings') }}">
                <i class="bi bi-gear mr-2"></i> <span class="nav-text">System Settings</span>
            </a>
            @endif
        </nav>
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
        <!-- Top Navbar -->
        <div class="top-navbar">
            <div class="flex items-center">
                <span class="sidebar-toggle hidden lg:inline mr-3 text-2xl cursor-pointer" id="sidebarToggle">☰</span>
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
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            const header = document.querySelector('.top-navbar');
            sidebar.classList.toggle('sidebar-hidden');
            mainContent.classList.toggle('fullscreen');
            header.classList.toggle('top-navbar-fullscreen');
        });

        // Mobile Menu Toggle
        document.addEventListener('DOMContentLoaded', function() {
            const sidebar = document.querySelector('.sidebar');
            const menuToggle = document.querySelector('.menu-toggle');

            menuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('active');
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
            if (!dropdown.contains(event.target)) {
                menu.classList.add('hidden');
            }
        });
    </script>
    
    @yield('scripts')
</body>
</html>
