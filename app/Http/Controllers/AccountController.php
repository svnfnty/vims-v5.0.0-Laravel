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

        // Validate the request
        $request->validate([
            'payment_method' => 'required|in:gcash,maya',
            'reference_number' => 'required|string|max:100',
            'proof_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'payment_date' => 'required|date',
        ]);

        // Check if user has subscription amount set
        if (!$user->subscription_amount || $user->subscription_amount <= 0) {
            return back()->withErrors(['payment' => 'No subscription amount configured. Please contact administrator.']);
        }

        // Handle image upload
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
        
        // Ensure user can only view their own payment proofs
        if ($payment->user_id !== $user->id) {
            abort(403, 'Unauthorized access to this payment proof.');
        }
        
        // Check if file exists
        if (!$payment->proof_image_path || !Storage::disk('public')->exists($payment->proof_image_path)) {
            abort(404, 'Payment proof image not found.');
        }
        
        // Return the image file
        return Storage::disk('public')->response($payment->proof_image_path);
    }
}
