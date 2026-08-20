import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { M3Card } from '../../components/common/M3Card';
import { showAlert } from '../../utils/showAlert';

const TOTAL_PER_BUILDING = 10;

const BUILDINGS = [
  { id: 'tt', name: '트레이드타워 (T/T)', location: '1층 안내데스크' },
  { id: 'at', name: '아셈타워 (A/T)', location: '1층 안내데스크' },
];

export default function UmbrellaScreen() {
  const [available, setAvailable] = useState<Record<string, number>>({ tt: 6, at: 3 });
  const [borrowed, setBorrowed] = useState<Record<string, boolean>>({ tt: false, at: false });

  const handleBorrow = (id: string, name: string) => {
    if (borrowed[id]) {
      showAlert('반납 알림', '이미 대여 중인 우산이 있습니다. 반납 후 다시 대여해 주세요.');
      return;
    }
    if (available[id] <= 0) {
      showAlert('대여 불가', '해당 건물의 대여 가능한 우산이 없습니다.');
      return;
    }
    setAvailable((prev) => ({ ...prev, [id]: prev[id] - 1 }));
    setBorrowed((prev) => ({ ...prev, [id]: true }));
    showAlert('대여 완료', `${name} 안내데스크에서 우산을 수령해 주세요.`);
  };

  const handleReturn = (id: string, name: string) => {
    if (!borrowed[id]) {
      showAlert('반납 불가', '대여 중인 우산이 없습니다.');
      return;
    }
    setAvailable((prev) => ({ ...prev, [id]: Math.min(TOTAL_PER_BUILDING, prev[id] + 1) }));
    setBorrowed((prev) => ({ ...prev, [id]: false }));
    showAlert('반납 완료', `${name} 안내데스크에 우산을 반납해 주셔서 감사합니다.`);
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
              <Ionicons name="umbrella-outline" size={26} color={MD3.primary} />
            </View>
            <View>
              <Text style={styles.headline}>우산대여 서비스</Text>
              <Text style={styles.subHeadline}>건물별 안내데스크에서 무료 대여</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {BUILDINGS.map((b) => {
            const count = available[b.id];
            const isBorrowed = borrowed[b.id];
            return (
              <M3Card key={b.id} variant="outlined" style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.buildingName}>{b.name}</Text>
                    <Text style={styles.buildingLocation}>{b.location}</Text>
                  </View>
                  <View style={styles.countBox}>
                    <Text style={styles.countNum}>{count}</Text>
                    <Text style={styles.countLabel}>/ {TOTAL_PER_BUILDING}개 남음</Text>
                  </View>
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.borrowBtn, (isBorrowed || count <= 0) && styles.actionBtnDisabled]}
                    onPress={() => handleBorrow(b.id, b.name)}
                    disabled={isBorrowed || count <= 0}
                  >
                    <Text style={styles.borrowBtnText}>대여하기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.returnBtn, !isBorrowed && styles.actionBtnDisabled]}
                    onPress={() => handleReturn(b.id, b.name)}
                    disabled={!isBorrowed}
                  >
                    <Text style={styles.returnBtnText}>반납하기</Text>
                  </TouchableOpacity>
                </View>

                {isBorrowed && (
                  <View style={styles.statusPill}>
                    <Ionicons name="time-outline" size={13} color={MD3.primary} />
                    <Text style={styles.statusPillText}>현재 대여 중</Text>
                  </View>
                )}
              </M3Card>
            );
          })}
        </View>

        <View style={styles.noticeBar}>
          <Ionicons name="information-circle-outline" size={16} color={MD3.primary} />
          <Text style={styles.noticeText}>
            데모 화면입니다. 잔여 수량은 목업 데이터이며, 실제 대여/반납 처리는 현장 안내데스크에서 이루어집니다.
          </Text>
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
  headline: { fontSize: 20, fontWeight: '800', color: MD3.onSurface },
  subHeadline: { fontSize: 12, color: MD3.onSurfaceVariant, marginTop: 3 },

  section: { padding: 16, gap: 12 },
  card: { padding: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  buildingName: { fontSize: 15, fontWeight: '700', color: MD3.onSurface, marginBottom: 3 },
  buildingLocation: { fontSize: 12, color: MD3.onSurfaceVariant },
  countBox: { alignItems: 'flex-end' },
  countNum: { fontSize: 22, fontWeight: '800', color: MD3.primary },
  countLabel: { fontSize: 11, color: MD3.onSurfaceVariant },

  btnRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12 },
  actionBtnDisabled: { opacity: 0.4 },
  borrowBtn: { backgroundColor: MD3.primary },
  borrowBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  returnBtn: { backgroundColor: MD3.surfaceVariant, borderWidth: 1, borderColor: MD3.outlineVariant },
  returnBtnText: { fontSize: 14, fontWeight: '700', color: MD3.onSurface },

  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start', marginTop: 12,
    backgroundColor: MD3.primaryContainer, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  statusPillText: { fontSize: 12, fontWeight: '600', color: MD3.primary },

  noticeBar: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: MD3.primaryContainer, borderRadius: 12,
    marginHorizontal: 16, marginBottom: 24, padding: 12,
  },
  noticeText: { flex: 1, fontSize: 12, color: MD3.onPrimaryContainer, lineHeight: 17 },
});
