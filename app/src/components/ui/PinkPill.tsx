import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Gradients, Radius } from '@/constants';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function PinkPill({ label, active, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.base, active && styles.active, pressed && styles.pressed, style]}
    >
      {active && (
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(240,19,77,0.18)',
    backgroundColor: 'rgba(240,19,77,0.06)',
    overflow: 'hidden',
  },
  active: {
    borderColor: 'transparent',
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  text: {
    fontSize: FontSize.sm,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.pinkHot,
  },
  textActive: { color: '#fff' },
});
