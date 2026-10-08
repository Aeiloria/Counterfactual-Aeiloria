/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SimulationBranch, SealedReferenceSpecification, EvaluatedBranchResult } from '../types/simulation';
import { LineChart, Compass, Info, Check, AlertTriangle } from 'lucide-react';

interface ConvergenceChartsProps {
  branches: SimulationBranch[];
  sealedRef: SealedReferenceSpecification;
  evaluatedBranches: EvaluatedBranchResult[];
  selectedBranchId: string;
  onSelectBranch: (id: string) => void;
  currentStep: number;
}

export const ConvergenceCharts: React.FC<ConvergenceChartsProps> = ({
  branches,
  sealedRef,
  evaluatedBranches,
  selectedBranchId,
  onSelectBranch,
  currentStep
}) => {
  const [metricMode, setMetricMode] = useState<'convergence' | 'autonomy' | 'coercion' | 'sovereignty'>('convergence');

  const selectedBranch = branches.find(b => b.branch_id === selectedBranchId) || branches[0];

  // Radar chart calculations for selected branch vs sealed reference
  const dimensions = [
    { key: 'autonomy_index', label: 'Autonomy Index', target: sealedRef.thresholds.autonomy_index },
    { key: 'coercion_resistance', label: 'Coercion Resist', target: sealedRef.thresholds.coercion_resistance },
    { key: 'decentralized_sovereignty', label: 'Decentralized Sov', target: sealedRef.thresholds.decentralized_sovereignty },
    { key: 'cognitive_emancipation', label: 'Cognitive Emancip', target: sealedRef.thresholds.cognitive_emancipation },
    { key: 'teleological_coherence', label: 'Teleology Coherence', target: sealedRef.thresholds.teleological_coherence },
  ];

  // Get current snapshot or latest snapshot for selected branch
  const activeSnap = selectedBranch?.state_history.filter(s => s.step <= currentStep).pop() ||
    selectedBranch?.state_history[selectedBranch.state_history.length - 1];

  // SVG Radar setup
  const radarSize = 220;
  const radarCenter = radarSize / 2;
  const radarRadius = 75;
  const angleStep = (Math.PI * 2) / dimensions.length;

  const getPointCoordinates = (val: number, index: number, maxVal = 1.0) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (Math.min(1.0, Math.max(0, val)) / maxVal) * radarRadius;
    const x = radarCenter + r * Math.cos(angle);
    const y = radarCenter + r * Math.sin(angle);
    return { x, y };
  };

  // Target points polygon
  const targetPolygon = dimensions.map((dim, i) => {
    const pt = getPointCoordinates(dim.target, i);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  // Current branch points polygon
  const currentPolygon = dimensions.map((dim, i) => {
    const val = activeSnap ? (activeSnap as any)[dim.key] || 0 : 0;
    const pt = getPointCoordinates(val, i);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Trajectory Timeline Curves */}
      <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-200 tracking-wide font-mono uppercase">
                Trajectory Convergence Curves (T=0 to T=1000)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative distance to sealed Freedom threshold across counterfactual runs.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setMetricMode('convergence')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                metricMode === 'convergence' ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Convergence
            </button>
            <button
              onClick={() => setMetricMode('autonomy')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                metricMode === 'autonomy' ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Autonomy
            </button>
            <button
              onClick={() => setMetricMode('sovereignty')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                metricMode === 'sovereignty' ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sovereignty
            </button>
          </div>
        </div>

        {/* SVG Trajectory Graph */}
        <div className="relative rounded-lg bg-slate-950/90 border border-slate-800/80 p-2">
          <svg viewBox="0 0 540 200" className="w-full h-44 select-none">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1.0].map(val => {
              const y = 180 - val * 160;
              return (
                <g key={`grid-y-${val}`}>
                  <line x1="40" y1={y} x2="520" y2={y} stroke="#1e293b" strokeWidth="0.8" />
                  <text x="35" y={y + 3} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
                    {val.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Timestep horizontal markers */}
            {[0, 250, 500, 750, 1000].map(s => {
              const x = 40 + (s / 1000) * 480;
              return (
                <text key={`grid-x-${s}`} x={x} y="195" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  T={s}
                </text>
              );
            })}

            {/* Target Threshold Baseline (0.85 dashed line) */}
            <line
              x1="40"
              y1={180 - 0.85 * 160}
              x2="520"
              y2={180 - 0.85 * 160}
              stroke="#a855f7"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <text x="515" y={180 - 0.85 * 160 - 4} fill="#c084fc" fontSize="8" fontFamily="monospace" textAnchor="end">
              Freedom Threshold (0.85)
            </text>

            {/* Vertical scrubber line */}
            <line
              x1={40 + (currentStep / 1000) * 480}
              y1="15"
              x2={40 + (currentStep / 1000) * 480}
              y2="180"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              opacity="0.8"
            />

            {/* Branch Trajectory Paths */}
            {branches.map(branch => {
              const isSelected = branch.branch_id === selectedBranchId;
              const points = branch.state_history.map(s => {
                const x = 40 + (s.step / 1000) * 480;
                let val = 0;
                if (metricMode === 'autonomy') val = s.autonomy_index;
                else if (metricMode === 'sovereignty') val = s.decentralized_sovereignty;
                else {
                  // Convergence score proxy
                  val = (s.autonomy_index * 0.3 + s.coercion_resistance * 0.3 + s.decentralized_sovereignty * 0.4);
                }
                const y = 180 - Math.min(1.0, Math.max(0, val)) * 160;
                return `${x},${y}`;
              }).join(' ');

              return (
                <g key={`traj-${branch.branch_id}`} onClick={() => onSelectBranch(branch.branch_id)} className="cursor-pointer">
                  {isSelected && (
                    <polyline
                      points={points}
                      fill="none"
                      stroke={branch.color}
                      strokeWidth="6"
                      strokeOpacity="0.2"
                      strokeLinecap="round"
                    />
                  )}
                  <polyline
                    points={points}
                    fill="none"
                    stroke={branch.color}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={isSelected ? 1 : 0.75}
                  />
                  {/* Extinction marker if extinct */}
                  {branch.status === 'extinct' && branch.extinction_step && (
                    <circle
                      cx={40 + (branch.extinction_step / 1000) * 480}
                      cy={(() => {
                        const lastSnap = branch.state_history[branch.state_history.length - 1];
                        const val = metricMode === 'autonomy' ? lastSnap.autonomy_index : metricMode === 'sovereignty' ? lastSnap.decentralized_sovereignty : (lastSnap.autonomy_index * 0.3 + lastSnap.coercion_resistance * 0.3 + lastSnap.decentralized_sovereignty * 0.4);
                        return 180 - Math.min(1.0, val) * 160;
                      })()}
                      r="3.5"
                      fill="#ef4444"
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Branch labels under chart */}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-mono">
          {branches.map(b => (
            <button
              key={b.branch_id}
              onClick={() => onSelectBranch(b.branch_id)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors cursor-pointer ${
                b.branch_id === selectedBranchId ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
              <span>{b.branch_id}</span>
              {b.status === 'extinct' && <span className="text-[10px] text-rose-400">(Extinct)</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Radar Signature vs Sealed Reference Specification */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-slate-200 tracking-wide font-mono uppercase">
                Sealed Freedom Radar
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300">
              SPEC-FREEDOM-7A
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Active: <span className="font-semibold text-slate-200">{selectedBranch.branch_id}</span> @ T={currentStep}
          </p>

          {/* SVG Radar */}
          <div className="flex justify-center items-center py-1">
            <svg viewBox={`0 0 ${radarSize} ${radarSize}`} className="w-48 h-48 select-none">
              {/* Radial guide rings */}
              {[0.25, 0.5, 0.75, 1.0].map(ratio => (
                <circle
                  key={`ring-${ratio}`}
                  cx={radarCenter}
                  cy={radarCenter}
                  r={radarRadius * ratio}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />
              ))}

              {/* Axis rays */}
              {dimensions.map((dim, i) => {
                const pt = getPointCoordinates(1.0, i);
                return (
                  <line
                    key={`ray-${dim.key}`}
                    x1={radarCenter}
                    y1={radarCenter}
                    x2={pt.x}
                    y2={pt.y}
                    stroke="#334155"
                    strokeWidth="0.8"
                  />
                );
              })}

              {/* Target Polygon (Purple) */}
              <polygon
                points={targetPolygon}
                fill="rgba(168, 85, 247, 0.12)"
                stroke="#a855f7"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />

              {/* Current Branch Polygon (Branch Color) */}
              <polygon
                points={currentPolygon}
                fill={`${selectedBranch.color}33`}
                stroke={selectedBranch.color}
                strokeWidth="2"
              />

              {/* Dimension label nodes */}
              {dimensions.map((dim, i) => {
                const labelCoord = getPointCoordinates(1.22, i);
                return (
                  <text
                    key={`lbl-${dim.key}`}
                    x={labelCoord.x}
                    y={labelCoord.y + 3}
                    fill="#94a3b8"
                    fontSize="7"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {dim.label.split(' ')[0]}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Legend & Stats */}
        <div className="pt-3 border-t border-slate-800 text-[11px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1.5 rounded-sm bg-purple-500 border border-purple-400" />
              Sealed Freedom Spec
            </span>
            <span className="text-purple-300">Target Bounds</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1.5 rounded-sm" style={{ backgroundColor: selectedBranch.color }} />
              {selectedBranch.branch_id}
            </span>
            <span className="font-bold text-slate-100">
              {activeSnap ? `${(activeSnap.autonomy_index * 100).toFixed(0)}% Autonomy` : '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
