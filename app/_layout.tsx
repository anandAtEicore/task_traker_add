import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import ToastProvider from 'react-native-toast-message';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
 
import { useColorScheme } from '@/hooks/useColorScheme';
 
SplashScreen.preventAutoHideAsync();
 
const toastConfig = {
  success: ({ text1, text2, ...rest }: { text1?: string; text2?: string; [key: string]: any }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: 'green', backgroundColor: '#e0f7e0' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: 'bold' }}
      text2Style={{ fontSize: 14 }}
      text1={text1}
      text2={text2}
    />
  ),
  error: ({ text1, text2, ...rest }: { text1?: string; text2?: string; [key: string]: any }) => (
    <ErrorToast
      {...rest}
      style={{ borderLeftColor: 'red', backgroundColor: '#f7e0e0' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: 'bold' }}
      text2Style={{ fontSize: 14 }}
      text1={text1}
      text2={text2}
    />
  ),
};
 
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
 
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
 
  if (!loaded) {
    return null;
  }
 
  return (
    <GluestackUIProvider mode="light">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <ToastProvider config={toastConfig} />
        <Toast />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}