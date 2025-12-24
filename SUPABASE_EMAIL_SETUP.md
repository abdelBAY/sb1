# Supabase Email Configuration Guide

## Problem: Not Receiving Password Reset Emails

If you're not receiving password reset emails, follow these steps to configure Supabase:

## Step 1: Configure Redirect URLs in Supabase Dashboard

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Add your redirect URLs to the **Redirect URLs** list:
   - For local development: `http://localhost:5173/reset-password`
   - For production: `https://yourdomain.com/reset-password`
   - Add both with and without trailing slashes

## Step 2: Configure Email Templates

1. In Supabase Dashboard, go to **Authentication** → **Email Templates**
2. Find the **Reset Password** template
3. Make sure it's enabled and properly configured
4. The template should include a link like: `{{ .ConfirmationURL }}`

## Step 3: Check Email Service Status

1. Go to **Settings** → **Auth** in Supabase Dashboard
2. Check if **Enable Email Signup** is enabled
3. Verify your **Site URL** is set correctly
4. Check **Email Rate Limits** - you might have hit the limit

## Step 4: Verify Email Settings

1. Go to **Settings** → **Auth** → **Email**
2. Check if **Enable Email Confirmations** is enabled
3. Verify **SMTP Settings** if using custom SMTP
4. If using Supabase's default email service, make sure it's not disabled

## Step 5: Check Email Provider Settings

### For Gmail:
- Check your **Spam/Junk** folder
- Check **All Mail** folder
- Verify email filters aren't blocking it
- Check if emails are being forwarded/deleted

### For Other Providers:
- Check spam folders
- Check email filters
- Verify email address is correct

## Step 6: Test Email Delivery

1. Try requesting a password reset again
2. Check Supabase Dashboard → **Logs** → **Auth Logs**
3. Look for any errors related to email sending
4. Check if the email was actually sent (status should be "sent")

## Step 7: Common Issues and Solutions

### Issue: "Error sending recovery email" (500 Internal Server Error)
**This is the most common issue. Try these solutions in order:**

1. **Check Redirect URL Configuration:**
   - Go to **Authentication** → **URL Configuration** in Supabase Dashboard
   - Add your exact redirect URL: `https://www.givea.shop/reset-password`
   - Also add: `https://givea.shop/reset-password` (without www)
   - Add both with and without trailing slashes
   - Save and wait 1-2 minutes

2. **Enable Email Service:**
   - Go to **Settings** → **Auth** → **Email**
   - Make sure email service is enabled
   - If using Supabase's default email, ensure it's not disabled
   - If using custom SMTP, verify SMTP settings are correct

3. **Check Email Templates:**
   - Go to **Authentication** → **Email Templates**
   - Find **Reset Password** template
   - Make sure it's enabled
   - Verify it contains: `{{ .ConfirmationURL }}` or `{{ .ConfirmationLink }}`

4. **Verify Site URL:**
   - Go to **Settings** → **Auth**
   - Check **Site URL** is set to: `https://www.givea.shop` or `https://givea.shop`
   - This should match your production domain

5. **Check SMTP Configuration (if using custom SMTP):**
   - Go to **Settings** → **Auth** → **SMTP Settings**
   - Verify all SMTP credentials are correct
   - Test the SMTP connection
   - Make sure SMTP server allows emails from Supabase

6. **Check Email Rate Limits:**
   - Go to **Settings** → **Auth** → **Email**
   - Check if you've exceeded the email rate limit
   - Wait a few minutes if rate limited

### Issue: "Email rate limit exceeded"
**Solution:** Wait a few minutes before requesting another reset email

### Issue: "Invalid redirect URL"
**Solution:** Add the exact redirect URL to Supabase's allowed URLs list:
- `https://www.givea.shop/reset-password`
- `https://givea.shop/reset-password`
- Add both with and without trailing slashes

### Issue: "Email not configured"
**Solution:** 
- Enable email service in Supabase Dashboard → Settings → Auth
- Configure SMTP if using custom email service
- Verify email templates are enabled

### Issue: "Email in spam folder"
**Solution:** 
- Mark as "Not Spam"
- Add Supabase email to contacts
- Check email filters

## Step 8: Alternative - Use Custom SMTP

If Supabase's default email service isn't working:

1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Configure your own SMTP server (Gmail, SendGrid, etc.)
3. Test the connection
4. Save settings

## Debugging Tips

1. **Check Browser Console**: Look for any errors when submitting the form
2. **Check Supabase Logs**: Dashboard → Logs → Auth Logs
3. **Verify Email Address**: Make sure the email exists in your Supabase users table
4. **Test with Different Email**: Try with a different email provider
5. **Check Network Tab**: Verify the API call is successful

## Quick Checklist

- [ ] Redirect URL added to Supabase allowed URLs
- [ ] Email templates enabled in Supabase
- [ ] Email service enabled in Supabase
- [ ] Checked spam/junk folder
- [ ] Verified email address is correct
- [ ] Checked Supabase auth logs for errors
- [ ] Not exceeded email rate limits
- [ ] Site URL configured correctly in Supabase

## Need More Help?

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Email Configuration](https://supabase.com/docs/guides/auth/auth-email)
- [Supabase Support](https://supabase.com/support)

