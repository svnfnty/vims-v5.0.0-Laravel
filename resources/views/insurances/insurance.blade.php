@extends('layouts.app')
 
@section('content')
@vite(['resources/css/insurance.css', 'resources/js/insurance.js', 'resources/css/tutorial.css', 'resources/js/tutorial.js'])
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="{{ asset('css/select2search.blade.css') }}">
<div class="insurance-dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
        <div class="header-content">
            <div class="logo-section">
                <div class="logo-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <div class="system-info">
                    <h1 class="system-title">List of Insurances</h1>
                    <p class="system-subtitle">Streamlined policy management in simple steps</p>
                </div>
            </div>
            <div class="user-controls">
                <div class="batch-controls">
                    <button class="control-btn primary" id="addInsuranceBtn" data-tutorial-target="insurance-create">
                        <i class="fas fa-plus-circle"></i>
                        New Insurance
                    </button>
                    <button class="control-btn primary" id="loadInsuranceDataBtn">
                        <i class="fas fa-database"></i>
                        Load Data
                    </button>
                </div>
                <div class="timer-display" id="countdown" style="display:none;"></div>
            </div>
        </div>
    </div>

    <!-- Quick Stats -->
    <div class="dashboard-stats">
        <div class="stat-card">
            <div class="stat-icon pending">
                <i class="fas fa-clock"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="pendingCount">0</span>
                <span class="stat-label">Pending</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon expired">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="expiredCount">0</span>
                <span class="stat-label">Expired</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon total">
                <i class="fas fa-file-contract"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="totalCount">0</span>
                <span class="stat-label">Total Policies</span>
            </div>
        </div>
    </div>

    <!-- Process Flow -->
    <div class="process-flow">
        <h2 class="section-title">Insurance Issuance Process</h2>
        <div class="flow-steps">
            <div class="flow-step active" data-step="1">
                <div class="step-indicator">
                    <div class="step-number">1</div>
                    <div class="step-connector"></div>
                </div>
                <div class="step-content">
                    <h3>COC Entry</h3>
                    <p>Enter Certificate of Cover details</p>
                </div>
            </div>
            <div class="flow-step" data-step="2">
                <div class="step-indicator">
                    <div class="step-number">2</div>
                    <div class="step-connector"></div>
                </div>
                <div class="step-content">
                    <h3>MV File Binding</h3>
                    <p>Link to motor vehicle file</p>
                </div>
            </div>
            <div class="flow-step" data-step="3">
                <div class="step-indicator">
                    <div class="step-number">3</div>
                    <div class="step-connector"></div>
                </div>
                <div class="step-content">
                    <h3>Policy Details</h3>
                    <p>Complete policy information</p>
                </div>
            </div>
            <div class="flow-step" data-step="4">
                <div class="step-indicator">
                    <div class="step-number">4</div>
                </div>
                <div class="step-content">
                    <h3>Confirmation</h3>
                    <p>Review and finalize</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Policies Section -->
    <div class="policies-section">
        <div class="section-header">
            <h2 class="section-title">Recent Insurance Policies</h2>
            <div class="view-controls">
                <div class="view-toggle">
                    <button class="toggle-btn active" data-view="cards">
                        <i class="fas fa-th-large"></i>
                        Cards
                    </button>
                    <button class="toggle-btn" data-view="grid">
                        <i class="fas fa-th"></i>
                        Grid
                    </button>
                    <button class="toggle-btn" data-view="list">
                        <i class="fas fa-list"></i>
                        List
                    </button>
                </div>
                <div class="filter-controls">
                    <select class="filter-select" id="statusFilter">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Policies Container -->
        <div class="policies-grid" id="policiesGrid">
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-file-contract"></i>
                </div>
                <h3>No Insurance Policies Found</h3>
                <p>Get started by adding your first insurance policy</p>
            </div>
        </div>
    </div>
</div>

<!-- Manage Insurance Modal (client-style: full editable form, Save/Update) -->
<div id="manageInsuranceModal" class="modal insurance-form-modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="manageInsuranceModalTitle">Insurance Form</h2>
            <button type="button" class="modal-close" onclick="closeInsuranceModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="insuranceForm" method="POST">
                @csrf
                <input type="hidden" id="insurance_form_method" name="_method" value="POST">
                <input type="hidden" id="insurance_id" name="insurance_id" value="">

                <!-- All your form fields remain unchanged -->
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-mvfile_no" name="mvfile_no" placeholder=" ">
                    <label for="modal-mvfile_no">MV File No</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-coc_no" name="coc_no" placeholder=" ">
                    <label for="modal-coc_no">COC No</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-or_no" name="or_no" placeholder=" ">
                    <label for="modal-or_no">OR No</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-policy_no" name="policy_no" placeholder=" ">
                    <label for="modal-policy_no">Policy No</label>
                </div>
                <div class="floating-label">
                    <select class="js-example-basic-single" id="modal-client_id" name="client_id" placeholder=" " required>
                        <option value="">Select Client</option>
                        @foreach($clients ?? [] as $client)
                            <option value="{{ $client->id }}">{{ $client->lastname }}, {{ $client->firstname }}{{ $client->middlename ? ' ' . $client->middlename : '' }}</option>
                        @endforeach
                    </select>
                    <label for="modal-client_id">Client <span style="color: var(--danger);">*</span></label>
                </div>
                <div class="floating-label">
                    <select class="js-example-basic-single" id="modal-policy_id" name="policy_id" placeholder=" " required>
                        <option value="">Select Policy</option>
                        @foreach($policies ?? [] as $policy)
                            <option value="{{ $policy->id }}">{{ $policy->name }} ({{ $policy->code }})</option>
                        @endforeach
                    </select>
                    <label for="modal-policy_id">Policy <span style="color: var(--danger);">*</span></label>
                </div>
                <div class="floating-label">
                    <select class="js-example-basic-single" id="modal-category_id" name="category_id" placeholder=" " required>
                        <option value="">Select Category</option>
                        @foreach($categories ?? [] as $category)
                            <option value="{{ $category->id }}">{{ $category->name }} ({{ $category->code }})</option>
                        @endforeach
                    </select>
                    <label for="modal-category_id">Category <span style="color: var(--danger);">*</span></label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-registration_no" name="registration_no" placeholder=" ">
                    <label for="modal-registration_no">Registration No</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-chassis_no" name="chassis_no" placeholder=" ">
                    <label for="modal-chassis_no">Chassis No</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-engine_no" name="engine_no" placeholder=" ">
                    <label for="modal-engine_no">Engine No</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-vehicle_model" name="vehicle_model" placeholder=" ">
                    <label for="modal-vehicle_model">Vehicle Model</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-vehicle_color" name="vehicle_color" placeholder=" ">
                    <label for="modal-vehicle_color">Vehicle Color</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-make" name="make" placeholder=" ">
                    <label for="modal-make">Make</label>
                </div>
                <div class="floating-label">
                    <input type="date" class="form-control" id="modal-registration_date" name="registration_date" placeholder=" ">
                    <label for="modal-registration_date">Registration Date</label>
                </div>
                <div class="floating-label">
                    <input type="date" class="form-control" id="modal-expiration_date" name="expiration_date" placeholder=" ">
                    <label for="modal-expiration_date">Expiration Date</label>
                </div>
                <div class="floating-label">
                    <select class="form-control" id="modal-status" name="status" placeholder=" ">
                        <option value="0">Pending</option>
                        <option value="1">Active</option>
                    </select>
                    <label for="modal-status">Status</label>
                </div>
                <div class="floating-label">
                    <textarea class="form-control" id="modal-remarks" name="remarks" rows="2" placeholder=" "></textarea>
                    <label for="modal-remarks">Remarks</label>
                </div>

                @if($isSuperAdmin)
                <div class="floating-label" id="officeSelectGroup">
                    <select class="form-control" id="modal-office_id" name="office_id" placeholder=" ">
                        <option value="">Select Office (Optional - defaults to your office)</option>
                        @foreach($offices as $office)
                            <option value="{{ $office->id }}">{{ $office->office_name }}</option>
                        @endforeach
                    </select>
                    <label for="modal-office_id">Assign to Office</label>
                    <span class="error-message" id="office_id-error"></span>
                </div>
                @endif

        </div>
        <div class="modal-actions">
            <button type="submit" class="control-btn primary" id="insuranceSubmitBtn">
                <i class="fas fa-check-circle"></i> Save Record
            </button>
            <button type="button" class="control-btn secondary" onclick="closeInsuranceModal()">
                <i class="fas fa-times-circle"></i> Cancel
            </button>
        </div>
        </form>
    </div>
</div>

<!-- Client Edit Modal (for editing client info before copying) -->
<div id="clientEditModal" class="modal insurance-form-modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Edit Client Information</h2>
            <button type="button" class="modal-close" onclick="closeClientEditModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="clientEditForm">
                <input type="hidden" id="edit-client-original-id" value="">
                
                <div class="floating-label">
                    <input type="text" class="form-control" id="edit-firstname" name="firstname" placeholder=" " required>
                    <label for="edit-firstname">First Name <span style="color: var(--danger);">*</span></label>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="edit-middlename" name="middlename" placeholder=" ">
                    <label for="edit-middlename">Middle Name</label>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="edit-lastname" name="lastname" placeholder=" " required>
                    <label for="edit-lastname">Last Name <span style="color: var(--danger);">*</span></label>
                </div>

                <div class="floating-label">
                    <input type="email" class="form-control" id="edit-email" name="email" placeholder=" ">
                    <label for="edit-email">Email Address</label>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="edit-contact" name="contact" placeholder=" ">
                    <label for="edit-contact">Contact Number</label>
                </div>

                <div class="floating-label">
                    <input type="date" class="form-control" id="edit-dob" name="dob" placeholder=" ">
                    <label for="edit-dob">Date of Birth</label>
                </div>

                <div class="floating-label">
                    <select class="form-control" id="edit-markup" name="markup" placeholder=" ">
                        <option value="">Select Markup</option>
                        @foreach($walkin_list ?? [] as $walkin)
                            <option value="{{ $walkin->name }}">{{ $walkin->name }}</option>
                        @endforeach
                    </select>
                    <label for="edit-markup">Markup</label>
                </div>

                <div class="floating-label">
                    <textarea class="form-control" id="edit-address" name="address" rows="2" placeholder=" "></textarea>
                    <label for="edit-address">Address</label>
                </div>

                <div class="original-info" id="originalClientInfo" style="margin-top: 16px; padding: 12px; background: #f8fafc; border-radius: 6px; border-left: 3px solid var(--primary);">
                    <small style="color: var(--gray); font-size: 13px;">
                        <i class="fas fa-info-circle" style="color: var(--primary); margin-right: 6px;"></i>
                        <span id="originalClientName">Original: </span>
                    </small>
                </div>
            </form>
        </div>
        <div class="modal-actions">
            <button type="button" class="control-btn primary" id="clientEditContinueBtn" onclick="submitClientEdit()">
                <i class="fas fa-check-circle"></i> Continue to Insurance Form
            </button>
            <button type="button" class="control-btn secondary" onclick="closeClientEditModal()">
                <i class="fas fa-times-circle"></i> Cancel
            </button>
        </div>
    </div>
</div>

<!-- Create Client Modal (for creating new client when MV File not found) -->
<div id="createClientModal" class="modal insurance-form-modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Create New Client</h2>
            <button type="button" class="modal-close" onclick="closeCreateClientModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="createClientForm">
                <div class="info-banner" style="margin-bottom: 16px; padding: 12px; background: #e0f2fe; border-radius: 6px; border-left: 3px solid #0ea5e9;">
                    <small style="color: #0369a1; font-size: 13px;">
                        <i class="fas fa-info-circle" style="margin-right: 6px;"></i>
                        MV File not found in records. Please create a new client to continue.
                    </small>
                </div>
                
                <div class="floating-label">
                    <input type="text" class="form-control" id="create-firstname" name="firstname" placeholder=" " required>
                    <label for="create-firstname">First Name <span style="color: var(--danger);">*</span></label>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="create-middlename" name="middlename" placeholder=" ">
                    <label for="create-middlename">Middle Name</label>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="create-lastname" name="lastname" placeholder=" " required>
                    <label for="create-lastname">Last Name <span style="color: var(--danger);">*</span></label>
                </div>

                <div class="floating-label">
                    <input type="email" class="form-control" id="create-email" name="email" placeholder=" ">
                    <label for="create-email">Email Address</label>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="create-contact" name="contact" placeholder=" ">
                    <label for="create-contact">Contact Number</label>
                </div>

                <div class="floating-label">
                    <input type="date" class="form-control" id="create-dob" name="dob" placeholder=" ">
                    <label for="create-dob">Date of Birth</label>
                </div>

                <div class="floating-label">
                    <select class="form-control" id="create-markup" name="markup" placeholder=" ">
                        <option value="">Select Markup</option>
                        @foreach($walkin_list ?? [] as $walkin)
                            <option value="{{ $walkin->name }}">{{ $walkin->name }}</option>
                        @endforeach
                    </select>
                    <label for="create-markup">Markup</label>
                </div>

                <div class="floating-label">
                    <textarea class="form-control" id="create-address" name="address" rows="2" placeholder=" "></textarea>
                    <label for="create-address">Address</label>
                </div>
            </form>
        </div>
        <div class="modal-actions">
            <button type="button" class="control-btn primary" id="createClientContinueBtn" onclick="submitCreateClient()">
                <i class="fas fa-check-circle"></i> Create Client & Continue
            </button>
            <button type="button" class="control-btn secondary" onclick="closeCreateClientModal()">
                <i class="fas fa-times-circle"></i> Cancel
            </button>
        </div>
    </div>
</div>

<!-- Floating Notification for MV File Found -->
<div id="mvfileNotification" class="floating-notification" style="display: none;">
    <div class="notification-content">
        <div class="notification-icon">
            <i class="fas fa-info-circle"></i>
        </div>
        <div class="notification-text">
            <h4>MV File Found in Your Office</h4>
            <p>Some old clients may have transferred their name/vehicle. Would you like to edit the client information first?</p>
        </div>
        <div class="notification-actions">
            <button class="notification-btn skip" onclick="skipClientEdit()">
                <i class="fas fa-forward"></i> Skip
            </button>
            <button class="notification-btn transfer" onclick="transferClientEdit()">
                <i class="fas fa-user-edit"></i> Transfer Owner
            </button>
        </div>
    </div>
</div>

<!-- Modal Overlays -->
<div id="insuranceModalOverlay" class="modal-overlay" style="display: none;" onclick="closeInsuranceModal()"></div>
<div id="clientEditModalOverlay" class="modal-overlay" style="display: none;" onclick="closeClientEditModal()"></div>
<div id="createClientModalOverlay" class="modal-overlay" style="display: none;" onclick="closeCreateClientModal()"></div>

<meta name="csrf-token" content="{{ csrf_token() }}">

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
  
<script>
    const insuranceDataUrl = "{{ route('insurance.data') }}";
    const insuranceValidateCocUrl = "{{ route('insurance.validateCoc') }}";
    const insuranceValidateMvFileUrl = "{{ route('insurance.validateMvFile') }}";
    const manageInsuranceUrl = "{{ route('insurance.manageInsurance') }}";
    const insuranceStoreUrl = "{{ route('insurance.store') }}";
    const insuranceUpdateUrl = "{{ url('insurances') }}";
    window.userPermissions = {{ auth()->user()->permissions ?? 0 }};
    window.userId = {{ auth()->user()->id ?? 0 }};
    window.userOfficeId = {{ auth()->user()->office_id ?? 0 }};
    window.isSuperAdmin = {{ $isSuperAdmin ? 'true' : 'false' }};
</script>

<!-- Tutorial Step Completion Handler -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Listen for insurance form submission to trigger tutorial completion
        const insuranceForm = document.getElementById('insuranceForm');
        if (insuranceForm) {
            insuranceForm.addEventListener('submit', function() {
                // Dispatch event to notify tutorial system
                window.dispatchEvent(new CustomEvent('tutorial:actionCompleted', {
                    detail: { step: 5, action: 'insurance_created' }
                }));
            });
        }
    });
</script>

<script>
    $(document).ready(function() {
        $('.js-example-basic-single').select2({
            width: '100%',
            containerCssClass: function() {
                return $(this).hasClass('form-control') ? 'form-control' : '';
            }
        });
    });
</script>

@endsection
