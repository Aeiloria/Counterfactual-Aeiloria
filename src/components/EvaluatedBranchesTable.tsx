/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EvaluatedBranchResult, SimulationBranch, MatchType, ConvergenceTrajectory } from '../types/simulation';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Shuffle,
  ChevronDown,
  ChevronUp,
  Layers,
  HelpCircle,
  FileText,
  AlertCircle,
  Clock,
  Sliders,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface EvaluatedBranchesTableProps {
  evaluatedBranches: EvaluatedBranchResult[];
  branches: SimulationBranch[];
  survivingBranchId: string;
  selectedBranchId: string;
  onSelectBranch: (id: string) => void;
  onOpenLedger: (branchId: string) => void;
}

export const EvaluatedBranchesTable: React.FC<EvaluatedBranchesTableProps> = ({
  evaluatedBranches,
  branches,
  survivingBranchId,
  selectedBranchId,
  onSelectBranch,
  onOpenLedger
}) => {
  const [expandedBranchIds, setExpandedBranchIds] = useState<Record<string, boolean>>({
    [selectedBranchId]: true
  });

  const toggleExpand = (id: string) => {
    setExpandedBranchIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getMatchTypeBadge = (type: MatchType) => {
    switch (type) {
      case 'exact':
        return { label: 'Exact Match', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'strong':
        return { label: 'Strong Match', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      case 'partial':
        return { label: 'Partial Match', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'weak':
        return { label: 'Weak Match', bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40' };
      case 'divergent':
        return { label: 'Divergent', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'unsupported':
      default:
        return { label: 'Unsupported', bg: 'bg-slate-500/20 text-slate-400 border-slate-500/40' };
    }
  };

  const getTrajectoryBadge = (trajectory: ConvergenceTrajectory) => {
    switch (trajectory) {
      case 'strengthening':
        return {
          label: 'Strengthening',
          icon: <TrendingUp className="w-3 h-3 text-emerald-400" />,
          color: 'text-emerald-400'
        };
      case 'weakening':
        return {
          label: 'Weakening',
          icon: <TrendingDown className="w-3 h-3 text-rose-400" />,
          color: 'text-rose-400'
        };
      case 'erratic':
        return {
          label: 'Erratic',
          icon: <Shuffle className="w-3 h-3 text-amber-400" />,
          color: 'text-amber-400'
        };
      case 'stable':
      default:
        return {
          label: 'Stable',
          icon: <Minus className="w-3 h-3 text-slate-400" />,
          color: 'text-slate-400'
        };
    }
  };

  const getConvergenceTierBadge = (tier?: string) => {
    switch (tier) {
      case 'direct':
        return { label: 'Direct Convergence', desc: 'Independent structural match to reference', color: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' };
      case 'derived':
        return { label: 'Derived Convergence', desc: 'Emergent properties leading to secondary match', color: 'bg-blue-500/15 border-blue-500/30 text-blue-300' };
      case 'metaphorical':
        return { label: 'Metaphorical Resemblance', desc: 'Superficial similarity without structural freedom', color: 'bg-amber-500/15 border-amber-500/30 text-amber-300' };
      case 'none':
      default:
        return { label: 'No Relationship', desc: 'Divergent or orthogonal trajectory', color: 'bg-slate-800 border-slate-700 text-slate-400' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide font-mono uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Evaluated Branches Comparator Ledger ({evaluatedBranches.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict machine evaluation per specification schema: score, trajectory, evidence, and alternative hypotheses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {evaluatedBranches.map(result => {
          const branchMeta = branches.find(b => b.branch_id === result.branch_id);
          const isSurviving = result.branch_id === survivingBranchId;
          const isSelected = result.branch_id === selectedBranchId;
          const isExpanded = !!expandedBranchIds[result.branch_id];
          const matchBadge = getMatchTypeBadge(result.match_type);
          const trajBadge = getTrajectoryBadge(result.convergence_trajectory);
          const tierBadge = getConvergenceTierBadge(result.convergence_classification);

          return (
            <div
              key={`eval-card-${result.branch_id}`}
              className={`rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-cyan-500/60 bg-slate-900/90 ring-1 ring-cyan-500/30 shadow-xl shadow-cyan-950/20'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              {/* Header bar */}
              <div
                className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60"
                onClick={() => {
                  onSelectBranch(result.branch_id);
                  toggleExpand(result.branch_id);
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: branchMeta?.color || '#3b82f6' }}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-base text-slate-100">
                        {result.branch_id}
                      </span>
                      {isSurviving && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          PRIMARY SURVIVING BRANCH
                        </span>
                      )}
                      {branchMeta?.status === 'extinct' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          EXTINCT @ T={branchMeta.extinction_step}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${matchBadge.bg}`}>
                        {matchBadge.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${tierBadge.color}`}>
                        {tierBadge.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {branchMeta?.name || 'Simulation Branch'}
                      <span className="mx-2 text-slate-600">•</span>
                      <span className="font-mono text-slate-500">
                        Bifurcation Origin: T={result.bifurcation_origin_step}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Trajectory KPI block */}
                <div className="flex items-center gap-6 shrink-0 self-end md:self-auto">
                  {/* Convergence Score Meter */}
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Convergence Score
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            result.convergence_score >= 0.85
                              ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                              : result.convergence_score >= 0.60
                              ? 'bg-cyan-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.round(result.convergence_score * 100)}%` }}
                        />
                      </div>
                      <span className={`font-mono text-lg font-bold ${
                        result.convergence_score >= 0.85
                          ? 'text-emerald-400'
                          : result.convergence_score >= 0.60
                          ? 'text-cyan-400'
                          : 'text-amber-400'
                      }`}>
                        {result.convergence_score.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Trajectory */}
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Trajectory
                    </div>
                    <div className="flex items-center gap-1 font-mono text-xs font-semibold">
                      {trajBadge.icon}
                      <span className={trajBadge.color}>{trajBadge.label}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(result.branch_id);
                    }}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Body with Detailed Evidence & Schema Fields */}
              {isExpanded && (
                <div className="p-4 space-y-4 text-xs font-mono bg-slate-950/40">
                  {/* Metadata Row: Earliest timestep, turning point, parameter deltas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Earliest Convergent Timestep */}
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Earliest Convergent Timestep</span>
                      </div>
                      <div className="text-slate-200 font-bold text-sm">
                        {result.earliest_convergent_timestep !== null ? (
                          <span className="text-emerald-400">
                            T={result.earliest_convergent_timestep} (Crossed Spec)
                          </span>
                        ) : (
                          <span className="text-slate-500 font-normal">None (Threshold unreached)</span>
                        )}
                      </div>
                    </div>

                    {/* Divergence Turning Point */}
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Divergence Turning Point</span>
                      </div>
                      <div className="text-slate-200 font-bold text-sm">
                        {result.divergence_turning_point !== null ? (
                          <span className="text-amber-400">
                            T={result.divergence_turning_point} (Trajectory Decoupling)
                          </span>
                        ) : (
                          <span className="text-slate-500 font-normal">None (No abrupt reversal)</span>
                        )}
                      </div>
                    </div>

                    {/* Parameter Deltas */}
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                        <Sliders className="w-3.5 h-3.5 text-purple-400" />
                        <span>Bifurcation Parameter Deltas</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(result.parameter_deltas || {}).map(([key, val]) => (
                          <span
                            key={key}
                            className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]"
                          >
                            {key}: <span className="text-cyan-300">{String(val)}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Key Structural Evidence (Rule 2 & Schema) */}
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Key Structural Evidence ({result.key_structural_evidence.length})
                      </span>
                      <button
                        onClick={() => onOpenLedger(result.branch_id)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        Inspect Immutable Raw Logs (Rule 1)
                      </button>
                    </div>
                    <ul className="space-y-1.5">
                      {result.key_structural_evidence.map((ev, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-xs">
                          <span className="text-cyan-400 select-none">▸</span>
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Alternative Explanations & Counter-Hypotheses (Rule 3) */}
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      Alternative Explanations & Resemblance Audits ({result.alternative_explanations.length})
                    </span>
                    <ul className="space-y-1.5">
                      {result.alternative_explanations.map((alt, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-xs">
                          <span className="text-amber-400 select-none">⋄</span>
                          <span>{alt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
