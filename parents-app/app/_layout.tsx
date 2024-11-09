// import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useColorScheme } from '@/components/useColorScheme';
import { AppContextProvider } from '../utilities/context/app-context';

import { default as mappingJson } from '../mapping.json'; // <-- Import app mapping
// import "./output.css";
import "./input";
import { StatusBar } from 'expo-status-bar';
import { default as theme } from '../constants/theme/theme.json'; // <-- Import app theme

const mapping: any = {
  ...mappingJson
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Cairo-Bold": require('../assets/fonts/Cairo-Bold.ttf'),
    "Cairo-ExtraBold": require('../assets/fonts/Cairo-ExtraBold.ttf'),
    "Cairo-Regular": require('../assets/fonts/Cairo-Regular.ttf'),
    "Cairo-Medium": require('../assets/fonts/Cairo-Medium.ttf'),
    "Cairo-Light": require('../assets/fonts/Cairo-Light.ttf'),
    // ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AppContextProvider>
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }} customMapping={mapping}>
        <IconRegistry icons={EvaIconsPack} />
        {/* <StatusBar style={Platform.OS === 'ios' ? 'light' : 'light'} /> */}
        <StatusBar style={"dark"} hidden />
        {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
        <StackRoot />
        {/* </ThemeProvider> */}
      </ApplicationProvider>
    </AppContextProvider>
  );
}

const StackRoot = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "Cairo-Regular",
          fontWeight: "700",
        }
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  )
}
