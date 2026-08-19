import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MeshBackground } from '@/components/layout/MeshBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { AvatarCircle } from '@/components/ui/AvatarCircle';
import { TopBar } from '@/components/layout/TopBar';
import { Colors, FontSize, Spacing } from '@/constants';
import { Routes } from '@/constants/routes';
import { chatApi } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { setConversations, Conversation } from '@/store/chatSlice';

interface Props { navigation: NativeStackNavigationProp<any> }

function initials(name: string = '') {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function MessagesListScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector((s) => s.chat.conversations);
  const [loading, setLoading] = React.useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await chatApi.getConversations() as Conversation[];
      dispatch(setConversations(data));
    } catch {
      dispatch(setConversations([]));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const renderItem = ({ item }: { item: Conversation }) => {
    const name = item.otherProfile?.displayName ?? 'Match';
    const lastMsg = item.messages?.[item.messages.length - 1];

    return (
      <Pressable onPress={() => navigation.navigate(Routes.Chat, { conversationId: item.id, profile: item.otherProfile })}>
        <GlassCard style={styles.row}>
          <AvatarCircle initials={initials(name)} size={48} />
          <View style={styles.rowInfo}>
            <View style={styles.rowHeader}>
              <Text style={styles.rowName}>{name}</Text>
              {lastMsg && (
                <Text style={styles.rowTime}>
                  {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </View>
            <Text style={styles.rowPreview} numberOfLines={1}>
              {lastMsg?.content ?? 'Say assalamu alaikum ♡'}
            </Text>
            {item.otherProfile?.compatScore && (
              <Text style={styles.rowScore}>{item.otherProfile.compatScore}% purpose match</Text>
            )}
          </View>
        </GlassCard>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <MeshBackground />
      <TopBar title="Messages" />
      {loading && conversations.length === 0 ? (
        <ActivityIndicator color={Colors.pinkHot} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(c) => c.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyText}>No conversations yet — find someone in Discover.</Text>
            </GlassCard>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: Spacing.lg, gap: Spacing.sm, paddingBottom: 100 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
  rowInfo: { flex: 1, gap: 3 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowName: { fontSize: FontSize.base, fontFamily: 'Inter_700Bold', color: Colors.textDark },
  rowTime: { fontSize: FontSize.xs, color: Colors.textSoft, fontFamily: 'Inter_400Regular' },
  rowPreview: { fontSize: FontSize.body, color: Colors.textMid, fontFamily: 'Inter_400Regular' },
  rowScore: { fontSize: FontSize.xs, color: Colors.pinkHot, fontFamily: 'Inter_600SemiBold' },
  emptyCard: { margin: Spacing.lg, padding: Spacing.xxl, alignItems: 'center' },
  emptyText: { textAlign: 'center', color: Colors.textMid, fontFamily: 'Inter_500Medium', lineHeight: 22 },
});
