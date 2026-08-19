import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '@/store';
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainNavigator } from './MainNavigator';

export function AppNavigator() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const needsOnboarding = useAppSelector((s) => s.auth.needsOnboarding);

  return (
    <NavigationContainer>
      {!isAuthenticated
        ? <AuthNavigator />
        : needsOnboarding
          ? <OnboardingNavigator />
          : <MainNavigator />}
    </NavigationContainer>
  );
}
