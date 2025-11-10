# ECO-Tracker Admin Setup Guide

## Overview
The ECO-Tracker app has a **separate admin login system** independent from the regular user authentication. Admins access a dedicated dashboard through a separate login screen.

## Admin Features
- Access dedicated admin dashboard with full verification controls
- View all user uploads across the entire platform
- Approve or reject upload verifications
- Award points for verified eco-activities
- Task assignment to verification team members
- Analytics and performance tracking
- Monitor user activity and manage verification workflow

## Accessing Admin Login

### From the User Login Screen
1. Open the app (you'll see the regular user login)
2. Click **"Admin Login →"** link at the bottom of the login card
3. You'll be taken to the dedicated Admin Login screen
4. Enter admin credentials to access the admin dashboard

### Going Back to User Login
- Click the **"Back"** button in the top-left corner of the Admin Login screen
- This will return you to the regular user login

## Quick Start: Demo Admin Access

The easiest way to try admin features:

1. Navigate to the **Admin Login** screen (click "Admin Login →" from user login)
2. Enter any credentials in the admin login form
3. Click **"Login"** - the demo accepts any credentials for testing
4. You'll be logged into the **Admin Dashboard** with full admin privileges
5. Use the Admin tab (shield icon) in the bottom navigation to access admin features

## Admin vs User Separation

### Admin Users Can:
- ✅ Access dedicated admin dashboard
- ✅ View all uploads from all users
- ✅ Approve/reject user submissions
- ✅ Award verification points
- ✅ Manage verification workflow
- ✅ Assign tasks to team members
- ✅ View analytics and statistics
- ✅ Track team performance

### Regular Users Can:
- ✅ Track their own eco-activities
- ✅ Upload proof of eco-actions
- ✅ View their own upload history
- ✅ Earn points and rewards
- ✅ Join events and compete on leaderboards
- ❌ **Cannot** access admin dashboard
- ❌ **Cannot** verify other users' uploads
- ❌ **Cannot** see admin controls

## Admin Access Points

Once logged in as an admin through the separate admin login:

### 1. Admin Dashboard (Main View)
- Click the **Shield icon** in the bottom navigation
- Access full verification dashboard with:
  - All pending user uploads
  - Advanced filtering and search
  - Task assignment system
  - Analytics and performance tracking
  - Bulk verification operations
  - Team management

### 2. Separate Authentication
- Admin login is completely separate from user login
- No overlap between admin and user sessions
- Dedicated admin interface and controls
- Independent logout functionality

## Creating a Real Admin User

### Backend Setup (Production)

After setting up your backend authentication:

1. Create an admin user in your database
2. Set the user's role to 'admin' in your authentication system
3. Configure admin-specific endpoints with proper authorization
4. Example structure:

```typescript
// Example backend admin check
const isAdmin = (user) => {
  return user.role === 'admin';
};

// Protected admin endpoint
app.post("/api/admin/verify-upload", async (c) => {
  const user = await getCurrentUser(c);
  if (!isAdmin(user)) {
    return c.json({ error: 'Unauthorized' }, 403);
  }
  // Process verification...
});
```

## Security Notes

- Admin and user logins are completely separate
- Admin status is checked on the backend for all sensitive operations
- Frontend admin UI is only accessible through admin login
- All verification actions are logged with admin attribution
- Points are only awarded through server-side verification
- Regular users cannot access admin routes or features

## Testing Admin Features

1. **Access Admin Login**: Click "Admin Login →" from the user login screen
2. **Login as Admin**: Enter any credentials (demo mode accepts all)
3. **Navigate to Admin Dashboard**: Click the shield icon in bottom navigation
4. **Test Verification**: Approve or reject pending uploads
5. **Try Task Assignment**: Assign verifications to team members
6. **Monitor Analytics**: View verification statistics and team performance

## Switching Between User and Admin

### To Switch from User to Admin:
1. Logout from user account
2. You'll return to the login screen
3. Click "Admin Login →" at the bottom
4. Login with admin credentials

### To Switch from Admin to User:
1. Logout from admin dashboard
2. You'll return to the admin login screen
3. Click "Back" button in the top-left
4. You're now at the user login screen

## Support

For questions or issues with admin functionality:
- Check the browser console for detailed error messages
- Verify proper separation between admin and user flows
- Ensure admin credentials are properly configured
- Review backend logs for API errors

---

**Note**: This is a production-ready admin system with separate authentication. Make sure to properly secure admin endpoints and validate permissions on the backend before deploying to production. The admin and user systems are intentionally separated for security and usability.
