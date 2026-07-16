import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { M3TextField } from '../../components/common/M3TextField';
import { M3Button } from '../../components/common/M3Button';
import { M3TopAppBar } from '../../components/common/M3TopAppBar';
import { showAlert } from '../../utils/showAlert';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');

  const handleRegister = () => {
    if (!name || !email || !phone || !password || !company) {
      showAlert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }
    showAlert('회원가입 신청 완료', '관리자 인증 후 입주사 전용 서비스를 이용하실 수 있습니다.', [
      { text: '확인', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <M3TopAppBar title="회원가입" onBack={() => router.back()} />

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Progress indicator */}
        <View style={styles.stepRow}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={[styles.step, s === 1 && styles.stepActive]}>
              <Text style={[styles.stepText, s === 1 && styles.stepTextActive]}>{s}</Text>
            </View>
          ))}
          <View style={styles.stepLine} />
        </View>

        <Text style={styles.sectionLabel}>기본 정보 입력</Text>

        <M3TextField label="이름" value={name} onChangeText={setName} placeholder="홍길동" />
        <M3TextField
          label="이메일"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="example@company.com"
        />
        <M3TextField
          label="휴대폰 번호"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="010-0000-0000"
        />
        <M3TextField
          label="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          helperText="8자 이상, 영문/숫자 조합"
        />
        <M3TextField
          label="소속 회사명"
          value={company}
          onChangeText={setCompany}
          placeholder="(주)회사명"
        />

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color={MD3.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>입주사 인증 안내</Text>
            <Text style={styles.infoBody}>
              가입 후 WTC 관리자 확인 및 입주사 인증 절차가 진행됩니다.
              인증 완료 시 모든 입주사 전용 서비스를 이용하실 수 있습니다.
            </Text>
          </View>
        </View>

        <M3Button label="가입 신청하기" onPress={handleRegister} style={{ marginTop: 8 }} />
        <M3Button
          label="이미 계정이 있어요"
          variant="text"
          onPress={() => router.back()}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: MD3.background },
  scroll: { paddingHorizontal: 24, paddingTop: 16 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
    position: 'relative',
  },
  stepLine: {
    position: 'absolute',
    top: 18,
    left: '20%',
    right: '20%',
    height: 1,
    backgroundColor: MD3.outlineVariant,
    zIndex: -1,
  },
  step: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: MD3.outlineVariant,
    backgroundColor: MD3.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: { backgroundColor: MD3.primary, borderColor: MD3.primary },
  stepText: { fontSize: 14, fontWeight: '600', color: MD3.onSurfaceVariant },
  stepTextActive: { color: MD3.onPrimary },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: MD3.primary, marginBottom: 20, letterSpacing: 1 },
  infoBanner: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: MD3.primaryContainer,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoTitle: { fontSize: 13, fontWeight: '700', color: MD3.onPrimaryContainer, marginBottom: 4 },
  infoBody: { fontSize: 12, color: MD3.onPrimaryContainer, lineHeight: 18 },
});
