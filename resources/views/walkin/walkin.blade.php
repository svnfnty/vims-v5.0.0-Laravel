@extends('layouts.app')

@section('content')
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
@vite(['resources/css/walkin.css', 'resources/js/walkin.js', 'resources/css/tutorial.css', 'resources/js/tutorial.js'])
 
<div class="walkin-dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
        <div class="header-content">
            <div class="logo-section">
                <div class="logo-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="system-info">
                    <h1 class="system-title">List of Walkins</h1>
                    <p class="system-subtitle">Manage your walkin database efficiently</p>
                </div>
            </div>
            <div class="user-controls">
                <div class="batch-controls">
                    <button class="control-btn primary" id="create_new" data-tutorial-target="walkin-create">
                        <i class="fas fa-plus-circle"></i>
                        New Walkin
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
                <span class="stat-value" id="totalWalkins">0</span>
                <span class="stat-label">Total Walkins</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon active">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="activeWalkins">0</span>
                <span class="stat-label">Active Walkins</span>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon inactive">
                <i class="fas fa-user-slash"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="inactiveWalkins">0</span>
                <span class="stat-label">Inactive</span>
            </div>
        </div>
    </div>

    <!-- Walkins Section -->
    <div class="walkins-section">
        <div class="section-header">
            <h2 class="section-title">Walkin List</h2>
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
        <div class="walkins-grid cards-view active" id="cardView">
            <!-- Walkins will be loaded here dynamically -->
        </div>

        <!-- Table View -->
        <div class="modern-table-container" id="tableView">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Account ID</th>
                        <th>Name</th>
                        <th>Color</th>
                        <th>Status</th>
                        <th>Description</th>
                        @if(auth()->user()->id == 1 && auth()->user()->office_id == 0)
                            <th>Office</th>
                        @endif
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
            <h3>No Matching Walkins Found</h3>
            <p>No walkins match your current filter criteria. Try adjusting your filters.</p>
            <button class="control-btn secondary" id="resetFilters">
                <i class="fas fa-refresh"></i>
                Reset Filters
            </button>
        </div>
    </div>
</div>

<!-- Modal for Create/Edit/View -->
<div id="walkinModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modalTitle">Walkin Form</h2>
            <button type="button" class="modal-close" onclick="closeWalkinModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="walkinForm" method="POST">
                @csrf
                <input type="hidden" id="formMethod" name="_method" value="POST">

                <div class="floating-label">
                    <input type="email" class="form-control" id="email" name="email" placeholder=" " required>
                    <label for="email">Email <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="email-error"></span>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="accountID" name="accountID" placeholder=" " required>
                    <label for="accountID">Account ID <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="accountID-error"></span>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="name" name="name" placeholder=" " required>
                    <label for="name">Name <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="name-error"></span>
                </div>

                <div class="floating-label">
                    <input type="color" class="form-control" id="color" name="color" required>
                    <label for="color">Color <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="color-error"></span>
                </div>

                <div class="floating-label">
                    <textarea class="form-control" id="description" name="description" rows="3" placeholder=" " required></textarea>
                    <label for="description">Description <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="description-error"></span>
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
                @else
                <input type="hidden" id="office_id" name="office_id" value="{{ $officeId }}">
                @endif

                <div class="form-group" id="viewOnlyGroup" style="display: none;">
                    <label class="form-label">Created Date</label>
                    <div class="form-control" style="background: #f8f9fa; border: 1px solid var(--border);" id="createdDateDisplay"></div>
                </div>

                
        </div>
        <div class="modal-actions">
                <button type="submit" class="control-btn primary" id="submitBtn">
                    <i class="fas fa-save"></i>
                    Save Walkin
                </button>
                <button type="button" class="control-btn secondary" onclick="closeWalkinModal()">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
         </div>
         
         </form>
    </div>
</div>

<!-- Modal Overlay -->
<div id="modalOverlay" class="modal-overlay" style="display: none;" onclick="closeWalkinModal()"></div>

<script>
    window.walkinRoutes = {
        stats: '{{ route("walkin.stats") }}',
        data: '{{ route("walkin.data") }}',
        store: '{{ route("walkin.store") }}',
        base: '/walkin/'
    };
    window.userPermissions = {{ auth()->user()->permissions ?? 0 }};
    window.userId = {{ auth()->user()->id ?? 0 }};
    window.userOfficeId = {{ auth()->user()->office_id ?? 0 }};
    window.isSuperAdmin = {{ $isSuperAdmin ? 'true' : 'false' }};
</script>

<!-- Tutorial Step Completion Handler -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Listen for walkin form submission to trigger tutorial next step
        const walkinForm = document.getElementById('walkinForm');
        if (walkinForm) {
            walkinForm.addEventListener('submit', function() {
                // Dispatch event to notify tutorial system
                window.dispatchEvent(new CustomEvent('tutorial:actionCompleted', {
                    detail: { step: 1, action: 'walkin_created' }
                }));
            });
        }
    });
</script>
@endsection
