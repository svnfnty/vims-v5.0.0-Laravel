<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use App\Models\Payment;

class AccountController extends Controller
{
    public function setting()
    {
        $user = Auth::user();
        $payments = $user->payments()->orderBy('created_at', 'desc')->take(5)->get();
        return view('account.setting', compact('user', 'payments'));
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'current_password' => 'required',
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        // Check current password
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'The current password is incorrect.']);
        }

        // Update user
        $user->update([
            'firstname' => strtoupper($request->firstname),
            'lastname' => strtoupper($request->lastname),
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Account settings updated successfully.');
    }

    public function processPayment(Request $request)
    {
        $user = Auth::user();

        // Validate the request - proof_image is now optional
        $request->validate([
            'payment_method' => 'required|in:gcash,maya',
            'reference_number' => 'required|string|max:100|unique:payments,reference_number',
            'proof_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'payment_date' => 'required|date',
        ]);

        // Check if user has subscription amount set
        if (!$user->subscription_amount || $user->subscription_amount <= 0) {
            return back()->withErrors(['payment' => 'No subscription amount configured. Please contact administrator.']);
        }

        // Handle image upload (now optional)
        $imagePath = null;
        if ($request->hasFile('proof_image')) {
            $imagePath = $request->file('proof_image')->store('payment_proofs', 'public');
        }

        // Create payment record
        Payment::create([
            'user_id' => $user->id,
            'payment_method' => $request->payment_method,
            'amount' => $user->subscription_amount,
            'reference_number' => $request->reference_number,
            'proof_image_path' => $imagePath,
            'status' => 'pending',
            'payment_date' => $request->payment_date,
        ]);

        return back()->with('success', 'Payment submitted successfully! Your payment is pending verification.');
    }

    public function paymentHistory()
    {
        $user = Auth::user();
        $payments = $user->payments()->orderBy('created_at', 'desc')->paginate(10);
        return view('account.payments', compact('user', 'payments'));
    }

    public function getSubscriptionAmount()
    {
        $user = Auth::user();
        return response()->json([
            'subscription_amount' => $user->subscription_amount,
            'subscription_type' => $user->subscription_type,
            'formatted_amount' => number_format($user->subscription_amount, 2),
        ]);
    }

    public function viewPaymentProof(Payment $payment)
    {
        $user = Auth::user();
        
        // Ensure user can only view their own payment proofs (or admin can view all)
        if ($payment->user_id !== $user->id && !($user->id === 1 && $user->office_id === 0)) {
            abort(403, 'Unauthorized access to this payment proof.');
        }
        
        // Check if file exists
        if (!$payment->proof_image_path || !Storage::disk('public')->exists($payment->proof_image_path)) {
            abort(404, 'Payment proof image not found.');
        }
        
        // Return the image file
        return Storage::disk('public')->response($payment->proof_image_path);
    }

    // Admin Methods for Payment Management
    
    public function adminPayments()
    {
        $user = Auth::user();
        
        // Check if user is admin (id=1 and office_id=0)
        if (!($user->id === 1 && $user->office_id === 0)) {
            abort(403, 'Unauthorized access. Admin only.');
        }
        
        // Get all pending payments
        $pendingPayments = Payment::with('user')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Get recent approved/rejected payments (last 30 days)
        $recentPayments = Payment::with('user')
            ->whereIn('status', ['approved', 'rejected'])
            ->where('updated_at', '>=', now()->subDays(30))
            ->orderBy('updated_at', 'desc')
            ->take(20)
            ->get();
            
        return view('account.admin-payments', compact('pendingPayments', 'recentPayments'));
    }
    
    public function approvePayment(Request $request, Payment $payment)
    {
        $user = Auth::user();
        
        // Check if user is admin (id=1 and office_id=0)
        if (!($user->id === 1 && $user->office_id === 0)) {
            abort(403, 'Unauthorized access. Admin only.');
        }
        
        // Validate request
        $request->validate([
            'admin_notes' => 'nullable|string|max:500',
        ]);
        
        // Update payment status
        $payment->update([
            'status' => 'approved',
            'admin_notes' => $request->admin_notes,
            'approved_at' => now(),
            'approved_by' => $user->id,
        ]);
        
        // Update user's subscription dates based on payment
        $paymentUser = $payment->user;
        if ($paymentUser) {
            $now = now();
            
            // Calculate new subscription end date
            // If user has remaining days, add them to the new period
            $currentEndDate = $paymentUser->subscription_end_date 
                ? \Carbon\Carbon::parse($paymentUser->subscription_end_date) 
                : null;
            
            if ($currentEndDate && $currentEndDate->isFuture()) {
                // User has remaining days, add 1 month to current end date
                $newEndDate = $currentEndDate->copy()->addMonth();
            } else {
                // No active subscription or expired, start fresh from now
                $newEndDate = $now->copy()->addMonth();
            }
            
            $paymentUser->update([
                'subscription_start_date' => $now->format('Y-m-d'),
                'subscription_end_date' => $newEndDate->format('Y-m-d'),
                'last_payment_date' => $now->format('Y-m-d'),
            ]);
        }
        
        return back()->with('success', 'Payment approved successfully. User subscription has been updated.');
    }
    
    public function rejectPayment(Request $request, Payment $payment)
    {
        $user = Auth::user();
        
        // Check if user is admin (id=1 and office_id=0)
        if (!($user->id === 1 && $user->office_id === 0)) {
            abort(403, 'Unauthorized access. Admin only.');
        }
        
        // Validate request
        $request->validate([
            'admin_notes' => 'required|string|max:500',
        ]);
        
        // Update payment status
        $payment->update([
            'status' => 'rejected',
            'admin_notes' => $request->admin_notes,
            'approved_at' => now(),
            'approved_by' => $user->id,
        ]);
        
        return back()->with('success', 'Payment rejected successfully.');
    }
}
