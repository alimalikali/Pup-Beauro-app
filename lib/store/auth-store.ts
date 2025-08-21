import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api/axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/auth/login', { email, password });
          const { user } = response.data;
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Force a page reload to ensure middleware picks up the new auth state
          window.location.href = '/dashboard';
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (userData: any) => {
        try {
          set({ isLoading: true, error: null });
          
          // Handle Google authentication
          if (userData.googleAccessToken) {
            const response = await api.post('/auth/google', userData);
            const { user } = response.data;
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            
            return;
          }
          
          // Handle regular registration
          const response = await api.post('/auth/register', userData);
          const { user } = response.data;
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Force a page reload to ensure middleware picks up the new auth state
          window.location.href = '/dashboard';
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
          
          // Force a page reload to ensure middleware picks up the new auth state
          window.location.href = '/auth/login';
        } catch (error) {
          console.error('Logout error:', error);
          throw error;
        }
      },

      updateUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 