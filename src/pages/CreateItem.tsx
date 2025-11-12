import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  MapPin, 
  AlertCircle, 
  X,
  Image as ImageIcon,
  Info,
  Navigation,
  Search
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import { useTranslation } from 'react-i18next';

interface CreateItemForm {
  title: string;
  description: string;
  category: string;
  condition: 'LIKE_NEW' | 'GOOD' | 'WORN' | 'BROKEN';
  photos: File[];
  location: string;
  availability: 'PENDING' | 'CLAIMED' | 'COMPLETED' | 'GIVEN_AWAY';
  pickupInstructions: string;
  tags: string[];
}

const CATEGORIES = [
  'Furniture',
  'Electronics',
  'Clothing',
  'Books',
  'Kitchen',
  'Sports',
  'Toys',
  'Tools',
  'Other'
];

export default function CreateItem() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const user = useStore((state) => state.user);
  const isLoading = useStore((state) => state.isLoading);
  
  const CONDITIONS = [
    { value: 'LIKE_NEW', label: t('createItem.conditions.likeNew'), description: t('createItem.conditions.likeNewDesc') },
    { value: 'GOOD', label: t('createItem.conditions.good'), description: t('createItem.conditions.goodDesc') },
    { value: 'WORN', label: t('createItem.conditions.worn'), description: t('createItem.conditions.wornDesc') },
    { value: 'BROKEN', label: t('createItem.conditions.broken'), description: t('createItem.conditions.brokenDesc') }
  ];
  
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
    return t(`createItem.categories.${categoryMap[category] || 'other'}`);
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [locationCoordinates, setLocationCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [formData, setFormData] = useState<CreateItemForm>({
    title: '',
    description: '',
    category: '',
    condition: 'GOOD',
    photos: [],
    location: '',
    availability: 'PENDING',
    pickupInstructions: '',
    tags: []
  });

  // Check authentication (wait for auth initialization)
  useEffect(() => {
    // Don't redirect while auth is still initializing
    if (isLoading) {
      return;
    }
    
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, isLoading, navigate]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.photos.length > 5) {
      setError(t('createItem.errors.maxPhotos'));
      return;
    }

    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValid && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError(t('createItem.errors.invalidFiles'));
    }

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...validFiles].slice(0, 5)
    }));

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(prev => [...prev, reader.result as string].slice(0, 5));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPhotoPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (formData.tags.length >= 5) {
        setError(t('createItem.errors.maxTags'));
        return;
      }
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }));
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t('createItem.location.geolocationNotSupported'));
      return;
    }

    setGettingLocation(true);
    setLocationError(null);

    // First try with high accuracy, but allow cached positions
    const tryGetLocation = (options: PositionOptions, attempt: number = 1) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Store coordinates immediately
            setLocationCoordinates({ lat: latitude, lon: longitude });
            
            // Try to reverse geocode to get address
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                {
                  headers: {
                    'User-Agent': 'Givea-Donation-App/1.0',
                    'Accept': 'application/json',
                  }
                }
              );

              if (response.ok) {
                const data = await response.json();
                
                if (data && data.address) {
                  // Build address string from components
                  const addressParts = [];
                  if (data.address.road) addressParts.push(data.address.road);
                  if (data.address.house_number) addressParts.push(data.address.house_number);
                  if (data.address.neighbourhood) addressParts.push(data.address.neighbourhood);
                  if (data.address.city || data.address.town || data.address.village) {
                    addressParts.push(data.address.city || data.address.town || data.address.village);
                  }
                  if (data.address.state) addressParts.push(data.address.state);
                  if (data.address.country) addressParts.push(data.address.country);

                  const address = addressParts.length > 0 
                    ? addressParts.join(', ')
                    : data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

                  setFormData(prev => ({
                    ...prev,
                    location: address
                  }));
                } else {
                  // Use display_name or coordinates
                  setFormData(prev => ({
                    ...prev,
                    location: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                  }));
                }
              } else {
                // Fallback to coordinates if reverse geocoding fails
                setFormData(prev => ({
                  ...prev,
                  location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                }));
              }
            } catch (geocodeError) {
              // If reverse geocoding fails, still use coordinates
              setFormData(prev => ({
                ...prev,
                location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              }));
            }
            
            // Show success visual feedback
            setLocationDetected(true);
            setTimeout(() => setLocationDetected(false), 3000);
            setGettingLocation(false);
          } catch (error) {
            setLocationError(t('createItem.location.error'));
            setGettingLocation(false);
          }
        },
        (error) => {
          // If high accuracy fails and this is the first attempt, try with less strict options
          if (attempt === 1 && options.enableHighAccuracy) {
            // Retry with less strict options
            tryGetLocation({
              enableHighAccuracy: false,
              timeout: 15000,
              maximumAge: 60000 // Allow cached position up to 1 minute old
            }, 2);
            return;
          }
          
          let errorMessage = t('createItem.location.error');
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = t('createItem.location.permissionDenied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = t('createItem.location.positionUnavailable');
              break;
            case error.TIMEOUT:
              errorMessage = t('createItem.location.timeout');
              break;
            default:
              if (error.code !== undefined) {
                console.error('Geolocation error:', error.message || error.code);
              }
              break;
          }
          
          setLocationError(errorMessage);
          setGettingLocation(false);
        },
        options
      );
    };

    // Start with high accuracy, but will fallback if needed
    tryGetLocation({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000 // Allow cached position up to 30 seconds old
    });
  };

  const searchLocation = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce the search
    searchTimeoutRef.current = setTimeout(async () => {
      setSearchingLocation(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'Givea-Donation-App/1.0',
              'Accept': 'application/json',
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to search locations');
        }

        const data = await response.json();
        setLocationSuggestions(data || []);
        setShowSuggestions(true);
      } catch (error) {
        // Silently fail - user can still type manually
        setLocationSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSearchingLocation(false);
      }
    }, 300);
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, location: value });
    setLocationError(null);
    setLocationDetected(false);
    searchLocation(value);
  };

  const selectLocation = (suggestion: { display_name: string; lat: string; lon: string }) => {
    setFormData({ ...formData, location: suggestion.display_name });
    setLocationCoordinates({ lat: parseFloat(suggestion.lat), lon: parseFloat(suggestion.lon) });
    setLocationSuggestions([]);
    setShowSuggestions(false);
    setLocationDetected(true);
    setTimeout(() => setLocationDetected(false), 3000);
    if (locationInputRef.current) {
      locationInputRef.current.blur();
    }
  };

  const clearLocation = () => {
    setFormData({ ...formData, location: '' });
    setLocationSuggestions([]);
    setShowSuggestions(false);
    setLocationCoordinates(null);
    setLocationDetected(false);
    if (locationInputRef.current) {
      locationInputRef.current.focus();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const validateForm = () => {
    if (!user) {
      throw new Error(t('createItem.errors.signInRequired'));
    }
    if (!formData.title.trim()) {
      throw new Error(t('createItem.errors.titleRequired'));
    }
    if (!formData.category) {
      throw new Error(t('createItem.errors.categoryRequired'));
    }
    if (!formData.description.trim()) {
      throw new Error(t('createItem.errors.descriptionRequired'));
    }
    if (!formData.location.trim()) {
      throw new Error(t('createItem.errors.locationRequired'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Validate form
      validateForm();

      // Check Supabase connection
      const { data: connectionTest, error: connectionError } = await supabase.from('announcements').select('count').limit(1);
      if (connectionError) {
        throw new Error(t('createItem.errors.databaseConnectionFailed'));
      }

      // Upload photos first
      const photoUrls = await Promise.all(
        formData.photos.map(async (photo, index) => {
          const fileExt = photo.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError, data } = await supabase.storage
            .from('item-photos')
            .upload(filePath, photo, {
              onUploadProgress: (progress) => {
                const totalProgress = ((index + (progress.percent || 0) / 100) / formData.photos.length) * 100;
                setUploadProgress(Math.round(totalProgress));
              }
            });

          if (uploadError) {
            throw new Error(t('createItem.errors.uploadFailed', { message: uploadError.message }));
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('item-photos')
            .getPublicUrl(filePath);

          return publicUrl;
        })
      );

      // Create the announcement
      const { error: insertError } = await supabase
        .from('announcements')
        .insert([
          {
            user_id: user.id,
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            condition: formData.condition,
            photos: photoUrls,
            location: formData.location.trim(),
            status: formData.availability,
            pickup_instructions: formData.pickupInstructions.trim(),
            tags: formData.tags
          }
        ]);

      if (insertError) {
        // If insert fails, clean up uploaded photos
        const filePathsToDelete = photoUrls.map(url => url.split('/').pop() || '');
        await supabase.storage
          .from('item-photos')
          .remove(filePathsToDelete);
          
        throw new Error(t('createItem.errors.createFailed', { message: insertError.message }));
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating item:', error);
      setError(error instanceof Error ? error.message : t('createItem.errors.genericError'));
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('createItem.title')}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center text-red-700 dark:text-red-400">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t('createItem.fields.title')} <span className="text-red-500">{t('createItem.required')}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-2 font-normal">
                    ({t('createItem.fields.titleCharacters', { current: formData.title.length })})
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={50}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
                  placeholder={t('createItem.fields.titlePlaceholder')}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t('createItem.fields.category')} <span className="text-red-500">{t('createItem.required')}</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg appearance-none cursor-pointer"
                    required
                  >
                    <option value="">{t('createItem.fields.selectCategory')}</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {getCategoryTranslation(category)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t('createItem.fields.description')} <span className="text-red-500">{t('createItem.required')}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-2 font-normal">
                    ({t('createItem.fields.descriptionCharacters', { current: formData.description.length })})
                  </span>
                </label>
                <textarea
                  maxLength={500}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg resize-none"
                  placeholder={t('createItem.fields.descriptionPlaceholder')}
                  required
                />
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t('createItem.fields.condition')} <span className="text-red-500">{t('createItem.required')}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CONDITIONS.map((condition) => (
                    <label
                      key={condition.value}
                      className={`
                        relative flex items-start p-5 cursor-pointer rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md
                        ${formData.condition === condition.value
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md ring-2 ring-blue-500/20 dark:ring-blue-400/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="condition"
                            value={condition.value}
                            checked={formData.condition === condition.value}
                            onChange={(e) => setFormData({ ...formData, condition: e.target.value as CreateItemForm['condition'] })}
                            className="h-5 w-5 text-blue-600 dark:text-blue-400 border-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 cursor-pointer"
                          />
                          <span className="ml-3 font-semibold text-gray-900 dark:text-white">
                            {condition.label}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {condition.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t('createItem.fields.photos')}
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-2 font-normal">
                    ({t('createItem.fields.photosHint')})
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 group"
                    >
                      {photoPreview[index] ? (
                        <>
                          <img
                            src={photoPreview[index]}
                            alt={`Preview ${index + 1}`}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                          <ImageIcon className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {t('createItem.buttons.clickToUpload')}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {t('createItem.fields.location')} <span className="text-red-500">{t('createItem.required')}</span>
                  </label>
                  
                  {/* Large Visual Location Button */}
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                    className={`w-full relative overflow-hidden rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                      locationDetected
                        ? 'border-green-500 dark:border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg ring-2 ring-green-500/20 dark:ring-green-400/20'
                        : gettingLocation
                        ? 'border-blue-400 dark:border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-md'
                        : 'border-blue-300 dark:border-blue-600 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg'
                    }`}
                  >
                    <div className="p-4 flex items-center justify-center space-x-3">
                      {gettingLocation ? (
                        <>
                          <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                          <div className="text-left">
                            <p className="text-base font-semibold text-blue-700 dark:text-blue-300">
                              {t('createItem.location.getting')}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              {t('createItem.location.requesting')}
                            </p>
                          </div>
                        </>
                      ) : locationDetected ? (
                        <>
                          <div className="w-10 h-10 rounded-full bg-green-500 dark:bg-green-400 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-base font-semibold text-green-700 dark:text-green-300">
                              {t('createItem.location.detected')}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                              {formData.location}
                            </p>
                            {locationCoordinates && (
                              <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                                {locationCoordinates.lat.toFixed(6)}, {locationCoordinates.lon.toFixed(6)}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 flex items-center justify-center shadow-lg">
                            <Navigation className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-base font-semibold text-blue-700 dark:text-blue-300">
                              {t('createItem.location.useCurrent')}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              {t('createItem.location.tapToDetect')}
                            </p>
                          </div>
                          <MapPin className="w-5 h-5 text-blue-400 dark:text-blue-500" />
                        </>
                      )}
                    </div>
                  </button>
                  
                  {/* Location Input Field with Autocomplete */}
                  <div className="mt-4 relative">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        ref={locationInputRef}
                        type="text"
                        value={formData.location}
                        onChange={handleLocationInputChange}
                        onFocus={() => {
                          if (locationSuggestions.length > 0) {
                            setShowSuggestions(true);
                          }
                        }}
                        className={`w-full pl-12 pr-10 py-3 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg ${
                          locationDetected
                            ? 'border-green-300 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10'
                            : showSuggestions
                            ? 'border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-700/50'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20'
                        } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none`}
                        placeholder={t('createItem.fields.locationPlaceholder')}
                        required
                      />
                      {formData.location && (
                        <button
                          type="button"
                          onClick={clearLocation}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-xl transition-colors"
                        >
                          <X className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                        </button>
                      )}
                      {searchingLocation && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    {/* Suggestions Dropdown */}
                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div
                        ref={suggestionsRef}
                        className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-80 overflow-y-auto"
                      >
                        {locationSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectLocation(suggestion)}
                            className="w-full px-4 py-3 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                            <span className="flex-1 text-sm text-gray-900 dark:text-white">
                              {suggestion.display_name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {locationDetected && !showSuggestions && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <div className="w-6 h-6 rounded-full bg-green-500 dark:bg-green-400 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Coordinates Display */}
                  {locationCoordinates && locationDetected && (
                    <div className="mt-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></div>
                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          {t('createItem.location.coordinates')}: 
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                          {locationCoordinates.lat.toFixed(6)}, {locationCoordinates.lon.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {locationError && (
                    <div className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        {locationError}
                      </p>
                    </div>
                  )}
                  
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Info className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    {t('createItem.fields.locationPrivacy')}
                  </p>
                </div>
              </div>

              {/* Pickup Instructions */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t('createItem.fields.pickupInstructions')}
                </label>
                <textarea
                  value={formData.pickupInstructions}
                  onChange={(e) => setFormData({ ...formData, pickupInstructions: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg resize-none"
                  placeholder={t('createItem.fields.pickupInstructionsPlaceholder')}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t('createItem.fields.tags')}
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-2 font-normal">
                    ({t('createItem.fields.tagsHint')})
                  </span>
                </label>
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={t('createItem.fields.tagsPlaceholder')}
                  disabled={formData.tags.length >= 5}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('createItem.buttons.creating')}
                    </>
                  ) : (
                    t('createItem.buttons.createListing')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}