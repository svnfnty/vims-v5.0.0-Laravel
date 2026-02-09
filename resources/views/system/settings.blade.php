@extends('layouts.app')

@section('content')

<!-- Define window variables BEFORE loading system.js -->
<script>
    window.successMessage = @json(session('success'));
    window.errorMessages = @json($errors->all());
</script>

@vite(['resources/css/system.css', 'resources/js/system.js'])

<div class="max-w-7xl mx-auto py-6 px-4">
    <div class="system-card">
        <div class="system-card-header">
            <h5><i class="bi bi-gear"></i> System Information</h5>
        </div>
        <div class="system-card-body">
            <form action="{{ route('system.settings.update') }}" method="POST" id="system-frm" enctype="multipart/form-data">
                @csrf
                @method('PUT')
                
                <div id="msg"></div>
                
                <div class="section-title">
                    <i class="bi bi-info-circle"></i>
                    <span>Basic Information</span>
                </div>
                
                <div class="floating-label">
                    <input type="text" name="system_name" id="system_name" value="{{ old('system_name', $systemName) }}" placeholder=" ">
                    <label for="system_name">System Name</label>
                </div>
                
                <div class="floating-label">
                    <input type="text" name="system_shortname" id="system_shortname" value="{{ old('system_shortname', $systemShortName) }}" placeholder=" ">
                    <label for="system_shortname">System Short Name</label>
                </div>
                
                <div class="section-title mt-6">
                    <i class="bi bi-image"></i>
                    <span>Branding</span>
                </div>
                
                <div class="form-group">
                    <label class="form-label"><i class="bi bi-camera mr-2"></i>System Logo</label>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="logo" name="logo" onchange="displayImg(this,$(this))">
                        <label class="custom-file-label" for="logo">Choose logo image</label>
                    </div>
                </div>
                
                <div class="form-group flex justify-center">
                    <img src="{{ $logo ? asset('storage/' . $logo) : asset('logo.png') }}" alt="System Logo" id="cimg" class="img-preview-logo" onerror="this.src='{{ asset('logo.png') }}'">
                </div>

                
                <div class="form-group">
                    <label class="form-label"><i class="bi bi-image mr-2"></i>Cover Image</label>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="cover" name="cover" onchange="displayImg2(this,$(this))">
                        <label class="custom-file-label" for="cover">Choose cover image</label>
                    </div>
                </div>
                
                <div class="form-group flex justify-center">
                    <img src="{{ $cover ? asset('storage/' . $cover) : asset('cover.png') }}" alt="Cover Image" id="cimg2" class="img-preview-cover" onerror="this.src='{{ asset('cover.png') }}'">
                </div>

                <!-- System Maintenance Section - Visible to all, but toggle only for admin -->
                <div class="section-title mt-6">
                    <i class="bi bi-tools"></i>
                    <span>System Maintenance</span>
                </div>
                
                <div class="maintenance-mode-section">
                    <div class="maintenance-status">
                        <span class="status-label">Current Status:</span>
                        <span class="status-badge {{ $maintenanceEnabled ? 'status-maintenance' : 'status-operational' }}">
                            <i class="bi {{ $maintenanceEnabled ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill' }}"></i>
                            {{ $maintenanceEnabled ? 'Under Maintenance' : 'Operational' }}
                        </span>
                    </div>
                    
                    @if($isAdmin)
                    <div class="maintenance-toggle mt-4">
                        <button type="button" id="maintenance-toggle-btn" class="btn-toggle {{ $maintenanceEnabled ? 'btn-danger' : 'btn-success' }}" onclick="toggleMaintenanceMode()">
                            <i class="bi {{ $maintenanceEnabled ? 'bi-power' : 'bi-tools' }}"></i>
                            {{ $maintenanceEnabled ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode' }}
                        </button>
                    </div>
                    
                    <div id="maintenance-message" class="maintenance-message mt-3" style="display: none;"></div>
                    
                    <div class="maintenance-info mt-3">
                        <small class="text-muted">
                            <i class="bi bi-info-circle"></i>
                            When maintenance mode is enabled, only admin users can access the system. Regular users will see a maintenance page.
                        </small>
                    </div>
                    @else
                    <div class="maintenance-info mt-3">
                        <small class="text-muted">
                            <i class="bi bi-lock"></i>
                            Only admin users can toggle maintenance mode.
                        </small>
                    </div>
                    @endif
                </div>
                
            </form>
        </div>
        <div class="system-card-footer">
            <button class="btn-update" form="system-frm">
                <i class="bi bi-save"></i> Update System Information
            </button>
        </div>
    </div>
</div>

<script>
    // Display logo preview
    function displayImg(input, _this) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#cimg').attr('src', e.target.result);
                _this.siblings('.custom-file-label').html(input.files[0].name);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    // Display cover preview
    function displayImg2(input, _this) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#cimg2').attr('src', e.target.result);
                _this.siblings('.custom-file-label').html(input.files[0].name);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $(document).ready(function(){
        // Update file label on file selection
        $('.custom-file-input').on('change', function() {
            var fileName = $(this).val().split('\\').pop();
            if (fileName) {
                $(this).siblings('.custom-file-label').html(fileName);
            }
        });
    });
    
    @if($isAdmin)
    // Maintenance Mode Toggle Function
    function toggleMaintenanceMode() {
        const btn = document.getElementById('maintenance-toggle-btn');
        const messageDiv = document.getElementById('maintenance-message');
        
        // Disable button during request
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Processing...';
        
        fetch('{{ route('system.maintenance.toggle') }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update button appearance
                if (data.enabled) {
                    btn.className = 'btn-toggle btn-danger';
                    btn.innerHTML = '<i class="bi bi-power"></i> Disable Maintenance Mode';
                } else {
                    btn.className = 'btn-toggle btn-success';
                    btn.innerHTML = '<i class="bi bi-tools"></i> Enable Maintenance Mode';
                }
                
                // Show success message
                messageDiv.className = 'maintenance-message mt-3 alert alert-success';
                messageDiv.innerHTML = '<i class="bi bi-check-circle"></i> ' + data.message;
                messageDiv.style.display = 'block';
                
                // Reload page after 1.5 seconds to update status badge
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                // Show error message
                messageDiv.className = 'maintenance-message mt-3 alert alert-danger';
                messageDiv.innerHTML = '<i class="bi bi-exclamation-circle"></i> ' + data.message;
                messageDiv.style.display = 'block';
                
                // Reset button
                btn.disabled = false;
                btn.innerHTML = '{{ $maintenanceEnabled ? '<i class="bi bi-power"></i> Disable Maintenance Mode' : '<i class="bi bi-tools"></i> Enable Maintenance Mode' }}';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Show error message
            messageDiv.className = 'maintenance-message mt-3 alert alert-danger';
            messageDiv.innerHTML = '<i class="bi bi-exclamation-circle"></i> An error occurred. Please try again.';
            messageDiv.style.display = 'block';
            
            // Reset button
            btn.disabled = false;
            btn.innerHTML = '{{ $maintenanceEnabled ? '<i class="bi bi-power"></i> Disable Maintenance Mode' : '<i class="bi bi-tools"></i> Enable Maintenance Mode' }}';
        });
    }
    @endif
</script>

<style>
    .maintenance-mode-section {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 20px;
        margin-top: 20px;
    }
    
    .maintenance-status {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
    }
    
    .status-label {
        font-weight: 600;
        color: #495057;
    }
    
    .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 5px;
    }
    
    .status-operational {
        background-color: #d1edff;
        color: #0c5460;
    }
    
    .status-maintenance {
        background-color: #fff3cd;
        color: #856404;
    }
    
    .btn-toggle {
        padding: 8px 15px;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-flex;
        align-items: center;
        gap: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        position: relative;
        overflow: hidden;
    }
    
    .btn-toggle::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
    }
    
    .btn-toggle:hover:not(:disabled)::before {
        left: 100%;
    }
    
    .btn-toggle:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2), 0 6px 10px -5px rgba(0, 0, 0, 0.1);
    }
    
    .btn-toggle:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .btn-toggle:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
    
    .btn-success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: 1px solid #047857;
    }
    
    .btn-success:hover:not(:disabled) {
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        border-color: #065f46;
    }
    
    .btn-danger {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        border: 1px solid #b91c1c;
    }
    
    .btn-danger:hover:not(:disabled) {
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        border-color: #991b1b;
    }
    
    .maintenance-info {
        padding: 10px;
        background: #e9ecef;
        border-radius: 4px;
    }
</style>

@endsection
