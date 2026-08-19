import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { AvatarCircle } from '../ui/AvatarCircle';
import { Colors, FontSize } from '@/constants';

interface Props {
  title?: string;
  showLogo?: boolean;
  showAvatar?: boolean;
  initials?: string;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
}

export function TopBar({ title, showLogo, showAvatar, initials = 'YA', onNotificationPress, onAvatarPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.inner}>
        {showLogo ? (
          <View style={styles.logo}>
            <Text style={styles.logoEn}>Mithaq</Text>
            <Text style={styles.logoAr}>مِيثَاق</Text>
          </View>
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
        <View style={styles.actions}>
          {onNotificationPress && (
            <Pressable style={styles.iconBtn} onPress={onNotificationPress}>
              <View style={styles.notifDot} />
              <Text style={styles.icon}>🔔</Text>
            </Pressable>
          )}
          {showAvatar && (
            <Pressable onPress={onAvatarPress}>
              <AvatarCircle initials={initials} size={36} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    paddingHorizontal: 18,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.7)',
    zIndex: 10,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { gap: 2 },
  logoEn: { fontSize: FontSize.xl, fontFamily: 'Inter_800ExtraBold', color: Colors.textDark },
  logoAr: { fontSize: FontSize.sm, fontFamily: 'Amiri_400Regular', color: Colors.pinkHot },
  title: { fontSize: FontSize.xl, fontFamily: 'Inter_700Bold', color: Colors.textDark },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  notifDot: {
    position: 'absolute', top: 4, right: 4,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: Colors.pinkHot,
    borderWidth: 2, borderColor: '#fff5f7',
    zIndex: 1,
  },
  icon: { fontSize: 17 },
});
