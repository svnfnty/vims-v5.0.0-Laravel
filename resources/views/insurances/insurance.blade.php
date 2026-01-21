@extends('layouts.app')
 
@section('title', 'Insurance List')
 
@section('content')
<div class="container">
    <div class="card card-outline card-primary rounded-0 shadow">
        <div class="card-header">
            <h3 class="card-title">List of Insurances</h3>
            <div class="card-tools">
                <button type="button" class="btn btn-flat btn-sm btn-primary float-end" id="loadInsuranceDataBtn" style="display: inline-block; padding: 4px 8px; background-color: transparent; color: #007bff; border: 2px solid #007bff; border-radius: 4px; font-size: 14px; font-weight: bold; text-align: center; transition: background-color 0.3s, color 0.3s, transform 0.3s; cursor: pointer;" onmouseover="this.style.backgroundColor='#007bff'; this.style.color='white'; this.style.transform='scale(1.05)';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#007bff'; this.style.transform='scale(1)';">
                    <span class="fas fa-plus"></span> Load Data
                </button>
                <button type="button" class="btn btn-flat btn-sm btn-success float-end me-2" id="addInsuranceBtn" style="display: inline-block; padding: 4px 8px; background-color: transparent; color: #28a745; border: 2px solid #28a745; border-radius: 4px; font-size: 14px; font-weight: bold; text-align: center; transition: background-color 0.3s, color 0.3s, transform 0.3s; cursor: pointer;" onmouseover="this.style.backgroundColor='#28a745'; this.style.color='white'; this.style.transform='scale(1.05)';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#28a745'; this.style.transform='scale(1)';">
                    <span class="fas fa-plus"></span> Add New Insurance
                </button>
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table id="insuranceTable" class="table table-bordered table-hover table-striped w-100">
                    <thead class="bg-gradient-primary text-light text-center">
                        <tr>
                            <th>#</th>
                            <th>Client Name</th> <!-- Ensure Client Name remains -->
                            <th>Policy Name</th> <!-- Ensure Policy Name is displayed -->
                            <th>Code</th>
                            <th>Registration No</th>
                            <th>Chassis No</th>
                            <th>Engine No</th>
                            <th>Vehicle Model</th>
                            <th>Vehicle Color</th>
                            <th>Registration Date</th>
                            <th>Expiration Date</th>
                            <th>Cost</th>
                            <th>New</th>
                            <th>Make</th>
                            <th>OR No</th>
                            <th>COC No</th>
                            <th>Policy No</th>
                            <th>MV File No</th>
                            <th>Auth No</th>
                            <th>Auth Renewal</th>
                            <th>Status</th>
                            <th>Remarks</th>
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
<meta name="csrf-token" content="{{ csrf_token() }}">
<script>
    const insuranceDataUrl = "{{ route('insurance.data') }}";
    const insuranceValidateCocUrl = "{{ route('insurance.validateCoc') }}";
    const insuranceValidateMvFileUrl = "{{ route('insurance.validateMvFile') }}";
</script>
<script src="{{ asset('js/insurance.blade.js') }}"></script>
@endsection

