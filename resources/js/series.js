// Series Management JavaScript - Vite Compatible
import { gsap } from 'gsap';
import Swal from 'sweetalert2';

// Use global jQuery and select2 from CDN (loaded in app.blade.php)
const $ = window.jQuery;

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

    // Initialize Select2 for the series dropdown
    $('.js-example-basic-single').select2({
        width: '100%',
        placeholder: 'Select a policy series to view details...',
        allowClear: true
    });

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
            url: window.seriesRoutes.stats,
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
            url: window.seriesRoutes.data,
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
            
            // Only show office name for super admin (id=1 and office_id=0)
            const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
            const officeName = series.office ? series.office.office_name : 'N/A';
            const officeDisplay = isSuperAdmin ? `
                <div class="detail-row">
                    <span class="detail-label">Office:</span>
                    <span class="detail-value">${officeName}</span>
                </div>
            ` : '';

            html += `
                <div class="series-card" data-status="${status}" data-office="${officeName}" data-id="${series.id}">
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
                            ${officeDisplay}
                        </div>
                    </div>

                    <div class="card-footer">
                        <div class="action-buttons">
                            <button class="action-btn-small view view_data" data-id="${series.id}">
                                <i class="fas fa-eye"></i>
                                View
                            </button>
                            ${window.userPermissions > 0 ? `<button class="action-btn-small edit edit_data" data-id="${series.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>` : ''}
                            ${window.userPermissions === 1 ? `<button class="action-btn-small delete delete_data" data-id="${series.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>` : ''}
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
        // Only show office name for super admin (id=1 and office_id=0)
        const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
        
        if (data.length === 0) {
            const colspan = isSuperAdmin ? 9 : 8;
            $('#tableBody').html(`
                <tr>
                    <td colspan="${colspan}">
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
            
            const officeName = series.office ? series.office.office_name : 'N/A';
            const officeDisplay = isSuperAdmin ? `<td>${officeName}</td>` : '';

            html += `
                <tr data-status="${status}" data-office="${officeName}" data-id="${series.id}">
                    <td class="text-center">${index + 1}</td>
                    <td><strong>${series.name}</strong></td>
                    <td>${series.range_start}</td>
                    <td>${series.range_stop}</td>
                    <td>${typeLabel}</td>
                    <td class="text-center">
                        <span class="status-badge ${status}">${statusLabel}</span>
                    </td>
                    <td>${createdDate}</td>
                    ${officeDisplay}
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
                            ${window.userPermissions > 0 ? `<div class="dropdown-divider"></div>
                            <button class="dropdown-item edit_data" data-id="${series.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>` : ''}
                            ${window.userPermissions === 1 ? `<div class="dropdown-divider"></div>
                            <button class="dropdown-item delete_data" data-id="${series.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>` : ''}
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
            Swal.fire({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteSeries(id);
                }
            });
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
            Swal.fire({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteSeries(id);
                }
            });
        });
    }

    // Open Create Modal
    window.openCreateModal = function() {
        currentMode = 'create';
        $('#modalTitle').text('Create New Series');
        $('#submitBtn').html('<i class="fas fa-save"></i> Save Series');
        $('#formMethod').val('POST');
        $('#seriesForm').attr('action', window.seriesRoutes.store);
        $('#seriesForm')[0].reset();
        $('.error-message').text('');
        $('.form-control').removeClass('error');
        $('#viewOnlyGroup').hide();
        $('#seriesForm').show();

        // Show office dropdown for superadmin in create mode
        const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
        if (isSuperAdmin) {
            $('#officeSelectGroup').show();
        }

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

        // Hide office dropdown in edit mode - office_id should not be changed
        $('#officeSelectGroup').hide();

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
        
        // Hide submit button in view mode - only show Close button
        $('#submitBtn').hide();

        // Add view-only styling to all form fields
        $('#name').val(series.name).attr('readonly', true).addClass('view-only-field');
        $('#range_start').val(series.range_start).attr('readonly', true).addClass('view-only-field');
        $('#range_stop').val(series.range_stop).attr('readonly', true).addClass('view-only-field');
        $('#type').val(series.type).attr('disabled', true).addClass('view-only-select');
        $('#status').val(series.status).attr('disabled', true).addClass('view-only-select');

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
                $('.form-control').removeClass('view-only-field view-only-select');
                $('.error-message').text('');
                // Show submit button again for create/edit modes
                $('#submitBtn').show().attr('type', 'submit').off('click');
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

        // Add office_id for superadmin when creating (only in create mode)
        const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
        if (isSuperAdmin && currentMode === 'create') {
            const officeId = $('#office_id').val();
            if (officeId) {
                formData.office_id = officeId;
            }
        }

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
                Swal.fire({
                    title: 'Success!',
                    text: response.message || 'Operation successful',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
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
                    Swal.fire({
                        title: 'Validation Error!',
                        text: 'Please check the form fields',
                        icon: 'error'
                    });
                } else if (xhr.status === 419) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Session expired. Please refresh the page and try again.',
                        icon: 'error'
                    });
                    location.reload();
                } else if (xhr.status === 404) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Route not found. Please check your routes configuration.',
                        icon: 'error'
                    });
                } else if (xhr.responseJSON && xhr.responseJSON.error) {
                    Swal.fire({
                        title: 'Error!',
                        text: xhr.responseJSON.error,
                        icon: 'error'
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: xhr.status + ' - ' + xhr.statusText,
                        icon: 'error'
                    });
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
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Series has been deleted successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
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
            Swal.fire({
                title: 'Warning!',
                text: 'Please select a series first.',
                icon: 'warning'
            });
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
