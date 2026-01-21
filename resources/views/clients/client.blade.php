@extends('layouts.app')

@section('title', 'Client List')

@section('content')
<div class="container">
    <div class="card card-outline card-primary rounded-0 shadow">
        <div class="card-header">
            <h3 class="card-title">List of Clients</h3>
            <div class="card-tools">
                <button type="button" class="btn btn-flat btn-sm btn-primary float-end" id="loadDataBtn" style="display: inline-block; padding: 4px 8px; background-color: transparent; color: #007bff; border: 2px solid #007bff; border-radius: 4px; font-size: 14px; font-weight: bold; text-align: center; transition: background-color 0.3s, color 0.3s, transform 0.3s; cursor: pointer;" onmouseover="this.style.backgroundColor='#007bff'; this.style.color='white'; this.style.transform='scale(1.05)';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#007bff'; this.style.transform='scale(1)';">
                    <span class="fas fa-plus"></span> Load Data
                </button>
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table id="clientTable" class="table table-bordered table-hover table-striped w-100">
                    <thead class="bg-gradient-primary text-light text-center">
                        <tr>
                            <th>#</th>
                            <th>Date Created</th>
                            <th>Registered Name</th>
                            <th>Registered Email</th>
                            <th>Address</th>
                            <th>Status</th>
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
        $('#clientTable').DataTable({
            processing: true,
            serverSide: true,
            scrollX: true,
            ajax: '{{ route("clients.data") }}',
            columns: [
                { data: 'id', name: 'id', defaultContent: 'N/A' },
                { data: 'date_created', name: 'date_created', defaultContent: 'N/A' },
                { data: 'registered_name', name: 'registered_name', defaultContent: 'N/A' },
                { data: 'registered_email', name: 'registered_email', defaultContent: 'N/A' },
                { data: 'address', name: 'address', defaultContent: 'N/A' },
                { data: 'status', name: 'status', render: function(data) {
                    return `<span class="badge ${data === 'Active' ? 'bg-success' : 'bg-danger'}">${data || 'N/A'}</span>`;
                }},
                { data: 'actions', name: 'actions', orderable: false, searchable: false, defaultContent: '<button class="btn btn-primary">Edit</button>' },
            ],
            language: {
                emptyTable: "No data available in table",
                infoFiltered: "(filtered from total entries)"
            }
        });
 
        $('#loadDataBtn').on('click', function() {
            $('#clientTable').DataTable().ajax.reload();
        });
    });
</script>
@endsection