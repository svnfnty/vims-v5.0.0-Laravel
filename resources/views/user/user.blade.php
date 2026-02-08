@extends('layouts.app')

@section('content')
@php $officeId = auth()->user()->office_id ?? null; @endphp
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
@vite(['resources/css/user.css', 'resources/js/user.js'])

<div class="user-dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
        <div class="header-content">
            <div class="logo-section">
                <div class="logo-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="system-info">
                    <h1 class="system-title">List of Users</h1>
                    <p class="system-subtitle">Manage your user database efficiently</p>
                </div>
            </div>
            <div class="user-controls">
                <div class="batch-controls">
                    <button class="control-btn primary" id="create_new">
                        <i class="fas fa-plus-circle"></i>
                        New User
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
                <span class="stat-value" id="totalUsers">0</span>
                <span class="stat-label">Total Users</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon active">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="activeUsers">0</span>
                <span class="stat-label">Verified Users</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon inactive">
                <i class="fas fa-user-slash"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="inactiveUsers">0</span>
                <span class="stat-label">Not Verified</span>
            </div>
        </div>
    </div>

    <!-- Users Section -->
    <div class="users-section">
        <div class="section-header">
            <h2 class="section-title">User List</h2>
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
                       <option value="all">All Users</option>
                        <option value="active">Verified</option>
                        <option value="inactive">Not Verified</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Card/Grid/List Views -->
        <div class="users-grid cards-view active" id="cardView">
            <!-- Users will be loaded here dynamically -->
        </div>

        <!-- Table View -->
        <div class="modern-table-container" id="tableView">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Permissions</th>
                        <th>Credit</th>
                        <th>Office</th>
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
            <h3>No Matching Users Found</h3>
            <p>No users match your current filter criteria. Try adjusting your filters.</p>
            <button class="control-btn secondary" id="resetFilters">
                <i class="fas fa-refresh"></i>
                Reset Filters
            </button>
        </div>
    </div>
</div>

<!-- Modal for Create/Edit/View -->
<div id="userModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modalTitle">User Form</h2>
            <button type="button" class="modal-close" onclick="closeUserModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="userForm" method="POST">
                @csrf
                <input type="hidden" id="formMethod" name="_method" value="POST">
                <input type="hidden" id="office_id" name="office_id" value="{{ $officeId }}">

                <div class="floating-label">
                    <input type="text" class="form-control" id="firstname" name="firstname" placeholder=" " required>
                    <label for="firstname">First Name <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="firstname-error"></span>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="middlename" name="middlename" placeholder=" ">
                    <label for="middlename">Middle Name</label>
                    <span class="error-message" id="middlename-error"></span>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="lastname" name="lastname" placeholder=" " required>
                    <label for="lastname">Last Name <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="lastname-error"></span>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="username" name="username" placeholder=" " required>
                    <label for="username">Username <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="username-error"></span>
                </div>

                <div class="floating-label">
                    <input type="email" class="form-control" id="email" name="email" placeholder=" " required>
                    <label for="email">Email <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="email-error"></span>
                </div>

                <div class="floating-label">
                    <input type="password" class="form-control" id="password" name="password" placeholder=" " required>
                    <label for="password">Password <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="password-error"></span>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="avatar" name="avatar" placeholder=" ">
                    <label for="avatar">Avatar URL</label>
                    <span class="error-message" id="avatar-error"></span>
                </div>

                <div class="floating-label">
                    <select class="form-control" id="type" name="type" placeholder=" " required>
                        <option value="1">Admin</option>
                        <option value="2">User</option>
                    </select>
                    <label for="type">Type <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="type-error"></span>
                </div>

                <div class="floating-label">
                    <select class="form-control" id="status" name="status" placeholder=" " required>
                        <option value="1">Verified</option>
                        <option value="0">Not Verified</option>
                    </select>
                    <label for="status">Status <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="status-error"></span>
                </div>

                <div class="floating-label">
                    <select class="form-control" id="permissions" name="permissions" placeholder=" " required>
                        <option value="0">No Access</option>
                        <option value="1">Can Modify And Delete</option>
                        <option value="2">Can Modify Only</option>
                    </select>
                    <label for="permissions">Permissions <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="permissions-error"></span>
                </div>

                <div class="floating-label">
                    <input type="number" step="0.01" class="form-control" id="credit" name="credit" placeholder=" ">
                    <label for="credit">Credit</label>
                    <span class="error-message" id="credit-error"></span>
                </div>

                <div class="floating-label">
                    <select class="form-control" id="office" name="office_id" placeholder=" ">
                        <option value="">Select Office</option>
                        @foreach($offices as $office)
                            <option value="{{ $office->id }}">{{ $office->office_name }}</option>
                        @endforeach
                    </select>
                    <label for="office">Office</label>
                    <span class="error-message" id="office-error"></span>
                </div>

                <div class="form-group" id="viewOnlyGroup" style="display: none;">
                    <label class="form-label">Created Date</label>
                    <div class="form-control" style="background: #f8f9fa; border: 1px solid var(--border);" id="createdDateDisplay"></div>
                </div>


        </div>
        <div class="modal-actions">
                <button type="submit" class="control-btn primary" id="submitBtn">
                    <i class="fas fa-save"></i>
                    Save User
                </button>
                <button type="button" class="control-btn secondary" onclick="closeUserModal()">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
         </div>

         </form>
    </div>
</div>

<!-- Modal Overlay -->
<div id="modalOverlay" class="modal-overlay" style="display: none;" onclick="closeUserModal()"></div>

<script>
    window.userRoutes = {
        stats: '{{ route("users.stats") }}',
        data: '{{ route("users.data") }}',
        store: '{{ route("users.store") }}',
        base: '/users/'
    };
    window.offices = @json($offices);
    window.userPermissions = {{ auth()->user()->permissions ?? 0 }};
</script>
@endsection
