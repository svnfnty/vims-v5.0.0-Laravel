// Set default CSRF token for all AJAX requests
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {
    let walkinsData = [];
    let filteredData = [];
    let currentView = 'cards';
    let currentMode = 'create'; // create, edit, view

    // Load initial data
    loadStats();
    loadWalkins();

    // Load Data Button
    $('#loadDataBtn').on('click', function() {
        loadWalkins();
    });

    // Create New Walkin
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
    $('#walkinForm').on('submit', function(e) {
        e.preventDefault();
        submitWalkinForm();
    });

    // Load Stats
    function loadStats() {
        $.ajax({
            url: window.walkinRoutes.stats,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                $('#totalWalkins').text(data.total);
                $('#activeWalkins').text(data.active);
                $('#inactiveWalkins').text(data.inactive);
            }
        });
    }

    // Load Walkins
    function loadWalkins() {
        $.ajax({
            url: window.walkinRoutes.data,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                walkinsData = response.data || [];
                filteredData = walkinsData;
                renderCards(filteredData);
                renderTable(filteredData);
            },
            error: function() {
                console.log('Error loading walkins');
            }
        });
    }

    // Apply Filter
    function applyFilter(status) {
        if (status === 'all') {
            filteredData = walkinsData;
        } else if (status === 'active') {
            filteredData = walkinsData.filter(c => c.status == 1);
        } else if (status === 'inactive') {
            filteredData = walkinsData.filter(c => c.status == 0);
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
                    <h3>No Walkins Found</h3>
                    <p>Get started by adding your first walkin to the system</p>
                </div>
            `);
            return;
        }
        let html = '';
        data.forEach(function(walkin, index) {
            const status = walkin.status == 1 ? 'active' : 'inactive';
            const statusLabel = walkin.status == 1 ? 'Active' : 'Inactive';
            const email = walkin.email || '<span style="color: var(--gray);">No email</span>';
            const createdDate = new Date(walkin.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            html += `
                <div class="walkin-card" data-status="${status}" data-id="${walkin.id}">
                    <div class="card-header">
                        <div class="walkin-meta">
                            <span class="walkin-id">Walkin #${walkin.id}</span>
                            <span class="walkin-date">${createdDate}</span>
                        </div>
                        <div class="status-badge ${status}">
                            ${statusLabel}
                        </div>
                    </div>

                    <div class="card-body">
                        <h3 class="walkin-name">${walkin.name}</h3>
                        <div class="walkin-details">
                            <div class="detail-row">
                                <span class="detail-label">Email:</span>
                                <span class="detail-value">${email}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Account ID:</span>
                                <span class="detail-value">${walkin.accountID}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Color:</span>
                                <span class="detail-value">${walkin.color}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Description:</span>
                                <span class="detail-value">${walkin.description}</span>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer">
                        <div class="action-buttons">
                            <button disabled class="action-btn-small view view_data" data-id="${walkin.id}">
                                <i class="fas fa-eye"></i>
                                View
                            </button>
                            <button class="action-btn-small edit edit_data" data-id="${walkin.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                            <button class="action-btn-small delete delete_data" data-id="${walkin.id}">
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
                    <td colspan="9">
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <h3>No Walkins Found</h3>
                            <p>Get started by adding your first walkin to the system</p>
                            <button class="control-btn primary" id="create_new_empty_table">
                                <i class="fas fa-plus-circle"></i>
                                Add New Walkin
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
        data.forEach(function(walkin, index) {
            const status = walkin.status == 1 ? 'active' : 'inactive';
            const statusLabel = walkin.status == 1 ? 'Active' : 'Inactive';
            const email = walkin.email || '<span style="color: var(--gray);">No email</span>';
            const createdDate = new Date(walkin.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            html += `
                <tr data-status="${status}" data-id="${walkin.id}">
                    <td class="text-center">${walkin.id}</td>
                    <td>${email}</td>
                    <td>${walkin.accountID}</td>
                    <td><strong>${walkin.name}</strong></td>
                    <td>${walkin.color}</td>
                    <td class="text-center">
                        <span class="status-badge ${status}">${statusLabel}</span>
                    </td>
                    <td>${walkin.description}</td>
                    <td>${walkin.office_id}</td>
                    <td>
                        <div class="action-dropdown">
                            <button class="action-btn">
                                <i class="fas fa-ellipsis-v"></i>
                                Actions
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item view_data" data-id="${walkin.id}">
                                    <i class="fas fa-eye"></i>
                                    View
                                </a>
                                <div class="dropdown-divider"></div>
                                <button class="dropdown-item edit_data" data-id="${walkin.id}">
                                    <i class="fas fa-edit"></i>
                                    Edit
                                </button>
                                <div class="dropdown-divider"></div>
                                <button class="dropdown-item delete_data" data-id="${walkin.id}">
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
            if (confirm('Are you sure you want to delete this walkin?')) {
                deleteWalkin(id);
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
            if (confirm('Are you sure you want to delete this walkin?')) {
                deleteWalkin(id);
            }
        });
    }

    // Open Create Modal
    window.openCreateModal = function() {
        currentMode = 'create';
        $('#modalTitle').text('Create New Walkin');
        $('#submitBtn').html('<i class="fas fa-save"></i> Save Walkin');
        $('#formMethod').val('POST');
        $('#walkinForm').attr('action', window.walkinRoutes.store);
        $('#walkinForm')[0].reset();
        $('.error-message').text('');
        $('.form-control').removeClass('error');
        $('#viewOnlyGroup').hide();
        $('#walkinForm').show();

        // Show modal with animation
        $('#walkinModal, #modalOverlay').show();

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#walkinModal',
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
        const walkin = walkinsData.find(c => c.id == id);

        if (!walkin) return;

        $('#modalTitle').text('Edit Walkin');
        $('#submitBtn').html('<i class="fas fa-save"></i> Update Walkin');
        $('#formMethod').val('PUT');
        $('#walkinForm').attr('action', window.walkinRoutes.base + id);

        $('#email').val(walkin.email);
        $('#accountID').val(walkin.accountID);
        $('#name').val(walkin.name);
        $('#color').val(walkin.color);
        $('#description').val(walkin.description);
        $('#status').val(walkin.status);

        $('.error-message').text('');
        $('.form-control').removeClass('error');
        $('#viewOnlyGroup').hide();
        $('#walkinForm').show();

        // Show modal with animation
        $('#walkinModal, #modalOverlay').show();

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#walkinModal',
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
        const walkin = walkinsData.find(c => c.id == id);

        if (!walkin) return;

        $('#modalTitle').text('View Walkin Details');
        $('#submitBtn').html('<i class="fas fa-edit"></i> Edit').attr('type', 'button');
        $('#submitBtn').off().on('click', function() {
            // Close current modal
            gsap.to('#walkinModal', {
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

        $('#email').val(walkin.email).attr('readonly', true);
        $('#accountID').val(walkin.accountID).attr('readonly', true);
        $('#name').val(walkin.name).attr('readonly', true);
        $('#color').val(walkin.color).attr('readonly', true);
        $('#description').val(walkin.description).attr('readonly', true);
        $('#office_id').val(walkin.office_id).attr('readonly', true);
        $('#status').val(walkin.status).attr('disabled', true);

        $('#createdDateDisplay').text(new Date(walkin.created_at).toLocaleString());

        $('.error-message').text('');
        $('.form-control').removeClass('error');
        $('#viewOnlyGroup').show();
        $('#walkinForm').show();

        // Show modal with animation
        $('#walkinModal, #modalOverlay').show();

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#walkinModal',
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
    window.closeWalkinModal = function() {
        // GSAP close animation
        gsap.to('#modalOverlay', {
            opacity: 0,
            duration: 0.3,
            onComplete: function() {
                $('#modalOverlay').hide();
            }
        });

        gsap.to('#walkinModal', {
            opacity: 0,
            scale: 0.9,
            y: -50,
            duration: 0.3,
            ease: 'back.in',
            onComplete: function() {
                $('#walkinModal').hide();
                $('#walkinForm')[0].reset();
                $('.form-control').removeAttr('readonly').removeAttr('disabled');
                $('.error-message').text('');
            }
        });
    };

    // Submit Walkin Form
    function submitWalkinForm() {
        if (currentMode === 'view') return;

        const url = $('#walkinForm').attr('action');
        const method = $('#formMethod').val();

        const formData = {
            email: $('#email').val(),
            accountID: $('#accountID').val(),
            name: $('#name').val(),
            color: $('#color').val(),
            description: $('#description').val(),
            office_id: $('#office_id').val(),
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
                loadWalkins();
                closeWalkinModal();
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

    // Delete Walkin
    function deleteWalkin(id) {
        $.ajax({
            url: window.walkinRoutes.base + id,
            type: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function() {
                loadStats();
                loadWalkins();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Walkin has been deleted successfully.',
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
                        text: 'Error deleting walkin',
                        icon: 'error'
                    });
                }
            }
        });
    }
});
