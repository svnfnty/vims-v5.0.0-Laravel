{{-- filepath: c:\xampp\htdocs\vims-v5.0.0\resources\views\layouts\app.blade.php --}}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $systemName }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="icon" href="https://ectpl-vimsys.com/vims-v4.0.0/uploads/logo-1738897187.png" type="image/png">
    <link rel="stylesheet" href="{{ asset('css/insurance.blade.css') }}">
    <link rel="stylesheet" href="{{ asset('css/app.blade.css') }}">
    <link rel="stylesheet" href="{{ asset('css/series.blade.css') }}">
    <link rel="stylesheet" href="{{ asset('css/tutorial.blade.css') }}">
    <link rel="stylesheet" href="{{ asset('css/tutorial.blade.css') }}">
    <!-- Include jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Include other scripts -->
    <script src="{{ asset('js/series.blade.js') }}"></script>
    <script src="{{ asset('js/tutorial.blade.js') }}"></script>
    <!-- Include DataTables CSS and JS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css">
      <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
    <!-- Include SweetAlert library -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
</head>
<body>
    <div class="mobile-nav">
        <span class="menu-toggle">☰</span>
        <span class="brand">VIMSYS</span>
    </div>
    <div class="sidebar d-flex flex-column">
        <div class="sidebar-header d-flex align-items-center mb-3">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/car--v2.png" width="32" class="me-2"/>
            <span class="d-none d-xl-inline">{{ $systemShortName }}</span>
            <span class="d-xl-none">{{ $systemShortName }}</span>
        </div>
        <nav class="nav flex-column px-2">
            <a class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">
                <i class="bi bi-speedometer2 me-1"></i> <span class="nav-text">Dashboard</span>
            </a>
            <a class="nav-link {{ request()->routeIs('clients.index') ? 'active' : '' }}" href="{{ route('clients.index') }}">
                <i class="bi bi-people me-1"></i> <span class="nav-text">Client List</span>
            </a>
            <a class="nav-link {{ request()->routeIs('insurances.index') ? 'active' : '' }}" href="{{ route('insurances.index') }}">
                <i class="bi bi-journal-check me-1"></i> <span class="nav-text">Issue Insurances</span>
            </a>
            <div class="mt-3 mb-1 text-uppercase small text-secondary px-2 nav-section">Report</div>
            <a class="nav-link {{ request()->routeIs('policy.series') ? 'active' : '' }}" href="{{ route('policy.series') }}">
                <i class="bi bi-card-list me-1"></i> <span class="nav-text">Policy Series</span>
            </a>
            <div class="mt-3 mb-1 text-uppercase small text-secondary px-2 nav-section">Maintenance</div>
            <a class="nav-link {{ request()->routeIs('category.index') ? 'active' : '' }}" href="{{ route('category.index') }}">
                <i class="bi bi-tags me-1"></i> <span class="nav-text">Category List</span>
            </a>
            <a class="nav-link {{ request()->routeIs('policies.index') ? 'active' : '' }}" href="{{ route('policies.index') }}">
                <i class="bi bi-list-check me-1"></i> <span class="nav-text">Policies List</span>
            </a>
            <a class="nav-link {{ request()->routeIs('walkin.index') ? 'active' : '' }}" href="{{ route('walkin.index') }}">
                <i class="bi bi-person-lines-fill me-1"></i> <span class="nav-text">Walkin List</span>
            </a>
            @if(Auth::user()->id == 1 && Auth::user()->type == 1)
            <a class="nav-link {{ request()->routeIs('users.index') ? 'active' : '' }}" href="{{ route('users.index') }}">
                <i class="bi bi-people-fill me-1"></i> <span class="nav-text">User List</span>
            </a>
            <a class="nav-link {{ request()->routeIs('office.index') ? 'active' : '' }}" href="{{ route('office.index') }}">
                <i class="bi bi-person-lines-fill me-1"></i> <span class="nav-text">Office List</span>
            </a>
            @endif
        </nav>
    </div>
    <div class="main-content">
        <div class="top-navbar d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <span class="sidebar-toggle d-lg-inline d-none me-2" id="sidebarToggle">☰</span>
                <span class="fw-bold fs-6 fs-md-5 fs-lg-4">{{ $officeName }} - Admin</span>
            </div>
            <div class="d-flex align-items-center">
                <i class="bi bi-github fs-5 me-2 d-none d-md-inline"></i>
                <div class="dropdown">
                    <span class="fw-bold dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="cursor:pointer;">
                        {{ Auth::user()->firstname }} {{ Auth::user()->lastname }}  
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
        <div class="container-fluid px-2 px-md-3 px-lg-4">
            <header>
                @yield('content')
            </header>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/tutorial.blade.js') }}"></script>
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
