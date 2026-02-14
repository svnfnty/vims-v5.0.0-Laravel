@extends('layouts.app')

@section('content')

<div class="max-w-10xl mx-auto py-6 px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Payment History</h1>
            <a href="{{ route('account.setting') }}" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200">
                <i class="bi bi-arrow-left mr-2"></i>Back to Account
            </a>
        </div>

        <!-- Current Subscription Summary -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-3">Current Subscription</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-xs font-medium text-gray-500 uppercase">Type</label>
                    <p class="text-sm font-semibold text-gray-800">
                        @if($user->subscription_type)
                            {{ ucfirst(str_replace('_', ' ', $user->subscription_type)) }}
                        @else
                            <span class="text-red-500">No Active Subscription</span>
                        @endif
                    </p>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-500 uppercase">Amount</label>
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

        <!-- Payment History Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-800">All Payments</h3>
            </div>
            
            @if($payments && $payments->count() > 0)
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference #</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @foreach($payments as $payment)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ \Carbon\Carbon::parse($payment->payment_date)->format('M d, Y') }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 uppercase">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $payment->payment_method === 'gcash' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800' }}">
                                    {{ $payment->payment_method }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                {{ $payment->reference_number }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                ₱{{ number_format($payment->amount, 2) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($payment->status === 'pending')
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        <i class="bi bi-clock mr-1"></i>Pending
                                    </span>
                                @elseif($payment->status === 'approved')
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        <i class="bi bi-check-circle mr-1"></i>Approved
                                    </span>
                                @else
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                        <i class="bi bi-x-circle mr-1"></i>Rejected
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $payment->created_at->format('M d, Y H:i') }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                @if($payment->proof_image_path)
                                    <button onclick="openProofModal('{{ route('account.payment.proof', $payment) }}')" class="text-blue-600 hover:text-blue-800 flex items-center focus:outline-none">
                                        <i class="bi bi-image mr-1"></i>View
                                    </button>
                                @else
                                    <span class="text-gray-400">No image</span>
                                @endif
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            <div class="px-6 py-4 border-t border-gray-200">
                {{ $payments->links() }}
            </div>
            @else
            <div class="p-6 text-center">
                <div class="text-gray-400 mb-2">
                    <i class="bi bi-receipt text-4xl"></i>
                </div>
                <p class="text-gray-500">No payment records found.</p>
                <a href="{{ route('account.setting') }}" class="mt-4 inline-block text-blue-600 hover:text-blue-800">
                    Submit your first payment
                </a>
            </div>
            @endif
        </div>

        <!-- Payment Instructions -->
        <div class="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 class="text-md font-semibold text-gray-800 mb-2">Payment Instructions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                    <h4 class="font-medium text-gray-700 mb-1">GCash</h4>
                    <p>1. Open GCash app</p>
                    <p>2. Send payment to administrator account</p>
                    <p>3. Screenshot the confirmation</p>
                    <p>4. Submit payment details with reference number</p>
                </div>
                <div>
                    <h4 class="font-medium text-gray-700 mb-1">Maya</h4>
                    <p>1. Open Maya app</p>
                    <p>2. Send payment to administrator account</p>
                    <p>3. Screenshot the confirmation</p>
                    <p>4. Submit payment details with reference number</p>
                </div>
            </div>
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

<script>
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

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeProofModal();
        }
    });
</script>

@endsection
