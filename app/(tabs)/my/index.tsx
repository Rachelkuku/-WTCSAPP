import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../../constants/colors';
import { M3Card } from '../../../components/common/M3Card';
import { M3Button } from '../../../components/common/M3Button';
import { useAuthStore } from '../../../store/useAuthStore';
import { showAlert } from '../../../utils/showAlert';

const mascotImg = require('../../../assets/mascot_clean.png');

const NOTIF_SETTINGS = [
  { key: 'ops', label: '운영공지' },
  { key: 'construction', label: '공사·점검공지' },
  { key: 'urgent', label: '긴급공지' },
  { key: 'benefit', label: 'WTC 혜택 알림' },
  { key: 'coupon', label: '쿠폰 만료' },
  { key: 'coex', label: '코엑스 전시 일정' },
  { key: 'community', label: '커뮤니티 댓글' },
  { key: 'apply', label: '신청 처리 결과' },
];

const MY_MENUS = [
  { label: '모바일 사원증', icon: 'id-card-outline' as const, onPress: () => router.push('/id-card' as any) },
  { label: '내 신청 내역', icon: 'document-text-outline' as const, badge: '3' },
  { label: '내 쿠폰함', icon: 'ticket-outline' as const, badge: '1' },
  { label: '내 게시글', icon: 'create-outline' as const },
  { label: '내 설문/투표 참여', icon: 'bar-chart-outline' as const },
];

const ACCOUNT_MENUS = [
  { label: '회원정보 수정', icon: 'person-outline' as const },
  { label: '입주사 회원관리', icon: 'people-outline' as const },
];

export default function MyScreen() {
  const { user, isLoggedIn, logout } = useAuthStore();
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_SETTINGS.map((s) => [s.key, true]))
  );

  const toggleNotif = (key: string) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleLogout = () =>
    showAlert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <View style={styles.headerLeft}>
              <Text style={styles.headline}>마이페이지</Text>
            </View>
            <Image source={mascotImg} style={styles.headerCharImg} resizeMode="contain" />
          </View>
          <View style={styles.headerDeco}>
            {[0, 1, 2].map(i => (
              <View key={i} style={[styles.decoCircle, { width: 60 + i * 30, height: 60 + i * 30, opacity: 0.1 - i * 0.02, right: -20 + i * 10, top: -20 + i * 10 }]} />
            ))}
          </View>
        </View>
        <View style={styles.guestBox}>
          <View style={styles.guestAvatar}>
            <Ionicons name="person-outline" size={40} color={MD3.onSurfaceVariant} />
          </View>
          <Text style={styles.guestTitle}>로그인이 필요합니다</Text>
          <Text style={styles.guestSub}>입주사 로그인 후 이용하세요</Text>
          <M3Button label="로그인" onPress={() => router.push('/(auth)/login')} style={styles.guestBtn} />
          <M3Button
            label="회원가입"
            variant="outlined"
            onPress={() => router.push('/(auth)/register')}
            style={styles.guestBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 — 딥 인디고 + 마스코트 오른쪽 */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Ionicons name="person" size={28} color={MD3.onSurface} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headline}>마이페이지</Text>
              <Text style={styles.headerSubtext}>{user?.companyName ?? 'WTC 입주사'}</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => showAlert('설정', '설정 화면 예정')}
            >
              <Ionicons name="settings-outline" size={20} color={MD3.onSurface} />
            </TouchableOpacity>
          </View>
          <Image source={mascotImg} style={styles.headerCharImg} resizeMode="contain" />
        </View>
        <View style={styles.headerDeco}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.decoCircle, { width: 60 + i * 30, height: 60 + i * 30, opacity: 0.1 - i * 0.02, right: -20 + i * 10, top: -20 + i * 10 }]} />
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 프로필 카드 */}
        <View style={styles.section}>
          <M3Card variant="outlined" style={styles.profileCard}>
            <View style={styles.profileInner}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarText}>{user?.name?.[0] ?? 'U'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{user?.name}</Text>
                <Text style={styles.profileCompany}>{user?.companyName}</Text>
                <View style={styles.verifiedRow}>
                  <Ionicons
                    name={user?.isTenantVerified ? 'checkmark-circle' : 'time-outline'}
                    size={14}
                    color={user?.isTenantVerified ? MD3.success : MD3.warning}
                  />
                  <Text style={[styles.verifiedText, { color: user?.isTenantVerified ? MD3.success : MD3.warning }]}>
                    {user?.isTenantVerified ? '입주사 인증 완료' : '인증 대기중'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => showAlert('회원정보 수정', '기존 홈페이지 연동 예정')}
              >
                <Ionicons name="create-outline" size={18} color={MD3.primary} />
              </TouchableOpacity>
            </View>
          </M3Card>
        </View>

        {/* 통계 */}
        <View style={styles.statsRow}>
          {[
            { label: '신청 내역', val: '3건', icon: 'document-text-outline' as const },
            { label: '보유 쿠폰', val: '1개', icon: 'ticket-outline' as const },
            { label: '내 게시글', val: '2개', icon: 'create-outline' as const },
          ].map((s) => (
            <M3Card key={s.label} variant="outlined" style={styles.statCard}>
              <View style={styles.statIconBox}>
                <Ionicons name={s.icon} size={20} color={MD3.primary} />
              </View>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </M3Card>
          ))}
        </View>

        {/* 내 활동 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내 활동</Text>
          <M3Card variant="outlined" style={{ overflow: 'hidden' }}>
            {MY_MENUS.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuRow, idx > 0 && styles.menuDivider]}
                onPress={() => (item.onPress ? item.onPress() : showAlert(item.label, '기존 홈페이지 연동 예정'))}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon} size={18} color={MD3.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.badge && (
                  <View style={styles.badgePill}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={16} color={MD3.outline} />
              </TouchableOpacity>
            ))}
          </M3Card>
        </View>

        {/* 계정 관리 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정 관리</Text>
          <M3Card variant="outlined" style={{ overflow: 'hidden' }}>
            {ACCOUNT_MENUS.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuRow, idx > 0 && styles.menuDivider]}
                onPress={() => showAlert(item.label, '기존 홈페이지 연동 예정')}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon} size={18} color={MD3.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={MD3.outline} />
              </TouchableOpacity>
            ))}
          </M3Card>
        </View>

        {/* 알림 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <M3Card variant="outlined" style={{ overflow: 'hidden' }}>
            {NOTIF_SETTINGS.map((item, idx) => (
              <View key={item.key} style={[styles.notifRow, idx > 0 && styles.menuDivider]}>
                <Text style={styles.notifLabel}>{item.label}</Text>
                <Switch
                  value={notifications[item.key]}
                  onValueChange={() => toggleNotif(item.key)}
                  trackColor={{ false: MD3.outlineVariant, true: MD3.primaryContainer }}
                  thumbColor={notifications[item.key] ? MD3.primary : MD3.outline}
                />
              </View>
            ))}
          </M3Card>
        </View>

        {/* 로그아웃 */}
        <View style={styles.section}>
          <M3Button
            label="로그아웃"
            variant="outlined"
            onPress={handleLogout}
            icon={<Ionicons name="log-out-outline" size={16} color={MD3.error} />}
            style={styles.logoutBtn}
            labelStyle={{ color: MD3.error }}
          />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#E4ECFB' },

  header: {
    backgroundColor: '#E4ECFB',
    paddingTop: 52,
    paddingHorizontal: 24,
    paddingBottom: 0,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#E4ECFB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    zIndex: 1,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 20,
  },
  headerIconBox: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },
  headline: { fontSize: 26, fontWeight: '800', color: MD3.onSurface },
  headerSubtext: { fontSize: 13, color: MD3.onSurfaceVariant, marginTop: 2 },
  settingsBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCharImg: {
    width: 130,
    height: 110,
  },
  headerDeco: { position: 'absolute', top: 0, right: 0, bottom: 0 },
  decoCircle: { position: 'absolute', borderRadius: 999, backgroundColor: '#FFFFFF' },

  guestBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 },
  guestAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: MD3.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  guestTitle: { fontSize: 20, fontWeight: '600', color: MD3.onSurface },
  guestSub: { fontSize: 14, color: MD3.onSurfaceVariant, marginBottom: 8 },
  guestBtn: { width: '100%' },

  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: MD3.onSurfaceVariant, marginBottom: 10, letterSpacing: 0.5 },

  profileCard: { borderColor: MD3.primaryContainer, borderWidth: 1.5 },
  profileInner: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: MD3.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '900', color: MD3.onPrimary },
  profileName: { fontSize: 18, fontWeight: '700', color: MD3.onSurface },
  profileCompany: { fontSize: 12, color: MD3.onSurfaceVariant, marginTop: 2 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  verifiedText: { fontSize: 12, fontWeight: '600' },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MD3.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginTop: 12 },
  statCard: { flex: 1, alignItems: 'center', padding: 14, gap: 6 },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: MD3.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statVal: { fontSize: 18, fontWeight: '700', color: MD3.onSurface },
  statLabel: { fontSize: 11, color: MD3.onSurfaceVariant },

  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuDivider: { borderTopWidth: 1, borderTopColor: MD3.outlineVariant },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: MD3.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: MD3.onSurface },
  badgePill: {
    backgroundColor: MD3.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: MD3.onPrimary },

  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  notifLabel: { fontSize: 14, color: MD3.onSurface },

  logoutBtn: { borderColor: MD3.errorContainer },
});
