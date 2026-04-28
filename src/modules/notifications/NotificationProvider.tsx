'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { PermissionPrompt } from './components/PermissionPrompt';

interface NotificationContextType {
  token: string | null;
  requestPermission: () => Promise<void>;
  notifications: any[];
  unreadCount: number;
  permissionStatus: NotificationPermission;
  playNotificationSound: (type?: 'order' | 'alert') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const supabase = createClient();

  // Audio helper
  const playNotificationSound = (type: 'order' | 'alert' = 'alert') => {
    try {
      const audio = new Audio(type === 'order' ? '/sounds/cash-register.mp3' : '/sounds/alert.mp3');
      audio.play();
    } catch (err) {
      console.warn('Audio playback failed:', err);
    }
  };

  // Load notification history and subscribe to Realtime
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    };

    fetchNotifications();

    // Subscribe to new notifications via Supabase Realtime
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Play sound
          playNotificationSound(payload.new.type === 'order' ? 'order' : 'alert');

          // Show Toast for foreground notifications
          toast(payload.new.title, {
            description: payload.new.body,
            action: {
              label: 'Ver',
              onClick: () => console.log('Notification clicked'),
            },
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Request permission and get Token
  const requestPermission = async () => {
    if (!messaging) return;

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (currentToken) {
          setToken(currentToken);
          
          // Save token to profile
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('profiles')
              .update({ fcm_token: currentToken })
              .eq('id', user.id);
          }
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  // Sync initial permission status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Handle foreground FCM messages
  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      token, 
      requestPermission, 
      notifications, 
      unreadCount, 
      permissionStatus,
      playNotificationSound 
    }}>
      <PermissionPrompt />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
