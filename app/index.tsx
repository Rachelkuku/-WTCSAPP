import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';

export default function Index() {
  const { userType, hydrated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  // AsyncStorage 복원 전 대기
  if (!hydrated) return null;

  // 입주사: 기존 메인으로 바로 진입
  if (userType === 'tenant') return <Redirect href="/(tabs)" />;

  // 그 외 모든 경우(처음 방문, 로그아웃 등): 입주사 로그인 화면으로 바로 진입
  return <Redirect href="/(auth)/login" />;
}
