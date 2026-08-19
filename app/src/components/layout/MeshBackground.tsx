import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export function MeshBackground() {
  const orbA = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const orbB = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const orbC = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    const loop = (orb: Animated.ValueXY, tx: number, ty: number, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(orb, { toValue: { x: tx, y: ty }, duration, useNativeDriver: true }),
          Animated.timing(orb, { toValue: { x: 0, y: 0 }, duration, useNativeDriver: true }),
        ]),
      );

    const a = loop(orbA, 40, 30, 7000);
    const b = loop(orbB, -30, -20, 9000);
    const c = loop(orbC, 20, -30, 11000);

    a.start(); b.start(); c.start();
    return () => { a.stop(); b.stop(); c.stop(); };
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.bg} />
      <Animated.View
        style={[styles.orb, styles.orbA, { transform: orbA.getTranslateTransform() }]}
      />
      <Animated.View
        style={[styles.orb, styles.orbB, { transform: orbB.getTranslateTransform() }]}
      />
      <Animated.View
        style={[styles.orb, styles.orbC, { transform: orbC.getTranslateTransform() }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff5f7',
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.6,
  },
  orbA: {
    width: 320,
    height: 320,
    backgroundColor: '#fecdd3',
    top: -80,
    left: -80,
  },
  orbB: {
    width: 280,
    height: 280,
    backgroundColor: '#fbcfe8',
    bottom: -60,
    right: -60,
  },
  orbC: {
    width: 200,
    height: 200,
    backgroundColor: '#fda4af',
    top: '35%',
    left: '25%',
    opacity: 0.4,
  },
});
