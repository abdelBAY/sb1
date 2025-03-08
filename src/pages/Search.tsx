import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { supabase } from '../lib/supabase';
import { Search as SearchIcon, MapPin, Calendar, Tag, Filter, Grid, List } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  photos: string[];
  tags: string[];
  created_at: string;
}

const ITEMS_PER_PAGE = 12;

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = [
    'All Categories',
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

  const performSearch = async (searchQuery: string, category: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('announcements')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (searchQuery) {
        // Use ilike for basic text search until full-text search is set up
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (category && category !== 'All Categories') {
        query = query.eq('category', category);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setResults(data || []);
      setTotalResults(count || 0);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      performSearch(query, selectedCategory);
    }, 300);

    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [query, selectedCategory, page]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Find Available Items
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for items..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
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
        </div>

        {/* Results Section */}
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
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Image Section */}
                  <div className={viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-video'}>
                    {item.photos && item.photos[0] ? (
                      <img
                        src={item.photos[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <SearchIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                        {item.category}
                      </span>
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
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalResults > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                  Page {page} of {Math.ceil(totalResults / ITEMS_PER_PAGE)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * ITEMS_PER_PAGE >= totalResults}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {query || selectedCategory ? 'No results found' : 'Start typing to search for items'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}