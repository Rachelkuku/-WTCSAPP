import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="gateway" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(visitor)" />
          <Stack.Screen name="webview" />
          <Stack.Screen name="safety/index" />
          <Stack.Screen name="car-finder/index" />
          <Stack.Screen name="notice/[id]" options={{ headerShown: true, title: '공지사항', headerBackTitle: '' }} />
          <Stack.Screen name="coex/[id]" options={{ headerShown: true, title: '전시 상세', headerBackTitle: '' }} />
          <Stack.Screen name="poll/[id]" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
