import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  needsOnboarding: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (s, a: PayloadAction<boolean>) => { s.isLoading = a.payload; },
    setError: (s, a: PayloadAction<string | null>) => { s.error = a.payload; },
    loginSuccess: (s, a: PayloadAction<{ user: AuthUser; token: string }>) => {
      s.user = a.payload.user;
      s.token = a.payload.token;
      s.isAuthenticated = true;
      s.needsOnboarding = false;
      s.error = null;
      s.isLoading = false;
    },
    registerSuccess: (s, a: PayloadAction<{ user: AuthUser; token: string }>) => {
      s.user = a.payload.user;
      s.token = a.payload.token;
      s.isAuthenticated = true;
      s.needsOnboarding = true;
      s.error = null;
      s.isLoading = false;
    },
    completeOnboarding: (s) => {
      s.needsOnboarding = false;
    },
    logout: (s) => {
      s.user = null;
      s.token = null;
      s.isAuthenticated = false;
      s.needsOnboarding = false;
    },
  },
});

export const { setLoading, setError, loginSuccess, registerSuccess, completeOnboarding, logout } = authSlice.actions;
export default authSlice.reducer;
