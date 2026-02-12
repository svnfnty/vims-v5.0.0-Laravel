import gsap from 'gsap';
import Swal from 'sweetalert2';

// Set default CSRF token for all fetch requests
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

// State management
let officesData = [];
let filteredData = [];
let currentView = 'cards';
let currentMode = 'create'; // create, edit, view

// DOM Elements
const elements = {
    totalOffices: document.getElementById('totalOffices'),
    activeOffices: document.getElementById('activeOffices'),
    inactiveOffices: document.getElementById('inactiveOffices'),
    cardView: document.getElementById('cardView'),
    tableView: document.getElementById('tableView'),
    tableBody: document.getElementById('tableBody'),
    filteredEmptyState: document.getElementById('filteredEmptyState'),
    statusFilter: document.getElementById('statusFilter'),
    officeModal: document.getElementById('officeModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalTitle: document.getElementById('modalTitle'),
    submitBtn: document.getElementById('submitBtn'),
    officeForm: document.getElementById('officeForm'),
    formMethod: document.getElementById('formMethod'),
    viewOnlyGroup: document.getElementById('viewOnlyGroup'),
    createdDateDisplay: document.getElementById('createdDateDisplay'),
    officeName: document.getElementById('office_name'),
    officeAddress: document.getElementById('office_address'),
    status: document.getElementById('status'),
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadStats();
    loadOffices();

    // Event Listeners
    document.getElementById('loadDataBtn')?.addEventListener('click', loadOffices);
    document.getElementById('create_new')?.addEventListener('click', openCreateModal);
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
    elements.officeForm?.addEventListener('submit', function(e) {
        e.preventDefault();

        // Disable submit button immediately to prevent multiple submissions
        if (elements.submitBtn.disabled) {
            return; // Already processing
        }
        elements.submitBtn.disabled = true;
        elements.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        submitOfficeForm();
    });

    // Close modal on overlay click
    elements.modalOverlay?.addEventListener('click', closeOfficeModal);
});

// Reset Filters
function resetFilters() {
    elements.statusFilter.value = 'all';
    applyFilter('all');
}

// Load Stats
async function loadStats() {
    try {
        const response = await fetch(window.officeRoutes.stats, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            },
        });
        const data = await response.json();
        elements.totalOffices.textContent = data.total;
        elements.activeOffices.textContent = data.active;
        elements.inactiveOffices.textContent = data.inactive;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load Offices
async function loadOffices() {
    try {
        const response = await fetch(window.officeRoutes.data, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            },
        });
        const responseData = await response.json();
        officesData = responseData.data || [];
        filteredData = officesData;
        renderCards(filteredData);
        renderTable(filteredData);
    } catch (error) {
        console.error('Error loading offices:', error);
    }
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
                    <i class="fas fa-building"></i>
                </div>
                <h3>No Offices Found</h3>
                <p>Get started by adding your first office to the system</p>
            </div>
        `;
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
                    <h5 class="office-name">${office.office_name}</h5>
                    <div class="office-details">
                        <div class="detail-row">
                            <span class="detail-label">Address:</span>
                            <span class="detail-value">${office.office_address}</span>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="action-buttons">
                        <button class="action-btn-small view view_data" data-id="${office.id}">
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

    elements.cardView.innerHTML = html;
    attachCardEventListeners();
}

// Render Table View
function renderTable(data) {
    if (data.length === 0) {
        elements.tableBody.innerHTML = `
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
        `;
        document.getElementById('create_new_empty_table')?.addEventListener('click', openCreateModal);
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
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            openEditModal(id);
        });
    });

    document.querySelectorAll('.delete_data').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            if (confirm('Are you sure you want to delete this office?')) {
                deleteOffice(id);
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
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            openEditModal(id);
        });
    });

    document.querySelectorAll('.delete_data').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            if (confirm('Are you sure you want to delete this office?')) {
                deleteOffice(id);
            }
        });
    });
}

// Open Create Modal
window.openCreateModal = function() {
    currentMode = 'create';
    elements.modalTitle.textContent = 'Create New Office';
    elements.submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Office';
    elements.formMethod.value = 'POST';
    elements.officeForm.action = window.officeRoutes.store;
    elements.officeForm.reset();
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    elements.viewOnlyGroup.style.display = 'none';
    elements.officeForm.style.display = 'block';

    // Show modal with animation
    elements.officeModal.style.display = 'flex';
    elements.modalOverlay.style.display = 'block';

    // GSAP Animation
    gsap.fromTo(elements.modalOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(elements.officeModal,
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

    elements.modalTitle.textContent = 'Edit Office';
    elements.submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Office';
    elements.formMethod.value = 'PUT';
    elements.officeForm.action = window.officeRoutes.base + id;

    elements.officeName.value = office.office_name;
    elements.officeAddress.value = office.office_address;
    elements.status.value = office.status;

    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    elements.viewOnlyGroup.style.display = 'none';
    elements.officeForm.style.display = 'block';

    // Show modal with animation
    elements.officeModal.style.display = 'flex';
    elements.modalOverlay.style.display = 'block';

    // GSAP Animation
    gsap.fromTo(elements.modalOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(elements.officeModal,
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

    elements.modalTitle.textContent = 'View Office Details';
    
    // Hide submit button in view mode - only show Close button
    elements.submitBtn.style.display = 'none';

    elements.officeName.value = office.office_name;
    elements.officeName.setAttribute('readonly', true);
    elements.officeName.classList.add('view-only-field');
    elements.officeAddress.value = office.office_address;
    elements.officeAddress.setAttribute('readonly', true);
    elements.officeAddress.classList.add('view-only-field');
    elements.status.value = office.status;
    elements.status.setAttribute('disabled', true);
    elements.status.classList.add('view-only-select');

    elements.createdDateDisplay.textContent = new Date(office.created_at).toLocaleString();

    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    elements.viewOnlyGroup.style.display = 'block';
    elements.officeForm.style.display = 'block';

    // Show modal with animation
    elements.officeModal.style.display = 'flex';
    elements.modalOverlay.style.display = 'block';

    // GSAP Animation
    gsap.fromTo(elements.modalOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(elements.officeModal,
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
    gsap.to(elements.modalOverlay, {
        opacity: 0,
        duration: 0.3,
        onComplete: function() {
            elements.modalOverlay.style.display = 'none';
        }
    });

    gsap.to(elements.officeModal, {
        opacity: 0,
        scale: 0.9,
        y: -50,
        duration: 0.3,
        ease: 'back.in',
        onComplete: function() {
            elements.officeModal.style.display = 'none';
            elements.officeForm.reset();
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

// Submit Office Form
async function submitOfficeForm() {
    if (currentMode === 'view') return;

    const url = elements.officeForm.action;
    const method = elements.formMethod.value;

    const formData = {
        office_name: elements.officeName.value,
        office_address: elements.officeAddress.value,
        status: elements.status.value,
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
        loadOffices();
        closeOfficeModal();
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
            // Try to parse validation errors
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

// Delete Office
async function deleteOffice(id) {
    try {
        const response = await fetch(window.officeRoutes.base + id, {
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
        loadOffices();
        Swal.fire({
            title: 'Deleted!',
            text: 'Office has been deleted successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Error deleting office',
            icon: 'error',
        });
    }
}
