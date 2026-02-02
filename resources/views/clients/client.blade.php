@extends('layouts.app')

@section('title', 'Client List')
 
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
    // Set default CSRF token for all AJAX requests
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $(document).ready(function() {
        let clientsData = [];
        let filteredData = [];
        let currentView = 'cards';
        let currentMode = 'create'; // create, edit, view

        // Load initial data
        loadStats();
        loadClients();

        // Load Data Button
        $('#loadDataBtn').on('click', function() {
            loadClients();
        });

        // Create New Client
        $('#create_new').on('click', function() {
            openCreateModal();
        });

        // View Toggle Buttons
        $('.toggle-btn').on('click', function() {
            currentView = $(this).data('view');
            $('.toggle-btn').removeClass('active');
            $(this).addClass('active');
            
            // Hide all views first
            $('#cardView').hide();
            $('#tableView').hide();
            
            // Remove all view classes
            $('#cardView').removeClass('active cards-view grid-view list-view');
            
            if (currentView === 'cards') {
                $('#cardView').addClass('cards-view active').show();
                renderCards(filteredData);
            } else if (currentView === 'grid') {
                $('#cardView').addClass('grid-view active').show();
                renderCards(filteredData);
            } else if (currentView === 'list') {
                $('#cardView').addClass('list-view active').show();
                renderCards(filteredData);
            } else if (currentView === 'table') {
                $('#tableView').addClass('active').show();
                renderTable(filteredData);
            }
        });

        // Status Filter
        $('#statusFilter').on('change', function() {
            let status = $(this).val();
            applyFilter(status);
        });

        // Reset Filters
        $('#resetFilters').on('click', function() {
            $('#statusFilter').val('all');
            applyFilter('all');
        });

        // Form Submission
        $('#clientForm').on('submit', function(e) {
            e.preventDefault();
            submitClientForm();
        });

        // Load Stats
        function loadStats() {
            $.ajax({
                url: '{{ route("clients.stats") }}',
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    $('#totalClients').text(data.total);
                    $('#activeClients').text(data.active);
                    $('#inactiveClients').text(data.inactive);
                    $('#emailClients').text(data.email);
                }
            });
        }

        // Load Clients
        function loadClients() {
            $.ajax({
                url: '{{ route("clients.data") }}',
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    clientsData = response.data || [];
                    filteredData = clientsData;
                    renderCards(filteredData);
                    renderTable(filteredData);
                },
                error: function() {
                    console.log('Error loading clients');
                }
            });
        }

        // Apply Filter
        function applyFilter(status) {
            if (status === 'all') {
                filteredData = clientsData;
            } else if (status === 'active') {
                filteredData = clientsData.filter(c => c.status == 1);
            } else if (status === 'inactive') {
                filteredData = clientsData.filter(c => c.status == 0);
            }

            if (filteredData.length === 0 && status !== 'all') {
                $('#cardView').addClass('hidden');
                $('#tableView').addClass('hidden');
                $('#filteredEmptyState').removeClass('hidden');
            } else {
                $('#cardView').removeClass('hidden');
                $('#tableView').removeClass('hidden');
                $('#filteredEmptyState').addClass('hidden');
                
                if (currentView === 'cards' || currentView === 'grid' || currentView === 'list') {
                    renderCards(filteredData);
                } else {
                    renderTable(filteredData);
                }
            }
        }

        // Render Cards/Grid/List View
        function renderCards(data) {
            if (data.length === 0) {
                $('#cardView').html(`
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3>No Clients Found</h3>
                        <p>Get started by adding your first client to the system</p>
                    </div>
                `);
                return;
            }
            let html = '';
            data.forEach(function(client, index) {
                const status = client.status == 1 ? 'active' : 'inactive';
                const statusLabel = client.status == 1 ? 'Active' : 'Inactive';
                const email = client.email || '<span style="color: var(--gray);">No email</span>';
                const fullName = (client.lastname + ', ' + client.firstname + ' ' + client.middlename).toUpperCase();
                const createdDate = new Date(client.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

                html += `
                    <div class="client-card" data-status="${status}" data-id="${client.id}">
                        <div class="card-header">
                            <div class="client-meta">
                                <span class="client-id">Client #${client.id}</span>
                                <span class="client-date">${createdDate}</span>
                            </div>
                            <div class="status-badge ${status}">
                                ${statusLabel}
                            </div>
                        </div>
                        
                        <div class="card-body">
                            <h3 class="client-name">${fullName}</h3>
                            <div class="client-details">
                                <div class="detail-row">
                                    <span class="detail-label">Email:</span>
                                    <span class="detail-value">${email}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Address:</span>
                                    <span class="detail-value">${client.address}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card-footer">
                            <div class="action-buttons">
                                <button class="action-btn-small view view_data" data-id="${client.id}">
                                    <i class="fas fa-eye"></i>
                                    View
                                </button>
                                <button class="action-btn-small edit edit_data" data-id="${client.id}">
                                    <i class="fas fa-edit"></i>
                                    Edit
                                </button>
                                <button class="action-btn-small delete delete_data" data-id="${client.id}">
                                    <i class="fas fa-trash"></i>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });

            $('#cardView').html(html);
            attachCardEventListeners();
        }

        // Render Table View
        function renderTable(data) {
            if (data.length === 0) {
                $('#tableBody').html(`
                    <tr>
                        <td colspan="7">
                            <div class="empty-state">
                                <div class="empty-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <h3>No Clients Found</h3>
                                <p>Get started by adding your first client to the system</p>
                                <button class="control-btn primary" id="create_new_empty_table">
                                    <i class="fas fa-plus-circle"></i>
                                    Add New Client
                                </button>
                            </div>
                        </td>
                    </tr>
                `);
                $('#create_new_empty_table').on('click', function() {
                    openCreateModal();
                });
                return;
            }

            let html = '';
            data.forEach(function(client, index) {
                const status = client.status == 1 ? 'active' : 'inactive';
                const statusLabel = client.status == 1 ? 'Active' : 'Inactive';
                const email = client.email || '<span style="color: var(--gray);">No email</span>';
                const fullName = (client.lastname + ', ' + client.firstname + ' ' + client.middlename).toUpperCase();
                const createdDate = new Date(client.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

                html += `
                    <tr data-status="${status}" data-id="${client.id}">
                        <td class="text-center">${index + 1}</td>
                        <td>${createdDate}</td>
                        <td><strong>${fullName}</strong></td>
                        <td>${email}</td>
                        <td>${client.address}</td>
                        <td class="text-center">
                            <span class="status-badge ${status}">${statusLabel}</span>
                        </td>
                        <td>
                            <div class="action-dropdown">
                                <button class="action-btn">
                                    <i class="fas fa-ellipsis-v"></i>
                                    Actions
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item view_data" data-id="${client.id}">
                                        <i class="fas fa-eye"></i>
                                        View
                                    </a>
                                    <div class="dropdown-divider"></div>
                                    <button class="dropdown-item edit_data" data-id="${client.id}">
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </button>
                                    <div class="dropdown-divider"></div>
                                    <button class="dropdown-item delete_data" data-id="${client.id}">
                                        <i class="fas fa-trash"></i>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
            });

            $('#tableBody').html(html);
            attachTableEventListeners();
        }

        // Attach Card Event Listeners
        function attachCardEventListeners() {
            $('.view_data').on('click', function() {
                const id = $(this).data('id');
                openViewModal(id);
            });

            $('.edit_data').on('click', function() {
                const id = $(this).data('id');
                openEditModal(id);
            });

            $('.delete_data').on('click', function() {
                const id = $(this).data('id');
                if (confirm('Are you sure you want to delete this client?')) {
                    deleteClient(id);
                }
            });
        }

        // Attach Table Event Listeners
        function attachTableEventListeners() {
            $('.action-btn').on('click', function(e) {
                e.stopPropagation();
                $(this).next('.dropdown-menu').toggleClass('show');
            });

            $(document).on('click', function(e) {
                if (!$(e.target).closest('.action-dropdown').length) {
                    $('.dropdown-menu').removeClass('show');
                }
            });

            $('.view_data').on('click', function() {
                const id = $(this).data('id');
                openViewModal(id);
            });

            $('.edit_data').on('click', function() {
                const id = $(this).data('id');
                openEditModal(id);
            });

            $('.delete_data').on('click', function() {
                const id = $(this).data('id');
                if (confirm('Are you sure you want to delete this client?')) {
                    deleteClient(id);
                }
            });
        }

        // Open Create Modal
        window.openCreateModal = function() {
            currentMode = 'create';
            $('#modalTitle').text('Create New Client');
            $('#submitBtn').html('<i class="fas fa-save"></i> Save Client');
            $('#formMethod').val('POST');
            $('#clientForm').attr('action', '{{ route("clients.store") }}');
            $('#clientForm')[0].reset();
            $('.error-message').text('');
            $('.form-control').removeClass('error');
            $('#viewOnlyGroup').hide();
            $('#clientForm').show();
            
            // Show modal with animation
            $('#clientModal, #modalOverlay').show();
            
            // GSAP Animation
            gsap.fromTo('#modalOverlay', 
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
            
            gsap.fromTo('#clientModal',
                { opacity: 0, scale: 0.9, y: -50 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out' }
            );
            
            // Animate form elements
            gsap.fromTo('.form-group',
                { opacity: 0, x: -20 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.3,
                    stagger: 0.05,
                    ease: 'power2.out'
                }
            );
        };

        // Open Edit Modal
        window.openEditModal = function(id) {
            currentMode = 'edit';
            const client = clientsData.find(c => c.id == id);
            
            if (!client) return;

            $('#modalTitle').text('Edit Client');
            $('#submitBtn').html('<i class="fas fa-save"></i> Update Client');
            $('#formMethod').val('PUT');
            $('#clientForm').attr('action', '/clients/' + id);

            $('#firstname').val(client.firstname);
            $('#middlename').val(client.middlename);
            $('#lastname').val(client.lastname);
            $('#email').val(client.email);
            $('#address').val(client.address);
            $('#status').val(client.status);

            $('.error-message').text('');
            $('.form-control').removeClass('error');
            $('#viewOnlyGroup').hide();
            $('#clientForm').show();
            
            // Show modal with animation
            $('#clientModal, #modalOverlay').show();
            
            // GSAP Animation
            gsap.fromTo('#modalOverlay', 
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
            
            gsap.fromTo('#clientModal',
                { opacity: 0, scale: 0.9, y: -50 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out' }
            );
            
            // Animate form elements
            gsap.fromTo('.form-group',
                { opacity: 0, x: -20 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.3,
                    stagger: 0.05,
                    ease: 'power2.out'
                }
            );
        };

        // Open View Modal
        window.openViewModal = function(id) {
            currentMode = 'view';
            const client = clientsData.find(c => c.id == id);
            
            if (!client) return;

            $('#modalTitle').text('View Client Details');
            $('#submitBtn').html('<i class="fas fa-edit"></i> Edit').attr('type', 'button');
            $('#submitBtn').off().on('click', function() {
                // Close current modal
                gsap.to('#clientModal', {
                    opacity: 0,
                    scale: 0.9,
                    y: -50,
                    duration: 0.3,
                    ease: 'back.in',
                    onComplete: function() {
                        openEditModal(id);
                    }
                });
            });

            $('#firstname').val(client.firstname).attr('readonly', true);
            $('#middlename').val(client.middlename).attr('readonly', true);
            $('#lastname').val(client.lastname).attr('readonly', true);
            $('#email').val(client.email).attr('readonly', true);
            $('#address').val(client.address).attr('readonly', true);
            $('#status').val(client.status).attr('disabled', true);

            $('#createdDateDisplay').text(new Date(client.date_created).toLocaleString());

            $('.error-message').text('');
            $('.form-control').removeClass('error');
            $('#viewOnlyGroup').show();
            $('#clientForm').show();
            
            // Show modal with animation
            $('#clientModal, #modalOverlay').show();
            
            // GSAP Animation
            gsap.fromTo('#modalOverlay', 
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
            
            gsap.fromTo('#clientModal',
                { opacity: 0, scale: 0.9, y: -50 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out' }
            );
            
            // Animate form elements
            gsap.fromTo('.form-group',
                { opacity: 0, x: -20 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.3,
                    stagger: 0.05,
                    ease: 'power2.out'
                }
            );
        };

        // Close Modal
        window.closeClientModal = function() {
            // GSAP close animation
            gsap.to('#modalOverlay', {
                opacity: 0,
                duration: 0.3,
                onComplete: function() {
                    $('#modalOverlay').hide();
                }
            });
            
            gsap.to('#clientModal', {
                opacity: 0,
                scale: 0.9,
                y: -50,
                duration: 0.3,
                ease: 'back.in',
                onComplete: function() {
                    $('#clientModal').hide();
                    $('#clientForm')[0].reset();
                    $('.form-control').removeAttr('readonly').removeAttr('disabled');
                    $('.error-message').text('');
                }
            });
        };

        // Submit Client Form
        function submitClientForm() {
            if (currentMode === 'view') return;

            const url = $('#clientForm').attr('action');
            const method = $('#formMethod').val();
            
            const formData = {
                firstname: $('#firstname').val(),
                middlename: $('#middlename').val(),
                lastname: $('#lastname').val(),
                email: $('#email').val(),
                address: $('#address').val(),
                walkin_list: $('#walkin_list').val(),
                status: $('#status').val(),
                _token: $('meta[name="csrf-token"]').attr('content')
            };

            // Add _method field for PUT requests
            if (method === 'PUT') {
                formData._method = 'PUT';
            }

            console.log('Form Data:', formData);
            console.log('URL:', url);
            console.log('Method:', method);
            console.log('CSRF Token:', $('meta[name="csrf-token"]').attr('content'));

            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                dataType: 'json',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    console.log('Success:', response);
                    loadStats();
                    loadClients();
                    closeClientModal();
                    alert(response.message || 'Operation successful');
                },
                error: function(xhr) {
                    console.error('Error:', xhr);
                    console.error('Status:', xhr.status);
                    console.error('Response:', xhr.responseText);
                    
                    if (xhr.status === 422) {
                        const errors = xhr.responseJSON.errors;
                        $.each(errors, function(key, value) {
                            $('#' + key + '-error').text(value[0]);
                            $('#' + key).addClass('error');
                        });
                        alert('Validation Error: Please check the form fields');
                    } else if (xhr.status === 419) {
                        alert('Error: Session expired. Please refresh the page and try again.');
                        location.reload();
                    } else if (xhr.status === 404) {
                        alert('Error: Route not found. Please check your routes configuration.');
                    } else if (xhr.responseJSON && xhr.responseJSON.error) {
                        alert('Error: ' + xhr.responseJSON.error);
                    } else {
                        alert('Error: ' + xhr.status + ' - ' + xhr.statusText);
                    }
                }
            });
        }

        // Delete Client
        function deleteClient(id) {
            $.ajax({
                url: '/clients/' + id,
                type: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function() {
                    loadStats();
                    loadClients();
                    alert('Client deleted successfully');
                },
                error: function(xhr) {
                    console.error('Error:', xhr);
                    if (xhr.status === 419) {
                        alert('Error: Session expired. Please refresh the page and try again.');
                        location.reload();
                    } else {
                        alert('Error deleting client');
                    }
                }
            });
        }
    });
</script>
@endsection