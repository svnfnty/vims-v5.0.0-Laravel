@extends('layouts.app')

@section('content')

<!-- Define window variables BEFORE loading account.js -->
<script>
    window.successMessage = @json(session('success'));
    window.errorMessages = @json($errors->all());
</script>

@vite(['resources/css/account.css', 'resources/js/account.js'])

<div class="max-w-10xl mx-auto py-6 px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Account Settings</h1>

        <!-- Session messages will be handled by SweetAlert2 dialogs -->

        <form action="{{ route('account.update') }}" method="POST" class="space-y-6">
            @csrf
            @method('PUT')

            <!-- Personal Information -->
            <div class="bg-gray-50 p-4 rounded-lg">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="firstname" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input type="text" id="firstname" name="firstname" value="{{ old('firstname', $user->firstname) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div>
                        <label for="lastname" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input type="text" id="lastname" name="lastname" value="{{ old('lastname', $user->lastname) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                </div>
                <div class="mt-4">
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" id="email" name="email" value="{{ old('email', $user->email) }}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
            </div>

            <!-- Change Password -->
            <div class="bg-gray-50 p-4 rounded-lg">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
                <div class="space-y-4">
                    <div>
                        <label for="current_password" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <div class="flex border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                            <input type="password" id="current_password" name="current_password" class="flex-1 px-3 py-2 border-0 rounded-l-md focus:outline-none focus:ring-0" required>
                            <button type="button" onclick="togglePassword('current_password', 'eye-current')" class="px-3 py-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700">
                                <i id="eye-current" class="bi bi-eye text-lg"></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div class="flex border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                            <input type="password" id="password" name="password" class="flex-1 px-3 py-2 border-0 rounded-l-md focus:outline-none focus:ring-0" required>
                            <button type="button" onclick="togglePassword('password', 'eye-new')" class="px-3 py-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700">
                                <i id="eye-new" class="bi bi-eye text-lg"></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div class="flex border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                            <input type="password" id="password_confirmation" name="password_confirmation" class="flex-1 px-3 py-2 border-0 rounded-l-md focus:outline-none focus:ring-0" required>
                            <button type="button" onclick="togglePassword('password_confirmation', 'eye-confirm')" class="px-3 py-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700">
                                <i id="eye-confirm" class="bi bi-eye text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
                <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                    Update Settings
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    function togglePassword(inputId, eyeId) {
        const input = document.getElementById(inputId);
        const eyeIcon = document.getElementById(eyeId);

        if (input.type === 'password') {
            input.type = 'text';
            eyeIcon.classList.remove('bi-eye');
            eyeIcon.classList.add('bi-eye-slash');
        } else {
            input.type = 'password';
            eyeIcon.classList.remove('bi-eye-slash');
            eyeIcon.classList.add('bi-eye');
        }
    }
</script>

@endsection
