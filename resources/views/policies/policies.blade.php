@extends('layouts.app')

@section('title', 'Policy List')

@section('content')
<div class="container">
    <div class="card card-outline card-primary rounded-0 shadow">
        <div class="card-header">
            <h3 class="card-title">List of Policy</h3>
            <div class="card-tools">
                <button type="button" class="btn btn-flat btn-sm btn-primary float-end" id="loadDataBtn" style="display: inline-block; padding: 4px 8px; background-color: transparent; color: #007bff; border: 2px solid #007bff; border-radius: 4px; font-size: 14px; font-weight: bold; text-align: center; transition: background-color 0.3s, color 0.3s, transform 0.3s; cursor: pointer;" onmouseover="this.style.backgroundColor='#007bff'; this.style.color='white'; this.style.transform='scale(1.05)';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#007bff'; this.style.transform='scale(1)';">
                    <span class="fas fa-plus"></span> Load Data
                </button>
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table id="viewPoliciesTable" class="table table-bordered table-hover table-striped w-100">
                    <thead class="bg-gradient-primary text-light text-center">
                        <tr>
                            <th>#</th>
                            <th>Code</th>
                            <th>Description 1</th>
                            <th>Description 2</th>
                            <th>Duration</th>
                            <th>Third Party Liability</th>
                            <th>Personal Accident</th>
                            <th>TPPD</th>
                            <th>Documentary Stamps</th>
                            <th>Value Added Tax</th>
                            <th>Local Gov Tax</th>
                            <th>Cost</th>
                            <th>Document Path</th>
                            <th>Status</th>
                            <th>Delete Flag</th>
                            <th>Date Created</th>
                            <th>Date Updated</th>
                            <th>Office ID</th>
                            <th>Category</th> <!-- Added Category column -->
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Data will be populated dynamically -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        $('#viewPoliciesTable').DataTable({
            processing: true,
            serverSide: true,
            scrollX: true,
            ajax: '{{ route("policies.data") }}',
            columns: [
                { data: 'id', name: 'id', defaultContent: 'N/A' },
                { data: 'code', name: 'code', defaultContent: 'N/A' },
                { data: 'description1', name: 'description1', defaultContent: 'N/A' },
                { data: 'description2', name: 'description2', defaultContent: 'N/A' },
                { data: 'duration', name: 'duration', defaultContent: 'N/A' },
                { data: 'third_party_liability', name: 'third_party_liability', defaultContent: 'N/A' },
                { data: 'personal_accident', name: 'personal_accident', defaultContent: 'N/A' },
                { data: 'tppd', name: 'tppd', defaultContent: 'N/A' },
                { data: 'documentary_stamps', name: 'documentary_stamps', defaultContent: 'N/A' },
                { data: 'value_added_tax', name: 'value_added_tax', defaultContent: 'N/A' },
                { data: 'local_gov_tax', name: 'local_gov_tax', defaultContent: 'N/A' },
                { data: 'cost', name: 'cost', defaultContent: 'N/A' },
                { data: 'doc_path', name: 'doc_path', defaultContent: 'N/A' },
                { data: 'status_badge', name: 'status_badge', orderable: false, searchable: false, defaultContent: 'N/A' , render: function(data) {
                    return `<span class="badge ${data === 'Active' ? 'bg-danger' : 'bg-success'}">${data || 'N/A'}</span>`;
                }}, 
                { data: 'delete_flag', name: 'delete_flag', defaultContent: 'N/A' },
                { data: 'date_created', name: 'date_created', defaultContent: 'N/A' },
                { data: 'date_updated', name: 'date_updated', defaultContent: 'N/A' },
                { data: 'office_id', name: 'office_id', defaultContent: 'N/A' },
                { data: 'category_name', name: 'category_name', defaultContent: 'N/A' }, // Added category_name column
                { data: 'action', name: 'action', orderable: false, searchable: false, defaultContent: 'N/A' },
            ],
            language: {
                emptyTable: "No data available in table",
                infoFiltered: "(filtered from total entries)"
            }
        });

        $('#loadDataBtn').on('click', function() {
            $('#viewPoliciesTable').DataTable().ajax.reload();
        });
    });
</script>

<style>
/* Added media queries for mobile responsiveness */
@media (max-width: 768px) {
    .card {
        margin-bottom: 1rem;
    }
    .table-responsive {
        overflow-x: auto;
    }
    .btn {
        width: 100%;
        margin-bottom: 0.5rem;
    }
}
</style>
@endsection