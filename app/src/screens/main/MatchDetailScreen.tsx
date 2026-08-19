import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MeshBackground } from '@/components/layout/MeshBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { AvatarCircle } from '@/components/ui/AvatarCircle';
import { CompatibilityBar } from '@/components/ui/CompatibilityBar';
import { PinkPill } from '@/components/ui/PinkPill';
import { Colors, FontSize, Gradients, Spacing } from '@/constants';
import { Routes } from '@/constants/routes';
import { matchApi } from '@/services/api';
import { useAppDispatch } from '@/store';
import { removeFromFeed } from '@/store/matchSlice';
import { MatchCard } from '@/store/matchSlice';

interface Props {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ MatchDetail: { card: MatchCard } }, 'MatchDetail'>;
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function MatchDetailScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { card } = route.params;
  const { profile, score } = card;

  const [loading, setLoading] = React.useState(false);

  const handleInterest = async () => {
    setLoading(true);
    try {
      const res = await matchApi.expressInterest(profile.userId, score) as any;
      dispatch(removeFromFeed(profile.userId));
      if (res.mutual) {
        navigation.replace(Routes.Chat, { matchId: res.match.id, profile });
      } else {
        navigation.goBack();
      }
    } catch {
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const COMPAT_BARS = [
    { label: 'Purpose alignment', value: score },
    { label: 'Values', value: Math.max(score - 8, 60) },
    { label: 'Life goals', value: Math.max(score - 5, 65) },
    { label: 'Family vision', value: Math.max(score - 12, 55) },
    { label: 'Community focus', value: Math.max(score - 3, 70) },
  ];

  return (
    <View style={styles.container}>
      <MeshBackground />

      {/* Header gradient */}
      <LinearGradient
        colors={[...Gradients.primary, 'transparent']}
        style={[styles.headerGrad, { paddingTop: insets.top + 12 }]}
      >
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <AvatarCircle initials={initials(profile.displayName)} size={80} online style={styles.avatar} />
        <Text style={styles.name}>{profile.displayName}</Text>
        <Text style={styles.location}>{profile.city} · {profile.age}</Text>
        <View style={styles.verifiedRow}>
          <View style={styles.verifiedChip}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
          <View style={styles.scoreChip}>
            <Text style={styles.scoreText}>{score}% match</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Purpose statement */}
        {profile.purposeStatement ? (
          <GlassCard style={styles.section}>
            <View style={styles.sectionInner}>
              <Text style={styles.sectionLabel}>Life direction</Text>
              <View style={styles.quoteBlock}>
                <Text style={styles.quoteText}>"{profile.purposeStatement}"</Text>
              </View>
            </View>
          </GlassCard>
        ) : null}

        {/* Tags */}
        {(profile.lifeTags ?? []).length > 0 && (
          <View style={styles.tagsRow}>
            {profile.lifeTags.map((tag) => <PinkPill key={tag} label={tag} />)}
          </View>
        )}

        {/* Compatibility */}
        <GlassCard style={styles.section}>
          <View style={styles.sectionInner}>
            <Text style={styles.sectionLabel}>Compatibility breakdown</Text>
            {COMPAT_BARS.map((b) => (
              <CompatibilityBar key={b.label} label={b.label} value={b.value} />
            ))}
          </View>
        </GlassCard>

        {/* Wali toggle */}
        <GlassCard style={styles.section}>
          <View style={styles.sectionInner}>
            <Text style={styles.sectionLabel}>Guardian option</Text>
            <Text style={styles.waliText}>
              After expressing interest, you can add a wali email to CC on your conversation.
            </Text>
          </View>
        </GlassCard>

        {/* CTA */}
        <GradientButton
          label="Express Mutual Interest ♡"
          onPress={handleInterest}
          loading={loading}
          style={styles.cta}
        />
        <GradientButton
          label="Not the right fit"
          variant="ghost"
          onPress={() => navigation.goBack()}
          style={styles.skipBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGrad: { paddingBottom: 28, paddingHorizontal: Spacing.xxl, alignItems: 'center', gap: 6 },
  backBtn: { position: 'absolute', left: 16, top: 52, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 32, color: '#fff', lineHeight: 36 },
  avatar: { marginTop: 12 },
  name: { fontSize: FontSize.h2, fontFamily: 'Inter_800ExtraBold', color: '#fff', marginTop: 4 },
  location: { fontSize: FontSize.base, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_400Regular' },
  verifiedRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  verifiedChip: {
    paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10,
    backgroundColor: 'rgba(34,197,94,0.2)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.4)',
  },
  verifiedText: { fontSize: FontSize.sm, color: '#86efac', fontFamily: 'Inter_600SemiBold' },
  scoreChip: {
    paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  scoreText: { fontSize: FontSize.sm, color: '#fff', fontFamily: 'Inter_700Bold' },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  section: {},
  sectionInner: { padding: Spacing.lg, gap: Spacing.md },
  sectionLabel: { fontSize: FontSize.md, fontFamily: 'Inter_700Bold', color: Colors.textMid, textTransform: 'uppercase', letterSpacing: 0.5 },
  quoteBlock: {
    borderLeftWidth: 3, borderLeftColor: Colors.pinkHot,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(240,19,77,0.03)',
    borderTopRightRadius: 10, borderBottomRightRadius: 10,
  },
  quoteText: { fontSize: FontSize.body, fontStyle: 'italic', color: Colors.textMid, lineHeight: 22, fontFamily: 'Inter_400Regular' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  waliText: { fontSize: FontSize.body, color: Colors.textMid, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  cta: { marginTop: 4 },
  skipBtn: { marginTop: 4 },
});
