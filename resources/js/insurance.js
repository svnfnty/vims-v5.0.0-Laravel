// Insurance Dashboard JavaScript
let countdownTime = 10 * 1000;
let currentGridView = 'cards';
let isSubmitting = false;
let currentMode = null;


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
        insuranceForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Disable submit button immediately to prevent multiple submissions
            const submitBtn = document.getElementById('insuranceSubmitBtn');
            if (submitBtn && submitBtn.disabled) {
                return; // Already processing
            }
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            }

            handleInsuranceFormSubmit(e);
        });
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
    
    // Only show office name for super admin (id=1 and office_id=0)
    const isSuperAdmin = window.userId === 1 && window.userOfficeId === 0;
    const officeName = insurance.office_name || 'N/A';
    const officeDisplay = isSuperAdmin ? `
        <div class="detail-row">
            <span class="detail-label">Office:</span>
            <span class="detail-value">${officeName}</span>
        </div>
    ` : '';

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
                    ${officeDisplay}
                </div>
            </div>
            
            <div class="policy-type-indicator" style="--policy-color: ${policyColor}">
                <span class="policy-type">${insurance.policy_name || 'Standard'}</span>
            </div>
        </div>
        
        <div class="card-footer">
            <div class="action-buttons">
                <button class="action-btn-small view" onclick="viewInsuranceDetails(${insurance.id})">
                    <i class="fas fa-eye"></i> View
                </button>
                ${window.userPermissions > 0 ? `<button class="action-btn-small edit" onclick="editInsuranceDetails(${insurance.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>` : ''}
                ${window.userPermissions === 1 ? `<button class="action-btn-small delete" onclick="deleteInsurance(${insurance.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>` : ''}
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

    // Store COC result globally for the entire flow
    globalCocResult = cocResult;
    console.log('Stored global COC result:', globalCocResult);

    const { cocNumber, orNumber, policyNumber } = cocResult;
    updateProgressStep(2);

    // MV File Input Dialog
    const mvfileResult = await showMvFileInputDialog();
    if (!mvfileResult) {
        updateProgressStep(0);
        return;
    }

    updateProgressStep(3);

    // If copying from another office, show client edit modal first
    if (mvfileResult.isCopy && mvfileResult.existingRecord) {
        // Open client edit modal and wait for user to continue
        openClientEditModal(mvfileResult.existingRecord, cocResult, mvfileResult);
        // The flow will continue from submitClientEdit()
        return;
    }

    // If MV File not found, show create client modal first
    if (!mvfileResult.existingRecord) {
        openCreateClientModal(cocResult, mvfileResult);
        return;
    }

    updateProgressStep(4);

    // Show manage insurance modal filled with data (and previous record if mvfile found)
    showManageInsuranceModal({
        mvfile_no: mvfileResult.mvfile_no,
        coc_no: cocNumber,
        or_no: orNumber || cocNumber,
        policy_no: policyNumber || cocNumber
    }, mvfileResult.existingRecord || null, mvfileResult.isCopy || false, null);
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
            <div class="tutorial-tip-box">
                <i class="fas fa-lightbulb"></i>
                <span><strong>Tip:</strong> COC (Certificate of Cover) is an 8-digit number found on your insurance certificate.</span>
            </div>
            <div class="input-wrapper">
                <input type="text" id="coc-input" class="modern-input" placeholder="12345678" maxlength="8" data-tutorial="coc-input">
                <div class="status-indicator" id="coc-status-indicator"></div>
            </div>
            <div class="status-message" id="coc-status-message"></div>
            <div id="additional-fields" class="additional-fields" style="display: none;">
                <div class="input-header">
                    <i class="fas fa-info-circle"></i>
                    <h3>Additional Information</h3>
                </div>
                <div class="tutorial-tip-box secondary">
                    <i class="fas fa-info-circle"></i>
                    <span>These fields are optional but help with record keeping.</span>
                </div>
                <div class="input-wrapper">
                    <input type="text" id="or-number" class="modern-input" placeholder="OR Number" data-tutorial="or-input">
                </div>
                <div class="input-wrapper">
                    <input type="text" id="policy-number" class="modern-input" placeholder="Policy Number" data-tutorial="policy-input">
                </div>
            </div>
        `;

        Swal.fire({
            title: '',
            html: container,
            showCancelButton: true,
            confirmButtonText: 'Continue',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'modern-swal-popup tutorial-swal-popup',
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

// Show MV File Input Dialog (returns { mvfile_no, existingRecord, isCopy } when mvfile found)
async function showMvFileInputDialog() {
    let lastMvFileRecord = null;
    let isCopyFromOtherOffice = false;
    let validationComplete = false;
    let abortController = null;
    let debounceTimer = null;
    let lastInputValue = '';

    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'modern-input-container';
        container.innerHTML = `
            <div class="input-header">
                <i class="fas fa-car"></i>
                <h3>Bind MV File Number</h3>
            </div>
            <div class="tutorial-tip-box">
                <i class="fas fa-lightbulb"></i>
                <span><strong>Tip:</strong> MV File Number links this insurance to a specific vehicle. If the vehicle exists in another office, you can copy its data.</span>
            </div>
            <div class="input-wrapper">
                <input type="text" id="mvfile-input" class="modern-input" placeholder="Enter MV File Number" data-tutorial="mvfile-input">
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
                popup: 'modern-swal-popup tutorial-swal-popup',
                confirmButton: 'modern-confirm-btn',
                cancelButton: 'modern-cancel-btn'
            },
            didOpen: () => {
                const input = document.getElementById('mvfile-input');
                const statusIndicator = document.getElementById('status-indicator');
                const statusMessage = document.getElementById('status-message');
                const recordDetails = document.getElementById('record-details');

                input.addEventListener('input', function() {
                    const value = this.value.trim();
                    lastInputValue = value;

                    // Clear any pending debounce timer
                    if (debounceTimer) {
                        clearTimeout(debounceTimer);
                    }

                    // Cancel any pending request
                    if (abortController) {
                        abortController.abort();
                        abortController = null;
                    }

                    if (!value) {
                        statusIndicator.className = 'status-indicator';
                        statusMessage.textContent = '';
                        recordDetails.style.display = 'none';
                        lastMvFileRecord = null;
                        isCopyFromOtherOffice = false;
                        validationComplete = true;
                        hideMvFileNotification();
                        return;
                    }

                    // Show checking state immediately
                    statusIndicator.className = 'status-indicator checking';
                    statusMessage.textContent = 'Checking MV File availability...';
                    statusMessage.className = 'status-message checking';
                    recordDetails.style.display = 'none';
                    lastMvFileRecord = null;
                    isCopyFromOtherOffice = false;
                    validationComplete = false;

                    // Debounce the validation request by 300ms
                    debounceTimer = setTimeout(async () => {
                        // Double-check input hasn't changed during debounce
                        if (input.value.trim() !== lastInputValue) {
                            return;
                        }

                        // Create new abort controller for this request
                        abortController = new AbortController();

                        try {
                            const response = await fetch(insuranceValidateMvFileUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                                },
                                body: JSON.stringify({ mvfile_no: value }),
                                signal: abortController.signal
                            });

                            // Ignore response if input has changed since request was made
                            if (input.value.trim() !== lastInputValue) {
                                return;
                            }

                            const data = await response.json();
                            validationComplete = true;

                            if (data.exists) {
                                if (data.sameOffice) {
                                    // Record exists in user's own office - show floating notification immediately
                                    statusIndicator.className = 'status-indicator valid';
                                    statusMessage.textContent = 'MV File found in your office records';
                                    statusMessage.className = 'status-message valid';

                                    lastMvFileRecord = data.record;
                                    isCopyFromOtherOffice = false;
                                    recordDetails.innerHTML = createRecordDetailsHTML(data.record, false);
                                    recordDetails.style.display = 'block';

                                    // Show floating notification immediately when MV file is found
                                    showMvFileNotification(data.record);
                                } else {
                                    // Record exists in another office - allow copying
                                    statusIndicator.className = 'status-indicator valid';
                                    statusMessage.textContent = `MV File found in ${data.record?.source_office_name || 'another office'} - you can copy this data to your office`;
                                    statusMessage.className = 'status-message valid';

                                    lastMvFileRecord = data.record;
                                    isCopyFromOtherOffice = true;
                                    recordDetails.innerHTML = createRecordDetailsHTML(data.record, true);
                                    recordDetails.style.display = 'block';

                                    // Hide notification if it was shown for a different record
                                    hideMvFileNotification();
                                }
                            } else {
                                // Not found - will create new record
                                statusIndicator.className = 'status-indicator invalid';
                                statusMessage.textContent = 'MV File not found - will create new record';
                                statusMessage.className = 'status-message warning';
                                recordDetails.style.display = 'none';
                                lastMvFileRecord = null;
                                isCopyFromOtherOffice = false;

                                // Hide notification if it was shown
                                hideMvFileNotification();
                                const confirmButton = document.querySelector('.swal2-confirm');

                                if (confirmButton) {
                                    confirmButton.disabled = false;
                                    confirmButton.style.opacity = '1';
                                    confirmButton.style.cursor = 'pointer';
                                }
                            }

                        } catch (error) {
                            // Ignore abort errors (they're expected when cancelling)
                            if (error.name === 'AbortError') {
                                return;
                            }

                            // Ignore if input has changed since request was made
                            if (input.value.trim() !== lastInputValue) {
                                return;
                            }

                            validationComplete = true;
                            statusIndicator.className = 'status-indicator error';
                            statusMessage.textContent = 'Error checking MV File';
                            statusMessage.className = 'status-message error';
                            console.error(error);
                        } finally {
                            abortController = null;
                        }
                    }, 300); // 300ms debounce delay
                });
            },
            preConfirm: async () => {
                const input = document.getElementById('mvfile-input');
                const value = input.value.trim();

                if (!value) {
                    Swal.showValidationMessage('MV File number is required!');
                    return false;
                }

                // Cancel any pending debounced validation
                if (debounceTimer) {
                    clearTimeout(debounceTimer);
                    debounceTimer = null;
                }

                // Cancel any pending request
                if (abortController) {
                    abortController.abort();
                    abortController = null;
                }

                // If validation hasn't completed yet, run it now synchronously
                if (!validationComplete) {
                    statusIndicator.className = 'status-indicator checking';
                    statusMessage.textContent = 'Validating...';

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
                            lastMvFileRecord = data.record;
                            isCopyFromOtherOffice = !data.sameOffice;
                        } else {
                            lastMvFileRecord = null;
                            isCopyFromOtherOffice = false;
                        }
                    } catch (error) {
                        console.error('Validation error:', error);
                    }
                }

                return { mvfile_no: value, existingRecord: lastMvFileRecord, isCopy: isCopyFromOtherOffice };
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

// Client Edit Modal Functions
let clientEditCallback = null;
let pendingMvfileResult = null;
let pendingCocResult = null;
let globalCocResult = null; // Store COC result globally for the entire flow

function openClientEditModal(existingRecord, cocResult, mvfileResult) {
    const modal = document.getElementById('clientEditModal');
    const overlay = document.getElementById('clientEditModalOverlay');
    const form = document.getElementById('clientEditForm');
    
    if (!modal || !form) return;
    
    // Store the results for later use
    pendingCocResult = cocResult;
    pendingMvfileResult = mvfileResult;
    
    // Pre-fill form with existing client data
    document.getElementById('edit-client-original-id').value = existingRecord.client_id || '';
    document.getElementById('edit-firstname').value = existingRecord.firstname || '';
    document.getElementById('edit-middlename').value = existingRecord.middlename || '';
    document.getElementById('edit-lastname').value = existingRecord.lastname || '';
    document.getElementById('edit-email').value = existingRecord.email || '';
    document.getElementById('edit-contact').value = existingRecord.contact || '';
    document.getElementById('edit-dob').value = existingRecord.dob || '';
    document.getElementById('edit-markup').value = existingRecord.markup || '';
    document.getElementById('edit-address').value = existingRecord.address || '';
    
    // Update original client name display
    const originalName = `${existingRecord.firstname || ''} ${existingRecord.middlename ? existingRecord.middlename + ' ' : ''}${existingRecord.lastname || ''}`;
    document.getElementById('originalClientName').textContent = `Original: ${originalName}`;
    
    // Show modal
    modal.style.display = 'flex';
    if (overlay) overlay.style.display = 'block';
}

window.closeClientEditModal = function() {
    const modal = document.getElementById('clientEditModal');
    const overlay = document.getElementById('clientEditModalOverlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    
    // Reset stored data
    pendingCocResult = null;
    pendingMvfileResult = null;
}


window.submitClientEdit = async function() {

    // Prevent multiple submissions
    if (isSubmitting) {
        return; // Already processing
    }
    isSubmitting = true;

    // Disable submit button immediately to prevent multiple submissions
    const submitBtn = document.getElementById('clientEditContinueBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    }

    const form = document.getElementById('clientEditForm');

    // Validate required fields
    const firstname = document.getElementById('edit-firstname').value.trim();
    const lastname = document.getElementById('edit-lastname').value.trim();

    if (!firstname) {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Continue to Insurance Form';
        }
        isSubmitting = false; // Reset flag on validation error
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'First name is required!'
        });
        return;
    }

    if (!lastname) {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Continue to Insurance Form';
        }
        isSubmitting = false; // Reset flag on validation error
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Last name is required!'
        });
        return;
    }

    // Collect edited client data
    const editedClientData = {
        firstname: firstname,
        middlename: document.getElementById('edit-middlename').value.trim(),
        lastname: lastname,
        email: document.getElementById('edit-email').value.trim(),
        contact: document.getElementById('edit-contact').value.trim(),
        dob: document.getElementById('edit-dob').value,
        walkin_list: document.getElementById('edit-markup').value.trim() || 'Walk-in',
        address: document.getElementById('edit-address').value.trim() || 'N/A',
        status: '1' // Required field - 1 = active
    };

    // Get the original client ID
    const originalClientId = document.getElementById('edit-client-original-id').value;

    if (!originalClientId) {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Continue to Insurance Form';
        }
        isSubmitting = false;
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Client ID not found!'
        });
        return;
    }

    try {
        // Update client via API
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
        const response = await fetch(`/clients/${originalClientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(editedClientData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update client');
        }

        console.log('Client updated successfully:', data);

        // Show success toast notification
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            customClass: {
                popup: 'colored-toast'
            }
        });
        Toast.fire({
            icon: 'success',
            title: 'Client updated successfully'
        });

        // Update the client dropdown option with the new name
        const updatedClient = data.data || data.client;
        if (updatedClient) {
            const newClientName = `${updatedClient.lastname}, ${updatedClient.firstname}${updatedClient.middlename ? ' ' + updatedClient.middlename : ''}`;
            const clientSelect = $('#modal-client_id');

            // Find and update the existing option
            const existingOption = clientSelect.find(`option[value="${updatedClient.id}"]`);
            if (existingOption.length > 0) {
                existingOption.text(newClientName);
            } else {
                // If option doesn't exist, add it
                const newOption = new Option(newClientName, updatedClient.id, true, true);
                clientSelect.append(newOption);
            }

            // Trigger change to update Select2 display
            clientSelect.trigger('change');
        }

        // Re-enable the Swal confirm button since client has been updated
        const confirmButton = document.querySelector('.swal2-confirm');
        if (confirmButton) {
            confirmButton.disabled = false;
            confirmButton.style.opacity = '1';
            confirmButton.style.cursor = 'pointer';
        }

        // Store the pending results locally before closing modal (closeClientEditModal clears them)
        const localMvfileResult = pendingMvfileResult;
        // Use pendingCocResult or fall back to globalCocResult
        const localCocResult = pendingCocResult || globalCocResult;
        
        console.log('Preparing to show MV File dialog again:', { localMvfileResult, localCocResult, globalCocResult });

        // Close the client edit modal
        closeClientEditModal();

        // Re-show the MV File dialog so user can see the info and proceed
        if (localMvfileResult && localCocResult) {
            // Ensure any remaining Swal is closed, then show MV File dialog
            Swal.close();
            // Small delay to ensure previous modal closes completely
            setTimeout(() => {
                console.log('Calling showMvFileDialogAgain with:', { localMvfileResult, localCocResult, editedClientData });
                // Show MV File dialog again with updated client info
                showMvFileDialogAgain(localMvfileResult, localCocResult, editedClientData);
            }, 500);
        } else {
            console.error('Missing data to show MV File dialog:', { localMvfileResult, localCocResult, pendingMvfileResult, pendingCocResult, globalCocResult });
        }
    } catch (error) {
        console.error('Error updating client:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to update client. Please try again.'
        });

        // Re-enable submit button on error
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Continue to Insurance Form';
        }
    } finally {
        isSubmitting = false; // Reset flag after processing
    }
}

// Create Client Modal Functions
let pendingCreateCocResult = null;
let pendingCreateMvfileResult = null;

function openCreateClientModal(cocResult, mvfileResult) {
    const modal = document.getElementById('createClientModal');
    const overlay = document.getElementById('createClientModalOverlay');
    const form = document.getElementById('createClientForm');
    
    if (!modal || !form) return;
    
    // Store the results for later use
    pendingCreateCocResult = cocResult;
    pendingCreateMvfileResult = mvfileResult;
    
    // Reset form fields
    form.reset();
    
    // Show modal
    modal.style.display = 'flex';
    if (overlay) overlay.style.display = 'block';
}

window.closeCreateClientModal = function() {
    const modal = document.getElementById('createClientModal');
    const overlay = document.getElementById('createClientModalOverlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    
    // Reset stored data
    pendingCreateCocResult = null;
    pendingCreateMvfileResult = null;
}


window.submitCreateClient = async function() {

    // Prevent multiple submissions
    if (isSubmitting) {
        return; // Already processing
    }
    isSubmitting = true;

    // Disable submit button immediately to prevent multiple submissions
    const submitBtn = document.getElementById('createClientSubmitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    }

    // Validate required fields
    const firstname = document.getElementById('create-firstname').value.trim();
    const lastname = document.getElementById('create-lastname').value.trim();

    if (!firstname) {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Create Client';
        }
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'First name is required!'
        });
        return;
    }

    if (!lastname) {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Create Client';
        }
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Last name is required!'
        });
        return;
    }

    // Collect new client data
    // Note: API expects 'walkin_list' instead of 'markup', and 'status' is required
    const clientData = {
        firstname: firstname,
        middlename: document.getElementById('create-middlename').value.trim(),
        lastname: lastname,
        email: document.getElementById('create-email').value.trim(),
        contact: document.getElementById('create-contact').value.trim(),
        dob: document.getElementById('create-dob').value,
        walkin_list: document.getElementById('create-markup').value.trim() || 'Walk-in', // API expects walkin_list
        address: document.getElementById('create-address').value.trim() || 'N/A', // Required field
        status: '1' // Required field - 1 = active
    };

    // Show loading
    Swal.fire({
        title: 'Creating Client...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    try {
        // Create client via API
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
        const response = await fetch('/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(clientData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create client');
        }
        
        // Get the newly created client data
        const newClient = data.data;
        const newClientId = newClient.id;
        const newClientName = `${newClient.lastname}, ${newClient.firstname}${newClient.middlename ? ' ' + newClient.middlename : ''}`;
        
        console.log('Client created successfully:', newClientId, newClientName);

        // Show success toast notification
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            customClass: {
                popup: 'colored-toast'
            }
        });
        Toast.fire({
            icon: 'success',
            title: 'Client created successfully'
        });
        
        // Store the pending results BEFORE closing modal (closeCreateClientModal clears them)
        const localMvfileResult = pendingCreateMvfileResult;
        // Use pendingCreateCocResult or fall back to globalCocResult
        const localCocResult = pendingCreateCocResult || globalCocResult;
        
        console.log('Stored results:', { localMvfileResult, localCocResult, globalCocResult });
        
        // Close the create client modal
        closeCreateClientModal();
        Swal.close();
        
        // Re-show the MV File dialog so user can see the info and proceed
        if (localMvfileResult && localCocResult) {
            // Prepare new client data for the MV File dialog
            const newClientData = {
                id: newClientId,
                firstname: clientData.firstname,
                middlename: clientData.middlename,
                lastname: clientData.lastname
            };
            // Ensure any remaining Swal is closed, then show MV File dialog
            Swal.close();
            // Small delay to ensure previous modal closes completely
            setTimeout(() => {
                console.log('Calling showMvFileDialogAgain with:', { localMvfileResult, localCocResult, newClientData });
                // Show MV File dialog again with new client info
                showMvFileDialogAgain(localMvfileResult, localCocResult, null, newClientData);
            }, 500);
        } else {
            console.error('Missing required data:', { localMvfileResult, localCocResult });
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to continue. Missing required data.'
            });
        }
        isSubmitting = false; // Reset flag after processing
    } catch (error) {
        console.error('Error creating client:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to create client. Please try again.'
        });
    } finally {
        // Re-enable submit button after request completes (success or error)
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Create Client';
        }
        isSubmitting = false; // Reset submission flag
    }
}

// Show manage insurance modal: form open and filled with input data; if mvfile found, fill all fields for edit
async function showManageInsuranceModal(formData, existingRecord, isCopy = false, editedClientData = null, newClientId = null) {
    console.log('showManageInsuranceModal called with:', { formData, existingRecord, isCopy, editedClientData, newClientId });
    
    const modal = document.getElementById('manageInsuranceModal');
    const overlay = document.getElementById('insuranceModalOverlay');
    const form = document.getElementById('insuranceForm');
    const submitBtn = document.getElementById('insuranceSubmitBtn');
    const modalTitle = document.getElementById('manageInsuranceModalTitle');
    const officeSelectGroup = document.getElementById('officeSelectGroup');
    
    console.log('Modal elements found:', { modal: !!modal, overlay: !!overlay, form: !!form, submitBtn: !!submitBtn, modalTitle: !!modalTitle });
    
    if (!modal || !form) {
        console.error('Modal or form not found! Cannot open insurance form.');
        return;
    }

    // Reset and fill entry data from wizard
    document.getElementById('insurance_id').value = '';
    document.getElementById('insurance_form_method').value = 'POST';
    setModalValue('modal-mvfile_no', formData.mvfile_no || '');
    setModalValue('modal-coc_no', formData.coc_no || '');
    setModalValue('modal-or_no', formData.or_no || '');
    setModalValue('modal-policy_no', formData.policy_no || '');

        if (existingRecord) {
            if (isCopy) {
                // Copy mode: Use data from other office as template but create NEW record
                document.getElementById('insurance_id').value = '';
                document.getElementById('insurance_form_method').value = 'POST';
                modalTitle.textContent = 'Copy Insurance Record to Your Office';
                submitBtn.innerHTML = '<i class="fas fa-copy"></i> Create Copy in Your Office';
                
                // Fill form with copied data but allow editing
                // Store original client_id with 'clone_' prefix to indicate it needs cloning
                setModalValue('modal-client_id', 'clone_' + existingRecord.client_id);
                setModalValue('modal-policy_id', existingRecord.policy_id || '');
                
                // Add hidden field to store clone info if not exists
                let cloneInfoField = document.getElementById('modal-clone_client_id');
                if (!cloneInfoField) {
                    cloneInfoField = document.createElement('input');
                    cloneInfoField.type = 'hidden';
                    cloneInfoField.id = 'modal-clone_client_id';
                    form.appendChild(cloneInfoField);
                }
                cloneInfoField.value = existingRecord.client_id;

                // Add hidden fields for edited client data if available
                if (editedClientData) {
                    let editedClientField = document.getElementById('modal-edited_client_data');
                    if (!editedClientField) {
                        editedClientField = document.createElement('input');
                        editedClientField.type = 'hidden';
                        editedClientField.id = 'modal-edited_client_data';
                        editedClientField.name = 'edited_client_data';
                        form.appendChild(editedClientField);
                    }
                    editedClientField.value = JSON.stringify(editedClientData);
                }

                setModalValue('modal-category_id', existingRecord.auth_no || '');
                setModalValue('modal-code', '');
                setModalValue('modal-registration_no', existingRecord.registration_no || '');
                setModalValue('modal-chassis_no', existingRecord.chassis_no || '');
                setModalValue('modal-engine_no', existingRecord.engine_no || '');
                setModalValue('modal-vehicle_model', existingRecord.vehicle_model || '');
                setModalValue('modal-vehicle_color', existingRecord.vehicle_color || '');
                setModalValue('modal-make', existingRecord.make || '');
                setModalValue('modal-registration_date', '');
                setModalValue('modal-expiration_date', '');
                setModalValue('modal-cost', '');
                setModalValue('modal-status', '0');
                setModalValue('modal-remarks', existingRecord.insurance_remarks || existingRecord.remarks || '');
                
                // Set Select2 values - client will be cloned with edited data, policy and category are preserved
                setTimeout(() => {
                    // Add the cloned client as a temporary option in the dropdown
                    const clientName = editedClientData ? 
                        editedClientData.firstname + ' ' + 
                        (editedClientData.middlename ? editedClientData.middlename + ' ' : '') + 
                        editedClientData.lastname + ' (Edited - Will be cloned to your office)' :
                        existingRecord.firstname + ' ' + 
                        (existingRecord.middlename ? existingRecord.middlename + ' ' : '') + 
                        existingRecord.lastname + ' (Will be cloned to your office)';
                    const clientSelect = $('#modal-client_id');
                    
                    // Create a new option for the cloned client
                    const newOption = new Option(
                        clientName, 
                        'clone_' + existingRecord.client_id, 
                        true, 
                        true
                    );
                    clientSelect.append(newOption).trigger('change');
                    
                    if (existingRecord.policy_id) {
                        $('#modal-policy_id').val(existingRecord.policy_id).trigger('change');
                    }
                    if (existingRecord.auth_no) {
                        $('#modal-category_id').val(existingRecord.auth_no).trigger('change');
                    }
                }, 100);

            
                // Show office dropdown for superadmin in copy mode
                if (officeSelectGroup && window.isSuperAdmin) {
                    officeSelectGroup.style.display = 'block';
                    const officeSelect = document.getElementById('modal-office_id');
                    if (officeSelect) officeSelect.value = '';
                } else if (officeSelectGroup) {
                    officeSelectGroup.style.display = 'none';
                }
            } else {
            // Edit mode: Existing record in user's office
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
            
            // Hide office dropdown in edit mode - office_id should remain unchanged
            if (officeSelectGroup) {
                officeSelectGroup.style.display = 'none';
            }
        }
    } else {
        // New record - if newClientId provided, pre-select it
        if (newClientId) {
            setModalValue('modal-client_id', newClientId);
        } else {
            setModalValue('modal-client_id', '');
        }
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
        
        // Reset Select2 values for new record (or set new client if provided)
        setTimeout(() => {
            if (newClientId) {
                // New client was already added as an option, just select it
                $('#modal-client_id').val(newClientId).trigger('change');
            } else {
                $('#modal-client_id').val('').trigger('change');
            }
            $('#modal-policy_id').val('').trigger('change');
            $('#modal-category_id').val('').trigger('change');
        }, 100);
        
        // Show office dropdown for superadmin in create mode
        if (officeSelectGroup && window.isSuperAdmin) {
            officeSelectGroup.style.display = 'block';
            // Reset office selection
            const officeSelect = document.getElementById('modal-office_id');
            if (officeSelect) officeSelect.value = '';
        } else if (officeSelectGroup) {
            officeSelectGroup.style.display = 'none';
        }
    }
    
    // Show modal first - force display with high priority
    modal.style.setProperty('display', 'flex', 'important');
    modal.style.setProperty('visibility', 'visible', 'important');
    modal.style.setProperty('opacity', '1', 'important');
    modal.style.setProperty('z-index', '9999', 'important');
    
    if (overlay) {
        overlay.style.setProperty('display', 'block', 'important');
        overlay.style.setProperty('visibility', 'visible', 'important');
        overlay.style.setProperty('opacity', '1', 'important');
        overlay.style.setProperty('z-index', '9998', 'important');
    }
    
    console.log('Modal display styles set:', {
        modalDisplay: modal.style.display,
        modalVisibility: modal.style.visibility,
        modalOpacity: modal.style.opacity,
        modalZIndex: modal.style.zIndex
    });
    
    // Reinitialize Select2 to ensure proper dropdown positioning
    setTimeout(() => {
        $('.js-example-basic-single').select2({
            width: '100%',
            dropdownParent: $('#manageInsuranceModal')
        });
        
        // Verify modal is still visible after Select2 init
        if (modal.style.display === 'none' || window.getComputedStyle(modal).display === 'none') {
            console.warn('Modal was hidden after Select2 init, forcing visible again');
            modal.style.setProperty('display', 'flex', 'important');
        }
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

window.closeInsuranceModal = function() {
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

    // Handle edited client data for cloning
    const editedClientDataField = document.getElementById('modal-edited_client_data');
    if (editedClientDataField && editedClientDataField.value) {
        try {
            payload.edited_client_data = JSON.parse(editedClientDataField.value);
        } catch (e) {
            console.error('Error parsing edited client data:', e);
        }
    }

    // Handle office_id for superadmin
    // In create mode: include office_id if superadmin selected one
    // In edit mode: do NOT include office_id (it should remain unchanged)
    if (!isUpdate && window.isSuperAdmin) {
        const officeId = document.getElementById('modal-office_id')?.value;
        if (officeId) {
            payload.office_id = officeId;
        }
    }
    // If editing, office_id is NOT included in payload - it remains unchanged

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
            if (response.status === 422 && data && data.message) {
                
                closeInsuranceModal();
                
                // Handle duplicate mvfile_no error
                throw new Error(data.message);
            }
            const errMsg = (data && typeof data === 'object' && data.errors && typeof data.errors === 'object')
                ? Object.values(data.errors).flat().filter(Boolean).join(' ')
                : (data && typeof data === 'object' && data.message) || 'Request failed';
            throw new Error(errMsg);
        }

        loadInsuranceData();
        loadStatistics();

        // Get the insurance ID for redirect (use response data for new records)
        let redirectId = insuranceId;
        if (!redirectId && data && data.insurance && data.insurance.id) {
            redirectId = data.insurance.id;
        }
        closeInsuranceModal();
        // Show success message before redirect
        Swal.fire({
            title: 'Success!',
            text: isUpdate ? 'Insurance record updated successfully!' : 'Insurance record added successfully!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            // Redirect to view page after successful save/update
            
            if (redirectId) {
                window.location.href = `/insurances/${redirectId}`;
            }
        });
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
        isSubmitting = false; // Reset submission flag
    }
}

// View insurance details
function viewInsuranceDetails(id) {
    window.location.href = `/insurances/${id}`;
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
    window.location.href = `/insurances/${id}`;
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
function openEditInsuranceModal(id) {
    currentMode = 'edit';
    const modal = document.getElementById('manageInsuranceModal');
    const overlay = document.getElementById('insuranceModalOverlay');
    const form = document.getElementById('insuranceForm');
    const submitBtn = document.getElementById('insuranceSubmitBtn');
    const modalTitle = document.getElementById('manageInsuranceModalTitle');
    const officeSelectGroup = document.getElementById('officeSelectGroup');
    
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
            
            // Hide office dropdown in edit mode - office_id should remain unchanged
            if (officeSelectGroup) {
                officeSelectGroup.style.display = 'none';
            }
            
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
window.deleteInsurance = function(id) {

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
                    Swal.fire(
                        'Deleted!',
                        'Insurance record has been deleted.',
                        'success'
                    );
                } else {
                    Swal.fire(
                        'Error!',
                        data.message || 'Failed to delete insurance record.',
                        'error'
                    );
                }
            })
            .catch(error => {
                console.error('Error deleting insurance:', error);
                Swal.fire(
                    'Error!',
                    'An error occurred while deleting the record.',
                    'error'
                );
            });
        }
    });
}

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

$(document).ready(function() {
    $('.js-example-basic-single').on('change', function() {
        updateSelect2Labels();
    });
});

// Show floating notification for MV File found
function showMvFileNotification(existingRecord) {
    const notification = document.getElementById('mvfileNotification');
    if (!notification) return;

    // Store the record for later use
    notification.dataset.record = JSON.stringify(existingRecord);

    // Update notification text with walkin name
    const walkinName = existingRecord.walkin_list || existingRecord.markup || 'N/A';
    const textDiv = notification.querySelector('.notification-text');
    if (textDiv) {
        textDiv.innerHTML = `
            <h4>Vehicle Found in Your Office</h4>
            <p style="font-weight: bold; color: #007bff; margin-bottom: 8px;">Previous Liaison: <span style="font-weight: normal; color: #dc3545;">${walkinName}</span></p>
            <p style="margin-top: 0;">Some old clients may have transferred their name/vehicle. Would you like to edit the client information first?</p>
            `;
    }

    // Show the notification
    notification.classList.remove('hidden');
    notification.style.display = 'block';

    // Disable the Swal confirm button while notification is shown
    const confirmButton = document.querySelector('.swal2-confirm');
    if (confirmButton) {
        confirmButton.disabled = true;
        confirmButton.style.opacity = '0.5';
        confirmButton.style.cursor = 'not-allowed';
    }

    // Notification sticks - no auto-hide
}

// Hide floating notification
function hideMvFileNotification() {
    const notification = document.getElementById('mvfileNotification');
    if (notification) {
        notification.classList.add('hidden');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300); // Match transition duration
    }
}

// Skip client edit - continue with normal flow
window.skipClientEdit = function() {
    // Hide the notification
    hideMvFileNotification();

    // Re-enable the Swal confirm button
    const confirmButton = document.querySelector('.swal2-confirm');
    if (confirmButton) {
        confirmButton.disabled = false;
        confirmButton.style.opacity = '1';
        confirmButton.style.cursor = 'pointer';
    }

    // Keep the MV file input and record details as they are
    // User can now click "Bind & Continue" to proceed with existing record
}

// Transfer client edit - open client edit modal
window.transferClientEdit = function() {
    const notification = document.getElementById('mvfileNotification');
    if (!notification) return;

    const recordData = notification.dataset.record;
    if (!recordData) return;

    try {
        const existingRecord = JSON.parse(recordData);
        hideMvFileNotification();

        // Open client edit modal with the existing record
        // Use globalCocResult to ensure COC data is available
        openClientEditModal(existingRecord, globalCocResult, { mvfile_no: existingRecord.mvfile_no, existingRecord: existingRecord, isCopy: false });
    } catch (error) {
        console.error('Error parsing record data:', error);
    }
}

// Show MV File dialog again after client save (to keep it open for user review)
function showMvFileDialogAgain(mvfileResult, cocResult, editedClientData = null, newClientData = null) {
    console.log('showMvFileDialogAgain called with:', { mvfileResult, cocResult, editedClientData, newClientData });
    
    // Ensure all previous Swal dialogs are closed
    Swal.close();
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        const container = document.createElement('div');
        container.className = 'modern-input-container';
        
        // Determine client display info
        let clientInfo = '';
        if (editedClientData) {
            const fullName = `${editedClientData.firstname} ${editedClientData.middlename ? editedClientData.middlename + ' ' : ''}${editedClientData.lastname}`;
            clientInfo = `<div class="status-message valid" style="margin-bottom: 15px;"><i class="fas fa-check-circle"></i> Client updated: <strong>${fullName}</strong></div>`;
        } else if (newClientData) {
            const fullName = `${newClientData.firstname} ${newClientData.middlename ? newClientData.middlename + ' ' : ''}${newClientData.lastname}`;
            clientInfo = `<div class="status-message valid" style="margin-bottom: 15px;"><i class="fas fa-check-circle"></i> New client created: <strong>${fullName}</strong></div>`;
        }
        
        // Handle case where existingRecord might be null
        const record = mvfileResult.existingRecord || { mvfile_no: mvfileResult.mvfile_no };
        
        container.innerHTML = `
            <div class="input-header">
                <i class="fas fa-car"></i>
                <h3>Bind MV File Number</h3>
            </div>
            ${clientInfo}
            <div class="tutorial-tip-box">
                <i class="fas fa-lightbulb"></i>
                <span><strong>Tip:</strong> Review the MV File information below, then click "Bind & Continue" to proceed to the insurance form.</span>
            </div>
            <div class="input-wrapper">
                <input type="text" id="mvfile-input" class="modern-input" value="${mvfileResult.mvfile_no}" readonly>
                <div class="status-indicator valid"></div>
            </div>
            <div class="status-message valid">MV File ready to bind</div>
            <div class="record-details" id="record-details">
                ${createRecordDetailsHTML(record)}
            </div>
        `;

        console.log('Opening Swal dialog for MV File');

        Swal.fire({
            title: '',
            html: container,
            showCancelButton: true,
            confirmButtonText: 'Bind & Continue',
            cancelButtonText: 'Cancel',
            allowOutsideClick: false,
            customClass: {
                popup: 'modern-swal-popup tutorial-swal-popup',
                confirmButton: 'modern-confirm-btn',
                cancelButton: 'modern-cancel-btn'
            },
            didOpen: () => {
                console.log('MV File dialog opened successfully');
            }
        }).then(result => {
            console.log('MV File dialog result:', result);
            if (result.isConfirmed) {
                // Now proceed to insurance form
                updateProgressStep(4);
                if (editedClientData) {
                    showManageInsuranceModal({
                        mvfile_no: mvfileResult.mvfile_no,
                        coc_no: cocResult.cocNumber,
                        or_no: cocResult.orNumber || cocResult.cocNumber,
                        policy_no: cocResult.policyNumber || cocResult.cocNumber
                    }, mvfileResult.existingRecord || null, mvfileResult.isCopy || false, editedClientData);
                } else if (newClientData) {
                    showManageInsuranceModal({
                        mvfile_no: mvfileResult.mvfile_no,
                        coc_no: cocResult.cocNumber,
                        or_no: cocResult.orNumber || cocResult.cocNumber,
                        policy_no: cocResult.policyNumber || cocResult.cocNumber
                    }, null, false, null, newClientData.id);
                }
            }
        }).catch(error => {
            console.error('Error showing MV File dialog:', error);
        });
    }, 100);
}

// Explicitly expose all functions to window for inline onclick handlers
window.closeInsuranceModal = window.closeInsuranceModal || closeInsuranceModal;
window.closeClientEditModal = window.closeClientEditModal || closeClientEditModal;
window.closeCreateClientModal = window.closeCreateClientModal || closeCreateClientModal;
window.submitClientEdit = window.submitClientEdit || submitClientEdit;
window.submitCreateClient = window.submitCreateClient || submitCreateClient;
window.deleteInsurance = window.deleteInsurance || deleteInsurance;
window.viewInsuranceDetails = window.viewInsuranceDetails || viewInsuranceDetails;
window.editInsuranceDetails = window.editInsuranceDetails || editInsuranceDetails;
window.skipClientEdit = window.skipClientEdit || skipClientEdit;
window.transferClientEdit = window.transferClientEdit || transferClientEdit;
window.showMvFileDialogAgain = window.showMvFileDialogAgain || showMvFileDialogAgain;
