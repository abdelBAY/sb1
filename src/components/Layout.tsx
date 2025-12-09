import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  ChevronRight, 
  HelpCircle, 
  Menu,
  X,
  LayoutDashboard,
  User,
  BellRing,
  Home
} from 'lucide-react';
import { useStore } from '../lib/store';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';
import LogoutModal from './LogoutModal';
import { useTranslation } from 'react-i18next';
import SeedBalance from './seeds/SeedBalance';
import OptimizedImage from './OptimizedImage';
import chatIcon from '../assets/chat.png';

interface ReviewNotificationItem {
  id: string;
  message: string | null;
  read: boolean;
  created_at: string;
  reviewer_id: string;
  review_id: string;
  reviewer?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-10ZN0CT4KV';

export default function Layout() {
  const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [isReviewDropdownOpen, setIsReviewDropdownOpen] = React.useState(false);
  const [isReviewNotificationLoading, setIsReviewNotificationLoading] = React.useState(false);
  const [reviewNotifications, setReviewNotifications] = React.useState<ReviewNotificationItem[]>([]);
  const user = useStore((state) => state.user);
  const profile = useStore((state) => state.profile);
  const setUser = useStore((state) => state.setUser);
  const setProfile = useStore((state) => state.setProfile);
  const setDarkMode = useStore((state) => state.setDarkMode);
  const setIsLoading = useStore((state) => state.setIsLoading);
  const unreadMessagesCount = useStore((state) => state.unreadMessagesCount);
  const setUnreadMessagesCount = useStore((state) => state.setUnreadMessagesCount);
  const navigate = useNavigate();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const reviewDropdownRef = React.useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');
  const location = useLocation();
  const unreadReviewNotifications = React.useMemo(
    () => reviewNotifications.filter((notification) => !notification.read).length,
    [reviewNotifications]
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (reviewDropdownRef.current && !reviewDropdownRef.current.contains(event.target as Node)) {
        setIsReviewDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setDarkMode]);

  // Initialize authentication
  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication...');
        // Set loading to true initially
        setIsLoading(true);
        
        // First check if there's a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          // Only log non-session-missing errors
          if (sessionError.message && !sessionError.message.includes('session missing')) {
            console.error('Auth session error:', sessionError);
          }
          setUser(null);
        } else if (session?.user) {
          console.log('Current user: Authenticated');
          setUser(session.user);
        } else {
          console.log('Current user: Not authenticated');
          setUser(null);
        }
      } catch (error: any) {
        // Only log errors that aren't about missing sessions
        if (error?.message && !error.message.includes('session missing') && !error.message.includes('Auth session missing')) {
          console.error('Error initializing auth:', error);
        }
        setUser(null);
      } finally {
        // Set loading to false after auth initialization completes
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'User authenticated' : 'User not authenticated');
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if profile exists for OAuth users
          const { data: profile, error: _profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();

          // If profile doesn't exist, create one (for OAuth users)
          if (!profile) {
            const userMetadata = session.user.user_metadata || {};
            const fullName = userMetadata.full_name || userMetadata.name || 
                           userMetadata.email?.split('@')[0] || 'User';
            const email = session.user.email || '';
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: session.user.id,
                  username: email.split('@')[0] || 'user',
                  full_name: fullName,
                  role: userMetadata.role || 'DONOR',
                  biography: '',
                  city: '',
                  visibility: true,
                  avatar_url: userMetadata.avatar_url || 
                            userMetadata.picture || 
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
                },
              ]);

            if (insertError) {
              console.error('Error creating profile for OAuth user:', insertError);
            } else {
              console.log('Profile created for OAuth user');
            }
          }
        }
        
        setUser(session?.user ?? null);
        // Ensure loading is set to false when auth state changes after initial load
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setIsLoading]);

  React.useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      return;
    }

    if (typeof window.gtag !== 'function') {
      if (import.meta.env.DEV) {
        console.debug('Google Analytics has not been initialized yet.');
      }
      return;
    }

    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: `${location.pathname}${location.search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);

  // Fetch profile data when user changes
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (!error && data) {
            setProfile(data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      } else {
        setProfile(null);
      }
    };

    fetchProfile();
  }, [user]);

  React.useEffect(() => {
    if (!user?.id) {
      return;
    }

    const channel = supabase
      .channel(`profile-seeds-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new) {
            setProfile(payload.new as any);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, setProfile]);

  // Fetch unread messages count when user changes
  React.useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('id')
            .eq('receiver_id', user.id)
            .eq('read', false);
          
          if (!error && data) {
            setUnreadMessagesCount(data.length);
          }
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      } else {
        setUnreadMessagesCount(0);
      }
    };

    fetchUnreadCount();

    // Set up real-time subscription for unread messages
    if (user?.id) {
      const subscription = supabase
        .channel('unread-messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`,
          },
          () => {
            fetchUnreadCount();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, setUnreadMessagesCount]);

  const handleSignOut = () => {
    setShowLogoutModal(true);
  };

  const fetchReviewNotifications = React.useCallback(async () => {
    if (!user?.id) {
      setReviewNotifications([]);
      return;
    }

    setIsReviewNotificationLoading(true);
    try {
      const { data, error } = await supabase
        .from('review_notifications')
        .select(`
          id,
          read,
          message,
          created_at,
          reviewer_id,
          review_id,
          reviewer:profiles!reviewer_id (
            full_name,
            avatar_url
          )
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      const normalizedData = (data || []).map((notification: any) => ({
        ...notification,
        reviewer: Array.isArray(notification.reviewer)
          ? notification.reviewer[0] || null
          : notification.reviewer
      }));

      setReviewNotifications(normalizedData as ReviewNotificationItem[]);
    } catch (notificationError) {
      console.error('Error fetching review notifications:', notificationError);
    } finally {
      setIsReviewNotificationLoading(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    if (!user?.id) {
      setReviewNotifications([]);
      setIsReviewDropdownOpen(false);
      return;
    }

    fetchReviewNotifications();

    const channel = supabase
      .channel(`review-notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'review_notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          fetchReviewNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchReviewNotifications]);

  const formatNotificationTimestamp = (value: string) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value));
    } catch {
      return value;
    }
  };

  const markReviewNotificationAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('review_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      setReviewNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error updating review notification:', error);
    }
  };

  const markAllReviewNotificationsAsRead = async () => {
    if (!user?.id || unreadReviewNotifications === 0) {
      return;
    }

    try {
      await supabase
        .from('review_notifications')
        .update({ read: true })
        .eq('recipient_id', user.id)
        .eq('read', false);

      setReviewNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
    } catch (error) {
      console.error('Error marking review notifications as read:', error);
    }
  };

  const handleReviewNotificationClick = async (notification: ReviewNotificationItem) => {
    if (!user?.id) {
      return;
    }

    if (!notification.read) {
      await markReviewNotificationAsRead(notification.id);
    }

    setIsReviewDropdownOpen(false);
    navigate(`/donor/${user.id}`);
  };

  const handleConfirmLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setShowLogoutModal(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getAccountType = () => {
    if (!user) return 'account';
    const providers = user.app_metadata?.providers || [];
    if (providers.includes('google')) return 'Google';
    if (providers.includes('github')) return 'GitHub';
    if (providers.includes('facebook')) return 'Facebook';
    if (user.email) return 'email';
    return 'account';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-blue-100 dark:border-gray-700 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link to="/search" className="flex items-center space-x-2">
                <Logo size="md" />
                <span className="text-xl font-bold text-orange-600 dark:text-orange">Givea</span>
              </Link>
              <Link
                to="/"
                className="flex items-center space-x-1.5 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <LanguageSelector 
                isOpen={isLanguageOpen}
                onToggle={() => setIsLanguageOpen(!isLanguageOpen)}
                onClose={() => setIsLanguageOpen(false)}
              />
              {user ? (
                <>
                  <SeedBalance
                    balance={profile?.seed_balance}
                    size="sm"
                    variant="nav"
                    showLabel={false}
                    className="hidden lg:flex"
                    onClick={() => navigate('/seeds-info')}
                  />
                  {/* Donate Now Button */}
                  <Link
                    to="/create-item"
                    className="inline-flex items-center justify-center gap-3 px-5 py-2.5 text-white font-semibold uppercase tracking-wide rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-500 hover:via-orange-600 hover:to-orange-700"
                  >
                    <span>DONATE NOW</span>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                  
                  {/* Message Notification Icon */}
                  <div className="relative">
                    <button
                      onClick={() => navigate('/messages')}
                      className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                    >
                      <img src={chatIcon} alt="Messages" className="w-5 h-5" />
                      {unreadMessagesCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                          {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                        </span>
                      )}
                    </button>
                  </div>
                  
                  {/* Review Notifications */}
                  <div className="relative" ref={reviewDropdownRef}>
                    <button
                      onClick={() => setIsReviewDropdownOpen((prev) => !prev)}
                      className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                    >
                      <BellRing className="w-5 h-5" />
                      {unreadReviewNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full">
                          {unreadReviewNotifications > 9 ? '9+' : unreadReviewNotifications}
                        </span>
                      )}
                    </button>

                    {isReviewDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-40">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {t('notifications.reviews.title')}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t('notifications.reviews.subtitle')}
                            </p>
                          </div>
                          <button
                            onClick={markAllReviewNotificationsAsRead}
                            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                            disabled={unreadReviewNotifications === 0}
                          >
                            {t('notifications.reviews.markAll')}
                          </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                          {isReviewNotificationLoading ? (
                            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                              {t('notifications.reviews.loading')}
                            </div>
                          ) : reviewNotifications.length === 0 ? (
                            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                              {t('notifications.reviews.empty')}
                            </div>
                          ) : (
                            reviewNotifications.map((notification) => {
                              const reviewerName =
                                notification.reviewer?.full_name || t('productDetail.anonymousUser');
                              const message =
                                notification.message ||
                                t('notifications.reviews.newReview', { name: reviewerName });

                              return (
                                <button
                                  key={notification.id}
                                  onClick={() => handleReviewNotificationClick(notification)}
                                  className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                    notification.read ? 'opacity-80' : ''
                                  }`}
                                >
                                  <div className="flex-shrink-0">
                                    {notification.reviewer?.avatar_url ? (
                                      <img
                                        src={notification.reviewer.avatar_url}
                                        alt={reviewerName || 'Reviewer'}
                                        className="w-10 h-10 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {message}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {formatNotificationTimestamp(notification.created_at)}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-2"></span>
                                  )}
                                </button>
                              );
                            })
                          )}
                        </div>
                        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                          <button
                            onClick={() => {
                              markAllReviewNotificationsAsRead();
                              setIsReviewDropdownOpen(false);
                              if (user?.id) {
                                navigate(`/donor/${user.id}`);
                              }
                            }}
                            className="w-full text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                          >
                            {t('notifications.reviews.viewAll')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-600 ring-4 ring-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                        {profile?.avatar_url ? (
                          <OptimizedImage
                            src={profile.avatar_url}
                            alt="Profile"
                            className="w-full h-full"
                            width={36}
                            height={36}
                            priority={true}
                            placeholder="blur"
                          />
                        ) : user.user_metadata?.avatar_url ? (
                          <OptimizedImage
                            src={user.user_metadata.avatar_url}
                            alt="Profile"
                            className="w-full h-full"
                            width={36}
                            height={36}
                            priority={true}
                            placeholder="blur"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[140px] truncate">
                        {profile?.full_name || profile?.username || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 transform transition-all duration-200 ease-out scale-100 opacity-100 z-50">
                      <div className="p-2 space-y-2">
                        <Link
                          to="/profile"
                          className="w-full px-3 py-2 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span>{t('navigation.profile')}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </Link>

                        <Link
                          to="/dashboard"
                          className="w-full px-3 py-2 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <LayoutDashboard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span>{t('navigation.dashboard')}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </Link>

                        <Link
                          to="/messages"
                          className="w-full px-3 py-2 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <img src={chatIcon} alt="Messages" className="w-4 h-4" />
                            <span>Messages</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {unreadMessagesCount > 0 && (
                              <span className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </Link>

                        <Link
                          to="/resources"
                          className="w-full px-3 py-2 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <HelpCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span>Resources</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </Link>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full px-3 py-2 flex items-center space-x-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t('navigation.signOut')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    {t('navigation.signIn')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    {t('navigation.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 shadow-lg">
            <LanguageSelector 
              isOpen={isLanguageOpen}
              onToggle={() => setIsLanguageOpen(!isLanguageOpen)}
              onClose={() => {
                setIsLanguageOpen(false);
                setIsMobileMenuOpen(false);
              }}
              isMobile={true}
            />

            {user ? (
              <>
                {/* Donate Now Button for Mobile */}
                <div className="px-3 py-2">
                  <Link
                    to="/create-item"
                    className="inline-flex items-center justify-center gap-3 w-full px-5 py-3 text-white font-semibold uppercase tracking-wide rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-500 hover:via-orange-600 hover:to-orange-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>DONATE NOW</span>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                </div>
                
                {/* Mobile Profile Display */}
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden ring-4 ring-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                      {profile?.avatar_url ? (
                        <OptimizedImage
                          src={profile.avatar_url}
                          alt="Profile"
                          className="w-full h-full"
                          width={40}
                          height={40}
                          priority={false}
                          placeholder="blur"
                        />
                      ) : user.user_metadata?.avatar_url ? (
                        <OptimizedImage
                          src={user.user_metadata.avatar_url}
                          alt="Profile"
                          className="w-full h-full"
                          width={40}
                          height={40}
                          priority={false}
                          placeholder="blur"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {profile?.full_name || profile?.username || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('navigation.profile')}
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('navigation.dashboard')}
                </Link>
                <Link
                  to="/messages"
                  className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <img src={chatIcon} alt="Messages" className="w-4 h-4" />
                    <span>Messages</span>
                  </div>
                  {unreadMessagesCount > 0 && (
                    <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full">
                      {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => {
                    markAllReviewNotificationsAsRead();
                    setIsMobileMenuOpen(false);
                    if (user?.id) {
                      navigate(`/donor/${user.id}`);
                    }
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <BellRing className="w-4 h-4" />
                    <span>{t('notifications.reviews.title')}</span>
                  </div>
                  {unreadReviewNotifications > 0 && (
                    <span className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full">
                      {unreadReviewNotifications > 9 ? '9+' : unreadReviewNotifications}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                  {t('navigation.signOut')}
                </button>
              </>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('navigation.signIn')}
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('navigation.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-0">
        <Outlet />
      </main>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        accountType={getAccountType()}
      />
    </div>
  );
}