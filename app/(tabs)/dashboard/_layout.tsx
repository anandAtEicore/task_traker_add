

import { View, StyleSheet, ScrollView } from 'react-native';
import { Slot } from 'expo-router';

export default function DashboardLayout() {
  return (
    <ScrollView>
      <Slot />
    </ScrollView>
  );
}