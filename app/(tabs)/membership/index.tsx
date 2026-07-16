import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MD3 } from '../../../constants/colors';
import { M3Card } from '../../../components/common/M3Card';
import { M3Chip } from '../../../components/common/M3Chip';
import { mockBenefits } from '../../../utils/mockData';
import { BenefitCategory, CouponStatus } from '../../../types';
import { useAuthStore } from '../../../store/useAuthStore';

const mascotImg = require('../../../assets/cacl.png');
const bgWtc = require('../../../assets/bg_wtc.jpg');

type FilterTab = 'all' | BenefitCategory | 'coupon';

const TABS: { key: FilterTab; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { key: 'all', label: '전체', icon: 'grid-outline' },
  { key: 'fnb', label: 'F&B', icon: 'restaurant-outline' },
  { key: 'shopping', label: '쇼핑', icon: 'bag-outline' },
  { key: 'hotel', label: '호텔', icon: 'bed-outline' },
  { key: 'leisure', label: '레저·문화', icon: 'football-outline' },
  { key: 'service', label: '생활서비스', icon: 'briefcase-outline' },
  { key: 'coupon', label: '쿠폰함', icon: 'ticket-outline' },
];

export default function MembershipScreen() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const { isLoggedIn } = useAuthStore();

  const filteredBenefits = activeTab === 'all' || activeTab === 'coupon'
    ? mockBenefits
    : mockBenefits.filter((b) => b.category === activeTab);

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
            <View style={{ width: 40 }} />
            <Text style={styles.appBarHeadline}>혜택</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.headerContent}>
            <View style={styles.greetingBox}>
              <Text style={styles.greetingTitle}>ASEM·TRADE</Text>
              <Text style={styles.greetingSubtitle}>입주사 전용{'\n'}프리미엄 혜택</Text>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Main Content Area */}
      <View style={styles.contentWrapper}>
        <View style={styles.whitePanel}>
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

            {/* Filter & List */}
            <View style={styles.chipBar}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {TABS.map((tab) => (
                  <M3Chip
                    key={tab.key}
                    label={tab.label}
                    selected={activeTab === tab.key}
                    onPress={() => setActiveTab(tab.key)}
                    icon={activeTab === tab.key ? <Ionicons name={tab.icon} size={14} color={MD3.onPrimaryContainer} /> : undefined}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>{filteredBenefits.length}개의 기타 혜택</Text>
              {activeTab === 'coupon' ? (
                <Text style={{ textAlign: 'center', color: '#888', padding: 20 }}>쿠폰 내역</Text>
              ) : (
                filteredBenefits.slice(0, 3).map((benefit) => (
                  <M3Card key={benefit.id} variant="elevated" style={{ marginBottom: 12 }}>
                    <View style={{ padding: 14 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600' }}>{benefit.title}</Text>
                      <Text style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{benefit.brandName} · {benefit.discountText}</Text>
                    </View>
                  </M3Card>
                ))
              )}
            </View>

          </ScrollView>
        </View>
      </View>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
    height: 56,
  },
  appBarHeadline: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  headerContent: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 24 },
  greetingBox: { flex: 1, paddingBottom: 16 },
  greetingTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', lineHeight: 30 },
  greetingSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  headerCharImg: {
    position: 'absolute', right: 0, bottom: -14,
    width: 225, height: 179,
  },

  contentWrapper: { flex: 1, marginTop: -30 },
  whitePanel: {
    flex: 1, backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    overflow: 'hidden', paddingTop: 32,
  },
  scroll: { flex: 1 },

  chipBar: { borderTopWidth: 1, borderTopColor: '#EEE' },
  chipRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
});
