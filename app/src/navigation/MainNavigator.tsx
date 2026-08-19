import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import DiscoverScreen from '@/screens/main/DiscoverScreen';
import MessagesListScreen from '@/screens/main/MessagesListScreen';
import ProfileScreen from '@/screens/main/ProfileScreen';
import PurposeSetupScreen from '@/screens/onboarding/PurposeSetupScreen';
import MatchDetailScreen from '@/screens/main/MatchDetailScreen';
import ChatScreen from '@/screens/main/ChatScreen';
import { Colors, FontSize } from '@/constants';
import { Routes } from '@/constants/routes';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS: Record<string, string> = {
  [Routes.Discover]: '🔍',
  [Routes.Messages]: '💬',
  [Routes.Profile]: '👤',
  [Routes.Purpose]: '✦',
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={styles.tabIconWrap}>
      <Text style={[styles.tabIconText, focused && styles.tabIconActive]}>{TAB_ICONS[name]}</Text>
      {focused && <View style={styles.tabDot} />}
    </View>
  );
}

function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.DiscoverFeed} component={DiscoverScreen} />
      <Stack.Screen name={Routes.MatchDetail} component={MatchDetailScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name={Routes.Chat} component={ChatScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.Messages} component={MessagesListScreen} />
      <Stack.Screen name={Routes.Chat} component={ChatScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: Colors.pinkHot,
        tabBarInactiveTintColor: Colors.textSoft,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
        ),
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name={Routes.Discover} component={DiscoverStack} />
      <Tab.Screen name={Routes.Messages} component={MessagesStack} />
      <Tab.Screen name={Routes.Profile} component={ProfileScreen} />
      <Tab.Screen name={Routes.Purpose} component={PurposeSetupScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.75)',
    backgroundColor: 'transparent',
    elevation: 0,
    height: 80,
  },
  tabLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: FontSize.xs,
    marginBottom: 6,
  },
  tabIconWrap: { alignItems: 'center', gap: 2 },
  tabIconText: { fontSize: 20, opacity: 0.5 },
  tabIconActive: { opacity: 1 },
  tabDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: Colors.pinkHot,
  },
});
