import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, FlatList, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MeshBackground } from '@/components/layout/MeshBackground';
import { AvatarCircle } from '@/components/ui/AvatarCircle';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, FontSize, Gradients, Radius, Spacing } from '@/constants';
import { chatApi } from '@/services/api';
import { connectSocket, joinConversation, sendSocketMessage, emitTyping, emitStopTyping, getSocket } from '@/services/socket';
import { useAppDispatch, useAppSelector } from '@/store';
import { setMessages, addMessage, Message } from '@/store/chatSlice';

const STARTERS = [
  "What goal are you working on?",
  "How do you balance deen + career?",
  "What does home mean to you?",
  "What's your morning routine?",
];

interface Props {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ Chat: { matchId?: string; conversationId?: string; profile: any } }, 'Chat'>;
}

function initials(name: string) {
  return name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '??';
}

export default function ChatScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { profile, conversationId: initialConvId } = route.params;

  const token = useAppSelector((s) => s.auth.token);
  const userId = useAppSelector((s) => s.auth.user?.id);
  const messages = useAppSelector((s) => s.chat.messages);

  const [convId] = useState(initialConvId ?? null);
  const [input, setInput] = useState('');
  const [bannerVisible, setBannerVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const flatRef = useRef<FlatList>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Guard: if no real conversationId was passed, bail out gracefully.
  useEffect(() => {
    if (!convId) {
      Alert.alert('Not ready', 'Conversation not ready yet.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [convId, navigation]);

  useEffect(() => {
    // Socket should already be connected via auth flow; ensure it for resilience.
    if (token) connectSocket(token);

    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [token]);

  useEffect(() => {
    if (!convId) return;
    loadMessages();
    joinConversation(convId);

    const socket = getSocket();
    socket?.on('new_message', (msg: Message) => dispatch(addMessage(msg)));
    socket?.on('user_typing', () => setIsTyping(true));
    socket?.on('user_stop_typing', () => setIsTyping(false));

    return () => {
      socket?.off('new_message');
      socket?.off('user_typing');
      socket?.off('user_stop_typing');
    };
  }, [convId]);

  const loadMessages = async () => {
    if (!convId) return;
    try {
      const msgs = await chatApi.getMessages(convId) as Message[];
      dispatch(setMessages(msgs));
    } catch {
      dispatch(setMessages([]));
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !convId) return;
    setInput('');

    const optimistic: Message = {
      id: `local-${Date.now()}`,
      conversationId: convId,
      senderId: userId ?? '',
      content: text,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    dispatch(addMessage(optimistic));

    try {
      await sendSocketMessage(convId, text);
    } catch {
      Alert.alert('Send failed', 'Could not send message. Check your connection.');
    }

    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleInputChange = (text: string) => {
    setInput(text);
    if (convId) {
      emitTyping(convId);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => emitStopTyping(convId), 2000);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const sent = item.senderId === userId;

    return (
      <View style={[styles.bubble, sent ? styles.bubbleSent : styles.bubbleRecv]}>
        <Text style={[styles.bubbleText, sent && styles.bubbleTextSent]}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MeshBackground />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Top bar */}
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <AvatarCircle initials={initials(profile?.displayName ?? '')} size={40} />
          <View style={styles.topBarInfo}>
            <Text style={styles.topBarName}>{profile?.displayName ?? 'Match'}</Text>
            <View style={styles.topBarMeta}>
              <Text style={styles.verified}>Verified ✓</Text>
              <Text style={styles.dot}> · </Text>
              <Text style={styles.matchPct}>{(route.params as any)?.card?.score ?? 94}% purpose match</Text>
            </View>
          </View>
        </View>

        {/* Covenant banner */}
        {bannerVisible && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              ♡ Both expressed interest — keep this purposeful and blessed.
            </Text>
            <Pressable onPress={() => setBannerVisible(false)}>
              <Text style={styles.bannerX}>×</Text>
            </Pressable>
          </View>
        )}

        {/* Messages */}
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyMessages}>
              <Text style={styles.emptyMessagesText}>
                Say assalamu alaikum and start the conversation.
              </Text>
            </View>
          }
          ListFooterComponent={
            isTyping ? (
              <View style={[styles.bubble, styles.bubbleRecv, { opacity: 0.6 }]}>
                <Text style={styles.bubbleText}>typing…</Text>
              </View>
            ) : null
          }
        />

        {/* Conversation starters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.startersWrap}
          contentContainerStyle={styles.starters}
        >
          {STARTERS.map((s) => (
            <Pressable key={s} style={styles.starterPill} onPress={() => setInput(s)}>
              <Text style={styles.starterText}>{s}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Input bar */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={handleInputChange}
            placeholder="Write a thoughtful message…"
            placeholderTextColor={Colors.textSoft}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline={false}
          />
          <Pressable style={styles.sendBtn} onPress={handleSend}>
            <LinearGradient colors={Gradients.primary} style={styles.sendBtnGrad}>
              <Text style={styles.sendIcon}>➤</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  topBar: {
    paddingHorizontal: Spacing.md, paddingBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.7)',
    zIndex: 10,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 28, color: Colors.pinkHot, fontFamily: 'Inter_700Bold' },
  topBarInfo: { flex: 1 },
  topBarName: { fontSize: FontSize.base, fontFamily: 'Inter_700Bold', color: Colors.textDark },
  topBarMeta: { flexDirection: 'row', alignItems: 'center' },
  verified: { fontSize: FontSize.sm, color: '#16a34a', fontFamily: 'Inter_600SemiBold' },
  dot: { fontSize: FontSize.sm, color: Colors.textSoft },
  matchPct: { fontSize: FontSize.sm, color: Colors.pinkHot, fontFamily: 'Inter_700Bold' },
  banner: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    marginHorizontal: Spacing.md, marginVertical: 8,
    padding: Spacing.md,
    backgroundColor: 'rgba(255,240,244,0.85)',
    borderLeftWidth: 3, borderLeftColor: Colors.pinkHot,
    borderRadius: 0, borderTopRightRadius: 16, borderBottomRightRadius: 16,
    gap: 8,
  },
  bannerText: { flex: 1, fontSize: FontSize.md, fontStyle: 'italic', color: Colors.textMid, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  bannerX: { fontSize: 18, color: Colors.textSoft, lineHeight: 20 },
  messagesList: { padding: Spacing.md, gap: 10, paddingBottom: 8, flexGrow: 1 },
  emptyMessages: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl,
  },
  emptyMessagesText: {
    textAlign: 'center', color: Colors.textSoft,
    fontFamily: 'Inter_500Medium', fontSize: FontSize.md, lineHeight: 22,
  },
  bubble: {
    maxWidth: '78%', borderRadius: 20,
    paddingVertical: 11, paddingHorizontal: 14,
  },
  bubbleRecv: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.92)',
    borderBottomLeftRadius: 6,
  },
  bubbleSent: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.pinkHot,
    borderBottomRightRadius: 6,
  },
  bubbleText: { fontSize: FontSize.body, lineHeight: 21, color: Colors.textDark, fontFamily: 'Inter_400Regular' },
  bubbleTextSent: { color: '#fff' },
  startersWrap: { maxHeight: 44, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.5)' },
  starters: { paddingHorizontal: Spacing.md, paddingVertical: 6, gap: 8, alignItems: 'center' },
  starterPill: {
    paddingVertical: 6, paddingHorizontal: 14, borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1, borderColor: 'rgba(240,19,77,0.18)',
  },
  starterText: { fontSize: FontSize.sm, color: Colors.pinkHot, fontFamily: 'Inter_600SemiBold', whiteSpace: 'nowrap' },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: Spacing.md, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.6)',
  },
  input: {
    flex: 1, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1.5, borderColor: 'rgba(240,19,77,0.18)',
    paddingHorizontal: 16,
    fontSize: FontSize.body, fontFamily: 'Inter_400Regular', color: Colors.textDark,
  },
  sendBtn: { width: 44, height: 44 },
  sendBtnGrad: { flex: 1, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { color: '#fff', fontSize: 16 },
});
