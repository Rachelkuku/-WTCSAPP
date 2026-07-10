import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageBackground,
  Image,
  Linking,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { I18N, EXTERNAL_URLS, Lang } from '../../constants/i18n';
import { M3Card } from '../../components/common/M3Card';
import { CarFinderIcon } from '../../components/common/CarFinderIcon';
import { useAuthStore } from '../../store/useAuthStore';

const bgWtc = require('../../assets/bg_wtc.jpg');
const coexMap = require('../../assets/coex_map.png');
const mascotImg = require('../../assets/cacl.png');
const { width } = Dimensions.get('window');

const ATTRACTION_IMAGES: Record<string, number> = {
  '0': require('../../assets/attractions/gangnam_style_statue.jpg'),
  '1': require('../../assets/attractions/artium_media.jpg'),
  '2': require('../../assets/attractions/s_live_gallery.jpg'),
  '3': require('../../assets/attractions/ktown4u.jpg'),
  '4': require('../../assets/attractions/starfield_library.jpg'),
  '5': require('../../assets/attractions/bongeunsa_temple.jpg'),
  '6': require('../../assets/attractions/coex_aquarium.jpg'),
  '7': require('../../assets/attractions/megabox_film_society.jpg'),
  '8': require('../../assets/attractions/baskin_robbins_store.jpg'),
};

// 주차율 (고정 목업 데이터)
const PARKING_RATE = 78;
const PARKING_STATUS: 'free' | 'busy' | 'full' = 'free';

function openWebView(url: string, _title: string) {
  Linking.openURL(url);
}

export default function VisitorHomeScreen() {
  const { logout, lang, setLang } = useAuthStore();
  const t = I18N.visitor;

  const parkingColor = PARKING_STATUS === 'free' ? '#22C55E' : PARKING_STATUS === 'busy' ? '#F59E0B' : '#EF4444';
  const parkingBg = PARKING_STATUS === 'free' ? '#F0FDF4' : PARKING_STATUS === 'busy' ? '#FFFBEB' : '#FEF2F2';
  const parkingIcon = PARKING_STATUS === 'free' ? 'checkmark-circle' : PARKING_STATUS === 'busy' ? 'warning' : 'close-circle';
  const parkingLabel = lang === 'KR'
    ? (PARKING_STATUS === 'free' ? t.parkingFreeLabel.KR : t.parkingBusyLabel.KR)
    : (PARKING_STATUS === 'free' ? t.parkingFreeLabel.EN : t.parkingBusyLabel.EN);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ─── 헤더 배경 ─── */}
      <ImageBackground
        source={bgWtc}
        style={styles.headerBg}
        resizeMode="cover"
        imageStyle={{ top: -40 }}
      >
        <LinearGradient
          colors={['rgba(0,10,40,0.5)', 'rgba(10,30,70,0.1)']}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.headerSafe}>
          <Image source={mascotImg} style={styles.headerMascot} resizeMode="contain" />
          {/* 상단바 */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.replace('/gateway')} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>WTC Seoul</Text>
            {/* KR / EN 토글 */}
            <View style={styles.langRow}>
              <TouchableOpacity
                style={[styles.langBtn, lang === 'KR' && styles.langBtnActive]}
                onPress={() => setLang('KR')}
              >
                <Text style={[styles.langText, lang === 'KR' && styles.langTextActive]}>KR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langBtn, lang === 'EN' && styles.langBtnActive]}
                onPress={() => setLang('EN')}
              >
                <Text style={[styles.langText, lang === 'EN' && styles.langTextActive]}>EN</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 헤더 텍스트 */}
          <View style={styles.headerContent}>
            <Text style={styles.headerSubLabel}>
              {lang === 'KR' ? '방문객 안내' : 'Visitor Guide'}
            </Text>
            <Text style={styles.headerWelcome}>{t.headerSub[lang]}</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* ─── 메인 스크롤 ─── */}
      <View style={styles.contentWrapper}>
        <View style={styles.whitePanel}>
          <View style={styles.dragHandleWrap}>
            <View style={styles.dragHandle} />
          </View>

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
          >

            {/* ① 실시간 주차 현황 */}
            <View style={styles.section}>
              <SectionHeader title={t.parkingTitle[lang]} />
              <M3Card variant="outlined" style={styles.parkingCard}>
                <View style={styles.parkingTop}>
                  <View style={styles.parkingIconBox}>
                    <Ionicons name="car" size={26} color={MD3.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.parkingName}>WTC SEOUL {lang === 'KR' ? '주차장' : 'Parking'}</Text>
                    <Text style={styles.parkingHint}>{lang === 'KR' ? '실시간 주차 현황' : 'Real-time status'}</Text>
                  </View>
                  <View style={[styles.parkingBadge, { backgroundColor: parkingBg }]}>
                    <Ionicons name={parkingIcon} size={15} color={parkingColor} />
                    <Text style={[styles.parkingBadgeText, { color: parkingColor }]}>{parkingLabel}</Text>
                  </View>
                </View>

                {/* 주차율 바 */}
                <View style={styles.rateBarWrap}>
                  <View style={styles.rateBarBg}>
                    <LinearGradient
                      colors={['#22C55E', '#16A34A']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={[styles.rateBarFill, { width: `${PARKING_RATE}%` }]}
                    />
                  </View>
                  <Text style={styles.rateLabel}>{PARKING_RATE}%</Text>
                </View>

                <Text style={styles.parkingMsg}>
                  {PARKING_STATUS === 'free' ? t.parkingFreeMsg[lang] : t.parkingBusyMsg[lang]}
                </Text>
              </M3Card>

              <TouchableOpacity
                style={styles.carFinderBtn}
                onPress={() => router.push('/car-finder' as any)}
                activeOpacity={0.85}
              >
                <View style={styles.carFinderBtnLeft}>
                  <View style={styles.carFinderBtnIconBox}>
                    <CarFinderIcon size={22} color={MD3.primary} />
                  </View>
                  <Text style={styles.carFinderBtnText}>
                    {lang === 'KR' ? '내차찾기' : 'Find My Car'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={MD3.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* ② 코엑스 전시회 */}
            <View style={styles.section}>
              <SectionHeaderWithBtn
                title={t.coexTitle[lang]}
                btnLabel={t.coexBtn[lang]}
                onPress={() => openWebView(EXTERNAL_URLS.coex, lang === 'KR' ? '코엑스 전시 일정' : 'COEX Exhibitions')}
              />
              <M3Card variant="outlined" style={styles.listCard}>
                {t.coexEvents.map((ev, idx) => {
                  const evData = ev[lang];
                  return (
                    <View
                      key={idx}
                      style={[styles.eventRow, idx < t.coexEvents.length - 1 && styles.rowDivider]}
                    >
                      <View style={styles.eventDateBox}>
                        <Text style={styles.eventHall}>{evData.hall}</Text>
                      </View>
                      <View style={{ flex: 1, gap: 3 }}>
                        <Text style={styles.eventTitle} numberOfLines={1}>{evData.title}</Text>
                        <Text style={styles.eventDate}>{evData.date}</Text>
                      </View>
                      <Ionicons name="open-outline" size={15} color={MD3.onSurfaceVariant} />
                    </View>
                  );
                })}
              </M3Card>
              <TouchableOpacity
                style={styles.outLinkBtn}
                onPress={() => openWebView(EXTERNAL_URLS.coex, lang === 'KR' ? '코엑스 전시 일정' : 'COEX Exhibitions')}
              >
                <Ionicons name="calendar-outline" size={16} color={MD3.primary} />
                <Text style={styles.outLinkBtnText}>{t.coexBtn[lang]}</Text>
                <Ionicons name="arrow-forward" size={15} color={MD3.primary} />
              </TouchableOpacity>
            </View>

            {/* ③ 실내 길찾기 */}
            <View style={styles.section}>
              <View style={[styles.sectionHeaderRow, { justifyContent: 'space-between' }]}>
                <Text style={styles.sectionTitle}>{t.indoorMapTitle[lang]}</Text>
                <View style={styles.prototypeBadge}>
                  <Text style={styles.prototypeBadgeText}>{t.indoorMapBadge[lang]}</Text>
                </View>
              </View>
              <M3Card variant="outlined" style={styles.mapCard}>
                <Image source={coexMap} style={styles.mapImage} resizeMode="contain" />
                <View style={styles.mapFooter}>
                  <Ionicons name="time-outline" size={13} color={MD3.onSurfaceVariant} />
                  <Text style={styles.mapFooterText}>{t.indoorMapDesc[lang]}</Text>
                </View>
              </M3Card>
            </View>

            {/* ④ 스타필드 식당 안내 */}
            <View style={styles.section}>
              <SectionHeader title={t.diningTitle[lang]} />
              <M3Card variant="elevated" style={styles.diningCard}>
                <LinearGradient
                  colors={['#FFF8F0', '#FFF0E0']}
                  style={styles.diningGradient}
                >
                  <View style={styles.diningIconRow}>
                    <View style={styles.diningIconBox}>
                      <Ionicons name="restaurant" size={28} color="#E07B39" />
                    </View>
                    <View style={styles.diningBadge}>
                      <Text style={styles.diningBadgeText}>Starfield COEX Mall</Text>
                    </View>
                  </View>
                  <Text style={styles.diningDesc}>{t.diningDesc[lang]}</Text>
                  <TouchableOpacity
                    style={styles.diningBtn}
                    onPress={() => openWebView(EXTERNAL_URLS.dining, lang === 'KR' ? '스타필드 코엑스몰 식당' : 'Starfield Coex Mall Dining')}
                  >
                    <Text style={styles.diningBtnText}>{t.diningBtn[lang]}</Text>
                    <Ionicons name="arrow-forward" size={15} color="#E07B39" />
                  </TouchableOpacity>
                </LinearGradient>
              </M3Card>
            </View>

            {/* ⑤ 별마당 도서관 초대행사 */}
            <View style={styles.section}>
              <SectionHeader title={t.libraryEventTitle[lang]} />
              <M3Card variant="elevated" style={styles.libraryCard}>
                <LinearGradient colors={['#F5F3FF', '#EDE9FE']} style={styles.libraryGradient}>
                  <View style={styles.libraryIconRow}>
                    <View style={styles.libraryIconBox}>
                      <Ionicons name="book-outline" size={28} color="#7C3AED" />
                    </View>
                    <View style={styles.libraryBadge}>
                      <Text style={styles.libraryBadgeText}>Starfield Library</Text>
                    </View>
                  </View>
                  <Text style={styles.libraryDesc}>{t.libraryEventDesc[lang]}</Text>
                  <TouchableOpacity
                    style={styles.libraryBtn}
                    onPress={() => openWebView(EXTERNAL_URLS.starfieldLibrary, lang === 'KR' ? '별마당 도서관 행사' : 'Starfield Library Events')}
                  >
                    <Text style={styles.libraryBtnText}>{t.libraryEventBtn[lang]}</Text>
                    <Ionicons name="arrow-forward" size={15} color="#7C3AED" />
                  </TouchableOpacity>
                </LinearGradient>
              </M3Card>
            </View>

            {/* ⑥ 교통 편의 서비스 */}
            <View style={styles.section}>
              <SectionHeader title={t.travelTitle[lang]} />
              <View style={styles.travelGrid}>
                {/* 리무진 */}
                <M3Card variant="outlined" style={styles.travelCard}>
                  <LinearGradient colors={['#EBF7FF', '#F7FCFF']} style={styles.travelCardInner}>
                    <View style={[styles.travelIconBox, { backgroundColor: MD3.primaryContainer }]}>
                      <Ionicons name="bus-outline" size={26} color={MD3.primary} />
                    </View>
                    <Text style={styles.travelCardTitle}>{t.limoTitle[lang]}</Text>
                    <Text style={styles.travelCardDesc}>{t.limoDesc[lang]}</Text>
                    <TouchableOpacity
                      style={[styles.travelBtn, { borderColor: MD3.primary }]}
                      onPress={() => openWebView(EXTERNAL_URLS.limo, lang === 'KR' ? '도심공항 리무진' : 'Airport Limousine')}
                    >
                      <Text style={[styles.travelBtnText, { color: MD3.primary }]}>{t.limoBtn[lang]}</Text>
                      <Ionicons name="open-outline" size={13} color={MD3.primary} />
                    </TouchableOpacity>
                  </LinearGradient>
                </M3Card>

                {/* GOODLUG */}
                <M3Card variant="outlined" style={styles.travelCard}>
                  <LinearGradient colors={['#F0FDF4', '#F7FCF9']} style={styles.travelCardInner}>
                    <View style={[styles.travelIconBox, { backgroundColor: '#DCFCE7' }]}>
                      <Ionicons name="briefcase-outline" size={26} color="#16A34A" />
                    </View>
                    <Text style={styles.travelCardTitle}>{t.luggageTitle[lang]}</Text>
                    <Text style={styles.travelCardDesc}>{t.luggageDesc[lang]}</Text>
                    <TouchableOpacity
                      style={[styles.travelBtn, { borderColor: '#16A34A' }]}
                      onPress={() => openWebView(EXTERNAL_URLS.luggage, 'GOODLUG')}
                    >
                      <Text style={[styles.travelBtnText, { color: '#16A34A' }]}>{t.luggageBtn[lang]}</Text>
                      <Ionicons name="open-outline" size={13} color="#16A34A" />
                    </TouchableOpacity>
                  </LinearGradient>
                </M3Card>
              </View>
            </View>

            {/* ⑦ 편의시설 & 접근성 */}
            <View style={styles.section}>
              <SectionHeader title={t.amenitiesTitle[lang]} />
              <View style={styles.amenitiesGrid}>
                {t.amenities.map((item, idx) => {
                  const d = item[lang];
                  return (
                    <M3Card key={idx} variant="outlined" style={styles.amenityCard}>
                      <View style={styles.amenityIconBox}>
                        <Ionicons name={item.icon} size={24} color={MD3.primary} />
                      </View>
                      <Text style={styles.amenityTitle}>{d.title}</Text>
                      <Text style={styles.amenityDesc}>{d.desc}</Text>
                    </M3Card>
                  );
                })}
              </View>
            </View>

            {/* ⑧ K-컬처 명소 */}
            <View style={[styles.section, { paddingHorizontal: 0 }]}>
              <View style={{ paddingHorizontal: 16 }}>
                <SectionHeader title={t.attractionsTitle[lang]} />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.attractionsScroll}
              >
                {t.attractions.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.attractionCard}
                    activeOpacity={0.85}
                    onPress={() => {
                      router.push({
                        pathname: '/(visitor)/attraction',
                        params: { id: item.id }
                      });
                    }}
                  >
                    <View style={styles.attractionImgBox}>
                      <Image
                        source={ATTRACTION_IMAGES[item.id]}
                        style={styles.attractionImg}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.attractionCategoryBadge}>
                      <Text style={styles.attractionCategoryText}>{item.category[lang]}</Text>
                    </View>
                    <Text style={styles.attractionName} numberOfLines={2}>
                      {lang === 'KR' ? item.KR : item.EN}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* 안전신문고 */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.safetyBtn}
                onPress={() => router.push('/safety' as any)}
                activeOpacity={0.85}
              >
                <View style={styles.safetyBtnLeft}>
                  <View style={styles.safetyBtnIconBox}>
                    <Ionicons name="shield-checkmark-outline" size={24} color="#DC2626" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.safetyBtnTitle}>
                      {lang === 'KR' ? '안전신문고' : 'Safety Report'}
                    </Text>
                    <Text style={styles.safetyBtnSub}>
                      {lang === 'KR' ? '안전 위험요소를 신고해주세요' : 'Report a safety hazard'}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={MD3.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* 게이트웨이로 돌아가기 */}
            <TouchableOpacity
              style={styles.backToGateway}
              onPress={async () => {
                await logout();
                router.replace('/gateway');
              }}
            >
              <Ionicons name="swap-horizontal-outline" size={16} color={MD3.onSurfaceVariant} />
              <Text style={styles.backToGatewayText}>
                {lang === 'KR' ? '입주사 임직원이신가요?' : 'Are you a tenant staff?'}
              </Text>
              <Ionicons name="chevron-forward" size={15} color={MD3.onSurfaceVariant} />
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </View>
  );
}

// ─── 헬퍼 컴포넌트 ───────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function SectionHeaderWithBtn({
  title,
  btnLabel,
  onPress,
}: {
  title: string;
  btnLabel: string;
  onPress: () => void;
}) {
  return (
    <View style={[styles.sectionHeaderRow, { justifyContent: 'space-between' }]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.seeAllText}>{btnLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── 스타일 ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1E3C' },

  // 헤더
  headerBg: {
    height: Platform.OS === 'ios' ? 260 : 240,
    width: '100%',
  },
  headerMascot: {
    position: 'absolute',
    width: 180,
    height: 150,
    right: -5,
    bottom: 20,
    zIndex: 10,
  },
  headerSafe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 8 : 4,
    height: Platform.OS === 'ios' ? 52 : 52 + (StatusBar.currentHeight ?? 0),
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
  langRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  langBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 },
  langBtnActive: { backgroundColor: MD3.primary },
  langText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },
  langTextActive: { color: '#FFF' },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerSubLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  headerWelcome: { fontSize: 20, fontWeight: '700', color: '#FFF' },

  // 콘텐츠 패널
  contentWrapper: { flex: 1, marginTop: -65 },
  whitePanel: {
    flex: 1,
    backgroundColor: '#F7FCFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  dragHandleWrap: { alignItems: 'center', paddingVertical: 10 },
  dragHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#D0D8E4' },
  scroll: { flex: 1 },

  // 섹션 공통
  section: { marginBottom: 28, paddingHorizontal: 16 },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: MD3.onSurface },
  seeAllText: { fontSize: 13, color: MD3.primary, fontWeight: '600' },

  // ① 주차
  parkingCard: { overflow: 'hidden' },
  parkingTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  parkingIconBox: {
    width: 50, height: 50, borderRadius: 16,
    backgroundColor: MD3.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  parkingName: { fontSize: 15, fontWeight: '700', color: MD3.onSurface },
  parkingHint: { fontSize: 12, color: MD3.onSurfaceVariant, marginTop: 2 },
  parkingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  parkingBadgeText: { fontSize: 13, fontWeight: '700' },
  rateBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 10,
  },
  rateBarBg: {
    flex: 1, height: 8, borderRadius: 4,
    backgroundColor: MD3.surfaceVariant, overflow: 'hidden',
  },
  rateBarFill: { height: '100%', borderRadius: 4 },
  rateLabel: { fontSize: 13, fontWeight: '700', color: MD3.onSurface, width: 36 },
  parkingMsg: {
    fontSize: 13,
    color: MD3.onSurfaceVariant,
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 19,
  },

  carFinderBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 12, paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 16, backgroundColor: MD3.primaryContainer,
  },
  carFinderBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  carFinderBtnIconBox: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  carFinderBtnText: { fontSize: 15, fontWeight: '700', color: MD3.onSurface },

  // ③ 실내 길찾기
  prototypeBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  prototypeBadgeText: { fontSize: 11, fontWeight: '700', color: '#92400E' },
  mapCard: { overflow: 'hidden' },
  mapImage: { width: '100%', height: 210, backgroundColor: '#F1F5F9' },
  mapFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  mapFooterText: { fontSize: 12, color: MD3.onSurfaceVariant },

  // ② 코엑스
  listCard: { overflow: 'hidden', marginBottom: 10 },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: MD3.outlineVariant },
  eventDateBox: {
    backgroundColor: MD3.primaryContainer,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
    minWidth: 52, alignItems: 'center',
  },
  eventHall: { fontSize: 12, fontWeight: '700', color: MD3.primary },
  eventTitle: { fontSize: 14, fontWeight: '600', color: MD3.onSurface },
  eventDate: { fontSize: 12, color: MD3.onSurfaceVariant },
  outLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: MD3.primary,
    backgroundColor: MD3.primaryContainer,
  },
  outLinkBtnText: { fontSize: 14, fontWeight: '700', color: MD3.primary },

  // ③ 식당
  diningCard: { overflow: 'hidden' },
  diningGradient: { padding: 18 },
  diningIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  diningIconBox: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: '#FDEBD0',
    alignItems: 'center', justifyContent: 'center',
  },
  diningBadge: {
    backgroundColor: '#FFF',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: '#F5C98A',
  },
  diningBadgeText: { fontSize: 12, fontWeight: '700', color: '#E07B39' },
  diningDesc: {
    fontSize: 14,
    color: '#7A4A1E',
    lineHeight: 21,
    marginBottom: 14,
  },
  diningBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F5C98A',
  },
  diningBtnText: { fontSize: 13, fontWeight: '700', color: '#E07B39' },

  // ⑤ 별마당 도서관
  libraryCard: { overflow: 'hidden' },
  libraryGradient: { padding: 18 },
  libraryIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  libraryIconBox: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: '#EDE9FE',
    alignItems: 'center', justifyContent: 'center',
  },
  libraryBadge: {
    backgroundColor: '#FFF',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: '#C4B5FD',
  },
  libraryBadgeText: { fontSize: 12, fontWeight: '700', color: '#7C3AED' },
  libraryDesc: { fontSize: 14, color: '#4C1D95', lineHeight: 21, marginBottom: 14 },
  libraryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#C4B5FD',
  },
  libraryBtnText: { fontSize: 13, fontWeight: '700', color: '#7C3AED' },

  // ⑥ 교통
  travelGrid: { gap: 12 },
  travelCard: { overflow: 'hidden' },
  travelCardInner: { padding: 16 },
  travelIconBox: {
    width: 50, height: 50, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  travelCardTitle: { fontSize: 15, fontWeight: '700', color: MD3.onSurface, marginBottom: 6 },
  travelCardDesc: { fontSize: 13, color: MD3.onSurfaceVariant, lineHeight: 19, marginBottom: 14 },
  travelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1.5,
    backgroundColor: '#FFF',
  },
  travelBtnText: { fontSize: 13, fontWeight: '700' },

  // ⑤ 편의시설
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityCard: {
    width: (width - 32 - 10) / 2,
    padding: 14,
  },
  amenityIconBox: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: MD3.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  amenityTitle: { fontSize: 13, fontWeight: '700', color: MD3.onSurface, marginBottom: 5 },
  amenityDesc: { fontSize: 12, color: MD3.onSurfaceVariant, lineHeight: 17 },

  // ⑥ K-컬처
  attractionsScroll: { paddingHorizontal: 16, gap: 12 },
  attractionCard: { width: 130, alignItems: 'flex-start' },
  attractionImgBox: {
    width: 130, height: 100, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8, overflow: 'hidden',
    backgroundColor: MD3.surfaceVariant,
  },
  attractionImg: { width: '100%', height: '100%' },
  attractionCategoryBadge: {
    backgroundColor: MD3.primaryContainer,
    borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    marginBottom: 5,
  },
  attractionCategoryText: { fontSize: 10, fontWeight: '700', color: MD3.primary },
  attractionName: { fontSize: 12, fontWeight: '600', color: MD3.onSurface, lineHeight: 17 },

  // 하단 이동 버튼
  backToGateway: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: MD3.surfaceVariant,
  },
  backToGatewayText: { fontSize: 13, color: MD3.onSurfaceVariant, fontWeight: '600' },

  // 안전신문고
  safetyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 16, backgroundColor: '#FFF5F5',
    borderWidth: 1, borderColor: '#FFE0E0',
  },
  safetyBtnLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14 },
  safetyBtnIconBox: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#FFE9E9',
    alignItems: 'center', justifyContent: 'center',
  },
  safetyBtnTitle: { fontSize: 15, fontWeight: '700', color: MD3.onSurface, marginBottom: 3 },
  safetyBtnSub: { fontSize: 12, color: MD3.onSurfaceVariant },
});
