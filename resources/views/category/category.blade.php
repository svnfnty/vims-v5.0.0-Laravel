@extends('layouts.app')

@section('content')
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
@vite(['resources/css/category.css', 'resources/js/category.js'])

<div class="categories-dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
        <div class="header-content">
            <div class="logo-section">
                <div class="logo-icon">
                    <i class="fas fa-tags"></i>
                </div>
                <div class="system-info">
                    <h1 class="system-title">List of Categories</h1>
                    <p class="system-subtitle">Manage your category database efficiently</p>
                </div>
            </div>
            <div class="user-controls">
                <div class="batch-controls">
                    <button class="control-btn primary" id="create_new" data-tutorial-target="category-create">
                        <i class="fas fa-plus-circle"></i>
                        New Category
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
                <i class="fas fa-tags"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="totalCategories">0</span>
                <span class="stat-label">Total Categories</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon active">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="activeCategories">0</span>
                <span class="stat-label">Active Categories</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon inactive">
                <i class="fas fa-tag"></i>
            </div>
            <div class="stat-info">
                <span class="stat-value" id="inactiveCategories">0</span>
                <span class="stat-label">Inactive</span>
            </div>
        </div>
    </div>

    <!-- Categories Section -->
    <div class="categories-section">
        <div class="section-header">
            <h2 class="section-title">Category List</h2>
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
                       <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Card/Grid/List Views -->
        <div class="categories-grid cards-view active" id="cardView">
            <!-- Categories will be loaded here dynamically -->
        </div>

        <!-- Table View -->
        <div class="modern-table-container" id="tableView">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date Created</th>
                        <th>Name</th>
                        <th>Description</th>
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
            <h3>No Matching Categories Found</h3>
            <p>No categories match your current filter criteria. Try adjusting your filters.</p>
            <button class="control-btn secondary" id="resetFilters">
                <i class="fas fa-refresh"></i>
                Reset Filters
            </button>
        </div>
    </div>
</div>

<!-- Modal for Create/Edit/View -->
<div id="categoryModal" class="modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modalTitle">Category Form</h2>
            <button type="button" class="modal-close" onclick="closeCategoryModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="categoryForm" method="POST">
                @csrf
                <input type="hidden" id="formMethod" name="_method" value="POST">

                <div class="floating-label">
                    <input type="text" class="form-control" id="name" name="name" placeholder=" " required>
                    <label for="name">Name <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="name-error"></span>
                </div>

                <div class="floating-label">
                    <textarea class="form-control" id="description" name="description" rows="3" placeholder=" "></textarea>
                    <label for="description">Description</label>
                    <span class="error-message" id="description-error"></span>
                </div>

                <div class="floating-label">
                    <select class="form-control" id="status" name="status" placeholder=" " required>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                    <label for="status">Status <span style="color: var(--danger);">*</span></label>
                    <span class="error-message" id="status-error"></span>
                </div>

                <div class="form-group" id="viewOnlyGroup" style="display: none;">
                    <label class="form-label">Created Date</label>
                    <div class="form-control" style="background: #f8f9fa; border: 1px solid var(--border);" id="createdDateDisplay"></div>
                </div>


        </div>
        <div class="modal-actions">
                <button type="submit" class="control-btn primary" id="submitBtn">
                    <i class="fas fa-save"></i>
                    Save Category
                </button>
                <button type="button" class="control-btn secondary" onclick="closeCategoryModal()">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
         </div>

         </form>
    </div>
</div>

<!-- Modal Overlay -->
<div id="modalOverlay" class="modal-overlay" style="display: none;" onclick="closeCategoryModal()"></div>

<script>
    window.categoryRoutes = {
        stats: '{{ route("category.stats") }}',
        data: '{{ route("category.data") }}',
        store: '{{ route("category.store") }}'
    };
    window.userPermissions = {{ auth()->user()->permissions ?? 0 }};
</script>

<!-- Tutorial Step Completion Handler -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Listen for category form submission to trigger tutorial next step
        const categoryForm = document.getElementById('categoryForm');
        if (categoryForm) {
            categoryForm.addEventListener('submit', function() {
                // Dispatch event to notify tutorial system
                window.dispatchEvent(new CustomEvent('tutorial:actionCompleted', {
                    detail: { step: 2, action: 'category_created' }
                }));
            });
        }
    });
</script>
@endsection
