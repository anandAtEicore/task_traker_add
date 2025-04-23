

import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserDrawer } from "@/components/UserDrawer";
import { Icon, MenuIcon } from '@/components/ui/icon';
import { UserProvider } from "@/context/UserContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Custom header component
  const CustomHeader = () => (
    <ThemedView
      className="h-16 flex-row items-center justify-between px-4"
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
        ...Platform.select({
          ios: { shadowOpacity: 0 },
          default: {
            borderBottomWidth: 1,
            borderBottomColor: Colors[colorScheme ?? "light"].border,
          },
        }),
      }}
    >
      <Pressable onPress={()=>router.push("/(tabs)/dashboard")}>
      
      <ThemedText
        className="text-xl font-bold"
        style={{ color: Colors[colorScheme ?? "light"].text }}
        >
        Task Tracker
      </ThemedText>
        </Pressable>
      <Pressable onPress={() => setIsDrawerOpen(true)}>
        <Icon
          as={MenuIcon}
          size="lg"
          className="text-typography-600"
        />
      </Pressable>
    </ThemedView>
  );

  return (
    <UserProvider>
      <ProtectedRoute>
        <Stack
          screenOptions={{
            header: CustomHeader, // Default header for all screens
          }}
        >
          {/* Define specific screens */}
          <Stack.Screen
            name="login"
            options={{
              headerShown: false, // Hide header for login screen
            }}
          />
          {/* Add other screens as needed */}
          <Stack.Screen
            name="(tabs)/entries-log" // Assuming TaskTrackerScreen is here
            options={{
              // Inherits CustomHeader from screenOptions
            }}
          />
        </Stack>

        <UserDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </ProtectedRoute>
    </UserProvider>
  );
}