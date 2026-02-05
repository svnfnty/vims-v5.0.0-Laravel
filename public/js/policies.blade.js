// Set default CSRF token for all AJAX requests
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {
    let policiesData = [];
    let filteredData = [];
    let currentView = 'cards';
    let currentMode = 'create'; // create, edit, view

    // Load initial data
    loadStats();
    loadPolicies();

    // Load Data Button
    $('#loadDataBtn').on('click', function() {
        loadPolicies();
    });

    // Create New Policy
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
    $('#policyForm').on('submit', function(e) {
        e.preventDefault();
        submitPolicyForm();
    });

    // Load Stats
    function loadStats() {
        $.ajax({
            url: window.policiesRoutes.stats,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                $('#totalPolicies').text(data.total);
                $('#activePolicies').text(data.active);
                $('#inactivePolicies').text(data.inactive);
            }
        });
    }

    // Load Policies
    function loadPolicies() {
        $.ajax({
            url: window.policiesRoutes.data,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                policiesData = response.data || [];
                filteredData = policiesData;
                renderCards(filteredData);
                renderTable(filteredData);
            },
            error: function() {
                console.log('Error loading policies');
            }
        });
    }

    // Apply Filter
    function applyFilter(status) {
        if (status === 'all') {
            filteredData = policiesData;
        } else if (status === 'active') {
            filteredData = policiesData.filter(p => p.status == 1);
        } else if (status === 'inactive') {
            filteredData = policiesData.filter(p => p.status == 0);
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
                        <i class="fas fa-file-contract"></i>
                    </div>
                    <h3>No Policies Found</h3>
                    <p>Get started by adding your first policy to the system</p>
                </div>
            `);
            return;
        }
        let html = '';
        data.forEach(function(policy, index) {
            const status = policy.status == 1 ? 'active' : 'inactive';
            const statusLabel = policy.status == 1 ? 'Active' : 'Inactive';
            const categoryName = policy.category ? policy.category.name : 'N/A';
            const cost = policy.cost ? '₱' + parseFloat(policy.cost).toLocaleString() : 'N/A';
            const createdDate = new Date(policy.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            html += `
                <div class="policy-card" data-status="${status}" data-id="${policy.id}">
                    <div class="card-header">
                        <div class="policy-meta">
                            <span class="policy-id">Policy #${policy.id}</span>
                            <span class="policy-date">${createdDate}</span>
                        </div>
                        <div class="status-badge ${status}">
                            ${statusLabel}
                        </div>
                    </div>

                    <div class="card-body">
                        <h3 class="policy-name">${policy.name || 'N/A'}</h3>
                        <div class="policy-details">
                            <div class="detail-row">
                                <span class="detail-label">Code:</span>
                                <span class="detail-value">${policy.code || 'N/A'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Category:</span>
                                <span class="detail-value">${categoryName}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Cost:</span>
                                <span class="detail-value">${cost}</span>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer">
                        <div class="action-buttons">
                            <button disabled class="action-btn-small view view_data" data-id="${policy.id}">
                                <i class="fas fa-eye"></i>
                                View
                            </button>
                            ${window.userPermissions > 0 ? `<button class="action-btn-small edit edit_data" data-id="${policy.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>` : ''}
                            ${window.userPermissions === 1 ? `<button class="action-btn-small delete delete_data" data-id="${policy.id}">
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
                    <td colspan="8">
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i class="fas fa-file-contract"></i>
                            </div>
                            <h3>No Policies Found</h3>
                            <p>Get started by adding your first policy to the system</p>
                            <button class="control-btn primary" id="create_new_empty_table">
                                <i class="fas fa-plus-circle"></i>
                                Add New Policy
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
        data.forEach(function(policy, index) {
            const status = policy.status == 1 ? 'active' : 'inactive';
            const statusLabel = policy.status == 1 ? 'Active' : 'Inactive';
            const categoryName = policy.category ? policy.category.name : 'N/A';
            const cost = policy.cost ? '₱' + parseFloat(policy.cost).toLocaleString() : 'N/A';
            const createdDate = new Date(policy.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            html += `
                <tr data-status="${status}" data-id="${policy.id}">
                    <td class="text-center">${index + 1}</td>
                    <td>${createdDate}</td>
                    <td><strong>${policy.code || 'N/A'}</strong></td>
                    <td>${policy.name || 'N/A'}</td>
                    <td>${categoryName}</td>
                    <td>${cost}</td>
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
                                <a class="dropdown-item view_data" data-id="${policy.id}">
                                    <i class="fas fa-eye"></i>
                                    View
                                </a>
                                ${window.userPermissions > 0 ? `<div class="dropdown-divider"></div>
                                <button class="dropdown-item edit_data" data-id="${policy.id}">
                                    <i class="fas fa-edit"></i>
                                    Edit
                                </button>` : ''}
                                ${window.userPermissions === 1 ? `<div class="dropdown-divider"></div>
                                <button class="dropdown-item delete_data" data-id="${policy.id}">
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
                    deletePolicy(id);
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
                    deletePolicy(id);
                }
            });
        });
    }

    // Open Create Modal
    window.openCreateModal = function() {
        currentMode = 'create';
        $('#modalTitle').text('Create New Policy');
        $('#submitBtn').html('<i class="fas fa-save"></i> Save Policy');
        $('#formMethod').val('POST');
        $('#policyForm').attr('action', window.policiesRoutes.store);
        $('#policyForm')[0].reset();
        $('.error-message').text('');
        $('.form-control').removeClass('error');
        $('#viewOnlyGroup').hide();
        $('#policyForm').show();

        // Show modal with animation
        $('#policyModal, #modalOverlay').show();

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#policyModal',
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
        const policy = policiesData.find(p => p.id == id);

        if (!policy) return;

        $('#modalTitle').text('Edit Policy');
        $('#submitBtn').html('<i class="fas fa-save"></i> Update Policy');
        $('#formMethod').val('PUT');
        $('#policyForm').attr('action', '/policies/' + id);

        $('#category_id').val(policy.category_id);
        $('#code').val(policy.code);
        $('#name').val(policy.name);
        $('#description').val(policy.description);
        $('#description1').val(policy.description1);
        $('#description2').val(policy.description2);
        $('#duration').val(policy.duration);
        $('#third_party_liability').val(policy.third_party_liability);
        $('#personal_accident').val(policy.personal_accident);
        $('#tppd').val(policy.tppd);
        $('#documentary_stamps').val(policy.documentary_stamps);
        $('#value_added_tax').val(policy.value_added_tax);
        $('#local_gov_tax').val(policy.local_gov_tax);
        $('#cost').val(policy.cost);
        $('#doc_path').val(policy.doc_path);
        $('#status').val(policy.status);

        $('.error-message').text('');
        $('.form-control').removeClass('error');
        $('#viewOnlyGroup').hide();
        $('#policyForm').show();

        // Show modal with animation
        $('#policyModal, #modalOverlay').show();

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#policyModal',
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
        const policy = policiesData.find(p => p.id == id);

        if (!policy) return;

        $('#modalTitle').text('View Policy Details');
        $('#submitBtn').html('<i class="fas fa-edit"></i> Edit').attr('type', 'button');
        $('#submitBtn').off().on('click', function() {
            // Close current modal
            gsap.to('#policyModal', {
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

        $('#category_id').val(policy.category_id).attr('disabled', true);
        $('#code').val(policy.code).attr('readonly', true);
        $('#name').val(policy.name).attr('readonly', true);
        $('#description').val(policy.description).attr('readonly', true);
        $('#description1').val(policy.description1).attr('readonly', true);
        $('#description2').val(policy.description2).attr('readonly', true);
        $('#duration').val(policy.duration).attr('readonly', true);
        $('#third_party_liability').val(policy.third_party_liability).attr('readonly', true);
        $('#personal_accident').val(policy.personal_accident).attr('readonly', true);
        $('#tppd').val(policy.tppd).attr('readonly', true);
        $('#documentary_stamps').val(policy.documentary_stamps).attr('readonly', true);
        $('#value_added_tax').val(policy.value_added_tax).attr('readonly', true);
        $('#local_gov_tax').val(policy.local_gov_tax).attr('readonly', true);
        $('#cost').val(policy.cost).attr('readonly', true);
        $('#doc_path').val(policy.doc_path).attr('readonly', true);
        $('#status').val(policy.status).attr('disabled', true);

        $('#createdDateDisplay').text(new Date(policy.date_created).toLocaleString());

        $('.error-message').text('');
        $('.form-control').removeClass('error');
        $('#viewOnlyGroup').show();
        $('#policyForm').show();

        // Show modal with animation
        $('#policyModal, #modalOverlay').show();

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#policyModal',
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
    window.closePolicyModal = function() {
        // GSAP close animation
        gsap.to('#modalOverlay', {
            opacity: 0,
            duration: 0.3,
            onComplete: function() {
                $('#modalOverlay').hide();
            }
        });

        gsap.to('#policyModal', {
            opacity: 0,
            scale: 0.9,
            y: -50,
            duration: 0.3,
            ease: 'back.in',
            onComplete: function() {
                $('#policyModal').hide();
                $('#policyForm')[0].reset();
                $('.form-control').removeAttr('readonly').removeAttr('disabled');
                $('.error-message').text('');
            }
        });
    };

    // Submit Policy Form
    function submitPolicyForm() {
        if (currentMode === 'view') return;

        const url = $('#policyForm').attr('action');
        const method = $('#formMethod').val();

        const formData = {
            category_id: $('#category_id').val(),
            code: $('#code').val(),
            name: $('#name').val(),
            description: $('#description').val(),
            description1: $('#description1').val(),
            description2: $('#description2').val(),
            duration: $('#duration').val(),
            third_party_liability: $('#third_party_liability').val(),
            personal_accident: $('#personal_accident').val(),
            tppd: $('#tppd').val(),
            documentary_stamps: $('#documentary_stamps').val(),
            value_added_tax: $('#value_added_tax').val(),
            local_gov_tax: $('#local_gov_tax').val(),
            cost: $('#cost').val(),
            doc_path: $('#doc_path').val(),
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
                loadPolicies();
                closePolicyModal();
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

    // Delete Policy
    function deletePolicy(id) {
        $.ajax({
            url: '/policies/' + id,
            type: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function() {
                loadStats();
                loadPolicies();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Policy has been deleted successfully.',
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
                        text: 'Error deleting policy',
                        icon: 'error'
                    });
                }
            }
        });
    }
});
