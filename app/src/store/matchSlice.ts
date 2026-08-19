import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MatchCard {
  profile: {
    id: string;
    userId: string;
    displayName: string;
    age: number;
    city: string;
    purposeStatement: string;
    lifeTags: string[];
    avatarUrl: string | null;
    isVerified?: boolean;
  };
  score: number;
}

export interface MutualMatch {
  id: string;
  userAId: string;
  userBId: string;
  compatScore: number;
  otherProfile: MatchCard['profile'];
}

interface MatchState {
  feed: MatchCard[];
  mutual: MutualMatch[];
  currentMatch: MatchCard | null;
  isLoading: boolean;
}

const initialState: MatchState = {
  feed: [],
  mutual: [],
  currentMatch: null,
  isLoading: false,
};

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setFeed: (s, a: PayloadAction<MatchCard[]>) => { s.feed = a.payload; },
    setMutual: (s, a: PayloadAction<MutualMatch[]>) => { s.mutual = a.payload; },
    setCurrentMatch: (s, a: PayloadAction<MatchCard | null>) => { s.currentMatch = a.payload; },
    removeFromFeed: (s, a: PayloadAction<string>) => {
      s.feed = s.feed.filter((m) => m.profile.userId !== a.payload);
    },
    setLoading: (s, a: PayloadAction<boolean>) => { s.isLoading = a.payload; },
  },
});

export const { setFeed, setMutual, setCurrentMatch, removeFromFeed, setLoading } = matchSlice.actions;
export default matchSlice.reducer;
