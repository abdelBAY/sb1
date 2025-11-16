import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  MapPin, 
  Calendar,
  Star,
  Heart,
  Share2,
  MessageCircle,
  Package,
  AlertCircle,
  ZoomIn,
  Info,
  User,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import RequestModal from '../components/RequestModal';
import RequestStatus from '../components/RequestStatus';
import LocationMap from '../components/LocationMap';
import { useTranslation } from 'react-i18next';

interface ProductDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: 'LIKE_NEW' | 'GOOD' | 'WORN' | 'BROKEN';
  location: string;
  photos: string[];
  tags: string[];
  created_at: string;
  status: 'PENDING' | 'CLAIMED' | 'COMPLETED' | 'GIVEN_AWAY';
  pickup_instructions?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    rating: number;
    review_count: number;
  };
  reviews: {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles: {
      full_name: string | null;
      avatar_url: string | null;
    };
  }[] | null;
  related_items: {
    id: string;
    title: string;
    photos: string[];
    condition: string;
    status: string;
  }[];
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'accepted' | 'declined' | 'completed'>('none');
  const user = useStore((state) => state.user);
  const profile = useStore((state) => state.profile);
  const setStoreProfile = useStore((state) => state.setProfile);
  const seedsEmptyMessage = t(
    'seeds.zeroMessage',
    "You've used all your seeds. Give something to earn more and keep growing!"
  );

  const getStatusTranslation = (status: string) => {
    if (status === 'GIVEN_AWAY') {
      return t('productDetail.status.givenAway');
    }
    return t(`productDetail.status.${status.toLowerCase()}`);
  };

  const getConditionTranslation = (condition: string) => {
    const conditionMap: { [key: string]: string } = {
      'LIKE_NEW': 'likeNew',
      'GOOD': 'good',
      'WORN': 'worn',
      'BROKEN': 'broken'
    };
    return t(`productDetail.condition.${conditionMap[condition] || 'good'}`);
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
    return t(`search.categories.${categoryMap[category] || 'other'}`);
  };

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch announcement details
      const { data: announcement, error: announcementError } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (announcementError) throw announcementError;
      if (!announcement) {
        setError(t('productDetail.errors.notFound'));
        return;
      }

      // Fetch user profile with maybeSingle() to handle missing profiles
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', announcement.user_id)
        .maybeSingle();

      // Create default profile if none exists
      const profile = userProfile || {
        id: announcement.user_id,
        full_name: t('productDetail.anonymousUser'),
        avatar_url: null
      };

      // Fetch user reviews
      const { data: reviews = [], error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          profiles!reviewer_id (
            full_name,
            avatar_url
          )
        `)
        .eq('reviewed_id', announcement.user_id);

      if (reviewsError) throw reviewsError;

      // Calculate user rating safely
      const userRating = reviews && reviews.length > 0
        ? reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length
        : 0;

      // Fetch related items
      const { data: relatedItems = [], error: relatedError } = await supabase
        .from('announcements')
        .select('id, title, photos, condition, status')
        .eq('category', announcement.category)
        .neq('id', id)
        .limit(4);

      if (relatedError) throw relatedError;

      // Combine all data
      const productData: ProductDetails = {
        ...announcement,
        user: {
          ...profile,
          rating: userRating,
          review_count: reviews?.length || 0
        },
        reviews,
        related_items: relatedItems
      };

      setProduct(productData);

      // Check if item is in user's favorites
      if (user) {
        const { data: favorite } = await supabase
          .from('wishlists')
          .select('id')
          .eq('user_id', user.id)
          .eq('announcement_id', id)
          .maybeSingle();

        setIsFavorite(!!favorite);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Failed to load product details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) return;

    try {
      if (isFavorite) {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('announcement_id', id);
      } else {
        await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            announcement_id: id
          });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleImageClick = (index: number) => {
    if (index === selectedImage) {
      setIsZoomed(!isZoomed);
    } else {
      setSelectedImage(index);
      setIsZoomed(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const handleSendRequest = async (message: string) => {
    if (!user || !product) {
      console.error('Missing user or product:', { user: !!user, product: !!product });
      throw new Error('User or product information is missing');
    }

    // Check if user is trying to send request to themselves
    if (user.id === product.user.id) {
      console.error('User trying to send request to themselves');
      throw new Error('You cannot send a request to yourself');
    }

    try {
      console.log('Sending request:', {
        sender_id: user.id,
        receiver_id: product.user.id,
        content: message,
        announcement_id: product.id
      });

      // First, let's test if we can access the messages table
      const { error: testError } = await supabase
        .from('messages')
        .select('id')
        .limit(1);

      if (testError) {
        console.error('Cannot access messages table:', testError);
        throw new Error(`Cannot access messages table: ${testError.message}`);
      }

      console.log('Messages table accessible, proceeding with insert...');

      // Create a message to the donor
      const { data, error: messageError } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          receiver_id: product.user.id,
          content: message,
          created_at: new Date().toISOString(),
          read: false,
          announcement_id: product.id
        }])
        .select();

      if (messageError) {
        console.error('Database error:', messageError);
        if (
          messageError.message === 'INSUFFICIENT_SEEDS' ||
          messageError.details?.includes('You’ve used all your seeds')
        ) {
          throw new Error(seedsEmptyMessage);
        }
        throw new Error(`Database error: ${messageError.message}`);
      }

      console.log('Message sent successfully:', data);

      // Refresh profile to reflect new seed balance
      const { data: refreshedProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.warn('Failed to refresh profile after sending request:', profileError);
      } else if (refreshedProfile) {
        setStoreProfile(refreshedProfile);
      }

      // Update request status
      setRequestStatus('pending');
      
      // Navigate to messages page
      navigate('/messages');
    } catch (error) {
      console.error('Error sending request:', error);
      const rawMessage =
        (error as any)?.message ||
        (error as any)?.details ||
        'Failed to send request';

      if (
        typeof rawMessage === 'string' &&
        (rawMessage.includes('INSUFFICIENT_SEEDS') ||
          rawMessage.includes('You’ve used all your seeds'))
      ) {
        throw new Error(seedsEmptyMessage);
      }

      throw error instanceof Error ? error : new Error('Failed to send request');
    }
  };

  const handleOpenChat = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!profile) {
      navigate('/register');
      return;
    }
    
    // Prevent chat if item is given away
    if (product?.status === 'GIVEN_AWAY') {
      alert(t('productDetail.errors.givenAwayAlert'));
      return;
    }
    
    navigate('/messages');
  };

  const handleRequestClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!profile) {
      navigate('/register');
      return;
    }
    
    // Prevent requests if item is given away
    if (product?.status === 'GIVEN_AWAY') {
      alert(t('productDetail.errors.givenAwayAlert'));
      return;
    }
    
    if ((profile?.seed_balance ?? 0) <= 0) {
      alert(seedsEmptyMessage);
      return;
    }

    setShowRequestModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3 text-red-600 dark:text-red-400 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">{t('productDetail.errors.loadingError')}</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            {t('productDetail.errors.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link 
                to="/"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {t('productDetail.breadcrumb.home')}
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <li>
              <Link 
                to="/search"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {t('productDetail.breadcrumb.search')}
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <li>
              <span className="text-gray-900 dark:text-white font-medium">
                {product.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div 
                className={`relative aspect-square rounded-lg overflow-hidden cursor-zoom-in ${
                  isZoomed ? 'cursor-zoom-out' : ''
                }`}
              >
                {product.photos && product.photos[selectedImage] ? (
                  <img
                    src={product.photos[selectedImage]}
                    alt={`${product.title} - Image ${selectedImage + 1}`}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-200 ${
                      isZoomed ? 'scale-150' : ''
                    } ${product.status === 'GIVEN_AWAY' ? 'blur-md' : ''}`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                <button
                  className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white shadow-lg hover:bg-white/20 transition-colors"
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnail Grid */}
              {product.photos && product.photos.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageClick(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? 'border-blue-600 dark:border-blue-400'
                          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`${product.title} - Thumbnail ${index + 1}`}
                        loading="lazy"
                        className={`w-full h-full object-cover ${
                          product.status === 'GIVEN_AWAY' ? 'blur-md' : ''
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {product.title}
                  </h1>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                      {getCategoryTranslation(product.category)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.condition === 'LIKE_NEW'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                        : product.condition === 'GOOD'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                        : product.condition === 'WORN'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                    }`}>
                      {getConditionTranslation(product.condition)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                        : product.status === 'CLAIMED'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                        : product.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {getStatusTranslation(product.status)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full ${
                      isFavorite
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    } hover:bg-opacity-80 transition-colors`}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-opacity-80 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="font-medium">{product.location}</span>
                  </div>
                  <LocationMap location={product.location} height="250px" />
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Calendar className="w-5 h-5 mr-2" />
                  {formatDate(product.created_at)}
                </div>
                {product.dimensions && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Package className="w-5 h-5 mr-2" />
                    {`${product.dimensions.length}x${product.dimensions.width}x${product.dimensions.height} ${product.dimensions.unit}`}
                  </div>
                )}
              </div>

              {product.pickup_instructions && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center text-blue-800 dark:text-blue-200 mb-2">
                    <Info className="w-5 h-5 mr-2" />
                    <h3 className="font-medium">{t('productDetail.sections.pickupInstructions')}</h3>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300">
                    {product.pickup_instructions}
                  </p>
                </div>
              )}

              {/* Donor Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {t('productDetail.sections.aboutDonor')}
                </h3>
                <div className="flex items-center space-x-4">
                  {product.user.avatar_url ? (
                    <img
                      src={product.user.avatar_url}
                      alt={product.user.full_name || t('productDetail.anonymousUser')}
                      loading="lazy"
                      className="w-12 h-12 rounded-full object-cover ring-4 ring-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.6)]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {product.user.full_name || t('productDetail.anonymousUser')}
                    </h4>
                    {product.user.rating > 0 && (
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {product.user.rating.toFixed(1)}
                        </span>
                        {product.user.review_count > 0 && (
                          <span className="text-gray-500 dark:text-gray-400 ml-1">
                            ({t('productDetail.reviews.reviewsCount', { count: product.user.review_count })})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Request Status or Action Buttons */}
              {product.status === 'GIVEN_AWAY' ? (
                <div className="pt-6">
                  <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      {t('productDetail.givenAway.title')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {t('productDetail.givenAway.description')}
                    </p>
                  </div>
                </div>
              ) : requestStatus !== 'none' ? (
                <div className="pt-6">
                  <RequestStatus 
                    status={requestStatus} 
                    donorName={product.user.full_name || t('productDetail.anonymousUser')}
                    onOpenChat={handleOpenChat}
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-4 pt-6">
                  <button
                    onClick={handleRequestClick}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                  >
                    {t('productDetail.buttons.requestItem')}
                  </button>
                  <button
                    onClick={handleOpenChat}
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t('productDetail.buttons.message')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t('productDetail.sections.reviews')}
              </h3>
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div 
                    key={review.id}
                    className="flex space-x-4"
                  >
                    {review.profiles.avatar_url ? (
                      <img
                        src={review.profiles.avatar_url}
                        alt={review.profiles.full_name || t('productDetail.anonymousUser')}
                        loading="lazy"
                        className="w-10 h-10 rounded-full object-cover ring-4 ring-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.6)]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {review.profiles.full_name || t('productDetail.anonymousUser')}
                          </h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {review.comment}
                      </p>
                      <div className="mt-3 flex items-center space-x-4">
                        <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {t('productDetail.reviews.helpful')}
                        </button>
                        <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          {t('productDetail.reviews.notHelpful')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Items */}
          {product.related_items && product.related_items.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-8 bg-gray-100 dark:bg-gray-900/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t('productDetail.sections.relatedItems')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {product.related_items.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    className="group"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {item.photos && item.photos[0] ? (
                        <img
                          src={item.photos[0]}
                          alt={item.title}
                          loading="lazy"
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 ${
                            item.status === 'GIVEN_AWAY' ? 'blur-md' : ''
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                    <h4 className="mt-2 text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.title}
                    </h4>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.condition === 'LIKE_NEW'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                          : item.condition === 'GOOD'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                          : item.condition === 'WORN'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                      }`}>
                        {getConditionTranslation(item.condition)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                          : item.status === 'CLAIMED'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                          : item.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {getStatusTranslation(item.status)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && product && (
        <RequestModal
          itemId={product.id}
          itemName={product.title}
          donorName={product.user.full_name || t('productDetail.anonymousUser')}
          onClose={() => setShowRequestModal(false)}
          onSendRequest={handleSendRequest}
          seedBalance={profile?.seed_balance ?? 0}
          seedEmptyMessage={seedsEmptyMessage}
        />
      )}
    </div>
  );
}