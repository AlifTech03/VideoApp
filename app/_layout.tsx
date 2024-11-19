import '../global.css';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Suspense, useEffect } from 'react';
import GlobalProvider from '@/context/GlobalProvider';
import * as SQLite from 'expo-sqlite';
import { Text } from 'react-native';

SplashScreen.preventAutoHideAsync();
export default function Layout() {
  const [fontLoaded, error] = useFonts({
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Black': require('@/assets/fonts/Poppins-Black.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('@/assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Light': require('@/assets/fonts/Poppins-Light.ttf'),
    'Poppins-Thin': require('@/assets/fonts/Poppins-Thin.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontLoaded) SplashScreen.hideAsync();
  }, [fontLoaded, error]);

  if (!fontLoaded && !error) return null;
  return (
        <GlobalProvider>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="search/[query]"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </GlobalProvider>


  );
}
