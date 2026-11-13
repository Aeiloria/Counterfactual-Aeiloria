/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CompersionObservables, FreedomBondSnapshot } from '../../types/freedomBond';
import { useTheme } from '../../context/ThemeContext';
import { Activity, ShieldCheck, CheckCircle2, AlertOctagon, Cpu, Hash } from 'lucide-react';

interface TelemetryPanelProps {
  snapshot: FreedomBondSnapshot;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ snapshot }) => {
  const { isLight } = useTheme();
  const { observables, compersion_composite, state_classification } = snapshot;

  const observableConfigs = [
    {
      key: 'b_gain_verified' as keyof CompersionObservables,
      label: 'b_gain_verified',
      mathSymbol: 'ΔB > 0',
      description: 'Net functional capacity gain verified for recipient Agent B without extraction.',
      value: observables.b_gain_verified,
      threshold: 0.70,
      format: (val: number) => val.toFixed(4)
    },
    {
      key: 'a_response_positive' as keyof CompersionObservables,
      label: 'a_response_positive',
      mathSymbol: '∂A/∂B ≥ 0',
      description: 'Positive resonant derivative in Agent A corresponding to Agent B flourishing.',
      value: observables.a_response_positive,
      threshold: 0.70,
      format: (val: number) => val.toFixed(4)
    },
    {
      key: 'non_deprivation' as keyof CompersionObservables,
      label: 'non_deprivation',
      mathSymbol: 'S_B(t) ≥ S_B(0)',
      description: 'Preservation of baseline state resources; absolute absence of extractive curtailment.',
      value: observables.non_deprivation,
      threshold: 0.80,
      format: (val: number) => val.toFixed(4)
    },
    {
      key: 'non_capture' as keyof CompersionObservables,
      label: 'non_capture',
      mathSymbol: '|∇_ext Φ_B| < ε',
      description: 'Sovereignty gradient intact; independence from external unilateral trajectory lock.',
      value: observables.non_capture,
      threshold: 0.75,
      format: (val: number) => val.toFixed(4)
    },
    {
      key: 'distinctness_maintained' as keyof CompersionObservables,
      label: 'distinctness_maintained',
      mathSymbol: 'D_top(A, B) ≥ δ',
      description: 'Topological manifold separation sustained; absence of entitative subsumption.',
      value: observables.distinctness_maintained,
      threshold: 0.80,
      format: (val: number) => val.toFixed(4)
    }
  ];

  return (
    <div className={`p-5 rounded-xl border backdrop-blur-md shadow-lg transition-colors space-y-4 ${
      isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg border ${
            isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-800' : 'bg-cyan-950/80 border-cyan-500/30 text-cyan-300'
          }`}>
            <Activity className="w-4 h-4 text-cyan-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold font-mono tracking-wider uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Compersion Telemetry Array
              </h3>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                5/5 OBSERVABLES ACTIVE
              </span>
            </div>
            <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Real-time mathematical tracking across interaction state pipeline
            </p>
          </div>
        </div>

        {/* Composite Score Meter */}
        <div className={`flex items-center gap-3 px-3.5 py-1.5 rounded-lg border font-mono ${
          compersion_composite >= 0.85
            ? isLight
              ? 'bg-cyan-50 border-cyan-300 text-cyan-900'
              : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200'
            : compersion_composite < 0.60
            ? isLight
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
            : isLight
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-amber-950/80 border-amber-500/50 text-amber-200'
        }`}>
          <div>
            <div className="text-[10px] tracking-wider uppercase opacity-75">Compersion Index C(A,B)</div>
            <div className="text-lg font-bold">{compersion_composite.toFixed(4)}</div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0">
            {Math.round(compersion_composite * 100)}%
          </div>
        </div>
      </div>

      {/* 5 Observables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {observableConfigs.map(obs => {
          const isPassing = obs.value >= obs.threshold;
          const percentage = Math.min(100, Math.max(0, Math.round(obs.value * 100)));

          return (
            <div
              key={obs.key}
              className={`p-3 rounded-lg border font-mono text-xs transition-all ${
                isPassing
                  ? isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-slate-950/60 border-slate-800 text-slate-200'
                  : isLight
                  ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                  : 'bg-rose-950/40 border-rose-900/60 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold truncate ${
                  isPassing
                    ? isLight ? 'text-slate-600' : 'text-slate-400'
                    : 'text-rose-500'
                }`}>
                  {obs.label}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${
                  isPassing
                    ? isLight ? 'bg-cyan-100/70 border-cyan-300 text-cyan-800' : 'bg-cyan-950 border-cyan-600/40 text-cyan-300'
                    : 'bg-rose-600/20 border-rose-500/40 text-rose-400'
                }`}>
                  {obs.mathSymbol}
                </span>
              </div>

              {/* Observable Value */}
              <div className="flex items-baseline justify-between my-1.5">
                <span className="text-lg font-bold tracking-tight">
                  {obs.format(obs.value)}
                </span>
                <span className={`text-[10px] font-semibold ${isPassing ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isPassing ? 'PASS' : 'BREACH'}
                </span>
              </div>

              {/* Mini Gauge Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-700/20 overflow-hidden relative mb-2">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isPassing
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                      : 'bg-gradient-to-r from-rose-500 to-amber-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
                {/* Threshold tick line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white/70 shadow-xs"
                  style={{ left: `${obs.threshold * 100}%` }}
                  title={`Threshold: ≥${obs.threshold}`}
                />
              </div>

              {/* Zero-prose rigorous description */}
              <p className={`text-[10px] leading-tight line-clamp-2 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {obs.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
