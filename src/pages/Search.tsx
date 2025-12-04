import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';
import { supabase } from '../lib/supabase';
import { 
  Search as SearchIcon, 
  MapPin, 
  Calendar,
  Tag,
  Grid,
  List,
  Star,
  Heart,
  Share2,
  Printer,
  Clock,
  Info,
  Package,
  DollarSign,
  Truck,
  BarChart2,
  Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ImageOverlay from '../components/ImageOverlay';
import OptimizedImage from '../components/OptimizedImage';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  photos: string[];
  tags: string[];
  created_at: string;
  condition: 'LIKE_NEW' | 'GOOD' | 'WORN' | 'BROKEN';
  status: 'PENDING' | 'CLAIMED' | 'COMPLETED' | 'GIVEN_AWAY';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  rating?: number;
  review_count?: number;
  pickup_instructions?: string;
}

interface SortOption {
  label: string;
  value: string;
}

const ITEMS_PER_PAGE = 12;

export default function Search() {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('created_at-desc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  const [pendingOnly, setPendingOnly] = useState<boolean>(false);
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [searchCoordinates, setSearchCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [distanceRadius, setDistanceRadius] = useState<number>(15);
  const [gettingLocation, setGettingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Category mapping: English database values to translation keys
  const categoryMap: { [key: string]: string } = {
    'All Categories': 'all',
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

  // Get translated options
  const sortOptions: SortOption[] = [
    { label: t('search.sortOptions.newestFirst'), value: 'created_at-desc' },
    { label: t('search.sortOptions.oldestFirst'), value: 'created_at-asc' },
    { label: t('search.sortOptions.nameAZ'), value: 'title-asc' },
    { label: t('search.sortOptions.nameZA'), value: 'title-desc' },
    { label: t('search.sortOptions.ratingHighLow'), value: 'rating-desc' },
    { label: t('search.sortOptions.ratingLowHigh'), value: 'rating-asc' }
  ];

  const categories = [
    t('search.categories.all'),
    t('search.categories.furniture'),
    t('search.categories.electronics'),
    t('search.categories.clothing'),
    t('search.categories.books'),
    t('search.categories.kitchen'),
    t('search.categories.sports'),
    t('search.categories.toys'),
    t('search.categories.tools'),
    t('search.categories.other')
  ];

  // English category names for database queries
  const categoryValues = ['All Categories', 'Furniture', 'Electronics', 'Clothing', 'Books', 'Kitchen', 'Sports', 'Toys', 'Tools', 'Other'];

  const conditions = [
    { value: 'LIKE_NEW', label: t('search.conditions.likeNew') },
    { value: 'GOOD', label: t('search.conditions.good') },
    { value: 'WORN', label: t('search.conditions.worn') },
    { value: 'BROKEN', label: t('search.conditions.broken') }
  ];

  useEffect(() => {
    const channel = supabase
      .channel('custom-all-channel')
      .on('broadcast', { event: 'announcement_deleted' }, (payload) => {
        // Remove deleted item from results
        setResults(prev => prev.filter(item => item.id !== payload.payload.id));
        setTotalResults(prev => prev - 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Geocode address to coordinates
  const geocodeAddress = async (address: string): Promise<{ lat: number; lon: number } | null> => {
    try {
      if (!address || !address.trim()) {
        return null;
      }
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address.trim())}&limit=1`,
        {
          headers: {
            'User-Agent': 'Givea-Donation-App/1.0',
            'Accept': 'application/json',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0 && data[0].lat && data[0].lon) {
          const coords = {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon)
          };
          console.log('Geocoding successful:', address, '->', coords);
          return coords;
        } else {
          console.log('Geocoding returned no results for:', address);
        }
      } else {
        console.error('Geocoding API error:', response.status, response.statusText);
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t('search.location.geolocationNotSupported'));
      return;
    }

    setGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setSearchCoordinates({ lat: latitude, lon: longitude });
          
          // Reverse geocode to get address
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

                setLocationSearch(address);
              } else {
                setLocationSearch(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
              }
            } else {
              setLocationSearch(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            }
          } catch (geocodeError) {
            setLocationSearch(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
          
          setGettingLocation(false);
        } catch (error) {
          setLocationError(t('search.location.error'));
          setGettingLocation(false);
        }
      },
      (error) => {
        let errorMessage = t('search.location.error');
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('search.location.permissionDenied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t('search.location.positionUnavailable');
            break;
          case error.TIMEOUT:
            errorMessage = t('search.location.timeout');
            break;
        }
        
        setLocationError(errorMessage);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Debounced geocoding function
  const debouncedGeocode = useMemo(
    () => debounce(async (address: string) => {
      console.log('Geocoding address:', address);
      const coords = await geocodeAddress(address);
      if (coords) {
        console.log('Geocoded address:', address, 'to coordinates:', coords);
        setSearchCoordinates(coords);
        setLocationError(null);
      } else {
        console.log('Failed to geocode address:', address);
        setSearchCoordinates(null);
        setLocationError(t('search.location.addressNotFound'));
      }
    }, 800),
    [t]
  );

  // Handle location search input change with debounce
  const handleLocationSearchChange = useCallback((value: string) => {
    setLocationSearch(value);
    setLocationError(null);
    
    if (!value.trim()) {
      setSearchCoordinates(null);
      debouncedGeocode.cancel();
      return;
    }

    debouncedGeocode(value);
  }, [debouncedGeocode]);

  const performSearch = async () => {
    setLoading(true);
    try {
      let queryBuilder = supabase
        .from('announcements')
        .select('*, announcement_locations(latitude, longitude)', { count: 'exact' })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      // Find the English category value from the translated selected category
      const categoryIndex = categories.indexOf(selectedCategory);
      if (categoryIndex > 0 && categoryIndex < categoryValues.length) {
        queryBuilder = queryBuilder.eq('category', categoryValues[categoryIndex]);
      }

      if (selectedCondition) {
        queryBuilder = queryBuilder.eq('condition', selectedCondition);
      }

      // Always exclude GIVEN_AWAY items from search results
      queryBuilder = queryBuilder.neq('status', 'GIVEN_AWAY');

      if (pendingOnly) {
        queryBuilder = queryBuilder.eq('status', 'PENDING');
      }

      if (typeof query === 'string' && query.trim()) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const [sortField, sortDirection] = sortBy.split('-');
      queryBuilder = queryBuilder.order(sortField, { ascending: sortDirection === 'asc' });

      const { data, error, count } = await queryBuilder;

      if (error) throw error;

      console.log('Search results before location filter:', data?.length || 0);
      console.log('Search coordinates:', searchCoordinates);
      console.log('Distance radius:', distanceRadius);

      // Filter by distance if location search is active
      let filteredData = data || [];
      if (searchCoordinates && distanceRadius > 0) {
        const itemsWithCoords: any[] = [];
        const itemsWithoutCoords: any[] = [];
        
        // First, try to filter items with coordinates in announcement_locations
        filteredData.forEach((item: any) => {
          const location = item.announcement_locations?.[0];
          if (location && location.latitude && location.longitude) {
            itemsWithCoords.push(item);
          } else if (item.location) {
            // If no coordinates in announcement_locations, try to geocode the location text
            itemsWithoutCoords.push(item);
          }
        });

        // Filter items with coordinates
        const filteredWithCoords = itemsWithCoords.filter((item: any) => {
          const location = item.announcement_locations[0];
          const distance = calculateDistance(
            searchCoordinates.lat,
            searchCoordinates.lon,
            parseFloat(location.latitude),
            parseFloat(location.longitude)
          );
          console.log(`Item ${item.id}: distance = ${distance.toFixed(2)} km`);
          return distance <= distanceRadius;
        });

        // For items without coordinates, geocode their location text and filter
        const geocodePromises = itemsWithoutCoords.map(async (item: any) => {
          if (!item.location) return null;
          const itemCoords = await geocodeAddress(item.location);
          if (itemCoords) {
            const distance = calculateDistance(
              searchCoordinates.lat,
              searchCoordinates.lon,
              itemCoords.lat,
              itemCoords.lon
            );
            console.log(`Item ${item.id} (${item.location}): distance = ${distance.toFixed(2)} km`);
            return distance <= distanceRadius ? item : null;
          }
          return null;
        });

        const filteredWithoutCoords = (await Promise.all(geocodePromises)).filter(Boolean);
        
        filteredData = [...filteredWithCoords, ...filteredWithoutCoords];
        console.log('Filtered results:', filteredData.length);
      }

      // Ensure no GIVEN_AWAY items are displayed (safety filter)
      filteredData = filteredData.filter((item: any) => item.status !== 'GIVEN_AWAY');

      setResults(filteredData);
      setTotalResults(filteredData.length);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debouncedSearch = debounce(performSearch, 300);
    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [query, selectedCategory, selectedCondition, sortBy, page, pendingOnly, searchCoordinates, distanceRadius]);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      'LIKE_NEW': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'GOOD': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'WORN': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'BROKEN': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    };
    return colors[condition] || '';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'CLAIMED': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'COMPLETED': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'GIVEN_AWAY': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[status] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('search.title')}
            </h1>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pendingOnly}
                  onChange={(e) => setPendingOnly(e.target.checked)}
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <span>{t('search.pendingOnly')}</span>
              </label>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('search.filters')}
              </button>
              <button
                onClick={handlePrint}
                className="p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Printer className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>

            {/* Location Search - Inline with search bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => handleLocationSearchChange(e.target.value)}
                  placeholder={t('search.location.addressPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                />
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <button
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={t('search.location.useCurrent')}
              >
                <Navigation className={`w-5 h-5 ${gettingLocation ? 'animate-spin' : ''}`} />
              </button>
            </div>

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

          {showFilters && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('search.categories.all')}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('search.condition')}
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">{t('search.anyCondition')}</option>
                    {conditions.map((condition) => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('search.sortOptions.newestFirst')}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('search.location.within')}
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {distanceRadius} {t('search.location.km')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={distanceRadius}
                      onChange={(e) => setDistanceRadius(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${((distanceRadius - 1) / 99) * 100}%, #e5e7eb ${((distanceRadius - 1) / 99) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>1 {t('search.location.km')}</span>
                      <span>100 {t('search.location.km')}</span>
                    </div>
                  </div>
                </div>
              </div>
              {locationError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{locationError}</p>
              )}
            </div>
          )}
        </div>

        {selectedItems.length > 0 && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-gray-700 dark:text-gray-300">
                {t('search.itemsSelected', { count: selectedItems.length })}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
              >
                {t('search.compareSelected')}
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                {t('search.clearSelection')}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {results.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <Link 
                    to={`/product/${item.id}`}
                    className={`block relative ${
                      viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-video'
                    } group`}
                    aria-label={`View details for ${item.title}`}
                  >
                    {item.photos && item.photos[0] ? (
                      <OptimizedImage
                        src={item.photos[0]}
                        alt={item.title}
                        className={`w-full h-full transition-transform duration-200 group-hover:scale-105 ${
                          item.status === 'GIVEN_AWAY' ? 'blur-md' : ''
                        }`}
                        priority={false}
                        placeholder="blur"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors">
                        <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200" />
                  </Link>

                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link 
                          to={`/product/${item.id}`}
                          className="block text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {item.title}
                        </Link>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 mt-2">
                          {item.category && categoryMap[item.category] ? t(`search.categories.${categoryMap[item.category]}`) : item.category}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="h-4 w-4 text-blue-600 dark:text-blue-400 rounded border-gray-300 dark:border-gray-600"
                      />
                    </div>

                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                      {item.description}
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {item.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(item.created_at)}
                      </div>
                      {item.dimensions && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Package className="w-4 h-4 mr-2" />
                          {`${item.dimensions.length}x${item.dimensions.width}x${item.dimensions.height} ${item.dimensions.unit}`}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                          {conditions.find(c => c.value === item.condition)?.label || item.condition}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status === 'GIVEN_AWAY' ? t('search.givenAway') : t(`search.status.${item.status.toLowerCase()}`)}
                        </span>
                      </div>
                      {item.rating && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {item.rating.toFixed(1)}
                          </span>
                          {item.review_count && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                              ({item.review_count})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <Link
                        to={`/product/${item.id}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        {t('search.viewDetails')}
                      </Link>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className={`p-2 rounded-full ${
                            favorites.includes(item.id)
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-400 dark:text-gray-500'
                          } hover:text-red-700 dark:hover:text-red-300 transition-colors`}
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalResults > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('search.previous')}
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                  {t('search.page', { current: page, total: Math.ceil(totalResults / ITEMS_PER_PAGE) })}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * ITEMS_PER_PAGE >= totalResults}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('search.next')}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {query || selectedCategory ? t('search.noResults') : t('search.startTyping')}
            </p>
          </div>
        )}

        {selectedItem && (
          <ImageOverlay
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </div>
    </div>
  );
}