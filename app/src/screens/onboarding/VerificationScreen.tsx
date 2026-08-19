import React, { useState } from 'react';
import {
  Alert, Image, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MeshBackground } from '@/components/layout/MeshBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Colors, FontSize, Radius, Spacing } from '@/constants';
import { verificationApi } from '@/services/api';
import { useAppDispatch } from '@/store';
import { completeOnboarding } from '@/store/authSlice';

export default function VerificationScreen() {
  const dispatch = useAppDispatch();
  const [cnicFront, setCnicFront] = useState<string | null>(null);
  const [cnicBack, setCnicBack] = useState<string | null>(null);
  const [waliEmail, setWaliEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pickImage = async (side: 'front' | 'back') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled) {
      if (side === 'front') setCnicFront(result.assets[0].uri);
      else setCnicBack(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!cnicFront || !cnicBack) {
      Alert.alert('Required', 'Upload both sides of your CNIC.');
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append('cnicFront', { uri: cnicFront, name: 'front.jpg', type: 'image/jpeg' } as any);
      form.append('cnicBack', { uri: cnicBack, name: 'back.jpg', type: 'image/jpeg' } as any);
      await verificationApi.upload(form);
      setSubmitted(true);
    } catch {
      Alert.alert('Upload failed', 'Check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <MeshBackground />
        <View style={styles.center}>
          <Text style={styles.successIcon}>🕊️</Text>
          <Text style={styles.successTitle}>Submitted</Text>
          <Text style={styles.successSub}>
            Under review — usually within 24 hours.{'\n'}You can explore while you wait.
          </Text>
          <View style={styles.trustRow}>
            {['Private', 'Admin-only', 'Never shared'].map((t) => (
              <View key={t} style={styles.trustPill}>
                <Text style={styles.trustText}>🔒 {t}</Text>
              </View>
            ))}
          </View>
          <GradientButton
            label="Explore Mithaq →"
            onPress={() => dispatch(completeOnboarding())}
            style={styles.cta}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MeshBackground />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Step dots */}
        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, i === 2 && styles.dotActive, i < 2 && styles.dotDone]} />
          ))}
        </View>

        <View style={styles.heading}>
          <Text style={styles.h1}>Verify your identity</Text>
          <Text style={styles.sub}>
            CNIC required before your profile goes live. Reviewed by human admins only.
          </Text>
        </View>

        {/* Trust badges */}
        <View style={styles.trustRow}>
          {['Private', 'Admin-only', 'Never shared'].map((t) => (
            <View key={t} style={styles.trustPill}>
              <Text style={styles.trustText}>🔒 {t}</Text>
            </View>
          ))}
        </View>

        {/* Upload boxes */}
        <GlassCard>
          <View style={styles.uploadSection}>
            <UploadBox
              label="CNIC Front"
              uri={cnicFront}
              onPress={() => pickImage('front')}
            />
            <UploadBox
              label="CNIC Back"
              uri={cnicBack}
              onPress={() => pickImage('back')}
            />
          </View>
        </GlassCard>

        {/* Wali email */}
        <GlassCard>
          <View style={styles.waliSection}>
            <Text style={styles.waliLabel}>Guardian email (optional)</Text>
            <Text style={styles.waliSub}>Add a wali or parent email to CC on conversations.</Text>
            <TextInput
              style={styles.input}
              value={waliEmail}
              onChangeText={setWaliEmail}
              placeholder="guardian@example.com"
              placeholderTextColor={Colors.textSoft}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </GlassCard>

        <GradientButton
          label="Submit for Review →"
          onPress={handleSubmit}
          loading={loading}
          style={styles.cta}
        />

        <Pressable onPress={() => dispatch(completeOnboarding())} style={{ marginTop: 8 }}>
          <Text style={styles.skip}>Skip — I'll verify later</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function UploadBox({ label, uri, onPress }: { label: string; uri: string | null; onPress: () => void }) {
  return (
    <Pressable style={[styles.uploadBox, uri && styles.uploadBoxFilled]} onPress={onPress}>
      {uri ? (
        <Image source={{ uri }} style={styles.uploadPreview} />
      ) : (
        <>
          <Text style={styles.uploadIcon}>📎</Text>
          <Text style={styles.uploadLabel}>{label}</Text>
          <Text style={styles.uploadHint}>Tap to upload</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.xxl, gap: Spacing.lg, paddingBottom: 60 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl, gap: Spacing.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 7, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 99, backgroundColor: 'rgba(240,19,77,0.2)' },
  dotActive: { width: 26, backgroundColor: Colors.pinkHot },
  dotDone: { backgroundColor: Colors.pinkMid },
  heading: { gap: 6 },
  h1: { fontSize: FontSize.h2, fontFamily: 'Inter_800ExtraBold', color: Colors.textDark, letterSpacing: -0.5 },
  sub: { fontSize: FontSize.body, color: Colors.textMid, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  trustRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  trustPill: {
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: Radius.full,
    backgroundColor: 'rgba(240,19,77,0.06)', borderWidth: 1, borderColor: 'rgba(240,19,77,0.15)',
  },
  trustText: { fontSize: FontSize.xs, color: Colors.textMid, fontFamily: 'Inter_500Medium' },
  uploadSection: { padding: Spacing.lg, flexDirection: 'row', gap: Spacing.md },
  uploadBox: {
    flex: 1, height: 120, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: 'rgba(240,19,77,0.25)', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: 'rgba(240,19,77,0.03)',
  },
  uploadBoxFilled: { borderStyle: 'solid', borderColor: Colors.pinkMid },
  uploadPreview: { width: '100%', height: '100%', borderRadius: Radius.md },
  uploadIcon: { fontSize: 24 },
  uploadLabel: { fontSize: FontSize.md, fontFamily: 'Inter_600SemiBold', color: Colors.textMid },
  uploadHint: { fontSize: FontSize.xs, color: Colors.textSoft, fontFamily: 'Inter_400Regular' },
  waliSection: { padding: Spacing.lg, gap: 6 },
  waliLabel: { fontSize: FontSize.body, fontFamily: 'Inter_700Bold', color: Colors.textDark },
  waliSub: { fontSize: FontSize.md, color: Colors.textSoft, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  input: {
    height: 44, borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1.5, borderColor: 'rgba(240,19,77,0.18)',
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.body, fontFamily: 'Inter_400Regular', color: Colors.textDark,
    marginTop: 4,
  },
  cta: { marginTop: 4 },
  skip: { textAlign: 'center', color: Colors.textSoft, fontFamily: 'Inter_500Medium', fontSize: FontSize.md },
  successIcon: { fontSize: 56, textAlign: 'center' },
  successTitle: { fontSize: FontSize.h2, fontFamily: 'Inter_800ExtraBold', color: Colors.textDark, textAlign: 'center' },
  successSub: { fontSize: FontSize.body, color: Colors.textMid, textAlign: 'center', lineHeight: 22, fontFamily: 'Inter_400Regular' },
});
