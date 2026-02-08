@extends('layouts.app')

@section('content')
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
@vite(['resources/css/office.css', 'resources/js/office.js'])

<div class="office-dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
        <div class="header-content">
            <div class="logo-section">
                <div class="logo-icon">
                    <i class="fas fa-building"></i>
                </div>
                <div class="system-info">
                    <h1 class="system-title">List of Offices</h1>
                    <p class="system-subtitle">Manage your office database efficiently</p>
                </div>
            </div>
            <div class="user-controls">
                <div class="batch-controls">
                    <button class="control-btn primary" id="create_new">
                        <i class="fas fa-plus-circle"></i>
                        New Office
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
                <i class="fas fa-building"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="totalOffices">0</span>
                <span class="stat-label">Total Offices</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon active">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="activeOffices">0</span>
                <span class="stat-label">Active Offices</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon inactive">
                <i class="fas fa-building"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="inactiveOffices">0</span>
                <span class="stat-label">Inactive</span>
            </div>
        </div>
    </div>

    <!-- Offices Section -->
    <div class="offices-section">
        <div class="section-header">
            <h2 class="section-title">Office List</h2>
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
                       <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Card/Grid/List Views -->
        <div class="offices-grid cards-view active" id="cardView">
            <!-- Offices will be loaded here dynamically -->
        </div>

        <!-- Table View -->
        <div class="modern-table-container" id="tableView">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Office Name</th>
                        <th>Office Address</th>
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
            <h3>No Matching Offices Found</h3>
            <p>No offices match your current filter criteria. Try adjusting your filters.</p>
            <button class="control-btn secondary" id="resetFilters">
                <i class="fas fa-refresh"></i>
                Reset Filters
            </button>
        </div>
    </div>
</div>

<!-- Modal for Create/Edit/View -->
<div id="officeModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modalTitle">Office Form</h2>
            <button type="button" class="modal-close" onclick="closeOfficeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="officeForm" method="POST">
                @csrf
                <input type="hidden" id="formMethod" name="_method" value="POST">

                <div class="floating-label">
                    <input type="text" class="form-control" id="office_name" name="office_name" placeholder=" " required>
                    <label for="office_name">Office Name <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="office_name-error"></span>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="office_address" name="office_address" placeholder=" " required>
                    <label for="office_address">Office Address <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="office_address-error"></span>
                </div>

                <div class="floating-label">
                    <select class="form-control" id="status" name="status" placeholder=" " required>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                    <label for="status">Status <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="status-error"></span>
                </div>

                <div class="form-group" id="viewOnlyGroup" style="display: none;">
                    <label class="form-label">Created Date</label>
                    <div class="form-control" style="background: #f8f9fa; border: 1px solid var(--border);" id="createdDateDisplay"></div>
                </div>


        </div>
        <div class="modal-actions">
                <button type="submit" class="control-btn primary" id="submitBtn">
                    <i class="fas fa-save"></i>
                    Save Office
                </button>
                <button type="button" class="control-btn secondary" onclick="closeOfficeModal()">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
         </div>

         </form>
    </div>
</div>

<!-- Modal Overlay -->
<div id="modalOverlay" class="modal-overlay" style="display: none;" onclick="closeOfficeModal()"></div>

<script>
    window.officeRoutes = {
        stats: '{{ route("office.stats") }}',
        data: '{{ route("office.data") }}',
        store: '{{ route("office.store") }}',
        base: '/office/'
    };
    window.userPermissions = {{ auth()->user()->permissions ?? 0 }};
</script>
@endsection
