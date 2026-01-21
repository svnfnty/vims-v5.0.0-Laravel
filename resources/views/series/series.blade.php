@extends('layouts.app')

@section('title', 'Series List')
@section('content')
<div class="container-fluid">
    <div class="card shadow-lg">
        <div class="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
                <i class="fas fa-list-ol mr-2"></i> Policy Series List
            </h5>
            <div class="card-tools">
                <button id="refresh-btn-header" class="btn btn-light btn-sm" title="Refresh Data">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
        </div>
        <div class="card-body">
            <!-- Action Buttons -->
            <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div class="d-flex gap-2">
                    <button id="create_new" class="btn btn-pill btn-primary shadow-sm">
                        <i class="fas fa-cloud-upload-alt mr-2"></i> Upload Series
                    </button>
                    <div class="dropdown">
                        <button class="btn btn-pill btn-outline-primary dropdown-toggle shadow-sm" type="button" id="quickActions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-bolt mr-2"></i> Quick Actions
                        </button>
                        <div class="dropdown-menu" aria-labelledby="quickActions">
                            <a class="dropdown-item" href="#" onclick="showAllSeries()"><i class="fas fa-list mr-2"></i> View All Series</a>
                            <a class="dropdown-item" href="#" onclick="showAvailableSeries()"><i class="fas fa-check-circle mr-2"></i> Available Only</a>
                            <a class="dropdown-item" href="#" onclick="showIssuedSeries()"><i class="fas fa-file-invoice mr-2"></i> Issued Only</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#" onclick="exportToExcel()"><i class="fas fa-file-excel mr-2"></i> Export to Excel</a>
                        </div>
                    </div>
                </div>
                <div>
                    <button onclick="printTable()" class="btn btn-pill btn-secondary shadow-sm">
                        <i class="fas fa-print mr-2"></i> Print Report
                    </button>
                </div> 
            </div>
            <!-- Series Selection -->
            <div class="form-group">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <label for="select-se" class="font-weight-bold mb-0">
                        <i class="fas fa-filter mr-2"></i>Filter Policy Series
                    </label>
                    <small class="text-muted" id="last-updated"></small>
                </div>
                <select onchange="showSeries(this.value)" id="select-se" class="form-control select2 shadow-sm">
                    <option value="">Select a policy series...</option>
                    <?php
                    $seriesList = \App\Models\Series::where('status', 1)->get();
                    foreach ($seriesList as $series) {
                        echo '<option value="' . $series->id . '">' . htmlspecialchars($series->name) . '</option>';
                    }
                    ?>
                </select>
            </div>
            <!-- Statistics Dashboard -->
            <div class="row mt-3" id="series-stats" style="display: none;">
                <!-- ...existing statistics cards... -->
            </div>
            <!-- Series Table -->
            <div class="mt-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0"><i class="fas fa-table mr-2"></i>Series Details</h5>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-secondary shadow-sm" onclick="copyAllAvailable()">
                            <i class="fas fa-copy mr-1"></i> Copy Available
                        </button>
                        <button type="button" class="btn btn-outline-secondary shadow-sm" onclick="downloadSeriesList()">
                            <i class="fas fa-download mr-1"></i> Download List
                        </button>
                    </div>
                </div>
                <div id="series-table" class="table-responsive border rounded shadow-sm p-3">
                    <div class="text-center py-5 text-muted">
                        <i class="fas fa-database fa-3x mb-3"></i>
                        <p>Select a policy series to view details</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer text-muted small">
            <div class="d-flex justify-content-between align-items-center">
                <span>System Version: 3.0.0</span>
                <span id="data-status">Last refreshed: Never</span>
            </div>
        </div>
    </div>
</div>

<script>
function showSeries(seriesId) {
    if (!seriesId) return;

    fetch(`/series/api/getseries?id=${seriesId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const table = document.getElementById('series-table');
            let html = `
                <table class="table table-bordered">
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
            `;
            data.forEach(row => {
                html += `
                    <tr>
                        <td>${row.coc_no}</td>
                        <td>${row.name}</td>
                        <td>${row.plate_no}</td>
                        <td>${row.cost}</td>
                        <td>${row.policy_status}</td>
                        <td>${row.date}</td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
            table.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching series data:', error);
            const table = document.getElementById('series-table');
            table.innerHTML = `<div class="alert alert-danger">Failed to fetch series data. Please try again later.</div>`;
        });
}
</script>
@endsection