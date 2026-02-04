// Set default CSRF token for all AJAX requests
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {
    let usersData = [];
    let filteredData = [];
    let currentView = 'cards';
    let currentMode = 'create'; // create, edit, view

    // Function to get office name by ID
    function getOfficeName(officeId) {
        if (!officeId) return 'N/A';
        const office = window.offices.find(o => o.id == officeId);
        return office ? office.office_name : 'N/A';
    }

    // Load initial data
    loadStats();
    loadUsers();

    // Load Data Button
    $('#loadDataBtn').on('click', function() {
        loadUsers();
    });

    // Create New User
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

        // Remove all view classes and reset to default
        $('#cardView').removeClass('active cards-view grid-view list-view').addClass('users-grid');

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
    $('#userForm').on('submit', function(e) {
        e.preventDefault();
        submitUserForm();
    });

    // Load Stats
    function loadStats() {
        $.ajax({
            url: window.userRoutes.stats,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                $('#totalUsers').text(data.total);
                $('#activeUsers').text(data.active);
                $('#inactiveUsers').text(data.inactive);
            }
        });
    }

    // Load Users
    function loadUsers() {
        $.ajax({
            url: window.userRoutes.data,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                usersData = response.data || [];
                filteredData = usersData;
                renderCards(filteredData);
                renderTable(filteredData);
            },
            error: function() {
                console.log('Error loading users');
            }
        });
    }

    // Apply Filter
    function applyFilter(status) {
        if (status === 'all') {
            filteredData = usersData;
        } else if (status === 'active') {
            filteredData = usersData.filter(u => u.status == 1);
        } else if (status === 'inactive') {
            filteredData = usersData.filter(u => u.status == 0);
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
                    <h3>No Users Found</h3>
                    <p>Get started by adding your first user to the system</p>
                </div>
            `);
            return;
        }
        let html = '';
        data.forEach(function(user, index) {
            const status = user.status == 1 ? 'active' : 'inactive';
            const statusLabel = user.status == 1 ? 'Verified' : 'Not Verified';
            const statusType = user.type == 1 ? 'Admin' : 'Staff';
            const fullName = user.firstname + ' ' + (user.middlename ? user.middlename + ' ' : '') + user.lastname;
            const email = user.email || '<span style="color: var(--gray);">No email</span>';
            const createdDate = new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            const permissionsText = user.permissions == 0 ? 'No Access' : (user.permissions == 1 ? 'Can Modify And Delete' : 'Can Modify Only');

            html += `
                <div class="user-card" data-status="${status}" data-id="${user.id}">
                    <div class="card-header">
                        <div class="user-meta">
                            <span class="user-id">User #${user.id}</span>
                            <span class="user-date">${createdDate}</span>
                        </div>
                        <div class="status-badge ${status}">
                            ${statusLabel}
                        </div>
                    </div>

                    <div class="card-body">
                        <h3 class="user-name">${fullName}</h3>
                        <div class="user-details">
                            <div class="detail-row">
                                <span class="detail-label">Username:</span>
                                <span class="detail-value">${user.username}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Email:</span>
                                <span class="detail-value">${email}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Type:</span>
                                <span class="detail-value">${statusType}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Permissions:</span>
                                <span class="detail-value">${permissionsText}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Credit:</span>
                                <span class="detail-value">${user.credit || 0}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Office:</span>
                                <span class="detail-value">${getOfficeName(user.office_id)}</span>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer">
                        <div class="action-buttons">
                            <button disabled class="action-btn-small view view_data" data-id="${user.id}">
                                <i class="fas fa-eye"></i>
                                View
                            </button>
                            <button class="action-btn-small edit edit_data" data-id="${user.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                            <button class="action-btn-small delete delete_data" data-id="${user.id}">
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
                    <td colspan="10">
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <h3>No Users Found</h3>
                            <p>Get started by adding your first user to the system</p>
                            <button class="control-btn primary" id="create_new_empty_table">
                                <i class="fas fa-plus-circle"></i>
                                Add New User
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
        data.forEach(function(user, index) {
            const status = user.status == 1 ? 'active' : 'inactive';
            const statusLabel = user.status == 1 ? 'Verified' : 'Not Verified';
            const fullName = user.firstname + ' ' + (user.middlename ? user.middlename + ' ' : '') + user.lastname;
            const email = user.email || '<span style="color: var(--gray);">No email</span>';
            const createdDate = new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            const permissionsText = user.permissions == 0 ? 'No Access' : (user.permissions == 1 ? 'Can Modify' : 'Can Print');

            html += `
                <tr data-status="${status}" data-id="${user.id}">
                    <td class="text-center">${user.id}</td>
                    <td><strong>${fullName}</strong></td>
                    <td>${user.username}</td>
                    <td>${email}</td>
                    <td>${user.type}</td>
                    <td class="text-center">
                        <span class="status-badge ${status}">${statusLabel}</span>
                    </td>
                    <td>${permissionsText}</td>
                    <td>${user.credit || 0}</td>
                    <td>${getOfficeName(user.office_id)}</td>
                    <td>
                        <div class="action-dropdown">
                            <button class="action-btn">
                                <i class="fas fa-ellipsis-v"></i>
                                Actions
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item view_data" data-id="${user.id}">
                                    <i class="fas fa-eye"></i>
                                    View
                                </a>
                                <div class="dropdown-divider"></div>
                                <button class="dropdown-item edit_data" data-id="${user.id}">
                                    <i class="fas fa-edit"></i>
                                    Edit
                                </button>
                                <div class="dropdown-divider"></div>
                                <button class="dropdown-item delete_data" data-id="${user.id}">
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
            if (confirm('Are you sure you want to delete this user?')) {
                deleteUser(id);
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
            if (confirm('Are you sure you want to delete this user?')) {
                deleteUser(id);
            }
        });
    }

    // Open Create Modal
    window.openCreateModal = function() {
        currentMode = 'create';
        $('#modalTitle').text('Create New User');
        $('#submitBtn').html('<i class="fas fa-save"></i> Save User');
        $('#formMethod').val('POST');
        $('#userForm').attr('action', window.userRoutes.store);
        $('#userForm')[0].reset();
        $('.error-message').text('');
        $('.form-control').removeClass('error');
        $('#viewOnlyGroup').hide();
        $('#userForm').show();

        // Show modal with animation
        $('#userModal, #modalOverlay').show();

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#userModal',
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
        const user = usersData.find(u => u.id == id);

        if (!user) return;

        $('#modalTitle').text('Edit User');
        $('#submitBtn').html('<i class="fas fa-save"></i> Update User');
        $('#formMethod').val('PUT');
        $('#userForm').attr('action', window.userRoutes.base + id);

        $('#firstname').val(user.firstname);
        $('#middlename').val(user.middlename);
        $('#lastname').val(user.lastname);
        $('#username').val(user.username);
        $('#email').val(user.email);
        $('#password').val(''); // Don't prefill password
        $('#avatar').val(user.avatar);
        $('#type').val(user.type);
        $('#status').val(user.status);
        $('#permissions').val(user.permissions);
        $('#credit').val(user.credit);
        $('#office').val(user.office_id);

        $('.error-message').text('');
        $('.form-control').removeClass('error');
        $('#viewOnlyGroup').hide();
        $('#userForm').show();

        // Show modal with animation
        $('#userModal, #modalOverlay').show();

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#userModal',
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
        const user = usersData.find(u => u.id == id);

        if (!user) return;

        $('#modalTitle').text('View User Details');
        $('#submitBtn').html('<i class="fas fa-edit"></i> Edit').attr('type', 'button');
        $('#submitBtn').off().on('click', function() {
            // Close current modal
            gsap.to('#userModal', {
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

        $('#firstname').val(user.firstname).attr('readonly', true);
        $('#middlename').val(user.middlename).attr('readonly', true);
        $('#lastname').val(user.lastname).attr('readonly', true);
        $('#username').val(user.username).attr('readonly', true);
        $('#email').val(user.email).attr('readonly', true);
        $('#password').val('').attr('readonly', true);
        $('#avatar').val(user.avatar).attr('readonly', true);
        $('#type').val(user.type).attr('readonly', true);
        $('#status').val(user.status).attr('disabled', true);
        $('#permissions').val(user.permissions).attr('disabled', true);
        $('#credit').val(user.credit).attr('readonly', true);

        $('#createdDateDisplay').text(new Date(user.created_at).toLocaleString());

        $('.error-message').text('');
        $('.form-control').removeClass('error');
        $('#viewOnlyGroup').show();
        $('#userForm').show();

        // Show modal with animation
        $('#userModal, #modalOverlay').show();

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#userModal',
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
    window.closeUserModal = function() {
        // GSAP close animation
        gsap.to('#modalOverlay', {
            opacity: 0,
            duration: 0.3,
            onComplete: function() {
                $('#modalOverlay').hide();
            }
        });

        gsap.to('#userModal', {
            opacity: 0,
            scale: 0.9,
            y: -50,
            duration: 0.3,
            ease: 'back.in',
            onComplete: function() {
                $('#userModal').hide();
                $('#userForm')[0].reset();
                $('.form-control').removeAttr('readonly').removeAttr('disabled');
                $('.error-message').text('');
            }
        });
    };

    // Submit User Form
    function submitUserForm() {
        if (currentMode === 'view') return;

        const url = $('#userForm').attr('action');
        const method = $('#formMethod').val();

        const formData = {
            firstname: $('#firstname').val(),
            middlename: $('#middlename').val(),
            lastname: $('#lastname').val(),
            username: $('#username').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            avatar: $('#avatar').val(),
            type: $('#type').val(),
            status: $('#status').val(),
            permissions: $('#permissions').val(),
            credit: $('#credit').val(),
            office_id: $('#office').val(),
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
                loadUsers();
                closeUserModal();
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

    // Delete User
    function deleteUser(id) {
        $.ajax({
            url: window.userRoutes.base + id,
            type: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function() {
                loadStats();
                loadUsers();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'User has been deleted successfully.',
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
                        text: 'Error deleting user',
                        icon: 'error'
                    });
                }
            }
        });
    }
});
