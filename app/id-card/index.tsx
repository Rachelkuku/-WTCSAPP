import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { QRView } from '../../components/common/QRView';
import { useAuthStore } from '../../store/useAuthStore';
import { showAlert } from '../../utils/showAlert';

export default function IdCardScreen() {
  const user = useAuthStore((s) => s.user);

  const cardValue = user
    ? `WTC-ID:${user.id}:${user.companyId}`
    : 'WTC-ID:GUEST';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={MD3.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Ionicons name="id-card-outline" size={26} color={MD3.primary} />
            </View>
            <View>
              <Text style={styles.headline}>모바일 사원증</Text>
              <Text style={styles.subHeadline}>명함 공유 · 입주사 인증 확인</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.idCard}>
          <View style={styles.idCardTop}>
            <Text style={styles.idCardBrand}>WTCS ASEM·TRADE</Text>
            <Ionicons
              name={user?.isTenantVerified ? 'checkmark-circle' : 'time-outline'}
              size={18}
              color={user?.isTenantVerified ? '#22C55E' : '#F59E0B'}
            />
          </View>

          <View style={styles.qrWrap}>
            <QRView value={cardValue} size={180} />
          </View>

          <Text style={styles.userName}>{user?.name ?? '게스트'}</Text>
          <Text style={styles.userCompany}>{user?.companyName ?? 'WTC SEOUL'}</Text>

          <View style={styles.idCardDivider} />

          <View style={styles.idCardRow}>
            <Text style={styles.idCardLabel}>연락처</Text>
            <Text style={styles.idCardValue}>{user?.phone ?? '-'}</Text>
          </View>
          <View style={styles.idCardRow}>
            <Text style={styles.idCardLabel}>이메일</Text>
            <Text style={styles.idCardValue}>{user?.email ?? '-'}</Text>
          </View>
          <View style={styles.idCardRow}>
            <Text style={styles.idCardLabel}>인증 상태</Text>
            <Text style={[styles.idCardValue, { color: user?.isTenantVerified ? '#22C55E' : '#F59E0B', fontWeight: '700' }]}>
              {user?.isTenantVerified ? '입주사 인증 완료' : '인증 대기중'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.shareBtn}
          onPress={() => showAlert('명함 공유', '연락처 앱 공유 기능 연동 예정입니다.')}
        >
          <Ionicons name="share-social-outline" size={18} color={MD3.primary} />
          <Text style={styles.shareBtnText}>명함 공유하기</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          이 QR은 명함 공유 및 입주사 인증 확인 용도이며, 출입에는 홈 화면의 스피드게이트 QR을 이용해 주세요.
        </Text>
      </ScrollView>
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
  headline: { fontSize: 20, fontWeight: '800', color: MD3.onSurface },
  subHeadline: { fontSize: 12, color: MD3.onSurfaceVariant, marginTop: 3 },

  idCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: MD3.outlineVariant,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#1A3A5C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  idCardTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', marginBottom: 20,
  },
  idCardBrand: { fontSize: 13, fontWeight: '800', color: '#1A3A5C', letterSpacing: 0.5 },
  qrWrap: {
    padding: 14, borderRadius: 16,
    borderWidth: 1, borderColor: '#E8EEF8',
    marginBottom: 16,
  },
  userName: { fontSize: 20, fontWeight: '800', color: MD3.onSurface, marginBottom: 4 },
  userCompany: { fontSize: 13, color: MD3.onSurfaceVariant, marginBottom: 16 },
  idCardDivider: { width: '100%', height: 1, backgroundColor: MD3.outlineVariant, marginBottom: 16 },
  idCardRow: {
    flexDirection: 'row', justifyContent: 'space-between', width: '100%',
    paddingVertical: 6,
  },
  idCardLabel: { fontSize: 13, color: MD3.onSurfaceVariant },
  idCardValue: { fontSize: 13, color: MD3.onSurface, fontWeight: '500' },

  shareBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 20, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: MD3.primary,
  },
  shareBtnText: { fontSize: 15, fontWeight: '700', color: MD3.primary },

  footerNote: {
    fontSize: 11, color: MD3.onSurfaceVariant, textAlign: 'center',
    marginTop: 16, lineHeight: 16, paddingHorizontal: 12,
  },
});
