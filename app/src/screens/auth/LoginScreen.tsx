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
import { loginSuccess } from '@/store/authSlice';

interface Props { navigation: NativeStackNavigationProp<any> }

export default function LoginScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Fill all fields'); return; }
    setLoading(true); setError('');
    try {
      const res = await authApi.login({ email, password }) as any;
      await setToken('token', res.token);
      dispatch(loginSuccess(res));
      connectSocket(res.token);
    } catch (e: any) {
      setError(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <MeshBackground />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>Mithaq</Text>
          <Text style={styles.logoAr}>مِيثَاق</Text>
          <Text style={styles.subtitle}>Welcome back</Text>
        </View>

        <GlassCard style={styles.card}>
          <View style={styles.form}>
            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textSoft}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.textSoft}
                secureTextEntry
              />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <GradientButton label="Sign In" onPress={handleLogin} loading={loading} />
          </View>
        </GlassCard>

        <Pressable onPress={() => navigation.navigate(Routes.Register)}>
          <Text style={styles.switchText}>
            No account? <Text style={styles.switchLink}>Register →</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: Spacing.xxl, justifyContent: 'center', gap: 28 },
  header: { alignItems: 'center', gap: 4 },
  logo: { fontSize: FontSize.hero, fontFamily: 'Inter_800ExtraBold', color: Colors.textDark, letterSpacing: -1 },
  logoAr: { fontFamily: 'Amiri_400Regular', fontSize: 20, color: Colors.pinkHot },
  subtitle: { fontSize: FontSize.lg, color: Colors.textMid, fontFamily: 'Inter_400Regular', marginTop: 8 },
  card: { overflow: 'hidden' },
  form: { padding: Spacing.xxl, gap: Spacing.lg },
  label: { fontSize: FontSize.md, fontFamily: 'Inter_600SemiBold', color: Colors.textMid, marginBottom: 6 },
  input: {
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1.5,
    borderColor: 'rgba(240,19,77,0.18)',
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.body,
    fontFamily: 'Inter_400Regular',
    color: Colors.textDark,
  },
  error: { fontSize: FontSize.md, color: Colors.pinkHot, textAlign: 'center', fontFamily: 'Inter_500Medium' },
  switchText: { textAlign: 'center', fontSize: FontSize.md, color: Colors.textSoft, fontFamily: 'Inter_400Regular' },
  switchLink: { color: Colors.pinkHot, fontFamily: 'Inter_700Bold' },
});
