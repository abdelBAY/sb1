import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  Send,
  Image as ImageIcon,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  User,
  Check,
  CheckCheck,
  Package,
  CheckCircle,
  XCircle,
  MessageCircle,
  MapPin,
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import ConfirmationModal from '../components/ConfirmationModal';
import FeedbackModal from '../components/FeedbackModal';

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
  };
}

export default function Messages() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<{
    itemName: string;
    donorName: string;
    suggestedDate?: string;
    suggestedPlace?: string;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadChats();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChats = async () => {
    try {
      setLoading(true);
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          created_at,
          read,
          announcement_id,
          profiles!sender_id (
            id,
            full_name,
            avatar_url,
            last_seen
          )
        `)
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Group messages by chat
      const chatMap = new Map<string, Chat>();
      messages?.forEach((message: any) => {
        const otherUserId = message.sender_id === user?.id ? message.receiver_id : message.sender_id;
        const chatId = [user?.id, otherUserId].sort().join('-');

        if (!chatMap.has(chatId)) {
          chatMap.set(chatId, {
            id: chatId,
            user: {
              id: otherUserId,
              full_name: message.profiles.full_name,
              avatar_url: message.profiles.avatar_url,
              last_seen: message.profiles.last_seen
            },
            last_message: {
              content: message.content,
              created_at: message.created_at,
              read: message.read
            },
            unread_count: message.read ? 0 : 1,
            announcement: message.announcement_id ? {
              id: message.announcement_id,
              title: '', // We'll fetch this separately
              photos: []
            } : undefined
          });
        } else {
          const chat = chatMap.get(chatId)!;
          if (!message.read && message.sender_id !== user?.id) {
            chat.unread_count++;
          }
        }
      });

      setChats(Array.from(chatMap.values()));
    } catch (error) {
      console.error('Error loading chats:', error);
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      // Extract user IDs from chatId (format: "user1-user2" sorted)
      const [userId1, userId2] = chatId.split('-');
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId1},receiver_id.eq.${userId1},sender_id.eq.${userId2},receiver_id.eq.${userId2}`)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      setMessages(messages || []);

      // Mark messages as read
      const unreadMessages = messages?.filter(
        (m) => !m.read && m.receiver_id === user?.id
      );

      if (unreadMessages?.length) {
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadMessages.map((m) => m.id));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
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
        .insert([message]);

      if (sendError) throw sendError;

      setNewMessage('');
      loadMessages(selectedChat.id);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
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
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleRequestAction = async (action: 'accept' | 'decline' | 'ask_more_info') => {
    if (!selectedChat) return;

    try {
      let messageContent = '';
      let metadata: any = { action };

      switch (action) {
        case 'accept':
          messageContent = 'I accept your request! Let\'s arrange a meeting.';
          // Set up confirmation modal
          setPendingRequest({
            itemName: selectedChat.announcement?.title || 'Item',
            donorName: selectedChat.user.full_name,
            suggestedDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
            suggestedPlace: 'Please suggest a meeting place'
          });
          setShowConfirmationModal(true);
          break;
        case 'decline':
          messageContent = 'Thank you for your interest, but I\'m unable to fulfill this request at this time.';
          break;
        case 'ask_more_info':
          messageContent = 'I\'d like to know more about your request. Could you provide additional details?';
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
      setError('Failed to process request action');
    }
  };

  const handleConfirmMeeting = async (date: string, place: string) => {
    if (!selectedChat) return;

    try {
      const message = {
        sender_id: user?.id,
        receiver_id: selectedChat.user.id,
        content: `Meeting confirmed for ${date} at ${place}. Please confirm pickup details.`,
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
      setError('Failed to confirm meeting');
    }
  };

  const handleCancelRequest = async () => {
    if (!selectedChat) return;

    try {
      const message = {
        sender_id: user?.id,
        receiver_id: selectedChat.user.id,
        content: 'I\'ve decided to cancel this request. Thank you for your time.',
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
      setError('Failed to cancel request');
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
      setError('Failed to submit feedback');
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {/* Chat List */}
            <div className="border-r border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100vh-12rem)]">
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
                      {chat.user.avatar_url ? (
                        <img
                          src={chat.user.avatar_url}
                          alt={chat.user.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {chat.user.full_name}
                          </h3>
                          {chat.last_message && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(chat.last_message.created_at)}
                            </span>
                          )}
                        </div>
                        {chat.last_message && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {chat.last_message.content}
                          </p>
                        )}
                        {chat.announcement && (
                          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Package className="w-4 h-4 mr-1" />
                            {chat.announcement.title}
                          </div>
                        )}
                        {chat.unread_count > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 mt-1">
                            {chat.unread_count} new
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No messages found
                  </div>
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="col-span-2 lg:col-span-3 flex flex-col h-[calc(100vh-12rem)]">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedChat.user.avatar_url ? (
                        <img
                          src={selectedChat.user.avatar_url}
                          alt={selectedChat.user.full_name}
                          className="w-10 h-10 rounded-full object-cover"
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
                            Last seen {formatTime(selectedChat.user.last_seen)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreVertical className="w-5 h-5" />
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
                                💬 Please confirm meeting time and place.
                              </p>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleRequestAction('accept')}
                                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRequestAction('ask_more_info')}
                                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  Ask More Info
                                </button>
                                <button
                                  onClick={() => handleRequestAction('decline')}
                                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Decline
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
                                <span className="font-medium">Meeting Details</span>
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
                                  📍 Remember to meet in a public area.
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
                    <div className="flex items-end space-x-3">
                      <div className="flex-1">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          placeholder="Type a message..."
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 p-3 resize-none"
                          rows={1}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                          <ImageIcon className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Smile className="w-5 h-5" />
                        </button>
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Select a chat to start messaging
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Choose from your existing conversations or start a new one
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
          itemName={selectedChat.announcement?.title || 'Item'}
          donorName={selectedChat.user.full_name}
          onClose={() => setShowFeedbackModal(false)}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}
    </div>
  );
}