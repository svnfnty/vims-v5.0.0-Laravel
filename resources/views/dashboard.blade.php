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
        <div class="quick-search mb-4">
            <div class="d-flex align-items-center mb-2">
                <i class="bi bi-search me-2 text-dark"></i>
                <span class="notification-title">Quick Search</span>
            </div>
            <hr>
            <div class="mb-2 text-muted small">
                Search by name, registration number, COC number, etc.
            </div>
            <input type="text" class="form-control search-input" name="query" placeholder="Enter search term...">
            <div id="search-results" class="mt-3" style="display: none;">
                <h5>Search Results:</h5>
                <ul class="list-group" id="results-list"></ul>
            </div>
        </div>

        <script>
            document.querySelector('.search-input').addEventListener('input', function(e) {
                const query = e.target.value;
                if (query.length > 2) { // Trigger search after 3 characters
                    fetch(`/dashboard/search?query=${query}`)
                        .then(response => response.json())
                        .then(data => {
                            const resultsList = document.getElementById('results-list');
                            resultsList.innerHTML = '';
                            data.forEach(item => {
                                const clientName = item.client ? `${item.client.firstname} ${item.client.lastname}` : 'Unknown Client';
                                resultsList.innerHTML += `<li class='list-group-item'>COC: ${item.coc_no}, Reg No: ${item.registration_no}, Client: ${clientName}</li>`;
                            });
                            document.getElementById('search-results').style.display = 'block';
                        });
                } else {
                    document.getElementById('search-results').style.display = 'none';
                }
            });
        </script>
    </div>
</div>

<style>
/* Added media queries for mobile responsiveness */
@media (max-width: 768px) {
    .dashboard-header {
        flex-direction: column;
        text-align: center;
    }
    .dashboard-cards .card {
        margin-bottom: 1rem;
    }
    .notifications, .quick-search {
        margin-bottom: 1rem;
    }
    .quick-search .search-input {
        width: 100%;
    }
    .quick-search #search-results {
        margin-top: 1rem;
    }
    .row.dashboard-cards {
        flex-direction: column;
        align-items: center;
    }
    .row.dashboard-cards .col-md-3 {
        width: 100%;
        max-width: 400px;
    }
    .row {
        flex-direction: column;
    }
    .col-md-8, .col-md-4 {
        width: 100%;
    }
}
</style>
@endsection
