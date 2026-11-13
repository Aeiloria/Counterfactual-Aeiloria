/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FreedomBondScenario, StateClassification } from '../../types/freedomBond';
import { FREEDOM_BOND_SCENARIOS } from '../../data/bondScenarios';
import { useTheme } from '../../context/ThemeContext';
import { Beaker, ChevronRight, CheckCircle2, AlertTriangle, Shield, Sliders } from 'lucide-react';

interface ScenarioSelectorProps {
  selectedScenarioId: string;
  onSelectScenario: (scenario: FreedomBondScenario) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  selectedScenarioId,
  onSelectScenario
}) => {
  const { isLight } = useTheme();

  const getClassificationBadge = (cls: StateClassification) => {
    switch (cls) {
      case 'SELF_SUSTAINING':
        return {
          label: 'SELF_SUSTAINING',
          badge: isLight
            ? 'bg-cyan-100 border-cyan-400 text-cyan-900 font-bold'
            : 'bg-cyan-950/90 border-cyan-500/60 text-cyan-300'
        };
      case 'FORCED':
        return {
          label: 'FORCED',
          badge: isLight
            ? 'bg-rose-100 border-rose-400 text-rose-900 font-bold'
            : 'bg-rose-950/90 border-rose-500/60 text-rose-300'
        };
      case 'ADAPTED':
        return {
          label: 'ADAPTED',
          badge: isLight
            ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
            : 'bg-amber-950/90 border-amber-500/60 text-amber-300'
        };
      case 'BASELINE':
      default:
        return {
          label: 'BASELINE',
          badge: isLight
            ? 'bg-slate-100 border-slate-300 text-slate-800 font-bold'
            : 'bg-slate-900 border-slate-700 text-slate-300'
        };
    }
  };

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md shadow-md space-y-3 transition-colors ${
      isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2.5">
        <div className="flex items-center gap-2">
          <Beaker className="w-4 h-4 text-cyan-500" />
          <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Laboratory Bond Scenarios
          </h4>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
          isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
        }`}>
          {FREEDOM_BOND_SCENARIOS.length} REGIMES AVAILABLE
        </span>
      </div>

      {/* Scenario List */}
      <div className="space-y-2">
        {FREEDOM_BOND_SCENARIOS.map(sc => {
          const isSelected = sc.id === selectedScenarioId;
          const classBadge = getClassificationBadge(sc.expected_classification);

          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc)}
              className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer font-mono ${
                isSelected
                  ? isLight
                    ? 'bg-cyan-50/80 border-cyan-400 ring-2 ring-cyan-400/30 shadow-xs'
                    : 'bg-cyan-950/60 border-cyan-500/70 ring-2 ring-cyan-500/30 shadow-md'
                  : isLight
                  ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-700'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${
                  isSelected
                    ? isLight ? 'text-cyan-900' : 'text-cyan-200'
                    : isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {sc.title}
                </span>
                <span className={`px-2 py-0.5 text-[9px] rounded border ${classBadge.badge}`}>
                  {classBadge.label}
                </span>
              </div>

              <p className={`text-[11px] font-sans leading-tight line-clamp-2 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {sc.summary}
              </p>

              {/* Mathematical parameters tag */}
              <div className="flex items-center gap-3 mt-2 text-[10px] opacity-75">
                <span>Code: {sc.code}</span>
                <span>Resonance: {(sc.resonance_coefficient * 100).toFixed(0)}%</span>
                <span>Extraction: {(sc.extraction_factor * 100).toFixed(0)}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
