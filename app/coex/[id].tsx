import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { M3Button } from '../../components/common/M3Button';
import { mockCoexEvents } from '../../utils/mockData';
import { showAlert } from '../../utils/showAlert';

export default function CoexEventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = mockCoexEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>전시 정보를 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={MD3.onSurface} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>전시 상세</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => showAlert('관심 저장', '관심 전시에 추가되었습니다.')}>
          <Ionicons name="heart-outline" size={24} color={MD3.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {/* Hero Image */}
        <View style={styles.heroImg}>
          <View style={styles.heroOverlay}>
            <Ionicons name="images" size={56} color={MD3.onPrimary} style={{ opacity: 0.6 }} />
          </View>
        </View>

        <View style={styles.content}>
          {/* Badges */}
          <View style={styles.badgeRow}>
            <View style={styles.catBadge}>
              <Text style={styles.catText}>{event.category}</Text>
            </View>
            {event.hasTenantDiscount && (
              <View style={styles.discountBadge}>
                <Ionicons name="pricetag" size={12} color={MD3.onSecondaryContainer} />
                <Text style={styles.discountText}>입주사 할인</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>{event.title}</Text>

          {/* Info Card */}
          <View style={styles.infoCard}>
            {[
              { icon: 'calendar-outline' as const, label: '기간', value: `${event.startDate} ~ ${event.endDate}` },
              { icon: 'location-outline' as const, label: '장소', value: event.location },
              { icon: 'grid-outline' as const, label: '분류', value: event.category },
            ].map((item) => (
              <View key={item.label} style={styles.infoRow}>
                <Ionicons name={item.icon} size={18} color={MD3.primary} />
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.sectionLabel}>전시 소개</Text>
          <Text style={styles.description}>{event.description}</Text>

          {/* Actions */}
          <View style={styles.actionRow}>
            <M3Button
              label="공식 페이지"
              variant="filled"
              icon={<Ionicons name="open-outline" size={16} color={MD3.onPrimary} />}
              onPress={() => Linking.openURL(event.officialUrl)}
              style={{ flex: 1 }}
            />
            <M3Button
              label="관심 저장"
              variant="outlined"
              icon={<Ionicons name="bookmark-outline" size={16} color={MD3.primary} />}
              onPress={() => showAlert('관심 저장', '관심 전시에 추가되었습니다.')}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: MD3.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: MD3.surface,
    paddingHorizontal: 4,
    height: 64,
  },
  iconBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24 },
  topTitle: { fontSize: 22, fontWeight: '500', color: MD3.onSurface },
  scroll: { flex: 1 },
  heroImg: {
    height: 220,
    backgroundColor: MD3.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  catBadge: {
    backgroundColor: MD3.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  catText: { fontSize: 12, fontWeight: '700', color: MD3.onPrimaryContainer },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: MD3.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: { fontSize: 12, fontWeight: '700', color: MD3.onSecondaryContainer },
  title: { fontSize: 26, fontWeight: '400', color: MD3.onSurface, lineHeight: 34, marginBottom: 20 },
  infoCard: {
    backgroundColor: MD3.surfaceVariant,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    marginBottom: 24,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoLabel: { fontSize: 13, color: MD3.onSurfaceVariant, width: 56 },
  infoValue: { fontSize: 14, color: MD3.onSurface, fontWeight: '500', flex: 1 },
  sectionLabel: { fontSize: 16, fontWeight: '600', color: MD3.onSurface, marginBottom: 10 },
  description: { fontSize: 15, color: MD3.onSurfaceVariant, lineHeight: 24, marginBottom: 28 },
  actionRow: { flexDirection: 'row', gap: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 16, color: MD3.onSurfaceVariant },
});
