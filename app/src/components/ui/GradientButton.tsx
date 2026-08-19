import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Gradients, Radius, Shadow } from '@/constants';

interface Props {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
}

export function GradientButton({ label, onPress, style, loading, disabled, variant = 'primary' }: Props) {
  if (variant === 'ghost') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [styles.ghost, pressed && styles.pressed, style]}
      >
        <Text style={styles.ghostText}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed, style]}
    >
      <LinearGradient
        colors={Gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: Radius.md }]}
      />
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Shadow.button,
  },
  label: {
    color: '#fff',
    fontSize: FontSize.lg,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.2,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  ghost: {
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(240,19,77,0.25)',
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 20,
  },
  ghostText: {
    color: Colors.pinkHot,
    fontSize: FontSize.lg,
    fontFamily: 'Inter_700Bold',
  },
});
