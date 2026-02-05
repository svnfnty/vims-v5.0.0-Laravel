@extends('layouts.app')

@section('content')
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
    @import url('{{ asset("css/client.blade.css") }}');
</style>
 
<div class="clients-dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
        <div class="header-content">
            <div class="logo-section">
                <div class="logo-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="system-info">
                    <h1 class="system-title">List of Clients</h1>
                    <p class="system-subtitle">Manage your client database efficiently</p>
                </div>
            </div>
            <div class="user-controls">
                <div class="batch-controls">
                    <button class="control-btn primary" id="create_new">
                        <i class="fas fa-plus-circle"></i>
                        New Client
                    </button>
                    <button class="control-btn primary" id="loadDataBtn">
                        <i class="fas fa-database"></i>
                        Load Data
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Stats -->
    <div class="dashboard-stats" id="statsContainer">
        <div class="stat-card">
            <div class="stat-icon total">
                <i class="fas fa-users"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="totalClients">0</span>
                <span class="stat-label">Total Clients</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon active">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="activeClients">0</span>
                <span class="stat-label">Active Clients</span>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon inactive">
                <i class="fas fa-user-slash"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="inactiveClients">0</span>
                <span class="stat-label">Inactive</span>
            </div>
        </div>
    </div>

    <!-- Clients Section -->
    <div class="clients-section">
        <div class="section-header">
            <h2 class="section-title">Client List</h2>
            <div class="view-controls">
                <div class="view-toggle">
                    <button class="toggle-btn active" data-view="cards">
                        <i class="fas fa-th-large"></i>
                        Cards
                    </button>
                    <button class="toggle-btn" data-view="grid">
                        <i class="fas fa-th"></i>
                        Grid
                    </button>
                    <button class="toggle-btn" data-view="list">
                        <i class="fas fa-list"></i>
                        List
                    </button>
                    <button class="toggle-btn" data-view="table">
                        <i class="fas fa-table"></i>
                        Table
                    </button>
                </div>
                <div class="filter-controls">
                    <select class="filter-select" id="statusFilter">
                       <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Card/Grid/List Views -->
        <div class="clients-grid cards-view active" id="cardView">
            <!-- Clients will be loaded here dynamically -->
        </div>

        <!-- Table View -->
        <div class="modern-table-container" id="tableView">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date Created</th>
                        <th>Registered Name</th>
                        <th>Registered Email</th>
                        <th>Address</th>
                        @if(auth()->user()->id == 1 && auth()->user()->office_id == 0)
                            <th>Office</th>
                        @endif
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    <!-- Table rows will be loaded here dynamically -->
                </tbody>
            </table>
        </div>

        <!-- Empty State for Filtered Results -->
        <div class="empty-state hidden" id="filteredEmptyState">
            <div class="empty-icon">
                <i class="fas fa-search"></i>
            </div>
            <h3>No Matching Clients Found</h3>
            <p>No clients match your current filter criteria. Try adjusting your filters.</p>
            <button class="control-btn secondary" id="resetFilters">
                <i class="fas fa-refresh"></i>
                Reset Filters
            </button>
        </div>
    </div>
</div>

<!-- Modal for Create/Edit/View -->
<div id="clientModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modalTitle">Client Form</h2>
            <button type="button" class="modal-close" onclick="closeClientModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="clientForm" method="POST">
                @csrf
                <input type="hidden" id="formMethod" name="_method" value="POST">

                <div class="floating-label">
                    <input type="text" class="form-control" id="firstname" name="firstname" placeholder=" " required>
                    <label for="firstname">First Name <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="firstname-error"></span>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="middlename" name="middlename" placeholder=" ">
                    <label for="middlename">Middle Name</label>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="lastname" name="lastname" placeholder=" " required>
                    <label for="lastname">Last Name <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="lastname-error"></span>
                </div>

                <div class="floating-label">
                    <input type="email" class="form-control" id="email" name="email" placeholder=" ">
                    <label for="email">Email Address</label>
                    <span class="error-message" id="email-error"></span>
                </div>

                <div class="floating-label">
                    <textarea class="form-control" id="address" name="address" rows="3" placeholder=" " required></textarea>
                    <label for="address">Address <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="address-error"></span>
                </div>
                <div class="floating-label">
                    <select class="form-control" id="walkin_list" name="walkin_list" placeholder=" " required>
                        <option value="">Select Walk-in</option>
                        @forelse($walkin_list as $walkin)
                            <option value="{{ $walkin->name }}" data-name="{{ $walkin->name }}" data-color="{{ $walkin->color }}">
                                {{ $walkin->name }} ({{ $walkin->color }})
                            </option>
                        @empty
                            <option value="">No walk-in types available</option>
                        @endforelse
                    </select>
                    <label for="walkin_list">Walk-in List <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="walkin_list-error"></span>
                </div>
                <div class="floating-label">
                    <select class="form-control" id="status" name="status" placeholder=" " required>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                    <label for="status">Status <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="status-error"></span>
                </div>

                @if($isSuperAdmin)
                <div class="floating-label" id="officeSelectGroup">
                    <select class="form-control" id="office_id" name="office_id" placeholder=" ">
                        <option value="">Select Office (Optional - defaults to your office)</option>
                        @foreach($offices as $office)
                            <option value="{{ $office->id }}">{{ $office->office_name }}</option>
                        @endforeach
                    </select>
                    <label for="office_id">Assign to Office</label>
                    <span class="error-message" id="office_id-error"></span>
                </div>
                @endif

                <div class="form-group" id="viewOnlyGroup" style="display: none;">
                    <label class="form-label">Created Date</label>
                    <div class="form-control" style="background: #f8f9fa; border: 1px solid var(--border);" id="createdDateDisplay"></div>
                </div>

                
        </div>
        <div class="modal-actions">
                <button type="submit" class="control-btn primary" id="submitBtn">
                    <i class="fas fa-save"></i>
                    Save Client
                </button>
                <button type="button" class="control-btn secondary" onclick="closeClientModal()">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
         </div>
         
         </form>
    </div>
</div>

<!-- Modal Overlay -->
<div id="modalOverlay" class="modal-overlay" style="display: none;" onclick="closeClientModal()"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
window.routes = {
    clientsStats: '{{ route("clients.stats") }}',
    clientsData: '{{ route("clients.data") }}',
    clientsStore: '{{ route("clients.store") }}'
};
window.userPermissions = {{ auth()->user()->permissions ?? 0 }};
window.userId = {{ auth()->user()->id ?? 0 }};
window.userOfficeId = {{ auth()->user()->office_id ?? 0 }};
</script>
<script src="{{ asset('js/client.blade.js') }}"></script>
@endsection
