# Supabase CAPTCHA Configuration Guide

## Problem: "captcha verification process failed" Error

If you're getting this error when trying to reset passwords, it means Supabase is expecting CAPTCHA verification but either:
1. CAPTCHA is not properly configured in Supabase Dashboard
2. The CAPTCHA provider doesn't match (e.g., Supabase expects hCaptcha but you're using Turnstile)
3. CAPTCHA is enabled but not properly set up

## Solution 1: Disable CAPTCHA in Supabase (Recommended for Testing)

If you want to disable CAPTCHA protection temporarily or permanently:

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **Authentication**
4. Scroll down to **Bot and Abuse Protection** section
5. Find **Enable CAPTCHA protection** toggle
6. **Turn it OFF** to disable CAPTCHA
7. Save the changes

**Note:** After disabling CAPTCHA, you should also remove the `captchaToken` from your code or make it optional.

## Solution 2: Configure Cloudflare Turnstile in Supabase

If you want to keep CAPTCHA enabled and use Cloudflare Turnstile:

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **Authentication**
4. Scroll down to **Bot and Abuse Protection** section
5. Enable **Enable CAPTCHA protection**
6. Select **Cloudflare Turnstile** as the provider
7. Enter your Turnstile **Site Key**: `0x4AAAAAAB92OMKRH-HWakZ7`
8. Enter your Turnstile **Secret Key** (get this from Cloudflare Dashboard)
9. Save the changes

### Getting Your Turnstile Secret Key:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Turnstile** section
3. Find your site key `0x4AAAAAAB92OMKRH-HWakZ7`
4. Copy the **Secret Key** associated with it
5. Paste it in Supabase settings

## Solution 3: Switch to hCaptcha (Alternative)

If Turnstile is causing issues, you can switch to hCaptcha:

1. Sign up for [hCaptcha](https://www.hcaptcha.com/)
2. Create a site and get your Site Key and Secret Key
3. In Supabase Dashboard → **Settings** → **Authentication** → **Bot and Abuse Protection**
4. Select **hCaptcha** as the provider
5. Enter your hCaptcha Site Key and Secret Key
6. Update your code to use hCaptcha instead of Turnstile

## Solution 4: Make CAPTCHA Optional in Code

If you want to support both environments (with and without CAPTCHA):

Update your code to handle cases where CAPTCHA might not be required:

```typescript
const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
  redirectTo: redirectUrl,
  ...(captchaToken && { captchaToken }), // Only include if token exists
});
```

## Verification Steps

After making changes:

1. **Clear browser cache** and cookies
2. **Wait 1-2 minutes** for Supabase settings to propagate
3. **Test the password reset flow** again
4. **Check Supabase Logs** → **Auth Logs** for any errors

## Common Issues

### Issue: "CAPTCHA token is invalid"
- **Solution:** Make sure the Site Key in your code matches the one in Supabase Dashboard
- **Solution:** Verify the Secret Key is correct in Supabase

### Issue: "CAPTCHA verification process failed"
- **Solution:** Disable CAPTCHA in Supabase (Solution 1) if you don't need it
- **Solution:** Ensure Turnstile is properly configured in Supabase (Solution 2)
- **Solution:** Check that your Turnstile site key is active and not expired

### Issue: CAPTCHA works locally but not in production
- **Solution:** Make sure production environment variables are set correctly
- **Solution:** Verify the production site key is different from the test key
- **Solution:** Check that Supabase settings are the same for both environments

## Quick Checklist

- [ ] CAPTCHA is either disabled OR properly configured in Supabase
- [ ] If using Turnstile, both Site Key and Secret Key are set in Supabase
- [ ] Site Key in code matches the one in Supabase Dashboard
- [ ] Secret Key is correctly entered in Supabase (not visible in code)
- [ ] Changes have been saved in Supabase Dashboard
- [ ] Waited 1-2 minutes for settings to propagate
- [ ] Tested the password reset flow
- [ ] Checked Supabase Auth Logs for errors

## Need More Help?

- [Supabase CAPTCHA Documentation](https://supabase.com/docs/guides/auth/auth-captcha)
- [Cloudflare Turnstile Documentation](https://developers.cloudflare.com/turnstile/)
- [Supabase Support](https://supabase.com/support)

