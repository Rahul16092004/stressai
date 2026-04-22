/**
 * Stress Prediction Engine — Explainable AI
 * --------------------------------------------------------------
 * A simple, transparent decision-tree-style scoring model.
 * Each behavioral input contributes a weighted score; we then
 * classify the total into Low / Medium / High stress and surface
 * per-feature contributions for explainability (XAI).
 */

export type StressLevel = "Low" | "Medium" | "High";

export interface StudentInput {
  studyHours: number;      // 0 - 12  (per day)
  sleepHours: number;      // 0 - 12  (per day)
  screenTime: number;      // 0 - 16  (per day, recreational)
  attendance: number;      // 0 - 100 (percentage)
}

export interface FeatureContribution {
  key: keyof StudentInput;
  label: string;
  /** Raw stress contribution score (0 - 100, higher = more stress). */
  score: number;
  /** Normalized importance (0 - 1) relative to the total. */
  importance: number;
  /** Human-readable explanation for this factor. */
  reason: string;
  /** Direction the input is pushing stress in. */
  impact: "raises" | "lowers" | "neutral";
}

export interface PredictionResult {
  level: StressLevel;
  /** Total stress score 0 - 100. */
  score: number;
  emoji: string;
  color: "low" | "medium" | "high";
  headline: string;
  contributions: FeatureContribution[];
  /** Top human-friendly insights ranked by impact. */
  insights: string[];
}

/* ---------- Per-feature scoring rules (decision-tree style) ---------- */

function scoreStudyHours(h: number): { score: number; reason: string; impact: FeatureContribution["impact"] } {
  if (h >= 9) return { score: 85, reason: `Studying ${h}h/day is excessive — strong burnout signal.`, impact: "raises" };
  if (h >= 7) return { score: 60, reason: `${h}h/day is heavy — moderate cognitive load.`, impact: "raises" };
  if (h >= 4) return { score: 25, reason: `${h}h/day is a healthy study load.`, impact: "lowers" };
  if (h >= 2) return { score: 35, reason: `Only ${h}h/day — possible deadline pressure later.`, impact: "raises" };
  return { score: 55, reason: `Very low study time (${h}h) — academic anxiety likely.`, impact: "raises" };
}

function scoreSleepHours(h: number): { score: number; reason: string; impact: FeatureContribution["impact"] } {
  if (h >= 8) return { score: 10, reason: `${h}h of sleep is excellent — strong recovery.`, impact: "lowers" };
  if (h >= 7) return { score: 25, reason: `${h}h of sleep is healthy.`, impact: "lowers" };
  if (h >= 6) return { score: 50, reason: `${h}h is borderline — slight sleep debt.`, impact: "raises" };
  if (h >= 4) return { score: 80, reason: `Only ${h}h of sleep — major stress amplifier.`, impact: "raises" };
  return { score: 95, reason: `Severe sleep deprivation (${h}h) — critical risk.`, impact: "raises" };
}

function scoreScreenTime(h: number): { score: number; reason: string; impact: FeatureContribution["impact"] } {
  if (h >= 10) return { score: 90, reason: `${h}h of screen time is excessive — heavy mental fatigue.`, impact: "raises" };
  if (h >= 7) return { score: 70, reason: `${h}h of screen time strongly contributes to stress.`, impact: "raises" };
  if (h >= 5) return { score: 45, reason: `${h}h is moderate — some attention drain.`, impact: "raises" };
  if (h >= 2) return { score: 20, reason: `${h}h is balanced screen usage.`, impact: "lowers" };
  return { score: 15, reason: `Very low screen time (${h}h) — minimal digital fatigue.`, impact: "lowers" };
}

function scoreAttendance(p: number): { score: number; reason: string; impact: FeatureContribution["impact"] } {
  if (p >= 90) return { score: 10, reason: `${p}% attendance — strong engagement keeps stress low.`, impact: "lowers" };
  if (p >= 75) return { score: 30, reason: `${p}% attendance is acceptable.`, impact: "lowers" };
  if (p >= 60) return { score: 60, reason: `${p}% attendance — falling behind raises pressure.`, impact: "raises" };
  if (p >= 40) return { score: 80, reason: `Low attendance (${p}%) — significant catch-up stress.`, impact: "raises" };
  return { score: 95, reason: `Very low attendance (${p}%) — academic risk is severe.`, impact: "raises" };
}

/* ----------------------- Main prediction ----------------------- */

export function predictStress(input: StudentInput): PredictionResult {
  const study = scoreStudyHours(input.studyHours);
  const sleep = scoreSleepHours(input.sleepHours);
  const screen = scoreScreenTime(input.screenTime);
  const attend = scoreAttendance(input.attendance);

  // Feature weights (sum = 1). Sleep & screen time are the strongest stress drivers.
  const weights = { studyHours: 0.25, sleepHours: 0.32, screenTime: 0.25, attendance: 0.18 };

  const weighted = [
    { key: "studyHours" as const, label: "Study Hours",  raw: study.score,  reason: study.reason,  impact: study.impact,   w: weights.studyHours },
    { key: "sleepHours" as const, label: "Sleep Hours",  raw: sleep.score,  reason: sleep.reason,  impact: sleep.impact,   w: weights.sleepHours },
    { key: "screenTime" as const, label: "Screen Time",  raw: screen.score, reason: screen.reason, impact: screen.impact,  w: weights.screenTime },
    { key: "attendance" as const, label: "Attendance",   raw: attend.score, reason: attend.reason, impact: attend.impact,  w: weights.attendance },
  ];

  const totalScore = Math.round(
    weighted.reduce((acc, f) => acc + f.raw * f.w, 0)
  );

  const totalImportanceRaw = weighted.reduce((acc, f) => acc + f.raw * f.w, 0) || 1;
  const contributions: FeatureContribution[] = weighted
    .map((f) => ({
      key: f.key,
      label: f.label,
      score: Math.round(f.raw),
      importance: (f.raw * f.w) / totalImportanceRaw,
      reason: f.reason,
      impact: f.impact,
    }))
    .sort((a, b) => b.importance - a.importance);

  let level: StressLevel;
  let emoji: string;
  let color: PredictionResult["color"];
  let headline: string;

  if (totalScore < 35) {
    level = "Low";
    emoji = "😌";
    color = "low";
    headline = "You're in a healthy zone — keep this rhythm.";
  } else if (totalScore < 65) {
    level = "Medium";
    emoji = "😐";
    color = "medium";
    headline = "Moderate stress — small changes can help a lot.";
  } else {
    level = "High";
    emoji = "😫";
    color = "high";
    headline = "High stress detected — prioritize recovery now.";
  }

  // Top-3 actionable insights, generated from the strongest contributors.
  const insights = contributions
    .slice(0, 3)
    .map((c) => {
      if (c.impact === "raises") return `${c.label} is contributing significantly to your stress — ${c.reason}`;
      return `${c.label} is helping reduce your stress — ${c.reason}`;
    });

  return { level, score: totalScore, emoji, color, headline, contributions, insights };
}

/* ----------------------- Trend datasets ----------------------- */
/**
 * Synthetic but smooth datasets that visualize how a single variable
 * affects predicted stress when others are held at healthy defaults.
 */
const baseline: StudentInput = { studyHours: 5, sleepHours: 7, screenTime: 4, attendance: 85 };

export function buildStudyVsStress() {
  return Array.from({ length: 13 }, (_, i) => ({
    value: i,
    stress: predictStress({ ...baseline, studyHours: i }).score,
  }));
}
export function buildSleepVsStress() {
  return Array.from({ length: 13 }, (_, i) => ({
    value: i,
    stress: predictStress({ ...baseline, sleepHours: i }).score,
  }));
}
export function buildScreenVsStress() {
  return Array.from({ length: 17 }, (_, i) => ({
    value: i,
    stress: predictStress({ ...baseline, screenTime: i }).score,
  }));
}
