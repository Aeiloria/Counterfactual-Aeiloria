/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ComparativeVerdict,
  ComparatorOutput,
  SimulationBranch,
  SealedReferenceSpecification
} from '../types/simulation';
import { calculateBranchSensitivity } from '../services/analyticalEngine';
import {
  Sparkles,
  AlertTriangle,
  GitFork,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Gauge,
  Sliders,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  ArrowRight
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
}

export const SummaryVerdictCard: React.FC<SummaryVerdictCardProps> = ({
  comparatorOutput,
  isLoading,
  onRunLiveEvaluation,
  chosenBranch,
  survivingBranch,
  allBranches,
  sealedRef,
  onSelectChosenBranch
}) => {
  const { summary_conclusion, comparative_analysis, evaluator_engine } = comparatorOutput;

  // Perturbation ratio state (default 5%)
  const [perturbationRatio, setPerturbationRatio] = useState<number>(0.05);

  // Calculate dynamic sensitivity metric for the chosen branch relative to surviving branch
  const sensitivityMetric = useMemo(() => {
    return calculateBranchSensitivity(
      chosenBranch,
      survivingBranch,
      sealedRef,
      perturbationRatio
    );
  }, [chosenBranch, survivingBranch, sealedRef, perturbationRatio]);

  const getVerdictConfig = (verdict: ComparativeVerdict) => {
    switch (verdict) {
      case 'DIVERGENT_BRANCH_SUPERIOR':
        return {
          title: 'DIVERGENT BRANCH SUPERIOR',
          tagline: 'An alternate/extinct branch achieved closer convergence than the surviving world.',
          color: 'from-amber-500/20 via-orange-500/10 to-amber-950/30',
          borderColor: 'border-amber-500/40',
          textColor: 'text-amber-400',
          badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
          icon: <GitFork className="w-6 h-6 text-amber-400 animate-pulse" />
        };
      case 'SURVIVING_BRANCH_OPTIMAL':
        return {
          title: 'SURVIVING BRANCH OPTIMAL',
          tagline: 'The primary survival run matches the sealed target specification best.',
          color: 'from-emerald-500/20 via-teal-500/10 to-emerald-950/30',
          borderColor: 'border-emerald-500/40',
          textColor: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        };
      case 'INDEPENDENT_MULTIPLE_CONVERGENCE':
        return {
          title: 'INDEPENDENT MULTIPLE CONVERGENCE',
          tagline: 'Multiple separate branches independently struck the sealed target signatures.',
          color: 'from-purple-500/20 via-indigo-500/10 to-violet-950/30',
          borderColor: 'border-purple-500/40',
          textColor: 'text-purple-400',
          badgeBg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
          icon: <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
        };
      case 'SYSTEMIC_DIVERGENCE':
      default:
        return {
          title: 'SYSTEMIC DIVERGENCE',
          tagline: 'No evaluated branch converged meaningfully to the sealed Freedom specification.',
          color: 'from-rose-500/20 via-red-500/10 to-rose-950/30',
          borderColor: 'border-rose-500/40',
          textColor: 'text-rose-400',
          badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
          icon: <AlertTriangle className="w-6 h-6 text-rose-400" />
        };
    }
  };

  const config = getVerdictConfig(summary_conclusion);

  const getStabilityBadge = (stability: string) => {
    switch (stability) {
      case 'fragile_tipping_point':
        return {
          label: 'Fragile Tipping Point',
          bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
          desc: 'High sensitivity; volatile critical boundary'
        };
      case 'elastic_adaptive_zone':
        return {
          label: 'Elastic Adaptive Zone',
          bg: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300',
          desc: 'Moderate sensitivity; adaptive equilibrium'
        };
      case 'resilient_attractor_basin':
      default:
        return {
          label: 'Resilient Attractor Basin',
          bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
          desc: 'Low sensitivity; deeply locked stability'
        };
    }
  };

  const stabilityConfig = getStabilityBadge(sensitivityMetric.basin_stability);

  return (
    <div className={`relative overflow-hidden rounded-xl border ${config.borderColor} bg-gradient-to-r ${config.color} p-5 backdrop-blur-md shadow-2xl transition-all duration-300 space-y-5`}>
      {/* Decorative background grid elements */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -top-10 w-64 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header: Verdict & Primary Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-700/60 shadow-inner">
            {config.icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
                Pipeline Comparative Verdict
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-mono font-semibold rounded border ${config.badgeBg}`}>
                {summary_conclusion}
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800/80 border border-slate-700 text-slate-300">
                <Cpu className="w-3 h-3 text-cyan-400" />
                {evaluator_engine === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Analytical Engine'}
              </span>
            </div>
            <h2 className={`text-xl md:text-2xl font-bold tracking-tight font-sans ${config.textColor}`}>
              {config.title}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
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

      {/* NEW: Comparative Parameter Sensitivity Metric Section */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-950/70 p-4 backdrop-blur-md shadow-inner space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                  Comparative Parameter Sensitivity Metric
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  ∂Convergence / ∂θ
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Measures score displacement relative to small parameter shifts in chosen branch vs surviving baseline.
              </p>
            </div>
          </div>

          {/* Controls: Branch Switcher & Perturbation Magnitude */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Chosen Branch Picker */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
              <span className="text-slate-400 text-[11px]">Chosen:</span>
              <select
                value={chosenBranch.branch_id}
                onChange={e => onSelectChosenBranch(e.target.value)}
                className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
                aria-label="Chosen Branch for Sensitivity"
              >
                {allBranches.map(b => (
                  <option key={b.branch_id} value={b.branch_id} className="bg-slate-900 text-slate-200">
                    {b.branch_id} ({b.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Perturbation Shift Magnitude Pill Selector */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-[11px]">
              <span className="text-slate-500 px-1.5 select-none">Shift:</span>
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
                      ? 'bg-cyan-600/40 text-cyan-200 border border-cyan-500/50 font-bold'
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
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider">
              Sensitivity Gradient
            </span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-xl font-bold text-cyan-300">
                ±{sensitivityMetric.overall_sensitivity_score.toFixed(3)}
              </span>
              <span className="text-[11px] text-slate-400">
                / {sensitivityMetric.perturbation_pct}% shift
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              Mean absolute score delta on parameter perturbation
            </div>
          </div>

          {/* KPI 2: Comparative Ratio vs Surviving */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider">
              Comparative Ratio vs Surviving
            </span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className={`text-xl font-bold ${
                sensitivityMetric.comparative_ratio_to_surviving >= 2.0
                  ? 'text-amber-400'
                  : sensitivityMetric.comparative_ratio_to_surviving <= 1.0
                  ? 'text-emerald-400'
                  : 'text-cyan-300'
              }`}>
                {sensitivityMetric.comparative_ratio_to_surviving.toFixed(1)}x
              </span>
              <span className="text-[11px] text-slate-400">
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
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider">
              Basin Stability
            </span>
            <div className="my-1">
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${stabilityConfig.bg}`}>
                {stabilityConfig.label}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {stabilityConfig.desc}
            </div>
          </div>

          {/* KPI 4: Projected Score Interval */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider">
              Projected Convergence Range
            </span>
            <div className="flex items-center justify-between text-xs font-bold my-1">
              <span className="text-rose-400">
                {sensitivityMetric.projected_score_range.minus_shift.toFixed(2)}
              </span>
              <span className="text-slate-500 font-normal">←</span>
              <span className="text-cyan-300 underline underline-offset-2">
                {sensitivityMetric.projected_score_range.baseline.toFixed(2)}
              </span>
              <span className="text-slate-500 font-normal">→</span>
              <span className="text-emerald-400">
                {sensitivityMetric.projected_score_range.plus_shift.toFixed(2)}
              </span>
            </div>
            {/* Visual range bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-rose-500/60 h-full"
                style={{ width: `${Math.round(sensitivityMetric.projected_score_range.minus_shift * 100)}%` }}
              />
              <div
                className="bg-cyan-400 h-full"
                style={{ width: `${Math.round((sensitivityMetric.projected_score_range.plus_shift - sensitivityMetric.projected_score_range.minus_shift) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Parameter Drivers Breakdown */}
        {sensitivityMetric.parameter_breakdown.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
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
                  className="p-2 rounded bg-slate-900/60 border border-slate-800/80 text-[11px] font-mono flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-slate-300 truncate font-semibold" title={param.parameter_name}>
                      {param.parameter_name}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      param.direction === 'positive'
                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                        : 'text-amber-400 bg-amber-950/60 border border-amber-500/30'
                    }`}>
                      {param.direction === 'positive' ? `+${param.delta_impact.toFixed(3)}` : `-${param.delta_impact.toFixed(3)}`}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate" title={param.explanation}>
                    {param.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Verification Row */}
      <div className="pt-2 border-t border-slate-700/40 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Rule 1: Raw History Untouched
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">
            Rule 2: Divergence Preserved as Valid Data
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">
            Rule 3: 4-Tier Convergence Taxonomy Enforced
          </span>
        </div>
        <div className="text-slate-400 flex items-center gap-1">
          <span className="text-slate-500">Active Benchmark:</span>
          <span className="text-purple-300 font-bold">SPEC-FREEDOM-7A</span>
        </div>
      </div>
    </div>
  );
};
