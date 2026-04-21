import { useFonts } from 'expo-font';
import { Link, Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Button } from 'react-native';
import React, { FC, useEffect } from 'react';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getUserData } from '@/services';
import { LogBox } from 'react-native';
import { ChatProvider } from '@/contexts/ChatContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
LogBox.ignoreLogs(['Warning: TNodeChildrenRender', 'Warning: MemoizedTNodeRender', 'Warning: TRenderEngineProvider']);
const _layout = () => {

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
    <AuthProvider>
      <ChatProvider>
        <MainLayout />
      </ChatProvider>
    </AuthProvider>
  );
};

const MainLayout: FC = () => {
  const router = useRouter();
  const { setAuth, setUserData } = useAuth();

  const updateUserData = async (user: any, email?: string) => {
    let res = await getUserData(user.id);
    if (res.success) {
      if (res.data) {
        setUserData?.({ ...res.data, email });
      }
    }
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed - Event:', _event);
      console.log('Auth state changed - Session:', session?.user ? 'User logged in' : 'No session');

      if (session) {
        /** Set auth */
        console.log('Setting auth user:', session.user.id);
        setAuth?.(session.user as any);

        const userData = await getUserData(session.user.id);
        console.log('User data result:', userData);

        if (userData.success && userData.data) {
          updateUserData(session.user, session.user.email);
          console.log('User type:', userData.data.user_type);

          if (userData.data.user_type === "farmer") {
            console.log('Navigating to farmer tabs');
            router.replace('/(tabs)');
          } else {
            console.log('Navigating to buyer tabs');
            router.replace('/(buyer)');
          }
        } else {
          console.error('Failed to get user data:', userData.msg);
          // If we can't get user data, sign out
          await supabase.auth.signOut();
        }
      } else {
        /** Set auth null */
        console.log('No session, setting auth to null');
        setAuth?.(null);
        router.replace('/welcome');
      }
    });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="welcome">
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-produce"
        options={{
          presentation: "modal",
          headerShown: false
        }}
      />
    </Stack>
  );
};

export default _layout;
