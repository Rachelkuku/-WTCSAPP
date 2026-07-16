import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { M3Card } from '../../components/common/M3Card';
import { I18N } from '../../constants/i18n';

const { width } = Dimensions.get('window');

export default function AmenitiesScreen() {
  const amenities = I18N.visitor.amenities;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={MD3.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Ionicons name="information-circle-outline" size={26} color={MD3.primary} />
            </View>
            <View>
              <Text style={styles.headline}>편의시설 안내</Text>
              <Text style={styles.subHeadline}>편의시설 및 약자 배려 서비스</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.grid}>
            {amenities.map((item, idx) => {
              const d = item.KR;
              return (
                <M3Card key={idx} variant="outlined" style={styles.card}>
                  <View style={styles.iconBox}>
                    <Ionicons name={item.icon} size={24} color={MD3.primary} />
                  </View>
                  <Text style={styles.title}>{d.title}</Text>
                  <Text style={styles.desc}>{d.desc}</Text>
                </M3Card>
              );
            })}
          </View>
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

  section: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: (width - 32 - 10) / 2, padding: 14 },
  iconBox: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: MD3.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 13, fontWeight: '700', color: MD3.onSurface, marginBottom: 5 },
  desc: { fontSize: 12, color: MD3.onSurfaceVariant, lineHeight: 17 },
});
