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
            url: window.routes.clientsStats,
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
            url: window.routes.clientsData,
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
                            <button disabled class="action-btn-small view view_data" data-id="${client.id}">
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
                    deleteClient(id);
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
                    deleteClient(id);
                }
            });
        });
    }

    // Open Create Modal
    window.openCreateModal = function() {
        currentMode = 'create';
        $('#modalTitle').text('Create New Client');
        $('#submitBtn').html('<i class="fas fa-save"></i> Save Client');
        $('#formMethod').val('POST');
        $('#clientForm').attr('action', window.routes.clientsStore);
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
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Client has been deleted successfully.',
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
                        text: 'Error deleting client',
                        icon: 'error'
                    });
                }
            }
        });
    }
});
