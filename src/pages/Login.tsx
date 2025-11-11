import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import { LogIn, X, Mail } from 'lucide-react';
import Turnstile from 'react-turnstile';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  // 🧠 Detect if we are running locally
  const isLocal = window.location.hostname === 'localhost';

  // 🧩 Use test sitekey locally, real one in production
  const siteKey = isLocal
    ? '1x00000000000000000000AA' // ✅ Cloudflare always-pass test key
    : '0x4AAAAAAB92OMKRH-HWakZ7'; // your real site key

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ⚙️ Skip CAPTCHA locally (simulate token)
    const tokenToUse = isLocal ? 'test_token_local_skip' : captchaToken;

    if (!tokenToUse) {
      setError(t('login.errors.captchaRequired'));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: tokenToUse, // 🧩 send the token (real or fake)
        },
      });

      if (error) throw error;

      setUser(data.user);
      navigate('/search');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : t('login.errors.signInError')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);
    setResetSuccess(false);

    if (!resetEmail) {
      setResetError(t('login.errors.emailRequired'));
      setResetLoading(false);
      return;
    }

    try {
      // Use the current origin for redirect URL
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      console.log('Sending password reset email to:', resetEmail);
      console.log('Redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl,
        emailRedirectTo: redirectUrl,
      });

      if (error) {
        console.error('Password reset error:', error);
        // Provide more helpful error messages
        if (error.message.includes('rate limit')) {
          setResetError('Too many requests. Please wait a few minutes before trying again.');
        } else if (error.message.includes('email')) {
          setResetError('Invalid email address. Please check and try again.');
        } else {
          setResetError(error.message || t('login.errors.resetError'));
        }
        return;
      }

      console.log('Password reset email sent successfully');
      setResetSuccess(true);
      setResetEmail('');
    } catch (error) {
      console.error('Unexpected error during password reset:', error);
      setResetError(
        error instanceof Error
          ? error.message
          : t('login.errors.resetError')
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <div className="mx-auto flex justify-center">
            <LogIn className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('login.title')}
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('login.subtitle')}{' '}
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('login.createAccount')}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('login.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm"
                placeholder={t('login.emailPlaceholder')}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('login.password')}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t('login.forgotPassword')}
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm"
                placeholder={t('login.passwordPlaceholder')}
              />
            </div>
          </div>

          {/* 🧠 Hide Turnstile widget when local */}
          {!isLocal && (
            <div className="mt-4 flex justify-center">
              <Turnstile
                sitekey={siteKey}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || (!captchaToken && !isLocal)}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </span>
              ) : null}
              {loading ? t('login.signingIn') : t('login.signIn')}
            </button>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetEmail('');
                setResetError(null);
                setResetSuccess(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>

            {!resetSuccess ? (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                  {t('login.forgotPasswordTitle')}
                </h2>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
                  {t('login.forgotPasswordDescription')}
                </p>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {resetError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
                      {resetError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('login.email')}
                    </label>
                    <input
                      id="resetEmail"
                      name="resetEmail"
                      type="email"
                      autoComplete="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm"
                      placeholder={t('login.emailPlaceholder')}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmail('');
                        setResetError(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      {t('login.backToLogin')}
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {resetLoading ? t('login.sendingResetLink') : t('login.sendResetLink')}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('login.resetLinkSent')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t('login.resetLinkSentMessage')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-6 italic">
                  {t('login.checkSpamFolder')}
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setResetError(null);
                    setResetSuccess(false);
                  }}
                  className="w-full px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {t('login.backToLogin')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
