import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { M3Card } from '../../components/common/M3Card';
import { CarFinderIcon } from '../../components/common/CarFinderIcon';

const FLOORS = ['B1', 'B2', 'B3', 'B4', 'B5'];
const ZONES = ['A', 'B', 'C', 'D'];

function findParkingSpot(code: string) {
  const num = parseInt(code, 10);
  const floor = FLOORS[num % FLOORS.length];
  const zone = ZONES[Math.floor(num / FLOORS.length) % ZONES.length];
  const spot = (num % 40) + 1;
  return { floor, zone, spot };
}

export default function CarFinderScreen() {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [result, setResult] = useState<{ floor: string; zone: string; spot: number } | null>(null);

  const handleSearch = () => {
    if (code.trim().length !== 4) {
      setError(true);
      setResult(null);
      return;
    }
    setError(false);
    setResult(findParkingSpot(code));
  };

  const handleChange = (v: string) => {
    setCode(v.replace(/[^0-9]/g, '').slice(0, 4));
    setError(false);
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={MD3.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <CarFinderIcon size={26} color={MD3.primary} />
            </View>
            <View>
              <Text style={styles.headline}>내차찾기</Text>
              <Text style={styles.subHeadline}>차량정보로 주차 위치를 확인하세요</Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.section}>
            <Text style={styles.question}>고객님의 차량정보를 입력해주세요.</Text>

            <M3Card variant="outlined" style={[styles.inputCard, error && styles.inputCardError]}>
              <TextInput
                style={styles.textInput}
                placeholder="고객님의 차량정보 4자리를 입력해주세요."
                placeholderTextColor={MD3.outline}
                value={code}
                onChangeText={handleChange}
                keyboardType="number-pad"
                maxLength={4}
              />
            </M3Card>

            {error && (
              <Text style={styles.errorText}>고객님의 차량정보 4자리를 입력해주세요.</Text>
            )}

            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.85}>
              <Text style={styles.searchBtnText}>조회하기</Text>
            </TouchableOpacity>

            {result && (
              <M3Card variant="elevated" style={styles.resultCard}>
                <View style={styles.resultIconBox}>
                  <Ionicons name="car-sport" size={28} color={MD3.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultLabel}>고객님의 차량 위치</Text>
                  <Text style={styles.resultText}>
                    {result.floor} 주차장 {result.zone}구역 {result.spot}번
                  </Text>
                </View>
              </M3Card>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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

  section: { paddingHorizontal: 16, marginTop: 28 },
  question: { fontSize: 18, fontWeight: '700', color: MD3.onSurface, marginBottom: 16 },

  inputCard: { padding: 4 },
  inputCardError: { borderColor: MD3.error, borderWidth: 1.5 },
  textInput: { fontSize: 14, color: MD3.onSurface, paddingHorizontal: 12, paddingVertical: 14 },
  errorText: { fontSize: 12, color: MD3.error, marginTop: 8, marginLeft: 4 },

  searchBtn: {
    backgroundColor: MD3.primary,
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 20,
  },
  searchBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  resultCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 16, marginTop: 20,
  },
  resultIconBox: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: MD3.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  resultLabel: { fontSize: 12, color: MD3.onSurfaceVariant, marginBottom: 4 },
  resultText: { fontSize: 17, fontWeight: '800', color: MD3.onSurface },
});
