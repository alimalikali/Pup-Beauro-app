import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PurposeSetupScreen from '@/screens/onboarding/PurposeSetupScreen';
import VerificationScreen from '@/screens/onboarding/VerificationScreen';
import { Routes } from '@/constants/routes';

const Stack = createNativeStackNavigator();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name={Routes.PurposeSetup} component={PurposeSetupScreen} />
      <Stack.Screen name={Routes.Verification} component={VerificationScreen} />
    </Stack.Navigator>
  );
}
