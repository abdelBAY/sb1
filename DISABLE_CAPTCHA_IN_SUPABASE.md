# How to Disable CAPTCHA in Supabase

## Quick Steps to Fix "CAPTCHA verification failed" Error

If you're getting a CAPTCHA error when trying to reset passwords, you need to disable CAPTCHA in your Supabase project settings.

### Step-by-Step Instructions:

1. **Go to Supabase Dashboard**
   - Visit [https://app.supabase.com](https://app.supabase.com)
   - Log in to your account
   - Select your project

2. **Navigate to Authentication Settings**
   - Click on **Settings** in the left sidebar
   - Click on **Authentication** in the settings menu

3. **Find Bot and Abuse Protection**
   - Scroll down to the **Bot and Abuse Protection** section
   - Look for the toggle switch labeled **"Enable CAPTCHA protection"**

4. **Disable CAPTCHA**
   - Turn OFF the **"Enable CAPTCHA protection"** toggle
   - Click **Save** (if there's a save button)

5. **Wait for Changes to Propagate**
   - Wait 1-2 minutes for the changes to take effect
   - Supabase needs time to update the settings across all servers

6. **Test Password Reset**
   - Try the password reset flow again
   - It should work without CAPTCHA now

## Visual Guide

```
Supabase Dashboard
  └─ Settings
      └─ Authentication
          └─ Bot and Abuse Protection
              └─ [ ] Enable CAPTCHA protection  ← Turn this OFF
```

## Alternative: If You Want to Keep CAPTCHA

If you want to keep CAPTCHA enabled, you'll need to:
1. Configure CAPTCHA properly in Supabase (see `SUPABASE_CAPTCHA_SETUP.md`)
2. Add CAPTCHA widget back to the password reset form
3. Send the CAPTCHA token with the password reset request

However, for most use cases, disabling CAPTCHA is the simpler solution.

## Troubleshooting

### Issue: Can't find "Bot and Abuse Protection" section
- Make sure you're in the correct project
- Try refreshing the page
- Check if you have the correct permissions (you need to be a project owner or admin)

### Issue: Changes don't take effect
- Wait 2-3 minutes and try again
- Clear your browser cache
- Try in an incognito/private window
- Check Supabase status page for any service issues

### Issue: Still getting CAPTCHA errors after disabling
- Double-check that CAPTCHA is actually disabled (refresh the page and check again)
- Make sure you saved the changes
- Wait a bit longer (up to 5 minutes)
- Check Supabase logs for any errors

## Need More Help?

- [Supabase Documentation on CAPTCHA](https://supabase.com/docs/guides/auth/auth-captcha)
- [Supabase Support](https://supabase.com/support)

