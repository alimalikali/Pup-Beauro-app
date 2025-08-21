import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

// User queries
export function useUserUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData: any) => {
      try {
        const response = await api.patch('/profile/update', userData);
        if (!response.data.ok) {
          throw new Error(response.data.message || 'Failed to update profile');
        }
        return response.data;
      } catch (error: any) {
        console.error('Profile update mutation error:', {
          response: error.response?.data,
          message: error.message,
          stack: error.stack
        });
        throw new Error(error.response?.data?.message || error.message || 'Failed to update profile');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}`);
      return data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: any) => {
      const { data } = await api.put(`/users/profile`, userData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user', data.id], data);
    },
  });
}

// Matches queries
export function useMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data } = await api.get('/matches');
      return data;
    },
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (matchData: any) => {
      const { data } = await api.post('/matches', matchData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}

// Subscription queries
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data } = await api.get('/subscription/plans');
      return data;
    },
  });
}

export function useUserSubscription() {
  return useQuery({
    queryKey: ['user-subscription'],
    queryFn: async () => {
      const { data } = await api.get('/subscription/current');
      return data;
    },
  });
}

export function useSubscribe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (subscriptionData: any) => {
      const { data } = await api.post('/subscription/subscribe', subscriptionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
    },
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (subscriptionData: any) => {
      const { data } = await api.post('/subscriptions', subscriptionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
    },
  });
}

export function useCurrentUserProfile() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await api.get('/profile/me');
      return data;
    },
  });
} 