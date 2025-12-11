import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search,
  Send,
  User,
  Check,
  CheckCheck,
  CheckCircle,
  XCircle,
  MessageCircle,
  MapPin,
  Calendar,
  AlertCircle,
  X,
  Trash2,
  Filter,
  Plus
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import ConfirmationModal from '../components/ConfirmationModal';
import FeedbackModal from '../components/FeedbackModal';
import SeedBalance from '../components/seeds/SeedBalance';
import OptimizedImage from '../components/OptimizedImage';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  announcement_id?: string;
  message_type?: 'text' | 'request_action' | 'meeting_confirmation';
  metadata?: {
    action?: 'accept' | 'decline' | 'ask_more_info';
    meeting_date?: string;
    meeting_place?: string;
  };
}

interface Chat {
  id: string;
  user: {
    id: string;
    full_name: string;
    avatar_url: string;
    last_seen?: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    read: boolean;
  };
  unread_count: number;
  announcement?: {
    id: string;
    title: string;
    photos: string[];
    status?: string;
    category?: string;
    user_id?: string;
  };
}

export default function Messages() {
  const { t } = useTranslation('common');
  const seedsEmptyMessage = t(
    'seeds.zeroMessage',
    "You've used all your seeds. Give something to earn more and keep growing!"
  );
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const isLoading = useStore((state) => state.isLoading);
  const setUnreadMessagesCount = useStore((state) => state.setUnreadMessagesCount);
  const profile = useStore((state) => state.profile);
  const setProfile = useStore((state) => state.setProfile);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'donations' | 'requests'>('donations');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<{
    itemName: string;
    donorName: string;
    suggestedDate?: string;
    suggestedPlace?: string;
  } | null>(null);
  const lacksSeedsForFirstMessage = useMemo(
    () => messages.length === 0 && (profile?.seed_balance ?? 0) <= 0,
    [messages.length, profile?.seed_balance]
  );

  useEffect(() => {
    // Don't redirect while auth is still initializing
    if (isLoading) {
      return;
    }
    
    if (!user) {
      navigate('/login');
      return;
    }

    const init = async () => {
      if (!user) return;

      // Mark all received messages as read when opening Messages page
      try {
        const { data: unread, error: fetchErr } = await supabase
          .from('messages')
          .select('id')
          .eq('receiver_id', user.id)
          .eq('read', false);

        if (!fetchErr && unread && unread.length > 0) {
          console.log(`Found ${unread.length} unread messages - marking as read`);
          
          // Update each message individually to ensure RLS policy works
          const updatePromises = unread.map(async (msg: any) => {
            const { error: updateError } = await supabase
              .from('messages')
              .update({ read: true })
              .eq('id', msg.id)
              .eq('receiver_id', user.id)
              .eq('read', false);
            
            if (updateError) {
              console.error(`Error updating message ${msg.id}:`, updateError);
            }
            return updateError === null;
          });

          await Promise.all(updatePromises);
          
          // Update the global count to 0 since we're viewing messages
          setUnreadMessagesCount(0);
        }
      } catch (e) {
        console.error('Error checking unread messages:', e);
      }

      // Load chats after marking as read so UI reflects zero unread
      loadChats();
    };

    init();
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (selectedChat) {
      console.log('Chat selected, loading messages for:', selectedChat.id);
      console.log('Selected chat details:', selectedChat);
      loadMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
    console.log('Messages updated:', messages.length, messages);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChats = async () => {
    try {
      setLoading(true);
      
      // First, get all messages for the user
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          created_at,
          read,
          announcement_id
        `)
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Get unique user IDs from messages
      const userIds = new Set<string>();
      messages?.forEach((message: any) => {
        if (message.sender_id !== user?.id) userIds.add(message.sender_id);
        if (message.receiver_id !== user?.id) userIds.add(message.receiver_id);
      });

      // Fetch profiles for all users
      let profiles: any[] = [];
      if (userIds.size > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, last_seen')
          .in('id', Array.from(userIds));

        if (profilesError) {
          console.error('Profiles query error:', profilesError);
          // Continue without profiles - we'll use fallback data
        } else {
          profiles = profilesData || [];
        }
      }

      // Get unique announcement IDs from messages
      const announcementIds = new Set<string>();
      messages?.forEach((message: any) => {
        if (message.announcement_id) {
          announcementIds.add(message.announcement_id);
        }
      });

      // Fetch announcement details for all chats
      let announcements: any[] = [];
      if (announcementIds.size > 0) {
        const { data: announcementsData, error: announcementsError } = await supabase
          .from('announcements')
          .select('id, title, photos, status, category, user_id')
          .in('id', Array.from(announcementIds));

        if (announcementsError) {
          console.error('Announcements query error:', announcementsError);
        } else {
          announcements = announcementsData || [];
        }
      }

      // Group messages by chat
      const chatMap = new Map<string, Chat>();
      
      // First pass: count unread messages per chat
      const unreadCounts = new Map<string, number>();
      messages?.forEach((message: any) => {
        const otherUserId = message.sender_id === user?.id ? message.receiver_id : message.sender_id;
        
        // Create chat ID based on users AND announcement_id to separate chats by item
        let chatId;
        if (message.announcement_id) {
          // Include announcement_id to keep separate chats for each item
          const sortedUserIds = [user?.id, otherUserId].sort().join('-');
          chatId = `${sortedUserIds}-${message.announcement_id}`;
        } else {
          // No announcement, group by user only
          chatId = [user?.id, otherUserId].sort().join('-');
        }

        // Count unread messages (messages sent TO current user)
        if (!message.read && message.receiver_id === user?.id) {
          unreadCounts.set(chatId, (unreadCounts.get(chatId) || 0) + 1);
        }
      });

      // Second pass: build chat objects
      messages?.forEach((message: any) => {
        const otherUserId = message.sender_id === user?.id ? message.receiver_id : message.sender_id;
        
        // Create chat ID based on users AND announcement_id to separate chats by item
        let chatId;
        if (message.announcement_id) {
          // Include announcement_id to keep separate chats for each item
          const sortedUserIds = [user?.id, otherUserId].sort().join('-');
          chatId = `${sortedUserIds}-${message.announcement_id}`;
        } else {
          // No announcement, group by user only
          chatId = [user?.id, otherUserId].sort().join('-');
        }

        // Find profile for this user
        const profile = profiles.find(p => p.id === otherUserId);

        if (!chatMap.has(chatId)) {
          // Find announcement for this message
          const announcement = announcements.find(a => a.id === message.announcement_id);
          
          chatMap.set(chatId, {
            id: chatId,
            user: {
              id: otherUserId,
              full_name: profile?.full_name || t('messages.unknownUser'),
              avatar_url: profile?.avatar_url || null,
              last_seen: profile?.last_seen || null
            },
            last_message: {
              content: message.content,
              created_at: message.created_at,
              read: message.read
            },
            unread_count: unreadCounts.get(chatId) || 0,
            announcement: message.announcement_id ? {
              id: message.announcement_id,
              title: announcement?.title || t('messages.item'),
              photos: announcement?.photos || [],
              status: announcement?.status,
              category: announcement?.category,
              user_id: announcement?.user_id
            } : undefined
          });
        } else {
          const chat = chatMap.get(chatId)!;
          // Update last message if this one is more recent
          if (new Date(message.created_at) > new Date(chat.last_message?.created_at || 0)) {
            chat.last_message = {
              content: message.content,
              created_at: message.created_at,
              read: message.read
            };
          }
          // Update unread count from our map
          chat.unread_count = unreadCounts.get(chatId) || 0;
        }
      });

      setChats(Array.from(chatMap.values()));
    } catch (error) {
      console.error('Error loading chats:', error);
      setError(t('messages.errors.loadChats'));
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      console.log('Loading messages for chatId:', chatId);
      console.log('Current user ID:', user?.id);
      
      // Parse chatId which can be:
      // 1. "uuid1-uuid2" (chats without announcement_id) - 73 chars (36 + 1 + 36)
      // 2. "uuid1-uuid2-announcementId" (chats with announcement_id) - 110 chars (36 + 1 + 36 + 1 + 36)
      
      // UUIDs are 36 characters long
      const userId1 = chatId.substring(0, 36);
      
      let userId2: string;
      let announcementId: string | undefined;
      
      if (chatId.length >= 110) {
        // Has announcement_id: format is "uuid1-uuid2-announcementId"
        userId2 = chatId.substring(37, 73); // Positions 37-73 (skip hyphen at 36)
        announcementId = chatId.substring(74); // Everything after position 74
      } else {
        // No announcement_id, just two UUIDs
        userId2 = chatId.substring(37); // Everything after position 37
      }
      
      console.log('Extracted IDs:', { userId1, userId2, announcementId });

      // Build the query based on whether there's an announcement_id
      let messages1Query = supabase
        .from('messages')
        .select('*')
        .eq('sender_id', userId1)
        .eq('receiver_id', userId2);
      
      let messages2Query = supabase
        .from('messages')
        .select('*')
        .eq('sender_id', userId2)
        .eq('receiver_id', userId1);
      
      // Filter by announcement_id if it exists
      if (announcementId) {
        messages1Query = messages1Query.eq('announcement_id', announcementId);
        messages2Query = messages2Query.eq('announcement_id', announcementId);
      }
      
      // Order by created_at
      messages1Query = messages1Query.order('created_at', { ascending: true });
      messages2Query = messages2Query.order('created_at', { ascending: true });

      const { data: messages1, error: error1 } = await messages1Query;
      const { data: messages2, error: error2 } = await messages2Query;

      if (error1) {
        console.error('Error loading messages1:', error1);
        throw error1;
      }
      if (error2) {
        console.error('Error loading messages2:', error2);
        throw error2;
      }

      console.log('Messages1 loaded:', messages1?.length || 0);
      console.log('Messages2 loaded:', messages2?.length || 0);

      // Combine and sort messages
      const allMessages = [
        ...(messages1 || []),
        ...(messages2 || [])
      ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      console.log('Total messages combined:', allMessages.length);
      console.log('Messages:', allMessages);

      setMessages(allMessages);

      // Mark messages as read - update database AND UI state
      const unreadMessages = allMessages.filter(
        (m) => !m.read && m.receiver_id === user?.id
      );

      if (unreadMessages.length > 0) {
        // Update in database - mark messages as read
        const messageIds = unreadMessages.map((m) => m.id);
        
        // Update each message individually to ensure RLS policy works correctly
        const updatePromises = messageIds.map(async (messageId) => {
          const { error: updateError } = await supabase
            .from('messages')
            .update({ read: true })
            .eq('id', messageId)
            .eq('receiver_id', user?.id)
            .eq('read', false); // Only update if currently unread
            
          if (updateError) {
            console.error(`Error updating message ${messageId}:`, updateError);
          }
          return updateError === null;
        });

        const updateResults = await Promise.all(updatePromises);
        const successCount = updateResults.filter(Boolean).length;
        
        if (successCount > 0) {
          console.log(`Successfully marked ${successCount} message(s) as read`);
        }

        // Update messages to show as read in UI
        const updatedMessages = allMessages.map((m) => {
          if (!m.read && m.receiver_id === user?.id) {
            return { ...m, read: true };
          }
          return m;
        });
        setMessages(updatedMessages);

        // Update the selected chat's unread count to 0
        if (selectedChat) {
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === selectedChat.id ? { ...chat, unread_count: 0 } : chat
            )
          );
        }

        // Reset global unread count and refresh it
        setUnreadMessagesCount(0);
        
        // Force refresh unread count in Layout component
        // This ensures the count is updated even after page reload
        const { data: unreadData } = await supabase
          .from('messages')
          .select('id')
          .eq('receiver_id', user?.id)
          .eq('read', false);
        
        setUnreadMessagesCount(unreadData?.length || 0);
      } else {
        setMessages(allMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setError(t('messages.errors.loadMessages'));
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const message = {
        sender_id: user?.id,
        receiver_id: selectedChat.user.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        read: false,
        announcement_id: selectedChat.announcement?.id
      };

      const { error: sendError } = await supabase
        .from('messages')
        .insert([message])
        .select();

      if (sendError) throw sendError;

      const { data: refreshedProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (!profileError && refreshedProfile) {
        setProfile(refreshedProfile);
      }

      setNewMessage('');
      loadMessages(selectedChat.id);
    } catch (error) {
      console.error('Error sending message:', error);
      const rawMessage =
        (error as any)?.message ||
        (error as any)?.details ||
        '';

      if (
        typeof rawMessage === 'string' &&
        (rawMessage.includes('INSUFFICIENT_SEEDS') ||
          rawMessage.includes('You’ve used all your seeds'))
      ) {
        setError(seedsEmptyMessage);
        return;
      }

      setError(t('messages.errors.send'));
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return t('messages.yesterday');
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedChat || !user) return;

    const confirmed = window.confirm(
      t('messages.confirmDelete', { name: selectedChat.user.full_name })
    );

    if (!confirmed) return;

    try {
      console.log('Deleting conversation:', selectedChat.id);
      
      // Parse chatId to extract user IDs and announcement ID
      const chatId = selectedChat.id;
      const userId1 = chatId.substring(0, 36);
      let userId2: string;
      let announcementId: string | undefined;
      
      if (chatId.length >= 110) {
        // Has announcement_id
        userId2 = chatId.substring(37, 73);
        announcementId = chatId.substring(74);
      } else {
        // Just two user IDs
        userId2 = chatId.substring(37);
      }

      console.log('Deleting messages for:', { userId1, userId2, announcementId, currentUser: user.id });

      // Build queries to delete messages for both directions
      let query1 = supabase
        .from('messages')
        .delete()
        .eq('sender_id', user.id)
        .in('receiver_id', [userId1, userId2]);

      let query2 = supabase
        .from('messages')
        .delete()
        .eq('receiver_id', user.id)
        .in('sender_id', [userId1, userId2]);

      // Filter by announcement_id if it exists
      if (announcementId) {
        query1 = query1.eq('announcement_id', announcementId);
        query2 = query2.eq('announcement_id', announcementId);
      }

      // Execute both deletes
      const { error: error1 } = await query1;
      const { error: error2 } = await query2;

      if (error1 || error2) {
        console.error('Delete errors:', { error1, error2 });
        throw error1 || error2;
      }

      console.log('Conversation deleted successfully');

      // Clear selected chat and reload chat list
      setSelectedChat(null);
      setMessages([]);
      loadChats();
      
      // Update unread count
      const { data: unreadData } = await supabase
        .from('messages')
        .select('id')
        .eq('receiver_id', user.id)
        .eq('read', false);
      
      if (unreadData) {
        setUnreadMessagesCount(unreadData.length);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setError(t('messages.errors.delete'));
    }
  };

  const handleRequestAction = async (action: 'accept' | 'decline' | 'ask_more_info') => {
    if (!selectedChat) return;

    try {
      let messageContent = '';
      let metadata: any = { action };

      switch (action) {
        case 'accept':
          messageContent = t('messages.actions.accepted');
          // Set up confirmation modal
          setPendingRequest({
            itemName: selectedChat.announcement?.title || t('messages.item'),
            donorName: selectedChat.user.full_name,
            suggestedDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
            suggestedPlace: t('messages.suggestPlace')
          });
          setShowConfirmationModal(true);
          break;
        case 'decline':
          messageContent = t('messages.actions.declined');
          break;
        case 'ask_more_info':
          messageContent = t('messages.actions.askMore');
          break;
      }

      const message = {
        sender_id: user?.id,
        receiver_id: selectedChat.user.id,
        content: messageContent,
        created_at: new Date().toISOString(),
        read: false,
        announcement_id: selectedChat.announcement?.id,
        message_type: 'request_action',
        metadata
      };

      const { error: sendError } = await supabase
        .from('messages')
        .insert([message]);

      if (sendError) throw sendError;

      loadMessages(selectedChat.id);
    } catch (error) {
      console.error('Error handling request action:', error);
      setError(t('messages.errors.requestAction'));
    }
  };

  const handleConfirmMeeting = async (date: string, place: string) => {
    if (!selectedChat) return;

    try {
      const message = {
        sender_id: user?.id,
        receiver_id: selectedChat.user.id,
        content: t('messages.meetingConfirmed', { date, place }),
        created_at: new Date().toISOString(),
        read: false,
        announcement_id: selectedChat.announcement?.id,
        message_type: 'meeting_confirmation',
        metadata: {
          meeting_date: date,
          meeting_place: place
        }
      };

      const { error: sendError } = await supabase
        .from('messages')
        .insert([message]);

      if (sendError) throw sendError;

      loadMessages(selectedChat.id);
      setShowConfirmationModal(false);
      setPendingRequest(null);
    } catch (error) {
      console.error('Error confirming meeting:', error);
      setError(t('messages.errors.confirmMeeting'));
    }
  };

  const handleCancelRequest = async () => {
    if (!selectedChat) return;

    try {
      const message = {
        sender_id: user?.id,
        receiver_id: selectedChat.user.id,
        content: t('messages.actions.canceled'),
        created_at: new Date().toISOString(),
        read: false,
        announcement_id: selectedChat.announcement?.id,
        message_type: 'text'
      };

      const { error: sendError } = await supabase
        .from('messages')
        .insert([message]);

      if (sendError) throw sendError;

      loadMessages(selectedChat.id);
      setShowConfirmationModal(false);
      setPendingRequest(null);
    } catch (error) {
      console.error('Error canceling request:', error);
      setError(t('messages.errors.cancelRequest'));
    }
  };

  const handleSubmitFeedback = async (rating: 'positive' | 'neutral' | 'negative', comment: string) => {
    if (!selectedChat) return;

    try {
      // Here you would save feedback to your database
      console.log('Feedback submitted:', { rating, comment, chatId: selectedChat.id });
      
      setShowFeedbackModal(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(t('messages.errors.submitFeedback'));
    }
  };

  // Calculate counts for each tab
  const donationsCount = chats.filter((chat) => {
    if (chat.announcement?.user_id) {
      return chat.announcement.user_id === user?.id;
    }
    return false;
  }).length;

  const requestsCount = chats.filter((chat) => {
    if (chat.announcement?.user_id) {
      return chat.announcement.user_id !== user?.id;
    }
    return false;
  }).length;

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.announcement?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Filter by tab: Donations = user is donor, Requests = user is beneficiary
    if (chat.announcement?.user_id) {
      if (activeTab === 'donations') {
        // User is the donor (they own the announcement)
        return chat.announcement.user_id === user?.id;
      } else {
        // User is the beneficiary (they're requesting)
        return chat.announcement.user_id !== user?.id;
      }
    }
    
    // If no announcement, show in both tabs or default to donations
    return activeTab === 'donations';
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 md:h-[calc(100vh-12rem)]">
            {/* Left Sidebar - Chat List */}
            <div className="md:col-span-3 lg:col-span-3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative flex items-center gap-2 mb-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('messages.searchPlaceholder')}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Filter className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Tabs for Donations and Requests */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('donations')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                      activeTab === 'donations'
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('messages.donations', 'Donations')}
                    {donationsCount > 0 && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        activeTab === 'donations'
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-600 text-white dark:bg-blue-500'
                      }`}>
                        {donationsCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                      activeTab === 'requests'
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('messages.requests', 'Requests')}
                    {requestsCount > 0 && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        activeTab === 'requests'
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-600 text-white dark:bg-blue-500'
                      }`}>
                        {requestsCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                  </div>
                ) : filteredChats.length > 0 ? (
                  filteredChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        selectedChat?.id === chat.id
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : ''
                      }`}
                    >
                      {/* Show item thumbnail if available, otherwise show user avatar */}
                      {chat.announcement?.photos?.[0] ? (
                        <OptimizedImage
                          src={chat.announcement.photos[0]}
                          alt={chat.announcement.title}
                          className={`w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-600 ${
                            chat.announcement.status === 'GIVEN_AWAY' ? 'blur-md' : ''
                          }`}
                          width={64}
                          height={64}
                          priority={false}
                          placeholder="blur"
                        />
                      ) : chat.user.avatar_url ? (
                        <OptimizedImage
                          src={chat.user.avatar_url}
                          alt={chat.user.full_name}
                          className="w-16 h-16 rounded-full ring-4 ring-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.6)]"
                          width={64}
                          height={64}
                          priority={false}
                          placeholder="blur"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {chat.announcement?.title || chat.user.full_name}
                          </h3>
                          {chat.last_message && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              {formatTime(chat.last_message.created_at)}
                            </span>
                          )}
                        </div>
                        {chat.user.full_name && chat.announcement && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 truncate">
                            {chat.user.full_name}
                          </p>
                        )}
                        {chat.last_message && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {chat.last_message.content}
                          </p>
                        )}
                        {chat.unread_count > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 mt-1">
                            {chat.unread_count} {t('messages.new')}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    {activeTab === 'donations' 
                      ? t('messages.emptyDonations', 'No donation conversations yet')
                      : t('messages.emptyRequests', 'No request conversations yet')}
                  </div>
                )}
              </div>
            </div>

            {/* Center - Chat Window */}
            <div className="md:col-span-9 lg:col-span-6 flex flex-col border-r border-gray-200 dark:border-gray-700 order-2 md:order-2">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedChat.user.avatar_url ? (
                        <OptimizedImage
                          src={selectedChat.user.avatar_url}
                          alt={selectedChat.user.full_name}
                          className="w-10 h-10 rounded-full ring-4 ring-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.6)]"
                          width={40}
                          height={40}
                          priority={false}
                          placeholder="blur"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                          {selectedChat.user.full_name}
                        </h2>
                        {selectedChat.user.last_seen && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('messages.lastSeen')} {formatTime(selectedChat.user.last_seen)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleDeleteConversation}
                        className="p-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title={t('messages.deleteConversation')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div key={message.id}>
                        {/* Regular Message */}
                        <div
                          className={`flex ${
                            message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              message.sender_id === user?.id
                                ? 'bg-blue-600 text-white dark:bg-blue-500'
                                : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                            }`}
                          >
                            <p>{message.content}</p>
                            <div
                              className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                                message.sender_id === user?.id
                                  ? 'text-blue-200 dark:text-blue-300'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              <span>{formatTime(message.created_at)}</span>
                              {message.sender_id === user?.id && (
                                message.read ? (
                                  <CheckCheck className="w-4 h-4" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons for Donors */}
                        {message.message_type === 'request_action' && 
                         message.sender_id !== user?.id && 
                         selectedChat?.announcement && (
                          <div className="flex justify-start mt-2">
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm">
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                💬 {t('messages.confirmPrompt')}
                              </p>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleRequestAction('accept')}
                                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  {t('messages.accept')}
                                </button>
                                <button
                                  onClick={() => handleRequestAction('ask_more_info')}
                                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  {t('messages.askMore')}
                                </button>
                                <button
                                  onClick={() => handleRequestAction('decline')}
                                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  {t('messages.decline')}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Meeting Confirmation Details */}
                        {message.message_type === 'meeting_confirmation' && message.metadata && (
                          <div className="flex justify-start mt-2">
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-green-800 dark:text-green-200 mb-2">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">{t('messages.meetingDetails')}</span>
                              </div>
                              <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-3 h-3" />
                                  <span>{message.metadata.meeting_date}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-3 h-3" />
                                  <span>{message.metadata.meeting_place}</span>
                                </div>
                              </div>
                              <div className="mt-3">
                                <button
                                  onClick={() => setShowFeedbackModal(true)}
                                  className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline"
                                >
                                  📍 {t('messages.rememberPublic')}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (!lacksSeedsForFirstMessage) {
                                sendMessage();
                              }
                            }
                          }}
                          placeholder={t('messages.inputPlaceholder')}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 p-3 resize-none"
                          rows={1}
                        />
                      </div>
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || lacksSeedsForFirstMessage}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center h-[42px]"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                    {lacksSeedsForFirstMessage && (
                      <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-300 font-medium">
                        {seedsEmptyMessage}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center max-w-md px-6">
                    {/* Two overlapping speech bubbles icon */}
                    <div className="relative mx-auto mb-6 w-24 h-24 flex items-center justify-center">
                      <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 absolute" />
                      <MessageCircle className="w-12 h-12 text-orange-500 dark:text-orange-400 absolute -top-2 -right-2" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mx-1"></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: '"Shadows Into Light", cursive' }}>
                      {t('messages.startConversation')} 👋
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                      {t('messages.startConversationDesc')}
                    </p>
                    <button
                      onClick={() => navigate('/search')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <Plus className="w-5 h-5" />
                      {t('messages.newMessage')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Item Details */}
            <div className="md:col-span-12 lg:col-span-3 flex flex-col bg-gray-50 dark:bg-gray-900/50 border-t md:border-t-0 lg:border-t-0 border-gray-200 dark:border-gray-700 order-3 lg:order-3 max-h-[50vh] md:max-h-none overflow-y-auto">
              {selectedChat?.announcement ? (
                <div className="p-6 space-y-4">
                  {/* Product Image */}
                  {selectedChat.announcement.photos?.[0] && (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md">
                      <OptimizedImage
                        src={selectedChat.announcement.photos[0]}
                        alt={selectedChat.announcement.title}
                        className={`w-full h-full ${
                          selectedChat.announcement.status === 'GIVEN_AWAY' ? 'blur-md' : ''
                        }`}
                        priority={false}
                        placeholder="blur"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}

                  {/* Item Name & Category */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedChat.announcement.title}
                    </h3>
                    {selectedChat.announcement.category && (
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                          {selectedChat.announcement.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Donor Profile Button */}
                  <button
                    onClick={() => {
                      if (selectedChat.announcement?.user_id) {
                        navigate(`/donor/${selectedChat.announcement.user_id}`);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <User className="w-5 h-5" />
                    {t('messages.sellerProfile', 'Donor Profile')}
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">
                      {t('messages.selectChatToViewItem', 'Select a conversation to view item details')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && pendingRequest && (
        <ConfirmationModal
          itemName={pendingRequest.itemName}
          donorName={pendingRequest.donorName}
          suggestedDate={pendingRequest.suggestedDate}
          suggestedPlace={pendingRequest.suggestedPlace}
          onClose={() => {
            setShowConfirmationModal(false);
            setPendingRequest(null);
          }}
          onConfirmMeeting={handleConfirmMeeting}
          onCancelRequest={handleCancelRequest}
        />
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedChat && (
        <FeedbackModal
          itemName={selectedChat.announcement?.title || t('messages.item')}
          donorName={selectedChat.user.full_name}
          onClose={() => setShowFeedbackModal(false)}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}
    </div>
  );
}