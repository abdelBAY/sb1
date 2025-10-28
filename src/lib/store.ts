import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { persist } from 'zustand/middleware';

interface Profile {
  id?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  biography?: string;
  role?: 'DONOR' | 'BENEFICIARY' | 'MANAGER';
  city?: string;
  visibility?: boolean;
  date_of_birth?: string;
  gender?: string;
  connect_id?: string;
  first_name?: string;
  last_name?: string;
  donation_count?: number;
  adoption_count?: number;
  tagline?: string;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  isDarkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
  unreadMessagesCount: number;
  setUnreadMessagesCount: (count: number) => void;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      profile: null,
      setProfile: (profile) => set({ profile }),
      isLoading: true,
      setIsLoading: (isLoading) => set({ isLoading }),
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      isDarkMode: false,
      setDarkMode: (isDark) => 
        set(() => {
          document.documentElement.classList.toggle('dark', isDark);
          return { isDarkMode: isDark };
        }),
      unreadMessagesCount: 0,
      setUnreadMessagesCount: (count) => set({ unreadMessagesCount: count }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);