<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckSubscriptionExpiration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscription:check-expiration 
                            {--days=7 : Number of days before expiry to send notification}
                            {--grace=30 : Grace period in days after expiry before deactivating}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and update subscription statuses, send expiry notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting subscription expiration check...');
        $notifyDays = (int) $this->option('days');
        $graceDays = (int) $this->option('grace');
        
        $now = Carbon::now();
        
        // Get all users who have a subscription type set
        $subscribedUsers = User::whereNotNull('subscription_type')
            ->where('subscription_type', '!=', '')
            ->where('status', 1) // Only check active users
            ->get();
        
        $expiryCount = 0;
        $notificationCount = 0;
        
        foreach ($subscribedUsers as $user) {
            // Determine the reference date for subscription check
            // Priority: last_payment_date > subscription_end_date > date_added
            $referenceDate = null;
            
            if ($user->last_payment_date) {
                $referenceDate = Carbon::parse($user->last_payment_date)->addMonth();
            } elseif ($user->subscription_end_date) {
                $referenceDate = Carbon::parse($user->subscription_end_date);
            } elseif ($user->date_added) {
                $referenceDate = Carbon::parse($user->date_added)->addMonth();
            }
            
            if (!$referenceDate) {
                // If no reference date, skip (user might be on old system without subscription)
                continue;
            }
            
            // Check if subscription has expired (no payment within +1 month)
            if ($now->greaterThan($referenceDate)) {
                // Add grace period before deactivating
                $expiryWithGrace = $referenceDate->copy()->addDays($graceDays);
                
                if ($now->greaterThan($expiryWithGrace)) {
                    // Deactivate user subscription and remove permissions
                    $user->update([
                        'status' => 0,
                        'permissions' => 0
                    ]);
                    $expiryCount++;

                    
                    Log::info("User subscription deactivated", [
                        'user_id' => $user->id,
                        'user_email' => $user->email,
                        'reference_date' => $referenceDate->toDateTimeString(),
                        'deactivated_at' => $now->toDateTimeString()
                    ]);
                    
                    $this->warn("Deactivated subscription for user: {$user->email}");
                }
            }
            
            // Check if subscription is near expiry and send notification
            $expiryDate = $user->subscription_end_date 
                ? Carbon::parse($user->subscription_end_date)
                : ($user->last_payment_date 
                    ? Carbon::parse($user->last_payment_date)->addMonth()
                    : null);
            
            if ($expiryDate && !$user->notification_sent) {
                $daysUntilExpiry = $now->diffInDays($expiryDate, false);
                
                if ($daysUntilExpiry > 0 && $daysUntilExpiry <= $notifyDays) {
                    // Send notification (you can customize this)
                    $this->sendExpiryNotification($user, $daysUntilExpiry);
                    
                    // Mark notification as sent
                    $user->update([
                        'notification_sent' => true,
                        'notification_sent_at' => $now
                    ]);
                    
                    $notificationCount++;
                    
                    Log::info("Expiry notification sent to user", [
                        'user_id' => $user->id,
                        'user_email' => $user->email,
                        'days_until_expiry' => $daysUntilExpiry
                    ]);
                }
            }
            
            // Reset notification flag if subscription is renewed
            if ($user->last_payment_date) {
                $lastPayment = Carbon::parse($user->last_payment_date);
                if ($now->lessThan($lastPayment->addMonth())) {
                    // Subscription is active, reset notification flag for next cycle
                    if ($user->notification_sent) {
                        $user->update(['notification_sent' => false]);
                    }
                }
            }
        }
        
        $this->info("Subscription check completed!");
        $this->info("Subscriptions deactivated: {$expiryCount}");
        $this->info("Notifications sent: {$notificationCount}");
        
        return Command::SUCCESS;
    }
    
    /**
     * Send expiry notification to user
     * You can customize this method to send email, SMS, or in-app notification
     */
    protected function sendExpiryNotification(User $user, int $daysUntilExpiry)
    {
        // Option 1: Log the notification (for now)
        $this->info("📧 Notification: User {$user->email} subscription expires in {$daysUntilExpiry} days!");
        
        // Option 2: You can add email sending here
        // Mail::to($user->email)->send(new SubscriptionExpiringMail($user, $daysUntilExpiry));
        
        // Option 3: Store in database for in-app notification
        // You could create a notifications table or use Laravel's built-in notifications
        
        return true;
    }
}
