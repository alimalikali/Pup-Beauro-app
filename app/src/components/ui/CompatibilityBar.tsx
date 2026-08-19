import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Gradients, Radius } from '@/constants';

interface Props {
  label?: string;
  value: number;
  style?: ViewStyle;
  animate?: boolean;
}

export function CompatibilityBar({ label, value, style, animate = true }: Props) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: value,
      duration: 800,
      delay: 400,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.pct}>{value}%</Text>
        </View>
      )}
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: animate
                ? widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] })
                : `${value}%`,
            },
          ]}
        >
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: FontSize.md, color: Colors.textSoft },
  pct: { fontSize: FontSize.md, fontFamily: 'Inter_700Bold', color: Colors.pinkHot },
  track: {
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(240,19,77,0.1)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
});
