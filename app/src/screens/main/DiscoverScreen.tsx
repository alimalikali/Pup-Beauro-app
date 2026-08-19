import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, Pressable, RefreshControl,
  ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MeshBackground } from '@/components/layout/MeshBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { AvatarCircle } from '@/components/ui/AvatarCircle';
import { PinkPill } from '@/components/ui/PinkPill';
import { CompatibilityBar } from '@/components/ui/CompatibilityBar';
import { TopBar } from '@/components/layout/TopBar';
import { Colors, FontSize, Spacing } from '@/constants';
import { Routes } from '@/constants/routes';
import { matchApi } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { setFeed, setLoading, setCurrentMatch, removeFromFeed, MatchCard } from '@/store/matchSlice';

interface Props { navigation: NativeStackNavigationProp<any> }

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function DiscoverScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { feed, isLoading } = useAppSelector((s) => s.match);
  const user = useAppSelector((s) => s.auth.user);
  const [loadError, setLoadError] = useState(false);

  const loadFeed = async () => {
    dispatch(setLoading(true));
    setLoadError(false);
    try {
      const data = await matchApi.getFeed() as MatchCard[];
      dispatch(setFeed(data));
    } catch {
      setLoadError(true);
      dispatch(setFeed([]));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useFocusEffect(useCallback(() => { loadFeed(); }, []));

  const handleInterest = async (card: MatchCard) => {
    try {
      const res = await matchApi.expressInterest(card.profile.userId, card.score) as any;
      dispatch(removeFromFeed(card.profile.userId));
      if (res.mutual) {
        navigation.navigate(Routes.Chat, { matchId: res.match.id, profile: card.profile });
      }
    } catch {
      dispatch(removeFromFeed(card.profile.userId));
    }
  };

  const handleSkip = async (card: MatchCard) => {
    dispatch(removeFromFeed(card.profile.userId));
    try { await matchApi.skip(card.profile.userId); } catch { /* ignore */ }
  };

  return (
    <View style={styles.container}>
      <MeshBackground />
      <TopBar
        showLogo
        showAvatar
        initials={initials(user?.email ?? 'YA')}
        onAvatarPress={() => navigation.navigate(Routes.Profile)}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadFeed} tintColor={Colors.pinkHot} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { val: feed[0] ? `${feed[0].score}%` : '--', lbl: 'top match' },
            { val: String(feed.length), lbl: 'matches' },
            { val: '0', lbl: 'views' },
          ].map((s, i) => (
            <GlassCard key={i} style={styles.statCard}>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLbl}>{s.lbl}</Text>
            </GlassCard>
          ))}
        </View>

        {/* Section header */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Today's matches</Text>
          <GlassCard style={styles.aiChip}>
            <Text style={styles.aiChipText}>✦ AI-scored</Text>
          </GlassCard>
        </View>

        {isLoading && feed.length === 0 ? (
          <ActivityIndicator color={Colors.pinkHot} size="large" style={{ marginTop: 40 }} />
        ) : loadError && feed.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Couldn't load matches.{'\n'}Pull to refresh or tap retry.
            </Text>
            <GradientButton
              label="Retry"
              onPress={loadFeed}
              style={styles.retryBtn}
            />
          </GlassCard>
        ) : feed.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No matches yet.{'\n'}Complete your profile to get discovered.</Text>
          </GlassCard>
        ) : (
          feed.map((card) => (
            <MatchCardView
              key={card.profile.userId}
              card={card}
              onInterest={() => handleInterest(card)}
              onSkip={() => handleSkip(card)}
              onPress={() => {
                dispatch(setCurrentMatch(card));
                navigation.navigate(Routes.MatchDetail, { card });
              }}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function MatchCardView({ card, onInterest, onSkip, onPress }: {
  card: MatchCard;
  onInterest: () => void;
  onSkip: () => void;
  onPress: () => void;
}) {
  const { profile, score } = card;
  const [activeTags, setActiveTags] = React.useState<string[]>([]);

  return (
    <Pressable onPress={onPress}>
      <GlassCard style={styles.matchCard}>
        {/* Banner */}
        <View style={styles.cardBanner}>
          <AvatarCircle initials={initials(profile.displayName)} size={52} online />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{profile.displayName}</Text>
            <Text style={styles.cardSub}>{profile.city} · {profile.age}</Text>
          </View>
          {(profile as any).isVerified && (
            <View style={styles.verifiedChip}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          {profile.purposeStatement ? (
            <View style={styles.quoteBlock}>
              <Text style={styles.quoteText} numberOfLines={2}>"{profile.purposeStatement}"</Text>
            </View>
          ) : null}

          <View style={styles.tagsRow}>
            {(profile.lifeTags ?? []).map((tag) => (
              <PinkPill
                key={tag}
                label={tag}
                active={activeTags.includes(tag)}
                onPress={() => setActiveTags((p) => p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag])}
              />
            ))}
          </View>

          <CompatibilityBar label="Purpose alignment" value={score} />
        </View>

        {/* Actions */}
        <View style={styles.cardActions}>
          <GradientButton
            label="Express Interest ♡"
            onPress={onInterest}
            style={styles.interestBtn}
          />
          <GradientButton
            label="Skip"
            variant="ghost"
            onPress={onSkip}
            style={styles.skipBtn}
          />
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm },
  statVal: { fontSize: FontSize.h2, fontFamily: 'Inter_800ExtraBold', color: Colors.pinkHot },
  statLbl: { fontSize: FontSize.xs, color: Colors.textSoft, fontFamily: 'Inter_500Medium', marginTop: 2 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: FontSize.lg, fontFamily: 'Inter_700Bold', color: Colors.textDark },
  aiChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 11 },
  aiChipText: { fontSize: FontSize.sm, fontFamily: 'Inter_700Bold', color: Colors.pinkHot },
  matchCard: { overflow: 'hidden' },
  cardBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.md, paddingBottom: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: 'rgba(240,19,77,0.06)',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: FontSize.xl, fontFamily: 'Inter_700Bold', color: Colors.textDark },
  cardSub: { fontSize: FontSize.md, color: Colors.textSoft, fontFamily: 'Inter_400Regular', marginTop: 2 },
  verifiedChip: {
    paddingVertical: 4, paddingHorizontal: 9, borderRadius: 10,
    backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)',
  },
  verifiedText: { fontSize: FontSize.sm, color: '#16a34a', fontFamily: 'Inter_600SemiBold' },
  cardBody: { padding: Spacing.md, gap: Spacing.sm },
  quoteBlock: {
    borderLeftWidth: 3, borderLeftColor: Colors.pinkHot,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(240,19,77,0.03)', borderRadius: 0,
    borderTopRightRadius: 10, borderBottomRightRadius: 10,
  },
  quoteText: { fontSize: FontSize.md, fontStyle: 'italic', color: Colors.textMid, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  cardActions: {
    flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.7)',
  },
  interestBtn: { flex: 1, height: 44 },
  skipBtn: { height: 44, paddingHorizontal: 18 },
  emptyCard: { padding: Spacing.xxl, alignItems: 'center', gap: Spacing.md },
  emptyText: { textAlign: 'center', color: Colors.textMid, fontFamily: 'Inter_500Medium', lineHeight: 22 },
  retryBtn: { minWidth: 140, height: 44 },
});
