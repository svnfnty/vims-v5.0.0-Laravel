# Subscription System - Complete Guide

## Overview
This subscription system manages monthly payments with automatic expiration handling. If no payment is made within +1 month from the last payment date, the user status is automatically set to 0 (inactive).

---

## Database Fields

| Field | Type | Description |
|-------|------|-------------|
| `subscription_type` | string | monthly, yearly, free_trial |
| `subscription_start_date` | datetime | When subscription began |
| `subscription_end_date` | datetime | When subscription ends |
| `last_payment_date` | datetime | Last payment timestamp |
| `subscription_amount` | integer | Amount paid |
| `notification_sent` | boolean | If expiry warning was sent |
| `notification_sent_at` | datetime | When warning was sent |

---

## Commands & Usage

### 1. Run Migration (First Time Setup)
```bash
php artisan migrate
```
**When to use**: First time installing the subscription system or when adding subscription fields to existing database.

---

### 2. Check Subscription Expiration (Manual)
```bash
php artisan subscription:check-expiration
```
**When to use**: 
- Manually check and update expired subscriptions
- Testing the expiration logic
- Immediate deactivation check

**What it does**:
- Finds users with `subscription_type` set
- Checks if `last_payment_date + 1 month` has passed
- Adds 30-day grace period
- Sets `status = 0` for expired subscriptions
- Sends notifications for near-expiry subscriptions

---

### 3. Check with Custom Options
```bash
# Custom warning days (default: 7 days before expiry)
php artisan subscription:check-expiration --days=14

# Custom grace period (default: 30 days after expiry)
php artisan subscription:check-expiration --grace=15

# Both options together
php artisan subscription:check-expiration --days=7 --grace=30
```
**When to use**: When you want to customize notification timing or grace period.

---

### 4. Setup Automatic Daily Checks (Linux/Mac)
Add to crontab:
```bash
* * * * * cd /path/to/your/project && php artisan schedule:run >> /dev/null 2>&1
```
**When to use**: To enable automatic daily expiration checks at midnight.

**Verify it's working**:
```bash
php artisan schedule:list
```
You should see: `subscription:check-expiration` scheduled daily at 00:00

---

### 5. Setup Automatic Daily Checks (Windows)
Create a Task Scheduler task:
1. Open Task Scheduler
2. Create Basic Task → Name: "Subscription Check"
3. Trigger: Daily at 12:00 AM
4. Action: Start a program
5. Program: `php`
6. Arguments: `artisan schedule:run`
7. Start in: `C:\xampp\htdocs\vims-v5.0.0-Laravel`

**When to use**: Windows servers to run automatic daily checks.

---

### 6. Test Expiration Logic (Immediate)
```bash
php artisan subscription:check-expiration --grace=0
```
**When to use**: Testing - immediately deactivates expired subscriptions without grace period.

---

## How Expiration Works

### What is Grace Period?
**Grace Period** is an extra time given to users AFTER their subscription expires, before their account is deactivated. Think of it as a "buffer" or "courtesy period" where users can still access the system even though their subscription has technically expired.

- **Default**: 30 days
- **Purpose**: Gives users time to renew without immediate service interruption
- **During grace period**: User status remains active (status = 1)
- **After grace period**: User status changes to inactive (status = 0)

### Timeline Example:
```
Day 0:   User makes payment (last_payment_date = Jan 1)
Day 30:  Subscription expires (Jan 1 + 1 month = Feb 1)
         ↳ User enters grace period (can still use system)
Day 30-60: Grace period (30 days) - USER CAN STILL LOGIN
Day 60:  Grace period ends → Status automatically set to 0 (CANNOT LOGIN)
```

### Real-World Example:
- **Netflix/Spotify** do this - even if your subscription expires, you might get a few days to renew before they cut you off
- **Your System**: 30 days to renew after expiry before account deactivation

### Logic:
1. System checks `last_payment_date`
2. Adds 1 month to get expiry date
3. Adds 30-day grace period (courtesy time)
4. If current date > expiry + grace:
   - `status = 0` (locked out)
   - `permissions = 0` (no access rights)


### To Disable Grace Period (Immediate Deactivation):
```bash
php artisan subscription:check-expiration --grace=0
```
This makes the system deactivate users immediately when subscription expires (no extra time given).


---

## User Interface Features

### Creating/Editing Users
1. Go to **Users** → **New User** or **Edit User**
2. Fill in basic information
3. In **Subscription Information** section:
   - Select **Subscription Type** (Monthly/Yearly/Free Trial)
   - Dates auto-populate based on selection
   - Set **Last Payment Date** (defaults to today)
   - Enter **Subscription Amount**

### Automatic Date Calculation
When you select subscription type:
- **Monthly**: End date = Start date + 1 month
- **Yearly**: End date = Start date + 1 year
- **Free Trial**: End date = Start date + 14 days

---

## Notifications

### In-App Notifications
Users see notifications when:
- **Red Banner**: Subscription expired (immediate action needed)
- **Yellow Banner**: Expires within 7 days (renew soon)
- **Blue Banner**: Expires within 30 days (consider renewing)

### Where Notifications Appear:
1. **Dashboard Popup** (SweetAlert2) - when visiting dashboard
2. **Persistent Banner** - on all pages
3. **Console Command** - logs notifications

### Popup When Clicking Action Buttons (permissions=0)
When a user with `permissions = 0` tries to click **Create**, **Edit**, or **Delete** buttons, they will see a popup:

```
┌─────────────────────────────────────────┐
│  ⚠️ Subscription Required!              │
│                                         │
│  Your subscription has expired or you    │
│  don't have permission to [action].      │
│  Please renew your subscription to      │
│  continue using this feature.           │
│                                         │
│  [  Renew Subscription  ]  [ Cancel ]     │
└─────────────────────────────────────────┘
```

**What happens:**
- Clicking **"Renew Subscription"** → Redirects to `/account/setting`
- Clicking **"Cancel"** → Closes popup, stays on current page
- **View** button still works (read-only access allowed)

### Backend Protection
The middleware also blocks API requests from users with `permissions = 0`:
```json
{
  "success": false,
  "subscription_expired": true,
  "message": "Your subscription has expired...",
  "renewal_url": "/account/setting"
}
```


---

## API Endpoints

### Create User with Subscription
```http
POST /users
Content-Type: application/json

{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "type": 2,
  "status": 1,
  "permissions": 1,
  "subscription_type": "monthly",
  "subscription_start_date": "2025-01-01",
  "subscription_end_date": "2025-02-01",
  "last_payment_date": "2025-01-01",
  "subscription_amount": 99.99
}
```

### Update User Subscription
```http
PUT /users/{id}
Content-Type: application/json

{
  "subscription_type": "yearly",
  "last_payment_date": "2025-01-15",
  "subscription_amount": 999.99
}
```

---

## Troubleshooting

### Subscriptions Not Expiring?
```bash
# Check if command is scheduled
php artisan schedule:list

# Run manually to see output
php artisan subscription:check-expiration

# Check logs
tail -f storage/logs/laravel.log
```

### Reset Notification Flag
If you want to re-send notifications:
```sql
UPDATE users SET notification_sent = 0, notification_sent_at = NULL;
```

### Manual Status Reset
To manually reactivate a user:
```sql
UPDATE users SET status = 1, last_payment_date = NOW() WHERE id = {user_id};
```

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Install/Update DB | `php artisan migrate` |
| Check Expirations | `php artisan subscription:check-expiration` |
| Immediate Deactivation | `php artisan subscription:check-expiration --grace=0` |
| Custom Warning Days | `php artisan subscription:check-expiration --days=14` |
| View Scheduled Tasks | `php artisan schedule:list` |
| Run Scheduler | `php artisan schedule:run` |

---

## Support

For issues:
1. Check logs: `storage/logs/laravel.log`
2. Run command manually to see errors
3. Verify database fields exist: `SHOW COLUMNS FROM users;`
4. Test with: `php artisan subscription:check-expiration --grace=0`

---

**Note**: This is a semi-SaaS implementation. For full automation with payment gateways (Stripe, PayPal), additional integration would be needed.
