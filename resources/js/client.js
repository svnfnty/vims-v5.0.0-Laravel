// Client Management Module - Vite + Vanilla JS
// Converted from jQuery to vanilla JavaScript for Vite compatibility

// Set default CSRF token for all fetch requests
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

// Global state
let clientsData = [];
let filteredData = [];
let currentView = 'cards';
let currentMode = 'create'; // create, edit, view

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    loadClients();
    attachEventListeners();
});

// Attach all event listeners
function attachEventListeners() {
    // Load Data Button
    const loadDataBtn = document.getElementById('loadDataBtn');
    if (loadDataBtn) {
        loadDataBtn.addEventListener('click', loadClients);
    }

    // Create New Client
    const createNewBtn = document.getElementById('create_new');
    if (createNewBtn) {
        createNewBtn.addEventListener('click', openCreateModal);
    }

    // View Toggle Buttons
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentView = this.dataset.view;
            
            // Remove active class from all buttons
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Hide all views first
            const cardView = document.getElementById('cardView');
            const tableView = document.getElementById('tableView');
            
            if (cardView) {
                cardView.style.display = 'none';
                cardView.classList.remove('active', 'cards-view', 'grid-view', 'list-view');
            }
            if (tableView) tableView.style.display = 'none';

            // Show appropriate view
            if (currentView === 'cards') {
                if (cardView) {
                    cardView.classList.add('cards-view', 'active');
                    cardView.style.display = 'grid';
                    renderCards(filteredData);
                }
            } else if (currentView === 'grid') {
                if (cardView) {
                    cardView.classList.add('grid-view', 'active');
                    cardView.style.display = 'grid';
                    renderCards(filteredData);
                }
            } else if (currentView === 'list') {
                if (cardView) {
                    cardView.classList.add('list-view', 'active');
                    cardView.style.display = 'flex';
                    renderCards(filteredData);
                }
            } else if (currentView === 'table') {
                if (tableView) {
                    tableView.classList.add('active');
                    tableView.style.display = 'block';
                    renderTable(filteredData);
                }
            }
        });
    });

    // Status Filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            applyFilter(this.value);
        });
    }

    // Reset Filters
    const resetFilters = document.getElementById('resetFilters');
    if (resetFilters) {
        resetFilters.addEventListener('click', function() {
            const statusFilter = document.getElementById('statusFilter');
            if (statusFilter) statusFilter.value = 'all';
            applyFilter('all');
        });
    }

    // Form Submission
    const clientForm = document.getElementById('clientForm');
    if (clientForm) {
        clientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn && submitBtn.disabled) return;
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            }
            
            submitClientForm();
        });
    }
}

// Load Statistics
async function loadStats() {
    try {
        const response = await fetch(window.routes.clientsStats, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to load stats');
        
        const data = await response.json();
        
        const totalClients = document.getElementById('totalClients');
        const activeClients = document.getElementById('activeClients');
        const inactiveClients = document.getElementById('inactiveClients');
        
        if (totalClients) totalClients.textContent = data.total || 0;
        if (activeClients) activeClients.textContent = data.active || 0;
        if (inactiveClients) inactiveClients.textContent = data.inactive || 0;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load Clients
async function loadClients() {
    try {
        const response = await fetch(window.routes.clientsData, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to load clients');
        
        const responseData = await response.json();
        clientsData = responseData.data || [];
        filteredData = clientsData;
        
        renderCards(filteredData);
        renderTable(filteredData);
    } catch (error) {
        console.error('Error loading clients:', error);
    }
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

    const cardView = document.getElementById('cardView');
    const tableView = document.getElementById('tableView');
    const filteredEmptyState = document.getElementById('filteredEmptyState');

    if (filteredData.length === 0 && status !== 'all') {
        if (cardView) cardView.classList.add('hidden');
        if (tableView) tableView.classList.add('hidden');
        if (filteredEmptyState) filteredEmptyState.classList.remove('hidden');
    } else {
        if (cardView) {
            cardView.classList.remove('hidden');
            cardView.style.display = currentView === 'table' ? 'none' : (currentView === 'list' ? 'flex' : 'grid');
        }
        if (tableView) {
            tableView.classList.remove('hidden');
            tableView.style.display = currentView === 'table' ? 'block' : 'none';
        }
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
                    <i class="fas fa-users"></i>
                </div>
                <h3>No Clients Found</h3>
                <p>Get started by adding your first client to the system</p>
            </div>
        `;
        return;
    }

    let html = '';
    data.forEach(function(client, index) {
        const status = client.status == 1 ? 'active' : 'inactive';
        const statusLabel = client.status == 1 ? 'Active' : 'Inactive';
        const email = client.email || '<span style="color: var(--gray);">No email</span>';
        const fullName = (client.lastname + ', ' + client.firstname + ' ' + client.middlename).toUpperCase();
        const createdDate = new Date(client.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        
        const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
        const officeName = client.office ? client.office.office_name : 'N/A';
        const officeDisplay = isSuperAdmin ? `
            <div class="detail-row">
                <span class="detail-label">Office:</span>
                <span class="detail-value">${officeName}</span>
            </div>
        ` : '';

        const canEdit = window.userPermissions > 0;
        const canDelete = window.userPermissions === 1;

        html += `
            <div class="client-card" data-status="${status}" data-office="${officeName}" data-id="${client.id}">
                <div class="card-header">
                    <div class="user-meta">
                        <span class="user-id">Client #${client.id}</span>
                        <span class="user-date">${createdDate}</span>
                    </div>
                    <div class="status-badge ${status}">
                        ${statusLabel}
                    </div>
                </div>

                <div class="card-body">
                    <h5 class="user-name">${fullName}</h5>
                    <div class="user-details">
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${email}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Address:</span>
                            <span class="detail-value">${client.address}</span>
                        </div>
                        ${officeDisplay}
                    </div>
                </div>

                <div class="card-footer">
                    <div class="action-buttons">
                        <button class="action-btn-small view view_data" data-id="${client.id}">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        ${canEdit ? `<button class="action-btn-small edit edit_data" data-id="${client.id}">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>` : ''}
                        ${canDelete ? `<button class="action-btn-small delete delete_data" data-id="${client.id}">
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
        const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
        const colspan = isSuperAdmin ? 8 : 7;
        tableBody.innerHTML = `
            <tr>
                <td colspan="${colspan}" class="text-center py-16">
                    <div class="flex flex-col items-center justify-center text-gray-500">
                        <div class="text-6xl mb-4 text-gray-300">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-600 mb-2">No Clients Found</h3>
                        <p class="text-gray-500 mb-4">Get started by adding your first client to the system</p>
                        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2" id="create_new_empty_table">
                            <i class="fas fa-plus-circle"></i>
                            Add New Client
                        </button>
                    </div>
                </td>
            </tr>
        `;
        
        const createBtn = document.getElementById('create_new_empty_table');
        if (createBtn) {
            createBtn.addEventListener('click', openCreateModal);
        }
        return;
    }

    let html = '';
    data.forEach(function(client, index) {
        const status = client.status == 1 ? 'active' : 'inactive';
        const statusLabel = client.status == 1 ? 'Active' : 'Inactive';
        const statusClass = client.status == 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
        const email = client.email || '<span class="text-gray-400">No email</span>';
        const fullName = (client.lastname + ', ' + client.firstname + ' ' + client.middlename).toUpperCase();
        const createdDate = new Date(client.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        
        const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
        const officeName = client.office ? client.office.office_name : 'N/A';
        const officeDisplay = isSuperAdmin ? `<td class="px-4 py-4 text-sm text-gray-700">${officeName}</td>` : '';

        const canEdit = window.userPermissions > 0;
        const canDelete = window.userPermissions === 1;

        html += `
            <tr class="hover:bg-gray-50 transition-colors border-b border-gray-100" data-status="${status}" data-office="${officeName}" data-id="${client.id}">
                <td class="px-4 py-4 text-center text-sm text-gray-600">${index + 1}</td>
                <td class="px-4 py-4 text-sm text-gray-700">${createdDate}</td>
                <td class="px-4 py-4 text-sm font-semibold text-gray-800">${fullName}</td>
                <td class="px-4 py-4 text-sm text-gray-700">${email}</td>
                <td class="px-4 py-4 text-sm text-gray-700">${client.address}</td>
                ${officeDisplay}
                <td class="px-4 py-4 text-center">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusClass}">${statusLabel}</span>
                </td>
                <td class="px-4 py-4">
                    <div class="relative action-dropdown">
                        <button class="action-btn px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <i class="fas fa-ellipsis-v"></i>
                            Actions
                        </button>
                        <div class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                            <a class="dropdown-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2 view_data" data-id="${client.id}">
                                <i class="fas fa-eye text-blue-500"></i>
                                View
                            </a>
                            ${canEdit ? `<div class="border-t border-gray-100 my-1"></div>
                            <button class="dropdown-item w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2 edit_data" data-id="${client.id}">
                                <i class="fas fa-edit text-green-500"></i>
                                Edit
                            </button>` : ''}
                            ${canDelete ? `<div class="border-t border-gray-100 my-1"></div>
                            <button class="dropdown-item w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2 delete_data" data-id="${client.id}">
                                <i class="fas fa-trash text-red-500"></i>
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
    // View buttons
    document.querySelectorAll('.view_data').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            openViewModal(id);
        });
    });

    // Edit buttons
    document.querySelectorAll('.edit_data').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            openEditModal(id);
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete_data').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            if (typeof Swal !== 'undefined') {
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
            } else {
                if (confirm('Are you sure you want to delete this client?')) {
                    deleteClient(id);
                }
            }
        });
    });
}

// Attach Table Event Listeners
function attachTableEventListeners() {
    // Action dropdown toggle
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.nextElementSibling;
            if (dropdown) {
                dropdown.classList.toggle('hidden');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.action-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.add('hidden');
            });
        }
    });

    // View buttons
    document.querySelectorAll('.view_data').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            openViewModal(id);
        });
    });

    // Edit buttons
    document.querySelectorAll('.edit_data').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            openEditModal(id);
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete_data').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            if (typeof Swal !== 'undefined') {
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
            } else {
                if (confirm('Are you sure you want to delete this client?')) {
                    deleteClient(id);
                }
            }
        });
    });
}

// Open Create Modal
window.openCreateModal = function() {
    currentMode = 'create';
    
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    const formMethod = document.getElementById('formMethod');
    const clientForm = document.getElementById('clientForm');
    const viewOnlyGroup = document.getElementById('viewOnlyGroup');
    const officeSelectGroup = document.getElementById('officeSelectGroup');
    
    if (modalTitle) modalTitle.textContent = 'Create New Client';
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Client';
        submitBtn.disabled = false;
    }
    if (formMethod) formMethod.value = 'POST';
    if (clientForm) {
        clientForm.setAttribute('action', window.routes.clientsStore);
        clientForm.reset();
    }
    
    // Clear errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    
    if (viewOnlyGroup) viewOnlyGroup.style.display = 'none';
    if (clientForm) clientForm.style.display = 'block';

    // Show office dropdown for superadmin in create mode
    const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
    if (isSuperAdmin && officeSelectGroup) {
        officeSelectGroup.style.display = 'block';
    }

    // Show modal
    const clientModal = document.getElementById('clientModal');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (clientModal) clientModal.style.display = 'flex';
    if (modalOverlay) modalOverlay.style.display = 'block';

    // GSAP Animation
    if (typeof gsap !== 'undefined') {
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#clientModal',
            { opacity: 0, scale: 0.9, y: -50 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out' }
        );

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
    }
};

// Open Edit Modal
window.openEditModal = function(id) {
    currentMode = 'edit';
    const client = clientsData.find(c => c.id == id);
    if (!client) return;

    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    const formMethod = document.getElementById('formMethod');
    const clientForm = document.getElementById('clientForm');
    const viewOnlyGroup = document.getElementById('viewOnlyGroup');
    const officeSelectGroup = document.getElementById('officeSelectGroup');
    
    if (modalTitle) modalTitle.textContent = 'Edit Client';
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Client';
        submitBtn.disabled = false;
    }
    if (formMethod) formMethod.value = 'PUT';
    if (clientForm) clientForm.setAttribute('action', '/clients/' + id);

    // Set form values
    const firstname = document.getElementById('firstname');
    const middlename = document.getElementById('middlename');
    const lastname = document.getElementById('lastname');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const walkinList = document.getElementById('walkin_list');
    const status = document.getElementById('status');
    
    if (firstname) firstname.value = client.firstname || '';
    if (middlename) middlename.value = client.middlename || '';
    if (lastname) lastname.value = client.lastname || '';
    if (email) email.value = client.email || '';
    if (address) address.value = client.address || '';
    if (walkinList) walkinList.value = client.markup || '';
    if (status) status.value = client.status || '';

    // Clear errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    
    if (viewOnlyGroup) viewOnlyGroup.style.display = 'none';
    if (clientForm) clientForm.style.display = 'block';
    if (officeSelectGroup) officeSelectGroup.style.display = 'none';

    // Show modal
    const clientModal = document.getElementById('clientModal');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (clientModal) clientModal.style.display = 'flex';
    if (modalOverlay) modalOverlay.style.display = 'block';

    // GSAP Animation
    if (typeof gsap !== 'undefined') {
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#clientModal',
            { opacity: 0, scale: 0.9, y: -50 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out' }
        );

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
    }
};

// Open View Modal
window.openViewModal = function(id) {
    currentMode = 'view';
    const client = clientsData.find(c => c.id == id);
    if (!client) return;

    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    const viewOnlyGroup = document.getElementById('viewOnlyGroup');
    const createdDateDisplay = document.getElementById('createdDateDisplay');

    if (modalTitle) modalTitle.textContent = 'View Client Details';
    
    // Hide submit button in view mode - only show Cancel/Close button
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }

    // Set form values (readonly) with view-only styling
    const firstname = document.getElementById('firstname');
    const middlename = document.getElementById('middlename');
    const lastname = document.getElementById('lastname');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const walkinList = document.getElementById('walkin_list');
    const status = document.getElementById('status');

    if (firstname) {
        firstname.value = client.firstname || '';
        firstname.setAttribute('readonly', true);
        firstname.classList.add('view-only-field');
    }
    if (middlename) {
        middlename.value = client.middlename || '';
        middlename.setAttribute('readonly', true);
        middlename.classList.add('view-only-field');
    }
    if (lastname) {
        lastname.value = client.lastname || '';
        lastname.setAttribute('readonly', true);
        lastname.classList.add('view-only-field');
    }
    if (email) {
        email.value = client.email || '';
        email.setAttribute('readonly', true);
        email.classList.add('view-only-field');
    }
    if (address) {
        address.value = client.address || '';
        address.setAttribute('readonly', true);
        address.classList.add('view-only-field');
    }
    if (walkinList) {
        walkinList.value = client.markup || '';
        walkinList.setAttribute('disabled', true);
        walkinList.classList.add('view-only-select');
    }
    if (status) {
        status.value = client.status || '';
        status.setAttribute('disabled', true);
        status.classList.add('view-only-select');
    }

    if (createdDateDisplay) {
        createdDateDisplay.textContent = new Date(client.date_created).toLocaleString();
    }

    // Clear errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    
    if (viewOnlyGroup) viewOnlyGroup.style.display = 'block';

    // Show modal
    const clientModal = document.getElementById('clientModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const clientForm = document.getElementById('clientForm');
    
    if (clientModal) clientModal.style.display = 'flex';
    if (modalOverlay) modalOverlay.style.display = 'block';
    if (clientForm) clientForm.style.display = 'block';

    // GSAP Animation
    if (typeof gsap !== 'undefined') {
        gsap.fromTo('#modalOverlay',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('#clientModal',
            { opacity: 0, scale: 0.9, y: -50 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out' }
        );

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
    }
};

// Close Modal
window.closeClientModal = function() {
    const clientModal = document.getElementById('clientModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const clientForm = document.getElementById('clientForm');
    const submitBtn = document.getElementById('submitBtn');

    const closeComplete = function() {
        if (clientModal) clientModal.style.display = 'none';
        if (modalOverlay) modalOverlay.style.display = 'none';
        if (clientForm) {
            clientForm.reset();
            document.querySelectorAll('.form-control').forEach(el => {
                el.removeAttribute('readonly');
                el.removeAttribute('disabled');
                el.classList.remove('view-only-field', 'view-only-select');
                // Reset inline styles
                el.style.backgroundColor = '';
                el.style.color = '';
            });
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        }
        // Show submit button again for create/edit modes
        if (submitBtn) {
            submitBtn.style.display = 'inline-block';
            submitBtn.setAttribute('type', 'submit');
            submitBtn.onclick = null;
            submitBtn.disabled = false;
        }
    };

    if (typeof gsap !== 'undefined') {
        gsap.to('#modalOverlay', {
            opacity: 0,
            duration: 0.3,
            onComplete: function() {
                if (modalOverlay) modalOverlay.style.display = 'none';
            }
        });

        gsap.to('#clientModal', {
            opacity: 0,
            scale: 0.9,
            y: -50,
            duration: 0.3,
            ease: 'back.in',
            onComplete: closeComplete
        });
    } else {
        closeComplete();
    }
};

// Submit Client Form
async function submitClientForm() {
    if (currentMode === 'view') return;

    const submitBtn = document.getElementById('submitBtn');
    const clientForm = document.getElementById('clientForm');
    
    if (!clientForm) return;

    const url = clientForm.getAttribute('action');
    const method = document.getElementById('formMethod')?.value || 'POST';

    const formData = {
        firstname: document.getElementById('firstname')?.value || '',
        middlename: document.getElementById('middlename')?.value || '',
        lastname: document.getElementById('lastname')?.value || '',
        email: document.getElementById('email')?.value || '',
        address: document.getElementById('address')?.value || '',
        walkin_list: document.getElementById('walkin_list')?.value || '',
        status: document.getElementById('status')?.value || '',
        _token: csrfToken
    };

    // Add office_id for superadmin when creating (only in create mode)
    const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
    if (isSuperAdmin && currentMode === 'create') {
        const officeId = document.getElementById('office_id')?.value;
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
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const responseData = await response.json();

        if (response.ok) {
            loadStats();
            loadClients();
            closeClientModal();
            
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Success!',
                    text: responseData.message || 'Operation successful',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                alert(responseData.message || 'Operation successful');
            }
        } else {
            throw new Error(responseData.message || 'Request failed');
        }
    } catch (error) {
        console.error('Error:', error);
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'An error occurred',
                icon: 'error'
            });
        } else {
            alert('Error: ' + (error.message || 'An error occurred'));
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> ' + (currentMode === 'create' ? 'Save Client' : 'Update Client');
        }
    }
}

// Delete Client
async function deleteClient(id) {
    try {
        const response = await fetch('/clients/' + id, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            loadStats();
            loadClients();
            
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Client has been deleted successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                alert('Client has been deleted successfully.');
            }
        } else {
            throw new Error('Failed to delete client');
        }
    } catch (error) {
        console.error('Error deleting client:', error);
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Error!',
                text: 'Error deleting client',
                icon: 'error'
            });
        } else {
            alert('Error deleting client');
        }
    }
}

// Export functions for global access
window.loadStats = loadStats;
window.loadClients = loadClients;
window.applyFilter = applyFilter;
window.renderCards = renderCards;
window.renderTable = renderTable;
window.deleteClient = deleteClient;
window.submitClientForm = submitClientForm;
