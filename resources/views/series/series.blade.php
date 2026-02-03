@extends('layouts.app')

@section('title', 'Series List')
@section('content')
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
    @import url('{{ asset("css/series.blade.css") }}');
</style>

<div class="series-dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
        <div class="header-content">
            <div class="logo-section">
                <div class="logo-icon">
                    <i class="fas fa-list-ol"></i>
                </div>
                <div class="system-info">
                    <h1 class="system-title">Policy Series Management</h1>
                    <p class="system-subtitle">Manage your policy series efficiently</p>
                </div>
            </div>
            <div class="user-controls">
                <div class="batch-controls">
                    <button class="control-btn primary" id="create_new">
                        <i class="fas fa-plus-circle"></i>
                        New Series
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
                <i class="fas fa-list-ol"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="totalSeries">0</span>
                <span class="stat-label">Total Series</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon active">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="activeSeries">0</span>
                <span class="stat-label">Active Series</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon inactive">
                <i class="fas fa-times-circle"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="inactiveSeries">0</span>
                <span class="stat-label">Inactive</span>
            </div>
        </div>
    </div>

    <!-- Series Section -->
    <div class="series-section">
        <div class="section-header">
            <h2 class="section-title">Series List</h2>
            <div class="view-controls">
                <div class="view-toggle">
                    <button class="toggle-btn" data-view="cards">
                        <i class="fas fa-th-large"></i>
                        Cards
                    </button>
                    <button class="toggle-btn" data-view="grid">
                        <i class="fas fa-th"></i>
                        Grid
                    </button>
                    
                    <button class="toggle-btn active" data-view="table">
                        <i class="fas fa-table"></i>
                        Table
                    </button>
                </div>
                <div class="filter-controls">
                    <select class="filter-select" id="statusFilter">
                       <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Series Selection for COC Details -->
        <div class="series-selection-section" style="margin-bottom: 24px;">
            <div class="card" style="border: 1px solid var(--series-border); border-radius: 12px; box-shadow: var(--series-shadow);">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="mb-0"><i class="fas fa-filter mr-2"></i>View Series Details</h5>
                        <small class="text-muted" id="last-updated"></small>
                    </div>
                    <div class="form-group">
                        <select onchange="showSeries(this.value)" id="select-se" class="form-control select2 shadow-sm" style="border-radius: 8px; padding: 0.5rem;">
                            <option value="">Select a policy series to view details...</option>
                            <?php
                            $seriesList = \App\Models\Series::where('status', 1)->where('office_id', auth()->user()->office_id ?? null)->get();
                            foreach ($seriesList as $series) {
                                echo '<option value="' . $series->id . '">' . htmlspecialchars($series->name) . ' (Range: ' . $series->range_start . ' - ' . $series->range_stop . ')</option>';
                            }
                            ?>
                        </select>
                    </div>
                </div>
            </div>
        </div>

      
        <!-- Card/Grid/List Views -->
        <div class="series-grid cards-view" id="cardView" style="display: none;">
            <!-- Series will be loaded here dynamically -->
        </div>

        <!-- Table View -->
        <div class="modern-table-container" id="tableView">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Range Start</th>
                        <th>Range Stop</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    <!-- Table rows will be loaded here dynamically -->
                </tbody>
            </table>
        </div>

        <!-- Series Details Table Container -->
        <div id="series-table-placeholder" style="display: none; text-align: center; padding: 40px;">
            <div class="empty-icon">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <h3>Loading Series Details...</h3>
            <p>Please wait while we fetch the series information.</p>
        </div>
        <div id="series-table-container" style="display: none;">
            <div id="series-table-content"></div>
        </div>

        <!-- Empty State for Filtered Results -->
        <div class="empty-state hidden" id="filteredEmptyState">
            <div class="empty-icon">
                <i class="fas fa-search"></i>
            </div>
            <h3>No Matching Series Found</h3>
            <p>No series match your current filter criteria. Try adjusting your filters.</p>
            <button class="control-btn secondary" id="resetFilters">
                <i class="fas fa-refresh"></i>
                Reset Filters
            </button>
        </div>
    </div>
</div>

<!-- Modal for Create/Edit/View -->
<div id="seriesModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modalTitle">Series Form</h2>
            <button type="button" class="modal-close" onclick="closeSeriesModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="seriesForm" method="POST">
                @csrf
                <input type="hidden" id="formMethod" name="_method" value="POST">

                <div class="floating-label">
                    <input type="text" class="form-control" id="name" name="name" placeholder=" " required>
                    <label for="name">Series Name <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="name-error"></span>
                </div>

                <div class="floating-label">
                    <input type="number" class="form-control" id="range_start" name="range_start" placeholder=" " required min="1">
                    <label for="range_start">Range Start <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="range_start-error"></span>
                </div>

                <div class="floating-label">
                    <input type="number" class="form-control" id="range_stop" name="range_stop" placeholder=" " required min="1">
                    <label for="range_stop">Range Stop <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="range_stop-error"></span>
                </div>

                <div class="floating-label">
                    <select class="form-control" id="type" name="type" placeholder=" " required>
                        <option value="">Select Type</option>
                        <option value="0">Pacific</option>
                        <option value="1">Liberty</option>
                        <option value="3">Stronghold</option>
                    </select>
                    <label for="type">Type <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="type-error"></span>
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
                    Save Series
                </button>
                <button type="button" class="control-btn secondary" onclick="closeSeriesModal()">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
         </div>

         </form>
    </div>
</div>

<!-- Modal Overlay -->
<div id="modalOverlay" class="modal-overlay" style="display: none;" onclick="closeSeriesModal()"></div>

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
        let seriesData = [];
        let filteredData = [];
        let currentView = 'cards'; // Default to cards view on first load
        let currentMode = 'create'; // create, edit, view

        // Load initial data
        loadStats();
        loadSeries();

        // Toggle to cards view on first reload
        setTimeout(function() {
            $('.toggle-btn[data-view="cards"]').trigger('click');
        }, 100);

        // Load Data Button
        $('#loadDataBtn').on('click', function() {
            loadSeries();
        });

        // Create New Series
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
            $('#series-table-container').hide();
            // Remove all view classes
            $('#cardView').removeClass('active cards-view grid-view list-view');

            if (currentView === 'cards') {
                $('#cardView').addClass('cards-view active').show();
                renderCards(filteredData);
            } else if (currentView === 'grid') {
                $('#cardView').addClass('grid-view active').show();
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
        $('#seriesForm').on('submit', function(e) {
            e.preventDefault();
            submitSeriesForm();
        });

        // Load Stats
        function loadStats() {
            $.ajax({
                url: '{{ route("series.stats") }}',
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    $('#totalSeries').text(data.total);
                    $('#activeSeries').text(data.active);
                    $('#inactiveSeries').text(data.inactive);
                }
            });
        }

        // Load Series
        function loadSeries() {
            $.ajax({
                url: '{{ route("series.data") }}',
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    seriesData = response.data || [];
                    filteredData = seriesData;
                    renderCards(filteredData);
                    renderTable(filteredData);
                },
                error: function() {
                    console.log('Error loading series');
                }
            });
        }

        // Apply Filter
        function applyFilter(status) {
            if (status === 'all') {
                filteredData = seriesData;
            } else if (status === 'active') {
                filteredData = seriesData.filter(s => s.status == 1);
            } else if (status === 'inactive') {
                filteredData = seriesData.filter(s => s.status == 0);
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
                            <i class="fas fa-list-ol"></i>
                        </div>
                        <h3>No Series Found</h3>
                        <p>Get started by adding your first series to the system</p>
                    </div>
                `);
                return;
            }
            let html = '';
            data.forEach(function(series, index) {
                const status = series.status == 1 ? 'active' : 'inactive';
                const statusLabel = series.status == 1 ? 'Active' : 'Inactive';
                const typeLabel = series.type == 0 ? 'Pacific' : (series.type == 1 ? 'Liberty' : 'Stronghold');
                const createdDate = new Date(series.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

                html += `
                    <div class="series-card" data-status="${status}" data-id="${series.id}">
                        <div class="card-header">
                            <div class="series-meta">
                                <span class="series-id">Series #${series.id}</span>
                                <span class="series-date">${createdDate}</span>
                            </div>
                            <div class="status-badge ${status}">
                                ${statusLabel}
                            </div>
                        </div>

                        <div class="card-body">
                            <h3 class="series-name">${series.name}</h3>
                            <div class="series-details">
                                <div class="detail-row">
                                    <span class="detail-label">Range:</span>
                                    <span class="detail-value">${series.range_start} - ${series.range_stop}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Type:</span>
                                    <span class="detail-value">${typeLabel}</span>
                                </div>
                            </div>
                        </div>

                        <div class="card-footer">
                            <div class="action-buttons">
                                <button class="action-btn-small view view_data" data-id="${series.id}">
                                    <i class="fas fa-eye"></i>
                                    View
                                </button>
                                <button class="action-btn-small edit edit_data" data-id="${series.id}">
                                    <i class="fas fa-edit"></i>
                                    Edit
                                </button>
                                <button class="action-btn-small delete delete_data" data-id="${series.id}">
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
                        <td colspan="8">
                            <div class="empty-state">
                                <div class="empty-icon">
                                    <i class="fas fa-list-ol"></i>
                                </div>
                                <h3>No Series Found</h3>
                                <p>Get started by adding your first series to the system</p>
                                <button class="control-btn primary" id="create_new_empty_table">
                                    <i class="fas fa-plus-circle"></i>
                                    Add New Series
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
            data.forEach(function(series, index) {
                const status = series.status == 1 ? 'active' : 'inactive';
                const statusLabel = series.status == 1 ? 'Active' : 'Inactive';
                const typeLabel = series.type == 0 ? 'Pacific' : (series.type == 1 ? 'Liberty' : 'Stronghold');
                const createdDate = new Date(series.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

                html += `
                    <tr data-status="${status}" data-id="${series.id}">
                        <td class="text-center">${index + 1}</td>
                        <td><strong>${series.name}</strong></td>
                        <td>${series.range_start}</td>
                        <td>${series.range_stop}</td>
                        <td>${typeLabel}</td>
                        <td class="text-center">
                            <span class="status-badge ${status}">${statusLabel}</span>
                        </td>
                        <td>${createdDate}</td>
                        <td>
                            <div class="action-dropdown">
                                <button class="action-btn">
                                    <i class="fas fa-ellipsis-v"></i>
                                    Actions
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item view_data" data-id="${series.id}">
                                        <i class="fas fa-eye"></i>
                                        View
                                    </a>
                                    <div class="dropdown-divider"></div>
                                    <button class="dropdown-item edit_data" data-id="${series.id}">
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </button>
                                    <div class="dropdown-divider"></div>
                                    <button class="dropdown-item delete_data" data-id="${series.id}">
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
                if (confirm('Are you sure you want to delete this series?')) {
                    deleteSeries(id);
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
                    $('.action-dropdown .dropdown-menu').removeClass('show');
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
                if (confirm('Are you sure you want to delete this series?')) {
                    deleteSeries(id);
                }
            });
        }

        // Open Create Modal
        window.openCreateModal = function() {
            currentMode = 'create';
            $('#modalTitle').text('Create New Series');
            $('#submitBtn').html('<i class="fas fa-save"></i> Save Series');
            $('#formMethod').val('POST');
            $('#seriesForm').attr('action', '{{ route("series.store") }}');
            $('#seriesForm')[0].reset();
            $('.error-message').text('');
            $('.form-control').removeClass('error');
            $('#viewOnlyGroup').hide();
            $('#seriesForm').show();

            // Show modal with animation
            $('#seriesModal, #modalOverlay').show();

            // GSAP Animation
            gsap.fromTo('#modalOverlay',
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );

            gsap.fromTo('#seriesModal',
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
            const series = seriesData.find(s => s.id == id);

            if (!series) return;

            $('#modalTitle').text('Edit Series');
            $('#submitBtn').html('<i class="fas fa-save"></i> Update Series');
            $('#formMethod').val('PUT');
            $('#seriesForm').attr('action', '/series/' + id);

            $('#name').val(series.name);
            $('#range_start').val(series.range_start);
            $('#range_stop').val(series.range_stop);
            $('#type').val(series.type);
            $('#status').val(series.status);

            $('.error-message').text('');
            $('.form-control').removeClass('error');
            $('#viewOnlyGroup').hide();
            $('#seriesForm').show();

            // Show modal with animation
            $('#seriesModal, #modalOverlay').show();

            // GSAP Animation
            gsap.fromTo('#modalOverlay',
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );

            gsap.fromTo('#seriesModal',
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
            const series = seriesData.find(s => s.id == id);

            if (!series) return;

            $('#modalTitle').text('View Series Details');
            $('#submitBtn').html('<i class="fas fa-edit"></i> Edit').attr('type', 'button');
            $('#submitBtn').off().on('click', function() {
                // Close current modal
                gsap.to('#seriesModal', {
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

            $('#name').val(series.name).attr('readonly', true);
            $('#range_start').val(series.range_start).attr('readonly', true);
            $('#range_stop').val(series.range_stop).attr('readonly', true);
            $('#type').val(series.type).attr('disabled', true);
            $('#status').val(series.status).attr('disabled', true);

            $('#createdDateDisplay').text(new Date(series.created_at).toLocaleString());

            $('.error-message').text('');
            $('.form-control').removeClass('error');
            $('#viewOnlyGroup').show();
            $('#seriesForm').show();

            // Show modal with animation
            $('#seriesModal, #modalOverlay').show();

            // GSAP Animation
            gsap.fromTo('#modalOverlay',
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );

            gsap.fromTo('#seriesModal',
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
        window.closeSeriesModal = function() {
            // GSAP close animation
            gsap.to('#modalOverlay', {
                opacity: 0,
                duration: 0.3,
                onComplete: function() {
                    $('#modalOverlay').hide();
                }
            });

            gsap.to('#seriesModal', {
                opacity: 0,
                scale: 0.9,
                y: -50,
                duration: 0.3,
                ease: 'back.in',
                onComplete: function() {
                    $('#seriesModal').hide();
                    $('#seriesForm')[0].reset();
                    $('.form-control').removeAttr('readonly').removeAttr('disabled');
                    $('.error-message').text('');
                }
            });
        };

        // Submit Series Form
        function submitSeriesForm() {
            if (currentMode === 'view') return;

            const url = $('#seriesForm').attr('action');
            const method = $('#formMethod').val();

            const formData = {
                name: $('#name').val(),
                range_start: $('#range_start').val(),
                range_stop: $('#range_stop').val(),
                type: $('#type').val(),
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
                    loadSeries();
                    closeSeriesModal();
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

        // Delete Series
        function deleteSeries(id) {
            $.ajax({
                url: '/series/' + id,
                type: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function() {
                    loadStats();
                    loadSeries();
                    alert('Series deleted successfully');
                },
                error: function(xhr) {
                    console.error('Error:', xhr);
                    if (xhr.status === 419) {
                        alert('Error: Session expired. Please refresh the page and try again.');
                        location.reload();
                    } else {
                        alert('Error deleting series');
                    }
                }
            });
        }

        // Show Series Details (COC numbers)
        window.showSeries = function(seriesId) {
            if (!seriesId) {
                alert('Please select a series first.');
                return;
            }

            // Hide series list views to avoid overlap
            $('#cardView').hide();
            $('#tableView').hide();
            $('#filteredEmptyState').hide();

            $('#series-table-placeholder').show();
            $('#series-table-container').hide();

            fetch(`/series/api/getseries?id=${seriesId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // Parse JSON response
                })
                .then(data => {
                    // Build HTML table from JSON data
                    let html = `
                        <style>
                            .series-container {
                                max-width: 100%;
                                overflow-x: auto;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #fff;
                                border-radius: 10px;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                            }

                            .series-table {
                                width: 100%;
                                border-collapse: separate;
                                border-spacing: 0;
                                font-size: 14px;
                                margin-top: 15px;
                            }

                            .series-table th {
                                background-color: #f1f5f9;
                                color: #334155;
                                font-weight: 600;
                                padding: 12px 16px;
                                border-bottom: 2px solid #e2e8f0;
                                position: sticky;
                                top: 0;
                                text-align: left;
                            }

                            .series-table td {
                                padding: 12px 16px;
                                border-bottom: 1px solid #e2e8f0;
                                vertical-align: middle;
                                transition: background-color 0.2s;
                            }

                            .series-table tr:hover td {
                                background-color: #f8fafc;
                            }

                            .badge {
                                border-radius: 6px;
                                padding: 6px 10px;
                                font-weight: 600;
                                display: inline-block;
                                min-width: 80px;
                                text-align: center;
                                font-size: 13px;
                                letter-spacing: 0.5px;
                            }

                            .badge-issued {
                                background-color: #dcfce7;
                                color: #166534;
                                border: 1px solid #bbf7d0;
                            }

                            .badge-unissued {
                                background-color: #e2e8f0;
                                color: #475569;
                                border: 1px solid #cbd5e1;
                            }
                        </style>
                        <div class="series-container">
                            <table class="series-table">
                                <thead>
                                    <tr>
                                        <th>COC No</th>
                                        <th>Name</th>
                                        <th>Plate No</th>
                                        <th>Cost</th>
                                        <th>Policy Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>`;

                    if (data && data.length > 0) {
                        data.forEach(row => {
                            const statusClass = row.policy_status === 'Unallocated' ? 'badge-unissued' : 'badge-issued';
                            html += `
                                <tr>
                                    <td>${row.coc_no || 'N/A'}</td>
                                    <td>${row.name || 'N/A'}</td>
                                    <td>${row.plate_no || 'N/A'}</td>
                                    <td>${row.cost || 'N/A'}</td>
                                    <td><span class="badge ${statusClass}">${row.policy_status || 'N/A'}</span></td>
                                    <td>${row.date || 'N/A'}</td>
                                </tr>`;
                        });
                    } else {
                        html += `
                            <tr>
                                <td colspan="6" style="text-align: center; padding: 40px;">
                                    <div class="empty-state">
                                        <div class="empty-icon">
                                            <i class="fas fa-list-ol"></i>
                                        </div>
                                        <h3>No Series Data Found</h3>
                                        <p>No data available for this series.</p>
                                    </div>
                                </td>
                            </tr>`;
                    }

                    html += `
                                </tbody>
                            </table>
                        </div>`;

                    $('#series-table-content').html(html);
                    $('#series-table-placeholder').hide();
                    $('#series-table-container').show();

                    // Update last updated timestamp
                    const now = new Date();
                    $('#last-updated').text('Last updated: ' + now.toLocaleTimeString());
                })
                .catch(error => {
                    console.error('Error fetching series data:', error);
                    $('#series-table-content').html(`
                        <div class="alert alert-danger">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            Failed to fetch series data. Please try again later.
                        </div>
                    `);
                    $('#series-table-placeholder').hide();
                    $('#series-table-container').show();
                });
        };
    });
</script>
@endsection