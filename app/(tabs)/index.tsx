import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  Modal,
} from 'react-native';
import qrcode from 'qrcode-generator';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { EXTERNAL_URLS } from '../../constants/i18n';
import { M3Card } from '../../components/common/M3Card';
import { CarFinderIcon } from '../../components/common/CarFinderIcon';
import { mockBenefits, mockCoexEvents, mockParkingInfo } from '../../utils/mockData';
import { useAuthStore } from '../../store/useAuthStore';
import { ParkingStatus } from '../../types';

const mascotImg = require('../../assets/cacl.png');
const bgWtc = require('../../assets/bg_wtc.jpg');

function QRView({ value, size = 220 }: { value: string; size?: number }) {
  const matrix: boolean[][] = React.useMemo(() => {
    try {
      const qr = qrcode(0, 'M');
      qr.addData(value);
      qr.make();
      const count = qr.getModuleCount();
      return Array.from({ length: count }, (_, r) =>
        Array.from({ length: count }, (_, c) => qr.isDark(r, c))
      );
    } catch {
      return [];
    }
  }, [value]);

  if (!matrix.length) return null;
  const cell = size / matrix.length;

  return (
    <View style={{ width: size, height: size }}>
      {matrix.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row' }}>
          {row.map((dark, c) => (
            <View key={c} style={{ width: cell, height: cell, backgroundColor: dark ? '#1A3A5C' : '#FFFFFF' }} />
          ))}
        </View>
      ))}
    </View>
  );
}

const PARKING_LABEL: Record<ParkingStatus, string> = {
  free: '여유',
  busy: '혼잡',
  full: '만차',
  unknown: '정보없음',
};

const PARKING_COLOR: Record<ParkingStatus, string> = {
  free: '#22C55E',
  busy: '#F59E0B',
  full: '#EF4444',
  unknown: MD3.onSurfaceVariant,
};

const PARKING_BG: Record<ParkingStatus, string> = {
  free: '#F0FDF4',
  busy: '#FFFBEB',
  full: '#FEF2F2',
  unknown: MD3.surfaceVariant,
};

const PARKING_ICON: Record<ParkingStatus, React.ComponentProps<typeof Ionicons>['name']> = {
  free: 'checkmark-circle',
  busy: 'warning',
  full: 'close-circle',
  unknown: 'help-circle',
};

const PARKING_RATE: Record<ParkingStatus, number> = {
  free: 42,
  busy: 78,
  full: 97,
  unknown: 0,
};

const PARKING_MSG: Record<ParkingStatus, string> = {
  free: '현재 주차 공간에 여유가 있습니다.\n지하 주차장을 편리하게 이용하세요!',
  busy: '주차장이 다소 혼잡합니다. 대중교통 이용을 권장합니다.',
  full: '주차장이 만차입니다. 인근 주차장을 이용해 주세요.',
  unknown: '실시간 주차 정보를 확인 중입니다.',
};

const AMENITY_LINKS = [
  { label: '스타필드\n식당 안내', icon: 'restaurant-outline' as const, action: () => Linking.openURL(EXTERNAL_URLS.dining) },
  { label: '별마당 도서관\n초대행사', icon: 'book-outline' as const, action: () => Linking.openURL(EXTERNAL_URLS.starfieldLibrary) },
  { label: '리무진\n(도심공항)', icon: 'bus-outline' as const, action: () => Linking.openURL(EXTERNAL_URLS.limo) },
  { label: '수하물\n서비스', icon: 'briefcase-outline' as const, action: () => Linking.openURL(EXTERNAL_URLS.luggage) },
  { label: '편의시설\n안내', icon: 'information-circle-outline' as const, action: () => router.push('/amenities' as any) },
];

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const parking = mockParkingInfo;
  const todayBenefits = mockBenefits.slice(0, 3);
  const ongoingEvents = mockCoexEvents.filter((e) => e.isActive).slice(0, 3);

  const [qrVisible, setQrVisible] = useState(false);
  const [qrTimestamp, setQrTimestamp] = useState(() => Date.now());

  const openQR = useCallback(() => {
    setQrTimestamp(Date.now());
    setQrVisible(true);
  }, []);

  const qrValue = user
    ? `WTC-GATE:${user.id}:${user.companyId}:${qrTimestamp}`
    : `WTC-GATE:GUEST:${qrTimestamp}`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 헤더 — WTC 빌딩 실사 배경 + 마스코트 오른쪽 */}
      <ImageBackground
        source={bgWtc}
        style={styles.headerBg}
        resizeMode="cover"
        imageStyle={{ top: -40 }}
      >
        <LinearGradient
          colors={['rgba(0,10,30,0.35)', 'rgba(0,0,0,0.05)']}
          style={StyleSheet.absoluteFill}
        />
        <Image source={mascotImg} style={styles.headerCharImg} resizeMode="contain" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.topBar}>
            <Text style={styles.appBarHeadline}>WTCS ASEM·TRADE</Text>
            <View style={styles.appBarActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => Linking.openURL('tel:02-6000-0114')}>
                <Ionicons name="call-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.greetingBox}>
              <Text style={styles.greetingTitle}>
                {user ? `안녕하세요,\n${user.name}님!` : '안녕하세요!'}
              </Text>
              <Text style={styles.greetingSubtitle}>오늘도 함께 해요 😊</Text>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Main Content Area */}
      <View style={styles.contentWrapper}>
        <View style={styles.whitePanel}>
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

            {/* ===== 그룹 1: 무역센터 현황 ===== */}
            <View style={styles.groupHeaderRow}>
              <View style={styles.groupHeaderBar} />
              <Text style={styles.groupHeaderText}>무역센터 현황</Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>주차현황</Text>
                <Text style={styles.updatedAt}>업데이트 {parking.updatedAt.slice(11, 16)}</Text>
              </View>
              <M3Card variant="outlined" style={styles.parkingCard}>
                <View style={styles.parkingInner}>
                  <View style={styles.parkingIconBox}>
                    <Ionicons name="car" size={28} color="#4A9EC4" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.parkingName}>{parking.parkingName}</Text>
                    <Text style={styles.parkingHint}>실시간 주차 현황</Text>
                  </View>
                  <View style={[styles.parkingBadge, { backgroundColor: PARKING_BG[parking.status] }]}>
                    <Ionicons name={PARKING_ICON[parking.status]} size={16} color={PARKING_COLOR[parking.status]} />
                    <Text style={[styles.parkingBadgeText, { color: PARKING_COLOR[parking.status] }]}>
                      {PARKING_LABEL[parking.status]}
                    </Text>
                  </View>
                </View>

                {/* 주차율 바 */}
                <View style={styles.rateBarWrap}>
                  <View style={styles.rateBarBg}>
                    <LinearGradient
                      colors={['#22C55E', '#16A34A']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={[styles.rateBarFill, { width: `${PARKING_RATE[parking.status]}%` }]}
                    />
                  </View>
                  <Text style={styles.rateLabel}>{PARKING_RATE[parking.status]}%</Text>
                </View>

                <Text style={styles.parkingMsg}>{PARKING_MSG[parking.status]}</Text>
              </M3Card>
            </View>

            {/* 내차찾기 */}
            <View style={[styles.section, { marginTop: -20 }]}>
              <TouchableOpacity
                style={styles.carFinderBtn}
                onPress={() => router.push('/car-finder' as any)}
                activeOpacity={0.85}
              >
                <View style={styles.carFinderBtnLeft}>
                  <View style={styles.carFinderBtnIconBox}>
                    <CarFinderIcon size={22} color={MD3.primary} />
                  </View>
                  <Text style={styles.carFinderBtnText}>내차찾기</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={MD3.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* 스피드게이트 출입 QR 버튼 */}
            <TouchableOpacity style={styles.qrBtn} onPress={openQR} activeOpacity={0.85}>
              <LinearGradient colors={['#1A3A5C', '#2A5CA8']} style={styles.qrBtnGradient}>
                <View style={styles.qrBtnLeft}>
                  <View style={styles.qrBtnIconBox}>
                    <Ionicons name="qr-code-outline" size={28} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={styles.qrBtnTitle}>스피드게이트 출입 QR</Text>
                    <Text style={styles.qrBtnSub}>탭하여 QR 코드 열기</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
              </LinearGradient>
            </TouchableOpacity>

            {/* ===== 그룹 2: 스마트 오피스 라이프 ===== */}
            <View style={[styles.groupHeaderRow, { marginTop: 28 }]}>
              <View style={styles.groupHeaderBar} />
              <Text style={styles.groupHeaderText}>스마트 오피스 라이프</Text>
            </View>

            <View style={[styles.section, { marginBottom: 12 }]}>
              <TouchableOpacity
                style={styles.carFinderBtn}
                onPress={() => router.push('/indoor-map' as any)}
                activeOpacity={0.85}
              >
                <View style={styles.carFinderBtnLeft}>
                  <View style={styles.carFinderBtnIconBox}>
                    <Ionicons name="navigate-outline" size={22} color={MD3.primary} />
                  </View>
                  <Text style={styles.carFinderBtnText}>실내 길찾기</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={MD3.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* 안전신문고 버튼 */}
            <TouchableOpacity
              style={styles.safetyBtn}
              onPress={() => router.push('/safety' as any)}
              activeOpacity={0.85}
            >
              <View style={styles.safetyBtnLeft}>
                <View style={styles.safetyBtnIconBox}>
                  <Ionicons name="shield-checkmark-outline" size={24} color={MD3.error} />
                </View>
                <View>
                  <Text style={styles.safetyBtnTitle}>안전신문고</Text>
                  <Text style={styles.safetyBtnSub}>안전 위험요소를 신고해주세요</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={MD3.onSurfaceVariant} />
            </TouchableOpacity>

            <View style={[styles.section, { marginTop: 8 }]}>
              <TouchableOpacity
                style={styles.carFinderBtn}
                onPress={() => router.push('/media' as any)}
                activeOpacity={0.85}
              >
                <View style={styles.carFinderBtnLeft}>
                  <View style={styles.carFinderBtnIconBox}>
                    <Ionicons name="tv-outline" size={22} color={MD3.primary} />
                  </View>
                  <Text style={styles.carFinderBtnText}>미디어 신청</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={MD3.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* ===== 그룹 3: 코엑스 라이프 & 편의 서비스 ===== */}
            <View style={styles.groupHeaderRow}>
              <View style={styles.groupHeaderBar} />
              <Text style={styles.groupHeaderText}>코엑스 라이프 & 편의 서비스</Text>
            </View>

            {/* Today's Benefits */}
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>오늘의 혜택</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/membership/index' as any)}>
                  <Text style={styles.seeAll}>전체보기</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16 }}>
                {todayBenefits.map((b) => (
                  <M3Card key={b.id} variant="elevated" style={styles.benefitCard} onPress={() => {}}>
                    <View style={styles.benefitImgBox}>
                      <Ionicons name="gift" size={32} color={MD3.primary} />
                    </View>
                    <View style={styles.benefitContent}>
                      <Text style={styles.benefitBrand}>{b.brandName}</Text>
                      <Text style={styles.benefitTitle} numberOfLines={2}>{b.title}</Text>
                      <View style={styles.discountChip}>
                        <Text style={styles.discountChipText}>{b.discountText}</Text>
                      </View>
                    </View>
                  </M3Card>
                ))}
              </View>
            </View>

            {/* Coex Events */}
            <View style={[styles.section, { paddingHorizontal: 16 }]}>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>코엑스 전시 일정</Text>
                <TouchableOpacity><Text style={styles.seeAll}>전체보기</Text></TouchableOpacity>
              </View>
              <M3Card variant="outlined" style={styles.listCard}>
                {ongoingEvents.map((ev, idx) => (
                  <TouchableOpacity
                    key={ev.id}
                    style={[styles.listRow, idx < ongoingEvents.length - 1 && styles.listDivider]}
                    onPress={() => router.push(`/coex/${ev.id}` as any)}
                  >
                    <View style={styles.eventDateBox}>
                      <Text style={styles.eventDateText}>{ev.startDate.slice(5).replace('-', '/')}</Text>
                      <Text style={styles.eventDateSep}>~</Text>
                      <Text style={styles.eventDateText}>{ev.endDate.slice(5).replace('-', '/')}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listItemTitle} numberOfLines={1}>{ev.title}</Text>
                      <Text style={styles.eventLocation}>{ev.location}</Text>
                    </View>
                    {ev.hasTenantDiscount && (
                      <View style={styles.tenantChip}>
                        <Text style={styles.tenantChipText}>할인</Text>
                      </View>
                    )}
                    <Ionicons name="chevron-forward" size={16} color={MD3.onSurfaceVariant} />
                  </TouchableOpacity>
                ))}
              </M3Card>
            </View>

            {/* 무역센터 편의시설 안내 */}
            <View style={[styles.section, { paddingHorizontal: 16 }]}>
              <Text style={styles.sectionTitle}>무역센터 편의시설 안내</Text>
              <View style={styles.amenityGrid}>
                {AMENITY_LINKS.map((a) => (
                  <TouchableOpacity
                    key={a.label}
                    style={styles.amenityItem}
                    onPress={a.action}
                  >
                    <View style={styles.amenityIcon}>
                      <Ionicons name={a.icon} size={24} color={MD3.primary} />
                    </View>
                    <Text style={styles.amenityLabel}>{a.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ===== 그룹 4: 고객센터 ===== */}
            <View style={styles.groupHeaderRow}>
              <View style={styles.groupHeaderBar} />
              <Text style={styles.groupHeaderText}>고객센터</Text>
            </View>

            {/* Customer Service Banner */}
            <View style={styles.csBanner}>
              <TouchableOpacity style={styles.csHalf} onPress={() => Linking.openURL('tel:02-6000-0114')}>
                <View style={styles.csBannerIcon}>
                  <Ionicons name="headset" size={22} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.csBannerTitle}>고객센터</Text>
                  <Text style={styles.csBannerPhone}>02-6000-0114</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.csBannerDivider} />
              <TouchableOpacity style={styles.csHalf} onPress={() => Linking.openURL('https://pf.kakao.com/_xjxocaT')}>
                <View style={styles.kakaoIconBox}>
                  <Ionicons name="chatbubble-ellipses" size={22} color="#3C1E1E" />
                </View>
                <View>
                  <Text style={styles.csBannerTitle}>카카오톡 상담</Text>
                  <Text style={styles.kakaoText}>고객센터 바로가기</Text>
                </View>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>

      {/* QR 모달 */}
      <Modal visible={qrVisible} transparent animationType="fade" onRequestClose={() => setQrVisible(false)}>
        <View style={styles.qrOverlay}>
          <View style={styles.qrSheet}>
            {/* 헤더 */}
            <View style={styles.qrSheetHeader}>
              <Text style={styles.qrSheetTitle}>스피드게이트 출입 QR</Text>
              <TouchableOpacity onPress={() => setQrVisible(false)} style={styles.qrCloseBtn}>
                <Ionicons name="close" size={22} color={MD3.onSurface} />
              </TouchableOpacity>
            </View>

            {/* QR 코드 */}
            <View style={styles.qrCodeBox}>
              <QRView value={qrValue} size={220} />
            </View>

            {/* 유저 정보 */}
            <Text style={styles.qrUserName}>{user ? user.name : '게스트'}</Text>
            <Text style={styles.qrCompanyName}>{user ? user.companyName : 'WTC SEOUL'}</Text>

            <View style={styles.qrDivider} />

            {/* 새로고침 */}
            <TouchableOpacity style={styles.qrRefreshBtn} onPress={() => setQrTimestamp(Date.now())}>
              <Ionicons name="refresh" size={16} color={MD3.primary} />
              <Text style={styles.qrRefreshText}>QR 새로고침</Text>
            </TouchableOpacity>

            <Text style={styles.qrNotice}>본 QR은 스피드게이트 출입 전용입니다</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1E3C' },
  headerBg: {
    height: Platform.OS === 'ios' ? 260 : 240,
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
    height: 56,
  },
  appBarHeadline: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
  appBarActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 24,
  },
  greetingBox: { flex: 1, paddingBottom: 16 },
  greetingTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', lineHeight: 30 },
  greetingSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  headerCharImg: { width: 225, height: 179, position: 'absolute', right: 0, bottom: -14 },

  contentWrapper: { flex: 1, marginTop: -30 },
  whitePanel: {
    flex: 1, backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  scroll: { flex: 1 },

  section: { marginBottom: 32 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: MD3.onSurface },
  seeAll: { fontSize: 14, color: '#888', fontWeight: '500' },

  groupHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginBottom: 14, marginTop: 4 },
  groupHeaderBar: { width: 4, height: 16, borderRadius: 2, backgroundColor: MD3.primary },
  groupHeaderText: { fontSize: 18, fontWeight: '700', color: MD3.onSurface },

  amenityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  amenityItem: { width: '18%', alignItems: 'center' },
  amenityIcon: {
    width: 52, height: 52, borderRadius: 18,
    backgroundColor: '#F0F8FF',
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  amenityLabel: { fontSize: 11, color: MD3.onSurfaceVariant, textAlign: 'center', lineHeight: 14 },

  listCard: { overflow: 'hidden' },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  listDivider: { borderBottomWidth: 1, borderBottomColor: MD3.outlineVariant },
  listItemTitle: { flex: 1, fontSize: 15, fontWeight: '500', color: MD3.onSurface },

  benefitCard: { flex: 1 },
  benefitImgBox: { height: 90, backgroundColor: '#F5F8FF', alignItems: 'center', justifyContent: 'center' },
  benefitContent: { padding: 12 },
  benefitBrand: { fontSize: 11, color: '#888', marginBottom: 4 },
  benefitTitle: { fontSize: 14, fontWeight: '600', color: MD3.onSurface, marginBottom: 8, lineHeight: 18 },
  discountChip: {
    alignSelf: 'flex-start', backgroundColor: '#E4ECFB',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4,
  },
  discountChipText: { fontSize: 12, fontWeight: '700', color: MD3.primary },

  eventDateBox: {
    backgroundColor: '#F5F8FF', borderRadius: 8, padding: 8,
    alignItems: 'center', minWidth: 56,
  },
  eventDateText: { fontSize: 12, fontWeight: '700', color: MD3.onSurfaceVariant },
  eventDateSep: { fontSize: 10, color: '#888', marginVertical: 2 },
  eventLocation: { fontSize: 12, color: '#888', marginTop: 4 },
  tenantChip: { backgroundColor: '#FFF0F0', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  tenantChipText: { fontSize: 12, fontWeight: '700', color: MD3.error },

  csBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F9FAFB', borderRadius: 16,
    marginHorizontal: 16,
    borderWidth: 1, borderColor: '#EEEEEE',
    overflow: 'hidden',
  },
  csHalf: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    padding: 14, gap: 10,
  },
  csBannerDivider: {
    width: 1, height: 52, backgroundColor: '#E0E0E0',
  },
  csBannerIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: MD3.primary, alignItems: 'center', justifyContent: 'center',
  },
  kakaoIconBox: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FEE500', alignItems: 'center', justifyContent: 'center',
  },
  csBannerTitle: { fontSize: 11, fontWeight: '600', color: MD3.onSurfaceVariant, marginBottom: 3 },
  csBannerPhone: { fontSize: 15, fontWeight: '700', color: MD3.primary },
  kakaoText: { fontSize: 13, fontWeight: '700', color: '#3C1E1E' },

  updatedAt: { fontSize: 12, color: '#AAA' },
  parkingCard: { marginHorizontal: 16, overflow: 'hidden' },
  parkingInner: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  parkingIconBox: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: '#EBF7FF',
    alignItems: 'center', justifyContent: 'center',
  },
  parkingName: { fontSize: 15, fontWeight: '700', color: MD3.onSurface },
  parkingHint: { fontSize: 12, color: '#888', marginTop: 2 },
  parkingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  parkingBadgeText: { fontSize: 14, fontWeight: '700' },
  rateBarWrap: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 8, gap: 10,
  },
  rateBarBg: {
    flex: 1, height: 8, borderRadius: 4,
    backgroundColor: MD3.surfaceVariant, overflow: 'hidden',
  },
  rateBarFill: { height: '100%', borderRadius: 4 },
  rateLabel: { fontSize: 13, fontWeight: '700', color: MD3.onSurface, width: 36 },
  parkingMsg: {
    fontSize: 13, color: MD3.onSurfaceVariant,
    paddingHorizontal: 16, paddingBottom: 16, lineHeight: 19,
  },

  carFinderBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 16, paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 16, backgroundColor: MD3.primaryContainer,
  },
  carFinderBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  carFinderBtnIconBox: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  carFinderBtnText: { fontSize: 15, fontWeight: '700', color: MD3.onSurface },

  qrBtn: {
    marginHorizontal: 16, marginTop: 12, marginBottom: 8,
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#1A3A5C', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 6,
  },
  qrBtnGradient: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 18, justifyContent: 'space-between',
  },
  qrBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qrBtnIconBox: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  qrBtnTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  qrBtnSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },

  qrOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  qrSheet: {
    backgroundColor: '#FFFFFF', borderRadius: 28,
    paddingHorizontal: 28, paddingBottom: 28, paddingTop: 20,
    width: 320, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 20,
  },
  qrSheetHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', width: '100%', marginBottom: 20,
  },
  qrSheetTitle: { fontSize: 17, fontWeight: '700', color: '#1A3A5C' },
  qrCloseBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center',
  },
  qrCodeBox: {
    padding: 16, borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5, borderColor: '#E8EEF8',
    marginBottom: 20,
    shadowColor: '#1A3A5C', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  qrUserName: { fontSize: 18, fontWeight: '700', color: MD3.onSurface, marginBottom: 4 },
  qrCompanyName: { fontSize: 13, color: MD3.onSurfaceVariant },
  qrDivider: { width: '100%', height: 1, backgroundColor: '#EEEEEE', marginVertical: 16 },
  qrRefreshBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: MD3.primary, marginBottom: 12,
  },
  qrRefreshText: { fontSize: 13, fontWeight: '600', color: MD3.primary },
  qrNotice: { fontSize: 11, color: '#AAA', textAlign: 'center' },

  safetyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 16, marginTop: 4, marginBottom: 8,
    paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 16, backgroundColor: '#FFF5F5',
    borderWidth: 1, borderColor: '#FFE0E0',
  },
  safetyBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  safetyBtnIconBox: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#FFE9E9',
    alignItems: 'center', justifyContent: 'center',
  },
  safetyBtnTitle: { fontSize: 15, fontWeight: '700', color: MD3.onSurface, marginBottom: 3 },
  safetyBtnSub: { fontSize: 12, color: MD3.onSurfaceVariant },

});
