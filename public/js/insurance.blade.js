// Insurance Dashboard JavaScript
let countdownTime = 10 * 1000;
let currentGridView = 'cards';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadInsuranceData();
    loadStatistics();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Add Insurance Button
    const addInsuranceBtn = document.getElementById('addInsuranceBtn');
    if (addInsuranceBtn) {
        addInsuranceBtn.addEventListener('click', handleNewInsurance);
    }

    const addInsuranceEmptyBtn = document.getElementById('addInsuranceEmptyBtn');
    if (addInsuranceEmptyBtn) {
        addInsuranceEmptyBtn.addEventListener('click', handleNewInsurance);
    }

    // Load Data Button
    const loadDataBtn = document.getElementById('loadInsuranceDataBtn');
    if (loadDataBtn) {
        loadDataBtn.addEventListener('click', openLoadDialog);
    }

    // View Toggle Buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.getAttribute('data-view');
            const grid = document.getElementById('policiesGrid');
            
            if (grid) {
                grid.classList.remove('grid-view', 'list-view');
                currentGridView = view;
                
                if (view === 'grid') {
                    grid.classList.add('grid-view');
                } else if (view === 'list') {
                    grid.classList.add('list-view');
                }
            }
        });
    });

    // Status Filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterPoliciesByStatus(this.value);
        });
    }

    // Insurance form submit (Save / Update)
    const insuranceForm = document.getElementById('insuranceForm');
    if (insuranceForm) {
        insuranceForm.addEventListener('submit', handleInsuranceFormSubmit);
    }

    // Registration date: auto-fill expiration_date = registration_date + 1 year
    const regDateEl = document.getElementById('modal-registration_date');
    if (regDateEl) {
        regDateEl.addEventListener('change', function() {
            const val = this.value;
            if (!val) return;
            const d = new Date(val);
            d.setFullYear(d.getFullYear() + 1);
            const expEl = document.getElementById('modal-expiration_date');
            if (expEl) {
                expEl.value = d.toISOString().slice(0, 10);
            }
        });
    }
}

// Load insurance data from API
function loadInsuranceData() {
    fetch(insuranceDataUrl)
        .then(response => response.json())
        .then(data => {
            renderPolicies(data.data);
        })
        .catch(error => {
            console.error('Error loading insurance data:', error);
            showAlert('Error', 'Failed to load insurance data', 'error');
        });
}

// Render policies in the grid
function renderPolicies(insurances) {
    const grid = document.getElementById('policiesGrid');
    if (!grid) return;

    // Clear existing cards but keep other content
    const existingCards = grid.querySelectorAll('.policy-card');
    existingCards.forEach(card => card.remove());

    if (!insurances || insurances.length === 0) {
        if (!grid.querySelector('.empty-state')) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-icon">
                    <i class="fas fa-file-contract"></i>
                </div>
                <h3>No Insurance Policies Found</h3>
                <p>Get started by adding your first insurance policy</p>
                <button class="action-btn view" id="addInsuranceEmptyBtn">
                    <i class="fas fa-plus-circle"></i>
                    Add New Insurance
                </button>
            `;
            grid.appendChild(emptyState);
            
            const emptyBtn = document.getElementById('addInsuranceEmptyBtn');
            if (emptyBtn) {
                emptyBtn.addEventListener('click', handleNewInsurance);
            }
        }
        return;
    }

    // Remove empty state if it exists
    const emptyState = grid.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    insurances.forEach(insurance => {
        const status = getInsuranceStatus(insurance);
        const card = createPolicyCard(insurance, status);
        grid.appendChild(card);
    });
}

// Create policy card element
function createPolicyCard(insurance, status) {
    const card = document.createElement('div');
    card.className = `policy-card`;
    card.setAttribute('data-status', status);
    card.setAttribute('data-id', insurance.id);

    const statusBadge = getStatusBadgeHTML(status);
    const policyColor = getPolicyColor(insurance.code);
    const clientName = `${insurance.client_name || 'N/A'}`;
    const categoryName = insurance.category_name || 'Unknown Category';
    
    card.innerHTML = `
        <div class="card-header">
            <div class="policy-meta">
                <span class="policy-id">${insurance.mvfile_no || insurance.code || 'N/A'}</span>
                <span class="policy-date">${formatDate(insurance.registration_date)}</span>
            </div>
            <div class="status-badge ${status}">
                ${getStatusText(status)}
            </div>
        </div>
        
        <div class="card-body">
            <div class="client-info">
                <h3 class="client-name">${clientName}</h3>
                <div class="client-details">
                    <div class="detail-row">
                        <span class="detail-label">Category:</span>
                        <span class="detail-value">${categoryName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Plate No:</span>
                        <span class="detail-value">${insurance.registration_no || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">COC No:</span>
                        <span class="detail-value">${insurance.coc_no || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Engine No:</span>
                        <span class="detail-value">${insurance.engine_no || 'N/A'}</span>
                    </div>
                </div>
            </div>
            
            <div class="policy-type-indicator" style="--policy-color: ${policyColor}">
                <span class="policy-type">${insurance.policy_name || 'Standard'}</span>
            </div>
        </div>
        
        <div class="card-footer">
            <div class="action-buttons">
                <button class="action-btn view" onclick="viewInsuranceDetails(${insurance.id})">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
                <button class="action-btn status" onclick="checkPolicyStatus('${insurance.policy_status}', '${insurance.policy_daterelease}', '${insurance.coc_no}')">
                    <i class="fas fa-info-circle"></i>
                    Check Status
                </button>
            </div>
        </div>
    `;

    return card;
}

// Get insurance status
function getInsuranceStatus(insurance) {
    if (insurance.expiration_date) {
        const expirationDate = new Date(insurance.expiration_date);
        const today = new Date();
        if (expirationDate < today) {
            return 'expired';
        }
    }
    return insurance.status === 1 ? 'active' : 'pending';
}

// Get status text
function getStatusText(status) {
    const texts = {
        'active': 'Active',
        'pending': 'Pending',
        'expired': 'Expired'
    };
    return texts[status] || 'Pending';
}

// Get status badge HTML
function getStatusBadgeHTML(status) {
    return status;
}

// Get policy color
function getPolicyColor(policyName) {
    const colors = {
        'liberty': '#FF6B6B',
        'milestone': '#4ECDC4',
        'pacific': '#45B7D1',
        'stronghold': '#FFA07A'
    };

    if (!policyName) return '#6c757d';

    const name = policyName.toLowerCase();
    for (const [key, color] of Object.entries(colors)) {
        if (name.includes(key)) {
            return color;
        }
    }
    return '#6c757d';
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
        return dateString;
    }
}

// Filter policies by status
function filterPoliciesByStatus(status) {
    const cards = document.querySelectorAll('.policy-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        
        if (status === 'all' || cardStatus === status) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    handleEmptyState(visibleCount, status);
}

// Handle empty state
function handleEmptyState(visibleCount, status) {
    const grid = document.getElementById('policiesGrid');
    if (!grid) return;

    const existingEmptyState = grid.querySelector('.empty-state');
    
    if (visibleCount === 0 && !existingEmptyState) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div class="empty-icon">
                <i class="fas fa-search"></i>
            </div>
            <h3>No ${status === 'all' ? '' : status + ' '}Policies Found</h3>
            <p>No policies match the selected filter criteria</p>
        `;
        grid.appendChild(emptyState);
    } else if (visibleCount > 0 && existingEmptyState) {
        existingEmptyState.remove();
    }
}

// Load statistics
function loadStatistics() {
    const stats = {
        activeCount: 0,
        pendingCount: 0,
        expiredCount: 0,
        totalCount: 0
    };

    fetch(insuranceDataUrl)
        .then(response => response.json())
        .then(data => {
            const insurances = data.data || [];
            
            insurances.forEach(insurance => {
                stats.totalCount++;
                
                if (insurance.expiration_date) {
                    const expirationDate = new Date(insurance.expiration_date);
                    if (expirationDate < new Date()) {
                        stats.expiredCount++;
                        return;
                    }
                }
                
                if (insurance.status === 1) {
                    stats.activeCount++;
                } else {
                    stats.pendingCount++;
                }
            });

            updateStatistics(stats);
        })
        .catch(error => console.error('Error loading statistics:', error));
}

// Update statistics display
function updateStatistics(stats) {
    const elements = {
        'activeCount': document.getElementById('activeCount'),
        'pendingCount': document.getElementById('pendingCount'),
        'expiredCount': document.getElementById('expiredCount'),
        'totalCount': document.getElementById('totalCount')
    };

    for (const [key, element] of Object.entries(elements)) {
        if (element) {
            element.textContent = stats[key] || 0;
        }
    }
}

// Handle new insurance
async function handleNewInsurance() {
    updateProgressStep(1);
    
    // COC Input Dialog
    const cocResult = await showCocInputDialog();
    if (!cocResult) {
        updateProgressStep(0);
        return;
    }

    const { cocNumber, orNumber, policyNumber } = cocResult;
    updateProgressStep(2);

    // MV File Input Dialog
    const mvfileResult = await showMvFileInputDialog();
    if (!mvfileResult) {
        updateProgressStep(0);
        return;
    }

    updateProgressStep(3);

    // Show manage insurance modal filled with data (and previous record if mvfile found)
    showManageInsuranceModal({
        mvfile_no: mvfileResult.mvfile_no,
        coc_no: cocNumber,
        or_no: orNumber || cocNumber,
        policy_no: policyNumber || cocNumber
    }, mvfileResult.existingRecord || null);
}

// Show COC Input Dialog
async function showCocInputDialog() {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'modern-input-container';
        container.innerHTML = `
            <div class="input-header">
                <i class="fas fa-id-card"></i>
                <h3>Enter COC Number</h3>
            </div>
            <div class="input-guide">Please enter the 8-digit COC number</div>
            <div class="input-wrapper">
                <input type="text" id="coc-input" class="modern-input" placeholder="12345678" maxlength="8">
                <div class="status-indicator" id="coc-status-indicator"></div>
            </div>
            <div class="status-message" id="coc-status-message"></div>
            <div id="additional-fields" class="additional-fields" style="display: none;">
                <div class="input-header">
                    <i class="fas fa-info-circle"></i>
                    <h3>Additional Information</h3>
                </div>
                <input type="text" id="or-number" class="modern-input" placeholder="OR Number">
                <input type="text" id="policy-number" class="modern-input" placeholder="Policy Number">
            </div>
        `;

        Swal.fire({
            title: '',
            html: container,
            showCancelButton: true,
            confirmButtonText: 'Continue',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'modern-swal-popup',
                confirmButton: 'modern-confirm-btn',
                cancelButton: 'modern-cancel-btn'
            },
            didOpen: () => {
                const input = document.getElementById('coc-input');
                const statusIndicator = document.getElementById('coc-status-indicator');
                const statusMessage = document.getElementById('coc-status-message');
                const additionalFields = document.getElementById('additional-fields');

                input.addEventListener('input', async function() {
                    const value = this.value.trim();

                    if (!value) {
                        statusIndicator.className = 'status-indicator';
                        statusMessage.textContent = '';
                        additionalFields.style.display = 'none';
                        return;
                    }

                    if (!/^[0-9]{8}$/.test(value)) {
                        statusIndicator.className = 'status-indicator invalid';
                        statusMessage.textContent = 'Invalid format. Use 8 digits only';
                        statusMessage.className = 'status-message error';
                        additionalFields.style.display = 'none';
                        return;
                    }

                    statusIndicator.className = 'status-indicator checking';
                    statusMessage.textContent = 'Validating COC number...';
                    statusMessage.className = 'status-message checking';
                    additionalFields.style.display = 'none';

                    try {
                        const response = await fetch(insuranceValidateCocUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                            },
                            body: JSON.stringify({ coc_no: value })
                        });

                        const data = await response.json();

                        if (data.valid) {
                            statusIndicator.className = 'status-indicator valid';
                            statusMessage.textContent = '';
                            additionalFields.style.display = 'block';
                        } else {
                            statusIndicator.className = 'status-indicator invalid';
                            statusMessage.textContent = data.message || 'COC number is invalid';
                            statusMessage.className = 'status-message error';
                            additionalFields.style.display = 'none';
                        }
                    } catch (error) {
                        statusIndicator.className = 'status-indicator error';
                        statusMessage.textContent = 'Error validating COC number';
                        statusMessage.className = 'status-message error';
                        console.error(error);
                    }
                });
            },
            preConfirm: () => {
                const input = document.getElementById('coc-input');
                const value = input.value.trim();

                if (!value) {
                    Swal.showValidationMessage('COC number is required!');
                    return false;
                }

                if (!/^[0-9]{8}$/.test(value)) {
                    Swal.showValidationMessage('Invalid format. Use 8 digits only');
                    return false;
                }

                const statusIndicator = document.getElementById('coc-status-indicator');
                if (!statusIndicator.classList.contains('valid')) {
                    Swal.showValidationMessage('Please fix COC number validation issues first');
                    return false;
                }

                const orNumber = document.getElementById('or-number')?.value.trim() || '';
                const policyNumber = document.getElementById('policy-number')?.value.trim() || '';

                return {
                    cocNumber: value,
                    orNumber: orNumber,
                    policyNumber: policyNumber
                };
            }
        }).then(result => {
            if (result.isConfirmed) {
                resolve(result.value);
            } else {
                resolve(null);
            }
        });
    });
}

// Show MV File Input Dialog (returns { mvfile_no, existingRecord } when mvfile found)
async function showMvFileInputDialog() {
    let lastMvFileRecord = null;

    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'modern-input-container';
        container.innerHTML = `
            <div class="input-header">
                <i class="fas fa-car"></i>
                <h3>Bind MV File Number</h3>
            </div>
            <div class="input-guide">Please enter MV File number</div>
            <div class="input-wrapper">
                <input type="text" id="mvfile-input" class="modern-input" placeholder="Enter MV File Number">
                <div class="status-indicator" id="status-indicator"></div>
            </div>
            <div class="status-message" id="status-message"></div>
            <div class="record-details" id="record-details" style="display: none;"></div>
        `;

        Swal.fire({
            title: '',
            html: container,
            showCancelButton: true,
            confirmButtonText: 'Bind & Continue',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'modern-swal-popup',
                confirmButton: 'modern-confirm-btn',
                cancelButton: 'modern-cancel-btn'
            },
            didOpen: () => {
                const input = document.getElementById('mvfile-input');
                const statusIndicator = document.getElementById('status-indicator');
                const statusMessage = document.getElementById('status-message');
                const recordDetails = document.getElementById('record-details');

                input.addEventListener('input', async function() {
                    const value = this.value.trim();

                    if (!value) {
                        statusIndicator.className = 'status-indicator';
                        statusMessage.textContent = '';
                        recordDetails.style.display = 'none';
                        lastMvFileRecord = null;
                        return;
                    }

                    statusIndicator.className = 'status-indicator checking';
                    statusMessage.textContent = 'Checking MV File availability...';
                    statusMessage.className = 'status-message checking';
                    recordDetails.style.display = 'none';
                    lastMvFileRecord = null;

                    try {
                        const response = await fetch(insuranceValidateMvFileUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                            },
                            body: JSON.stringify({ mvfile_no: value })
                        });

                        const data = await response.json();

                        if (data.exists) {
                            statusIndicator.className = 'status-indicator valid';
                            statusMessage.textContent = 'MV File found in records';
                            statusMessage.className = 'status-message valid';

                            lastMvFileRecord = data.record;
                            recordDetails.innerHTML = createRecordDetailsHTML(data.record);
                            recordDetails.style.display = 'block';
                        } else {
                            statusIndicator.className = 'status-indicator invalid';
                            statusMessage.textContent = 'MV File not found - will create new record';
                            statusMessage.className = 'status-message warning';
                            recordDetails.style.display = 'none';
                        }
                    } catch (error) {
                        statusIndicator.className = 'status-indicator error';
                        statusMessage.textContent = 'Error checking MV File';
                        statusMessage.className = 'status-message error';
                        console.error(error);
                    }
                });
            },
            preConfirm: () => {
                const input = document.getElementById('mvfile-input');
                const value = input.value.trim();

                if (!value) {
                    Swal.showValidationMessage('MV File number is required!');
                    return false;
                }

                return { mvfile_no: value, existingRecord: lastMvFileRecord };
            }
        }).then(result => {
            if (result.isConfirmed) {
                resolve(result.value);
            } else {
                resolve(null);
            }
        });
    });
}

// Create record details HTML
function createRecordDetailsHTML(record) {
    return `
        <div class="record-card">
            <div class="record-header">
                <i class="fas fa-file-contract"></i>
                <h4>Existing Insurance Record</h4>
                <span class="verified-badge">Verified</span>
            </div>
            <div class="record-body">
                <div class="record-field">
                    <label>Policy Number:</label>
                    <span>${record.policy_no ? '#' + record.policy_no : 'N/A'}</span>
                </div>
                <div class="record-field">
                    <label>COC Number:</label>
                    <span>${record.coc_no || 'N/A'}</span>
                </div>
                <div class="record-field">
                    <label>OR Number:</label>
                    <span>${record.or_no || 'N/A'}</span>
                </div>
            </div>
        </div>
    `;
}

// Show manage insurance modal: form open and filled with input data; if mvfile found, fill all fields for edit
async function showManageInsuranceModal(formData, existingRecord) {
    const modal = document.getElementById('manageInsuranceModal');
    const overlay = document.getElementById('insuranceModalOverlay');
    const form = document.getElementById('insuranceForm');
    const submitBtn = document.getElementById('insuranceSubmitBtn');
    const modalTitle = document.getElementById('manageInsuranceModalTitle');
    if (!modal || !form) return;

    // Reset and fill entry data from wizard
    document.getElementById('insurance_id').value = '';
    document.getElementById('insurance_form_method').value = 'POST';
    setModalValue('modal-mvfile_no', formData.mvfile_no || '');
    setModalValue('modal-coc_no', formData.coc_no || '');
    setModalValue('modal-or_no', formData.or_no || '');
    setModalValue('modal-policy_no', formData.policy_no || '');

    if (existingRecord) {
        document.getElementById('insurance_id').value = existingRecord.insurance_id || '';
        document.getElementById('insurance_form_method').value = 'PUT';
        setModalValue('modal-client_id', existingRecord.client_id || '');
        setModalValue('modal-policy_id', existingRecord.policy_id || '');
        setModalValue('modal-category_id', existingRecord.auth_no || '');
        setModalValue('modal-code', existingRecord.insurance_code || existingRecord.code || '');
        setModalValue('modal-registration_no', existingRecord.registration_no || '');
        setModalValue('modal-chassis_no', existingRecord.chassis_no || '');
        setModalValue('modal-engine_no', existingRecord.engine_no || '');
        setModalValue('modal-vehicle_model', existingRecord.vehicle_model || '');
        setModalValue('modal-vehicle_color', existingRecord.vehicle_color || '');
        setModalValue('modal-make', existingRecord.make || '');
        setModalValue('modal-registration_date', existingRecord.registration_date || '');
        setModalValue('modal-expiration_date', existingRecord.expiration_date || '');
        setModalValue('modal-cost', existingRecord.cost ?? '');
        setModalValue('modal-status', String(existingRecord.insurance_status ?? existingRecord.status ?? '0'));
        setModalValue('modal-remarks', existingRecord.insurance_remarks || existingRecord.remarks || '');
        modalTitle.textContent = 'Edit Insurance';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
        
        // CRITICAL: Update Select2 values after modal is shown
        setTimeout(() => {
            if (existingRecord.client_id) {
                $('#modal-client_id').val(existingRecord.client_id).trigger('change');
            }
            if (existingRecord.policy_id) {
                $('#modal-policy_id').val(existingRecord.policy_id).trigger('change');
            }
            if (existingRecord.auth_no) {
                $('#modal-category_id').val(existingRecord.auth_no).trigger('change');
            }
        }, 100);
    } else {
        setModalValue('modal-client_id', '');
        setModalValue('modal-policy_id', '');
        setModalValue('modal-category_id', '');
        setModalValue('modal-registration_no', '');
        setModalValue('modal-chassis_no', '');
        setModalValue('modal-engine_no', '');
        setModalValue('modal-vehicle_model', '');
        setModalValue('modal-vehicle_color', '');
        setModalValue('modal-make', '');
        setModalValue('modal-registration_date', '');
        setModalValue('modal-expiration_date', '');
        setModalValue('modal-cost', '');
        setModalValue('modal-status', '0');
        setModalValue('modal-remarks', '');
        modalTitle.textContent = 'New Insurance';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save';
        
        // Reset Select2 values for new record
        setTimeout(() => {
            $('#modal-client_id').val('').trigger('change');
            $('#modal-policy_id').val('').trigger('change');
            $('#modal-category_id').val('').trigger('change');
        }, 100);
    }
    
    // Show modal first
    modal.style.display = 'flex';
    if (overlay) overlay.style.display = 'block';
    
    // Reinitialize Select2 to ensure proper dropdown positioning
    setTimeout(() => {
        $('.js-example-basic-single').select2({
            width: '100%',
            dropdownParent: $('#manageInsuranceModal')
        });
    }, 200);
}

function setModalValue(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    const v = value == null ? '' : String(value);
    
    // For Select2 fields, set the value but don't trigger change here
    // (we'll trigger change after modal is shown)
    if (el.classList.contains('js-example-basic-single')) {
        el.value = v;
    } else {
        el.value = v;
    }
}

function closeInsuranceModal() {
    const modal = document.getElementById('manageInsuranceModal');
    const overlay = document.getElementById('insuranceModalOverlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}

async function handleInsuranceFormSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('insuranceForm');
    const submitBtn = document.getElementById('insuranceSubmitBtn');
    if (!form) return;
    const insuranceId = document.getElementById('insurance_id').value;
    const isUpdate = Boolean(insuranceId);

    const formData = new FormData(form);
    const payload = {};
    formData.forEach((value, key) => {
        if (key === '_token' || key === '_method' || key === 'insurance_id') return;
        payload[key] = value;
    });

    const url = isUpdate ? `${insuranceUpdateUrl}/${insuranceId}` : insuranceStoreUrl;
    const method = isUpdate ? 'PUT' : 'POST';
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (isUpdate ? 'Updating...' : 'Saving...');
    }

    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        };
        if (method === 'PUT') {
            options.headers['X-HTTP-Method-Override'] = 'PUT';
        }
        const response = await fetch(url, options);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const errMsg = (data && typeof data === 'object' && data.errors && typeof data.errors === 'object')
                ? Object.values(data.errors).flat().filter(Boolean).join(' ')
                : (data && typeof data === 'object' && data.message) || 'Request failed';
            throw new Error(errMsg);
        }

        closeInsuranceModal();
        loadInsuranceData();
        loadStatistics();
        if (typeof Swal !== 'undefined') {
            Swal.fire({ icon: 'success', title: isUpdate ? 'Updated' : 'Saved', text: data.message || (isUpdate ? 'Insurance updated successfully.' : 'Insurance created successfully.') });
        } else {
            alert(data.message || (isUpdate ? 'Insurance updated successfully.' : 'Insurance created successfully.'));
        }
    } catch (err) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Something went wrong.' });
        } else {
            alert(err.message || 'Something went wrong.');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = isUpdate ? '<i class="fas fa-save"></i> Update' : '<i class="fas fa-save"></i> Save';
        }
    }
}

// View insurance details
function viewInsuranceDetails(id) {
    window.location.href = `${manageInsuranceUrl}?id=${id}`;
}

// Check policy status
async function checkPolicyStatus(status, releaseDate, cocNo) {
    Swal.fire({
        title: 'Processing...',
        html: `
            <div style="margin-top: 20px;">
                <div style="width: 100%; background: #f3f3f3; border-radius: 25px; overflow: hidden;">
                    <div id="progress-bar" style="width: 0%; height: 15px; background: linear-gradient(90deg, #6a11cb, #2575fc);"></div>
                </div>
            </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                const bar = document.getElementById('progress-bar');
                if (bar) bar.style.width = progress + '%';
                if (progress >= 100) clearInterval(interval);
            }, 100);
        }
    });

    setTimeout(() => {
        const companyLogo = getCompanyLogo(cocNo);
        const companyName = getCompanyName(cocNo);

        if (status == 1) {
            Swal.fire({
                title: 'Policy Released!',
                html: `
                    <div style="text-align: center;">
                        <img src="${companyLogo}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 15px;">
                        <p><strong>Released on ${releaseDate}</strong></p>
                        <p style="color: green;">Company: ${companyName}</p>
                    </div>
                `,
                icon: 'success'
            });
        } else {
            Swal.fire({
                title: 'Policy Pending',
                html: `
                    <div style="text-align: center;">
                        <img src="${companyLogo}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 15px;">
                        <p><strong>Status: Pending</strong></p>
                        <p style="color: red;">Company: ${companyName}</p>
                    </div>
                `,
                icon: 'warning'
            });
        }
    }, 2000);
}

// Get company logo
function getCompanyLogo(cocNo) {
    if (cocNo.startsWith('13') || cocNo.startsWith('40')) {
        return 'https://via.placeholder.com/100?text=Liberty';
    } else if (cocNo.startsWith('87')) {
        return 'https://via.placeholder.com/100?text=Milestone';
    } else if (cocNo.startsWith('19')) {
        return 'https://via.placeholder.com/100?text=Pacific';
    } else if (cocNo.startsWith('147')) {
        return 'https://via.placeholder.com/100?text=Stronghold';
    }
    return 'https://via.placeholder.com/100?text=Unknown';
}

// Get company name
function getCompanyName(cocNo) {
    if (cocNo.startsWith('13') || cocNo.startsWith('40')) {
        return 'Liberty Insurance Corporation';
    } else if (cocNo.startsWith('87')) {
        return 'Milestone Guaranty And Assurance Corp.';
    } else if (cocNo.startsWith('19')) {
        return 'Pacific Union Insurance Company';
    } else if (cocNo.startsWith('147')) {
        return 'Stronghold Insurance Company';
    }
    return 'Unknown Policy';
}

// Open load dialog
function openLoadDialog() {
    Swal.fire({
        title: 'Load Data',
        input: 'select',
        inputOptions: {
            '10': 'Load 10 Records',
            '50': 'Load 50 Records',
            '100': 'Load 100 Records',
            '500': 'Load 500 Records'
        },
        inputPlaceholder: 'Select batch size',
        showCancelButton: true,
        confirmButtonText: 'Load',
        customClass: {
            popup: 'modern-swal-popup',
            confirmButton: 'modern-confirm-btn',
            cancelButton: 'modern-cancel-btn'
        }
    }).then(result => {
        if (result.isConfirmed) {
            loadData(result.value);
        }
    });
}

// Load data
function loadData(batchSize) {
    Swal.fire({
        title: 'Loading Data...',
        html: '<div style="width: 100%; background: #f3f3f3; border-radius: 25px; overflow: hidden;"><div id="data-progress" style="width: 0%; height: 20px; background: linear-gradient(90deg, #1877f2, #7209b7);"></div></div>',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                const bar = document.getElementById('data-progress');
                if (bar) bar.style.width = progress + '%';
                if (progress >= 100) clearInterval(interval);
            }, 100);

            setTimeout(() => {
                loadInsuranceData();
                Swal.close();
                showAlert('Success', 'Data loaded successfully', 'success');
            }, 2000);
        }
    });
}

// Update progress step
function updateProgressStep(step) {
    document.querySelectorAll('.flow-step').forEach(el => {
        el.classList.remove('active');
        if (parseInt(el.getAttribute('data-step')) <= step) {
            el.classList.add('active');
        }
    });
}

// Show alert
function showAlert(title, message, icon) {
    Swal.fire({
        title: title,
        text: message,
        icon: icon,
        customClass: {
            popup: 'modern-swal-popup',
            confirmButton: 'modern-confirm-btn'
        }
    });
}

// Open View Insurance Modal
window.viewInsuranceDetails = function(id) {
    openViewInsuranceModal(id);
};

// Open Edit Insurance Modal
window.editInsuranceDetails = function(id) {
    openEditInsuranceModal(id);
};

// Open View Insurance Modal
function openViewInsuranceModal(id) {
    currentMode = 'view';
    const modal = document.getElementById('manageInsuranceModal');
    const overlay = document.getElementById('insuranceModalOverlay');
    const form = document.getElementById('insuranceForm');
    const submitBtn = document.getElementById('insuranceSubmitBtn');
    const modalTitle = document.getElementById('manageInsuranceModalTitle');
    
    if (!modal || !form) return;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    fetch(`${manageInsuranceUrl}?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (!data.insurance) {
                throw new Error('Insurance not found');
            }
             
            // Populate form fields
            document.getElementById('insurance_id').value = data.insurance.id;
            document.getElementById('insurance_form_method').value = 'GET';
            setModalValue('modal-mvfile_no', data.insurance.mvfile_no || '');
            setModalValue('modal-coc_no', data.insurance.coc_no || '');
            setModalValue('modal-or_no', data.insurance.or_no || '');
            setModalValue('modal-policy_no', data.insurance.policy_no || '');
            setModalValue('modal-client_id', data.insurance.client_id || '');
            setModalValue('modal-policy_id', data.insurance.policy_id || '');
            setModalValue('modal-category_id', data.insurance.auth_no || '');
            setModalValue('modal-code', data.insurance.code || '');
            setModalValue('modal-registration_no', data.insurance.registration_no || '');
            setModalValue('modal-chassis_no', data.insurance.chassis_no || '');
            setModalValue('modal-engine_no', data.insurance.engine_no || '');
            setModalValue('modal-vehicle_model', data.insurance.vehicle_model || '');
            setModalValue('modal-vehicle_color', data.insurance.vehicle_color || '');
            setModalValue('modal-make', data.insurance.make || '');
            setModalValue('modal-registration_date', data.insurance.registration_date || '');
            setModalValue('modal-expiration_date', data.insurance.expiration_date || '');
            setModalValue('modal-cost', data.insurance.cost || '');
            setModalValue('modal-status', String(data.insurance.status || '0'));
            setModalValue('modal-remarks', data.insurance.remarks || '');
            
            // Set modal title
            modalTitle.textContent = 'View Insurance Details';
            submitBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
            submitBtn.disabled = false;
            submitBtn.onclick = function() {
                openEditInsuranceModal(data.insurance.id);
            };
            
            // Make all fields readonly
            const formControls = form.querySelectorAll('.form-control');
            formControls.forEach(control => {
                control.setAttribute('readonly', true);
                control.setAttribute('disabled', true);
            });
            
            // Show modal
            modal.style.display = 'flex';
            if (overlay) overlay.style.display = 'block';
        })
        .catch(error => {
            console.error('Error loading insurance:', error);
            showAlert('Error', 'Failed to load insurance details', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Save';
        });
}

// Open Edit Insurance Modal
// Open Edit Insurance Modal
function openEditInsuranceModal(id) {
    currentMode = 'edit';
    const modal = document.getElementById('manageInsuranceModal');
    const overlay = document.getElementById('insuranceModalOverlay');
    const form = document.getElementById('insuranceForm');
    const submitBtn = document.getElementById('insuranceSubmitBtn');
    const modalTitle = document.getElementById('manageInsuranceModalTitle');
    
    if (!modal || !form) return;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    fetch(`${manageInsuranceUrl}?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (!data.insurance) {
                throw new Error('Insurance not found');
            }
            
            const insurance = data.insurance;
            
            // Populate form fields
            document.getElementById('insurance_id').value = insurance.id;
            document.getElementById('insurance_form_method').value = 'PUT';
            setModalValue('modal-mvfile_no', insurance.mvfile_no || '');
            setModalValue('modal-coc_no', insurance.coc_no || '');
            setModalValue('modal-or_no', insurance.or_no || '');
            setModalValue('modal-policy_no', insurance.policy_no || '');
            setModalValue('modal-registration_no', insurance.registration_no || '');
            setModalValue('modal-chassis_no', insurance.chassis_no || '');
            setModalValue('modal-engine_no', insurance.engine_no || '');
            setModalValue('modal-vehicle_model', insurance.vehicle_model || '');
            setModalValue('modal-vehicle_color', insurance.vehicle_color || '');
            setModalValue('modal-make', insurance.make || '');
            setModalValue('modal-registration_date', insurance.registration_date || '');
            setModalValue('modal-expiration_date', insurance.expiration_date || '');
            setModalValue('modal-cost', insurance.cost || '');
            setModalValue('modal-status', String(insurance.status || '0'));
            setModalValue('modal-remarks', insurance.remarks || '');
            
            // Set modal title
            modalTitle.textContent = 'Edit Insurance';
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
            submitBtn.disabled = false;
            submitBtn.onclick = null; // Reset click handler
            
            // Make all fields editable
            const formControls = form.querySelectorAll('.form-control');
            formControls.forEach(control => {
                control.removeAttribute('readonly');
                control.removeAttribute('disabled');
            });
            
            // Show modal first
            modal.style.display = 'flex';
            if (overlay) overlay.style.display = 'block';
            
            // CRITICAL: Set Select2 values AFTER modal is shown
            setTimeout(() => {
                if (insurance.client_id) {
                    $('#modal-client_id').val(insurance.client_id).trigger('change');
                }
                if (insurance.policy_id) {
                    $('#modal-policy_id').val(insurance.policy_id).trigger('change');
                }
                if (insurance.auth_no) {
                    $('#modal-category_id').val(insurance.auth_no).trigger('change');
                }
                
                // Reinitialize Select2 with proper dropdown parent
                $('.js-example-basic-single').select2({
                    width: '100%',
                    dropdownParent: $('#manageInsuranceModal')
                });
            }, 100);
        })
        .catch(error => {
            console.error('Error loading insurance:', error);
            showAlert('Error', 'Failed to load insurance details', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Save';
        });
}

// Delete Insurance
function deleteInsurance(id) {
    if (!confirm('Are you sure you want to delete this insurance record? This action cannot be undone.')) {
        return;
    }
    
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    const url = `${insuranceUpdateUrl}/${id}`;
    
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadInsuranceData();
            loadStatistics();
            showAlert('Success', 'Insurance record deleted successfully', 'success');
        } else {
            throw new Error(data.message || 'Failed to delete insurance record');
        }
    })
    .catch(error => {
        console.error('Error deleting insurance:', error);
        showAlert('Error', error.message || 'Failed to delete insurance record', 'error');
    });
}

// Update the createPolicyCard function to include view, edit, delete buttons
function createPolicyCard(insurance, status) {
    const card = document.createElement('div');
    card.className = `policy-card`;
    card.setAttribute('data-status', status);
    card.setAttribute('data-id', insurance.id);
    const statusBadge = getStatusBadgeHTML(status);
    const policyColor = getPolicyColor(insurance.code);
    const clientName = `${insurance.client_name || 'N/A'}`;
    const categoryName = insurance.category_name || 'Unknown Category';
    
    card.innerHTML = ` 
        <div class="card-header">
            <div class="policy-meta">
                <span class="policy-id">${insurance.mvfile_no || insurance.code || 'N/A'}</span>
                <span class="policy-date">${formatDate(insurance.registration_date)}</span>
            </div>
            <div class="status-badge ${status}">
                ${getStatusText(status)}
            </div>
        </div>
        <div class="card-body">
            <div class="client-info">
                <h3 class="client-name">${clientName}</h3>
                <div class="client-details">
                    <div class="detail-row">
                        <span class="detail-label">Document ID:</span>
                        <span class="detail-value">${insurance.code}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Category:</span>
                        <span class="detail-value">${categoryName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Plate No:</span>
                        <span class="detail-value">${insurance.registration_no || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">COC No:</span>
                        <span class="detail-value">${insurance.coc_no || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Engine No:</span>
                        <span class="detail-value">${insurance.engine_no || 'N/A'}</span>
                    </div>
                </div>
            </div>
            <div class="policy-type-indicator" style="--policy-color: ${policyColor}">
                <span class="policy-type">${insurance.policy_name || 'Standard'}</span>
            </div>
        </div>
        <div class="card-footer">
            <div class="action-buttons">
                <button class="action-btn view" onclick="viewInsuranceDetails(${insurance.id})">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn edit" onclick="editInsuranceDetails(${insurance.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete" onclick="deleteInsurance(${insurance.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    return card;
}

// Update the renderPolicies function to handle the new buttons
function renderPolicies(insurances) {
    const grid = document.getElementById('policiesGrid');
    if (!grid) return;
    
    // Clear existing cards but keep other content
    const existingCards = grid.querySelectorAll('.policy-card');
    existingCards.forEach(card => card.remove());
    
    if (!insurances || insurances.length === 0) {
        if (!grid.querySelector('.empty-state')) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = ` 
                <div class="empty-icon"> 
                    <i class="fas fa-file-contract"></i> 
                </div> 
                <h3>No Insurance Policies Found</h3> 
                <p>Get started by adding your first insurance policy</p> 
                <button class="action-btn view" id="addInsuranceEmptyBtn"> 
                    <i class="fas fa-plus-circle"></i> Add New Insurance 
                </button> 
            `;
            grid.appendChild(emptyState);
            const emptyBtn = document.getElementById('addInsuranceEmptyBtn');
            if (emptyBtn) {
                emptyBtn.addEventListener('click', handleNewInsurance);
            }
        }
        return;
    }
    
    // Remove empty state if it exists
    const emptyState = grid.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    insurances.forEach(insurance => {
        const status = getInsuranceStatus(insurance);
        const card = createPolicyCard(insurance, status);
        grid.appendChild(card);
    });
}
// Helper function to update floating labels for Select2
function updateSelect2Labels() {
    $('.js-example-basic-single').each(function() {
        var $select = $(this);
        var $label = $select.siblings('label');
        
        if ($select.val()) {
            $label.addClass('active');
        } else {
            $label.removeClass('active');
        }
    });
}

// Add this event listener for Select2 change events
$(document).ready(function() {
    $('.js-example-basic-single').on('change', function() {
        updateSelect2Labels();
    });
});