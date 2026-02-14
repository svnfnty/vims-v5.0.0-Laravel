import { gsap } from 'gsap';
import Swal from 'sweetalert2';

// Get CSRF token from meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

// Check if user has subscription permissions
function checkSubscriptionPermission(actionName = 'perform this action') {
    // Check if user has no permissions (permissions = 0)
    if (window.userPermissions === 0) {
        Swal.fire({
            title: 'Subscription Required!',
            text: `Your subscription has expired or you don't have permission to ${actionName}. Please renew your subscription to continue using this feature.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Renew Subscription',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to account settings or payment page
                window.location.href = '/account/setting';
            }
        });
        return false;
    }
    
    // Check if user has no subscription at all
    if (!window.currentUserSubscription || !window.currentUserSubscription.subscription_type) {
        Swal.fire({
            title: 'Subscription Required!',
            text: `You don't have an active subscription. Please subscribe to ${actionName}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Subscribe Now',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/account/setting';
            }
        });
        return false;
    }
    
    // Check if free trial has ended
    if (window.currentUserSubscription.subscription_type === 'free_trial') {
        const endDate = window.currentUserSubscription.subscription_end_date 
            ? new Date(window.currentUserSubscription.subscription_end_date)
            : (window.currentUserSubscription.last_payment_date 
                ? new Date(new Date(window.currentUserSubscription.last_payment_date).setMonth(new Date(window.currentUserSubscription.last_payment_date).getMonth() + 1))
                : null);
        
        if (endDate && new Date() > endDate) {
            Swal.fire({
                title: 'Free Trial Ended!',
                text: `Your free trial has ended. Please upgrade your subscription to ${actionName}.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Upgrade Now',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/account/setting';
                }
            });
            return false;
        }
    }
    
    return true;
}

// Set default headers for fetch
const defaultHeaders = {
    'X-CSRF-TOKEN': csrfToken,
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

document.addEventListener('DOMContentLoaded', function() {
    let categoriesData = [];
    let filteredData = [];
    let currentView = 'cards';
    let currentMode = 'create'; // create, edit, view

    // Load initial data
    loadStats();
    loadCategories();

    // Load Data Button
    document.getElementById('loadDataBtn')?.addEventListener('click', function() {
        loadCategories();
    });

    // Create New Category
    document.getElementById('create_new')?.addEventListener('click', function(e) {
        if (!checkSubscriptionPermission('create new categories')) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        openCreateModal();
    });

    // View Toggle Buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentView = this.dataset.view;
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Hide all views first
            const cardView = document.getElementById('cardView');
            const tableView = document.getElementById('tableView');
            
            if (cardView) {
                cardView.style.display = 'none';
                cardView.classList.remove('active', 'cards-view', 'grid-view', 'list-view');
            }
            if (tableView) tableView.style.display = 'none';

            if (currentView === 'cards') {
                if (cardView) {
                    cardView.classList.add('cards-view', 'active');
                    cardView.style.display = 'grid';
                }
                renderCards(filteredData);
            } else if (currentView === 'grid') {
                if (cardView) {
                    cardView.classList.add('grid-view', 'active');
                    cardView.style.display = 'grid';
                }
                renderCards(filteredData);
            } else if (currentView === 'list') {
                if (cardView) {
                    cardView.classList.add('list-view', 'active');
                    cardView.style.display = 'grid';
                }
                renderCards(filteredData);
            } else if (currentView === 'table') {
                if (tableView) {
                    tableView.classList.add('active');
                    tableView.style.display = 'block';
                }
                renderTable(filteredData);
            }
        });
    });

    // Status Filter
    document.getElementById('statusFilter')?.addEventListener('change', function() {
        const status = this.value;
        applyFilter(status);
    });

    // Reset Filters
    document.getElementById('resetFilters')?.addEventListener('click', function() {
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) statusFilter.value = 'all';
        applyFilter('all');
    });

    // Form Submission
    document.getElementById('categoryForm')?.addEventListener('submit', function(e) {
        e.preventDefault();

        // Disable submit button immediately to prevent multiple submissions
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn?.disabled) {
            return; // Already processing
        }
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        }

        submitCategoryForm();
    });

    // Load Stats
    function loadStats() {
        fetch(window.categoryRoutes.stats, {
            headers: defaultHeaders
        })
        .then(response => response.json())
        .then(data => {
            const totalEl = document.getElementById('totalCategories');
            const activeEl = document.getElementById('activeCategories');
            const inactiveEl = document.getElementById('inactiveCategories');
            
            if (totalEl) totalEl.textContent = data.total || 0;
            if (activeEl) activeEl.textContent = data.active || 0;
            if (inactiveEl) inactiveEl.textContent = data.inactive || 0;
        })
        .catch(error => console.error('Error loading stats:', error));
    }

    // Load Categories
    function loadCategories() {
        fetch(window.categoryRoutes.data, {
            headers: defaultHeaders
        })
        .then(response => response.json())
        .then(response => {
            categoriesData = response.data || [];
            filteredData = categoriesData;
            renderCards(filteredData);
            renderTable(filteredData);
        })
        .catch(error => console.error('Error loading categories:', error));
    }

    // Apply Filter
    function applyFilter(status) {
        if (status === 'all') {
            filteredData = categoriesData;
        } else if (status === 'active') {
            filteredData = categoriesData.filter(c => c.status == 1);
        } else if (status === 'inactive') {
            filteredData = categoriesData.filter(c => c.status == 0);
        }

        const cardView = document.getElementById('cardView');
        const tableView = document.getElementById('tableView');
        const filteredEmptyState = document.getElementById('filteredEmptyState');

        if (filteredData.length === 0 && status !== 'all') {
            if (cardView) cardView.classList.add('hidden');
            if (tableView) tableView.classList.add('hidden');
            if (filteredEmptyState) filteredEmptyState.classList.remove('hidden');
        } else {
            if (cardView) cardView.classList.remove('hidden');
            if (tableView) tableView.classList.remove('hidden');
            if (filteredEmptyState) filteredEmptyState.classList.add('hidden');

            if (currentView === 'cards' || currentView === 'grid' || currentView === 'list') {
                renderCards(filteredData);
            } else {
                renderTable(filteredData);
            }
        }
    }

    // Render Cards/Grid/List View
    function renderCards(data) {
        const cardView = document.getElementById('cardView');
        if (!cardView) return;

        if (data.length === 0) {
            cardView.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-tags"></i>
                    </div>
                    <h3>No Categories Found</h3>
                    <p>Get started by adding your first category to the system</p>
                </div>
            `;
            return;
        }

        let html = '';
        data.forEach(function(category, index) {
            const status = category.status == 1 ? 'active' : 'inactive';
            const statusLabel = category.status == 1 ? 'Active' : 'Inactive';
            const description = category.description || '<span style="color: var(--gray);">No description</span>';
            const createdDate = new Date(category.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            html += `
                <div class="category-card" data-status="${status}" data-id="${category.id}">
                    <div class="card-header">
                        <div class="category-meta">
                            <span class="category-id">Category #${category.id}</span>
                            <span class="category-date">${createdDate}</span>
                        </div>
                        <div class="status-badge ${status}">
                            ${statusLabel}
                        </div>
                    </div>

                    <div class="card-body">
                        <h5 class="category-name">${category.name}</h5>
                        <div class="category-details">
                            <div class="detail-row">
                                <span class="detail-label">Description:</span>
                                <span class="detail-value">${description}</span>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer">
                        <div class="action-buttons">
                            <button class="action-btn-small view view_data" data-id="${category.id}">
                                <i class="fas fa-eye"></i>
                                View
                            </button>
                            ${window.userPermissions > 0 ? `<button class="action-btn-small edit edit_data" data-id="${category.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>` : ''}
                            ${window.userPermissions === 1 ? `<button class="action-btn-small delete delete_data" data-id="${category.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        cardView.innerHTML = html;
        attachCardEventListeners();
    }

    // Render Table View
    function renderTable(data) {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) return;

        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i class="fas fa-tags"></i>
                            </div>
                            <h3>No Categories Found</h3>
                            <p>Get started by adding your first category to the system</p>
                            <button class="control-btn primary" id="create_new_empty_table">
                                <i class="fas fa-plus-circle"></i>
                                Add New Category
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            document.getElementById('create_new_empty_table')?.addEventListener('click', function() {
                openCreateModal();
            });
            return;
        }

        let html = '';
        data.forEach(function(category, index) {
            const status = category.status == 1 ? 'active' : 'inactive';
            const statusLabel = category.status == 1 ? 'Active' : 'Inactive';
            const description = category.description || '<span style="color: var(--gray);">No description</span>';
            const createdDate = new Date(category.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            html += `
                <tr data-status="${status}" data-id="${category.id}">
                    <td class="text-center">${index + 1}</td>
                    <td>${createdDate}</td>
                    <td><strong>${category.name}</strong></td>
                    <td>${description}</td>
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
                                <a class="dropdown-item view_data" data-id="${category.id}">
                                    <i class="fas fa-eye"></i>
                                    View
                                </a>
                                ${window.userPermissions > 0 ? `<div class="dropdown-divider"></div>
                                <button class="dropdown-item edit_data" data-id="${category.id}">
                                    <i class="fas fa-edit"></i>
                                    Edit
                                </button>` : ''}
                                ${window.userPermissions === 1 ? `<div class="dropdown-divider"></div>
                                <button class="dropdown-item delete_data" data-id="${category.id}">
                                    <i class="fas fa-trash"></i>
                                    Delete
                                </button>` : ''}
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;
        attachTableEventListeners();
    }

    // Attach Card Event Listeners
    function attachCardEventListeners() {
        document.querySelectorAll('.view_data').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                openViewModal(id);
            });
        });

        document.querySelectorAll('.edit_data').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (!checkSubscriptionPermission('edit categories')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                const id = this.dataset.id;
                openEditModal(id);
            });
        });

        document.querySelectorAll('.delete_data').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (!checkSubscriptionPermission('delete categories')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                const id = this.dataset.id;
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
                        deleteCategory(id);
                    }
                });
            });
        });
    }

    // Attach Table Event Listeners
    function attachTableEventListeners() {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const dropdown = this.nextElementSibling;
                if (dropdown) dropdown.classList.toggle('show');
            });
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.action-dropdown')) {
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
            }
        });

        document.querySelectorAll('.view_data').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                openViewModal(id);
            });
        });

        document.querySelectorAll('.edit_data').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (!checkSubscriptionPermission('edit categories')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                const id = this.dataset.id;
                openEditModal(id);
            });
        });

        document.querySelectorAll('.delete_data').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (!checkSubscriptionPermission('delete categories')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                const id = this.dataset.id;
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
                        deleteCategory(id);
                    }
                });
            });
        });
    }

    // Open Create Modal
    window.openCreateModal = function() {
        currentMode = 'create';
        
        const modalTitle = document.getElementById('modalTitle');
        const submitBtn = document.getElementById('submitBtn');
        const formMethod = document.getElementById('formMethod');
        const categoryForm = document.getElementById('categoryForm');
        const viewOnlyGroup = document.getElementById('viewOnlyGroup');
        
        if (modalTitle) modalTitle.textContent = 'Create New Category';
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Category';
            submitBtn.disabled = false;
        }
        if (formMethod) formMethod.value = 'POST';
        if (categoryForm) {
            categoryForm.setAttribute('action', window.categoryRoutes.store);
            categoryForm.reset();
        }
        
        // Clear errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
        
        if (viewOnlyGroup) viewOnlyGroup.style.display = 'none';
        if (categoryForm) categoryForm.style.display = 'block';

        // Show modal with animation
        const modal = document.getElementById('categoryModal');
        const overlay = document.getElementById('modalOverlay');
        
        if (modal) modal.style.display = 'flex';
        if (overlay) overlay.style.display = 'block';

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#categoryModal',
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
        const category = categoriesData.find(c => c.id == id);

        if (!category) return;

        const modalTitle = document.getElementById('modalTitle');
        const submitBtn = document.getElementById('submitBtn');
        const formMethod = document.getElementById('formMethod');
        const categoryForm = document.getElementById('categoryForm');
        const viewOnlyGroup = document.getElementById('viewOnlyGroup');
        
        if (modalTitle) modalTitle.textContent = 'Edit Category';
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Category';
            submitBtn.disabled = false;
        }
        if (formMethod) formMethod.value = 'PUT';
        if (categoryForm) categoryForm.setAttribute('action', '/category/' + id);

        // Set form values
        const nameInput = document.getElementById('name');
        const descriptionInput = document.getElementById('description');
        const statusInput = document.getElementById('status');
        
        if (nameInput) nameInput.value = category.name;
        if (descriptionInput) descriptionInput.value = category.description || '';
        if (statusInput) statusInput.value = category.status;

        // Clear errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
        
        if (viewOnlyGroup) viewOnlyGroup.style.display = 'none';
        if (categoryForm) categoryForm.style.display = 'block';

        // Show modal with animation
        const modal = document.getElementById('categoryModal');
        const overlay = document.getElementById('modalOverlay');
        
        if (modal) modal.style.display = 'flex';
        if (overlay) overlay.style.display = 'block';

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#categoryModal',
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
        const category = categoriesData.find(c => c.id == id);

        if (!category) return;

        const modalTitle = document.getElementById('modalTitle');
        const submitBtn = document.getElementById('submitBtn');
        const viewOnlyGroup = document.getElementById('viewOnlyGroup');
        const createdDateDisplay = document.getElementById('createdDateDisplay');
        
        if (modalTitle) modalTitle.textContent = 'View Category Details';
        
        // Hide submit button in view mode - only show Close button
        if (submitBtn) submitBtn.style.display = 'none';

        // Set form values (readonly) with view-only styling
        const nameInput = document.getElementById('name');
        const descriptionInput = document.getElementById('description');
        const statusInput = document.getElementById('status');
        
        if (nameInput) {
            nameInput.value = category.name;
            nameInput.setAttribute('readonly', true);
            nameInput.classList.add('view-only-field');
        }
        if (descriptionInput) {
            descriptionInput.value = category.description || '';
            descriptionInput.setAttribute('readonly', true);
            descriptionInput.classList.add('view-only-field');
        }
        if (statusInput) {
            statusInput.value = category.status;
            statusInput.setAttribute('disabled', true);
            statusInput.classList.add('view-only-select');
        }

        if (createdDateDisplay) {
            createdDateDisplay.textContent = new Date(category.date_created).toLocaleString();
        }

        // Clear errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
        
        if (viewOnlyGroup) viewOnlyGroup.style.display = 'block';

        // Show modal with animation
        const modal = document.getElementById('categoryModal');
        const overlay = document.getElementById('modalOverlay');
        
        if (modal) modal.style.display = 'flex';
        if (overlay) overlay.style.display = 'block';

        // GSAP Animation
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#categoryModal',
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
    window.closeCategoryModal = function() {
        // GSAP close animation
        gsap.to('#modalOverlay', {
            opacity: 0,
            duration: 0.3,
            onComplete: function() {
                const overlay = document.getElementById('modalOverlay');
                if (overlay) overlay.style.display = 'none';
            }
        });

        gsap.to('#categoryModal', {
            opacity: 0,
            scale: 0.9,
            y: -50,
            duration: 0.3,
            ease: 'back.in',
            onComplete: function() {
                const modal = document.getElementById('categoryModal');
                const categoryForm = document.getElementById('categoryForm');
                const submitBtn = document.getElementById('submitBtn');
                
                if (modal) modal.style.display = 'none';
                if (categoryForm) categoryForm.reset();
                
                // Remove readonly and disabled attributes
                document.querySelectorAll('.form-control').forEach(el => {
                    el.removeAttribute('readonly');
                    el.removeAttribute('disabled');
                    el.classList.remove('view-only-field', 'view-only-select');
                });
                
                // Clear errors
                document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
                
                // Show submit button again for create/edit modes
                if (submitBtn) {
                    submitBtn.style.display = 'inline-block';
                    submitBtn.setAttribute('type', 'submit');
                    submitBtn.onclick = null;
                }
            }
        });
    };

    // Submit Category Form
    function submitCategoryForm() {
        if (currentMode === 'view') return;

        const submitBtn = document.getElementById('submitBtn');
        const categoryForm = document.getElementById('categoryForm');
        
        if (!categoryForm) return;

        const url = categoryForm.getAttribute('action');
        const method = document.getElementById('formMethod')?.value || 'POST';

        const formData = {
            name: document.getElementById('name')?.value,
            description: document.getElementById('description')?.value,
            status: document.getElementById('status')?.value,
            _token: csrfToken
        };

        // Add _method field for PUT requests
        if (method === 'PUT') {
            formData._method = 'PUT';
        }

        fetch(url, {
            method: 'POST',
            headers: {
                ...defaultHeaders,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 422) {
                    return response.json().then(data => {
                        throw { type: 'validation', errors: data.errors };
                    });
                }
                throw { type: 'http', status: response.status, statusText: response.statusText };
            }
            return response.json();
        })
        .then(data => {
            loadStats();
            loadCategories();
            closeCategoryModal();
            Swal.fire({
                title: 'Success!',
                text: data.message || 'Operation successful',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        })
        .catch(error => {
            console.error('Error:', error);
            
            if (error.type === 'validation') {
                // Display validation errors
                Object.keys(error.errors).forEach(key => {
                    const errorEl = document.getElementById(key + '-error');
                    const inputEl = document.getElementById(key);
                    if (errorEl) errorEl.textContent = error.errors[key][0];
                    if (inputEl) inputEl.classList.add('error');
                });
                
                Swal.fire({
                    title: 'Validation Error!',
                    text: 'Please check the form fields',
                    icon: 'error'
                });
            } else if (error.status === 419) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Session expired. Please refresh the page and try again.',
                    icon: 'error'
                });
                location.reload();
            } else if (error.status === 404) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Route not found. Please check your routes configuration.',
                    icon: 'error'
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: error.status + ' - ' + error.statusText,
                    icon: 'error'
                });
            }
        })
        .finally(() => {
            // Re-enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-save"></i> ' + (currentMode === 'create' ? 'Save Category' : 'Update Category');
            }
        });
    }

    // Delete Category
    function deleteCategory(id) {
        fetch('/category/' + id, {
            method: 'DELETE',
            headers: defaultHeaders
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 422) {
                    return response.json().then(data => {
                        throw { type: 'business', message: data.message };
                    });
                }
                if (response.status === 419) {
                    throw { type: 'session' };
                }
                throw { type: 'http', status: response.status, statusText: response.statusText };
            }
            return response.json();
        })
        .then(() => {
            loadStats();
            loadCategories();
            Swal.fire({
                title: 'Deleted!',
                text: 'Category has been deleted successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.type === 'business') {
                Swal.fire({
                    title: 'Error!',
                    text: error.message,
                    icon: 'error'
                });
            } else if (error.type === 'session') {
                Swal.fire({
                    title: 'Error!',
                    text: 'Session expired. Please refresh the page and try again.',
                    icon: 'error'
                });
                location.reload();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Error deleting category: ' + error.status + ' - ' + error.statusText,
                    icon: 'error'
                });
            }
        });
    }
});
