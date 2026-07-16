import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { M3Card } from '../../components/common/M3Card';

const MEDIA_MENUS = [
  {
    id: 'welcome',
    title: '트레이드타워 Welcome 신청',
    subtitle: '방문자 환영 메시지 DID 송출 신청',
    icon: 'tv-outline' as const,
    onPress: () => router.push('/media/welcome' as any),
  },
  {
    id: 'asem-media-wall',
    title: '아셈타워 미디어월 신청',
    subtitle: '브랜드 홍보 배너 신청',
    icon: 'easel-outline' as const,
    onPress: () => router.push('/media/asem-wall' as any),
  },
];

export default function MediaMenuScreen() {
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
              <Text style={styles.headline}>미디어 신청</Text>
              <Text style={styles.subHeadline}>웰컴 배너 및 브랜드 홍보 신청</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {MEDIA_MENUS.map((menu) => (
            <M3Card key={menu.id} variant="outlined" style={styles.menuCard} onPress={menu.onPress}>
              <View style={styles.menuRow}>
                <View style={styles.menuIcon}>
                  <Ionicons name={menu.icon} size={24} color={MD3.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuTitle}>{menu.title}</Text>
                  <Text style={styles.menuSubtitle}>{menu.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={MD3.onSurfaceVariant} />
              </View>
            </M3Card>
          ))}
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
  headline: { fontSize: 22, fontWeight: '800', color: MD3.onSurface },
  subHeadline: { fontSize: 12, color: MD3.onSurfaceVariant, marginTop: 3 },

  section: { padding: 16, gap: 12 },
  menuCard: { padding: 16 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIcon: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: '#EAF4FA',
    alignItems: 'center', justifyContent: 'center',
  },
  menuTitle: { fontSize: 15, fontWeight: '700', color: MD3.onSurface, marginBottom: 3 },
  menuSubtitle: { fontSize: 12, color: MD3.onSurfaceVariant },
});
