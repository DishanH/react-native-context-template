import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import { useAuth } from './AuthContext';
import { CommunityService } from '../lib/database/services';

/**
 * Enhanced User Profile for Community Features
 */
export interface CommunityProfile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  parentingSince: string; // YYYY-MM format
  children: Array<{
    ageRange: '0-1' | '1-3' | '3-5' | '5-8' | '8-12' | '12-18';
    nickname?: string;
  }>;
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    earnedAt: string;
    description: string;
  }>;
  stats: {
    helpfulCount: number;
    discussionsStarted: number;
    repliesGiven: number;
    weeklyStreak: number;
    joinedDate: string;
  };
  preferences: {
    isAnonymous: boolean;
    allowDirectMessages: boolean;
    notifyOnReply: boolean;
    notifyOnMention: boolean;
    showOnlineStatus: boolean;
  };
  lastSeen: string;
  isOnline: boolean;
}

/**
 * Direct Message Types
 */
export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  messageType: 'text' | 'supportRequest' | 'celebrationShare';
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: DirectMessage;
  lastActivity: string;
  isArchived: boolean;
  unreadCount: number;
}

/**
 * Notification Types
 */
export interface CommunityNotification {
  id: string;
  userId: string;
  type: 'reply' | 'mention' | 'directMessage' | 'badge' | 'weeklyPrompt' | 'supportRequest';
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  timestamp: string;
  metadata?: {
    discussionId?: string;
    senderId?: string;
    badgeId?: string;
  };
}

/**
 * Available Badges
 */
const AVAILABLE_BADGES = [
  {
    id: 'first_post',
    name: 'First Steps',
    icon: 'baby',
    color: '#10B981',
    description: 'Shared your first post in the community',
    criteria: 'firstPost'
  },
  {
    id: 'helpful_parent',
    name: 'Helpful Parent',
    icon: 'heart',
    color: '#EF4444',
    description: 'Received 10+ helpful reactions',
    criteria: 'helpfulCount:10'
  },
  {
    id: 'conversation_starter',
    name: 'Conversation Starter',
    icon: 'comments',
    color: '#3B82F6',
    description: 'Started 5+ discussions',
    criteria: 'discussionsStarted:5'
  },
  {
    id: 'supportive_friend',
    name: 'Supportive Friend',
    icon: 'hands-helping',
    color: '#F59E0B',
    description: 'Replied to 20+ discussions',
    criteria: 'repliesGiven:20'
  },
  {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    icon: 'fire',
    color: '#DC2626',
    description: 'Active for 4+ weeks in a row',
    criteria: 'weeklyStreak:4'
  },
  {
    id: 'mentor',
    name: 'Community Mentor',
    icon: 'award',
    color: '#8B5CF6',
    description: 'Helped 50+ parents with advice',
    criteria: 'helpfulCount:50'
  }
];

/**
 * Community Context Type
 */
type CommunityContextType = {
  // Profile management
  profile: CommunityProfile | null;
  isProfileLoading: boolean;
  updateProfile: (updates: Partial<CommunityProfile>) => Promise<void>;
  createProfile: (initialData: Partial<CommunityProfile>) => Promise<void>;

  // Messaging
  conversations: Conversation[];
  messages: { [conversationId: string]: DirectMessage[] };
  isMessagingLoading: boolean;
  sendMessage: (receiverId: string, content: string, type?: DirectMessage['messageType']) => Promise<void>;
  getConversation: (userId: string) => Promise<Conversation>;
  markMessagesAsRead: (conversationId: string) => Promise<void>;

  // Notifications
  notifications: CommunityNotification[];
  unreadNotificationCount: number;
  isNotificationsLoading: boolean;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;

  // Badges & Achievements
  availableBadges: typeof AVAILABLE_BADGES;
  checkAndAwardBadges: () => Promise<void>;

  // Community stats
  onlineUsers: number;
  totalMembers: number;

  // Utility
  refreshCommunityData: () => Promise<void>;
};

/**
 * Create the Community Context
 */
const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  PROFILE: 'community_profile',
  CONVERSATIONS: 'community_conversations',
  MESSAGES: 'community_messages',
  NOTIFICATIONS: 'community_notifications',
};

/**
 * Community Provider Component
 */
export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Services
  const [communityService] = useState(() => new CommunityService());

  // State
  const [profile, setProfile] = useState<CommunityProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{ [conversationId: string]: DirectMessage[] }>({});
  const [isMessagingLoading, setIsMessagingLoading] = useState(false);
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [onlineUsers] = useState(156); // Mock data
  const [totalMembers] = useState(1234); // Mock data

  /**
   * Load profile data from Supabase
   */
  useEffect(() => {
    const loadProfile = async () => {

      //console.log('CommunityContext - user:', user);
      //console.log('CommunityContext - user.id type:', typeof user?.id);
      //console.log('CommunityContext - user.id value:', user?.id);

      if (!user?.isAuthenticated || !user.id) {
        setProfile(null);
        setIsProfileLoading(false);
        return;
      }

      try {
        setIsProfileLoading(true);
        const response = await communityService.getOrCreateProfile(user.id);
        const supabaseProfile = response.data;
        const error = response.error;

        if (error) {
          console.error('Failed to load community profile:', error);
          setProfile(null);
        } else if (supabaseProfile) {
          // Convert Supabase profile to local format with proper type casting
          const localProfile: CommunityProfile = {
            id: supabaseProfile.id,
            userId: supabaseProfile.user_id,
            displayName: supabaseProfile.display_name,
            bio: supabaseProfile.bio || '',
            avatar: supabaseProfile.avatar || undefined,
            parentingSince: supabaseProfile.parenting_since,
            children: Array.isArray(supabaseProfile.children) ? supabaseProfile.children as any[] : [],
            badges: Array.isArray(supabaseProfile.badges) ? supabaseProfile.badges as any[] : [],
            stats: (typeof supabaseProfile.stats === 'object' && supabaseProfile.stats !== null)
              ? supabaseProfile.stats as any
              : {
                helpfulCount: 0,
                discussionsStarted: 0,
                repliesGiven: 0,
                weeklyStreak: 0,
                joinedDate: new Date().toISOString().split('T')[0]
              },
            preferences: (typeof supabaseProfile.preferences === 'object' && supabaseProfile.preferences !== null)
              ? supabaseProfile.preferences as any
              : {
                isAnonymous: false,
                allowDirectMessages: true,
                notifyOnReply: true,
                notifyOnMention: true,
                showOnlineStatus: true
              },
            lastSeen: supabaseProfile.last_seen || new Date().toISOString(),
            isOnline: supabaseProfile.is_online || false
          };
          setProfile(localProfile);
        }
      } catch (error) {
        console.error('Failed to load community profile:', error);
        setProfile(null);
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadProfile();
  }, [user, communityService]);

  /**
   * Load conversations and messages
   */
  useEffect(() => {
    const loadMessagingData = async () => {
      if (!user?.isAuthenticated) return;

      try {
        setIsMessagingLoading(true);
        const [savedConversations, savedMessages] = await Promise.all([
          storage.get(STORAGE_KEYS.CONVERSATIONS, true),
          storage.get(STORAGE_KEYS.MESSAGES, true)
        ]);

        if (savedConversations) setConversations(savedConversations);
        if (savedMessages) setMessages(savedMessages);
      } catch (error) {
        console.error('Failed to load messaging data:', error);
      } finally {
        setIsMessagingLoading(false);
      }
    };

    loadMessagingData();
  }, [user]);

  /**
   * Load notifications
   */
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.isAuthenticated) return;

      try {
        setIsNotificationsLoading(true);
        const savedNotifications = await storage.get(STORAGE_KEYS.NOTIFICATIONS, true);
        if (savedNotifications) {
          setNotifications(savedNotifications.filter((n: CommunityNotification) => n.userId === user.id));
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setIsNotificationsLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  /**
   * Create a new community profile
   */
  const createProfile = async (initialData: Partial<CommunityProfile>) => {
    if (!user?.isAuthenticated || !user.id) return;

    try {
      const supabaseData = {
        display_name: initialData.displayName || user.name || 'Community Member',
        bio: initialData.bio || '',
        avatar: initialData.avatar,
        parenting_since: initialData.parentingSince || new Date().toISOString().substring(0, 7),
        children: initialData.children || [],
        badges: [
          {
            id: 'new_member',
            name: 'Welcome!',
            icon: 'heart',
            color: '#F59E0B',
            earnedAt: new Date().toISOString(),
            description: 'Joined the community'
          }
        ],
        stats: {
          helpfulCount: 0,
          discussionsStarted: 0,
          repliesGiven: 0,
          weeklyStreak: 0,
          joinedDate: new Date().toISOString(),
        },
        preferences: {
          isAnonymous: false,
          allowDirectMessages: true,
          notifyOnReply: true,
          notifyOnMention: true,
          showOnlineStatus: true,
          ...initialData.preferences,
        }
      };

      const response = await communityService.getOrCreateProfile(user.id, supabaseData);
      const supabaseProfile = response.data;
      const error = response.error;

      if (error) {
        console.error('Failed to create profile:', error);
        return;
      }

      if (supabaseProfile) {
        // Convert to local format and update state with proper type casting
        const localProfile: CommunityProfile = {
          id: supabaseProfile.id,
          userId: supabaseProfile.user_id,
          displayName: supabaseProfile.display_name,
          bio: supabaseProfile.bio || '',
          avatar: supabaseProfile.avatar || undefined,
          parentingSince: supabaseProfile.parenting_since,
          children: Array.isArray(supabaseProfile.children) ? supabaseProfile.children as any[] : [],
          badges: Array.isArray(supabaseProfile.badges) ? supabaseProfile.badges as any[] : [],
          stats: (typeof supabaseProfile.stats === 'object' && supabaseProfile.stats !== null)
            ? supabaseProfile.stats as any
            : supabaseData.stats,
          preferences: (typeof supabaseProfile.preferences === 'object' && supabaseProfile.preferences !== null)
            ? supabaseProfile.preferences as any
            : supabaseData.preferences,
          lastSeen: supabaseProfile.last_seen || new Date().toISOString(),
          isOnline: supabaseProfile.is_online || false
        };
        setProfile(localProfile);

        // Award first badge
        await checkAndAwardBadges();
      }
    } catch (error) {
      console.error('Failed to create profile:', error);
    }
  };

  /**
   * Update profile
   */
  const updateProfile = async (updates: Partial<CommunityProfile>) => {
    if (!profile || !user?.id) return;

    try {
      // Convert local updates to Supabase format
      const supabaseUpdates: any = {};
      if (updates.displayName) supabaseUpdates.display_name = updates.displayName;
      if (updates.bio !== undefined) supabaseUpdates.bio = updates.bio;
      if (updates.avatar !== undefined) supabaseUpdates.avatar = updates.avatar;
      if (updates.parentingSince) supabaseUpdates.parenting_since = updates.parentingSince;
      if (updates.children) supabaseUpdates.children = updates.children;
      if (updates.badges) supabaseUpdates.badges = updates.badges;
      if (updates.stats) supabaseUpdates.stats = updates.stats;
      if (updates.preferences) supabaseUpdates.preferences = updates.preferences;

      const response = await communityService.updateProfile(user.id, supabaseUpdates);
      const updatedSupabaseProfile = response.data;
      const error = response.error;

      if (error) {
        console.error('Failed to update profile:', error);
        return;
      }

      if (updatedSupabaseProfile) {
        // Convert back to local format and update state with proper type casting
        const updatedLocalProfile: CommunityProfile = {
          id: updatedSupabaseProfile.id,
          userId: updatedSupabaseProfile.user_id,
          displayName: updatedSupabaseProfile.display_name,
          bio: updatedSupabaseProfile.bio || '',
          avatar: updatedSupabaseProfile.avatar || undefined,
          parentingSince: updatedSupabaseProfile.parenting_since,
          children: Array.isArray(updatedSupabaseProfile.children) ? updatedSupabaseProfile.children as any[] : [],
          badges: Array.isArray(updatedSupabaseProfile.badges) ? updatedSupabaseProfile.badges as any[] : [],
          stats: (typeof updatedSupabaseProfile.stats === 'object' && updatedSupabaseProfile.stats !== null)
            ? updatedSupabaseProfile.stats as any
            : profile.stats,
          preferences: (typeof updatedSupabaseProfile.preferences === 'object' && updatedSupabaseProfile.preferences !== null)
            ? updatedSupabaseProfile.preferences as any
            : profile.preferences,
          lastSeen: updatedSupabaseProfile.last_seen || new Date().toISOString(),
          isOnline: updatedSupabaseProfile.is_online || false
        };
        setProfile(updatedLocalProfile);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  /**
   * Send a direct message
   */
  const sendMessage = async (receiverId: string, content: string, type: DirectMessage['messageType'] = 'text') => {
    if (!user || !profile) return;

    const conversationId = [user.id, receiverId].sort().join('_');
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    const newMessage: DirectMessage = {
      id: messageId,
      conversationId,
      senderId: user.id,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
      messageType: type,
    };

    // Update messages
    const updatedMessages = {
      ...messages,
      [conversationId]: [...(messages[conversationId] || []), newMessage],
    };
    setMessages(updatedMessages);
    await storage.set(STORAGE_KEYS.MESSAGES, updatedMessages);

    // Update or create conversation
    let updatedConversations = [...conversations];
    const existingConversationIndex = conversations.findIndex(c => c.id === conversationId);

    if (existingConversationIndex >= 0) {
      updatedConversations[existingConversationIndex] = {
        ...updatedConversations[existingConversationIndex],
        lastMessage: newMessage,
        lastActivity: newMessage.timestamp,
      };
    } else {
      updatedConversations.push({
        id: conversationId,
        participants: [user.id, receiverId],
        lastMessage: newMessage,
        lastActivity: newMessage.timestamp,
        isArchived: false,
        unreadCount: 0,
      });
    }

    setConversations(updatedConversations);
    await storage.set(STORAGE_KEYS.CONVERSATIONS, updatedConversations);

    // Create notification for receiver
    const notification: CommunityNotification = {
      id: `notif_${Date.now()}`,
      userId: receiverId,
      type: 'directMessage',
      title: 'New Message',
      message: `${profile.displayName} sent you a message`,
      isRead: false,
      timestamp: new Date().toISOString(),
      metadata: { senderId: user.id },
    };

    const allNotifications = [...notifications, notification];
    setNotifications(allNotifications);
    await storage.set(STORAGE_KEYS.NOTIFICATIONS, allNotifications);
  };

  /**
   * Get or create conversation with a user
   */
  const getConversation = async (userId: string): Promise<Conversation> => {
    if (!user) throw new Error('User not authenticated');

    const conversationId = [user.id, userId].sort().join('_');
    let conversation = conversations.find(c => c.id === conversationId);

    if (!conversation) {
      conversation = {
        id: conversationId,
        participants: [user.id, userId],
        lastActivity: new Date().toISOString(),
        isArchived: false,
        unreadCount: 0,
      };

      const updatedConversations = [...conversations, conversation];
      setConversations(updatedConversations);
      await storage.set(STORAGE_KEYS.CONVERSATIONS, updatedConversations);
    }

    return conversation;
  };

  /**
   * Mark messages as read
   */
  const markMessagesAsRead = async (conversationId: string) => {
    const conversationMessages = messages[conversationId] || [];
    const updatedMessages = conversationMessages.map(msg => ({ ...msg, isRead: true }));

    const allUpdatedMessages = {
      ...messages,
      [conversationId]: updatedMessages,
    };

    setMessages(allUpdatedMessages);
    await storage.set(STORAGE_KEYS.MESSAGES, allUpdatedMessages);

    // Update conversation unread count
    const updatedConversations = conversations.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    );
    setConversations(updatedConversations);
    await storage.set(STORAGE_KEYS.CONVERSATIONS, updatedConversations);
  };

  /**
   * Mark notification as read
   */
  const markNotificationAsRead = async (notificationId: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    );
    setNotifications(updatedNotifications);
    await storage.set(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
  };

  /**
   * Mark all notifications as read
   */
  const markAllNotificationsAsRead = async () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }));
    setNotifications(updatedNotifications);
    await storage.set(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
  };

  /**
   * Check and award badges based on user activity
   */
  const checkAndAwardBadges = async () => {
    if (!profile) return;

    const newBadges: CommunityProfile['badges'] = [...profile.badges];
    let hasNewBadges = false;

    // Check each badge criteria
    AVAILABLE_BADGES.forEach(badgeTemplate => {
      const alreadyHas = profile.badges.some(b => b.id === badgeTemplate.id);
      if (alreadyHas) return;

      let shouldAward = false;

      switch (badgeTemplate.criteria) {
        case 'firstPost':
          shouldAward = profile.stats.discussionsStarted > 0;
          break;
        case 'helpfulCount:10':
          shouldAward = profile.stats.helpfulCount >= 10;
          break;
        case 'discussionsStarted:5':
          shouldAward = profile.stats.discussionsStarted >= 5;
          break;
        case 'repliesGiven:20':
          shouldAward = profile.stats.repliesGiven >= 20;
          break;
        case 'weeklyStreak:4':
          shouldAward = profile.stats.weeklyStreak >= 4;
          break;
        case 'helpfulCount:50':
          shouldAward = profile.stats.helpfulCount >= 50;
          break;
      }

      if (shouldAward) {
        newBadges.push({
          id: badgeTemplate.id,
          name: badgeTemplate.name,
          icon: badgeTemplate.icon,
          color: badgeTemplate.color,
          earnedAt: new Date().toISOString(),
          description: badgeTemplate.description,
        });
        hasNewBadges = true;

        // Create notification for new badge
        const notification: CommunityNotification = {
          id: `notif_badge_${Date.now()}`,
          userId: profile.userId,
          type: 'badge',
          title: 'New Badge Earned!',
          message: `You earned the "${badgeTemplate.name}" badge!`,
          isRead: false,
          timestamp: new Date().toISOString(),
          metadata: { badgeId: badgeTemplate.id },
        };

        const allNotifications = [...notifications, notification];
        setNotifications(allNotifications);
        storage.set(STORAGE_KEYS.NOTIFICATIONS, allNotifications);
      }
    });

    if (hasNewBadges) {
      const updatedProfile = { ...profile, badges: newBadges };
      setProfile(updatedProfile);
      await storage.set(STORAGE_KEYS.PROFILE, updatedProfile);
    }
  };

  /**
   * Refresh all community data
   */
  const refreshCommunityData = async () => {
    // In a real app, this would fetch fresh data from the server
    // For now, just check for new badges
    await checkAndAwardBadges();
  };

  /**
   * Calculate unread notification count
   */
  const unreadNotificationCount = notifications.filter(n => !n.isRead && n.userId === user?.id).length;

  /**
   * Context value
   */
  const value: CommunityContextType = {
    // Profile management
    profile,
    isProfileLoading,
    updateProfile,
    createProfile,

    // Messaging
    conversations,
    messages,
    isMessagingLoading,
    sendMessage,
    getConversation,
    markMessagesAsRead,

    // Notifications
    notifications: notifications.filter(n => n.userId === user?.id),
    unreadNotificationCount,
    isNotificationsLoading,
    markNotificationAsRead,
    markAllNotificationsAsRead,

    // Badges & Achievements
    availableBadges: AVAILABLE_BADGES,
    checkAndAwardBadges,

    // Community stats
    onlineUsers,
    totalMembers,

    // Utility
    refreshCommunityData,
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

/**
 * Hook for using the Community Context
 */
export const useCommunity = (): CommunityContextType => {
  const context = useContext(CommunityContext);

  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }

  return context;
}; 