@extends('layouts.app')

@section('content')
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Define Laravel routes and variables for JavaScript BEFORE loading Vite assets -->
<script>
    window.seriesRoutes = {
        stats: '{{ route("series.stats") }}',
        data: '{{ route("series.data") }}',
        store: '{{ route("series.store") }}'
    };
    window.userPermissions = {{ auth()->user()->permissions ?? 0 }};
    window.userId = {{ auth()->user()->id ?? 0 }};
    window.userOfficeId = {{ auth()->user()->office_id ?? 0 }};
    window.currentUserSubscription = {
        subscription_type: '{{ auth()->user()->subscription_type }}',
        subscription_start_date: '{{ auth()->user()->subscription_start_date }}',
        subscription_end_date: '{{ auth()->user()->subscription_end_date }}',
        last_payment_date: '{{ auth()->user()->last_payment_date }}',
        subscription_amount: '{{ auth()->user()->subscription_amount }}'
    };
</script>

@vite(['resources/css/series.css', 'resources/css/select2search.css', 'resources/js/series.js', 'resources/css/tutorial.css', 'resources/js/tutorial.js'])

<div class="series-dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
        <div class="header-content">
            <div class="logo-section">
                <div class="logo-icon">
                    <i class="fas fa-list-ol"></i>
                </div>
                <div class="system-info">
                    <h1 class="system-title">Policy Series Management</h1>
                    <p class="system-subtitle">Manage your policy series efficiently</p>
                </div>
            </div>
            <div class="user-controls">
                <div class="batch-controls">
                    <button class="control-btn primary" id="create_new" data-tutorial-target="series-create">
                        <i class="fas fa-plus-circle"></i>
                        New Series
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
                <i class="fas fa-list-ol"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="totalSeries">0</span>
                <span class="stat-label">Total Series</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon active">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="activeSeries">0</span>
                <span class="stat-label">Active Series</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon inactive">
                <i class="fas fa-times-circle"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="inactiveSeries">0</span>
                <span class="stat-label">Inactive</span>
            </div>
        </div>
    </div>

    <!-- Series Section -->
    <div class="series-section">
        <div class="section-header">
            <h2 class="section-title">Series List</h2>
            <div class="view-controls">
                <div class="view-toggle">
                    <button class="toggle-btn" data-view="cards">
                        <i class="fas fa-th-large"></i>
                        Cards
                    </button>
                    <button class="toggle-btn" data-view="grid">
                        <i class="fas fa-th"></i>
                        Grid
                    </button>
                    
                    <button class="toggle-btn active" data-view="table">
                        <i class="fas fa-table"></i>
                        Table
                    </button>
                </div>
                <div class="filter-controls">
                    <select class="filter-select" id="statusFilter">
                       <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Series Selection for COC Details -->
        <div class="series-selection-section" style="margin-bottom: 24px;">
            <div class="card" style="border: 1px solid var(--series-border); border-radius: 12px; box-shadow: var(--series-shadow);">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="mb-0"><i class="fas fa-filter mr-2"></i>View Series Details</h5>
                        <small class="text-muted" id="last-updated"></small>
                    </div>
                    <div class="form-group">
                        <select onchange="showSeries(this.value)" id="select-se" class="js-example-basic-single" style="border-radius: 8px; padding: 0.5rem;">
                            <option value="">Select a policy series to view details...</option>
                            <?php
                            $isSuperAdmin = (auth()->user()->id == 1 && auth()->user()->office_id == 0);
                            $seriesQuery = \App\Models\Series::where('status', 1);
                            if (!$isSuperAdmin) {
                                $seriesQuery->where('office_id', auth()->user()->office_id ?? null);
                            }
                            $seriesList = $seriesQuery->get();
                            foreach ($seriesList as $series) {
                                echo '<option value="' . $series->id . '">' . htmlspecialchars($series->name) . ' (Range: ' . $series->range_start . ' - ' . $series->range_stop . ')</option>';
                            }
                            ?>
                        </select>
                    </div>
                </div>
            </div>
        </div>

      
        <!-- Card/Grid/List Views -->
        <div class="series-grid cards-view" id="cardView" style="display: none;">
            <!-- Series will be loaded here dynamically -->
        </div>

        <!-- Table View -->
        <div class="modern-table-container" id="tableView">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Range Start</th>
                        <th>Range Stop</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Created At</th>
                    @if(auth()->user()->id == 1 && auth()->user()->office_id == 0)
                        <th>Office</th>
                    @endif
                    <th>Action</th>

                    </tr>
                </thead>
                <tbody id="tableBody">
                    <!-- Table rows will be loaded here dynamically -->
                </tbody>
            </table>
        </div>

        <!-- Series Details Table Container -->
        <div id="series-table-placeholder" style="display: none; text-align: center; padding: 40px;">
            <div class="empty-icon">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <h3>Loading Series Details...</h3>
            <p>Please wait while we fetch the series information.</p>
        </div>
        <div id="series-table-container" style="display: none;">
            <div id="series-table-content"></div>
        </div>

        <!-- Empty State for Filtered Results -->
        <div class="empty-state hidden" id="filteredEmptyState">
            <div class="empty-icon">
                <i class="fas fa-search"></i>
            </div>
            <h3>No Matching Series Found</h3>
            <p>No series match your current filter criteria. Try adjusting your filters.</p>
            <button class="control-btn secondary" id="resetFilters">
                <i class="fas fa-refresh"></i>
                Reset Filters
            </button>
        </div>
    </div>
</div>

<!-- Modal for Create/Edit/View -->
<div id="seriesModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modalTitle">Series Form</h2>
            <button type="button" class="modal-close" onclick="closeSeriesModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="seriesForm" method="POST">
                @csrf
                <input type="hidden" id="formMethod" name="_method" value="POST">

                <div class="floating-label">
                    <input type="text" class="form-control" id="name" name="name" placeholder=" " required>
                    <label for="name">Series Name <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="name-error"></span>
                </div>

                <div class="floating-label">
                    <input type="number" class="form-control" id="range_start" name="range_start" placeholder=" " required min="1">
                    <label for="range_start">Range Start <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="range_start-error"></span>
                </div>

                <div class="floating-label">
                    <input type="number" class="form-control" id="range_stop" name="range_stop" placeholder=" " required min="1">
                    <label for="range_stop">Range Stop <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="range_stop-error"></span>
                </div>

                <div class="floating-label">
                    <select class="form-control" id="type" name="type" placeholder=" " required>
                        <option value="">Select Type</option>
                        <option value="0">Pacific</option>
                        <option value="1">Liberty</option>
                        <option value="3">Stronghold</option>
                    </select>
                    <label for="type">Type <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="type-error"></span>
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
                    Save Series
                </button>
                <button type="button" class="control-btn secondary" onclick="closeSeriesModal()">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
         </div>

         </form>
    </div>
</div>

<!-- Modal Overlay -->
<div id="modalOverlay" class="modal-overlay" style="display: none;" onclick="closeSeriesModal()"></div>

<!-- Tutorial Step Completion Handler -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Listen for series form submission to trigger tutorial next step
        const seriesForm = document.getElementById('seriesForm');
        if (seriesForm) {
            seriesForm.addEventListener('submit', function() {
                // Dispatch event to notify tutorial system
                window.dispatchEvent(new CustomEvent('tutorial:actionCompleted', {
                    detail: { step: 4, action: 'series_created' }
                }));
            });
        }
    });
</script>

@endsection
