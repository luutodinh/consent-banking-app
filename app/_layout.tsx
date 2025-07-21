import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import '../global.css';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  // useEffect(() => {
  //   const subscription = Linking.addEventListener('url', ({ url }) => {
  //     console.log('📦This is spending tracker', url);
  //   });

  //   return () => subscription.remove();
  // }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#ffffff' },
          animation: 'slide_from_right',
        }}
      >
        {/* Index Screen - Auto redirect */}
        <Stack.Screen
          name='index'
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        {/* Auth Group - Login flow */}
        <Stack.Screen
          name='(auth)'
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        {/* Consent Screen - Full screen without tabs */}
        <Stack.Screen
          name='consent'
          options={{
            headerShown: false,
            gestureEnabled: false,
            presentation: 'modal',
          }}
        />

        {/* Main App - Tabs */}
        <Stack.Screen
          name='(tabs)'
          options={{
            headerShown: false,
          }}
        />

        {/* 404 Screen */}
        <Stack.Screen
          name='+not-found'
          options={{
            title: 'Page Not Found',
            headerShown: true,
          }}
        />
      </Stack>
      <StatusBar style='auto' />
    </ThemeProvider>
  );
}
