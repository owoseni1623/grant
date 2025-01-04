import React, { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Notification Types Enum
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

// Notification Interface
export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

// Context Interface
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType, duration?: number) => void;
  removeNotification: (id: string) => void;
}

// Create Notification Context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Notification Provider Component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    message: string, 
    type: NotificationType = NotificationType.INFO, 
    duration = 5000
  ) => {
    const id = uuidv4();
    const newNotification: Notification = { id, message, type, duration };
    
    setNotifications((prev) => [...prev, newNotification]);

    // Automatically remove notification after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Custom Hook for Notifications
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Notification Container Component
const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useContext(NotificationContext)!;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

// Individual Notification Item Component
const NotificationItem: React.FC<{ 
  notification: Notification, 
  onClose: () => void 
}> = ({ notification, onClose }) => {
  const { message, type } = notification;

  // Tailwind CSS classes for different notification types
  const typeStyles = {
    [NotificationType.SUCCESS]: 'bg-green-500 text-white',
    [NotificationType.ERROR]: 'bg-red-500 text-white',
    [NotificationType.WARNING]: 'bg-yellow-500 text-black',
    [NotificationType.INFO]: 'bg-blue-500 text-white'
  };

  return (
    <div 
      className={`
        ${typeStyles[type]} 
        px-4 py-3 rounded-lg shadow-lg 
        flex items-center justify-between 
        animate-slide-in-right
        w-72 max-w-md
      `}
    >
      <div className="flex items-center">
        <span className="mr-2">{message}</span>
      </div>
      <button 
        onClick={onClose} 
        className="ml-4 hover:opacity-75 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationProvider;