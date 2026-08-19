import React, { useCallback, useState } from 'react';
import {
  Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { deleteToken } from '@/utils/secureStorage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MeshBackground } from '@/components/layout/MeshBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { AvatarCircle } from '@/components/ui/AvatarCircle';
import { CompatibilityBar } from '@/components/ui/CompatibilityBar';
import { Colors, FontSize, Gradients, Radius, Spacing } from '@/constants';
import { profileApi } from '@/services/api';
import { disconnectSocket } from '@/services/socket';
import { useAppDispatch, useAppSelector } from '@/store';
import { setProfile, Profile } from '@/store/profileSlice';
import { logout } from '@/store/authSlice';

function initials(name: string = '') {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const profile = useAppSelector((s) => s.profile.profile);
  const user = useAppSelector((s) => s.auth.user);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: '', city: '', profession: '', education: '' });

  useFocusEffect(useCallback(() => {
    profileApi.get()
      .then((p) => dispatch(setProfile(p as Profile)))
      .catch(() => {});
  }, []));

  const handleSave = async () => {
    try {
      await profileApi.update(form);
      const updated = await profileApi.get() as Profile;
      dispatch(setProfile(updated));
      setEditing(false);
    } catch {
      Alert.alert('Error', 'Could not save. Try again.');
    }
  };

  const handleLogout = async () => {
    const doLogout = async () => {
      disconnectSocket();
      await deleteToken('token');
      dispatch(logout());
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Sign out?')) doLogout();
    } else {
      Alert.alert('Sign out', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign out', style: 'destructive', onPress: doLogout },
      ]);
    }
  };

  const PRIORITY_BARS = [
    { label: 'Deen', value: profile?.priorityDeen ?? 90 },
    { label: 'Education', value: profile?.priorityEducation ?? 75 },
    { label: 'Career', value: profile?.priorityCareer ?? 55 },
    { label: 'Family', value: profile?.priorityFamily ?? 85 },
    { label: 'Location', value: profile?.priorityLocation ?? 40 },
  ];

  const completeness = profile?.completeness ?? 45;

  return (
    <View style={styles.container}>
      <MeshBackground />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={Gradients.primary}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <AvatarCircle
            initials={initials(profile?.displayName ?? user?.email ?? 'ME')}
            size={80}
          />
          <Text style={styles.name}>{profile?.displayName ?? 'Your Name'}</Text>
          <Text style={styles.location}>{profile?.city ?? 'Set your city'}</Text>
          {profile?.isPublished ? (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Profile live ✓</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, styles.statusPending]}>
              <Text style={styles.statusText}>Pending verification</Text>
            </View>
          )}
        </LinearGradient>

        {/* Completeness ring */}
        <GlassCard style={styles.section}>
          <View style={styles.sectionInner}>
            <View style={styles.completenessRow}>
              <View>
                <Text style={styles.sectionLabel}>Profile completeness</Text>
                <Text style={styles.completenessVal}>{completeness}%</Text>
              </View>
              <View style={styles.ringWrap}>
                <Text style={styles.ringText}>{completeness}%</Text>
              </View>
            </View>
            <CompatibilityBar value={completeness} animate />
          </View>
        </GlassCard>

        {/* Purpose */}
        {profile?.purposeStatement ? (
          <GlassCard style={styles.section}>
            <View style={styles.sectionInner}>
              <Text style={styles.sectionLabel}>My direction</Text>
              <View style={styles.quoteBlock}>
                <Text style={styles.quoteText}>"{profile.purposeStatement}"</Text>
              </View>
            </View>
          </GlassCard>
        ) : null}

        {/* Priorities */}
        <GlassCard style={styles.section}>
          <View style={styles.sectionInner}>
            <Text style={styles.sectionLabel}>My priorities</Text>
            {PRIORITY_BARS.map((b) => (
              <CompatibilityBar key={b.label} label={b.label} value={b.value} animate={false} />
            ))}
          </View>
        </GlassCard>

        {/* Edit section */}
        <GlassCard style={styles.section}>
          <View style={styles.sectionInner}>
            <View style={styles.editHeader}>
              <Text style={styles.sectionLabel}>About me</Text>
              {!editing && (
                <Pressable onPress={() => {
                  setForm({ bio: profile?.bio ?? '', city: profile?.city ?? '', profession: profile?.profession ?? '', education: profile?.education ?? '' });
                  setEditing(true);
                }}>
                  <Text style={styles.editBtn}>Edit</Text>
                </Pressable>
              )}
            </View>

            {editing ? (
              <>
                <EditField label="Bio" value={form.bio} onChange={(v) => setForm((f) => ({ ...f, bio: v }))} multiline />
                <EditField label="City" value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} />
                <EditField label="Profession" value={form.profession} onChange={(v) => setForm((f) => ({ ...f, profession: v }))} />
                <EditField label="Education" value={form.education} onChange={(v) => setForm((f) => ({ ...f, education: v }))} />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <GradientButton label="Save" onPress={handleSave} style={{ flex: 1, height: 44 }} />
                  <GradientButton label="Cancel" variant="ghost" onPress={() => setEditing(false)} style={{ flex: 1, height: 44 }} />
                </View>
              </>
            ) : (
              <>
                {[
                  { l: 'Profession', v: profile?.profession },
                  { l: 'Education', v: profile?.education },
                  { l: 'City', v: profile?.city },
                ].map(({ l, v }) => v ? (
                  <View key={l} style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{l}</Text>
                    <Text style={styles.infoValue}>{v}</Text>
                  </View>
                ) : null)}
                {profile?.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
              </>
            )}
          </View>
        </GlassCard>

        {/* Settings */}
        <GlassCard style={styles.section}>
          <View style={styles.sectionInner}>
            <Text style={styles.sectionLabel}>Settings</Text>
            {[
              { label: '🔔 Notifications', onPress: () => Alert.alert('Coming soon', 'Notification preferences will be available in a future update.') },
              { label: '🛡️ Privacy', onPress: () => Alert.alert('Coming soon', 'Privacy settings will be available in a future update.') },
              { label: '👤 Wali / Guardian email', onPress: () => Alert.alert('Coming soon', 'Guardian email can be set on the Verification screen.') },
            ].map((item) => (
              <Pressable key={item.label} style={styles.settingRow} onPress={item.onPress}>
                <Text style={styles.settingText}>{item.label}</Text>
                <Text style={styles.settingChevron}>›</Text>
              </Pressable>
            ))}
          </View>
        </GlassCard>

        <GradientButton label="Sign Out" variant="ghost" onPress={handleLogout} style={styles.logoutBtn} />
      </ScrollView>
    </View>
  );
}

function EditField({ label, value, onChange, multiline = false }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean;
}) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 80, textAlignVertical: 'top', paddingTop: 10 }]}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        placeholderTextColor={Colors.textSoft}
        placeholder={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 100, gap: Spacing.md },
  header: { paddingBottom: 28, paddingHorizontal: Spacing.xxl, alignItems: 'center', gap: 6 },
  name: { fontSize: FontSize.h2, fontFamily: 'Inter_800ExtraBold', color: '#fff', marginTop: 4 },
  location: { fontSize: FontSize.base, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_400Regular' },
  statusBadge: {
    marginTop: 6, paddingVertical: 4, paddingHorizontal: 14,
    borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  statusPending: { backgroundColor: 'rgba(245,158,11,0.2)', borderColor: 'rgba(245,158,11,0.4)' },
  statusText: { fontSize: FontSize.sm, color: '#fff', fontFamily: 'Inter_600SemiBold' },
  section: { marginHorizontal: Spacing.lg },
  sectionInner: { padding: Spacing.lg, gap: Spacing.md },
  sectionLabel: { fontSize: FontSize.md, fontFamily: 'Inter_700Bold', color: Colors.textMid, textTransform: 'uppercase', letterSpacing: 0.5 },
  completenessRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  completenessVal: { fontSize: FontSize.h2, fontFamily: 'Inter_800ExtraBold', color: Colors.pinkHot },
  ringWrap: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(240,19,77,0.08)',
    borderWidth: 3, borderColor: Colors.pinkHot,
    alignItems: 'center', justifyContent: 'center',
  },
  ringText: { fontSize: FontSize.md, fontFamily: 'Inter_700Bold', color: Colors.pinkHot },
  quoteBlock: {
    borderLeftWidth: 3, borderLeftColor: Colors.pinkHot,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(240,19,77,0.03)',
    borderTopRightRadius: 10, borderBottomRightRadius: 10,
  },
  quoteText: { fontSize: FontSize.body, fontStyle: 'italic', color: Colors.textMid, lineHeight: 22, fontFamily: 'Inter_400Regular' },
  editHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editBtn: { fontSize: FontSize.body, color: Colors.pinkHot, fontFamily: 'Inter_600SemiBold' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontSize: FontSize.body, color: Colors.textSoft, fontFamily: 'Inter_400Regular' },
  infoValue: { fontSize: FontSize.body, color: Colors.textDark, fontFamily: 'Inter_600SemiBold' },
  bio: { fontSize: FontSize.body, color: Colors.textMid, lineHeight: 22, fontFamily: 'Inter_400Regular' },
  fieldLabel: { fontSize: FontSize.md, fontFamily: 'Inter_600SemiBold', color: Colors.textMid },
  input: {
    height: 44, borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1.5, borderColor: 'rgba(240,19,77,0.18)',
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.body, fontFamily: 'Inter_400Regular', color: Colors.textDark,
  },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(240,19,77,0.06)',
  },
  settingText: { fontSize: FontSize.body, color: Colors.textDark, fontFamily: 'Inter_500Medium' },
  settingChevron: { fontSize: 20, color: Colors.textSoft },
  logoutBtn: { marginHorizontal: Spacing.lg, marginTop: Spacing.sm },
});
