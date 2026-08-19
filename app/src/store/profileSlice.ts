import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  age: number;
  city: string;
  sect: string;
  education: string;
  profession: string;
  bio: string;
  purposeStatement: string;
  lifeTags: string[];
  priorityDeen: number;
  priorityEducation: number;
  priorityCareer: number;
  priorityFamily: number;
  priorityLocation: number;
  isPublished: boolean;
  isVerified: boolean;
  avatarUrl: string | null;
  completeness: number;
}

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (s, a: PayloadAction<Profile>) => { s.profile = a.payload; },
    setLoading: (s, a: PayloadAction<boolean>) => { s.isLoading = a.payload; },
    setError: (s, a: PayloadAction<string | null>) => { s.error = a.payload; },
    updatePurpose: (s, a: PayloadAction<{ purposeStatement: string; lifeTags: string[] }>) => {
      if (s.profile) Object.assign(s.profile, a.payload);
    },
    updatePriorities: (s, a: PayloadAction<Partial<Profile>>) => {
      if (s.profile) Object.assign(s.profile, a.payload);
    },
  },
});

export const { setProfile, setLoading, setError, updatePurpose, updatePriorities } = profileSlice.actions;
export default profileSlice.reducer;
