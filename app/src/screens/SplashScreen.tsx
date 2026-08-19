import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MeshBackground } from '@/components/layout/MeshBackground';
import { GradientButton } from '@/components/ui/GradientButton';
import { Colors, FontSize, Spacing } from '@/constants';
import { Routes } from '@/constants/routes';

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

export default function SplashScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const crescentSway = useRef(new Animated.Value(-4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, delay: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, delay: 200, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(crescentSway, { toValue: 4, duration: 2500, useNativeDriver: true }),
        Animated.timing(crescentSway, { toValue: -4, duration: 2500, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <MeshBackground />
      <Animated.View style={[styles.inner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Crescent icon */}
        <Animated.View style={{ transform: [{ rotate: crescentSway.interpolate({ inputRange: [-4, 4], outputRange: ['-4deg', '4deg'] }) }], marginBottom: 28 }}>
          <View style={styles.crescentContainer}>
            <Text style={styles.crescentIcon}>☽</Text>
            <Text style={styles.starIcon}>✦</Text>
          </View>
        </Animated.View>

        <Text style={styles.appName}>Mithaq</Text>
        <Text style={styles.arabic}>مِيثَاق</Text>
        <Text style={styles.tagline}>"A covenant, not just a match."</Text>

        <View style={styles.divider} />

        <GradientButton
          label="Begin Your Journey"
          onPress={() => navigation.navigate(Routes.Register)}
          style={styles.cta}
        />

        <View style={styles.pillsRow}>
          {['Verified', 'Purpose-driven', 'Halal'].map((p) => (
            <View key={p} style={styles.pill}>
              <Text style={styles.pillText}>{p}</Text>
            </View>
          ))}
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginHint}>Already have an account? </Text>
          <Text style={styles.loginLink} onPress={() => navigation.navigate(Routes.Login)}>
            Sign in
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
    gap: 0,
  },
  crescentContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crescentIcon: { fontSize: 56, color: Colors.pinkHot },
  starIcon: {
    position: 'absolute',
    top: 4,
    right: 8,
    fontSize: 18,
    color: Colors.pinkMid,
  },
  appName: {
    fontSize: FontSize.hero,
    fontFamily: 'Inter_800ExtraBold',
    color: Colors.textDark,
    letterSpacing: -1,
    lineHeight: 46,
  },
  arabic: {
    fontFamily: 'Amiri_400Regular',
    fontSize: 22,
    color: Colors.pinkHot,
    marginTop: 4,
    marginBottom: 16,
  },
  tagline: {
    fontSize: FontSize.base,
    color: Colors.textMid,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 260,
    fontFamily: 'Inter_400Regular',
  },
  divider: {
    width: 80,
    height: 2,
    backgroundColor: Colors.pinkHot,
    borderRadius: 99,
    marginVertical: 20,
  },
  cta: { width: '100%', marginTop: 4 },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 99,
    backgroundColor: 'rgba(240,19,77,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(240,19,77,0.18)',
  },
  pillText: {
    fontSize: FontSize.xs,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.pinkHot,
  },
  loginRow: { flexDirection: 'row', marginTop: 24, alignItems: 'center' },
  loginHint: { fontSize: FontSize.md, color: Colors.textSoft, fontFamily: 'Inter_400Regular' },
  loginLink: { fontSize: FontSize.md, color: Colors.pinkHot, fontFamily: 'Inter_700Bold' },
});
