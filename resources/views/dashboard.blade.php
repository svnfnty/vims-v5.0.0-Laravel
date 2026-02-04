{{-- filepath: c:\xampp\htdocs\vims-v5.0.0\resources\views\dashboard.blade.php --}}
@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<br>
<div class="dashboard-header mb-4 bg-primary text-white">
    <div class="d-flex justify-content-between align-items-center">
        <div>
            <h2 class="mb-1"><i class="bi bi-speedometer2 me-2"></i>Dashboard</h2>
            <div>Welcome back! - {{ Auth::user()->firstname }} {{ Auth::user()->lastname }} Here's what's happening with your system today.</div>
        </div>
        <div>
            <span class="badge bg-light text-dark me-2">
                <i class="bi bi-calendar-event me-1"></i> June 19, 2025
            </span>
            <span class="badge bg-light text-dark">
                <i class="bi bi-clock me-1"></i> 10:32 AM
            </span>
            <span class="position-relative ms-2">
                <i class="bi bi-bell-fill fs-5"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">2</span>
            </span>
        </div>
    </div>
</div>
<div class="row dashboard-cards mb-4">
    <div class="col-md-3">
        <div class="card text-center py-4">
            <div class="card-body">
                <i class="bi bi-person fs-1 text-primary"></i>
                <h3 class="mt-2 mb-0">0</h3>
                <div class="text-muted">Active Walkins</div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card text-center py-4">
            <div class="card-body">
                <i class="bi bi-people fs-1 text-primary"></i>
                <h3 class="mt-2 mb-0">{{ $activeClients }}</h3>
                <div class="text-muted">Active Clients</div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card text-center py-4">
            <div class="card-body">
                <i class="bi bi-car-front fs-1 text-info"></i>
                <h3 class="mt-2 mb-0">{{ $insuredVehicles }}</h3>
                <div class="text-muted">Insured Vehicles</div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card text-center py-4">
            <div class="card-body">
                <i class="bi bi-exclamation-triangle fs-1 text-danger"></i>
                <h3 class="mt-2 mb-0">{{ $expiredVehicles }}</h3>
                <div class="text-muted">Expired Vehicles</div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-md-8">
        <div class="notifications mb-4">
            <div class="d-flex align-items-center mb-2">
                <i class="bi bi-bell-fill me-2 text-dark"></i>
                <span class="notification-title">Notifications</span>
                <span class="badge bg-primary ms-2">2</span>
            </div>
            <hr>
            <div>
                <div class="mb-2">
                    <i class="bi bi-megaphone-fill text-primary me-2"></i>
                    <a href="#" class="fw-bold text-decoration-none">Welcome to Vimsys SaaS!</a>
                    <div class="text-muted small">Thank you for using the latest version of our application. Explore the new features and improvements.</div>
                </div>
                {{-- ...add more notifications as needed... --}}
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <!-- Quick Search Card -->
        <div class="quick-search-card mb-4">
            <h5><i class="fas fa-search me-2"></i> Quick Search</h5>
            <p class="text-muted">Search by name, registration number, COC number, etc.</p>
            <form id="searchForm">
                <div class="input-group mb-3">
                    <input type="text" class="form-control search-input" id="search" name="search" placeholder="Enter search term...">
                    <button class="btn btn-primary" type="submit"><i class="fas fa-search"></i></button>
                </div>
            </form>
            <div id="loader" class="text-center" style="display:none;">
                <div class="d-flex justify-content-center align-items-center py-3">
                    <div class="spinner-pulse mr-2"></div>
                    <span class="ms-2">Searching database...</span>
                </div>
            </div>
            <div id="searchResults" class="mt-3"></div>
        </div>

        <script>
            document.getElementById('search').addEventListener('input', function(e) {
                const query = e.target.value;
                if (query.length >= 3) {
                    document.getElementById('loader').style.display = 'block';
                    document.getElementById('searchResults').style.display = 'block';
                    document.getElementById('searchResults').innerHTML = '';

                    fetch(`/dashboard/search?query=${query}`)
                        .then(response => response.json())
                        .then(data => {
                            document.getElementById('loader').style.display = 'none';
                            const resultsDiv = document.getElementById('searchResults');
                            if (data.length > 0) {
                            let resultsHtml = '';
                            data.forEach(item => {
                                const clientName = item.client ? `${item.client.firstname} ${item.client.lastname}` : 'Unknown Client';
                                resultsHtml += `
                                    <div class="card mb-2">
                                        <div class="card-body">
                                            <h6 class="card-title">COC: ${item.coc_no}</h6>
                                            <p class="card-text">Reg No: ${item.registration_no}</p>
                                            <p class="card-text">Client: ${clientName}</p>
                                            <a href="/insurances/view/${item.id}" class="btn btn-primary btn-sm">View Details</a>
                                        </div>
                                    </div>
                                `;
                            });
                            resultsDiv.innerHTML = resultsHtml;
                            } else {
                                resultsDiv.innerHTML = '<div class="alert alert-info">No results found.</div>';
                            }
                        })
                        .catch(error => {
                            document.getElementById('loader').style.display = 'none';
                            document.getElementById('searchResults').innerHTML = '<div class="alert alert-danger">Error loading results</div>';
                        });
                } else {
                    document.getElementById('searchResults').style.display = 'none';
                    document.getElementById('loader').style.display = 'none';
                }
            });
        </script>
    </div>
</div>


@endsection
