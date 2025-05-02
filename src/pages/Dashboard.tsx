import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Clock, 
  CheckCircle, 
  BookmarkPlus, 
  Activity, 
  PlusCircle,
  Gift,
  Users,
  MessageCircle,
  TrendingUp,
  MapPin,
  Calendar,
  AlertCircle,
  Edit,
  Trash2,
  Package
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../lib/store';

interface DashboardItem {
  id: string;
  title: string;
  status: 'PENDING' | 'CLAIMED' | 'COMPLETED';
  created_at: string;
  category: string;
  description: string;
  location: string;
  photos: string[];
}

interface DashboardStats {
  totalDonations: number;
  activeDonations: number;
  completedDonations: number;
  totalBeneficiaries: number;
}

export default function Dashboard() {
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    activeDonations: 0,
    completedDonations: 0,
    totalBeneficiaries: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError(null);

      // Fetch announcements
      const { data: announcements, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (announcementsError) throw announcementsError;

      // Calculate stats
      const stats = {
        totalDonations: announcements?.length || 0,
        activeDonations: announcements?.filter(a => a.status === 'PENDING').length || 0,
        completedDonations: announcements?.filter(a => a.status === 'COMPLETED').length || 0,
        totalBeneficiaries: new Set(announcements?.map(a => a.claimed_by)).size || 0
      };

      setItems(announcements || []);
      setStats(stats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (itemId: string) => {
    try {
      setDeletingItemId(itemId);
      setDeleteError(null);

      // Find the item to be deleted
      const itemToDelete = items.find(item => item.id === itemId);
      if (!itemToDelete) {
        throw new Error('Item not found');
      }

      // Show confirmation dialog with item details
      const confirmed = window.confirm(
        `Are you sure you want to delete "${itemToDelete.title}"? This action cannot be undone.`
      );

      if (!confirmed) {
        setDeletingItemId(null);
        return;
      }

      // Delete associated photos from storage if they exist
      if (itemToDelete.photos && itemToDelete.photos.length > 0) {
        const photoUrls = itemToDelete.photos;
        const photoKeys = photoUrls.map(url => {
          const parts = url.split('/');
          return `${user?.id}/${parts[parts.length - 1]}`;
        });

        const { error: storageError } = await supabase.storage
          .from('item-photos')
          .remove(photoKeys);

        if (storageError) {
          console.error('Error deleting photos:', storageError);
        }
      }

      // Delete the announcement
      const { error: deleteError } = await supabase
        .from('announcements')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user?.id); // Extra safety check

      if (deleteError) {
        throw deleteError;
      }

      // Broadcast deletion event
      await supabase.channel('custom-all-channel').send({
        type: 'broadcast',
        event: 'announcement_deleted',
        payload: { id: itemId }
      });

      // Update local state
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        totalDonations: prevStats.totalDonations - 1,
        activeDonations: itemToDelete.status === 'PENDING' 
          ? prevStats.activeDonations - 1 
          : prevStats.activeDonations,
        completedDonations: itemToDelete.status === 'COMPLETED'
          ? prevStats.completedDonations - 1
          : prevStats.completedDonations
      }));

    } catch (error) {
      console.error('Error deleting item:', error);
      setDeleteError(
        error instanceof Error 
          ? `Failed to delete item: ${error.message}` 
          : 'Failed to delete item. Please try again.'
      );
      
      // Rollback UI changes on error
      loadDashboardData();
    } finally {
      setDeletingItemId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3 text-red-600 dark:text-red-400 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Welcome back! Here's an overview of your donations and impact.
            </p>
          </div>
          <Link
            to="/create-item"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create New Item
          </Link>
        </div>

        {deleteError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {deleteError}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            {
              title: 'Total Donations',
              value: stats.totalDonations,
              icon: Gift,
              color: 'text-blue-600 dark:text-blue-400',
              bg: 'bg-blue-100 dark:bg-blue-900/20'
            },
            {
              title: 'Active Donations',
              value: stats.activeDonations,
              icon: Activity,
              color: 'text-green-600 dark:text-green-400',
              bg: 'bg-green-100 dark:bg-green-900/20'
            },
            {
              title: 'Completed Donations',
              value: stats.completedDonations,
              icon: CheckCircle,
              color: 'text-purple-600 dark:text-purple-400',
              bg: 'bg-purple-100 dark:bg-purple-900/20'
            },
            {
              title: 'Total Beneficiaries',
              value: stats.totalBeneficiaries,
              icon: Users,
              color: 'text-orange-600 dark:text-orange-400',
              bg: 'bg-orange-100 dark:bg-orange-900/20'
            }
          ].map((stat) => (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Items */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Recent Items
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              A list of your recent donations and their current status.
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-gray-500 dark:text-gray-400 mb-4">No items yet.</div>
                <Link
                  to="/create-item"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Create Your First Item
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Item Image */}
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {item.photos && item.photos[0] ? (
                        <img
                          src={item.photos[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link 
                            to={`/product/${item.id}`}
                            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {item.title}
                          </Link>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                              {item.category}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                                : item.status === 'CLAIMED'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>

                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {item.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-end space-x-4">
                        <Link
                          to={`/edit-item/${item.id}`}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingItemId === item.id}
                          className={`
                            inline-flex items-center px-3 py-1 text-sm font-medium
                            ${deletingItemId === item.id
                              ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
                            }
                            transition-colors
                          `}
                        >
                          {deletingItemId === item.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}