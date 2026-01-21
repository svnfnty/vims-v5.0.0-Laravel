<?php
use Illuminate\Support\Facades\DB;

$id = request()->query('id', 0);
$filter = request()->query('filter', 'all');

if (!$id) {
    echo '<div class="alert alert-danger">ID not provided.</div>';
    exit;
}

// Retrieve the range of series from the database
$range_row = DB::table('series')
    ->select('name', 'range_start', 'range_stop', 'created_at', 'type')
    ->where('id', $id)
    ->where('status', 1)
    ->where('office_id', session('office_id'))
    ->first();

// Debugging: Check if range_row is fetched correctly
if (!$range_row) {
    echo '<div class="alert alert-danger">No series range found in the database.</div>';
    echo '<pre>' . print_r(DB::table('series')->get(), true) . '</pre>'; // Debug: Output all series data
    exit;
}

$range_start = $range_row->range_start;
$range_stop = $range_row->range_stop;
$range_name = $range_row->name;
$range_created = $range_row->created_at;
$range_type = $range_row->type;

// Retrieve all series in the range with padding
$all_series = array_map(function ($i) {
    return str_pad($i, 8, '0', STR_PAD_LEFT);
}, range($range_start, $range_stop));

// Retrieve issued series from database with padding
$issued_series_rows = DB::table('insurance_list')
    ->join('client_list', 'insurance_list.client_id', '=', 'client_list.id')
    ->select(
        'insurance_list.coc_no',
        'insurance_list.registration_no AS plate_no',
        DB::raw("CONCAT(client_list.lastname, ', ', client_list.firstname) AS name"),
        'insurance_list.cost',
        'insurance_list.policy_status',
        'insurance_list.registration_date AS date'
    )
    ->whereBetween('insurance_list.coc_no', [$range_start, $range_stop])
    ->orderBy('insurance_list.coc_no', 'asc')
    ->get();

// Debugging: Check issued_series_rows
if ($issued_series_rows->isEmpty()) {
    echo '<div class="alert alert-warning">No issued series found in the database.</div>';
    echo '<pre>' . print_r(DB::table('insurance_list')->get(), true) . '</pre>'; // Debug: Output all insurance_list data
}

$issued_series = $issued_series_rows->pluck('coc_no')->map(function ($coc_no) {
    return str_pad($coc_no, 8, '0', STR_PAD_LEFT);
})->toArray();

$unissued_series = array_diff($all_series, $issued_series);

$total_numbers = count($all_series);
$unissued_count = count($unissued_series);
$issued_count = $total_numbers - $unissued_count;

// Apply filter if specified
$display_series = $all_series;
if ($filter === 'available') {
    $display_series = $unissued_series;
} elseif ($filter === 'issued') {
    $display_series = $issued_series;
}

// Debugging: Check filter logic
echo '<pre>Filter: ' . $filter . '</pre>';
echo '<pre>Display Series: ' . print_r($display_series, true) . '</pre>';
 
// Render the series table
?>
<style>
    .series-container {
        max-width: 100%;
        overflow-x: auto;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .series-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 14px;
        margin-top: 15px;
    }

    .series-table th {
        background-color: #f1f5f9;
        color: #334155;
        font-weight: 600;
        padding: 12px 16px;
        border-bottom: 2px solid #e2e8f0;
        position: sticky;
        top: 0;
        text-align: left;
    }

    .series-table td {
        padding: 12px 16px;
        border-bottom: 1px solid #e2e8f0;
        vertical-align: middle;
        transition: background-color 0.2s;
    }

    .series-table tr:hover td {
        background-color: #f8fafc;
    }

    .badge {
        border-radius: 6px;
        padding: 6px 10px;
        font-weight: 600;
        display: inline-block;
        min-width: 80px;
        text-align: center;
        font-size: 13px;
        letter-spacing: 0.5px;
    }

    .badge-issued {
        background-color: #dcfce7;
        color: #166534;
        border: 1px solid #bbf7d0;
    }

    .badge-pending {
        background-color: #fee2e2;
        color: #991b1b;
        border: 1px solid #fecaca;
    }

    .badge-unissued {
        background-color: #e2e8f0;
        color: #475569;
        border: 1px solid #cbd5e1;
    }

    .series-link {
        display: inline-block;
        padding: 6px 12px;
        background-color: transparent;
        color: #2563eb;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        border: 2px solid #2563eb;
        transition: all 0.3s ease;
        cursor: pointer;
        font-size: 13px;
    }

    .series-link:hover {
        background-color: #2563eb;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(37, 99, 235, 0.15);
    }

    .verify-btn {
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        text-decoration: none;
    }

    .verify-btn:hover {
        background-color: #1d4ed8;
        transform: translateY(-1px);
    }

    .status-dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 6px;
    }

    .dot-issued {
        background-color: #16a34a;
    }

    .dot-pending {
        background-color: #dc2626;
    }

    .dot-unissued {
        background-color: #64748b;
    }

    .series-image {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        object-fit: cover;
        border: 2px solid #e2e8f0;
        transition: transform 0.3s;
    }

    .series-image:hover {
        transform: scale(1.1);
    }

    .walkin-badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 0.5px;
    }

    .cost-display {
        font-weight: 700;
        color: #16a34a;
        font-size: 14px;
    }
</style>

<div class="series-container">
    <table class="series-table">
        <thead>
            <tr>
                <th>COC No</th>
                <th>Name</th>
                <th>Plate No</th>
                <th>Cost</th>
                <th>Policy Status</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($issued_series_rows as $row): ?>
                <tr>
                    <td><?= htmlspecialchars($row->coc_no) ?></td>
                    <td><?= htmlspecialchars($row->name) ?></td>
                    <td><?= htmlspecialchars($row->plate_no) ?></td>
                    <td><?= htmlspecialchars($row->cost) ?></td>
                    <td><?= htmlspecialchars($row->policy_status) ?></td>
                    <td><?= htmlspecialchars($row->date) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<script>
async function confirmAndOpenModal(series, existingMvFileNo = "") {
    // Custom Swal2 theme
    const swalTheme = {
        confirmButton: 'swal2-confirm-btn',
        cancelButton: 'swal2-cancel-btn',
        input: 'swal2-input-design'
    };

      // 1. Enhanced Confirmation Dialog
    const { isConfirmed } = await Swal.fire({
        title: `<span class="swal2-title">Use this COC Number?</span>`,
        html: `<div class="swal2-content">
                 <p>Do you want to use this COC number for processing?</p>
                 <div class="coc-badge">${series}</div>
               </div>`,
        icon: 'question',
        iconColor: '#3b82f6',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-check-circle"></i> Yes, Use It',
        cancelButtonText: '<i class="fas fa-times-circle"></i> No, Cancel',
        buttonsStyling: false,
        customClass: {
            popup: 'swal2-popup-design',
            confirmButton: swalTheme.confirmButton,
            cancelButton: swalTheme.cancelButton,
            title: 'swal2-title-design'
        },
        background: '#f8fafc',
        showClass: {
            popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp animate__faster'
        }
    });
    if (!isConfirmed) return;

    // Create MV File input container with status handling and details area
    const inputContainer = document.createElement('div');
    inputContainer.className = 'mvfile-input-container';
    
    inputContainer.innerHTML = `
        <div class="input-guide">Please bind MV File number for this transaction</div>
        <div class="mvfile-input-wrapper">
            <input type="text" id="mvfile-input" class="${swalTheme.input}" placeholder="MVF-XXXX-XXXX" 
                   value="${existingMvFileNo}" autocapitalize="off" autocorrect="off">
            <div class="status-indicator" id="status-indicator"></div>
        </div>
        <div class="status-message" id="status-message"></div>
        <div class="record-details-container" id="record-details" style="display: none; margin-top: 20px;"></div>
    `;

    // Show the input dialog with real-time validation
    const { value: mvfile_no } = await Swal.fire({
        title: `<span class="swal2-title">Bind MV File Number</span>`,
        html: inputContainer,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-link"></i> Bind',
        cancelButtonText: '<i class="fas fa-times"></i> Cancel',
        buttonsStyling: false,
        customClass: {
            popup: 'swal2-popup-design',
            confirmButton: `${swalTheme.confirmButton} verify-btn`,
            cancelButton: swalTheme.cancelButton
        },
        backdrop: `
            rgba(14, 165, 233, 0.08)
            url("/images/scan-line.gif")
            center top
            no-repeat
        `,
        didOpen: () => {
            const input = document.getElementById('mvfile-input');
            const statusIndicator = document.getElementById('status-indicator');
            const statusMessage = document.getElementById('status-message');
            const recordDetails = document.getElementById('record-details');
            
            // Real-time validation and MV File checking
            input.addEventListener('input', async function(e) {
                const value = e.target.value.trim();
                
                // Reset UI
                statusIndicator.className = 'status-indicator';
                statusMessage.textContent = '';
                recordDetails.style.display = 'none';
                recordDetails.innerHTML = '';
                
                if (!value) return;
                
                // Format validation
                const digitsOnly = value.replace(/\D/g, '');
                if (digitsOnly.length !== 15) {
                    statusIndicator.className = 'status-indicator invalid';
                    statusMessage.textContent = 'Must be exactly 15 digits (excluding hyphens)';
                    statusMessage.className = 'status-message error';
                    return;
                }
                
                if (!/^[A-Za-z0-9-]{15,19}$/.test(value)) {
                    statusIndicator.className = 'status-indicator invalid';
                    statusMessage.textContent = 'Invalid format. Use: MVF-1234-5678-9012';
                    statusMessage.className = 'status-message error';
                    return;
                }
                
                // Check MV File availability
                statusIndicator.className = 'status-indicator checking';
                statusMessage.textContent = 'Checking MV File availability...';
                statusMessage.className = 'status-message checking';
                
                try {
                    const response = await fetch(`check_mvfile.php?mvfile_no=${value}`);
                    const data = await response.json();
                    
                    if (data.exists) {
                        statusIndicator.className = 'status-indicator valid';
                        statusMessage.textContent = 'MV file available.';
                        statusMessage.className = 'status-message valid';
                        
                        // Show record details directly in the same popup
                        recordDetails.style.display = 'block';
                        recordDetails.innerHTML = `
                            <div class="existing-record-notice">
                                <i class="fas fa-info-circle"></i> Existing record found - will be updated
                            </div>
                            ${generateRecordDetailsHtml(series, data)}
                        `;
                    } else {
                        statusIndicator.className = 'status-indicator warning';
                        statusMessage.textContent = 'MV File not found - will create new record';
                        statusMessage.className = 'status-message warning';
                    }
                } catch (error) {
                    statusIndicator.className = 'status-indicator error';
                    statusMessage.textContent = 'Error checking MV File';
                    statusMessage.className = 'status-message error';
                    console.error(error);
                }
            });
            
            // Trigger initial validation if default value exists
            if (existingMvFileNo) {
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        },
        preConfirm: () => {
            const input = document.getElementById('mvfile-input');
            const value = input.value.trim();
            
            if (!value) {
                Swal.showValidationMessage('MV File number is required!');
                return false;
            }
            
            const digitsOnly = value.replace(/\D/g, '');
            if (digitsOnly.length !== 15) {
                Swal.showValidationMessage('Must be exactly 15 digits (excluding hyphens)');
                return false;
            }
            
            if (!/^[A-Za-z0-9-]{15,19}$/.test(value)) {
                Swal.showValidationMessage('Invalid format. Use: MVF-1234-5678-9012');
                return false;
            }
            
            return value;
        }
    });

    // If user clicked "Bind" button, proceed directly
    if (mvfile_no) {
        try {
            // Show loading state
            Swal.fire({
                html: '<p class="verifying-text">Processing MV File...</p>',
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => Swal.showLoading()
            });

            // Check MV File status one more time to be sure
            const response = await fetch(`check_mvfile.php?mvfile_no=${mvfile_no}`);
            const data = await response.json();
            Swal.close();

            // Open the appropriate modal directly
            if (data.exists) {
                openInsuranceModal('update', data.insurance.id, series, mvfile_no);
            } else {
                openInsuranceModal('create', null, series, mvfile_no);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: '<span style="color:#ef4444">Processing Failed</span>',
                html: `<div class="error-message">
                         <i class="fas fa-circle-exclamation"></i>
                         <p>System couldn't process MV File</p>
                      </div>`,
                confirmButtonText: '<i class="fas fa-rotate-right"></i> Try Again',
                customClass: { confirmButton: 'error-retry-btn' }
            });
            console.error(error);
        }
    }
}

// Helper function to generate record details HTML
function generateRecordDetailsHtml(series, data) {
    const insurance = data.insurance || {};
    const client = data.client || {};
    
    return `
        <div class="record-details">
            <div class="detail-section">
                <div class="detail-row">
                    <span class="detail-label">Policy No:</span>
                    <span class="detail-value">${insurance.policy_no || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">COC No:</span>
                    <span class="detail-value">${insurance.coc_no || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">OR No:</span>
                    <span class="detail-value">${insurance.or_no || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Registration Date:</span>
                    <span class="detail-value">${insurance.registration_date || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Expiry Date:</span>
                    <span class="detail-value">${insurance.expiration_date || 'N/A'}</span>
                </div>
            </div>
            
            ${client.id ? `
            <div class="detail-section">
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${client.fullname || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Address:</span>
                    <span class="detail-value">${client.address || 'N/A'}</span>
                </div>
            </div>
            ` : '<div class="no-client-notice">No client associated with this record</div>'}
            
            <div class="update-notice">
                <i class="fas fa-sync-alt"></i> Will update with new COC: ${series}
            </div>
        </div>
    `;
}

// Open insurance modal with appropriate parameters
function openInsuranceModal(action, id, series, mvfile_no) {
    uni_modal(
        `<i class="fas ${action === 'update' ? 'fa-file-pen' : 'fa-file-circle-plus'}"></i> ${action === 'update' ? 'Update' : 'New'} Insurance`,
        `insurances/manage_insurance.php?${id ? `id=${id}&` : ''}identifier=${mvfile_no}&coc_no=${encodeURIComponent(series)}&policy_no=${encodeURIComponent(series)}&or_no=${encodeURIComponent(series)}${action === 'create' ? `&mvfile_no=${mvfile_no}` : ''}`,
        "mid-large",
        {
            onOpen: () => {
                document.querySelector('.uni-modal-header').classList.add(`${action}-header`);
            }
        }
    );
}


// Add the new CSS styles
document.head.insertAdjacentHTML('beforeend', `
<style>
/* New styles for inline record display */
.record-details-container {
    background: #f8fafc;
    border-radius: 8px;
    padding: 15px;
    border: 1px solid #e2e8f0;
}

.existing-record-notice {
    background: #dbeafe;
    color: #1e40af;
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 15px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.existing-record-notice i {
    font-size: 16px;
}

.record-details {
    font-size: 14px;
}

.details-title {
    margin: 0 0 12px 0;
    color: #1e293b;
    font-size: 15px;
    font-weight: 600;
    padding-bottom: 8px;
    border-bottom: 1px dashed #cbd5e1;
}

.detail-row {
    display: flex;
    margin-bottom: 8px;
}

.detail-label {
    flex: 0 0 120px;
    color: #475569;
    font-weight: 500;
}

.detail-value {
    flex: 1;
    color: #1e293b;
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: 'Roboto Mono', monospace;
}

.update-notice {
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px dashed #cbd5e1;
    color: #4338ca;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.update-notice i {
    color: #6366f1;
}

/* MV File Input Container Styles */
.mvfile-input-container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}

.mvfile-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.status-indicator {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-left: 10px;
    flex-shrink: 0;
    transition: all 0.3s ease;
}

.status-indicator.valid {
    background-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.status-indicator.invalid {
    background-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.status-indicator.checking {
    background-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
    animation: pulse 1.5s infinite;
}

.status-indicator.error {
    background-color: #6b7280;
    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.2);
}

.status-message {
    font-size: 0.8em;
    margin-top: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.status-message.error {
    color: #ef4444;
    background-color: #fef2f2;
}

.status-message.warning {
    color: #f59e0b;
    background-color: #fffbeb;
}

.status-message.valid {
    color: #10b981;
    background-color: #ecfdf5;
}

.status-message.checking {
    color: #3b82f6;
    background-color: #eff6ff;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}

/* SWAL2 CUSTOM THEME */
.swal2-popup-design {
    border-radius: 12px !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
    border: 1px solid #e2e8f0 !important;
}

.swal2-title-design {
    color: #1e293b !important;
    font-weight: 600 !important;
    font-size: 1.25rem !important;
}

.swal2-confirm-btn {
    background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
    color: white !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 10px 24px !important;
    font-weight: 500 !important;
    transition: all 0.2s !important;
}

.swal2-cancel-btn {
    background: white !important;
    color: #64748b !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 8px !important;
    padding: 10px 24px !important;
    font-weight: 500 !important;
    transition: all 0.2s !important;
}

.swal2-input-design {
    border: 1px solid #e2e8f0 !important;
    border-radius: 8px !important;
    padding: 12px !important;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
    width: 100%;
}

/* SPECIAL ELEMENTS */
.coc-badge {
    background: #f0f9ff;
    color: #0369a1;
    padding: 8px 16px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 1.1em;
    border: 1px dashed #7dd3fc;
    margin: 10px 0;
    display: inline-block;
}

.input-guide {
    font-size: 0.85em;
    color: #64748b;
    margin-top: -10px;
    margin-bottom: 15px;
}

.loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.verifying-text {
    color: #64748b;
    font-size: 1.1em;
}

.error-message i {
    color: #ef4444;
    font-size: 2.5em;
    margin-bottom: 15px;
}

.error-message p {
    color: #475569;
    margin-top: 10px;
}

.error-retry-btn {
    background: #fef2f2 !important;
    color: #dc2626 !important;
    border: 1px solid #fecaca !important;
}

/* MODAL HEADER STYLES */
.update-header {
    background: linear-gradient(135deg, #f0f9ff, #e0f2fe) !important;
    border-bottom: 1px solid #7dd3fc !important;
}

.create-header {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7) !important;
    border-bottom: 1px solid #86efac !important;
}

</style>
`);

function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const originalColor = element.style.color;
        const originalBgColor = element.style.backgroundColor;
        const originalBorderColor = element.style.borderColor;
        
        element.style.color = 'white';
        element.style.backgroundColor = '#16a34a';
        element.style.borderColor = '#16a34a';
        
        setTimeout(() => {
            element.style.color = originalColor;
            element.style.backgroundColor = originalBgColor;
            element.style.borderColor = originalBorderColor;
        }, 1000);
        
        toastr.success('Copied to clipboard: ' + text, '', {
            positionClass: 'toast-bottom-right',
            progressBar: true,
            timeOut: 3000
        });
    }).catch(err => {
        console.error('Failed to copy: ', err);
        toastr.error('Failed to copy text', '', {
            positionClass: 'toast-bottom-right',
            progressBar: true,
            timeOut: 3000
        });
    });
}
</script>
