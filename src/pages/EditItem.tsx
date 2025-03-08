import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Upload, 
  MapPin, 
  AlertCircle, 
  X,
  Image as ImageIcon,
  Info,
  Loader,
  Save,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';

interface EditItemForm {
  title: string;
  description: string;
  category: string;
  condition: 'LIKE_NEW' | 'GOOD' | 'WORN' | 'BROKEN';
  photos: string[];
  newPhotos: File[];
  location: string;
  availability: 'PENDING' | 'CLAIMED' | 'COMPLETED';
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

const CONDITIONS = [
  { value: 'LIKE_NEW', label: 'Like New', description: 'Item is in perfect condition' },
  { value: 'GOOD', label: 'Good', description: 'Item shows minimal wear' },
  { value: 'WORN', label: 'Worn', description: 'Item shows significant wear but is functional' },
  { value: 'BROKEN', label: 'Broken', description: 'Item needs repair' }
];

export default function EditItem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState<EditItemForm>({
    title: '',
    description: '',
    category: '',
    condition: 'GOOD',
    photos: [],
    newPhotos: [],
    location: '',
    availability: 'PENDING',
    pickupInstructions: '',
    tags: []
  });

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      const { data: item, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (item.user_id !== user?.id) {
        navigate('/dashboard');
        return;
      }

      setFormData({
        title: item.title || '',
        description: item.description || '',
        category: item.category || '',
        condition: item.condition || 'GOOD',
        photos: item.photos || [],
        newPhotos: [],
        location: item.location || '',
        availability: item.status || 'PENDING',
        pickupInstructions: item.pickup_instructions || '',
        tags: item.tags || []
      });
    } catch (error) {
      console.error('Error loading item:', error);
      setError('Failed to load item details');
    } finally {
      setInitialLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalPhotos = formData.photos.length + formData.newPhotos.length;
    
    if (files.length + totalPhotos > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }

    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValid && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError('Some files were skipped. Please ensure all files are images under 5MB.');
    }

    setFormData(prev => ({
      ...prev,
      newPhotos: [...prev.newPhotos, ...validFiles].slice(0, 5 - prev.photos.length)
    }));
  };

  const removeExistingPhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const removeNewPhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      newPhotos: prev.newPhotos.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (formData.tags.length >= 5) {
        setError('Maximum 5 tags allowed');
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

  const validateForm = () => {
    if (!user) {
      throw new Error('Please sign in to update the listing');
    }
    if (!formData.title.trim()) {
      throw new Error('Title is required');
    }
    if (!formData.category) {
      throw new Error('Category is required');
    }
    if (!formData.description.trim()) {
      throw new Error('Description is required');
    }
    if (!formData.location.trim()) {
      throw new Error('Location is required');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      validateForm();

      // Upload new photos
      const newPhotoUrls = await Promise.all(
        formData.newPhotos.map(async (photo, index) => {
          const fileExt = photo.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('item-photos')
            .upload(filePath, photo, {
              onUploadProgress: (progress) => {
                const totalProgress = ((index + (progress.percent || 0) / 100) / formData.newPhotos.length) * 100;
                setUploadProgress(Math.round(totalProgress));
              }
            });

          if (uploadError) {
            throw new Error(`Failed to upload photo: ${uploadError.message}`);
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('item-photos')
            .getPublicUrl(filePath);

          return publicUrl;
        })
      );

      // Update the announcement
      const { error: updateError } = await supabase
        .from('announcements')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          condition: formData.condition,
          photos: [...formData.photos, ...newPhotoUrls],
          location: formData.location.trim(),
          status: formData.availability,
          pickup_instructions: formData.pickupInstructions.trim(),
          tags: formData.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        throw new Error(`Failed to update listing: ${updateError.message}`);
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating item:', error);
      setError(error instanceof Error ? error.message : 'Failed to update listing');
    } finally {
      setLoading(false);
      setUploadProgress(0);
      setShowConfirmation(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Item
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center text-red-700 dark:text-red-400">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                    ({formData.title.length}/50 characters)
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={50}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="e.g., Wooden dining table"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                    ({formData.description.length}/500 characters)
                  </span>
                </label>
                <textarea
                  maxLength={500}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Describe the item's features, condition, and any important details..."
                  required
                />
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Condition <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CONDITIONS.map((condition) => (
                    <label
                      key={condition.value}
                      className={`
                        relative flex items-start p-4 cursor-pointer rounded-lg border
                        ${formData.condition === condition.value
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
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
                            onChange={(e) => setFormData({ ...formData, condition: e.target.value as EditItemForm['condition'] })}
                            className="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                          />
                          <span className="ml-3 font-medium text-gray-900 dark:text-white">
                            {condition.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {condition.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Photos
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                    (Maximum 5 photos, 5MB each)
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {/* Existing Photos */}
                  {formData.photos.map((photoUrl, index) => (
                    <div
                      key={`existing-${index}`}
                      className="aspect-square rounded-lg border-2 border-gray-300 dark:border-gray-600 relative overflow-hidden"
                    >
                      <img
                        src={photoUrl}
                        alt={`Item photo ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* New Photos */}
                  {formData.newPhotos.map((file, index) => (
                    <div
                      key={`new-${index}`}
                      className="aspect-square rounded-lg border-2 border-gray-300 dark:border-gray-600 relative overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New photo ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewPhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Upload Slot */}
                  {formData.photos.length + formData.newPhotos.length < 5 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex flex-col items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        Click to upload
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
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-lg">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 pl-10"
                    placeholder="Enter your location"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  For privacy, your exact location will be approximated
                </p>
              </div>

              {/* Pickup Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pickup Instructions
                </label>
                <textarea
                  value={formData.pickupInstructions}
                  onChange={(e) => setFormData({ ...formData, pickupInstructions: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Add any specific instructions for item pickup..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                    (Press Enter to add, maximum 5 tags)
                  </span>
                </label>
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Add tags to help others find your item..."
                  disabled={formData.tags.length >= 5}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : showConfirmation ? (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Confirm Changes
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
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