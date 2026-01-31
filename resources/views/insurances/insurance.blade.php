@extends('layouts.app')
 
@section('title', 'Insurance List')
 
@section('content')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="{{ asset('css/insurance.blade.css') }}">

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
                    <button class="control-btn primary" id="addInsuranceBtn">
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
                <button class="action-btn view" id="addInsuranceEmptyBtn">
                    <i class="fas fa-plus-circle"></i>
                    Add New Insurance
                </button>
            </div>
        </div>
    </div>
</div>

<meta name="csrf-token" content="{{ csrf_token() }}">

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>

<script>
    const insuranceDataUrl = "{{ route('insurance.data') }}";
    const insuranceValidateCocUrl = "{{ route('insurance.validateCoc') }}";
    const insuranceValidateMvFileUrl = "{{ route('insurance.validateMvFile') }}";
    const manageInsuranceUrl = "{{ route('insurance.manageInsurance') }}";
</script>

<script src="{{ asset('js/insurance.blade.js') }}"></script>
@endsection

