import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  ChevronRight, 
  Settings, 
  HelpCircle, 
  Menu,
  X,
  LayoutDashboard,
  User,
  Bell
} from 'lucide-react';
import { useStore } from '../lib/store';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showResources, setShowResources] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const user = useStore((state) => state.user);
  const profile = useStore((state) => state.profile);
  const setUser = useStore((state) => state.setUser);
  const setProfile = useStore((state) => state.setProfile);
  const setDarkMode = useStore((state) => state.setDarkMode);
  const unreadMessagesCount = useStore((state) => state.unreadMessagesCount);
  const setUnreadMessagesCount = useStore((state) => state.setUnreadMessagesCount);
  const navigate = useNavigate();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setShowSettings(false);
        setShowResources(false);
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
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth error:', error);
        } else {
          console.log('Current user:', user ? 'Authenticated' : 'Not authenticated');
        }
        
        setUser(user);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'User authenticated' : 'User not authenticated');
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser]);

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

  const handleSignOut = async () => {
    const confirmed = window.confirm('Are you sure you want to sign out?');
    if (confirmed) {
      try {
        await supabase.auth.signOut();
        setUser(null);
        navigate('/');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };


  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
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
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Logo size="md" />
                <span className="text-xl font-bold text-orange-600 dark:text-orange">Givea</span>
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
                  {/* Profile Display */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {profile?.full_name || profile?.username || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                    </span>
                    
                    {/* Message Notification Icon */}
                    <div className="relative">
                      <button
                        onClick={() => navigate('/messages')}
                        className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                      >
                        <Bell className="w-5 h-5" />
                        {unreadMessagesCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                            {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="w-10 h-10 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {getInitials(user.email || '')}
                        </span>
                      )}
                    </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 transform transition-all duration-200 ease-out scale-100 opacity-100 z-50">
                      <div className="p-2">
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
                            <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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

                        <button
                          onClick={() => setShowSettings(!showSettings)}
                          className="w-full px-3 py-2 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-2">
                            <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span>Settings</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>

                        <button
                          onClick={() => setShowResources(!showResources)}
                          className="w-full px-3 py-2 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-2">
                            <HelpCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span>Resources</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
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
                {/* Mobile Profile Display */}
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
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
                  <span>Messages</span>
                  {unreadMessagesCount > 0 && (
                    <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full">
                      {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </span>
                  )}
                </Link>
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
    </div>
  );
}