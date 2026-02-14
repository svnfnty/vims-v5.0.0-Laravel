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

        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button onclick="switchTab('profile')" id="tab-profile" class="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center">
                    <i class="bi bi-person mr-2"></i>
                    Profile & Security
                </button>
                <button onclick="switchTab('subscription')" id="tab-subscription" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center">
                    <i class="bi bi-credit-card mr-2"></i>
                    Subscription & Payment
                </button>
            </nav>
        </div>

        <!-- Profile & Security Tab -->
        <div id="content-profile" class="tab-content">
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
                            <div class="relative">
                                <input type="password" id="current_password" name="current_password" class="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                <button type="button" onclick="togglePassword('current_password', 'eye-current')" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                    <i id="eye-current" class="bi bi-eye text-lg"></i>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <div class="relative">
                                <input type="password" id="password" name="password" class="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                <button type="button" onclick="togglePassword('password', 'eye-new')" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                    <i id="eye-new" class="bi bi-eye text-lg"></i>
                                </button>
                            </div>
                            <div id="password-feedback" style="display: none;"></div>
                        </div>
                        <div>
                            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <div class="relative">
                                <input type="password" id="password_confirmation" name="password_confirmation" class="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                <button type="button" onclick="togglePassword('password_confirmation', 'eye-confirm')" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                    <i id="eye-confirm" class="bi bi-eye text-lg"></i>
                                </button>
                            </div>
                            <div id="confirmation-feedback" style="display: none;"></div>
                        </div>
                    </div>
                </div>

                <!-- Submit Button for Account Settings -->
                <div class="flex justify-end">
                    <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                        Update Settings
                    </button>
                </div>
            </form>
        </div>

        <!-- Subscription & Payment Tab -->
        <div id="content-subscription" class="tab-content hidden">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="bi bi-credit-card mr-2 text-blue-600"></i>
                    Subscription & Payment
                </h2>
                
                @if($user->id === 1 && $user->office_id === 0)
                <!-- Admin Panel -->
                <div class="bg-white p-6 rounded-md mb-4 shadow-sm border-l-4 border-blue-500">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="bi bi-shield-check mr-2 text-blue-600"></i>Admin Payment Management
                    </h3>
                    <p class="text-gray-600 mb-4">As an administrator, you can review and manage user payment submissions. Approve payments to activate user subscriptions.</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div class="bg-blue-50 p-4 rounded-lg text-center">
                            <i class="bi bi-clock-history text-3xl text-yellow-600 mb-2"></i>
                            <p class="text-sm text-gray-600">Pending Payments</p>
                            <p class="text-2xl font-bold text-gray-800">
                                {{ \App\Models\Payment::where('status', 'pending')->count() }}
                            </p>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg text-center">
                            <i class="bi bi-check-circle text-3xl text-green-600 mb-2"></i>
                            <p class="text-sm text-gray-600">Approved (30 days)</p>
                            <p class="text-2xl font-bold text-gray-800">
                                {{ \App\Models\Payment::where('status', 'approved')->where('updated_at', '>=', now()->subDays(30))->count() }}
                            </p>
                        </div>
                        <div class="bg-red-50 p-4 rounded-lg text-center">
                            <i class="bi bi-x-circle text-3xl text-red-600 mb-2"></i>
                            <p class="text-sm text-gray-600">Rejected (30 days)</p>
                            <p class="text-2xl font-bold text-gray-800">
                                {{ \App\Models\Payment::where('status', 'rejected')->where('updated_at', '>=', now()->subDays(30))->count() }}
                            </p>
                        </div>
                    </div>
                    
                    <a href="{{ route('admin.payments') }}" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-semibold">
                        <i class="bi bi-arrow-right-circle mr-2"></i>Manage Payments
                    </a>
                </div>
                @else
                <!-- Current Subscription Info -->
                <div class="bg-white p-4 rounded-md mb-4 shadow-sm">
                    <h3 class="text-md font-medium text-gray-700 mb-3">Current Subscription</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-500 uppercase">Subscription Type</label>
                            <p class="text-sm font-semibold text-gray-800">
                                @if($user->subscription_type)
                                    {{ ucfirst(str_replace('_', ' ', $user->subscription_type)) }}
                                @else
                                    <span class="text-red-500">No Active Subscription</span>
                                @endif
                            </p>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-500 uppercase">Amount to Pay</label>
                            <p class="text-sm font-semibold text-green-600">
                                @if($user->subscription_amount && $user->subscription_amount > 0)
                                    ₱{{ number_format($user->subscription_amount, 2) }}
                                @else
                                    <span class="text-red-500">Not Configured</span>
                                @endif
                            </p>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-500 uppercase">Start Date</label>
                            <p class="text-sm text-gray-800">
                                {{ $user->subscription_start_date ? \Carbon\Carbon::parse($user->subscription_start_date)->format('M d, Y') : 'N/A' }}
                            </p>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-500 uppercase">End Date</label>
                            <p class="text-sm text-gray-800">
                                {{ $user->subscription_end_date ? \Carbon\Carbon::parse($user->subscription_end_date)->format('M d, Y') : 'N/A' }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Payment Form -->
                @if($user->subscription_amount && $user->subscription_amount > 0)
                <div class="bg-white p-4 rounded-md mb-4 shadow-sm">
                    <h3 class="text-md font-medium text-gray-700 mb-3">Submit Payment</h3>
                    <form action="{{ route('account.payment') }}" method="POST" enctype="multipart/form-data" class="space-y-4">
                        @csrf
                        
                        <!-- Fixed Amount Display -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Amount (Fixed)</label>
                            <div class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 font-semibold">
                                ₱{{ number_format($user->subscription_amount, 2) }}
                            </div>
                            <input type="hidden" name="amount" value="{{ $user->subscription_amount }}">
                            <p class="text-xs text-gray-500 mt-1">This is your fixed subscription amount.</p>
                        </div>

                        <!-- Payment Method -->
                        <div>
                            <label for="payment_method" class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                            <div class="grid grid-cols-2 gap-4">
                                <label class="relative flex cursor-pointer">
                                    <input type="radio" name="payment_method" value="gcash" class="peer sr-only" required onchange="toggleQRCode('gcash')">
                                    <div class="w-full p-3 border-2 border-gray-200 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50 transition-all">
                                        <div class="flex items-center justify-center">
                                            <span class="font-semibold text-blue-600">GCash</span>
                                        </div>
                                    </div>
                                </label>
                                <label class="relative flex cursor-pointer">
                                    <input type="radio" name="payment_method" value="maya" class="peer sr-only" onchange="toggleQRCode('maya')">
                                    <div class="w-full p-3 border-2 border-gray-200 rounded-lg peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50 transition-all">
                                        <div class="flex items-center justify-center">
                                            <span class="font-semibold text-green-600">Maya</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- QR Code Display Section -->
                        <div id="qrCodeSection" class="hidden">
                            <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
                                <h4 class="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                    <i class="bi bi-qr-code mr-2"></i>
                                    Scan QR Code to Pay
                                </h4>
                                
                                <!-- GCash QR Code -->
                                <div id="gcashQRDisplay" class="hidden text-center">
                                    @if($user->gcash_qr_path)
                                        <img src="{{ asset('storage/' . $user->gcash_qr_path) }}" alt="GCash QR Code" class="mx-auto max-w-[250px] max-h-[250px] rounded-lg shadow-md border-2 border-blue-200">
                                        <p class="text-xs text-gray-600 mt-2">Scan this GCash QR code with your GCash app</p>
                                    @else
                                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <i class="bi bi-exclamation-triangle text-yellow-600 text-2xl mb-2"></i>
                                            <p class="text-sm text-yellow-800">GCash QR code not available. Please contact administrator.</p>
                                        </div>
                                    @endif
                                </div>

                                <!-- Maya QR Code -->
                                <div id="mayaQRDisplay" class="hidden text-center">
                                    @if($user->maya_qr_path)
                                        <img src="{{ asset('storage/' . $user->maya_qr_path) }}" alt="Maya QR Code" class="mx-auto max-w-[250px] max-h-[250px] rounded-lg shadow-md border-2 border-green-200">
                                        <p class="text-xs text-gray-600 mt-2">Scan this Maya QR code with your Maya app</p>
                                    @else
                                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <i class="bi bi-exclamation-triangle text-yellow-600 text-2xl mb-2"></i>
                                            <p class="text-sm text-yellow-800">Maya QR code not available. Please contact administrator.</p>
                                        </div>
                                    @endif
                                </div>

                                <div class="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p class="text-xs text-blue-800">
                                        <i class="bi bi-info-circle mr-1"></i>
                                        After scanning and completing the payment, enter the reference number below. Proof of payment is optional when using QR code.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Reference Number -->
                        <div>
                            <label for="reference_number" class="block text-sm font-medium text-gray-700 mb-1">Reference Number <span class="text-red-500">*</span></label>
                            <input type="text" id="reference_number" name="reference_number" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter transaction reference number" required>
                        </div>

                        <!-- Payment Date -->
                        <div>
                            <label for="payment_date" class="block text-sm font-medium text-gray-700 mb-1">Payment Date <span class="text-red-500">*</span></label>
                            <input type="date" id="payment_date" name="payment_date" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required max="{{ date('Y-m-d') }}">
                        </div>

                        <!-- Proof of Payment (Optional) -->
                        <div>
                            <label for="proof_image" class="block text-sm font-medium text-gray-700 mb-1">
                                Proof of Payment (Screenshot) 
                                <span class="text-xs text-gray-500 font-normal">- Optional when using QR code</span>
                            </label>
                            <input type="file" id="proof_image" name="proof_image" accept="image/jpeg,image/png,image/jpg" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <p class="text-xs text-gray-500 mt-1">Upload screenshot of your payment receipt (JPG, PNG, max 2MB). Optional when paying via QR code scan.</p>
                        </div>

                        <!-- Submit Button -->
                        <div class="pt-2">
                            <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 font-semibold">
                                <i class="bi bi-send mr-2"></i>Submit Payment
                            </button>
                        </div>
                    </form>
                </div>
                @else
                <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
                    <div class="flex items-center">
                        <i class="bi bi-exclamation-triangle text-yellow-600 mr-2"></i>
                        <p class="text-sm text-yellow-800">No subscription amount configured. Please contact your administrator to set up your subscription.</p>
                    </div>
                </div>
                @endif
                @endif

                <!-- Recent Payments -->
                @if($payments && $payments->count() > 0)
                <div class="bg-white p-4 rounded-md shadow-sm">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-md font-medium text-gray-700">Recent Payments</h3>
                        <a href="{{ route('account.payment.history') }}" class="text-sm text-blue-600 hover:text-blue-800">View All</a>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Proof</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                @foreach($payments as $payment)
                                <tr>
                                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                        {{ \Carbon\Carbon::parse($payment->payment_date)->format('M d, Y') }}
                                    </td>
                                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 uppercase">
                                        {{ $payment->payment_method }}
                                    </td>
                                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                        ₱{{ number_format($payment->amount, 2) }}
                                    </td>
                                    <td class="px-3 py-2 whitespace-nowrap">
                                        @if($payment->status === 'pending')
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                        @elseif($payment->status === 'approved')
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
                                        @else
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>
                                        @endif
                                    </td>
                                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        @if($payment->proof_image_path)
                                            <button onclick="openProofModal('{{ route('account.payment.proof', $payment) }}')" class="text-blue-600 hover:text-blue-800 focus:outline-none">
                                                <i class="bi bi-image"></i>
                                            </button>
                                        @else
                                            <span class="text-gray-400">-</span>
                                        @endif
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
                @endif
            </div>
    </div>
</div>

<!-- Payment Proof Modal -->
<div id="proofModal" class="fixed inset-0 z-[100] hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Backdrop with blur -->
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity z-[100]" onclick="closeProofModal()"></div>
    
    <!-- Modal Content -->
    <div class="fixed inset-0 flex items-center justify-center p-4 z-[101]">
        <div class="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900 flex items-center" id="modal-title">
                    <i class="bi bi-receipt mr-2 text-blue-600"></i>Payment Proof
                </h3>
                <button onclick="closeProofModal()" class="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <i class="bi bi-x-lg text-xl"></i>
                </button>
            </div>
            
            <!-- Image Container -->
            <div class="p-6 bg-gray-100 flex items-center justify-center overflow-auto max-h-[60vh]">
                <img id="proofImage" src="" alt="Payment Proof" class="max-w-full max-h-[55vh] object-contain rounded-lg shadow-md">
            </div>
            
            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button type="button" onclick="closeProofModal()" class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Close
                </button>
                <a id="downloadProof" href="" download class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
                    <i class="bi bi-download mr-2"></i>Download
                </a>
            </div>
        </div>
    </div>
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

    function switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        // Show selected tab content
        document.getElementById('content-' + tabName).classList.remove('hidden');
        
        // Reset all tab buttons
        document.querySelectorAll('[id^="tab-"]').forEach(tab => {
            tab.classList.remove('border-blue-500', 'text-blue-600');
            tab.classList.add('border-transparent', 'text-gray-500');
        });
        
        // Highlight selected tab
        const selectedTab = document.getElementById('tab-' + tabName);
        selectedTab.classList.remove('border-transparent', 'text-gray-500');
        selectedTab.classList.add('border-blue-500', 'text-blue-600');
    }

    function openProofModal(imageUrl) {
        const modal = document.getElementById('proofModal');
        const img = document.getElementById('proofImage');
        const downloadBtn = document.getElementById('downloadProof');
        
        img.src = imageUrl;
        downloadBtn.href = imageUrl;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeProofModal() {
        const modal = document.getElementById('proofModal');
        const img = document.getElementById('proofImage');
        
        modal.classList.add('hidden');
        img.src = '';
        document.body.style.overflow = 'auto';
    }

    function toggleQRCode(method) {
        const qrSection = document.getElementById('qrCodeSection');
        const gcashDisplay = document.getElementById('gcashQRDisplay');
        const mayaDisplay = document.getElementById('mayaQRDisplay');
        
        qrSection.classList.remove('hidden');
        
        if (method === 'gcash') {
            gcashDisplay.classList.remove('hidden');
            mayaDisplay.classList.add('hidden');
        } else if (method === 'maya') {
            gcashDisplay.classList.add('hidden');
            mayaDisplay.classList.remove('hidden');
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeProofModal();
        }
    });
</script>

@endsection
