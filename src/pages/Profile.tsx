import { useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Clock,
  Megaphone,
  ChevronRight,
  User as UserIcon,
  Camera
} from 'lucide-react';
import SeedBalance from '../components/seeds/SeedBalance';

interface Profile {
  username: string;
  full_name: string;
  avatar_url: string;
  biography: string;
  tagline: string;
  role: 'DONOR' | 'BENEFICIARY' | 'MANAGER';
  city: string;
  visibility: boolean;
  connect_id?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  donation_count?: number;
  adoption_count?: number;
  seed_balance?: number;
}

export default function Profile() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const storeUser = useStore((state) => state.user);
  const isLoading = useStore((state) => state.isLoading);
  const seedsEmptyMessage = t(
    'seeds.zeroMessage',
    "You've used all your seeds. Give something to earn more and keep growing!"
  );
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const setStoreProfile = useStore((state) => state.setProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    email: ''
  });

  // Check store user authentication first (wait for auth initialization)
  useEffect(() => {
    // Don't redirect while auth is still initializing
    if (isLoading) {
      return;
    }
    
    if (!storeUser) {
      navigate('/login');
      return;
    }
  }, [storeUser, isLoading, navigate]);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        // Redirect to login if user is not authenticated
        navigate('/login');
        return;
      }

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // Calculate donation count from announcements
        const { data: donations, error: donationsError } = await supabase
          .from('announcements')
          .select('id, status')
          .eq('user_id', user.id)
          .in('status', ['COMPLETED', 'GIVEN_AWAY']);

        if (donationsError) {
          console.error('Error fetching donations:', donationsError);
        }

        // Calculate adoption count from messages where user received items
        // (messages where user is receiver and announcement status is COMPLETED or GIVEN_AWAY)
        let adoptionCount = 0;
        try {
          const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select('announcement_id')
            .eq('receiver_id', user.id)
            .not('announcement_id', 'is', null);

          if (!messagesError && messages && messages.length > 0) {
            // Get unique announcement IDs
            const announcementIds = [...new Set(messages.map(m => m.announcement_id).filter(Boolean))];
            
            if (announcementIds.length > 0) {
              const { data: completedAnnouncements } = await supabase
                .from('announcements')
                .select('id')
                .in('id', announcementIds)
                .in('status', ['COMPLETED', 'GIVEN_AWAY']);
              
              adoptionCount = completedAnnouncements?.length || 0;
            }
          }
        } catch (adoptionError) {
          console.error('Error calculating adoption count:', adoptionError);
        }
        
        const profileData = {
          ...data,
          connect_id: user.id,
          // Use Gmail image if no custom avatar and user has Google provider
          avatar_url: data.avatar_url || getGmailImageUrl(user) || data.avatar_url,
          // Update counts from actual data
          donation_count: donations?.length || 0,
          adoption_count: adoptionCount
        };
        
        setProfile(profileData);
        
        // Update the store with profile data
        setStoreProfile(profileData);
        
        // Populate form data
        setFormData({
          full_name: data?.full_name || '',
          date_of_birth: data?.date_of_birth || '',
          gender: data?.gender || '',
          email: user.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    if (!user || !profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name.trim(),
          date_of_birth: formData.date_of_birth,
          gender: formData.gender
        })
        .eq('id', user.id);

      if (error) throw error;
      
      await getProfile(); // Refresh profile data
      
      // Update the store with the new profile data
      const updatedProfile = {
        ...profile,
        full_name: formData.full_name.trim(),
        date_of_birth: formData.date_of_birth,
        gender: formData.gender
      };
      setStoreProfile(updatedProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getGmailImageUrl = (user: User) => {
    // Check if user has Google provider data
    const providerData = user.app_metadata?.providers || [];
    if (providerData.includes('google') && user.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    return null;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(t('profile.errors.invalidFileType'));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('profile.errors.fileSizeTooLarge'));
      return;
    }

    setUploading(true);
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Refresh profile data
      await getProfile();
      
      // Update the store with the new avatar URL
      if (profile) {
        const updatedProfile = {
          ...profile,
          avatar_url: data.publicUrl
        };
        setStoreProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error details:', {
        message: (error as any)?.message,
        details: (error as any)?.details,
        hint: (error as any)?.hint,
        code: (error as any)?.code
      });
      alert(`${t('profile.errors.uploadFailed')}: ${(error as any)?.message || t('profile.errors.tryAgain')}`);
    } finally {
      setUploading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Show loading while checking authentication or while auth is initializing
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect if not authenticated (this will be handled by useEffect, but add safety check)
  if (!storeUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('profile.signInRequired')}
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('profile.goToLogin')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="space-y-6">
              <SeedBalance
                balance={profile?.seed_balance}
                variant="card"
                showLabel
                label={t('seeds.label', 'Seeds')}
                showEmptyMessage
                emptyMessage={seedsEmptyMessage}
              />

              {/* Membership Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm break-words">{t('profile.memberSince')} {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : t('profile.unknown')}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                  <Megaphone className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm break-words">{t('profile.donationCount', { count: profile?.donation_count || 0 })}, {t('profile.adoptionCount', { count: profile?.adoption_count || 0 })}</span>
                </div>
              </div>


              {/* Reviews Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('profile.reviews')}</h3>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t('profile.noReviews')}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer">
                  {t('profile.seeAll')} <ChevronRight className="inline w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md mx-auto lg:mx-0">
              {/* Header */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('profile.title')}</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('profile.subtitle')}
                </p>
              </div>

              {/* Profile Picture */}
              <div className="mb-6 sm:mb-8">
                <div className="relative inline-block">
                  <div 
                    className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleImageClick}
                  >
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={t('profile.profilePicture')} 
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : getGmailImageUrl(user!) ? (
                      <img 
                        src={getGmailImageUrl(user!)!} 
                        alt={t('profile.profilePicture')} 
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Camera className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('profile.clickToChangePicture')}
                </p>
              </div>

              {/* Profile Form */}
              <div className="space-y-4 sm:space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.fullName')}
                  </label>
                  <input
                    type="text"
                    value={formData.full_name ?? ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder={t('profile.enterFullName')}
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.dateOfBirth')}
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={(formData.date_of_birth || '').split('/')[0] || ''}
                      onChange={(e) => {
                        const parts = (formData.date_of_birth || '').split('/');
                        handleInputChange('date_of_birth', `${e.target.value}/${parts[1] || ''}/${parts[2] || ''}`);
                      }}
                      className="flex-1 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="">{t('profile.day')}</option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      value={(formData.date_of_birth || '').split('/')[1] || ''}
                      onChange={(e) => {
                        const parts = (formData.date_of_birth || '').split('/');
                        handleInputChange('date_of_birth', `${parts[0] || ''}/${e.target.value}/${parts[2] || ''}`);
                      }}
                      className="flex-1 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="">{t('profile.month')}</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      value={(formData.date_of_birth || '').split('/')[2] || ''}
                      onChange={(e) => {
                        const parts = (formData.date_of_birth || '').split('/');
                        handleInputChange('date_of_birth', `${parts[0] || ''}/${parts[1] || ''}/${e.target.value}`);
                      }}
                      className="flex-1 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="">{t('profile.year')}</option>
                      {Array.from({ length: 100 }, (_, i) => (
                        <option key={2024 - i} value={String(2024 - i)}>
                          {2024 - i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.gender')}
                  </label>
                  <select
                    value={formData.gender ?? ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value="">{t('profile.selectGender')}</option>
                    <option value="male">{t('profile.genderMale')}</option>
                    <option value="female">{t('profile.genderFemale')}</option>
                    <option value="other">{t('profile.genderOther')}</option>
                  </select>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.emailAddress')}
                  </label>
                  <input
                    type="email"
                    value={formData.email ?? ''}
                    disabled
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                    placeholder={t('profile.emailAddress')}
                  />
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  {saving ? t('profile.saving') : t('profile.saveChanges')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}