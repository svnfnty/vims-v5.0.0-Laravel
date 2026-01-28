{{-- filepath: c:\xampp\htdocs\vims-v5.0.0\resources\views\layouts\app.blade.php --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'VIMS')</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="icon" href="https://ectpl-vimsys.com/vims-v4.0.0/uploads/logo-1738897187.png" type="image/png">
    <link rel="stylesheet" href="{{ asset('css/insurance.blade.css') }}">
    <link rel="stylesheet" href="{{ asset('css/app.blade.css') }}">
    <link rel="stylesheet" href="{{ asset('css/series.blade.css') }}">
    <!-- Include jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Include other scripts -->
    <script src="{{ asset('js/series.blade.js') }}"></script>
    <!-- Include DataTables CSS and JS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css">
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
    <!-- Include SweetAlert library -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
</head>
<body>
    <div class="mobile-nav">
        <span class="menu-toggle">☰</span>
        <span class="brand">VIMS</span>
    </div>
    <div class="sidebar d-flex flex-column">
        <div class="sidebar-header d-flex align-items-center mb-3">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/car--v2.png" width="32" class="me-2"/>
            SAAS GINGOOG 2025
        </div>
        <nav class="nav flex-column px-2">
            <a class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">
                <i class="bi bi-speedometer2 me-1"></i> Dashboard
            </a>
            <a class="nav-link {{ request()->routeIs('clients.index') ? 'active' : '' }}" href="{{ route('clients.index') }}">
                <i class="bi bi-people me-1"></i> Client List
            </a>
            <a class="nav-link {{ request()->routeIs('insurances.index') ? 'active' : '' }}" href="{{ route('insurances.index') }}">
                <i class="bi bi-journal-check me-1"></i> Issue Insurances
            </a>
            <!--<div class="mt-3 mb-1 text-uppercase small text-secondary px-2">Forms</div>
            <a class="nav-link {{ request()->routeIs('application.form') ? 'active' : '' }}" href="{{ route('application.form') }}">
                <i class="bi bi-file-earmark-text me-1"></i> Application
            </a>-->
            <div class="mt-3 mb-1 text-uppercase small text-secondary px-2">Report</div>
            <a class="nav-link {{ request()->routeIs('policy.series') ? 'active' : '' }}" href="{{ route('policy.series') }}">
                <i class="bi bi-card-list me-1"></i> Policy Series
            </a>
            <a class="nav-link {{ request()->routeIs('usage.history') ? 'active' : '' }}" href="{{ route('usage.history') }}">
                <i class="bi bi-clock-history me-1"></i> Usage History
            </a>
            <a class="nav-link {{ request()->routeIs('lto.transactions') ? 'active' : '' }}" href="{{ route('lto.transactions') }}">
                <i class="bi bi-arrow-left-right me-1"></i> LTO Transactions
            </a>
            <div class="mt-3 mb-1 text-uppercase small text-secondary px-2">Maintenance</div>
            <a class="nav-link {{ request()->routeIs('category.index') ? 'active' : '' }}" href="{{ route('category.index') }}">
                <i class="bi bi-tags me-1"></i> Category List
            </a>
            <a class="nav-link {{ request()->routeIs('policies.index') ? 'active' : '' }}" href="{{ route('policies.index') }}">
                <i class="bi bi-list-check me-1"></i> Policies List
            </a>
            <a class="nav-link {{ request()->routeIs('walkin.index') ? 'active' : '' }}" href="{{ route('walkin.index') }}">
                <i class="bi bi-person-lines-fill me-1"></i> Walkin List
            </a>
            <a class="nav-link {{ request()->routeIs('users.index') ? 'active' : '' }}" href="{{ route('users.index') }}">
                <i class="bi bi-person-badge me-1"></i> User List
            </a>
            <a class="nav-link {{ request()->routeIs('settings') ? 'active' : '' }}" href="{{ route('settings') }}">
                <i class="bi bi-gear me-1"></i> Settings
            </a>
            <a class="nav-link {{ request()->routeIs('activity') ? 'active' : '' }}" href="{{ route('activity') }}">
                <i class="bi bi-clock me-1"></i> Activity
            </a>
        </nav>
    </div>
    <div class="main-content">
        <div class="top-navbar d-flex justify-content-between align-items-center">
            <div>
                <span class="sidebar-toggle" id="sidebarToggle">☰</span>
                <span class="fw-bold">VIMSYS SAAS APPLICATION GINGOOG BRANCH - Admin</span>
            </div>
            <div class="d-flex align-items-center">
                <i class="bi bi-github fs-4 me-2"></i>
                <div class="dropdown">
                    <span class="fw-bold dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="cursor:pointer;">
                        - Mr. JUNDEL
                    </span>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li>
                            <form action="{{ route('logout') }}" method="POST" class="px-3 py-1">
                                @csrf
                                <button type="submit" class="btn btn-sm btn-outline-danger w-100">Logout</button>
                            </form>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <header>
                @yield('content')
            </header>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.getElementById('sidebarToggle').addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            const header = document.querySelector('.top-navbar');
            sidebar.classList.toggle('hidden');
            mainContent.classList.toggle('fullscreen');
            header.classList.toggle('fullscreen');
        });

        document.addEventListener('DOMContentLoaded', function() {
            const sidebar = document.querySelector('.sidebar');
            const menuToggle = document.querySelector('.menu-toggle');

            menuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('active');
            });
        });
    </script>
</body>
</html>