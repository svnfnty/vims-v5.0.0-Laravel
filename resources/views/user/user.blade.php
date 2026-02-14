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
        <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                <i class="fas fa-credit-card"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="subscribedUsers">0</span>
                <span class="stat-label">Subscribed</span>
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
                        <option value="subscribed">Subscribed</option>
                        <option value="expired">Expired Subscription</option>
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
                        <th>Subscription</th>
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
            <form id="userForm" method="POST" enctype="multipart/form-data">
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
                    <input type="password" class="form-control" id="password" name="password" placeholder="Leave empty to keep current password">
                    <label for="password">Password</label>
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

                <!-- Subscription Fields -->
                <div class="form-section" style="margin-top: 20px; padding-top: 15px; border-top: 2px solid var(--border);">
                    <h4 style="margin-bottom: 15px; color: var(--primary);">
                        <i class="fas fa-credit-card"></i> Subscription Information
                    </h4>
                    
                    <div class="floating-label">
                        <select class="form-control" id="subscription_type" name="subscription_type" placeholder=" ">
                            <option value="">No Subscription</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="free_trial">Free Trial</option>
                        </select>
                        <label for="subscription_type">Subscription Type</label>
                        <span class="error-message" id="subscription_type-error"></span>
                    </div>

                    <div class="floating-label">
                        <input type="date" class="form-control" id="subscription_start_date" name="subscription_start_date" placeholder=" ">
                        <label for="subscription_start_date">Subscription Start Date</label>
                        <span class="error-message" id="subscription_start_date-error"></span>
                    </div>

                    <div class="floating-label">
                        <input type="date" class="form-control" id="subscription_end_date" name="subscription_end_date" placeholder=" ">
                        <label for="subscription_end_date">Subscription End Date</label>
                        <span class="error-message" id="subscription_end_date-error"></span>
                    </div>

                    <div class="floating-label">
                        <input type="date" class="form-control" id="last_payment_date" name="last_payment_date" placeholder=" ">
                        <label for="last_payment_date">Last Payment Date</label>
                        <span class="error-message" id="last_payment_date-error"></span>
                    </div>

                    <div class="floating-label">
                        <input type="number" step="0.01" class="form-control" id="subscription_amount" name="subscription_amount" placeholder=" ">
                        <label for="subscription_amount">Subscription Amount</label>
                        <span class="error-message" id="subscription_amount-error"></span>
                    </div>
                </div>

                <!-- QR Code Payment Fields -->
                <div class="form-section" style="margin-top: 20px; padding-top: 15px; border-top: 2px solid var(--border);">
                    <h4 style="margin-bottom: 15px; color: var(--primary);">
                        <i class="fas fa-qrcode"></i> Payment QR Codes
                    </h4>
                    <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 15px;">
                        Upload QR codes for GCash and Maya payment methods. Users will see these when making payments.
                    </p>
                    
                    <!-- GCash QR Code -->
                    <div class="floating-label" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-primary);">
                            <i class="fas fa-mobile-alt" style="color: #007bff;"></i> GCash QR Code
                        </label>
                        <input type="file" class="form-control" id="gcash_qr" name="gcash_qr" accept="image/jpeg,image/png,image/jpg" style="padding: 8px;">
                        <span class="error-message" id="gcash_qr-error"></span>
                        <p style="font-size: 11px; color: var(--text-secondary); margin-top: 5px;">Upload QR code image (JPG, PNG, max 2MB)</p>
                        
                        <!-- GCash QR Preview -->
                        <div id="gcash_qr_preview_container" style="margin-top: 10px; display: none;">
                            <p style="font-size: 12px; font-weight: 500; margin-bottom: 5px;">Current GCash QR:</p>
                            <img id="gcash_qr_preview" src="" alt="GCash QR Code" style="max-width: 200px; max-height: 200px; border: 1px solid var(--border); border-radius: 8px; padding: 5px;">
                        </div>
                    </div>

                    <!-- Maya QR Code -->
                    <div class="floating-label" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-primary);">
                            <i class="fas fa-wallet" style="color: #28a745;"></i> Maya QR Code
                        </label>
                        <input type="file" class="form-control" id="maya_qr" name="maya_qr" accept="image/jpeg,image/png,image/jpg" style="padding: 8px;">
                        <span class="error-message" id="maya_qr-error"></span>
                        <p style="font-size: 11px; color: var(--text-secondary); margin-top: 5px;">Upload QR code image (JPG, PNG, max 2MB)</p>
                        
                        <!-- Maya QR Preview -->
                        <div id="maya_qr_preview_container" style="margin-top: 10px; display: none;">
                            <p style="font-size: 12px; font-weight: 500; margin-bottom: 5px;">Current Maya QR:</p>
                            <img id="maya_qr_preview" src="" alt="Maya QR Code" style="max-width: 200px; max-height: 200px; border: 1px solid var(--border); border-radius: 8px; padding: 5px;">
                        </div>
                    </div>
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
    window.currentUserSubscription = {
        subscription_type: '{{ auth()->user()->subscription_type ?? '' }}',
        subscription_start_date: '{{ auth()->user()->subscription_start_date ?? '' }}',
        subscription_end_date: '{{ auth()->user()->subscription_end_date ?? '' }}',
        last_payment_date: '{{ auth()->user()->last_payment_date ?? '' }}',
        subscription_amount: '{{ auth()->user()->subscription_amount ?? '' }}'
    };
    window.storageUrl = '{{ asset('storage') }}';
</script>

<script>
    // QR Code file input preview handlers
    document.addEventListener('DOMContentLoaded', function() {
        const gcashQrInput = document.getElementById('gcash_qr');
        const mayaQrInput = document.getElementById('maya_qr');
        const gcashPreview = document.getElementById('gcash_qr_preview');
        const mayaPreview = document.getElementById('maya_qr_preview');
        const gcashContainer = document.getElementById('gcash_qr_preview_container');
        const mayaContainer = document.getElementById('maya_qr_preview_container');

        // Handle GCash QR file selection
        if (gcashQrInput) {
            gcashQrInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        gcashPreview.src = e.target.result;
                        gcashContainer.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Handle Maya QR file selection
        if (mayaQrInput) {
            mayaQrInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        mayaPreview.src = e.target.result;
                        mayaContainer.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Function to load existing QR codes when editing
        window.loadQRCodePreviews = function(user) {
            // Use the full URL from the server if available, otherwise construct it
            if (user.gcash_qr_url || user.gcash_qr_path) {
                gcashPreview.src = user.gcash_qr_url || (window.storageUrl + '/' + user.gcash_qr_path);
                gcashContainer.style.display = 'block';
            } else {
                gcashPreview.src = '';
                gcashContainer.style.display = 'none';
            }
            
            if (user.maya_qr_url || user.maya_qr_path) {
                mayaPreview.src = user.maya_qr_url || (window.storageUrl + '/' + user.maya_qr_path);
                mayaContainer.style.display = 'block';
            } else {
                mayaPreview.src = '';
                mayaContainer.style.display = 'none';
            }
        };

        // Clear QR code previews when creating new user
        window.clearQRCodePreviews = function() {
            gcashPreview.src = '';
            mayaPreview.src = '';
            gcashContainer.style.display = 'none';
            mayaContainer.style.display = 'none';
            if (gcashQrInput) gcashQrInput.value = '';
            if (mayaQrInput) mayaQrInput.value = '';
        };
    });
</script>
@endsection
