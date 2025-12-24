# Password Reset Error Troubleshooting

## Current Error: "Error sending recovery email" (500 Internal Server Error)

This error means Supabase cannot send the recovery email. Follow these steps **in order**:

## ✅ Step 1: Add Redirect URL to Supabase (MOST COMMON FIX)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. In the **Redirect URLs** section, click **Add URL**
5. Add these URLs (one at a time):
   - `https://www.givea.shop/reset-password`
   - `https://givea.shop/reset-password`
   - `https://www.givea.shop/reset-password/` (with trailing slash)
   - `https://givea.shop/reset-password/` (with trailing slash)
6. Click **Save**
7. **Wait 1-2 minutes** for changes to propagate
8. Try password reset again

## ✅ Step 2: Verify Site URL

1. Go to **Settings** → **Auth** in Supabase Dashboard
2. Check the **Site URL** field
3. It should be set to: `https://www.givea.shop` or `https://givea.shop`
4. If it's different, update it to match your production domain
5. Save changes

## ✅ Step 3: Check Email Service Status

1. Go to **Settings** → **Auth** → **Email** in Supabase Dashboard
2. Verify that email service is **enabled**
3. If you see "Email service disabled", enable it
4. Check **Email Rate Limits** - make sure you haven't exceeded the limit

## ✅ Step 4: Verify Email Template

1. Go to **Authentication** → **Email Templates** in Supabase Dashboard
2. Find the **Reset Password** template
3. Make sure it's **enabled**
4. Check that it contains one of these placeholders:
   - `{{ .ConfirmationURL }}`
   - `{{ .ConfirmationLink }}`
   - `{{ .SiteURL }}/reset-password?token={{ .Token }}`
5. If the template is missing or disabled, enable it or restore the default template

## ✅ Step 5: Configure SMTP (If Using Custom Email)

If you're using a custom SMTP server:

1. Go to **Settings** → **Auth** → **SMTP Settings** in Supabase Dashboard
2. Verify all SMTP credentials are correct:
   - SMTP Host
   - SMTP Port
   - SMTP User
   - SMTP Password
   - Sender email address
3. Click **Test Connection** to verify SMTP works
4. If test fails, check your SMTP provider settings

## ✅ Step 6: Check Supabase Logs

1. Go to **Logs** → **Auth Logs** in Supabase Dashboard
2. Filter by time when you tried to reset password
3. Look for error messages related to:
   - Email sending
   - Redirect URL validation
   - SMTP connection
4. The logs will show the exact error from Supabase

## ✅ Step 7: Disable CAPTCHA (If Still Having Issues)

If CAPTCHA is causing issues:

1. Go to **Settings** → **Authentication** → **Bot and Abuse Protection**
2. Turn OFF **Enable CAPTCHA protection**
3. Save changes
4. Wait 1-2 minutes
5. Try again

## Quick Checklist

Before trying password reset, verify:

- [ ] Redirect URL `https://www.givea.shop/reset-password` is in Supabase allowed URLs
- [ ] Site URL in Supabase matches your domain
- [ ] Email service is enabled in Supabase
- [ ] Email template is enabled and configured
- [ ] SMTP is configured (if using custom email)
- [ ] Not exceeded email rate limits
- [ ] Waited 1-2 minutes after making changes

## Still Not Working?

1. **Check Browser Console** - Look for the exact error message
2. **Check Network Tab** - See the full API response from Supabase
3. **Check Supabase Auth Logs** - See server-side errors
4. **Try with a different email** - Rule out email-specific issues
5. **Contact Supabase Support** - If all else fails

## Common Error Messages

| Error Message | Solution |
|--------------|----------|
| "Error sending recovery email" | Add redirect URL to allowed URLs (Step 1) |
| "Invalid redirect URL" | Add exact URL to Supabase allowed URLs |
| "Email rate limit exceeded" | Wait a few minutes before trying again |
| "CAPTCHA verification failed" | Disable CAPTCHA or configure it properly |
| "Email service disabled" | Enable email service in Supabase settings |

## Need More Help?

- See `SUPABASE_EMAIL_SETUP.md` for detailed email configuration
- See `SUPABASE_CAPTCHA_SETUP.md` for CAPTCHA configuration
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Support](https://supabase.com/support)

