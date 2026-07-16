import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { M3Card } from '../../components/common/M3Card';
import { M3TextField } from '../../components/common/M3TextField';
import { showAlert } from '../../utils/showAlert';

const SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

const TEMPLATE_KR = '안녕하세요!\n[방문자직위] [방문자성함] 님의 방문을 진심으로 환영합니다.';
const TEMPLATE_EN = 'Hello!\nWe warmly welcome [Visitor Position] [Visitor Name].';

// 데모용 목업 예약 현황 — 실제 연동 전까지 요일 인덱스(0=월요일) 기준으로 임의 표시
const MOCK_BOOKED: Record<number, string[]> = {
  0: ['11:00', '14:00'],
  2: ['10:00'],
};

function getNextWeekDates(): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dow = today.getDay();
  const daysToNextMon = dow === 0 ? 1 : 8 - dow;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysToNextMon);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(nextMonday);
    d.setDate(nextMonday.getDate() + i);
    return d;
  });
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WelcomeReservationScreen() {
  const dates = useMemo(() => getNextWeekDates(), []);

  const [selectedDateIdx, setSelectedDateIdx] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [language, setLanguage] = useState<'kr' | 'en'>('kr');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [nameKr, setNameKr] = useState('');
  const [nameEn, setNameEn] = useState('');

  const bookedSlots = selectedDateIdx !== null ? (MOCK_BOOKED[selectedDateIdx] ?? []) : [];

  const message = useMemo(() => {
    if (language === 'kr') {
      return TEMPLATE_KR
        .replace('[방문자직위]', position.trim() || '[방문자직위]')
        .replace('[방문자성함]', nameKr.trim() || '[방문자성함]');
    }
    return TEMPLATE_EN
      .replace('[Visitor Position]', position.trim() || '[Visitor Position]')
      .replace('[Visitor Name]', nameEn.trim() || '[Visitor Name]');
  }, [language, position, nameKr, nameEn]);

  const selectDate = (idx: number) => {
    setSelectedDateIdx(idx);
    setSelectedSlot(null);
  };

  const resetForm = () => {
    setSelectedDateIdx(null);
    setSelectedSlot(null);
    setCompany('');
    setPhone('');
    setEmail('');
    setPosition('');
    setNameKr('');
    setNameEn('');
  };

  const handleSubmit = () => {
    if (selectedDateIdx === null) {
      showAlert('날짜 선택', '날짜를 선택해 주세요.');
      return;
    }
    if (!selectedSlot) {
      showAlert('시간 선택', '시간을 선택해 주세요.');
      return;
    }
    if (!company.trim()) {
      showAlert('입력 오류', '입주사명을 입력해 주세요.');
      return;
    }
    if (!phone.trim()) {
      showAlert('입력 오류', '휴대폰 번호를 입력해 주세요.');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      showAlert('입력 오류', '올바른 이메일 주소를 입력해 주세요.');
      return;
    }
    if (!position.trim()) {
      showAlert('입력 오류', '방문자 직위를 입력해 주세요.');
      return;
    }
    if (language === 'kr' && !nameKr.trim()) {
      showAlert('입력 오류', '방문자 성함(국문)을 입력해 주세요.');
      return;
    }
    if (language === 'en' && !nameEn.trim()) {
      showAlert('입력 오류', '방문자 성함(영문)을 입력해 주세요.');
      return;
    }

    const d = dates[selectedDateIdx];
    const dateLabel = `${d.getMonth() + 1}월 ${d.getDate()}일 (${DAY_NAMES[d.getDay()]})`;
    const id = Math.random().toString(16).slice(2, 10).toUpperCase();

    showAlert(
      '신청 완료',
      `${dateLabel} ${selectedSlot} Welcome DID 예약이 접수되었습니다.\n예약번호: ${id}\n검토 후 이메일로 승인 안내를 드립니다.`
    );
    resetForm();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={MD3.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Ionicons name="tv-outline" size={26} color={MD3.primary} />
            </View>
            <View>
              <Text style={styles.headline}>트레이드타워 Welcome 신청</Text>
              <Text style={styles.subHeadline}>방문자 환영 메시지 DID 송출 예약</Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.noticeBar}>
            <Ionicons name="information-circle-outline" size={16} color={MD3.primary} />
            <Text style={styles.noticeText}>데모 화면입니다. 실제 접수는 백엔드 연동 후 반영됩니다.</Text>
          </View>

          {/* 날짜 선택 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. 날짜 선택</Text>
            <View style={styles.dateRow}>
              {dates.map((d, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.dateBtn, selectedDateIdx === idx && styles.dateBtnActive]}
                  onPress={() => selectDate(idx)}
                >
                  <Text style={[styles.dateDayName, selectedDateIdx === idx && styles.dateTextActive]}>
                    {DAY_NAMES[d.getDay()]}요일
                  </Text>
                  <Text style={[styles.dateDayNum, selectedDateIdx === idx && styles.dateTextActive]}>
                    {d.getDate()}
                  </Text>
                  <Text style={[styles.dateSub, selectedDateIdx === idx && styles.dateTextActive]}>
                    {d.getMonth() + 1}/{d.getDate()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 시간 선택 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. 시간 선택</Text>
            {selectedDateIdx === null ? (
              <Text style={styles.helperText}>날짜를 먼저 선택해 주세요.</Text>
            ) : (
              <View style={styles.slotGrid}>
                {SLOTS.map((slot) => {
                  const booked = bookedSlots.includes(slot);
                  const active = selectedSlot === slot;
                  return (
                    <TouchableOpacity
                      key={slot}
                      style={[styles.slotBtn, active && styles.slotBtnActive, booked && styles.slotBtnBooked]}
                      onPress={() => !booked && setSelectedSlot(slot)}
                      disabled={booked}
                    >
                      <Text style={[styles.slotText, active && styles.dateTextActive, booked && styles.slotTextBooked]}>
                        {slot}
                      </Text>
                      {booked && <Text style={styles.slotBookedLabel}>예약됨</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* 신청 정보 입력 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. 신청 정보 입력</Text>

            <M3TextField label="입주사명" value={company} onChangeText={setCompany} placeholder="예: WTC SEOUL" />
            <M3TextField label="휴대폰 번호" value={phone} onChangeText={setPhone} placeholder="010-0000-0000" keyboardType="phone-pad" />
            <M3TextField label="이메일" value={email} onChangeText={setEmail} placeholder="name@company.com" keyboardType="email-address" autoCapitalize="none" />
            <M3TextField label="방문자 직위" value={position} onChangeText={setPosition} placeholder="예: 대표이사, 부장" />

            <Text style={styles.fieldLabel}>언어 선택 (DID 송출 언어 1개 선택)</Text>
            <View style={styles.langToggle}>
              <TouchableOpacity
                style={[styles.langBtn, language === 'kr' && styles.langBtnActive]}
                onPress={() => setLanguage('kr')}
              >
                <Text style={[styles.langBtnText, language === 'kr' && styles.langBtnTextActive]}>국문</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.langBtnText, language === 'en' && styles.langBtnTextActive]}>영문</Text>
              </TouchableOpacity>
            </View>

            {language === 'kr' ? (
              <M3TextField label="방문자 성함 (국문)" value={nameKr} onChangeText={setNameKr} placeholder="예: 홍길동" />
            ) : (
              <M3TextField label="방문자 성함 (영문)" value={nameEn} onChangeText={setNameEn} placeholder="예: Hong Gildong" />
            )}

            <M3TextField
              label="송출 멘트 (자동 생성)"
              value={message}
              editable={false}
              multiline
              numberOfLines={3}
              style={{ minHeight: 72 }}
            />
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
              <Text style={styles.submitBtnText}>예약 신청하기</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  headline: { fontSize: 19, fontWeight: '800', color: MD3.onSurface },
  subHeadline: { fontSize: 12, color: MD3.onSurfaceVariant, marginTop: 3 },

  noticeBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: MD3.primaryContainer, borderRadius: 12,
    marginHorizontal: 16, marginTop: 16, padding: 12,
  },
  noticeText: { flex: 1, fontSize: 12, color: MD3.onPrimaryContainer },

  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: MD3.onSurface, marginBottom: 12 },
  helperText: { fontSize: 13, color: MD3.onSurfaceVariant, textAlign: 'center', paddingVertical: 12 },

  dateRow: { flexDirection: 'row', gap: 8 },
  dateBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 10,
    borderRadius: 14, borderWidth: 1.5, borderColor: MD3.outlineVariant,
    backgroundColor: MD3.surface,
  },
  dateBtnActive: { backgroundColor: MD3.primary, borderColor: MD3.primary },
  dateDayName: { fontSize: 11, fontWeight: '600', color: MD3.onSurfaceVariant },
  dateDayNum: { fontSize: 17, fontWeight: '700', color: MD3.onSurface, marginVertical: 2 },
  dateSub: { fontSize: 10, color: MD3.onSurfaceVariant },
  dateTextActive: { color: '#FFFFFF' },

  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotBtn: {
    width: '22.5%', alignItems: 'center', paddingVertical: 10,
    borderRadius: 12, borderWidth: 1.5, borderColor: MD3.outlineVariant,
    backgroundColor: MD3.surface,
  },
  slotBtnActive: { backgroundColor: MD3.primary, borderColor: MD3.primary },
  slotBtnBooked: { backgroundColor: MD3.errorContainer, borderColor: MD3.errorContainer },
  slotText: { fontSize: 13, fontWeight: '600', color: MD3.onSurface },
  slotTextBooked: { color: MD3.error },
  slotBookedLabel: { fontSize: 9, color: MD3.error, marginTop: 2 },

  fieldLabel: { fontSize: 12, fontWeight: '500', color: MD3.onSurfaceVariant, marginBottom: 8 },
  langToggle: {
    flexDirection: 'row', borderRadius: 4, overflow: 'hidden',
    borderWidth: 1, borderColor: MD3.outline, marginBottom: 16,
  },
  langBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, backgroundColor: MD3.surface },
  langBtnActive: { backgroundColor: MD3.primary },
  langBtnText: { fontSize: 14, fontWeight: '600', color: MD3.onSurfaceVariant },
  langBtnTextActive: { color: '#FFFFFF' },

  submitBtn: {
    backgroundColor: MD3.primary,
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
