import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  position?: 'top' | 'bottom';
}

function createToastStore() {
  const { subscribe, update } = writable<ToastMessage[]>([]);
  
  // Generate a unique ID for each toast
  function generateId(): string {
    return `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  
  const store = {
    subscribe,
    
    // Add a new toast
    add: (message: string, type: ToastType = 'info', duration: number = 3000, position: 'top' | 'bottom' = 'bottom') => {
      const id = generateId();
      const toast: ToastMessage = { id, message, type, duration, position };
      
      update(toasts => [...toasts, toast]);
      
      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          update(toasts => toasts.filter(t => t.id !== id));
        }, duration);
      }
      
      return id;
    },
    
    // Remove a toast by ID
    remove: (id: string) => {
      update(toasts => toasts.filter(t => t.id !== id));
    },
    
    // Clear all toasts
    clear: () => {
      update(() => []);
    }
  };
  
  // Add convenience methods
  return {
    ...store,
    
    // Convenience methods for different toast types
    success: (message: string, duration?: number, position?: 'top' | 'bottom') => {
      return store.add(message, 'success', duration, position);
    },
    
    error: (message: string, duration?: number, position?: 'top' | 'bottom') => {
      return store.add(message, 'error', duration, position);
    },
    
    warning: (message: string, duration?: number, position?: 'top' | 'bottom') => {
      return store.add(message, 'warning', duration, position);
    },
    
    info: (message: string, duration?: number, position?: 'top' | 'bottom') => {
      return store.add(message, 'info', duration, position);
    }
  };
}

export const toastStore = createToastStore();