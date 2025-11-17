import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Calendar,
  Star,
  Package,
  User,
  ArrowLeft,
  Grid,
  List,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import OptimizedImage from '../components/OptimizedImage';

interface DonorProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  biography: string | null;
  city: string | null;
  role: string;
  created_at: string;
}

interface DonorItem {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  location: string;
  photos: string[];
  status: string;
  created_at: string;
}

export default function DonorProfile() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [donorProfile, setDonorProfile] = useState<DonorProfile | null>(null);
  const [items, setItems] = useState<DonorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (id) {
      loadDonorProfile();
    }
  }, [id]);

  const loadDonorProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch donor profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, biography, city, role, created_at')
        .eq('id', id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) {
        setError(t('donorProfile.errors.notFound', 'Donor profile not found'));
        return;
      }

      setDonorProfile(profile);

      // Fetch donor's items/announcements
      const { data: announcements, error: announcementsError } = await supabase
        .from('announcements')
        .select('id, title, description, category, condition, location, photos, status, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (announcementsError) throw announcementsError;
      setItems(announcements || []);

      // Fetch reviews and calculate rating
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewed_id', id);

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
      } else if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        setRating(avgRating);
        setReviewCount(reviews.length);
      }
    } catch (error) {
      console.error('Error loading donor profile:', error);
      setError(error instanceof Error ? error.message : t('donorProfile.errors.loadData', 'Error loading donor profile'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryTranslation = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Furniture': 'furniture',
      'Electronics': 'electronics',
      'Clothing': 'clothing',
      'Books': 'books',
      'Kitchen': 'kitchen',
      'Sports': 'sports',
      'Toys': 'toys',
      'Tools': 'tools',
      'Other': 'other'
    };
    return t(`search.categories.${categoryMap[category] || 'other'}`, category);
  };

  const getStatusTranslation = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'pending',
      'CLAIMED': 'claimed',
      'COMPLETED': 'completed',
      'GIVEN_AWAY': 'givenAway'
    };
    return t(`search.status.${statusMap[status] || status.toLowerCase()}`, status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error || !donorProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('donorProfile.errors.notFound', 'Donor Not Found')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || t('donorProfile.errors.notFoundDesc', 'The donor profile you are looking for does not exist.')}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('donorProfile.goBack', 'Go Back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('donorProfile.goBack', 'Go Back')}</span>
        </button>

        {/* Donor Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {donorProfile.avatar_url ? (
                <OptimizedImage
                  src={donorProfile.avatar_url}
                  alt={donorProfile.full_name || 'Donor'}
                  className="w-24 h-24 rounded-full ring-4 ring-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.6)]"
                  width={96}
                  height={96}
                  priority={false}
                  placeholder="blur"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-4 ring-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                  <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {donorProfile.full_name || t('donorProfile.anonymousDonor', 'Anonymous Donor')}
                  </h1>
                  {donorProfile.city && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{donorProfile.city}</span>
                    </div>
                  )}
                  {rating > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.round(rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {rating.toFixed(1)} ({reviewCount} {t('donorProfile.reviews', 'reviews')})
                      </span>
                    </div>
                  )}
                  {donorProfile.biography && (
                    <p className="text-gray-600 dark:text-gray-400 mt-3">
                      {donorProfile.biography}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('donorProfile.items', 'Items')} ({items.length})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-blue-600 dark:bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-blue-600 dark:bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('donorProfile.noItems', 'No Items Yet')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('donorProfile.noItemsDesc', 'This donor has not posted any items yet.')}
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-video'}`}>
                  {item.photos && item.photos[0] ? (
                    <img
                      src={item.photos[0]}
                      alt={item.title}
                      loading="lazy"
                      className={`w-full h-full object-cover transition-transform duration-200 hover:scale-105 ${
                        item.status === 'GIVEN_AWAY' ? 'blur-md' : ''
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1">
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                      {getCategoryTranslation(item.category)}
                    </span>
                  </div>

                  {item.description && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-4 space-y-2">
                    {item.location && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {item.location}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(item.created_at)}
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'PENDING' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                          : item.status === 'CLAIMED'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}>
                        {getStatusTranslation(item.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

