import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '@/constants';

interface Props {
  initials: string;
  size?: number;
  style?: ViewStyle;
  online?: boolean;
}

export function AvatarCircle({ initials, size = 48, style, online }: Props) {
  const fontSize = size * 0.3;

  return (
    <View style={[{ width: size, height: size }, style]}>
      <LinearGradient
        colors={Gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
      />
      <View style={[styles.inner, { borderRadius: size / 2 }]}>
        <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
      </View>
      {online && <View style={[styles.onlineDot, { borderRadius: 8 }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontFamily: 'Inter_800ExtraBold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fce7f3',
  },
});
