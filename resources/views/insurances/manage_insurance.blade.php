<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Insurance Details</title>
    <link rel="stylesheet" href="{{ asset('css/insurance.blade.css') }}">
    <style>
        .form-section {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
            width: 100%;
        }
 
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
            width: 100%;
        }

        .form-group input {
            width: 100%;
        }

        .insurance-container {
            display: flex;
            flex-direction: row;
            gap: 20px;
        }

        .insurance-column {
            flex: 1;
        }

        .form-section .policy-info {
            display: flex;
            flex-direction: row;
            gap: 20px;
            flex-wrap: wrap;
        }

        .form-section .policy-info .form-group {
            flex: 1;
            min-width: 200px;
        }

        .modal-dialog.modal-mid-large {
            max-width: 95%;
            width: 95%;
            margin: 1.75rem auto;
        }

        .modal-content {
            width: 100% !important;
            height: 95vh;
        }

        /* Added media queries for mobile responsiveness */
        @media (max-width: 768px) {
            .insurance-container {
                flex-direction: column;
            }
            .insurance-column {
                width: 100%;
            }
            .form-section {
                padding: 1rem;
            }
            .form-group {
                flex-direction: column;
            }
            .form-group input {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    @if(isset($insurance))
    <div class="insurance-container">
        <div class="insurance-column">
            <form action="" id="insurance-form" class="h-100">
                <div class="form-section">
                    <h4>Insurance Details</h4>
                    <div class="form-group">
                        <label for="mvfile_no">MV File No.</label>
                        <input type="text" name="mvfile_no" id="mvfile_no" value="{{ $insurance->mvfile_no }}" {{ $insurance->mvfile_no ? 'readonly' : '' }}>
                        @if($insurance->mvfile_no)
                        <div class="data-verified">DATA VERIFIED</div>
                        @endif
                    </div>
                    <div class="form-group">
                        <label for="make">Make/Series</label>
                        <input type="text" name="make" id="make" value="{{ $insurance->make }}" {{ $insurance->make ? 'readonly' : '' }}>
                        @if($insurance->make)
                        <div class="data-verified">DATA VERIFIED</div>
                        @endif
                    </div>
                    <div class="form-group">
                        <label for="chassis_no">Vehicle Chassis No</label>
                        <input type="text" name="chassis_no" id="chassis_no" value="{{ $insurance->chassis_no }}" {{ $insurance->chassis_no ? 'readonly' : '' }}>
                        @if($insurance->chassis_no)
                        <div class="data-verified">DATA VERIFIED</div>
                        @endif
                    </div>
                    <div class="form-group">
                        <label for="engine_no">Vehicle Engine No</label>
                        <input type="text" name="engine_no" id="engine_no" value="{{ $insurance->engine_no }}" {{ $insurance->engine_no ? 'readonly' : '' }}>
                        @if($insurance->engine_no)
                        <div class="data-verified">DATA VERIFIED</div>
                        @endif
                    </div>
                </div>
                
                <div class="form-section">
                    <h4>Policy Information</h4>
                    <div class="policy-info">
                        <div class="form-group">
                            <label for="coc_no">Confirmation Of Cover No</label>
                            <input type="text" name="coc_no" id="coc_no" value="{{ $insurance->coc_no }}" {{ $insurance->coc_no ? 'readonly' : '' }}>
                        </div>
                        <div class="form-group">
                            <label for="policy_no">Policy Of Cover No</label>
                            <input type="text" name="policy_no" id="policy_no" value="{{ $insurance->policy_no }}" {{ $insurance->policy_no ? 'readonly' : '' }}>
                        </div>
                        <div class="form-group">
                            <label for="policy_receipt">Policy Official Receipt No</label>
                            <input type="text" name="policy_receipt" id="policy_receipt" value="{{ $insurance->or_no }}" {{ $insurance->or_no ? 'readonly' : '' }}>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        
        <div class="insurance-column">
            <form action="" id="vehicle-form" class="h-100">
                <div class="form-section">
                    <h4>Vehicle Details</h4>
                    <div class="form-group">
                        <label for="vehicle_model">Vehicle Model</label>
                        <input type="text" name="vehicle_model" id="vehicle_model" value="{{ $insurance->vehicle_model }}" {{ $insurance->vehicle_model ? 'readonly' : '' }}>
                        @if($insurance->vehicle_model)
                        <div class="data-verified">DATA VERIFIED</div>
                        @endif
                    </div>
                    <div class="form-group">
                        <label for="vehicle_color">Vehicle Color</label>
                        <input type="text" name="vehicle_color" id="vehicle_color" value="{{ $insurance->vehicle_color }}" {{ $insurance->vehicle_color ? 'readonly' : '' }}>
                    </div>
                    <div class="form-group">
                        <label for="registration_date">Date of Registration</label>
                        <input type="text" name="registration_date" id="registration_date" value="{{ $insurance->registration_date }}" {{ $insurance->registration_date ? 'readonly' : '' }}>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <script>
    window.addEventListener('message', function(event) {
        if (event.data === 'save') {
            // Handle save action
            console.log('Save triggered from parent');
        }
    });
    </script>
    @else
    <div class="alert alert-danger">
        <strong>Error:</strong> Insurance data could not be loaded.
    </div>
    @endif
    <script src="{{ asset('js/insurance.blade.js') }}"></script>
</body>
</html>
