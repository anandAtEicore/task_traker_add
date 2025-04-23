// components/ProtectedRoute.tsx
import React, { useContext, useEffect, ReactNode, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { router, usePathname } from 'expo-router';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

  const userContext = useContext(UserContext);
  const pathname = usePathname();

  if (!userContext) {
    return <ThemedText>Error: User context not available</ThemedText>;
  }

  const { userDetails, isLoading } = userContext;

  useEffect(() => {
    // Wait until loading is complete and navigator is mounted
    if (isLoading) return;

    if (pathname === '/') {
      router.replace('/(tabs)/dashboard');
    }
    // Allow access to login and signup routes without authentication
    if (pathname === '/(tabs)/login' || pathname === '/(tabs)/signup') {
      return;
    }

    // Redirect to login if user is not authenticated
    if (!userDetails) {
      router.replace('/(tabs)/login');
    }
  }, [userDetails, isLoading, pathname]);

  // Show loading state while checking AsyncStorage
  if (isLoading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  // Always render children to ensure navigator mounts
  return <>{children}</>;
};