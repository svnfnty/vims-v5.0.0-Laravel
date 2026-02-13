import gsap from 'gsap';
import Swal from 'sweetalert2';

// Set default CSRF token for all fetch requests
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

// Check if user has subscription permissions
function checkSubscriptionPermission(actionName = 'perform this action') {
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
    return true;
}

// State management
let walkinsData = [];
let filteredData = [];
let currentView = 'cards';
let currentMode = 'create'; // create, edit, view

// DOM Elements
const elements = {
    totalWalkins: document.getElementById('totalWalkins'),
    activeWalkins: document.getElementById('activeWalkins'),
    inactiveWalkins: document.getElementById('inactiveWalkins'),
    cardView: document.getElementById('cardView'),
    tableView: document.getElementById('tableView'),
    tableBody: document.getElementById('tableBody'),
    filteredEmptyState: document.getElementById('filteredEmptyState'),
    statusFilter: document.getElementById('statusFilter'),
    walkinModal: document.getElementById('walkinModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalTitle: document.getElementById('modalTitle'),
    submitBtn: document.getElementById('submitBtn'),
    walkinForm: document.getElementById('walkinForm'),
    formMethod: document.getElementById('formMethod'),
    viewOnlyGroup: document.getElementById('viewOnlyGroup'),
    createdDateDisplay: document.getElementById('createdDateDisplay'),
    email: document.getElementById('email'),
    accountID: document.getElementById('accountID'),
    name: document.getElementById('name'),
    color: document.getElementById('color'),
    description: document.getElementById('description'),
    status: document.getElementById('status'),
    officeId: document.getElementById('office_id'),
    officeSelectGroup: document.getElementById('officeSelectGroup'),
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadStats();
    loadWalkins();

    // Event Listeners
    document.getElementById('loadDataBtn')?.addEventListener('click', loadWalkins);
    document.getElementById('create_new')?.addEventListener('click', function(e) {
        if (!checkSubscriptionPermission('create new walkins')) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        openCreateModal();
    });
    document.getElementById('resetFilters')?.addEventListener('click', resetFilters);

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
    elements.walkinForm?.addEventListener('submit', function(e) {
        e.preventDefault();

        // Disable submit button immediately to prevent multiple submissions
        if (elements.submitBtn.disabled) {
            return; // Already processing
        }
        elements.submitBtn.disabled = true;
        elements.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        submitWalkinForm();
    });

    // Close modal on overlay click
    elements.modalOverlay?.addEventListener('click', closeWalkinModal);

    // Tutorial event listener
    if (elements.walkinForm) {
        elements.walkinForm.addEventListener('submit', function() {
            // Dispatch event to notify tutorial system
            window.dispatchEvent(new CustomEvent('tutorial:actionCompleted', {
                detail: { step: 1, action: 'walkin_created' }
            }));
        });
    }
});

// Reset Filters
function resetFilters() {
    elements.statusFilter.value = 'all';
    applyFilter('all');
}

// Load Stats
async function loadStats() {
    try {
        const response = await fetch(window.walkinRoutes.stats, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            },
        });
        const data = await response.json();
        elements.totalWalkins.textContent = data.total;
        elements.activeWalkins.textContent = data.active;
        elements.inactiveWalkins.textContent = data.inactive;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load Walkins
async function loadWalkins() {
    try {
        const response = await fetch(window.walkinRoutes.data, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            },
        });
        const responseData = await response.json();
        walkinsData = responseData.data || [];
        filteredData = walkinsData;
        renderCards(filteredData);
        renderTable(filteredData);
    } catch (error) {
        console.error('Error loading walkins:', error);
    }
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
                <h3>No Walkins Found</h3>
                <p>Get started by adding your first walkin to the system</p>
            </div>
        `;
        return;
    }

    let html = '';
    data.forEach(function(walkin, index) {
        const status = walkin.status == 1 ? 'active' : 'inactive';
        const statusLabel = walkin.status == 1 ? 'Active' : 'Inactive';
        const email = walkin.email || '<span style="color: var(--gray);">No email</span>';
        const createdDate = new Date(walkin.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        
        // Only show office name for super admin (id=1 and office_id=0)
        const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
        const officeName = walkin.office ? walkin.office.office_name : 'N/A';
        const officeDisplay = isSuperAdmin ? `
            <div class="detail-row">
                <span class="detail-label">Office:</span>
                <span class="detail-value">${officeName}</span>
            </div>
        ` : '';

        html += `
            <div class="walkin-card" data-status="${status}" data-office="${officeName}" data-id="${walkin.id}">
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
                    <h5 class="walkin-name">${walkin.name}</h5>
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
                        ${officeDisplay}
                    </div>
                </div>

                <div class="card-footer">
                    <div class="action-buttons">
                        <button class="action-btn-small view view_data" data-id="${walkin.id}">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        ${window.userPermissions > 0 ? `<button class="action-btn-small edit edit_data" data-id="${walkin.id}">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>` : ''}
                        ${window.userPermissions === 1 ? `<button class="action-btn-small delete delete_data" data-id="${walkin.id}">
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
        const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
        const colspan = isSuperAdmin ? 9 : 8;
        elements.tableBody.innerHTML = `
            <tr>
                <td colspan="${colspan}">
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
        `;
        document.getElementById('create_new_empty_table')?.addEventListener('click', openCreateModal);
        return;
    }

    let html = '';
    data.forEach(function(walkin, index) {
        const status = walkin.status == 1 ? 'active' : 'inactive';
        const statusLabel = walkin.status == 1 ? 'Active' : 'Inactive';
        const email = walkin.email || '<span style="color: var(--gray);">No email</span>';
        
        // Only show office name for super admin (id=1 and office_id=0)
        const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
        const officeName = walkin.office ? walkin.office.office_name : 'N/A';
        const officeDisplay = isSuperAdmin ? `<td>${officeName}</td>` : '';

        html += `
            <tr data-status="${status}" data-office="${officeName}" data-id="${walkin.id}">
                <td class="text-center">${walkin.id}</td>
                <td>${email}</td>
                <td>${walkin.accountID}</td>
                <td><strong>${walkin.name}</strong></td>
                <td>${walkin.color}</td>
                <td class="text-center">
                    <span class="status-badge ${status}">${statusLabel}</span>
                </td>
                <td>${walkin.description}</td>
                ${officeDisplay}
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
                            ${window.userPermissions > 0 ? `<div class="dropdown-divider"></div>
                            <button class="dropdown-item edit_data" data-id="${walkin.id}">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>` : ''}
                            ${window.userPermissions === 1 ? `<div class="dropdown-divider"></div>
                            <button class="dropdown-item delete_data" data-id="${walkin.id}">
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
            if (!checkSubscriptionPermission('edit walkins')) {
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
            if (!checkSubscriptionPermission('delete walkins')) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            const id = this.dataset.id;
            if (confirm('Are you sure you want to delete this walkin?')) {
                deleteWalkin(id);
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
            if (!checkSubscriptionPermission('edit walkins')) {
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
            if (!checkSubscriptionPermission('delete walkins')) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            const id = this.dataset.id;
            if (confirm('Are you sure you want to delete this walkin?')) {
                deleteWalkin(id);
            }
        });
    });
}

// Open Create Modal
window.openCreateModal = function() {
    currentMode = 'create';
    elements.modalTitle.textContent = 'Create New Walkin';
    elements.submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Walkin';
    elements.formMethod.value = 'POST';
    elements.walkinForm.action = window.walkinRoutes.store;
    elements.walkinForm.reset();
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    elements.viewOnlyGroup.style.display = 'none';
    elements.walkinForm.style.display = 'block';

    // Show office dropdown for superadmin in create mode
    if (window.isSuperAdmin && elements.officeSelectGroup) {
        elements.officeSelectGroup.style.display = 'block';
    }

    // Show modal with animation
    elements.walkinModal.style.display = 'flex';
    elements.modalOverlay.style.display = 'block';

    // GSAP Animation
    gsap.fromTo(elements.modalOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(elements.walkinModal,
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

    elements.modalTitle.textContent = 'Edit Walkin';
    elements.submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Walkin';
    elements.formMethod.value = 'PUT';
    elements.walkinForm.action = window.walkinRoutes.base + id;

    elements.email.value = walkin.email;
    elements.accountID.value = walkin.accountID;
    elements.name.value = walkin.name;
    elements.color.value = walkin.color;
    elements.description.value = walkin.description;
    elements.status.value = walkin.status;

    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    elements.viewOnlyGroup.style.display = 'none';
    elements.walkinForm.style.display = 'block';

    // Hide office dropdown in edit mode - office_id should not be changed
    if (elements.officeSelectGroup) {
        elements.officeSelectGroup.style.display = 'none';
    }

    // Show modal with animation
    elements.walkinModal.style.display = 'flex';
    elements.modalOverlay.style.display = 'block';

    // GSAP Animation
    gsap.fromTo(elements.modalOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(elements.walkinModal,
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

    elements.modalTitle.textContent = 'View Walkin Details';
    
    // Hide submit button in view mode - only show Close button
    elements.submitBtn.style.display = 'none';

    elements.email.value = walkin.email;
    elements.email.setAttribute('readonly', true);
    elements.email.classList.add('view-only-field');
    elements.accountID.value = walkin.accountID;
    elements.accountID.setAttribute('readonly', true);
    elements.accountID.classList.add('view-only-field');
    elements.name.value = walkin.name;
    elements.name.setAttribute('readonly', true);
    elements.name.classList.add('view-only-field');
    elements.color.value = walkin.color;
    elements.color.setAttribute('readonly', true);
    elements.color.classList.add('view-only-field');
    elements.description.value = walkin.description;
    elements.description.setAttribute('readonly', true);
    elements.description.classList.add('view-only-field');
    if (elements.officeId) {
        elements.officeId.value = walkin.office_id;
        elements.officeId.setAttribute('disabled', true);
        elements.officeId.classList.add('view-only-select');
    }
    elements.status.value = walkin.status;
    elements.status.setAttribute('disabled', true);
    elements.status.classList.add('view-only-select');

    elements.createdDateDisplay.textContent = new Date(walkin.created_at).toLocaleString();

    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    elements.viewOnlyGroup.style.display = 'block';
    elements.walkinForm.style.display = 'block';

    // Show modal with animation
    elements.walkinModal.style.display = 'flex';
    elements.modalOverlay.style.display = 'block';

    // GSAP Animation
    gsap.fromTo(elements.modalOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(elements.walkinModal,
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
    gsap.to(elements.modalOverlay, {
        opacity: 0,
        duration: 0.3,
        onComplete: function() {
            elements.modalOverlay.style.display = 'none';
        }
    });

    gsap.to(elements.walkinModal, {
        opacity: 0,
        scale: 0.9,
        y: -50,
        duration: 0.3,
        ease: 'back.in',
        onComplete: function() {
            elements.walkinModal.style.display = 'none';
            elements.walkinForm.reset();
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

// Submit Walkin Form
async function submitWalkinForm() {
    if (currentMode === 'view') return;

    const url = elements.walkinForm.action;
    const method = elements.formMethod.value;

    const formData = {
        email: elements.email.value,
        accountID: elements.accountID.value,
        name: elements.name.value,
        color: elements.color.value,
        description: elements.description.value,
        status: elements.status.value,
        _token: csrfToken,
    };

    // Add office_id for superadmin when creating (only in create mode)
    if (window.isSuperAdmin && currentMode === 'create' && elements.officeId) {
        const officeId = elements.officeId.value;
        if (officeId) {
            formData.office_id = officeId;
        }
    } else if (!window.isSuperAdmin && elements.officeId) {
        // Regular users always use their own office_id from the hidden field
        formData.office_id = elements.officeId.value;
    }

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
        loadWalkins();
        closeWalkinModal();
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
        // Re-enable submit button after request completes (success or error)
        elements.submitBtn.disabled = false;
        elements.submitBtn.innerHTML = '<i class="fas fa-save"></i> ' + (currentMode === 'create' ? 'Save Walkin' : 'Update Walkin');
    }
}

// Delete Walkin
async function deleteWalkin(id) {
    try {
        const response = await fetch(window.walkinRoutes.base + id, {
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
        loadWalkins();
        Swal.fire({
            title: 'Deleted!',
            text: 'Walkin has been deleted successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Error deleting walkin',
            icon: 'error',
        });
    }
}
