@extends('layouts.app')

@section('content')

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
    <div class="max-w-7xl mx-auto">
        
        <!-- Header Card -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
            <div class="bg-[#0d6efd] px-6 py-5">

                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div class="flex items-center gap-4">
                        <div class="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <i class="bi bi-shield-check text-3xl text-white"></i>
                        </div>
                        <div>
                            <h1 class="text-2xl md:text-3xl font-bold text-white">Payment Management</h1>
                            <p class="text-blue-100 text-sm mt-1">Review, approve, and manage user subscription payments</p>
                        </div>
                    </div>
                    <a href="{{ route('account.setting') }}" class="inline-flex items-center px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40">
                        <i class="bi bi-arrow-left mr-2"></i>
                        <span>Back to Account</span>
                    </a>
                </div>
            </div>
            
            <!-- Quick Stats Bar -->
            <div class="grid grid-cols-3 divide-x divide-gray-200 bg-gray-50">
                <div class="p-4 flex items-center justify-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <i class="bi bi-clock-history text-lg text-yellow-600"></i>
                    </div>
                    <div class="text-center">
                        <p class="text-xl font-bold text-gray-800">{{ $pendingPayments->count() }}</p>
                        <p class="text-xs text-gray-500">Pending</p>
                    </div>
                </div>
                <div class="p-4 flex items-center justify-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <i class="bi bi-check-circle text-lg text-green-600"></i>
                    </div>
                    <div class="text-center">
                        <p class="text-xl font-bold text-gray-800">
                            {{ \App\Models\Payment::where('status', 'approved')->where('updated_at', '>=', now()->subDays(30))->count() }}
                        </p>
                        <p class="text-xs text-gray-500">Approved</p>
                    </div>
                </div>
                <div class="p-4 flex items-center justify-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <i class="bi bi-currency-exchange text-lg text-blue-600"></i>
                    </div>
                    <div class="text-center">
                        <p class="text-xl font-bold text-gray-800">
                            ₱{{ number_format(\App\Models\Payment::where('status', 'approved')->where('updated_at', '>=', now()->subDays(30))->sum('amount'), 0) }}
                        </p>
                        <p class="text-xs text-gray-500">Revenue</p>
                    </div>
                </div>
            </div>
        </div>


        <!-- Pending Payments Section -->
        <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
            <div class="px-5 py-4 border-b border-gray-100 bg-yellow-50 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <i class="bi bi-hourglass-split text-yellow-600"></i>
                    <h2 class="text-lg font-semibold text-gray-800">Pending Payments</h2>
                </div>
                @if($pendingPayments->count() > 0)
                <span class="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                    {{ $pendingPayments->count() }}
                </span>
                @endif
            </div>

            @if($pendingPayments && $pendingPayments->count() > 0)
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Office</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ref # / Date</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proof</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        @foreach($pendingPayments as $payment)
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3 whitespace-nowrap">
                                <div class="flex items-center gap-2">
                                    <div class="w-8 h-8 rounded-full bg-[#0d6efd] flex items-center justify-center text-white text-xs font-semibold">
                                        {{ substr($payment->user->firstname, 0, 1) }}{{ substr($payment->user->lastname, 0, 1) }}
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900 text-sm">{{ $payment->user->firstname }} {{ $payment->user->lastname }}</p>
                                        <p class="text-xs text-gray-500">{{ $payment->user->email }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                    <i class="bi bi-building mr-1"></i>
                                    {{ $payment->user->office->office_name ?? 'N/A' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">

                                <p class="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded inline-block">{{ $payment->reference_number }}</p>
                                <p class="text-xs text-gray-400 mt-1">{{ \Carbon\Carbon::parse($payment->payment_date)->format('M d, Y') }}</p>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium {{ $payment->payment_method === 'gcash' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700' }}">
                                    <i class="bi bi-{{ $payment->payment_method === 'gcash' ? 'phone' : 'wallet2' }}"></i>
                                    {{ strtoupper($payment->payment_method) }}
                                </span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <span class="font-bold text-gray-900">₱{{ number_format($payment->amount, 2) }}</span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                @if($payment->proof_image_path)
                                    <button onclick="openProofModal('{{ route('account.payment.proof', $payment) }}')" class="text-[#0d6efd] hover:text-blue-700 text-xs font-medium flex items-center gap-1">
                                        <i class="bi bi-image"></i> View
                                    </button>
                                @else
                                    <span class="text-gray-400 text-xs">-</span>
                                @endif
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <div class="flex items-center gap-2">
                                    <button onclick="openApproveModal({{ $payment->id }})" class="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center transition-colors" title="Approve">
                                        <i class="bi bi-check-lg text-lg"></i>
                                    </button>
                                    <button onclick="openRejectModal({{ $payment->id }})" class="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors" title="Reject">
                                        <i class="bi bi-x-lg text-lg"></i>
                                    </button>
                                </div>
                            </td>

                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @else
            <div class="p-8 text-center">
                <i class="bi bi-check-all text-3xl text-green-500 mb-2"></i>
                <p class="text-sm text-gray-600">No pending payments</p>
            </div>
            @endif
        </div>


        <!-- Recent Activity Section -->
        <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <i class="bi bi-clock-history text-gray-600"></i>
                <h2 class="text-lg font-semibold text-gray-800">Recent Activity</h2>
            </div>

            @if($recentPayments && $recentPayments->count() > 0)
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Office</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ref # / Date</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proof</th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        @foreach($recentPayments as $payment)
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3 whitespace-nowrap">
                                <div class="flex items-center gap-2">
                                    <div class="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-semibold">
                                        {{ substr($payment->user->firstname, 0, 1) }}{{ substr($payment->user->lastname, 0, 1) }}
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900 text-sm">{{ $payment->user->firstname }} {{ $payment->user->lastname }}</p>
                                        <p class="text-xs text-gray-500">{{ $payment->user->email }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                    <i class="bi bi-building mr-1"></i>
                                    {{ $payment->user->office->office_name ?? 'N/A' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">

                                <p class="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded inline-block">{{ $payment->reference_number }}</p>
                                <p class="text-xs text-gray-400 mt-1">{{ \Carbon\Carbon::parse($payment->payment_date)->format('M d, Y') }}</p>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium {{ $payment->payment_method === 'gcash' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700' }}">
                                    <i class="bi bi-{{ $payment->payment_method === 'gcash' ? 'phone' : 'wallet2' }}"></i>
                                    {{ strtoupper($payment->payment_method) }}
                                </span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <span class="font-bold text-gray-900">₱{{ number_format($payment->amount, 2) }}</span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                @if($payment->status === 'approved')
                                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                        <i class="bi bi-check-circle-fill"></i> Approved
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                        <i class="bi bi-x-circle-fill"></i> Rejected
                                    </span>
                                @endif
                            </td>
                            <td class="px-4 py-3">
                                <p class="text-xs text-gray-600 max-w-[150px] truncate" title="{{ $payment->admin_notes }}">
                                    {{ $payment->admin_notes ?? '-' }}
                                </p>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                @if($payment->proof_image_path)
                                    <button onclick="openProofModal('{{ route('account.payment.proof', $payment) }}')" class="text-[#0d6efd] hover:text-blue-700 text-xs font-medium flex items-center gap-1">
                                        <i class="bi bi-image"></i> View
                                    </button>
                                @else
                                    <span class="text-gray-400 text-xs">-</span>
                                @endif
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @else
            <div class="p-8 text-center">
                <i class="bi bi-inbox text-3xl text-gray-400 mb-2"></i>
                <p class="text-sm text-gray-600">No recent activity</p>
            </div>
            @endif
        </div>

    </div>
</div>


<!-- Payment Proof Modal -->
<div id="proofModal" class="fixed inset-0 z-[200] hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity z-[200]" onclick="closeProofModal()"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4 z-[201]">

        <div class="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900 flex items-center" id="modal-title">
                    <i class="bi bi-receipt mr-2 text-blue-600"></i>Payment Proof
                </h3>
                <button onclick="closeProofModal()" class="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <i class="bi bi-x-lg text-xl"></i>
                </button>
            </div>
            <div class="p-6 bg-gray-100 flex items-center justify-center overflow-auto max-h-[60vh]">
                <img id="proofImage" src="" alt="Payment Proof" class="max-w-full max-h-[55vh] object-contain rounded-lg shadow-md">
            </div>
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

<!-- Approve Payment Modal -->
<div id="approveModal" class="fixed inset-0 z-[200] hidden" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity z-[200]" onclick="closeApproveModal()"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4 z-[201]">

        <div class="bg-white rounded-lg shadow-2xl max-w-lg w-full">
            <div class="bg-green-50 px-6 py-4 border-b border-green-200 flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900 flex items-center">
                    <i class="bi bi-check-circle mr-2 text-green-600"></i>Approve Payment
                </h3>
                <button onclick="closeApproveModal()" class="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <i class="bi bi-x-lg text-xl"></i>
                </button>
            </div>
            <form id="approveForm" method="POST" action="">
                @csrf
                <div class="p-6">
                    <p class="text-gray-600 mb-4">Are you sure you want to approve this payment? This will activate the user's subscription for one month.</p>
                    <div>
                        <label for="approve_notes" class="block text-sm font-medium text-gray-700 mb-1">Admin Notes (Optional)</label>
                        <textarea id="approve_notes" name="admin_notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Add any notes about this approval..."></textarea>
                    </div>
                </div>
                <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button type="button" onclick="closeApproveModal()" class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center">
                        <i class="bi bi-check-lg mr-2"></i>Confirm Approval
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Reject Payment Modal -->
<div id="rejectModal" class="fixed inset-0 z-[200] hidden" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity z-[200]" onclick="closeRejectModal()"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4 z-[201]">

        <div class="bg-white rounded-lg shadow-2xl max-w-lg w-full">
            <div class="bg-red-50 px-6 py-4 border-b border-red-200 flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900 flex items-center">
                    <i class="bi bi-x-circle mr-2 text-red-600"></i>Reject Payment
                </h3>
                <button onclick="closeRejectModal()" class="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <i class="bi bi-x-lg text-xl"></i>
                </button>
            </div>
            <form id="rejectForm" method="POST" action="">
                @csrf
                <div class="p-6">
                    <p class="text-gray-600 mb-4">Are you sure you want to reject this payment? Please provide a reason.</p>
                    <div>
                        <label for="reject_notes" class="block text-sm font-medium text-gray-700 mb-1">Rejection Reason (Required)</label>
                        <textarea id="reject_notes" name="admin_notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Explain why this payment is being rejected..." required></textarea>
                    </div>
                </div>
                <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button type="button" onclick="closeRejectModal()" class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center">
                        <i class="bi bi-x-lg mr-2"></i>Confirm Rejection
                    </button>
                </div>
            </form>
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

    function openApproveModal(paymentId) {
        const modal = document.getElementById('approveModal');
        const form = document.getElementById('approveForm');
        
        form.action = "{{ url('/admin/payments') }}/" + paymentId + "/approve";
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeApproveModal() {
        const modal = document.getElementById('approveModal');
        const form = document.getElementById('approveForm');
        
        modal.classList.add('hidden');
        form.reset();
        document.body.style.overflow = 'auto';
    }

    function openRejectModal(paymentId) {
        const modal = document.getElementById('rejectModal');
        const form = document.getElementById('rejectForm');
        
        form.action = "{{ url('/admin/payments') }}/" + paymentId + "/reject";
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeRejectModal() {
        const modal = document.getElementById('rejectModal');
        const form = document.getElementById('rejectForm');
        
        modal.classList.add('hidden');
        form.reset();
        document.body.style.overflow = 'auto';
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeProofModal();
            closeApproveModal();
            closeRejectModal();
        }
    });

</script>


@endsection
