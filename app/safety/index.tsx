import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { M3Card } from '../../components/common/M3Card';
import { M3Chip } from '../../components/common/M3Chip';
import { useAuthStore } from '../../store/useAuthStore';
import { showAlert } from '../../utils/showAlert';

const BUILDINGS = ['트레이드타워', '아셈타워', '코엑스몰', '기타'];

const CATEGORIES = [
  '시설 파손',
  '누수/전기 위험',
  '화재 위험',
  '미끄럼/낙상 위험',
  '위생/환경',
  '기타 안전 위험',
];

function makeReportNo() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `SR-${y}${m}${d}-${seq}`;
}

export default function SafetyReportScreen() {
  const user = useAuthStore((s) => s.user);

  const [photoCount, setPhotoCount] = useState(0);
  const [building, setBuilding] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [password, setPassword] = useState('');

  const togglePhoto = (idx: number) => {
    setPhotoCount((prev) => (idx < prev ? idx : idx + 1));
  };

  const handleSubmit = () => {
    if (photoCount === 0) {
      showAlert('사진 필요', '위해요소 사진을 최소 1장 첨부해 주세요.');
      return;
    }
    if (!building) {
      showAlert('건물 선택', '신고할 건물을 선택해 주세요.');
      return;
    }
    if (!location.trim()) {
      showAlert('상세 위치 필요', '상세 위치를 입력해 주세요.');
      return;
    }
    if (!category) {
      showAlert('신고 유형 선택', '신고 유형을 선택해 주세요.');
      return;
    }
    if (isAnonymous && password.trim().length !== 4) {
      showAlert('조회 비밀번호 필요', '익명 신고는 4자리 조회 비밀번호를 입력해야 합니다.');
      return;
    }

    const reportNo = makeReportNo();
    showAlert(
      '신고가 접수되었습니다',
      `접수번호: ${reportNo}\n처리 현황은 상태 변경 시 푸시로 안내드립니다.`,
      [{ text: '확인', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={MD3.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Ionicons name="shield-checkmark" size={26} color={MD3.onSurface} />
            </View>
            <View>
              <Text style={styles.headline}>안전신문고</Text>
              <Text style={styles.subHeadline}>건물내 안전 위험요소 신고</Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* 사진 첨부 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>사진 첨부 (최대 3장)</Text>
            <View style={styles.photoRow}>
              {[0, 1, 2].map((idx) => {
                const filled = idx < photoCount;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.photoSlot, filled && styles.photoSlotFilled]}
                    onPress={() => togglePhoto(idx)}
                  >
                    <Ionicons
                      name={filled ? 'image' : 'camera-outline'}
                      size={26}
                      color={filled ? MD3.primary : MD3.onSurfaceVariant}
                    />
                    {filled && (
                      <View style={styles.photoRemoveDot}>
                        <Ionicons name="close" size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 건물 선택 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>건물</Text>
            <View style={styles.chipRow}>
              {BUILDINGS.map((b) => (
                <M3Chip key={b} label={b} selected={building === b} onPress={() => setBuilding(b)} />
              ))}
            </View>
          </View>

          {/* 상세 위치 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>상세 위치</Text>
            <M3Card variant="outlined" style={{ padding: 4 }}>
              <TextInput
                style={styles.textInput}
                placeholderTextColor={MD3.outline}
                value={location}
                onChangeText={setLocation}
              />
            </M3Card>
          </View>

          {/* 신고 유형 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>신고 유형</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((c) => (
                <M3Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
              ))}
            </View>
          </View>

          {/* 내용 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>신고 내용 (선택)</Text>
            <M3Card variant="outlined" style={{ padding: 4 }}>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="상황을 자세히 알려주시면 처리에 도움이 됩니다."
                placeholderTextColor={MD3.outline}
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
              />
            </M3Card>
          </View>

          {/* 익명 여부 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>신고자 정보</Text>
            <View style={styles.chipRow}>
              <M3Chip label="실명" selected={!isAnonymous} onPress={() => setIsAnonymous(false)} />
              <M3Chip label="익명" selected={isAnonymous} onPress={() => setIsAnonymous(true)} />
            </View>

            {isAnonymous ? (
              <M3Card variant="outlined" style={{ padding: 4, marginTop: 10 }}>
                <TextInput
                  style={styles.textInput}
                  placeholder="조회 비밀번호 4자리 (숫자)"
                  placeholderTextColor={MD3.outline}
                  value={password}
                  onChangeText={(v) => setPassword(v.replace(/[^0-9]/g, '').slice(0, 4))}
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={4}
                />
              </M3Card>
            ) : (
              user && (
                <View style={styles.contactBox}>
                  <Ionicons name="call-outline" size={16} color={MD3.onSurfaceVariant} />
                  <Text style={styles.contactText}>{user.name} · {user.phone}</Text>
                </View>
              )
            )}
          </View>

          <View style={{ height: 8 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 제출 버튼 */}
      <View style={styles.submitBar}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.submitBtnText}>신고 접수하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    backgroundColor: '#E4ECFB',
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  headerInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14 },
  headerIconBox: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },
  headline: { fontSize: 22, fontWeight: '800', color: MD3.onSurface },
  subHeadline: { fontSize: 12, color: MD3.onSurfaceVariant, marginTop: 3 },

  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: MD3.onSurface, marginBottom: 10 },

  photoRow: { flexDirection: 'row', gap: 12 },
  photoSlot: {
    width: 84, height: 84, borderRadius: 16,
    backgroundColor: MD3.surfaceVariant,
    borderWidth: 1.5, borderColor: MD3.outlineVariant, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  photoSlotFilled: {
    backgroundColor: MD3.primaryContainer,
    borderStyle: 'solid', borderColor: MD3.primary,
  },
  photoRemoveDot: {
    position: 'absolute', top: -6, right: -6,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: MD3.error,
    alignItems: 'center', justifyContent: 'center',
  },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  textInput: { fontSize: 14, color: MD3.onSurface, paddingHorizontal: 12, paddingVertical: 12 },
  textArea: { height: 96, textAlignVertical: 'top' },

  contactBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 10, paddingHorizontal: 4,
  },
  contactText: { fontSize: 13, color: MD3.onSurfaceVariant, fontWeight: '500' },

  submitBar: {
    paddingHorizontal: 16, paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 16 : 16,
    borderTopWidth: 1, borderTopColor: MD3.outlineVariant,
    backgroundColor: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: MD3.primary,
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
