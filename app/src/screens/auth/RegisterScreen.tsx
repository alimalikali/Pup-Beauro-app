import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { setToken } from '@/utils/secureStorage';
import { MeshBackground } from '@/components/layout/MeshBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Colors, FontSize, Radius, Spacing } from '@/constants';
import { Routes } from '@/constants/routes';
import { authApi } from '@/services/api';
import { connectSocket } from '@/services/socket';
import { useAppDispatch } from '@/store';
import { registerSuccess } from '@/store/authSlice';

interface Props { navigation: NativeStackNavigationProp<any> }

const STEPS = ['Account', 'About You', 'Done'];

export default function RegisterScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    gender: 'male' as 'male' | 'female',
    city: '',
    phone: '',
  });

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleNext = async () => {
    if (step === 0) {
      if (!form.email || !form.password) { setError('Fill email and password'); return; }
      setError('');
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!form.displayName || !form.city) { setError('Fill name and city'); return; }
      setError('');
      setLoading(true);
      try {
        const res = await authApi.register(form) as any;
        await setToken('token', res.token);
        dispatch(registerSuccess(res));
        connectSocket(res.token);
      } catch (e: any) {
        setError(e?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <MeshBackground />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>Mithaq</Text>
          <Text style={styles.logoAr}>مِيثَاق</Text>
        </View>

        {/* Step dots */}
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotDone]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>{STEPS[step]}</Text>

        <GlassCard style={styles.card}>
          <View style={styles.form}>
            {step === 0 && (
              <>
                <Field label="Email" value={form.email} onChange={set('email')} keyboard="email-address" />
                <Field label="Password" value={form.password} onChange={set('password')} secure />
                <Field label="Phone (optional)" value={form.phone} onChange={set('phone')} keyboard="phone-pad" />
              </>
            )}
            {step === 1 && (
              <>
                <Field label="Display Name" value={form.displayName} onChange={set('displayName')} />
                <Field label="City" value={form.city} onChange={set('city')} />
                <View>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.genderRow}>
                    {(['male', 'female'] as const).map((g) => (
                      <Pressable
                        key={g}
                        style={[styles.genderBtn, form.gender === g && styles.genderBtnActive]}
                        onPress={() => setForm((f) => ({ ...f, gender: g }))}
                      >
                        <Text style={[styles.genderText, form.gender === g && styles.genderTextActive]}>
                          {g === 'male' ? '♂ Brother' : '♀ Sister'}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </>
            )}
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <GradientButton
              label={step < 1 ? 'Continue →' : 'Create Account'}
              onPress={handleNext}
              loading={loading}
            />
          </View>
        </GlassCard>

        {step > 0 && (
          <Pressable onPress={() => setStep((s) => s - 1)}>
            <Text style={styles.back}>← Back</Text>
          </Pressable>
        )}
        <Pressable onPress={() => navigation.navigate(Routes.Login)}>
          <Text style={styles.switchText}>Have account? <Text style={styles.switchLink}>Sign in</Text></Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, value, onChange, keyboard = 'default', secure = false }: {
  label: string; value: string; onChange: (v: string) => void;
  keyboard?: any; secure?: boolean;
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        secureTextEntry={secure}
        autoCapitalize="none"
        placeholderTextColor={Colors.textSoft}
        placeholder={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: Spacing.xxl, justifyContent: 'center', gap: Spacing.xl },
  header: { alignItems: 'center', gap: 4 },
  logo: { fontSize: FontSize.h1, fontFamily: 'Inter_800ExtraBold', color: Colors.textDark, letterSpacing: -1 },
  logoAr: { fontFamily: 'Amiri_400Regular', fontSize: 18, color: Colors.pinkHot },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 7, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 99, backgroundColor: 'rgba(240,19,77,0.2)' },
  dotActive: { width: 26, backgroundColor: Colors.pinkHot },
  dotDone: { backgroundColor: Colors.pinkMid },
  stepLabel: { textAlign: 'center', fontSize: FontSize.md, color: Colors.textSoft, fontFamily: 'Inter_500Medium', marginTop: 4 },
  card: {},
  form: { padding: Spacing.xxl, gap: Spacing.lg },
  label: { fontSize: FontSize.md, fontFamily: 'Inter_600SemiBold', color: Colors.textMid, marginBottom: 6 },
  input: {
    height: 48, borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1.5, borderColor: 'rgba(240,19,77,0.18)',
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.body, fontFamily: 'Inter_400Regular', color: Colors.textDark,
  },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: {
    flex: 1, height: 48, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(240,19,77,0.18)',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  genderBtnActive: { backgroundColor: Colors.pinkHot, borderColor: Colors.pinkHot },
  genderText: { fontSize: FontSize.body, fontFamily: 'Inter_600SemiBold', color: Colors.pinkHot },
  genderTextActive: { color: '#fff' },
  error: { fontSize: FontSize.md, color: Colors.pinkHot, textAlign: 'center', fontFamily: 'Inter_500Medium' },
  back: { textAlign: 'center', color: Colors.textSoft, fontFamily: 'Inter_500Medium', fontSize: FontSize.md },
  switchText: { textAlign: 'center', fontSize: FontSize.md, color: Colors.textSoft, fontFamily: 'Inter_400Regular' },
  switchLink: { color: Colors.pinkHot, fontFamily: 'Inter_700Bold' },
});
