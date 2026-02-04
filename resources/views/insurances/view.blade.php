{{-- filepath: c:\xampp\htdocs\vims-v5.0.0\resources\views\insurances\view.blade.php --}}
@extends('layouts.app')

@yield('title', '{{ $systemName }}')

@section('content')
<link rel="stylesheet" href="{{ asset('css/view.blade.css') }}">

<div class="content py-3">

    <div class="card card-outline card-primary rounded-0 shadow">
        <div class="card-header">
            <h5 class="card-title">
            </h5>
            <div class="card-tools">
                <button class="btn btn-outline-success btn-sm shadow rounded-pill px-3"
                    type="button"
                    id="check"
                    onclick="checkPolicyStatus('{{ $insurance->status }}', '{{ $insurance->policy_status }}', '{{ $insurance->policy_daterelease }}', '{{ $insurance->coc_no }}', this);">
                    <i class="fa fa-circle me-1 text-success"></i> Check Status
                </button>

                <button class="btn btn-outline-primary btn-sm shadow rounded-pill px-3"
                    type="button"
                    onclick="verifyDataAndOpenWindow();"
                    id="authenticateButton">
                    <i class="fa fa-list me-1"></i> AUTHENTICATE
                </button>

                <button class="btn btn-outline-primary btn-sm shadow rounded-pill px-3"
                    type="button"
                    onclick="selectReceipt()"
                    id="goor">
                    <i class="fa fa-print me-1"></i> GO OR
                </button>

                <button class="btn btn-outline-primary btn-sm shadow rounded-pill px-3"
                    type="button"
                    onclick="selectCertificateOfCoverage()"
                    id="gococ">
                    <i class="fa fa-print me-1"></i> GO COC
                </button>

                <button class="btn btn-outline-primary btn-sm shadow rounded-pill px-3"
                    type="button"
                    onclick="selectPolicyofCover()"
                    id="gopol">
                    <i class="fa fa-print me-1"></i> GO POLICY
                </button>

                <button class="btn btn-outline-dark btn-sm shadow rounded-pill px-3" type="button" id="edit_data">
                    <i class="fa fa-edit"></i> Edit
                </button>

                @if(Auth::user()->type == 1)
                    <button class="btn btn-outline-danger btn-sm shadow rounded-pill px-3" type="button" id="delete_data">
                        <i class="fa fa-trash"></i> Delete
                    </button>
                @endif
            </div>
        </div>

        <div class="card-body">
            <div class="container-fluid">
                @if($insurance->policy_status == 1)
                    <fieldset class="custom-fieldset">
                        <legend class="custom-legend" @if(isset($legendColor)) style="background: {{ $legendColor }} !important;" @endif>Policy Remarks</legend>
                        @if(!empty($insurance->remarks))
                            {!! $insurance->remarks !!}
                        @else
                            Policy Released
                        @endif
                    </fieldset>
                @endif

                <br>
                <fieldset class="custom-fieldset">
                    <legend class="custom-legend" @if(isset($legendColor)) style="background: {{ $legendColor }} !important;" @endif>Owner Information</legend>
                    @php
                        $defaultImage = "https://cdn-icons-png.flaticon.com/512/7829/7829029.png";
                        $imageSrc = isset($insurance->image) && !empty($insurance->image) ? asset('storage/' . $insurance->image) : $defaultImage;
                    @endphp
                    <div class="row align-items-center">
                        <div class="col-lg-4 col-md-4 col-sm-12 text-center">
                            <div class="image-container">
                                <img src="{{ $imageSrc }}" alt="Client Image" id="img-thumb-path" class="img-fluid rounded-circle border bg-light shadow-sm p-2" style="max-width: 200px; height: 200px;">
                                <div class="overlay-text" id="view-profile-text">
                                    <p>View Profile</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-8 col-md-12 col-sm-12">
                            @php
                                $coc_no = $insurance->coc_no ?? "";
                                $isValidCoc = $coc_no >= 0 && $coc_no <= 1000;
                            @endphp

                            @if($isValidCoc)
                                <div class="info-container">
                                    <div class="info-column">
                                        <div class="info-row">
                                            <div class="info-label">NO ISSUANCE COC No.</div>
                                            <div class="info-value" style="min-width: 400px; color:red;">
                                                <b>{{ $coc_no }}</b>
                                            </div>
                                        </div>
                            @else
                                <div class="info-container">
                                    <div class="info-column">
                                        <div class="info-row">
                                            <div class="info-label">COC No.</div>
                                            <div class="info-value" style="min-width: 400px; color:red;">
                                                <b style="font-size: 17px;">{{ $coc_no }}</b>
                                            </div>
                                        </div>
                            @endif

                            <div class="info-row">
                                <div class="info-label">Document ID</div>
                                <div class="info-value" style="min-width: 100px;">
                                    <b>{{ $insurance->code }}</b>
                                </div>
                            </div>

                            <div class="info-row">
                                <div class="info-label"><b>Name</b></div>
                                <div class="info-value" style="min-width: 400px;">
                                    <b>{{ $insurance->client->firstname ?? '' }} {{ $insurance->client->middlename ?? '' }} {{ $insurance->client->lastname ?? '' }}</b>
                                </div>
                            </div>

                            <div class="info-row">
                                <div class="info-label"><b>Address</b></div>
                                <div class="info-value" style="min-width: 400px;">
                                    <b>{{ $insurance->client->address ?? '' }}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <br>

                <fieldset class="custom-fieldset">
                    <legend class="custom-legend" @if(isset($legendColor)) style="background: {{ $legendColor }} !important;" @endif>Vehicle's Information</legend>
                    <div class="info-container">
                        <div class="info-column">
                            <div class="info-row">
                                <div class="info-label">Plate No.</div>
                                <div class="info-value">
                                    {{ $insurance->registration_no }}
                                    @if(isset($insurance->registration_no) && !in_array(substr($insurance->registration_no, 0, 4), ['1001', '1016', '1201']))
                                        <img src="https://cdn-icons-png.flaticon.com/512/5253/5253963.png" alt="Verified"
                                            style="width: 20px; height: 20px; vertical-align: right; margin-left: 5px;"
                                            title="Plate Verified">
                                    @endif
                                </div>
                            </div>

                            <div class="info-row">
                                <div class="info-label">MV File No.</div>
                                <div class="info-value">{{ $insurance->mvfile_no }}</div>
                            </div>

                            <div class="info-row">
                                <div class="info-label">Make</div>
                                <div class="info-value">{{ $insurance->make }} / {{ $insurance->series }} /</div>
                            </div>

                            <div class="info-row">
                                <div class="info-label">Body Type</div>
                                <div class="info-value">
                                    @if($insurance->auth_no)
                                        {{ $insurance->category->name ?? 'N/A' }}
                                    @else
                                        N/A
                                    @endif
                                </div>
                            </div>

                            <div class="info-row">
                                <div class="info-label">Engine No</div>
                                <div class="info-value">{{ $insurance->engine_no }}</div>
                            </div>

                            <div class="info-row">
                                <div class="info-label">Chassis No</div>
                                <div class="info-value">{{ $insurance->chassis_no }}</div>
                            </div>
                        </div>

                        <div class="info-column">
                            <div class="info-row">
                                <div class="info-label">Registration Date</div>
                                <div class="info-value">{{ $insurance->registration_date ? date('M d, Y', strtotime($insurance->registration_date)) : '' }}</div>
                            </div>

                            <div class="info-row">
                                <div class="info-label">Expiration Date</div>
                                <div class="info-value">{{ $insurance->expiration_date ? date('M d, Y', strtotime($insurance->expiration_date)) : '' }}</div>
                            </div>

                            <div class="info-row">
                                <div class="info-label">Vehicle Color</div>
                                <div class="info-value">{{ $insurance->vehicle_color }}</div>
                            </div>

                            <div class="info-row">
                                <div class="info-label">Vehicle Model</div>
                                <div class="info-value">{{ $insurance->vehicle_model }}</div>
                            </div>

                            <div class="info-row">
                                <div class="info-label">Status</div>
                                <div class="info-value">
                                    @if($insurance->expiration_date && strtotime($insurance->expiration_date) < time())
                                        <span class="badge-status status-expired">Expired</span>
                                    @else
                                        @switch($insurance->status)
                                            @case(1)
                                                <span class="badge-status status-active">{{ $insurance->auth_renewal ?? '' }}</span>
                                                @break
                                            @case(0)
                                                <span class="badge-status status-expired">No Detect</span>
                                                @break
                                            @default
                                                <span class="badge-status" style="background: #ccc; color: black;">N/A</span>
                                        @endswitch
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <br>

                <fieldset class='custom-fieldset'>
                    <legend class="custom-legend" @if(isset($legendColor)) style="background: {{ $legendColor }} !important;" @endif>Vehicle's Insurance Information</legend>
                    <div class="row">
                        @if($insurance->policy)
                            <div class="col-md-12">
                                <table class="table table-bordered">
                                    <tr>
                                        <td><b>Third Party Liability</b></td>
                                        <td>{{ $insurance->policy->third_party_liability ?? 'N/A' }}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Personal Accident</b></td>
                                        <td>{{ $insurance->policy->personal_accident ?? 'N/A' }}</td>
                                    </tr>
                                    @if($insurance->policy->tppd && $insurance->policy->tppd != 0)
                                        <tr>
                                            <td><b>Third Party Property Damage</b></td>
                                            <td>{{ $insurance->policy->tppd }}</td>
                                        </tr>
                                    @endif
                                    <tr>
                                        <td><b>Documentary Stamp</b></td>
                                        <td>{{ $insurance->policy->documentary_stamps ?? 'N/A' }}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Value Added Tax</b></td>
                                        <td>{{ $insurance->policy->value_added_tax ?? 'N/A' }}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Local Government Tax</b></td>
                                        <td>{{ $insurance->policy->local_gov_tax ?? 'N/A' }}</td>
                                    </tr>
                                    <tr class="table-success">
                                        <td><b>Total</b></td>
                                        <td><b>{{ number_format($insurance->policy->cost ?? 0, 2) }}</b></td>
                                    </tr>
                                </table>
                            </div>
                        @endif
                    </div>
                </fieldset>
                <br>
            </div>
        </div>
    </div>
</div>

<script src="{{ asset('js/view.blade.js') }}"></script>

<!-- Manage Insurance Modal (for edit) -->
<div id="manageInsuranceModal" class="modal insurance-form-modal" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="manageInsuranceModalTitle">Edit Insurance</h2>
            <button type="button" class="modal-close" onclick="closeInsuranceModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="insuranceForm" method="POST" action="/insurances/{{ $insurance->id }}">
                @csrf
                <input type="hidden" id="insurance_form_method" name="_method" value="PUT">
                <input type="hidden" id="insurance_id" name="insurance_id" value="{{ $insurance->id }}">

                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-mvfile_no" name="mvfile_no" placeholder=" " value="{{ $insurance->mvfile_no }}">
                    <label for="modal-mvfile_no">MV File No</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-coc_no" name="coc_no" placeholder=" " value="{{ $insurance->coc_no }}">
                    <label for="modal-coc_no">COC No</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-or_no" name="or_no" placeholder=" " value="{{ $insurance->or_no }}">
                    <label for="modal-or_no">OR No</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-policy_no" name="policy_no" placeholder=" " value="{{ $insurance->policy_no }}">
                    <label for="modal-policy_no">Policy No</label>
                </div>
                <div class="floating-label">
                    <select class="js-example-basic-single" id="modal-client_id" name="client_id" placeholder=" " required>
                        <option value="">Select Client</option>
                        @foreach(\App\Models\Client::select('id', 'lastname', 'firstname', 'middlename')->get() as $client)
                            <option value="{{ $client->id }}" {{ $insurance->client_id == $client->id ? 'selected' : '' }}>{{ $client->lastname }}, {{ $client->firstname }}{{ $client->middlename ? ' ' . $client->middlename : '' }}</option>
                        @endforeach
                    </select>
                    <label for="modal-client_id">Client <span style="color: var(--danger);">*</span></label>
                </div>
                <div class="floating-label">
                    <select class="js-example-basic-single" id="modal-policy_id" name="policy_id" placeholder=" " required>
                        <option value="">Select Policy</option>
                        @foreach(\App\Models\Policy::select('id', 'name', 'code')->get() as $policy)
                            <option value="{{ $policy->id }}" {{ $insurance->policy_id == $policy->id ? 'selected' : '' }}>{{ $policy->name }} ({{ $policy->code }})</option>
                        @endforeach
                    </select>
                    <label for="modal-policy_id">Policy <span style="color: var(--danger);">*</span></label>
                </div>
                <div class="floating-label">
                    <select class="js-example-basic-single" id="modal-category_id" name="category_id" placeholder=" " required>
                        <option value="">Select Category</option>
                        @foreach(\App\Models\Category::select('id', 'name', 'code')->get() as $category)
                            <option value="{{ $category->id }}" {{ $insurance->auth_no == $category->id ? 'selected' : '' }}>{{ $category->name }} ({{ $category->code }})</option>
                        @endforeach
                    </select>
                    <label for="modal-category_id">Category <span style="color: var(--danger);">*</span></label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-registration_no" name="registration_no" placeholder=" " value="{{ $insurance->registration_no }}">
                    <label for="modal-registration_no">Registration No</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-chassis_no" name="chassis_no" placeholder=" " value="{{ $insurance->chassis_no }}">
                    <label for="modal-chassis_no">Chassis No</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-engine_no" name="engine_no" placeholder=" " value="{{ $insurance->engine_no }}">
                    <label for="modal-engine_no">Engine No</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-vehicle_model" name="vehicle_model" placeholder=" " value="{{ $insurance->vehicle_model }}">
                    <label for="modal-vehicle_model">Vehicle Model</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-vehicle_color" name="vehicle_color" placeholder=" " value="{{ $insurance->vehicle_color }}">
                    <label for="modal-vehicle_color">Vehicle Color</label>
                </div>
                <div class="floating-label">
                    <input type="text" class="form-control" id="modal-make" name="make" placeholder=" " value="{{ $insurance->make }}">
                    <label for="modal-make">Make</label>
                </div>
                <div class="floating-label">
                    <input type="date" class="form-control" id="modal-registration_date" name="registration_date" placeholder=" " value="{{ $insurance->registration_date }}">
                    <label for="modal-registration_date">Registration Date</label>
                </div>
                <div class="floating-label">
                    <input type="date" class="form-control" id="modal-expiration_date" name="expiration_date" placeholder=" " value="{{ $insurance->expiration_date }}">
                    <label for="modal-expiration_date">Expiration Date</label>
                </div>
                <div class="floating-label">
                    <select class="form-control" id="modal-status" name="status" placeholder=" ">
                        <option value="0" {{ $insurance->status == 0 ? 'selected' : '' }}>Pending</option>
                        <option value="1" {{ $insurance->status == 1 ? 'selected' : '' }}>Active</option>
                    </select>
                    <label for="modal-status">Status</label>
                </div>
                <div class="floating-label">
                    <textarea class="form-control" id="modal-remarks" name="remarks" rows="2" placeholder=" ">{{ $insurance->remarks }}</textarea>
                    <label for="modal-remarks">Remarks</label>
                </div>
            </form>
        </div>
        <div class="modal-actions">
            <button type="submit" form="insuranceForm" class="control-btn primary" id="insuranceSubmitBtn">
                <i class="fas fa-check-circle"></i> Update Record
            </button>
            <button type="button" class="control-btn secondary" onclick="closeInsuranceModal()">
                <i class="fas fa-times-circle"></i> Cancel
            </button>
        </div>
    </div>
</div>

<!-- Modal Overlay -->
<div id="insuranceModalOverlay" class="modal-overlay" style="display: none;" onclick="closeInsuranceModal()"></div>

<meta name="csrf-token" content="{{ csrf_token() }}">

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

<script>
    const insuranceUpdateUrl = "/insurances/{{ $insurance->id }}";
    const insuranceDestroyUrl = "/insurances/{{ $insurance->id }}";
    const insurancesIndexUrl = "{{ route('insurances.index') }}";
</script>

<style>
/* Reset all default Select2 styles to match regular input */
.select2-container .select2-selection--single {
    height: 45px !important;
    border: 1px solid #ced4da !important;
    border-radius: 4px !important;
    background-color: #fff !important;
    font-family: inherit !important;
    font-size: 16px !important;
    color: #212529 !important;
}

.select2-container .select2-selection--single .select2-selection__rendered {
    line-height: 45px !important;
    padding-left: 12px !important;
    padding-right: 30px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
}

.select2-container .select2-selection--single .select2-selection__arrow {
    height: 36px !important;
    width: 24px !important;
    right: 1px !important;
}

.select2-container .select2-selection--single .select2-selection__arrow b {
    border-color: #6c757d transparent transparent transparent !important;
    border-width: 5px 4px 0 4px !important;
    margin-left: -4px !important;
    margin-top: -2px !important;
}

.select2-container.select2-container--focus .select2-selection--single {
    border-color: #86b7fe !important;
    outline: 0 !important;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
}

.select2-container.select2-container--open .select2-selection--single .select2-selection__arrow b {
    border-color: transparent transparent #6c757d transparent !important;
    border-width: 0 4px 5px 4px !important;
    margin-top: -3px !important;
}

.floating-label {
    position: relative;
}

.floating-label label {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: #6c757d;
    font-size: 14px;
    transition: all 0.15s ease-in-out;
    pointer-events: none;
    background: transparent;
    padding: 0 4px;
    z-index: 1;
}

.select2-container--open ~ label,
.select2-container--focus ~ label,
.select2-container--filled ~ label,
.floating-label select:focus ~ label,
.floating-label select:not(:placeholder-shown) ~ label {
    top: 0;
    transform: translateY(-50%);
    font-size: 12px;
    color: #0d6efd;
    background: white;
    z-index: 5;
}

.floating-label label span {
    color: #dc3545;
}

.select2-dropdown {
    border: 1px solid #ced4da !important;
    border-radius: 4px !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    margin-top: 4px !important;
}

.select2-results__option {
    padding: 8px 12px !important;
    font-size: 14px !important;
}

.select2-results__option--highlighted {
    background-color: #0d6efd !important;
    color: white !important;
}

.select2-container--open .select2-dropdown {
    z-index: 2001 !important;
}

.select2-container {
    padding: 0 !important;
}

.form-control.select2-container {
    display: block;
    width: 100%;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    background-clip: padding-box;
}
</style>

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
