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
                    <img src="{{ $logo ? asset('storage/' . $logo) : asset('logo.png') }}" alt="System Logo" id="cimg" class="img-preview-logo">
                </div>
                
                <div class="form-group">
                    <label class="form-label"><i class="bi bi-image mr-2"></i>Cover Image</label>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="cover" name="cover" onchange="displayImg2(this,$(this))">
                        <label class="custom-file-label" for="cover">Choose cover image</label>
                    </div>
                </div>
                
                <div class="form-group flex justify-center">
                    <img src="{{ $cover ? asset('storage/' . $cover) : asset('cover.png') }}" alt="Cover Image" id="cimg2" class="img-preview-cover">
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
    function displayImg(input, _this) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#cimg').attr('src', e.target.result);
                _this.siblings('.custom-file-label').html(input.files[0].name)
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    function displayImg2(input, _this) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                _this.siblings('.custom-file-label').html(input.files[0].name)
                $('#cimg2').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $(document).ready(function(){
        // Initialize any necessary plugins here
    });
</script>

@endsection
