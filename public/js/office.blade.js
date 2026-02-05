// Set default CSRF token for all AJAX requests
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {
    let officesData = [];
    let filteredData = [];
    let currentView = 'cards';
    let currentMode = 'create'; // create, edit, view

    // Load initial data
    loadStats();
    loadOffices();

    // Load Data Button
    $('#loadDataBtn').on('click', function() {
        loadOffices();
    });

    // Create New Office
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
    $('#officeForm').on('submit', function(e) {
        e.preventDefault();
        submitOfficeForm();
    });

    // Load Stats
    function loadStats() {
        $.ajax({
            url: window.officeRoutes.stats,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                $('#totalOffices').text(data.total);
                $('#activeOffices').text(data.active);
                $('#inactiveOffices').text(data.inactive);
            }
        });
    }

    // Load Offices
    function loadOffices() {
        $.ajax({
            url: window.officeRoutes.data,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                officesData = response.data || [];
                filteredData = officesData;
                renderCards(filteredData);
                renderTable(filteredData);
            },
            error: function() {
                console.log('Error loading offices');
            }
        });
    }

    // Apply Filter
    function applyFilter(status) {
        if (status === 'all') {
            filteredData = officesData;
        } else if (status === 'active') {
            filteredData = officesData.filter(c => c.status == 1);
        } else if (status === 'inactive') {
            filteredData = officesData.filter(c => c.status == 0);
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
                        <i class="fas fa-building"></i>
                    </div>
                    <h3>No Offices Found</h3>
                    <p>Get started by adding your first office to the system</p>
                </div>
            `);
            return;
        }
        let html = '';
        data.forEach(function(office, index) {
            const status = office.status == 1 ? 'active' : 'inactive';
            const statusLabel = office.status == 1 ? 'Active' : 'Inactive';
            const createdDate = new Date(office.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            html += `
                <div class="office-card" data-status="${status}" data-id="${office.id}">
                    <div class="card-header">
                        <div class="office-meta">
                            <span class="office-id">Office #${office.id}</span>
                            <span class="office-date">${createdDate}</span>
                        </div>
                        <div class="status-badge ${status}">
                            ${statusLabel}
                        </div>
                    </div>

                    <div class="card-body">
                        <h3 class="office-name">${office.office_name}</h3>
                        <div class="office-details">
                            <div class="detail-row">
                                <span class="detail-label">Address:</span>
                                <span class="detail-value">${office.office_address}</span>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer">
                        <div class="action-buttons">
                            <button disabled class="action-btn-small view view_data" data-id="${office.id}">
                                <i class="fas fa-eye"></i>
                                View
                            </button>
                            ${window.userPermissions > 0 ? `<button class="action-btn-small edit edit_data" data-id="${office.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>` : ''}
                            ${window.userPermissions === 1 ? `<button class="action-btn-small delete delete_data" data-id="${office.id}">
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
        if (data.length === 0) {
            $('#tableBody').html(`
                <tr>
                    <td colspan="5">
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i class="fas fa-building"></i>
                            </div>
                            <h3>No Offices Found</h3>
                            <p>Get started by adding your first office to the system</p>
                            <button class="control-btn primary" id="create_new_empty_table">
                                <i class="fas fa-plus-circle"></i>
                                Add New Office
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
        data.forEach(function(office, index) {
            const status = office.status == 1 ? 'active' : 'inactive';
            const statusLabel = office.status == 1 ? 'Active' : 'Inactive';
            const createdDate = new Date(office.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            html += `
                <tr data-status="${status}" data-id="${office.id}">
                    <td class="text-center">${office.id}</td>
                    <td><strong>${office.office_name}</strong></td>
                    <td>${office.office_address}</td>
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
                                <a class="dropdown-item view_data" data-id="${office.id}">
                                    <i class="fas fa-eye"></i>
                                    View
                                </a>
                                ${window.userPermissions > 0 ? `<div class="dropdown-divider"></div>
                                <button class="dropdown-item edit_data" data-id="${office.id}">
                                    <i class="fas fa-edit"></i>
                                    Edit
                                </button>` : ''}
                                ${window.userPermissions === 1 ? `<div class="dropdown-divider"></div>
                                <button class="dropdown-item delete_data" data-id="${office.id}">
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
            if (confirm('Are you sure you want to delete this office?')) {
                deleteOffice(id);
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
            if (confirm('Are you sure you want to delete this office?')) {
                deleteOffice(id);
            }
        });
    }

    // Open Create Modal
    window.openCreateModal = function() {
        currentMode = 'create';
        $('#modalTitle').text('Create New Office');
        $('#submitBtn').html('<i class="fas fa-save"></i> Save Office');
        $('#formMethod').val('POST');
        $('#officeForm').attr('action', window.officeRoutes.store);
        $('#officeForm')[0].reset();
        $('.error-message').text('');
        $('.form-control').removeClass('error');
        $('#viewOnlyGroup').hide();
        $('#officeForm').show();

        // Show modal with animation
        $('#officeModal, #modalOverlay').show();

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#officeModal',
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
        const office = officesData.find(c => c.id == id);

        if (!office) return;

        $('#modalTitle').text('Edit Office');
        $('#submitBtn').html('<i class="fas fa-save"></i> Update Office');
        $('#formMethod').val('PUT');
        $('#officeForm').attr('action', window.officeRoutes.base + id);

        $('#office_name').val(office.office_name);
        $('#office_address').val(office.office_address);
        $('#status').val(office.status);

        $('.error-message').text('');
        $('.form-control').removeClass('error');
        $('#viewOnlyGroup').hide();
        $('#officeForm').show();

        // Show modal with animation
        $('#officeModal, #modalOverlay').show();

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#officeModal',
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
        const office = officesData.find(c => c.id == id);

        if (!office) return;

        $('#modalTitle').text('View Office Details');
        $('#submitBtn').html('<i class="fas fa-edit"></i> Edit').attr('type', 'button');
        $('#submitBtn').off().on('click', function() {
            // Close current modal
            gsap.to('#officeModal', {
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

        $('#office_name').val(office.office_name).attr('readonly', true);
        $('#office_address').val(office.office_address).attr('readonly', true);
        $('#status').val(office.status).attr('disabled', true);

        $('#createdDateDisplay').text(new Date(office.created_at).toLocaleString());

        $('.error-message').text('');
        $('.form-control').removeClass('error');
        $('#viewOnlyGroup').show();
        $('#officeForm').show();

        // Show modal with animation
        $('#officeModal, #modalOverlay').show();

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#officeModal',
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
    window.closeOfficeModal = function() {
        // GSAP close animation
        gsap.to('#modalOverlay', {
            opacity: 0,
            duration: 0.3,
            onComplete: function() {
                $('#modalOverlay').hide();
            }
        });

        gsap.to('#officeModal', {
            opacity: 0,
            scale: 0.9,
            y: -50,
            duration: 0.3,
            ease: 'back.in',
            onComplete: function() {
                $('#officeModal').hide();
                $('#officeForm')[0].reset();
                $('.form-control').removeAttr('readonly').removeAttr('disabled');
                $('.error-message').text('');
            }
        });
    };

    // Submit Office Form
    function submitOfficeForm() {
        if (currentMode === 'view') return;

        const url = $('#officeForm').attr('action');
        const method = $('#formMethod').val();

        const formData = {
            office_name: $('#office_name').val(),
            office_address: $('#office_address').val(),
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
                loadOffices();
                closeOfficeModal();
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

    // Delete Office
    function deleteOffice(id) {
        $.ajax({
            url: window.officeRoutes.base + id,
            type: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function() {
                loadStats();
                loadOffices();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Office has been deleted successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            },
            error: function(xhr) {
                console.error('Error:', xhr);
                if (xhr.status === 419) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Session expired. Please refresh the page and try again.',
                        icon: 'error'
                    });
                    location.reload();
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Error deleting office',
                        icon: 'error'
                    });
                }
            }
        });
    }
});
