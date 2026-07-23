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
import { mockNotices } from '../../utils/mockData';

const CAT_META: Record<string, { label: string; color: string; bg: string }> = {
  operations: { label: '운영공지', color: MD3.primary, bg: MD3.primaryContainer },
  construction: { label: '공사·점검공지', color: MD3.warning, bg: MD3.secondaryContainer },
  urgent: { label: '긴급공지', color: MD3.error, bg: MD3.errorContainer },
  event: { label: '행사', color: MD3.tertiary, bg: MD3.tertiaryContainer },
};

export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const notice = mockNotices.find((n) => n.id === id);

  if (!notice) {
    return (
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={MD3.onSurface} />
        </TouchableOpacity>
        <View style={styles.empty}>
          <Ionicons name="document-text-outline" size={48} color={MD3.onSurfaceVariant} />
          <Text style={styles.emptyText}>공지를 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const cat = CAT_META[notice.category];

  return (
    <SafeAreaView style={styles.safe}>
      {/* M3 Small Top App Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={MD3.onSurface} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>공지사항</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.scroll}>
        {/* Category badges */}
        <View style={styles.badgeRow}>
          <View style={[styles.catBadge, { backgroundColor: cat.bg }]}>
            <Text style={[styles.catText, { color: cat.color }]}>{cat.label}</Text>
          </View>
          {notice.isUrgent && (
            <View style={[styles.catBadge, { backgroundColor: MD3.errorContainer }]}>
              <Ionicons name="alert-circle" size={13} color={MD3.error} />
              <Text style={[styles.catText, { color: MD3.error }]}>긴급</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{notice.title}</Text>

        {/* Meta info */}
        <View style={styles.metaCard}>
          {[
            { icon: 'calendar-outline' as const, label: '작성일', value: notice.createdAt },
            { icon: 'time-outline' as const, label: '적용기간', value: `${notice.startDate} ~ ${notice.endDate}` },
            { icon: 'business-outline' as const, label: '대상', value: notice.targetBuilding },
          ].map((m) => (
            <View key={m.label} style={styles.metaRow}>
              <Ionicons name={m.icon} size={16} color={MD3.primary} />
              <Text style={styles.metaLabel}>{m.label}</Text>
              <Text style={styles.metaValue}>{m.value}</Text>
            </View>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Content */}
        <Text style={styles.content}>{notice.content}</Text>

        {/* Call button */}
        {notice.contactPhone && (
          <View style={styles.callSection}>
            <M3Button
              label={`문의: ${notice.contactPhone}`}
              variant="tonal"
              icon={<Ionicons name="call" size={16} color={MD3.onPrimaryContainer} />}
              onPress={() => Linking.openURL(`tel:${notice.contactPhone}`)}
              style={styles.callBtn}
            />
          </View>
        )}

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
  backBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24 },
  topTitle: { fontSize: 22, fontWeight: '500', color: MD3.onSurface },
  scroll: { flex: 1 },
  badgeRow: { flexDirection: 'row', gap: 8, padding: 20, paddingBottom: 12 },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  catText: { fontSize: 12, fontWeight: '700' },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: MD3.onSurface,
    paddingHorizontal: 20,
    paddingBottom: 20,
    lineHeight: 32,
  },
  metaCard: {
    backgroundColor: MD3.surfaceVariant,
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 16,
    gap: 12,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  metaLabel: { fontSize: 13, color: MD3.onSurfaceVariant, width: 64 },
  metaValue: { fontSize: 13, color: MD3.onSurface, fontWeight: '500', flex: 1 },
  divider: { height: 1, backgroundColor: MD3.outlineVariant, margin: 20 },
  content: { fontSize: 16, color: MD3.onSurface, lineHeight: 26, paddingHorizontal: 20 },
  callSection: { paddingHorizontal: 20, marginTop: 24 },
  callBtn: { width: '100%' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 16, color: MD3.onSurfaceVariant },
});
