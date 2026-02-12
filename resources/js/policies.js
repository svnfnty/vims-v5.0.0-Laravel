import gsap from 'gsap';
import Swal from 'sweetalert2';

// Set default CSRF token for all fetch requests
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

// State management
let policiesData = [];
let filteredData = [];
let currentView = 'cards';
let currentMode = 'create'; // create, edit, view

// DOM Elements
const elements = {
    totalPolicies: document.getElementById('totalPolicies'),
    activePolicies: document.getElementById('activePolicies'),
    inactivePolicies: document.getElementById('inactivePolicies'),
    cardView: document.getElementById('cardView'),
    tableView: document.getElementById('tableView'),
    tableBody: document.getElementById('tableBody'),
    filteredEmptyState: document.getElementById('filteredEmptyState'),
    statusFilter: document.getElementById('statusFilter'),
    policyModal: document.getElementById('policyModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalTitle: document.getElementById('modalTitle'),
    submitBtn: document.getElementById('submitBtn'),
    policyForm: document.getElementById('policyForm'),
    formMethod: document.getElementById('formMethod'),
    viewOnlyGroup: document.getElementById('viewOnlyGroup'),
    createdDateDisplay: document.getElementById('createdDateDisplay'),
    categoryId: document.getElementById('category_id'),
    code: document.getElementById('code'),
    name: document.getElementById('name'),
    description: document.getElementById('description'),
    description1: document.getElementById('description1'),
    description2: document.getElementById('description2'),
    duration: document.getElementById('duration'),
    thirdPartyLiability: document.getElementById('third_party_liability'),
    personalAccident: document.getElementById('personal_accident'),
    tppd: document.getElementById('tppd'),
    documentaryStamps: document.getElementById('documentary_stamps'),
    valueAddedTax: document.getElementById('value_added_tax'),
    localGovTax: document.getElementById('local_gov_tax'),
    cost: document.getElementById('cost'),
    docPath: document.getElementById('doc_path'),
    status: document.getElementById('status'),
    officeId: document.getElementById('office_id'),
    officeSelectGroup: document.getElementById('officeSelectGroup'),
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadStats();
    loadPolicies();

    // Event Listeners
    document.getElementById('loadDataBtn')?.addEventListener('click', loadPolicies);
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
    elements.policyForm?.addEventListener('submit', function(e) {
        e.preventDefault();

        // Disable submit button immediately to prevent multiple submissions
        if (elements.submitBtn.disabled) {
            return; // Already processing
        }
        elements.submitBtn.disabled = true;
        elements.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        submitPolicyForm();
    });

    // Close modal on overlay click
    elements.modalOverlay?.addEventListener('click', closePolicyModal);

    // Tutorial event listener
    if (elements.policyForm) {
        elements.policyForm.addEventListener('submit', function() {
            // Dispatch event to notify tutorial system
            window.dispatchEvent(new CustomEvent('tutorial:actionCompleted', {
                detail: { step: 3, action: 'policy_created' }
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
        const response = await fetch(window.policiesRoutes.stats, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            },
        });
        const data = await response.json();
        elements.totalPolicies.textContent = data.total;
        elements.activePolicies.textContent = data.active;
        elements.inactivePolicies.textContent = data.inactive;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load Policies
async function loadPolicies() {
    try {
        const response = await fetch(window.policiesRoutes.data, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            },
        });
        const responseData = await response.json();
        policiesData = responseData.data || [];
        filteredData = policiesData;
        renderCards(filteredData);
        renderTable(filteredData);
    } catch (error) {
        console.error('Error loading policies:', error);
    }
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
                    <i class="fas fa-file-contract"></i>
                </div>
                <h3>No Policies Found</h3>
                <p>Get started by adding your first policy to the system</p>
            </div>
        `;
        return;
    }

    let html = '';
    data.forEach(function(policy, index) {
        const status = policy.status == 1 ? 'active' : 'inactive';
        const statusLabel = policy.status == 1 ? 'Active' : 'Inactive';
        const categoryName = policy.category ? policy.category.name : 'N/A';
        const cost = policy.cost ? '₱' + parseFloat(policy.cost).toLocaleString() : 'N/A';
        const createdDate = new Date(policy.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        
        // Only show office name for super admin (id=1 and office_id=0)
        const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
        const officeName = policy.office ? policy.office.office_name : 'N/A';
        const officeDisplay = isSuperAdmin ? `
            <div class="detail-row">
                <span class="detail-label">Office:</span>
                <span class="detail-value">${officeName}</span>
            </div>
        ` : '';

        html += `
            <div class="policy-card" data-status="${status}" data-office="${officeName}" data-id="${policy.id}">
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
                    <h5 class="policy-name">${policy.name || 'N/A'}</h5>
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
                        ${officeDisplay}
                    </div>
                </div>

                <div class="card-footer">
                    <div class="action-buttons">
                        <button class="action-btn-small view view_data" data-id="${policy.id}">
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
        `;
        document.getElementById('create_new_empty_table')?.addEventListener('click', openCreateModal);
        return;
    }

    let html = '';
    data.forEach(function(policy, index) {
        const status = policy.status == 1 ? 'active' : 'inactive';
        const statusLabel = policy.status == 1 ? 'Active' : 'Inactive';
        const categoryName = policy.category ? policy.category.name : 'N/A';
        const cost = policy.cost ? '₱' + parseFloat(policy.cost).toLocaleString() : 'N/A';
        const createdDate = new Date(policy.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        
        // Only show office name for super admin (id=1 and office_id=0)
        const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
        const officeName = policy.office ? policy.office.office_name : 'N/A';
        const officeDisplay = isSuperAdmin ? `<td>${officeName}</td>` : '';

        html += `
            <tr data-status="${status}" data-office="${officeName}" data-id="${policy.id}">
                <td class="text-center">${index + 1}</td>
                <td>${createdDate}</td>
                <td><strong>${policy.code || 'N/A'}</strong></td>
                <td>${policy.name || 'N/A'}</td>
                <td>${categoryName}</td>
                <td>${cost}</td>
                ${officeDisplay}
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
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            openEditModal(id);
        });
    });

    document.querySelectorAll('.delete_data').forEach(btn => {
        btn.addEventListener('click', function() {
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
                    deletePolicy(id);
                }
            });
        });
    });
}

// Open Create Modal
window.openCreateModal = function() {
    currentMode = 'create';
    elements.modalTitle.textContent = 'Create New Policy';
    elements.submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Policy';
    elements.formMethod.value = 'POST';
    elements.policyForm.action = window.policiesRoutes.store;
    elements.policyForm.reset();
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    elements.viewOnlyGroup.style.display = 'none';
    elements.policyForm.style.display = 'block';

    // Show office dropdown for superadmin in create mode
    const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
    if (isSuperAdmin && elements.officeSelectGroup) {
        elements.officeSelectGroup.style.display = 'block';
    }

    // Show modal with animation
    elements.policyModal.style.display = 'flex';
    elements.modalOverlay.style.display = 'block';

    // GSAP Animation
    gsap.fromTo(elements.modalOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(elements.policyModal,
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

    elements.modalTitle.textContent = 'Edit Policy';
    elements.submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Policy';
    elements.formMethod.value = 'PUT';
    elements.policyForm.action = '/policies/' + id;

    elements.categoryId.value = policy.category_id;
    elements.code.value = policy.code;
    elements.name.value = policy.name;
    elements.description.value = policy.description;
    elements.description1.value = policy.description1;
    elements.description2.value = policy.description2;
    elements.duration.value = policy.duration;
    elements.thirdPartyLiability.value = policy.third_party_liability;
    elements.personalAccident.value = policy.personal_accident;
    elements.tppd.value = policy.tppd;
    elements.documentaryStamps.value = policy.documentary_stamps;
    elements.valueAddedTax.value = policy.value_added_tax;
    elements.localGovTax.value = policy.local_gov_tax;
    elements.cost.value = policy.cost;
    elements.docPath.value = policy.doc_path;
    elements.status.value = policy.status;

    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    elements.viewOnlyGroup.style.display = 'none';
    elements.policyForm.style.display = 'block';

    // Hide office dropdown in edit mode - office_id should not be changed
    if (elements.officeSelectGroup) {
        elements.officeSelectGroup.style.display = 'none';
    }

    // Show modal with animation
    elements.policyModal.style.display = 'flex';
    elements.modalOverlay.style.display = 'block';

    // GSAP Animation
    gsap.fromTo(elements.modalOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(elements.policyModal,
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

    elements.modalTitle.textContent = 'View Policy Details';
    
    // Hide submit button in view mode - only show Close button
    elements.submitBtn.style.display = 'none';

    // Set form values (readonly) with view-only styling
    elements.categoryId.value = policy.category_id;
    elements.categoryId.setAttribute('disabled', true);
    elements.categoryId.classList.add('view-only-select');
    elements.code.value = policy.code;
    elements.code.setAttribute('readonly', true);
    elements.code.classList.add('view-only-field');
    elements.name.value = policy.name;
    elements.name.setAttribute('readonly', true);
    elements.name.classList.add('view-only-field');
    elements.description.value = policy.description;
    elements.description.setAttribute('readonly', true);
    elements.description.classList.add('view-only-field');
    elements.description1.value = policy.description1;
    elements.description1.setAttribute('readonly', true);
    elements.description1.classList.add('view-only-field');
    elements.description2.value = policy.description2;
    elements.description2.setAttribute('readonly', true);
    elements.description2.classList.add('view-only-field');
    elements.duration.value = policy.duration;
    elements.duration.setAttribute('readonly', true);
    elements.duration.classList.add('view-only-field');
    elements.thirdPartyLiability.value = policy.third_party_liability;
    elements.thirdPartyLiability.setAttribute('readonly', true);
    elements.thirdPartyLiability.classList.add('view-only-field');
    elements.personalAccident.value = policy.personal_accident;
    elements.personalAccident.setAttribute('readonly', true);
    elements.personalAccident.classList.add('view-only-field');
    elements.tppd.value = policy.tppd;
    elements.tppd.setAttribute('readonly', true);
    elements.tppd.classList.add('view-only-field');
    elements.documentaryStamps.value = policy.documentary_stamps;
    elements.documentaryStamps.setAttribute('readonly', true);
    elements.documentaryStamps.classList.add('view-only-field');
    elements.valueAddedTax.value = policy.value_added_tax;
    elements.valueAddedTax.setAttribute('readonly', true);
    elements.valueAddedTax.classList.add('view-only-field');
    elements.localGovTax.value = policy.local_gov_tax;
    elements.localGovTax.setAttribute('readonly', true);
    elements.localGovTax.classList.add('view-only-field');
    elements.cost.value = policy.cost;
    elements.cost.setAttribute('readonly', true);
    elements.cost.classList.add('view-only-field');
    elements.docPath.value = policy.doc_path;
    elements.docPath.setAttribute('readonly', true);
    elements.docPath.classList.add('view-only-field');
    elements.status.value = policy.status;
    elements.status.setAttribute('disabled', true);
    elements.status.classList.add('view-only-select');

    elements.createdDateDisplay.textContent = new Date(policy.date_created).toLocaleString();

    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    elements.viewOnlyGroup.style.display = 'block';
    elements.policyForm.style.display = 'block';

    // Show modal with animation
    elements.policyModal.style.display = 'flex';
    elements.modalOverlay.style.display = 'block';

    // GSAP Animation
    gsap.fromTo(elements.modalOverlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(elements.policyModal,
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
    gsap.to(elements.modalOverlay, {
        opacity: 0,
        duration: 0.3,
        onComplete: function() {
            elements.modalOverlay.style.display = 'none';
        }
    });

    gsap.to(elements.policyModal, {
        opacity: 0,
        scale: 0.9,
        y: -50,
        duration: 0.3,
        ease: 'back.in',
        onComplete: function() {
            elements.policyModal.style.display = 'none';
            elements.policyForm.reset();
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

// Submit Policy Form
async function submitPolicyForm() {
    if (currentMode === 'view') return;

    const url = elements.policyForm.action;
    const method = elements.formMethod.value;

    const formData = {
        category_id: elements.categoryId.value,
        code: elements.code.value,
        name: elements.name.value,
        description: elements.description.value,
        description1: elements.description1.value,
        description2: elements.description2.value,
        duration: elements.duration.value,
        third_party_liability: elements.thirdPartyLiability.value,
        personal_accident: elements.personalAccident.value,
        tppd: elements.tppd.value,
        documentary_stamps: elements.documentaryStamps.value,
        value_added_tax: elements.valueAddedTax.value,
        local_gov_tax: elements.localGovTax.value,
        cost: elements.cost.value,
        doc_path: elements.docPath.value,
        status: elements.status.value,
        _token: csrfToken,
    };

    // Add office_id for superadmin when creating (only in create mode)
    const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
    if (isSuperAdmin && currentMode === 'create' && elements.officeId) {
        const officeId = elements.officeId.value;
        if (officeId) {
            formData.office_id = officeId;
        }
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
        loadPolicies();
        closePolicyModal();
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
        elements.submitBtn.innerHTML = '<i class="fas fa-save"></i> ' + (currentMode === 'create' ? 'Save Policy' : 'Update Policy');
    }
}

// Delete Policy
async function deletePolicy(id) {
    try {
        const response = await fetch('/policies/' + id, {
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
        loadPolicies();
        Swal.fire({
            title: 'Deleted!',
            text: 'Policy has been deleted successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Error deleting policy',
            icon: 'error',
        });
    }
}
