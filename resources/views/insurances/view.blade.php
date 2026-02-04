{{-- filepath: c:\xampp\htdocs\vims-v5.0.0\resources\views\insurances\view.blade.php --}}
@extends('layouts.app')

@section('title', 'Insurance Details')

@section('content')
<link rel="stylesheet" href="{{ asset('css/view.blade.css') }}">

<div class="content py-3">
    <div class="card card-outline card-primary rounded-0 shadow">
        <div class="card-header">
            <h5 class="card-title">
                <b>Insurance Details - {{ $insurance->code }}</b>
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

                <div class="row mt-4">
                    <div class="col-md-12">
                        <a href="{{ route('dashboard') }}" class="btn btn-secondary">Back to Dashboard</a>
                        <a href="{{ route('insurances.index') }}" class="btn btn-primary">Back to Insurances</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="{{ asset('js/view.blade.js') }}"></script>

@endsection
