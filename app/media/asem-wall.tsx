import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { M3Card } from '../../components/common/M3Card';
import { M3TextField } from '../../components/common/M3TextField';
import { showAlert } from '../../utils/showAlert';

type PickedImage = { uri: string; width: number; height: number };

const MAIN_IMAGE_SPEC = { width: 3096, height: 720, label: '입주사 메인 이미지' };
const LOGO_SPEC = { width: 540, height: 540, label: '로고' };

const FORMAT_ROWS = [
  { label: '입주사 메인 이미지', value: '3096 x 720 px' },
  { label: '로고', value: '540 x 540 px (영문/국문 각 1개)' },
  { label: '입주 층수', value: '아래 입력폼에 기재' },
  { label: '비고', value: '영상 삽입 불가 · 입주사 층 회신 필수 (여러 층 입주 시 "31층(대표층)" 등으로 기재)' },
];

async function pickImage(spec: { width: number; height: number; label: string }): Promise<PickedImage | null> {
  if (Platform.OS !== 'web') {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      showAlert('권한 필요', '이미지를 선택하려면 사진 접근 권한이 필요합니다.');
      return null;
    }
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];

  if (asset.width !== spec.width || asset.height !== spec.height) {
    showAlert(
      '이미지 규격 오류',
      `${spec.label}은(는) ${spec.width} x ${spec.height}px 크기의 이미지만 업로드할 수 있습니다.\n선택하신 이미지 크기: ${asset.width} x ${asset.height}px`
    );
    return null;
  }

  return { uri: asset.uri, width: asset.width, height: asset.height };
}

function UploadSlot({
  title,
  spec,
  image,
  onPick,
}: {
  title: string;
  spec: { width: number; height: number };
  image: PickedImage | null;
  onPick: () => void;
}) {
  return (
    <View style={styles.uploadSlot}>
      <Text style={styles.uploadLabel}>
        {title} <Text style={styles.uploadSpec}>({spec.width} x {spec.height}px)</Text>
      </Text>
      <TouchableOpacity style={styles.uploadBox} onPress={onPick} activeOpacity={0.8}>
        {image ? (
          <>
            <Image source={{ uri: image.uri }} style={styles.uploadPreview} resizeMode="cover" />
            <View style={styles.uploadOverlay}>
              <Ionicons name="checkmark-circle" size={14} color="#22C55E" />
              <Text style={styles.uploadOverlayText}>{image.width} x {image.height}px · 다시 선택</Text>
            </View>
          </>
        ) : (
          <View style={styles.uploadEmpty}>
            <Ionicons name="cloud-upload-outline" size={26} color={MD3.onSurfaceVariant} />
            <Text style={styles.uploadEmptyText}>탭하여 업로드</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function AsemMediaWallScreen() {
  const [companyName, setCompanyName] = useState('');
  const [contact, setContact] = useState('');
  const [floorInfo, setFloorInfo] = useState('');
  const [mainImage, setMainImage] = useState<PickedImage | null>(null);
  const [logoEn, setLogoEn] = useState<PickedImage | null>(null);
  const [logoKr, setLogoKr] = useState<PickedImage | null>(null);

  const handlePickMain = async () => {
    const img = await pickImage(MAIN_IMAGE_SPEC);
    if (img) setMainImage(img);
  };
  const handlePickLogoEn = async () => {
    const img = await pickImage({ ...LOGO_SPEC, label: '영문 로고' });
    if (img) setLogoEn(img);
  };
  const handlePickLogoKr = async () => {
    const img = await pickImage({ ...LOGO_SPEC, label: '국문 로고' });
    if (img) setLogoKr(img);
  };

  const handleSubmit = () => {
    if (!companyName.trim()) {
      showAlert('입력 오류', '입주사명을 입력해 주세요.');
      return;
    }
    if (!contact.trim()) {
      showAlert('입력 오류', '담당자 연락처를 입력해 주세요.');
      return;
    }
    if (!floorInfo.trim()) {
      showAlert('입력 오류', '입주 층수를 입력해 주세요. (예: 31층(대표층))');
      return;
    }
    if (!mainImage) {
      showAlert('이미지 필요', `메인 이미지(${MAIN_IMAGE_SPEC.width} x ${MAIN_IMAGE_SPEC.height}px)를 업로드해 주세요.`);
      return;
    }
    if (!logoEn) {
      showAlert('이미지 필요', `영문 로고(${LOGO_SPEC.width} x ${LOGO_SPEC.height}px)를 업로드해 주세요.`);
      return;
    }
    if (!logoKr) {
      showAlert('이미지 필요', `국문 로고(${LOGO_SPEC.width} x ${LOGO_SPEC.height}px)를 업로드해 주세요.`);
      return;
    }

    showAlert('신청 완료', '아셈타워 미디어월 신청이 접수되었습니다. 담당자 확인 후 이메일로 안내드립니다.');
    setCompanyName('');
    setContact('');
    setFloorInfo('');
    setMainImage(null);
    setLogoEn(null);
    setLogoKr(null);
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
              <Ionicons name="easel-outline" size={26} color={MD3.primary} />
            </View>
            <View>
              <Text style={styles.headline}>아셈타워 미디어월 신청</Text>
              <Text style={styles.subHeadline}>실내 매체 · 브랜드 홍보 배너 신청</Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.noticeBar}>
            <Ionicons name="information-circle-outline" size={16} color={MD3.primary} />
            <Text style={styles.noticeText}>데모 화면입니다. 실제 접수는 백엔드 연동 후 반영됩니다.</Text>
          </View>

          {/* 미디어 포맷 안내 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>미디어 포멧</Text>
            <M3Card variant="outlined" style={{ overflow: 'hidden' }}>
              {FORMAT_ROWS.map((row, idx) => (
                <View key={row.label} style={[styles.formatRow, idx > 0 && styles.formatRowDivider]}>
                  <Text style={styles.formatLabel}>{row.label}</Text>
                  <Text style={styles.formatValue}>{row.value}</Text>
                </View>
              ))}
            </M3Card>
          </View>

          {/* 이미지 업로드 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>이미지 업로드</Text>
            <Text style={styles.helperText}>규격에 맞지 않는 이미지는 업로드할 수 없습니다.</Text>

            <UploadSlot title="메인 이미지" spec={MAIN_IMAGE_SPEC} image={mainImage} onPick={handlePickMain} />
            <View style={styles.logoRow}>
              <View style={{ flex: 1 }}>
                <UploadSlot title="영문 로고" spec={LOGO_SPEC} image={logoEn} onPick={handlePickLogoEn} />
              </View>
              <View style={{ flex: 1 }}>
                <UploadSlot title="국문 로고" spec={LOGO_SPEC} image={logoKr} onPick={handlePickLogoKr} />
              </View>
            </View>
          </View>

          {/* 신청 정보 입력 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>신청 정보 입력</Text>
            <M3TextField label="입주사명" value={companyName} onChangeText={setCompanyName} placeholder="예: WTC SEOUL" />
            <M3TextField label="담당자 연락처" value={contact} onChangeText={setContact} placeholder="010-0000-0000 또는 이메일" />
            <M3TextField
              label="입주 층수"
              value={floorInfo}
              onChangeText={setFloorInfo}
              placeholder='예: 31층(대표층)'
              helperText="여러 층에 입주한 경우 대표층을 포함해 기재해 주세요."
            />
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
              <Text style={styles.submitBtnText}>신청하기</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 32 }} />
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
  headline: { fontSize: 18, fontWeight: '800', color: MD3.onSurface },
  subHeadline: { fontSize: 12, color: MD3.onSurfaceVariant, marginTop: 3 },

  noticeBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: MD3.primaryContainer, borderRadius: 12,
    marginHorizontal: 16, marginTop: 16, padding: 12,
  },
  noticeText: { flex: 1, fontSize: 12, color: MD3.onPrimaryContainer },

  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: MD3.onSurface, marginBottom: 12 },
  helperText: { fontSize: 12, color: MD3.onSurfaceVariant, marginBottom: 14, marginTop: -6 },

  formatRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  formatRowDivider: { borderTopWidth: 1, borderTopColor: MD3.outlineVariant },
  formatLabel: { width: 100, fontSize: 13, fontWeight: '700', color: MD3.onSurface },
  formatValue: { flex: 1, fontSize: 12, color: MD3.onSurfaceVariant, lineHeight: 17 },

  logoRow: { flexDirection: 'row', gap: 12 },

  uploadSlot: { marginBottom: 16 },
  uploadLabel: { fontSize: 13, fontWeight: '600', color: MD3.onSurface, marginBottom: 8 },
  uploadSpec: { fontSize: 12, fontWeight: '400', color: MD3.onSurfaceVariant },
  uploadBox: {
    borderWidth: 1.5, borderColor: MD3.outlineVariant, borderStyle: 'dashed',
    borderRadius: 14, height: 110, overflow: 'hidden',
    backgroundColor: MD3.surfaceVariant,
  },
  uploadEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  uploadEmptyText: { fontSize: 12, color: MD3.onSurfaceVariant },
  uploadPreview: { width: '100%', height: '100%' },
  uploadOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8, paddingVertical: 5,
  },
  uploadOverlayText: { fontSize: 10, fontWeight: '600', color: MD3.onSurface },

  submitBtn: {
    backgroundColor: MD3.primary,
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
