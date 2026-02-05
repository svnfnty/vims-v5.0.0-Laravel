@extends('layouts.app')
@section('content')
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
    @import url('{{ asset("css/policies.blade.css") }}');
</style>
 
<div class="policies-dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
        <div class="header-content">
            <div class="logo-section">
                <div class="logo-icon">
                    <i class="fas fa-file-contract"></i>
                </div>
                <div class="system-info">
                    <h1 class="system-title">List of Policies</h1>
                    <p class="system-subtitle">Manage your policy database efficiently</p>
                </div>
            </div>
            <div class="user-controls">
                <div class="batch-controls">
                    <button class="control-btn primary" id="create_new">
                        <i class="fas fa-plus-circle"></i>
                        New Policy
                    </button>
                    <button class="control-btn primary" id="loadDataBtn">
                        <i class="fas fa-database"></i>
                        Load Data
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Stats -->
    <div class="dashboard-stats" id="statsContainer">
        <div class="stat-card">
            <div class="stat-icon total">
                <i class="fas fa-file-contract"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="totalPolicies">0</span>
                <span class="stat-label">Total Policies</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon active">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="activePolicies">0</span>
                <span class="stat-label">Active Policies</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon inactive">
                <i class="fas fa-file-contract"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="inactivePolicies">0</span>
                <span class="stat-label">Inactive</span>
            </div>
        </div>
    </div>

    <!-- Policies Section -->
    <div class="policies-section">
        <div class="section-header">
            <h2 class="section-title">Policy List</h2>
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
                    <button class="toggle-btn" data-view="table">
                        <i class="fas fa-table"></i>
                        Table
                    </button>
                </div>
                <div class="filter-controls">
                    <select class="filter-select" id="statusFilter">
                       <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Card/Grid/List Views -->
        <div class="policies-grid cards-view active" id="cardView">
            <!-- Policies will be loaded here dynamically -->
        </div>

        <!-- Table View -->
        <div class="modern-table-container" id="tableView">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date Created</th>
                        <th>Policy Code</th>
                        <th>Policy Name</th>
                        <th>Category</th>
                        <th>Cost</th>
                        @if(auth()->user()->id == 1 && auth()->user()->office_id == 0)
                            <th>Office</th>
                        @endif
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    <!-- Table rows will be loaded here dynamically -->
                </tbody>
            </table>
        </div>

        <!-- Empty State for Filtered Results -->
        <div class="empty-state hidden" id="filteredEmptyState">
            <div class="empty-icon">
                <i class="fas fa-search"></i>
            </div>
            <h3>No Matching Policies Found</h3>
            <p>No policies match your current filter criteria. Try adjusting your filters.</p>
            <button class="control-btn secondary" id="resetFilters">
                <i class="fas fa-refresh"></i>
                Reset Filters
            </button>
        </div>
    </div>
</div>

<!-- Modal for Create/Edit/View -->
<div id="policyModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modalTitle">Policy Form</h2>
            <button type="button" class="modal-close" onclick="closePolicyModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="policyForm" method="POST">
                @csrf
                <input type="hidden" id="formMethod" name="_method" value="POST">

                <div class="floating-label">
                    <select class="form-control" id="category_id" name="category_id" placeholder=" " required>
                        <option value="">Select Category</option>
                        @forelse($categories as $category)
                            <option value="{{ $category->id }}" data-name="{{ $category->name }}">
                                {{ $category->name }}
                            </option>
                        @empty
                            <option value="">No categories available</option>
                        @endforelse
                    </select>
                    <label for="category_id">Category <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="category_id-error"></span>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="code" name="code" placeholder=" " required>
                    <label for="code">Policy Code <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="code-error"></span>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="name" name="name" placeholder=" " required>
                    <label for="name">Policy Name <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="name-error"></span>
                </div>

                <div class="floating-label">
                    <textarea class="form-control" id="description" name="description" rows="3" placeholder=" "></textarea>
                    <label for="description">Description</label>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="description1" name="description1" placeholder=" ">
                    <label for="description1">Description 1</label>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="description2" name="description2" placeholder=" ">
                    <label for="description2">Description 2</label>
                </div>

                <div class="floating-label">
                    <input type="number" class="form-control" id="duration" name="duration" placeholder=" ">
                    <label for="duration">Duration (months)</label>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="third_party_liability" name="third_party_liability" placeholder=" ">
                    <label for="third_party_liability">Third Party Liability</label>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="personal_accident" name="personal_accident" placeholder=" ">
                    <label for="personal_accident">Personal Accident</label>
                </div>

                <div class="floating-label">
                    <input type="number" step="0.01" class="form-control" id="tppd" name="tppd" placeholder=" ">
                    <label for="tppd">TPPD</label>
                </div>

                <div class="floating-label">
                    <input type="number" step="0.01" class="form-control" id="documentary_stamps" name="documentary_stamps" placeholder=" ">
                    <label for="documentary_stamps">Documentary Stamps</label>
                </div>

                <div class="floating-label">
                    <input type="number" step="0.01" class="form-control" id="value_added_tax" name="value_added_tax" placeholder=" ">
                    <label for="value_added_tax">Value Added Tax</label>
                </div>

                <div class="floating-label">
                    <input type="number" step="0.01" class="form-control" id="local_gov_tax" name="local_gov_tax" placeholder=" ">
                    <label for="local_gov_tax">Local Gov Tax</label>
                </div>

                <div class="floating-label">
                    <input type="number" step="0.01" class="form-control" id="cost" name="cost" placeholder=" " required>
                    <label for="cost">Total Cost <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="cost-error"></span>
                </div>

                <div class="floating-label">
                    <input type="text" class="form-control" id="doc_path" name="doc_path" placeholder=" ">
                    <label for="doc_path">Document Path</label>
                </div>

                <div class="floating-label">
                    <select class="form-control" id="status" name="status" placeholder=" " required>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                    <label for="status">Status <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="status-error"></span>
                </div>

                @if($isSuperAdmin)
                <div class="floating-label" id="officeSelectGroup">
                    <select class="form-control" id="office_id" name="office_id" placeholder=" ">
                        <option value="">Select Office (Optional - defaults to your office)</option>
                        @foreach($offices as $office)
                            <option value="{{ $office->id }}">{{ $office->office_name }}</option>
                        @endforeach
                    </select>
                    <label for="office_id">Assign to Office</label>
                    <span class="error-message" id="office_id-error"></span>
                </div>
                @endif

                <div class="form-group" id="viewOnlyGroup" style="display: none;">
                    <label class="form-label">Created Date</label>
                    <div class="form-control" style="background: #f8f9fa; border: 1px solid var(--border);" id="createdDateDisplay"></div>
                </div>


        </div>
        <div class="modal-actions">
                <button type="submit" class="control-btn primary" id="submitBtn">
                    <i class="fas fa-save"></i>
                    Save Policy
                </button>
                <button type="button" class="control-btn secondary" onclick="closePolicyModal()">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
         </div>

         </form>
    </div>
</div>

<!-- Modal Overlay -->
<div id="modalOverlay" class="modal-overlay" style="display: none;" onclick="closePolicyModal()"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    window.policiesRoutes = {
        stats: '{{ route("policies.stats") }}',
        data: '{{ route("policies.data") }}',
        store: '{{ route("policies.store") }}'
    };
    window.userPermissions = {{ auth()->user()->permissions ?? 0 }};
    window.userId = {{ auth()->user()->id ?? 0 }};
    window.userOfficeId = {{ auth()->user()->office_id ?? 0 }};
</script>
<script src="{{ asset('js/policies.blade.js') }}"></script>
@endsection
        </div>
