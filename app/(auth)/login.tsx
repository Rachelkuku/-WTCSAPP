import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { M3TextField } from '../../components/common/M3TextField';
import { M3Button } from '../../components/common/M3Button';
import { useAuthStore } from '../../store/useAuthStore';
import { showAlert } from '../../utils/showAlert';

const heroBg = require('../../assets/mascot2.png');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('입력 오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch {
      showAlert('로그인 실패', '이메일 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero — 하늘+빌딩+두 캐릭터 배경 꽉 채우기 */}
          <ImageBackground source={heroBg} style={styles.hero} resizeMode="cover">
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>WTCS ASEM·TRADE</Text>
              <Text style={styles.heroSubtitle}>입주사 전용 멤버십 플랫폼</Text>
            </View>
          </ImageBackground>

          {/* 로그인 카드 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>로그인</Text>

            <M3TextField
              label="이메일"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="example@company.com"
            />

            <View style={styles.passwordRow}>
              <M3TextField
                label="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword((v) => !v)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={MD3.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>

            <M3Button
              label="로그인"
              onPress={handleLogin}
              loading={isLoading}
              style={{ marginTop: 8 }}
            />

            <M3Button
              label="비회원으로 둘러보기"
              variant="tonal"
              onPress={() => router.replace('/(tabs)')}
              style={{ marginTop: 12 }}
            />

            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>

          {/* 회원가입 */}
          <View style={styles.registerRow}>
            <Text style={styles.registerHint}>WTC 입주사 직원이신가요?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#C8DEF5' },
  scroll: { flexGrow: 1, paddingBottom: 40 },

  hero: {
    width: '100%',
    height: 280,
    marginBottom: 0,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 24,
    backgroundColor: 'rgba(30,60,100,0.15)',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  card: {
    backgroundColor: MD3.surface,
    borderRadius: 28,
    padding: 24,
    elevation: 3,
    shadowColor: MD3.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    marginBottom: 24,
    marginHorizontal: 24,
    marginTop: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: MD3.onSurface,
    marginBottom: 20,
  },
  passwordRow: { position: 'relative' },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 20,
    padding: 8,
  },
  forgotRow: { alignItems: 'center', marginTop: 16 },
  forgotText: { fontSize: 14, color: MD3.primary, fontWeight: '500' },

  registerRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingHorizontal: 24 },
  registerHint: { fontSize: 14, color: MD3.onSurfaceVariant },
  registerLink: { fontSize: 14, color: MD3.primary, fontWeight: '700' },
});
