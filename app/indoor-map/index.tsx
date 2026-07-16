import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { M3Card } from '../../components/common/M3Card';

const coexMap = require('../../assets/coex_map.png');

export default function IndoorMapScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={MD3.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Ionicons name="navigate-outline" size={26} color={MD3.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.headline}>실내 길찾기</Text>
                <View style={styles.prototypeBadge}>
                  <Text style={styles.prototypeBadgeText}>프로토타입</Text>
                </View>
              </View>
              <Text style={styles.subHeadline}>무역센터 실내 안내도</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <M3Card variant="outlined" style={styles.mapCard}>
            <Image source={coexMap} style={styles.mapImage} resizeMode="contain" />
            <View style={styles.mapFooter}>
              <Ionicons name="time-outline" size={13} color={MD3.onSurfaceVariant} />
              <Text style={styles.mapFooterText}>API 연동 서비스 준비 중</Text>
            </View>
          </M3Card>
        </View>
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
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headline: { fontSize: 22, fontWeight: '800', color: MD3.onSurface },
  subHeadline: { fontSize: 12, color: MD3.onSurfaceVariant, marginTop: 3 },
  prototypeBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  prototypeBadgeText: { fontSize: 11, fontWeight: '700', color: '#92400E' },

  section: { padding: 16 },
  mapCard: { overflow: 'hidden' },
  mapImage: { width: '100%', height: 320, backgroundColor: '#F1F5F9' },
  mapFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  mapFooterText: { fontSize: 12, color: MD3.onSurfaceVariant },
});
