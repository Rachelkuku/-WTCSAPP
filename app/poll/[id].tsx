import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MD3 } from '../../constants/colors';
import { M3Card } from '../../components/common/M3Card';
import { M3Button } from '../../components/common/M3Button';
import { mockPolls } from '../../utils/mockData';
import { PollQuestion, PollOption, AnswerMap } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { showAlert } from '../../utils/showAlert';

// ── 유틸 ──────────────────────────────────────────────────

function totalVotes(options: PollOption[]) {
  return options.reduce((s, o) => s + o.voteCount, 0);
}

function pct(count: number, total: number) {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}

// ── 결과 바 ───────────────────────────────────────────────

function ResultBar({
  option,
  total,
  selected,
}: {
  option: PollOption;
  total: number;
  selected: boolean;
}) {
  const ratio = pct(option.voteCount, total);
  return (
    <View style={rb.wrap}>
      <View style={rb.labelRow}>
        <View style={rb.labelLeft}>
          {selected && (
            <Ionicons name="checkmark-circle" size={16} color={MD3.primary} style={{ marginRight: 6 }} />
          )}
          <Text style={[rb.label, selected && rb.labelSelected]}>{option.text}</Text>
        </View>
        <Text style={rb.pct}>{ratio}%</Text>
      </View>
      <View style={rb.track}>
        <View
          style={[
            rb.fill,
            { width: `${ratio}%` as any },
            selected && rb.fillSelected,
          ]}
        />
      </View>
      <Text style={rb.count}>{option.voteCount}명</Text>
    </View>
  );
}

const rb = StyleSheet.create({
  wrap: { marginBottom: 14 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  labelLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  label: { fontSize: 14, color: MD3.onSurface, flex: 1 },
  labelSelected: { fontWeight: '700', color: MD3.primary },
  pct: { fontSize: 14, fontWeight: '700', color: MD3.onSurface, marginLeft: 8 },
  track: {
    height: 8,
    backgroundColor: MD3.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 3,
  },
  fill: {
    height: '100%',
    backgroundColor: MD3.outlineVariant,
    borderRadius: 4,
  },
  fillSelected: { backgroundColor: MD3.primary },
  count: { fontSize: 11, color: MD3.onSurfaceVariant },
});

// ── 별점 컴포넌트 ──────────────────────────────────────────

function StarRating({
  value,
  onChange,
  readonly,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <View style={star.row}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          onPress={() => !readonly && onChange?.(n)}
          disabled={readonly}
          activeOpacity={0.7}
        >
          <Ionicons
            name={n <= value ? 'star' : 'star-outline'}
            size={36}
            color={n <= value ? MD3.secondary : MD3.outlineVariant}
            style={{ marginHorizontal: 4 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const star = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 8 },
});

// ── 점수 선택 컴포넌트 ─────────────────────────────────────

function ScoreSelector({
  min = 1,
  max = 5,
  value,
  onChange,
  readonly,
}: {
  min?: number;
  max?: number;
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const labels: Record<number, string> = {
    1: '매우 불만족',
    2: '불만족',
    3: '보통',
    4: '만족',
    5: '매우 만족',
  };

  return (
    <View>
      <View style={sc.row}>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <TouchableOpacity
            key={n}
            style={[sc.btn, value === n && sc.btnActive]}
            onPress={() => !readonly && onChange?.(n)}
            disabled={readonly}
          >
            <Text style={[sc.btnText, value === n && sc.btnTextActive]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={sc.labelRow}>
        <Text style={sc.labelText}>{labels[min]}</Text>
        <Text style={sc.labelText}>{labels[max]}</Text>
      </View>
      {value > 0 && (
        <Text style={sc.selected}>선택: {value}점 ({labels[value]})</Text>
      )}
    </View>
  );
}

const sc = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, justifyContent: 'center', paddingVertical: 8 },
  btn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: MD3.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MD3.surface,
  },
  btnActive: { borderColor: MD3.primary, backgroundColor: MD3.primaryContainer },
  btnText: { fontSize: 16, fontWeight: '600', color: MD3.onSurfaceVariant },
  btnTextActive: { color: MD3.onPrimaryContainer },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, marginTop: 4 },
  labelText: { fontSize: 11, color: MD3.onSurfaceVariant },
  selected: { textAlign: 'center', fontSize: 13, color: MD3.primary, fontWeight: '600', marginTop: 8 },
});

// ── 문항 렌더러 ────────────────────────────────────────────

function QuestionBlock({
  question,
  index,
  answer,
  onChange,
  showResult,
}: {
  question: PollQuestion;
  index: number;
  answer: string | string[] | number | undefined;
  onChange: (val: string | string[] | number) => void;
  showResult: boolean;
}) {
  const opts = question.options ?? [];
  const total = totalVotes(opts);

  return (
    <M3Card variant="outlined" style={qb.card}>
      <View style={qb.qHeader}>
        <View style={qb.qIndex}>
          <Text style={qb.qIndexText}>{index + 1}</Text>
        </View>
        <Text style={qb.qText}>{question.text}</Text>
        {question.required && <Text style={qb.required}>*</Text>}
      </View>

      {/* 단일 선택 */}
      {question.type === 'single' && (
        <View style={qb.options}>
          {showResult
            ? opts.map((opt) => (
                <ResultBar
                  key={opt.id}
                  option={opt}
                  total={total}
                  selected={answer === opt.id}
                />
              ))
            : opts.map((opt) => {
                const chosen = answer === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[qb.optRow, chosen && qb.optRowActive]}
                    onPress={() => onChange(opt.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[qb.radio, chosen && qb.radioActive]}>
                      {chosen && <View style={qb.radioDot} />}
                    </View>
                    <Text style={[qb.optText, chosen && qb.optTextActive]}>{opt.text}</Text>
                  </TouchableOpacity>
                );
              })}
        </View>
      )}

      {/* 복수 선택 */}
      {question.type === 'multiple' && (
        <View style={qb.options}>
          {showResult
            ? opts.map((opt) => (
                <ResultBar
                  key={opt.id}
                  option={opt}
                  total={total}
                  selected={Array.isArray(answer) && answer.includes(opt.id)}
                />
              ))
            : opts.map((opt) => {
                const selected = Array.isArray(answer) && answer.includes(opt.id);
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[qb.optRow, selected && qb.optRowActive]}
                    onPress={() => {
                      const cur = Array.isArray(answer) ? answer : [];
                      onChange(
                        selected ? cur.filter((id) => id !== opt.id) : [...cur, opt.id]
                      );
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={[qb.checkbox, selected && qb.checkboxActive]}>
                      {selected && <Ionicons name="checkmark" size={14} color={MD3.onPrimary} />}
                    </View>
                    <Text style={[qb.optText, selected && qb.optTextActive]}>{opt.text}</Text>
                  </TouchableOpacity>
                );
              })}
          {!showResult && (
            <Text style={qb.hint}>복수 선택 가능</Text>
          )}
        </View>
      )}

      {/* 별점 */}
      {question.type === 'rating' && (
        <View style={{ paddingHorizontal: 4 }}>
          <StarRating
            value={typeof answer === 'number' ? answer : 0}
            onChange={(v) => onChange(v)}
            readonly={showResult}
          />
          {showResult && (
            <Text style={qb.hint}>평균 {typeof answer === 'number' ? answer.toFixed(1) : '4.1'}점</Text>
          )}
        </View>
      )}

      {/* 만족도 점수 */}
      {question.type === 'score' && (
        <View style={{ paddingHorizontal: 4 }}>
          <ScoreSelector
            min={question.minScore ?? 1}
            max={question.maxScore ?? 5}
            value={typeof answer === 'number' ? answer : 0}
            onChange={(v) => onChange(v)}
            readonly={showResult}
          />
        </View>
      )}

      {/* 주관식 */}
      {question.type === 'text' && (
        <TextInput
          style={qb.textInput}
          placeholder={showResult ? '(제출된 의견)' : '의견을 자유롭게 입력해 주세요.'}
          placeholderTextColor={MD3.outline}
          value={typeof answer === 'string' ? answer : ''}
          onChangeText={(v) => onChange(v)}
          multiline
          editable={!showResult}
          numberOfLines={4}
          textAlignVertical="top"
        />
      )}
    </M3Card>
  );
}

const qb = StyleSheet.create({
  card: { marginBottom: 16, padding: 20 },
  qHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  qIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MD3.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  qIndexText: { fontSize: 13, fontWeight: '700', color: MD3.onPrimaryContainer },
  qText: { flex: 1, fontSize: 15, fontWeight: '500', color: MD3.onSurface, lineHeight: 22 },
  required: { fontSize: 16, color: MD3.error, marginTop: -2 },
  options: { gap: 10 },
  optRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: MD3.outlineVariant,
    borderRadius: 12,
    padding: 14,
    backgroundColor: MD3.surface,
  },
  optRowActive: {
    borderColor: MD3.primary,
    backgroundColor: MD3.primaryContainer,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: MD3.outline,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioActive: { borderColor: MD3.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MD3.primary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: MD3.outline,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxActive: { backgroundColor: MD3.primary, borderColor: MD3.primary },
  optText: { fontSize: 14, color: MD3.onSurface, flex: 1 },
  optTextActive: { color: MD3.onPrimaryContainer, fontWeight: '600' },
  hint: { fontSize: 12, color: MD3.onSurfaceVariant, marginTop: 6, textAlign: 'center' },
  textInput: {
    borderWidth: 1.5,
    borderColor: MD3.outlineVariant,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: MD3.onSurface,
    minHeight: 100,
    backgroundColor: MD3.surface,
  },
});

// ── 메인 화면 ──────────────────────────────────────────────

export default function PollDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const poll = mockPolls.find((p) => p.id === id);
  const { isLoggedIn } = useAuthStore();

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);

  const showResult = submitted || poll?.status === 'ended';

  const handleAnswer = useCallback((qId: string, val: string | string[] | number) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  }, []);

  if (!poll) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.topBar}>
          <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={MD3.onSurface} />
          </TouchableOpacity>
        </View>
        <View style={s.emptyBox}>
          <Ionicons name="bar-chart-outline" size={56} color={MD3.onSurfaceVariant} />
          <Text style={s.emptyText}>투표를 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(poll.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
    ongoing: { label: '진행 중', color: MD3.success, bg: MD3.tertiaryContainer },
    ended: { label: '종료', color: MD3.onSurfaceVariant, bg: MD3.surfaceVariant },
    upcoming: { label: '예정', color: MD3.primary, bg: MD3.primaryContainer },
  };
  const sm = STATUS_META[poll.status];

  const requiredUnanswered = poll.questions
    .filter((q) => q.required)
    .filter((q) => {
      const a = answers[q.id];
      if (q.type === 'multiple') return !Array.isArray(a) || (a as string[]).length === 0;
      if (q.type === 'text') return false; // optional text
      return a === undefined || a === '' || a === 0;
    });

  const handleSubmit = () => {
    if (!isLoggedIn) {
      showAlert('로그인 필요', '투표 참여는 입주사 로그인 후 가능합니다.');
      return;
    }
    if (requiredUnanswered.length > 0) {
      showAlert('미응답 항목', `필수 문항 ${requiredUnanswered.length}개를 응답해 주세요.`);
      return;
    }
    showAlert(
      '투표 제출',
      '응답을 제출하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '제출',
          onPress: () => {
            setSubmitted(true);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Top App Bar */}
      <View style={s.topBar}>
        <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={MD3.onSurface} />
        </TouchableOpacity>
        <Text style={s.topTitle} numberOfLines={1}>설문/투표</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <M3Card variant="filled" style={[s.heroCard, { backgroundColor: MD3.primaryContainer }]}>
          <View style={s.heroTop}>
            <View style={[s.statusBadge, { backgroundColor: sm.bg }]}>
              <View style={[s.statusDot, { backgroundColor: sm.color }]} />
              <Text style={[s.statusText, { color: sm.color }]}>{sm.label}</Text>
            </View>
            <View style={s.catBadge}>
              <Text style={s.catText}>{poll.category}</Text>
            </View>
          </View>

          <Text style={s.heroTitle}>{poll.title}</Text>
          <Text style={s.heroDesc}>{poll.description}</Text>

          <View style={s.heroMeta}>
            <View style={s.metaItem}>
              <Ionicons name="people-outline" size={15} color={MD3.onPrimaryContainer} />
              <Text style={s.metaText}>{poll.totalParticipants + (submitted ? 1 : 0)}명 참여</Text>
            </View>
            <View style={s.metaItem}>
              <Ionicons name="calendar-outline" size={15} color={MD3.onPrimaryContainer} />
              <Text style={s.metaText}>{poll.endDate}까지</Text>
            </View>
            {poll.status === 'ongoing' && daysLeft > 0 && (
              <View style={s.metaItem}>
                <Ionicons name="time-outline" size={15} color={MD3.onPrimaryContainer} />
                <Text style={s.metaText}>D-{daysLeft}</Text>
              </View>
            )}
            {poll.isAnonymous && (
              <View style={s.metaItem}>
                <Ionicons name="eye-off-outline" size={15} color={MD3.onPrimaryContainer} />
                <Text style={s.metaText}>익명</Text>
              </View>
            )}
          </View>
        </M3Card>

        {/* 제출 완료 배너 */}
        {submitted && (
          <View style={s.successBanner}>
            <Ionicons name="checkmark-circle" size={22} color={MD3.success} />
            <Text style={s.successText}>참여해 주셔서 감사합니다!</Text>
            {poll.showResults
              ? <Text style={s.successSub}>아래에서 결과를 확인하세요.</Text>
              : <Text style={s.successSub}>결과는 종료 후 공개됩니다.</Text>
            }
          </View>
        )}

        {/* 결과 비공개 && 종료 전 && 미제출 안내 */}
        {!submitted && !showResult && poll.status === 'ongoing' && (
          <View style={s.infoBanner}>
            <Ionicons name="information-circle-outline" size={16} color={MD3.primary} />
            <Text style={s.infoText}>
              {poll.isAnonymous ? '익명으로 참여됩니다. ' : ''}
              {poll.showResults ? '제출 후 결과를 확인할 수 있습니다.' : '결과는 투표 종료 후 공개됩니다.'}
            </Text>
          </View>
        )}

        {/* 문항 목록 */}
        <View style={s.questions}>
          <Text style={s.qLabel}>
            {poll.questions.length}개 문항
            {!showResult && poll.questions.some((q) => q.required) && (
              <Text style={{ color: MD3.error }}> (* 필수)</Text>
            )}
          </Text>
          {poll.questions.map((q, i) => (
            <QuestionBlock
              key={q.id}
              question={q}
              index={i}
              answer={answers[q.id]}
              onChange={(val) => handleAnswer(q.id, val)}
              showResult={!!showResult && (poll.showResults || poll.status === 'ended')}
            />
          ))}
        </View>

        {/* 투표하기 버튼 */}
        {!submitted && poll.status === 'ongoing' && (
          <View style={s.submitArea}>
            <M3Button
              label={`투표하기 (${poll.questions.filter((q) => q.required).length - requiredUnanswered.length}/${poll.questions.filter((q) => q.required).length} 응답)`}
              onPress={handleSubmit}
              disabled={requiredUnanswered.length > 0}
              style={s.submitBtn}
            />
            <Text style={s.submitHint}>필수 항목을 모두 응답해야 제출할 수 있습니다.</Text>
          </View>
        )}

        {poll.status === 'ended' && (
          <View style={s.endedBanner}>
            <Ionicons name="lock-closed-outline" size={18} color={MD3.onSurfaceVariant} />
            <Text style={s.endedText}>종료된 투표입니다.</Text>
          </View>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
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
  topTitle: { fontSize: 18, fontWeight: '500', color: MD3.onSurface, flex: 1, textAlign: 'center' },
  scroll: { flex: 1 },
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyText: { fontSize: 16, color: MD3.onSurfaceVariant },

  // Hero
  heroCard: { margin: 16 },
  heroTop: { flexDirection: 'row', gap: 8, padding: 20, paddingBottom: 0 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  catBadge: {
    backgroundColor: `${MD3.primary}25`,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  catText: { fontSize: 12, color: MD3.primary, fontWeight: '600' },
  heroTitle: { fontSize: 22, fontWeight: '600', color: MD3.onPrimaryContainer, padding: 20, paddingTop: 14, paddingBottom: 8, lineHeight: 30 },
  heroDesc: { fontSize: 14, color: MD3.onPrimaryContainer, opacity: 0.8, paddingHorizontal: 20, lineHeight: 21, paddingBottom: 16 },
  heroMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20, paddingBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 13, color: MD3.onPrimaryContainer, opacity: 0.8 },

  // Banners
  successBanner: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    backgroundColor: MD3.tertiaryContainer,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
  },
  successText: { fontSize: 16, fontWeight: '700', color: MD3.onTertiaryContainer },
  successSub: { fontSize: 13, color: MD3.onTertiaryContainer, opacity: 0.8 },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: MD3.primaryContainer,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  infoText: { fontSize: 13, color: MD3.onPrimaryContainer, flex: 1, lineHeight: 19 },

  // Questions
  questions: { paddingHorizontal: 16, marginTop: 8 },
  qLabel: { fontSize: 14, fontWeight: '600', color: MD3.onSurfaceVariant, marginBottom: 14 },

  // Submit
  submitArea: { paddingHorizontal: 16, marginTop: 8 },
  submitBtn: { width: '100%' },
  submitHint: { fontSize: 12, color: MD3.onSurfaceVariant, textAlign: 'center', marginTop: 8 },

  endedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: MD3.surfaceVariant,
    marginTop: 8,
  },
  endedText: { fontSize: 14, color: MD3.onSurfaceVariant },
});
