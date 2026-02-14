import gsap from 'gsap';
import Swal from 'sweetalert2';

// Set default CSRF token for all fetch requests
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

// State management
let usersData = [];
let filteredData = [];
let currentView = 'cards';
let currentMode = 'create'; // create, edit, view

// DOM Elements
const elements = {
    totalUsers: document.getElementById('totalUsers'),
    activeUsers: document.getElementById('activeUsers'),
    inactiveUsers: document.getElementById('inactiveUsers'),
    subscribedUsers: document.getElementById('subscribedUsers'),
    cardView: document.getElementById('cardView'),
    tableView: document.getElementById('tableView'),
    tableBody: document.getElementById('tableBody'),
    filteredEmptyState: document.getElementById('filteredEmptyState'),
    statusFilter: document.getElementById('statusFilter'),
    userModal: document.getElementById('userModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalTitle: document.getElementById('modalTitle'),
    submitBtn: document.getElementById('submitBtn'),
    userForm: document.getElementById('userForm'),
    formMethod: document.getElementById('formMethod'),
    viewOnlyGroup: document.getElementById('viewOnlyGroup'),
    createdDateDisplay: document.getElementById('createdDateDisplay'),
    firstname: document.getElementById('firstname'),
    middlename: document.getElementById('middlename'),
    lastname: document.getElementById('lastname'),
    username: document.getElementById('username'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    avatar: document.getElementById('avatar'),
    type: document.getElementById('type'),
    status: document.getElementById('status'),
    permissions: document.getElementById('permissions'),
    credit: document.getElementById('credit'),
    office: document.getElementById('office'),
    // Subscription fields
    subscription_type: document.getElementById('subscription_type'),
    subscription_start_date: document.getElementById('subscription_start_date'),
    subscription_end_date: document.getElementById('subscription_end_date'),
    last_payment_date: document.getElementById('last_payment_date'),
    subscription_amount: document.getElementById('subscription_amount'),
};

// Function to get office name by ID
function getOfficeName(officeId) {
    if (!officeId) return 'N/A';
    const office = window.offices.find(o => o.id == officeId);
    return office ? office.office_name : 'N/A';
}

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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadStats();
    loadUsers();

    // Event Listeners
    document.getElementById('loadDataBtn')?.addEventListener('click', loadUsers);
    document.getElementById('create_new')?.addEventListener('click', function(e) {
        if (!checkSubscriptionPermission('create new users')) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        openCreateModal();
    });
    document.getElementById('resetFilters')?.addEventListener('click', resetFilters);

    // Subscription type change - auto-populate dates
    elements.subscription_type?.addEventListener('change', function() {
        const type = this.value;
        if (!type) {
            // Clear dates if no subscription type selected
            if (elements.subscription_start_date) elements.subscription_start_date.value = '';
            if (elements.subscription_end_date) elements.subscription_end_date.value = '';
            return;
        }

        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        
        let endDate = new Date();
        if (type === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (type === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else if (type === 'free_trial') {
            endDate.setDate(endDate.getDate() + 14); // 14 days trial
        }
        
        const endDateStr = endDate.toISOString().split('T')[0];
        
        if (elements.subscription_start_date) elements.subscription_start_date.value = startDate;
        if (elements.subscription_end_date) elements.subscription_end_date.value = endDateStr;
        if (elements.last_payment_date) elements.last_payment_date.value = startDate;
    });

    // View Toggle Buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentView = this.dataset.view;
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Hide all views first
            elements.cardView.style.display = 'none';
            elements.tableView.style.display = 'none';
            elements.cardView.classList.remove('active', 'cards-view', 'grid-view', 'list-view');
            elements.cardView.classList.add('users-grid');

            if (currentView === 'cards') {
                elements.cardView.classList.add('cards-view', 'active');
                elements.cardView.style.display = 'grid';
                renderCards(filteredData);
            } else if (currentView === 'grid') {
                elements.cardView.classList.add('grid-view', 'active');
                elements.cardView.style.display = 'grid';
                renderCards(filteredData);
            } else if (currentView === 'list') {
                elements.cardView.classList.add('list-view', 'active');
                elements.cardView.style.display = 'grid';
                renderCards(filteredData);
            } else if (currentView === 'table') {
                elements.tableView.classList.add('active');
                elements.tableView.style.display = 'block';
                renderTable(filteredData);
            }
        });
    });

    // Status Filter
    elements.statusFilter?.addEventListener('change', function() {
        applyFilter(this.value);
    });

    // Form Submission
    elements.userForm?.addEventListener('submit', function(e) {
        e.preventDefault();

        // Disable submit button immediately to prevent multiple submissions
        if (elements.submitBtn.disabled) {
            return; // Already processing
        }
        elements.submitBtn.disabled = true;
        elements.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        submitUserForm();
    });

    // Close modal on overlay click
    elements.modalOverlay?.addEventListener('click', closeUserModal);
});

// Reset Filters
function resetFilters() {
    elements.statusFilter.value = 'all';
    applyFilter('all');
}

// Load Stats
async function loadStats() {
    try {
        const response = await fetch(window.userRoutes.stats, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            },
        });
        const data = await response.json();
        elements.totalUsers.textContent = data.total;
        elements.activeUsers.textContent = data.active;
        elements.inactiveUsers.textContent = data.inactive;
        
        // Calculate subscribed users from loaded data
        const subscribedCount = usersData.filter(u => u.subscription_type && u.subscription_type !== '').length;
        if (elements.subscribedUsers) {
            elements.subscribedUsers.textContent = subscribedCount;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load Users
async function loadUsers() {
    try {
        const response = await fetch(window.userRoutes.data, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            },
        });
        const responseData = await response.json();
        usersData = responseData.data || [];
        filteredData = usersData;
        renderCards(filteredData);
        renderTable(filteredData);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Apply Filter
function applyFilter(status) {
    if (status === 'all') {
        filteredData = usersData;
    } else if (status === 'active') {
        filteredData = usersData.filter(u => u.status == 1);
    } else if (status === 'inactive') {
        filteredData = usersData.filter(u => u.status == 0);
    } else if (status === 'subscribed') {
        filteredData = usersData.filter(u => u.subscription_type && u.subscription_type !== '');
    } else if (status === 'expired') {
        const now = new Date();
        filteredData = usersData.filter(u => {
            if (!u.subscription_type) return false;
            const endDate = u.subscription_end_date ? new Date(u.subscription_end_date) : 
                           (u.last_payment_date ? new Date(new Date(u.last_payment_date).setMonth(new Date(u.last_payment_date).getMonth() + 1)) : null);
            return endDate && endDate < now;
        });
    }

    if (filteredData.length === 0 && status !== 'all') {
        elements.cardView.classList.add('hidden');
        elements.tableView.classList.add('hidden');
        elements.filteredEmptyState.classList.remove('hidden');
    } else {
        elements.cardView.classList.remove('hidden');
        elements.tableView.classList.remove('hidden');
        elements.filteredEmptyState.classList.add('hidden');

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
        elements.cardView.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>No Users Found</h3>
                <p>Get started by adding your first user to the system</p>
            </div>
        `;
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
        const permissionsText = user.permissions == 0 ? 'Only View button visible' : (user.permissions == 1 ? 'View, Edit, and Delete buttons visible' : 'View and Edit buttons visible, Delete hidden');
        
        // Subscription info
        let subscriptionInfo = 'No Subscription';
        let subscriptionClass = 'badge-secondary';
        if (user.subscription_type) {
            const now = new Date();
            const endDate = user.subscription_end_date ? new Date(user.subscription_end_date) : 
                           (user.last_payment_date ? new Date(new Date(user.last_payment_date).setMonth(new Date(user.last_payment_date).getMonth() + 1)) : null);
            if (endDate) {
                const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                if (daysLeft < 0) {
                    subscriptionInfo = 'Expired';
                    subscriptionClass = 'badge-danger';
                } else if (daysLeft <= 7) {
                    subscriptionInfo = `Expires in ${daysLeft} days`;
                    subscriptionClass = 'badge-warning';
                } else {
                    subscriptionInfo = `Active (${user.subscription_type})`;
                    subscriptionClass = 'badge-success';
                }
            }
        }

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
                            <span class="detail-label">Subscription:</span>
                            <span class="detail-value"><span class="badge ${subscriptionClass}">${subscriptionInfo}</span></span>
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
                        <button class="action-btn-small view view_data" data-id="${user.id}">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        ${window.userPermissions > 0 ? `<button class="action-btn-small edit edit_data" data-id="${user.id}">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>` : ''}
                        ${window.userPermissions === 1 ? `<button class="action-btn-small delete delete_data" data-id="${user.id}">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>` : ''}
                    </div>
                </div>
            </div>
        `;
    });

    elements.cardView.innerHTML = html;
    attachCardEventListeners();
}

// Render Table View
function renderTable(data) {
    if (data.length === 0) {
        elements.tableBody.innerHTML = `
            <tr>
                <td colspan="11">
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
        `;
        document.getElementById('create_new_empty_table')?.addEventListener('click', openCreateModal);
        return;
    }

    let html = '';
    data.forEach(function(user, index) {
        const status = user.status == 1 ? 'active' : 'inactive';
        const statusLabel = user.status == 1 ? 'Verified' : 'Not Verified';
        const fullName = user.firstname + ' ' + (user.middlename ? user.middlename + ' ' : '') + user.lastname;
        const email = user.email || '<span style="color: var(--gray);">No email</span>';
        const permissionsText = user.permissions == 0 ? 'No Access' : (user.permissions == 1 ? 'Can Modify' : 'Can Print');
        
        // Subscription badge
        let subscriptionBadge = '<span class="badge badge-secondary">No Subscription</span>';
        if (user.subscription_badge) {
            subscriptionBadge = user.subscription_badge;
        }

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
                <td class="text-center">${subscriptionBadge}</td>
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
                            ${window.userPermissions > 0 ? `<div class="dropdown-divider"></div>
                            <button class="dropdown-item edit_data" data-id="${user.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>` : ''}
                            ${window.userPermissions === 1 ? `<div class="dropdown-divider"></div>
                            <button class="dropdown-item delete_data" data-id="${user.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>` : ''}
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });

    elements.tableBody.innerHTML = html;
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
            if (!checkSubscriptionPermission('edit users')) {
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
            if (!checkSubscriptionPermission('delete users')) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            const id = this.dataset.id;
            if (confirm('Are you sure you want to delete this user?')) {
                deleteUser(id);
            }
        });
    });
}

// Attach Table Event Listeners
function attachTableEventListeners() {
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.nextElementSibling;
            if (dropdown) {
                dropdown.classList.toggle('show');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.action-dropdown')) {
            document.querySelectorAll('.action-dropdown .dropdown-menu').forEach(menu => {
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
            if (!checkSubscriptionPermission('edit users')) {
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
            if (!checkSubscriptionPermission('delete users')) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            const id = this.dataset.id;
            if (confirm('Are you sure you want to delete this user?')) {
                deleteUser(id);
            }
        });
    });
}

// Open Create Modal
window.openCreateModal = function() {
    currentMode = 'create';
    elements.modalTitle.textContent = 'Create New User';
    elements.submitBtn.innerHTML = '<i class="fas fa-save"></i> Save User';
    elements.formMethod.value = 'POST';
    elements.userForm.action = window.userRoutes.store;
    elements.userForm.reset();
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    elements.viewOnlyGroup.style.display = 'none';
    elements.userForm.style.display = 'block';
    
    // Make password required for new users
    if (elements.password) {
        elements.password.setAttribute('required', 'required');
        elements.password.placeholder = ' ';
    }

    // Show modal with animation
    elements.userModal.style.display = 'flex';
    elements.modalOverlay.style.display = 'block';

    // GSAP Animation
    gsap.fromTo(elements.modalOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(elements.userModal,
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

    elements.modalTitle.textContent = 'Edit User';
    elements.submitBtn.innerHTML = '<i class="fas fa-save"></i> Update User';
    elements.formMethod.value = 'PUT';
    elements.userForm.action = window.userRoutes.base + id;
    
    // Make password optional for editing (remove required)
    if (elements.password) {
        elements.password.removeAttribute('required');
        elements.password.placeholder = 'Leave empty to keep current password';
        elements.password.value = ''; // Clear any previous value
    }

    elements.firstname.value = user.firstname;
    elements.middlename.value = user.middlename;
    elements.lastname.value = user.lastname;
    elements.username.value = user.username;
    elements.email.value = user.email;
    elements.password.value = ''; // Don't prefill password
    elements.avatar.value = user.avatar;
    elements.type.value = user.type;
    elements.status.value = user.status;
    elements.permissions.value = user.permissions;
    elements.credit.value = user.credit;
    elements.office.value = user.office_id;
    
    // Subscription fields
    if (elements.subscription_type) elements.subscription_type.value = user.subscription_type || '';
    if (elements.subscription_start_date) elements.subscription_start_date.value = user.subscription_start_date ? user.subscription_start_date.split(' ')[0] : '';
    if (elements.subscription_end_date) elements.subscription_end_date.value = user.subscription_end_date ? user.subscription_end_date.split(' ')[0] : '';
    if (elements.last_payment_date) elements.last_payment_date.value = user.last_payment_date ? user.last_payment_date.split(' ')[0] : '';
    if (elements.subscription_amount) elements.subscription_amount.value = user.subscription_amount || '';

    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    elements.viewOnlyGroup.style.display = 'none';
    elements.userForm.style.display = 'block';

    // Show modal with animation
    elements.userModal.style.display = 'flex';
    elements.modalOverlay.style.display = 'block';

    // GSAP Animation
    gsap.fromTo(elements.modalOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(elements.userModal,
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

    elements.modalTitle.textContent = 'View User Details';
    
    // Hide submit button in view mode - only show Close button
    elements.submitBtn.style.display = 'none';

    elements.firstname.value = user.firstname;
    elements.firstname.setAttribute('readonly', true);
    elements.firstname.classList.add('view-only-field');
    elements.middlename.value = user.middlename;
    elements.middlename.setAttribute('readonly', true);
    elements.middlename.classList.add('view-only-field');
    elements.lastname.value = user.lastname;
    elements.lastname.setAttribute('readonly', true);
    elements.lastname.classList.add('view-only-field');
    elements.username.value = user.username;
    elements.username.setAttribute('readonly', true);
    elements.username.classList.add('view-only-field');
    elements.email.value = user.email;
    elements.email.setAttribute('readonly', true);
    elements.email.classList.add('view-only-field');
    elements.password.value = '';
    elements.password.setAttribute('readonly', true);
    elements.password.classList.add('view-only-field');
    elements.avatar.value = user.avatar;
    elements.avatar.setAttribute('readonly', true);
    elements.avatar.classList.add('view-only-field');
    elements.type.value = user.type;
    elements.type.setAttribute('disabled', true);
    elements.type.classList.add('view-only-select');
    elements.status.value = user.status;
    elements.status.setAttribute('disabled', true);
    elements.status.classList.add('view-only-select');
    elements.permissions.value = user.permissions;
    elements.permissions.setAttribute('disabled', true);
    elements.permissions.classList.add('view-only-select');
    elements.credit.value = user.credit;
    elements.credit.setAttribute('readonly', true);
    elements.credit.classList.add('view-only-field');
    elements.office.value = user.office_id;
    elements.office.setAttribute('disabled', true);
    elements.office.classList.add('view-only-select');
    
    // Subscription fields
    if (elements.subscription_type) {
        elements.subscription_type.value = user.subscription_type || '';
        elements.subscription_type.setAttribute('disabled', true);
        elements.subscription_type.classList.add('view-only-select');
    }
    if (elements.subscription_start_date) {
        elements.subscription_start_date.value = user.subscription_start_date ? user.subscription_start_date.split(' ')[0] : '';
        elements.subscription_start_date.setAttribute('readonly', true);
        elements.subscription_start_date.classList.add('view-only-field');
    }
    if (elements.subscription_end_date) {
        elements.subscription_end_date.value = user.subscription_end_date ? user.subscription_end_date.split(' ')[0] : '';
        elements.subscription_end_date.setAttribute('readonly', true);
        elements.subscription_end_date.classList.add('view-only-field');
    }
    if (elements.last_payment_date) {
        elements.last_payment_date.value = user.last_payment_date ? user.last_payment_date.split(' ')[0] : '';
        elements.last_payment_date.setAttribute('readonly', true);
        elements.last_payment_date.classList.add('view-only-field');
    }
    if (elements.subscription_amount) {
        elements.subscription_amount.value = user.subscription_amount || '';
        elements.subscription_amount.setAttribute('readonly', true);
        elements.subscription_amount.classList.add('view-only-field');
    }

    elements.createdDateDisplay.textContent = new Date(user.created_at).toLocaleString();

    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    elements.viewOnlyGroup.style.display = 'block';
    elements.userForm.style.display = 'block';

    // Show modal with animation
    elements.userModal.style.display = 'flex';
    elements.modalOverlay.style.display = 'block';

    // GSAP Animation
    gsap.fromTo(elements.modalOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(elements.userModal,
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
    gsap.to(elements.modalOverlay, {
        opacity: 0,
        duration: 0.3,
        onComplete: function() {
            elements.modalOverlay.style.display = 'none';
        }
    });

    gsap.to(elements.userModal, {
        opacity: 0,
        scale: 0.9,
        y: -50,
        duration: 0.3,
        ease: 'back.in',
        onComplete: function() {
            elements.userModal.style.display = 'none';
            elements.userForm.reset();
            document.querySelectorAll('.form-control').forEach(el => {
                el.removeAttribute('readonly');
                el.removeAttribute('disabled');
                el.classList.remove('view-only-field', 'view-only-select');
            });
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            // Show submit button again for create/edit modes
            elements.submitBtn.style.display = 'inline-block';
            elements.submitBtn.setAttribute('type', 'submit');
            elements.submitBtn.onclick = null;
            elements.submitBtn.disabled = false;
        }
    });
};

// Submit User Form
async function submitUserForm() {
    if (currentMode === 'view') return;

    const url = elements.userForm.action;
    const method = elements.formMethod.value;

    const formData = {
        firstname: elements.firstname.value,
        middlename: elements.middlename.value,
        lastname: elements.lastname.value,
        username: elements.username.value,
        email: elements.email.value,
        password: elements.password.value,
        avatar: elements.avatar.value,
        type: elements.type.value,
        status: elements.status.value,
        permissions: elements.permissions.value,
        credit: elements.credit.value,
        office_id: elements.office.value,
        // Subscription fields
        subscription_type: elements.subscription_type ? elements.subscription_type.value : '',
        subscription_start_date: elements.subscription_start_date ? elements.subscription_start_date.value : '',
        subscription_end_date: elements.subscription_end_date ? elements.subscription_end_date.value : '',
        last_payment_date: elements.last_payment_date ? elements.last_payment_date.value : '',
        subscription_amount: elements.subscription_amount ? elements.subscription_amount.value : '',
        _token: csrfToken,
    };

    // Add _method field for PUT requests
    if (method === 'PUT') {
        formData._method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        loadStats();
        loadUsers();
        closeUserModal();
        Swal.fire({
            title: 'Success!',
            text: data.message || 'Operation successful',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
        });
    } catch (error) {
        console.error('Error:', error);

        // Handle validation errors
        if (error.message && error.message.includes('validation')) {
            try {
                const errorData = JSON.parse(error.message);
                if (errorData.errors) {
                    Object.keys(errorData.errors).forEach(key => {
                        const errorEl = document.getElementById(key + '-error');
                        const inputEl = document.getElementById(key);
                        if (errorEl) errorEl.textContent = errorData.errors[key][0];
                        if (inputEl) inputEl.classList.add('error');
                    });
                }
            } catch (e) {
                // If parsing fails, show generic error
            }

            Swal.fire({
                title: 'Validation Error!',
                text: 'Please check the form fields',
                icon: 'error',
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'An error occurred',
                icon: 'error',
            });
        }
    } finally {
        elements.submitBtn.disabled = false;
    }
}

// Delete User
async function deleteUser(id) {
    try {
        const response = await fetch(window.userRoutes.base + id, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Delete failed');
        }

        loadStats();
        loadUsers();
        Swal.fire({
            title: 'Deleted!',
            text: 'User has been deleted successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Error deleting user',
            icon: 'error',
        });
    }
}
