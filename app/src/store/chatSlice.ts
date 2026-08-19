import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  matchId: string;
  waliEmail: string | null;
  isActive: boolean;
  messages: Message[];
  otherProfile?: {
    displayName: string;
    initials: string;
    compatScore?: number;
  };
}

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  typingUsers: Record<string, boolean>;
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  typingUsers: {},
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (s, a: PayloadAction<Conversation[]>) => { s.conversations = a.payload; },
    setActiveConversation: (s, a: PayloadAction<Conversation | null>) => { s.activeConversation = a.payload; },
    setMessages: (s, a: PayloadAction<Message[]>) => { s.messages = a.payload; },
    addMessage: (s, a: PayloadAction<Message>) => { s.messages.push(a.payload); },
    setTyping: (s, a: PayloadAction<{ userId: string; typing: boolean }>) => {
      s.typingUsers[a.payload.userId] = a.payload.typing;
    },
  },
});

export const { setConversations, setActiveConversation, setMessages, addMessage, setTyping } = chatSlice.actions;
export default chatSlice.reducer;
