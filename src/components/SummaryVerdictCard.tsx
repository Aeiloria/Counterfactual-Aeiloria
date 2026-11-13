/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ComparativeVerdict,
  ComparatorOutput,
  SimulationBranch,
  SealedReferenceSpecification,
  CriticalThresholdAlert
} from '../types/simulation';
import { calculateBranchSensitivity } from '../services/analyticalEngine';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  AlertTriangle,
  GitFork,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Gauge,
  Sliders,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Radio,
  Flame,
  Check
} from 'lucide-react';

interface SummaryVerdictCardProps {
  comparatorOutput: ComparatorOutput;
  isLoading: boolean;
  onRunLiveEvaluation: () => void;
  chosenBranch: SimulationBranch;
  survivingBranch: SimulationBranch;
  allBranches: SimulationBranch[];
  sealedRef: SealedReferenceSpecification;
  onSelectChosenBranch: (branchId: string) => void;
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

export const SummaryVerdictCard: React.FC<SummaryVerdictCardProps> = ({
  comparatorOutput,
  isLoading,
  onRunLiveEvaluation,
  chosenBranch,
  survivingBranch,
  allBranches,
  sealedRef,
  onSelectChosenBranch,
  currentStep = 0,
  onStepChange
}) => {
  const { isLight } = useTheme();
  const { summary_conclusion, comparative_analysis, evaluator_engine } = comparatorOutput;

  // Perturbation ratio state (default 5%)
  const [perturbationRatio, setPerturbationRatio] = useState<number>(0.05);

  // Real-time Notification System States
  const [criticalThreshold, setCriticalThreshold] = useState<number>(0.60);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState<boolean>(false);
  const [alertFilter, setAlertFilter] = useState<'all' | 'chosen'>('all');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(new Set());
  const lastAlertStepRef = useRef<number | null>(null);

  // Play audio synth beep
  const playAlertBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // ignore
    }
  };

  // Calculate dynamic sensitivity metric for the chosen branch relative to surviving branch
  const sensitivityMetric = useMemo(() => {
    return calculateBranchSensitivity(
      chosenBranch,
      survivingBranch,
      sealedRef,
      perturbationRatio
    );
  }, [chosenBranch, survivingBranch, sealedRef, perturbationRatio]);

  // Generate All Critical Threshold Alerts across all branches
  const detectedAlerts: CriticalThresholdAlert[] = useMemo(() => {
    const alerts: CriticalThresholdAlert[] = [];
    const thresholds = sealedRef.thresholds;

    allBranches.forEach(branch => {
      let previousScore: number | null = null;

      branch.state_history.forEach(snap => {
        // Calculate snapshot score relative to sealed Freedom specification
        const a = Math.min(1.0, snap.autonomy_index / thresholds.autonomy_index);
        const c = Math.min(1.0, snap.coercion_resistance / thresholds.coercion_resistance);
        const d = Math.min(1.0, snap.decentralized_sovereignty / thresholds.decentralized_sovereignty);
        const e = Math.min(1.0, snap.cognitive_emancipation / thresholds.cognitive_emancipation);
        const t = Math.min(1.0, snap.teleological_coherence / thresholds.teleological_coherence);
        const snapScore = Number((a * 0.25 + c * 0.25 + d * 0.25 + e * 0.15 + t * 0.10).toFixed(3));

        const isExtinctionStep = branch.extinction_step !== null && snap.step === branch.extinction_step;
        const isFloorBreach = snapScore < criticalThreshold;
        const isRapidPlunge = previousScore !== null && (previousScore - snapScore) >= 0.14;

        if (isExtinctionStep || isFloorBreach || isRapidPlunge) {
          let triggerType: 'floor_breach' | 'rapid_collapse' | 'extinction_terminal' = 'floor_breach';
          let deficitSummary = `Convergence (${snapScore.toFixed(2)}) breached critical floor (${criticalThreshold.toFixed(2)}).`;

          if (isExtinctionStep) {
            triggerType = 'extinction_terminal';
            deficitSummary = `Terminal extinction reached. Socio-computational substrate collapsed at T=${snap.step}.`;
          } else if (isRapidPlunge) {
            triggerType = 'rapid_collapse';
            deficitSummary = `Sudden trajectory plunge detected: score dropped from ${previousScore?.toFixed(2)} to ${snapScore.toFixed(2)}.`;
          } else {
            // Find biggest deficit
            if (snap.autonomy_index < thresholds.autonomy_index * 0.7) {
              deficitSummary += ` Critical Autonomy deficit (${snap.autonomy_index.toFixed(2)} vs ≥${thresholds.autonomy_index}).`;
            } else if (snap.decentralized_sovereignty < thresholds.decentralized_sovereignty * 0.7) {
              deficitSummary += ` Polycentric sovereignty failure (${snap.decentralized_sovereignty.toFixed(2)} vs ≥${thresholds.decentralized_sovereignty}).`;
            }
          }

          alerts.push({
            id: `alert-${branch.branch_id}-${snap.step}-${triggerType}`,
            branch_id: branch.branch_id,
            branch_name: branch.name,
            branch_color: branch.color,
            step: snap.step,
            trigger_type: triggerType,
            score: snapScore,
            threshold: criticalThreshold,
            prior_score: previousScore !== null ? previousScore : undefined,
            deficit_summary: deficitSummary,
            severity: isExtinctionStep || snapScore < 0.40 ? 'emergency' : 'critical',
            timestamp: `Sim-Epoch T=${snap.step}`
          });
        }

        previousScore = snapScore;
      });
    });

    return alerts.sort((a, b) => b.step - a.step);
  }, [allBranches, sealedRef, criticalThreshold]);

  // Filter active alerts excluding dismissed ones
  const activeAlerts = useMemo(() => {
    return detectedAlerts.filter(a => !dismissedAlertIds.has(a.id));
  }, [detectedAlerts, dismissedAlertIds]);

  const filteredAlerts = useMemo(() => {
    if (alertFilter === 'chosen') {
      return activeAlerts.filter(a => a.branch_id === chosenBranch.branch_id);
    }
    return activeAlerts;
  }, [activeAlerts, alertFilter, chosenBranch.branch_id]);

  // Live Sentinel Breach at currentStep
  const liveBreachAtCurrentStep = useMemo(() => {
    // Find if the currently inspected step matches an active alert on the chosen branch or any branch
    return activeAlerts.find(
      a => Math.abs(a.step - currentStep) <= 20 && (a.branch_id === chosenBranch.branch_id || alertFilter === 'all')
    );
  }, [activeAlerts, currentStep, chosenBranch.branch_id, alertFilter]);

  // Audio trigger on newly encountered live breach during timeline playback
  useEffect(() => {
    if (audioEnabled && liveBreachAtCurrentStep && lastAlertStepRef.current !== liveBreachAtCurrentStep.step) {
      lastAlertStepRef.current = liveBreachAtCurrentStep.step;
      playAlertBeep();
    }
  }, [audioEnabled, liveBreachAtCurrentStep]);

  const handleDismissAlert = (id: string) => {
    setDismissedAlertIds(prev => new Set(prev).add(id));
  };

  const handleClearAllAlerts = () => {
    const allIds = new Set(detectedAlerts.map(a => a.id));
    setDismissedAlertIds(allIds);
  };

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    if (next) {
      playAlertBeep(); // test beep
    }
  };

  const getVerdictConfig = (verdict: ComparativeVerdict) => {
    switch (verdict) {
      case 'DIVERGENT_BRANCH_SUPERIOR':
        return {
          title: 'DIVERGENT BRANCH SUPERIOR',
          tagline: 'An alternate/extinct branch achieved closer convergence than the surviving world.',
          color: isLight
            ? 'from-amber-50 via-white to-orange-50/50'
            : 'from-amber-500/20 via-orange-500/10 to-amber-950/30',
          borderColor: isLight ? 'border-amber-300 shadow-md' : 'border-amber-500/40',
          textColor: isLight ? 'text-amber-900' : 'text-amber-400',
          badgeBg: isLight
            ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
            : 'bg-amber-500/15 border-amber-500/30 text-amber-300',
          icon: <GitFork className={`w-6 h-6 ${isLight ? 'text-amber-600' : 'text-amber-400'} animate-pulse`} />
        };
      case 'SURVIVING_BRANCH_OPTIMAL':
        return {
          title: 'SURVIVING BRANCH OPTIMAL',
          tagline: 'The primary survival run matches the sealed target specification best.',
          color: isLight
            ? 'from-emerald-50 via-white to-teal-50/50'
            : 'from-emerald-500/20 via-teal-500/10 to-emerald-950/30',
          borderColor: isLight ? 'border-emerald-300 shadow-md' : 'border-emerald-500/40',
          textColor: isLight ? 'text-emerald-900' : 'text-emerald-400',
          badgeBg: isLight
            ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
          icon: <CheckCircle2 className={`w-6 h-6 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
        };
      case 'INDEPENDENT_MULTIPLE_CONVERGENCE':
        return {
          title: 'INDEPENDENT MULTIPLE CONVERGENCE',
          tagline: 'Multiple separate branches independently struck the sealed target signatures.',
          color: isLight
            ? 'from-purple-50 via-white to-indigo-50/50'
            : 'from-purple-500/20 via-indigo-500/10 to-violet-950/30',
          borderColor: isLight ? 'border-purple-300 shadow-md' : 'border-purple-500/40',
          textColor: isLight ? 'text-purple-900' : 'text-purple-400',
          badgeBg: isLight
            ? 'bg-purple-100 border-purple-300 text-purple-900 font-bold'
            : 'bg-purple-500/15 border-purple-500/30 text-purple-300',
          icon: <Sparkles className={`w-6 h-6 ${isLight ? 'text-purple-600' : 'text-purple-400'} animate-pulse`} />
        };
      case 'SYSTEMIC_DIVERGENCE':
      default:
        return {
          title: 'SYSTEMIC DIVERGENCE',
          tagline: 'No evaluated branch converged meaningfully to the sealed Freedom specification.',
          color: isLight
            ? 'from-rose-50 via-white to-red-50/50'
            : 'from-rose-500/20 via-red-500/10 to-rose-950/30',
          borderColor: isLight ? 'border-rose-300 shadow-md' : 'border-rose-500/40',
          textColor: isLight ? 'text-rose-900' : 'text-rose-400',
          badgeBg: isLight
            ? 'bg-rose-100 border-rose-300 text-rose-900 font-bold'
            : 'bg-rose-500/15 border-rose-500/30 text-rose-300',
          icon: <AlertTriangle className={`w-6 h-6 ${isLight ? 'text-rose-600' : 'text-rose-400'}`} />
        };
    }
  };

  const config = getVerdictConfig(summary_conclusion);

  const getStabilityBadge = (stability: string) => {
    switch (stability) {
      case 'fragile_tipping_point':
        return {
          label: 'Fragile Tipping Point',
          bg: isLight ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-amber-950/80 border-amber-500/50 text-amber-300',
          desc: 'High sensitivity; volatile critical boundary'
        };
      case 'elastic_adaptive_zone':
        return {
          label: 'Elastic Adaptive Zone',
          bg: isLight ? 'bg-cyan-100 border-cyan-300 text-cyan-900' : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300',
          desc: 'Moderate sensitivity; adaptive equilibrium'
        };
      case 'resilient_attractor_basin':
      default:
        return {
          label: 'Resilient Attractor Basin',
          bg: isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
          desc: 'Low sensitivity; deeply locked stability'
        };
    }
  };

  const stabilityConfig = getStabilityBadge(sensitivityMetric.basin_stability);

  return (
    <div className={`relative overflow-hidden rounded-xl border ${config.borderColor} bg-gradient-to-r ${config.color} p-5 backdrop-blur-md shadow-2xl transition-all duration-300 space-y-5`}>
      {/* Decorative background grid elements */}
      {!isLight && (
        <>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -top-10 w-64 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        </>
      )}

      {/* Top Header: Verdict, Live Alerts Bell & Re-Evaluate Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg border shadow-inner ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-700/60'
          }`}>
            {config.icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`text-[11px] font-mono tracking-wider uppercase ${isLight ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>
                Pipeline Comparative Verdict
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-mono font-semibold rounded border ${config.badgeBg}`}>
                {summary_conclusion}
              </span>
              <span className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded border ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}>
                <Cpu className={`w-3 h-3 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                {evaluator_engine === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Analytical Engine'}
              </span>

              {/* Real-time Notification Sentinel Trigger Badge */}
              <button
                onClick={() => setIsAlertDrawerOpen(!isAlertDrawerOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border transition-all cursor-pointer ${
                  activeAlerts.length > 0
                    ? isLight
                      ? 'bg-rose-100 border-rose-300 text-rose-900 shadow-xs'
                      : 'bg-rose-950/90 border-rose-500/60 text-rose-300 shadow-sm shadow-rose-950/40'
                    : isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-700'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}
                title="Toggle Real-time Critical Threshold Alerts"
              >
                <div className="relative">
                  <Bell className={`w-3.5 h-3.5 ${activeAlerts.length > 0 ? (isLight ? 'text-rose-600' : 'text-rose-400 animate-pulse') : ''}`} />
                  {activeAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </div>
                <span>
                  {activeAlerts.length > 0 ? `${activeAlerts.length} Critical Alerts` : 'Sentinel Clear'}
                </span>
                {isAlertDrawerOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <h2 className={`text-xl md:text-2xl font-bold tracking-tight font-sans ${config.textColor}`}>
              {config.title}
            </h2>
            <p className={`text-xs md:text-sm mt-1 max-w-3xl leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {comparative_analysis}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
          <button
            onClick={onRunLiveEvaluation}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 text-white font-mono text-xs font-semibold shadow-lg shadow-cyan-900/30 transition-all border border-cyan-400/30 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Evaluating Tree...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Re-Evaluate Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* LIVE BREACH ALERT BANNER (If currentStep has an active breach) */}
      {liveBreachAtCurrentStep && (
        <div className={`p-3.5 rounded-xl border animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg ${
          isLight
            ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-rose-900/10'
            : 'bg-rose-950/80 border-rose-500/70 text-rose-200 shadow-rose-950/40'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg shrink-0 border ${
              isLight ? 'bg-rose-100 border-rose-300 text-rose-700' : 'bg-rose-900 border-rose-500/60 text-rose-300'
            }`}>
              <AlertTriangle className="w-5 h-5 text-rose-500 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white uppercase text-[10px]">
                  LIVE CRITICAL BREACH @ T={liveBreachAtCurrentStep.step}
                </span>
                <span className="font-bold">{liveBreachAtCurrentStep.branch_id}</span>
                <span className="opacity-80">({liveBreachAtCurrentStep.branch_name})</span>
              </div>
              <p className="text-xs font-sans mt-0.5 font-medium leading-relaxed">
                {liveBreachAtCurrentStep.deficit_summary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center font-mono text-xs">
            {onStepChange && (
              <button
                onClick={() => onStepChange(liveBreachAtCurrentStep.step)}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white border-rose-300 text-rose-900 hover:bg-rose-50'
                    : 'bg-rose-900/80 border-rose-500 text-rose-100 hover:bg-rose-800'
                }`}
              >
                <span>Pin T={liveBreachAtCurrentStep.step}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => handleDismissAlert(liveBreachAtCurrentStep.id)}
              className="p-1 rounded hover:opacity-75 transition-opacity"
              title="Acknowledge alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* REAL-TIME NOTIFICATION DRAWER / FEED */}
      {isAlertDrawerOpen && (
        <div className={`p-4 rounded-xl border backdrop-blur-md space-y-3.5 transition-all animate-fade-in ${
          isLight
            ? 'bg-white/95 border-rose-300 shadow-md text-slate-900'
            : 'bg-slate-950/90 border-rose-500/50 shadow-2xl text-slate-100'
        }`}>
          {/* Drawer Toolbar */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md border ${
                isLight ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-rose-950 border-rose-500/50 text-rose-300'
              }`}>
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    Real-Time Critical Threshold Sentinel Feed
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isLight ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-rose-950/80 border-rose-500/30 text-rose-300'
                  }`}>
                    {filteredAlerts.length} Active Events
                  </span>
                </div>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Monitors state history snapshots where convergence breaches the minimum critical specification floor.
                </p>
              </div>
            </div>

            {/* Threshold & Audio Controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {/* Critical Floor Threshold Selector */}
              <div className={`flex items-center p-0.5 rounded-lg border text-[11px] ${
                isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
              }`}>
                <span className="px-1.5 text-slate-500 select-none">Floor:</span>
                {[
                  { label: '<0.50', val: 0.50 },
                  { label: '<0.60 (Nominal)', val: 0.60 },
                  { label: '<0.70 (Strict)', val: 0.70 }
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => setCriticalThreshold(opt.val)}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      criticalThreshold === opt.val
                        ? isLight
                          ? 'bg-rose-600 text-white font-bold'
                          : 'bg-rose-600/40 text-rose-200 border border-rose-500 font-bold'
                        : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Audio Toggle */}
              <button
                onClick={handleToggleAudio}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                  audioEnabled
                    ? isLight
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : isLight
                    ? 'bg-slate-100 text-slate-600 border-slate-300'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
                title={audioEnabled ? "Mute Sentinel Audio Alerts" : "Enable Sentinel Audio Alerts"}
              >
                {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{audioEnabled ? 'Audio: ON' : 'Audio: OFF'}</span>
              </button>

              {/* Filter */}
              <div className={`flex items-center p-0.5 rounded-lg border text-[11px] ${
                isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
              }`}>
                <button
                  onClick={() => setAlertFilter('all')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    alertFilter === 'all'
                      ? isLight ? 'bg-slate-200 text-slate-900 font-bold' : 'bg-slate-800 text-white font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  All Branches
                </button>
                <button
                  onClick={() => setAlertFilter('chosen')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    alertFilter === 'chosen'
                      ? isLight ? 'bg-slate-200 text-slate-900 font-bold' : 'bg-slate-800 text-white font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  {chosenBranch.branch_id}
                </button>
              </div>

              {/* Clear All */}
              {activeAlerts.length > 0 && (
                <button
                  onClick={handleClearAllAlerts}
                  className={`px-2 py-1 rounded text-[11px] underline cursor-pointer ${
                    isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Acknowledge All
                </button>
              )}
            </div>
          </div>

          {/* Alert Cards Feed List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {filteredAlerts.length === 0 ? (
              <div className={`p-4 rounded-lg text-center font-mono text-xs ${
                isLight ? 'bg-slate-50 text-slate-500 border border-slate-200' : 'bg-slate-900/60 text-slate-400 border border-slate-800'
              }`}>
                <Check className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                No active critical threshold breaches found under current criteria (Floor: &lt;{criticalThreshold.toFixed(2)}).
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded-lg border text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 hover:border-rose-300'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                      style={{ backgroundColor: alert.branch_color }}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                          {alert.branch_id}
                        </span>
                        <span className="text-slate-500">@ T={alert.step}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                          alert.trigger_type === 'extinction_terminal'
                            ? isLight ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-rose-950 text-rose-300 border-rose-500/40'
                            : alert.trigger_type === 'rapid_collapse'
                            ? isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-950 text-amber-300 border-amber-500/40'
                            : isLight ? 'bg-orange-100 text-orange-900 border-orange-300' : 'bg-orange-950 text-orange-300 border-orange-500/40'
                        }`}>
                          {alert.trigger_type === 'extinction_terminal'
                            ? 'EXTINCTION TERMINAL'
                            : alert.trigger_type === 'rapid_collapse'
                            ? 'RAPID TRAJECTORY DROP'
                            : 'CRITICAL FLOOR BREACH'}
                        </span>
                        <span className={`font-bold ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>
                          Score: {alert.score.toFixed(2)}
                        </span>
                      </div>
                      <p className={`text-[11px] font-sans mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        {alert.deficit_summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {onStepChange && (
                      <button
                        onClick={() => {
                          onStepChange(alert.step);
                          onSelectChosenBranch(alert.branch_id);
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] border font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                          isLight
                            ? 'bg-white border-slate-300 text-cyan-800 hover:bg-cyan-50'
                            : 'bg-slate-800 border-slate-700 text-cyan-300 hover:bg-slate-700'
                        }`}
                      >
                        <span>Jump T={alert.step}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDismissAlert(alert.id)}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title="Dismiss alert"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Comparative Parameter Sensitivity Metric Section */}
      <div className={`rounded-xl border p-4 backdrop-blur-md space-y-3.5 transition-colors ${
        isLight
          ? 'bg-white/90 border-slate-200 shadow-sm text-slate-900'
          : 'bg-slate-950/70 border-slate-700/60 shadow-inner text-slate-100'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 ${
          isLight ? 'border-slate-200' : 'border-slate-800/80'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md border ${
              isLight ? 'bg-cyan-50 border-cyan-300 text-cyan-700' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            }`}>
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}>
                  Comparative Parameter Sensitivity Metric
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  ∂Convergence / ∂θ
                </span>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Measures score displacement relative to small parameter shifts in chosen branch vs surviving baseline.
              </p>
            </div>
          </div>

          {/* Controls: Branch Switcher & Perturbation Magnitude */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Chosen Branch Picker */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-200'
            }`}>
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Chosen:</span>
              <select
                value={chosenBranch.branch_id}
                onChange={e => onSelectChosenBranch(e.target.value)}
                className={`bg-transparent font-bold focus:outline-none cursor-pointer ${
                  isLight ? 'text-cyan-800' : 'text-cyan-300'
                }`}
                aria-label="Chosen Branch for Sensitivity"
              >
                {allBranches.map(b => (
                  <option key={b.branch_id} value={b.branch_id} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-200'}>
                    {b.branch_id} ({b.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Perturbation Shift Magnitude Pill Selector */}
            <div className={`flex items-center p-0.5 rounded-lg border text-[11px] ${
              isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
            }`}>
              <span className="px-1.5 select-none text-slate-500">Shift:</span>
              {[
                { label: '±2.5%', val: 0.025 },
                { label: '±5.0%', val: 0.05 },
                { label: '±10%', val: 0.10 }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setPerturbationRatio(opt.val)}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    perturbationRatio === opt.val
                      ? isLight
                        ? 'bg-cyan-600 text-white font-bold shadow-xs'
                        : 'bg-cyan-600/40 text-cyan-200 border border-cyan-500/50 font-bold'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4-Column KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {/* KPI 1: Sensitivity Gradient */}
          <div className={`p-3 rounded-lg border flex flex-col justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <span className={`text-[11px] uppercase tracking-wider ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
              Sensitivity Gradient
            </span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className={`text-xl font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>
                ±{sensitivityMetric.overall_sensitivity_score.toFixed(3)}
              </span>
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                / {sensitivityMetric.perturbation_pct}% shift
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              Mean absolute score delta on parameter perturbation
            </div>
          </div>

          {/* KPI 2: Comparative Ratio vs Surviving */}
          <div className={`p-3 rounded-lg border flex flex-col justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <span className={`text-[11px] uppercase tracking-wider ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
              Comparative Ratio vs Surviving
            </span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className={`text-xl font-bold ${
                sensitivityMetric.comparative_ratio_to_surviving >= 2.0
                  ? isLight ? 'text-amber-700' : 'text-amber-400'
                  : sensitivityMetric.comparative_ratio_to_surviving <= 1.0
                  ? isLight ? 'text-emerald-700' : 'text-emerald-400'
                  : isLight ? 'text-cyan-700' : 'text-cyan-300'
              }`}>
                {sensitivityMetric.comparative_ratio_to_surviving.toFixed(1)}x
              </span>
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                vs {survivingBranch.branch_id}
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              {sensitivityMetric.comparative_ratio_to_surviving >= 1.5
                ? 'Significantly more volatile than baseline run'
                : 'Comparable elasticity to baseline run'}
            </div>
          </div>

          {/* KPI 3: Basin Stability */}
          <div className={`p-3 rounded-lg border flex flex-col justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <span className={`text-[11px] uppercase tracking-wider ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
              Basin Stability
            </span>
            <div className="my-1">
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${stabilityConfig.bg}`}>
                {stabilityConfig.label}
              </span>
            </div>
            <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {stabilityConfig.desc}
            </div>
          </div>

          {/* KPI 4: Projected Score Interval */}
          <div className={`p-3 rounded-lg border flex flex-col justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <span className={`text-[11px] uppercase tracking-wider ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
              Projected Convergence Range
            </span>
            <div className="flex items-center justify-between text-xs font-bold my-1">
              <span className={isLight ? 'text-rose-700' : 'text-rose-400'}>
                {sensitivityMetric.projected_score_range.minus_shift.toFixed(2)}
              </span>
              <span className="text-slate-400 font-normal">←</span>
              <span className={`underline underline-offset-2 ${isLight ? 'text-cyan-800' : 'text-cyan-300'}`}>
                {sensitivityMetric.projected_score_range.baseline.toFixed(2)}
              </span>
              <span className="text-slate-400 font-normal">→</span>
              <span className={isLight ? 'text-emerald-700' : 'text-emerald-400'}>
                {sensitivityMetric.projected_score_range.plus_shift.toFixed(2)}
              </span>
            </div>
            {/* Visual range bar */}
            <div className={`w-full h-1.5 rounded-full overflow-hidden flex ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
              <div
                className="bg-rose-500 h-full"
                style={{ width: `${Math.round(sensitivityMetric.projected_score_range.minus_shift * 100)}%` }}
              />
              <div
                className="bg-cyan-500 h-full"
                style={{ width: `${Math.round((sensitivityMetric.projected_score_range.plus_shift - sensitivityMetric.projected_score_range.minus_shift) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Parameter Drivers Breakdown */}
        {sensitivityMetric.parameter_breakdown.length > 0 && (
          <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
            <div className={`flex items-center justify-between text-[11px] font-mono mb-2 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <span className={`flex items-center gap-1.5 font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                <Sliders className={`w-3.5 h-3.5 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                Parameter Shift Leverage ({chosenBranch.branch_id})
              </span>
              <span className="text-slate-500">
                Effect on Convergence per ±{sensitivityMetric.perturbation_pct}% perturbation
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {sensitivityMetric.parameter_breakdown.map(param => (
                <div
                  key={param.parameter_name}
                  className={`p-2 rounded border text-[11px] font-mono flex flex-col justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`truncate font-semibold ${isLight ? 'text-slate-900' : 'text-slate-300'}`} title={param.parameter_name}>
                      {param.parameter_name}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      param.direction === 'positive'
                        ? isLight ? 'text-emerald-800 bg-emerald-50 border border-emerald-300' : 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                        : isLight ? 'text-amber-800 bg-amber-50 border border-amber-300' : 'text-amber-400 bg-amber-950/60 border border-amber-500/30'
                    }`}>
                      {param.direction === 'positive' ? `+${param.delta_impact.toFixed(3)}` : `-${param.delta_impact.toFixed(3)}`}
                    </span>
                  </div>
                  <div className={`text-[10px] truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`} title={param.explanation}>
                    {param.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Verification Row */}
      <div className={`pt-2 border-t flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono ${
        isLight ? 'border-slate-200 text-slate-600' : 'border-slate-700/40 text-slate-400'
      }`}>
        <div className="flex items-center gap-4 flex-wrap">
          <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            <ShieldCheck className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
            Rule 1: Raw History Untouched
          </span>
          <span className="text-slate-400">|</span>
          <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>
            Rule 2: Divergence Preserved as Valid Data
          </span>
          <span className="text-slate-400">|</span>
          <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>
            Rule 3: 4-Tier Convergence Taxonomy Enforced
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-500">Active Benchmark:</span>
          <span className={`font-bold ${isLight ? 'text-purple-800' : 'text-purple-300'}`}>SPEC-FREEDOM-7A</span>
        </div>
      </div>
    </div>
  );
};
