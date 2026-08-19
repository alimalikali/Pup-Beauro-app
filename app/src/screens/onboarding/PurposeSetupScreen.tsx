import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MeshBackground } from '@/components/layout/MeshBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { CompatibilityBar } from '@/components/ui/CompatibilityBar';
import { Colors, FontSize, Radius, Spacing } from '@/constants';
import { Routes } from '@/constants/routes';
import { profileApi } from '@/services/api';
import { useAppDispatch } from '@/store';
import { updatePurpose, updatePriorities } from '@/store/profileSlice';
import { completeOnboarding } from '@/store/authSlice';

interface Props { navigation: NativeStackNavigationProp<any> }

const AI_TAGS = ['social reform', "da'wah", 'education', 'entrepreneur', 'hifz', 'medicine'];

const SLIDERS = [
  { key: 'priorityDeen', label: 'Deen', defaultVal: 90 },
  { key: 'priorityEducation', label: 'Education', defaultVal: 75 },
  { key: 'priorityCareer', label: 'Career', defaultVal: 55 },
  { key: 'priorityFamily', label: 'Family', defaultVal: 85 },
  { key: 'priorityLocation', label: 'Location', defaultVal: 40 },
];

export default function PurposeSetupScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [purposeText, setPurposeText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priorities, setPriorities] = useState(
    Object.fromEntries(SLIDERS.map((s) => [s.key, s.defaultVal])),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tagAnims = useRef(AI_TAGS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    AI_TAGS.forEach((_, i) => {
      Animated.spring(tagAnims[i], {
        toValue: 1, delay: 600 + i * 70, useNativeDriver: true,
        tension: 80, friction: 8,
      }).start();
    });
  }, []);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const handleSave = async () => {
    if (!purposeText.trim()) { setError('Please describe your purpose'); return; }
    setLoading(true); setError('');
    try {
      await profileApi.updatePurpose({ purposeStatement: purposeText, lifeTags: selectedTags });
      await profileApi.updatePriorities(priorities);
      dispatch(updatePurpose({ purposeStatement: purposeText, lifeTags: selectedTags }));
      dispatch(updatePriorities(priorities));
      navigation.navigate(Routes.Verification);
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <MeshBackground />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Step dots */}
        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.heading}>
          <Text style={styles.h1}>What is your life's</Text>
          <Text style={[styles.h1, { color: Colors.pinkHot }]}>direction?</Text>
          <Text style={styles.sub}>This is what Mithaq is built on. Be real.</Text>
        </View>

        <TextInput
          style={styles.textarea}
          multiline
          numberOfLines={5}
          value={purposeText}
          onChangeText={setPurposeText}
          placeholder={`In 10 years I hope to have contributed to...\nMy marriage should support my goal of...`}
          placeholderTextColor={Colors.textSoft}
          textAlignVertical="top"
        />

        {/* AI Tags */}
        <GlassCard style={styles.tagsCard}>
          <View style={styles.tagsInner}>
            <Text style={styles.tagsLabel}>✦ Suggested directions</Text>
            <View style={styles.tagsRow}>
              {AI_TAGS.map((tag, i) => (
                <Animated.View
                  key={tag}
                  style={{ opacity: tagAnims[i], transform: [{ scale: tagAnims[i] }] }}
                >
                  <Pressable
                    style={[styles.aiTag, selectedTags.includes(tag) && styles.aiTagActive]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[styles.aiTagText, selectedTags.includes(tag) && styles.aiTagTextActive]}>
                      {tag}
                    </Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
            <Text style={styles.reassure}>✦ AI reads your direction, not judges it</Text>
          </View>
        </GlassCard>

        <View style={styles.divider} />
        <Text style={styles.priorityHeading}>What matters most?</Text>

        {/* Priority controls */}
        <GlassCard style={styles.slidersCard}>
          <View style={styles.slidersInner}>
            {SLIDERS.map((s) => (
              <View key={s.key} style={styles.priorityRow}>
                <CompatibilityBar
                  label={s.label}
                  value={priorities[s.key]}
                  animate={false}
                  style={styles.priorityBar}
                />
                <View style={styles.priorityBtns}>
                  <Pressable
                    style={styles.priorityBtn}
                    onPress={() => setPriorities((p) => ({ ...p, [s.key]: Math.max(0, p[s.key] - 5) }))}
                  >
                    <Text style={styles.priorityBtnText}>−</Text>
                  </Pressable>
                  <Pressable
                    style={styles.priorityBtn}
                    onPress={() => setPriorities((p) => ({ ...p, [s.key]: Math.min(100, p[s.key] + 5) }))}
                  >
                    <Text style={styles.priorityBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>
            ))}
            <Text style={styles.sliderHint}>
              Tap +/− to adjust priorities.
            </Text>
          </View>
        </GlassCard>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <GradientButton label="Save & Continue →" onPress={handleSave} loading={loading} style={styles.cta} />

        <Pressable onPress={() => dispatch(completeOnboarding())} style={{ marginTop: 8 }}>
          <Text style={styles.skip}>Skip for now</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: Spacing.xxl, gap: Spacing.lg, paddingBottom: 60 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 7, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 99, backgroundColor: 'rgba(240,19,77,0.2)' },
  dotActive: { width: 26, backgroundColor: Colors.pinkHot },
  heading: { gap: 4 },
  h1: { fontSize: FontSize.h2, fontFamily: 'Inter_800ExtraBold', color: Colors.textDark, letterSpacing: -0.5, lineHeight: 30 },
  sub: { fontSize: FontSize.body, color: Colors.textMid, lineHeight: 20, marginTop: 4, fontFamily: 'Inter_400Regular' },
  textarea: {
    minHeight: 130,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1.5,
    borderColor: 'rgba(240,19,77,0.18)',
    fontSize: FontSize.body,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMid,
    lineHeight: 22,
  },
  tagsCard: {},
  tagsInner: { padding: Spacing.lg, gap: 10 },
  tagsLabel: { fontSize: FontSize.md, color: Colors.textSoft, fontFamily: 'Inter_500Medium' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  aiTag: {
    paddingVertical: 6, paddingHorizontal: 14, borderRadius: Radius.full,
    backgroundColor: 'rgba(240,19,77,0.07)',
    borderWidth: 1, borderColor: 'rgba(240,19,77,0.18)',
  },
  aiTagActive: { backgroundColor: Colors.pinkHot, borderColor: 'transparent' },
  aiTagText: { fontSize: FontSize.md, fontFamily: 'Inter_600SemiBold', color: Colors.pinkHot },
  aiTagTextActive: { color: '#fff' },
  reassure: { fontSize: FontSize.md, fontFamily: 'Inter_400Regular', color: Colors.pinkHot, textAlign: 'center', fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: 'rgba(240,19,77,0.1)' },
  priorityHeading: { fontSize: FontSize.lg, fontFamily: 'Inter_700Bold', color: Colors.textDark },
  slidersCard: {},
  slidersInner: { padding: Spacing.xl, gap: Spacing.xl },
  sliderHint: { fontSize: FontSize.xs, color: Colors.textSoft, textAlign: 'center', fontFamily: 'Inter_400Regular', fontStyle: 'italic' },
  error: { fontSize: FontSize.md, color: Colors.pinkHot, textAlign: 'center', fontFamily: 'Inter_500Medium' },
  cta: { marginTop: 4 },
  skip: { textAlign: 'center', color: Colors.textSoft, fontFamily: 'Inter_500Medium', fontSize: FontSize.md },
  priorityRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  priorityBar: { flex: 1 },
  priorityBtns: { flexDirection: 'row', gap: 6 },
  priorityBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(240,19,77,0.1)',
    borderWidth: 1, borderColor: 'rgba(240,19,77,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  priorityBtnText: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.pinkHot, lineHeight: 22 },
});
