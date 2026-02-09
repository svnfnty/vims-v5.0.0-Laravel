{{-- filepath: c:\xampp\htdocs\vims-v5.0.0\resources\views\dashboard.blade.php --}}
@extends('layouts.app')

@section('content')
@vite(['resources/css/tutorial.css', 'resources/js/tutorial.js'])
<br>
<div class="dashboard-header-app">
    <div class="flex justify-between items-center">
        <div>
            <h2 class="mb-1 text-2xl font-bold"><i class="bi bi-speedometer2 mr-2"></i>Dashboard</h2>
            <div>Welcome back! - {{ Auth::user()->firstname }} {{ Auth::user()->lastname }} Here's what's happening with your system today.</div>
        </div>
        <div class="flex items-center">
            <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-medium mr-2 flex items-center">
                <i class="bi bi-calendar-event mr-1"></i> June 19, 2025
            </span>
            <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-medium flex items-center">
                <i class="bi bi-clock mr-1"></i> 10:32 AM
            </span>
            <span class="relative ml-2">
                <i class="bi bi-bell-fill text-xl"></i>
                <span class="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">2</span>
            </span>
        </div>
    </div>
</div>
<div class="dashboard-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
    <div>
        <div class="card">
            <div class="p-4">
                <i class="bi bi-person text-primary"></i>
                <h3 class="mt-2 mb-0 text-3xl font-bold">0</h3>
                <div class="text-gray-500">Active Walkins</div>
            </div>
        </div>
    </div>
    <div>
        <div class="card">
            <div class="p-4">
                <i class="bi bi-people text-primary"></i>
                <h3 class="mt-2 mb-0 text-3xl font-bold">{{ $activeClients }}</h3>
                <div class="text-gray-500">Active Clients</div>
            </div>
        </div>
    </div>
    <div>
        <div class="card">
            <div class="p-4">
                <i class="bi bi-car-front text-info"></i>
                <h3 class="mt-2 mb-0 text-3xl font-bold">{{ $insuredVehicles }}</h3>
                <div class="text-gray-500">Insured Vehicles</div>
            </div>
        </div>
    </div>
    <div>
        <div class="card">
            <div class="p-4">
                <i class="bi bi-exclamation-triangle text-danger"></i>
                <h3 class="mt-2 mb-0 text-3xl font-bold">{{ $expiredVehicles }}</h3>
                <div class="text-gray-500">Expired Vehicles</div>
            </div>
        </div>
    </div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="lg:col-span-2">
        <div class="notifications">
            <div class="flex items-center mb-2">
                <i class="bi bi-bell-fill mr-2 text-dark"></i>
                <span class="notification-title">Notifications</span>
                <span class="bg-blue-600 text-white text-xs px-2 py-1 rounded ml-2">2</span>
            </div>
            <hr class="border-gray-200 mb-3">
            <div>
                <div class="mb-2">
                    <i class="bi bi-megaphone-fill text-primary mr-2"></i>
                    <a href="#" class="font-bold text-gray-800 no-underline hover:underline">Welcome to Vimsys SaaS!</a>
                    <div class="text-gray-500 text-sm">Thank you for using the latest version of our application. Explore the new features and improvements.</div>
                </div>
                {{-- ...add more notifications as needed... --}}
            </div>
        </div>
    </div>
    <div>
        <!-- Quick Search Card -->
        <div class="quick-search-card">
            <h5 class="text-lg font-semibold mb-2"><i class="fas fa-search mr-2"></i> Quick Search</h5>
            <p class="text-gray-500 text-sm mb-3">Search by name, registration number, COC number, etc.</p>
            <form id="searchForm">
                <div class="flex mb-3">
                    <input type="text" class="search-input flex-1" id="search" name="search" placeholder="Enter search term...">
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors" type="submit"><i class="fas fa-search"></i></button>
                </div>
            </form>
            <div id="loader" class="text-center hidden">
                <div class="flex justify-center items-center py-3">
                    <div class="spinner-pulse mr-2"></div>
                    <span class="ml-2 text-gray-600">Searching database...</span>
                </div>
            </div>
            <div id="searchResults" class="mt-3"></div>
        </div>

        <script>
            document.getElementById('search').addEventListener('input', function(e) {
                const query = e.target.value;
                if (query.length >= 3) {
                    document.getElementById('loader').classList.remove('hidden');
                    document.getElementById('searchResults').style.display = 'block';
                    document.getElementById('searchResults').innerHTML = '';

                    fetch(`/dashboard/search?query=${query}`)
                        .then(response => response.json())
                        .then(data => {
                            document.getElementById('loader').classList.add('hidden');
                            const resultsDiv = document.getElementById('searchResults');
                            if (data.length > 0) {
                            let resultsHtml = '';
                            data.forEach(item => {
                                const clientName = item.client ? `${item.client.firstname} ${item.client.lastname}` : 'Unknown Client';
                                resultsHtml += `
                                    <div class="card mb-2">
                                        <div class="p-4">
                                            <h6 class="font-semibold mb-1">COC: ${item.coc_no}</h6>
                                            <p class="text-gray-600 text-sm mb-1">Reg No: ${item.registration_no}</p>
                                            <p class="text-gray-600 text-sm mb-2">Client: ${clientName}</p>
                                            <a href="/insurances/${item.id}" class="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition-colors">View Details</a>
                                        </div>
                                    </div>
                                `;
                            });
                            resultsDiv.innerHTML = resultsHtml;
                            } else {
                                resultsDiv.innerHTML = '<div class="bg-blue-50 text-blue-700 p-3 rounded-lg">No results found.</div>';
                            }
                        })
                        .catch(error => {
                            document.getElementById('loader').classList.add('hidden');
                            document.getElementById('searchResults').innerHTML = '<div class="bg-red-50 text-red-700 p-3 rounded-lg">Error loading results</div>';
                        });
                } else {
                    document.getElementById('searchResults').style.display = 'none';
                    document.getElementById('loader').classList.add('hidden');
                }
            });
        </script>
    </div>
</div>


@endsection
