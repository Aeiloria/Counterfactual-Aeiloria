/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SimulationBranch, EvaluatedBranchResult, BranchStatus } from '../types/simulation';
import { GitBranch, Skull, CheckCircle, Zap, Shield, Info } from 'lucide-react';

interface BranchTreeVisualizerProps {
  branches: SimulationBranch[];
  evaluatedBranches: EvaluatedBranchResult[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
  currentStep: number;
}

export const BranchTreeVisualizer: React.FC<BranchTreeVisualizerProps> = ({
  branches,
  evaluatedBranches,
  selectedBranchId,
  onSelectBranch,
  currentStep
}) => {
  // SVG Canvas dimensions
  const svgWidth = 840;
  const svgHeight = 240;
  const paddingX = 60;
  const availableWidth = svgWidth - paddingX * 2;
  const maxStep = 1000;

  const stepToX = (step: number) => {
    return paddingX + (step / maxStep) * availableWidth;
  };

  // Assign Y tracks to branches for clear visual hierarchy
  const branchYPositions: Record<string, number> = {};
  const trackHeight = svgHeight / (branches.length + 1);

  branches.forEach((b, index) => {
    // Root at middle-upper or top
    branchYPositions[b.branch_id] = trackHeight * (index + 1);
  });

  const getStatusBadge = (status: BranchStatus) => {
    switch (status) {
      case 'surviving':
        return { label: 'Surviving', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: <CheckCircle className="w-3 h-3 text-emerald-400" /> };
      case 'extinct':
        return { label: 'Extinct', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: <Skull className="w-3 h-3 text-rose-400" /> };
      case 'transient':
        return { label: 'Transient', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: <Zap className="w-3 h-3 text-purple-400" /> };
      case 'divergent':
      default:
        return { label: 'Divergent', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: <GitBranch className="w-3 h-3 text-amber-400" /> };
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200 tracking-wide font-mono uppercase">
              Multi-Branch Evolutionary Bifurcation Tree
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluates surviving vs extinct parallel worlds against the sealed reference. Click any branch to inspect.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded border bg-emerald-950/40 border-emerald-500/30 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Surviving
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded border bg-rose-950/40 border-rose-500/30 text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Extinct
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded border bg-amber-950/40 border-amber-500/30 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Divergent
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded border bg-purple-950/40 border-purple-500/30 text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-400" /> Transient
          </span>
        </div>
      </div>

      {/* Interactive SVG tree */}
      <div className="relative overflow-x-auto overflow-y-hidden rounded-lg bg-slate-950/90 border border-slate-800/80 p-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[700px] select-none"
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="grid-pattern" width="60" height="40" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
            {/* Gradients */}
            <linearGradient id="cursorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <rect width={svgWidth} height={svgHeight} fill="url(#grid-pattern)" />

          {/* Timestep vertical axis markers */}
          {[0, 200, 400, 600, 800, 1000].map(step => {
            const x = stepToX(step);
            return (
              <g key={`marker-${step}`}>
                <line
                  x1={x}
                  y1={15}
                  x2={x}
                  y2={svgHeight - 15}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={x}
                  y={svgHeight - 6}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  T={step}
                </text>
              </g>
            );
          })}

          {/* Scrubber vertical line indicator */}
          <g>
            <line
              x1={stepToX(currentStep)}
              y1={10}
              x2={stepToX(currentStep)}
              y2={svgHeight - 18}
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="4 2"
              className="transition-all duration-150"
            />
            <circle
              cx={stepToX(currentStep)}
              cy={12}
              r="4"
              fill="#06b6d4"
            />
          </g>

          {/* Connecting bifurcation curves */}
          {branches.map(branch => {
            if (!branch.parent_branch_id) return null;
            const parentY = branchYPositions[branch.parent_branch_id] || 60;
            const myY = branchYPositions[branch.branch_id];
            const bifurcX = stepToX(branch.bifurcation_origin_step);

            // Bezier curve branching off parent
            const pathData = `M ${bifurcX} ${parentY} C ${bifurcX + 30} ${parentY}, ${bifurcX + 10} ${myY}, ${bifurcX + 40} ${myY}`;

            return (
              <path
                key={`bifurc-curve-${branch.branch_id}`}
                d={pathData}
                fill="none"
                stroke={branch.color}
                strokeWidth="2"
                strokeDasharray="2 2"
                strokeOpacity="0.7"
              />
            );
          })}

          {/* Branch timeline horizontal tracks */}
          {branches.map(branch => {
            const isSelected = branch.branch_id === selectedBranchId;
            const startX = stepToX(branch.bifurcation_origin_step);
            const endX = stepToX(branch.extinction_step !== null ? branch.extinction_step : 1000);
            const y = branchYPositions[branch.branch_id];
            const evalResult = evaluatedBranches.find(e => e.branch_id === branch.branch_id);

            return (
              <g
                key={`track-${branch.branch_id}`}
                onClick={() => onSelectBranch(branch.branch_id)}
                className="cursor-pointer group"
              >
                {/* Glow on select or hover */}
                {isSelected && (
                  <line
                    x1={startX}
                    y1={y}
                    x2={endX}
                    y2={y}
                    stroke={branch.color}
                    strokeWidth="8"
                    strokeOpacity="0.25"
                    strokeLinecap="round"
                  />
                )}

                {/* Main line */}
                <line
                  x1={startX}
                  y1={y}
                  x2={endX}
                  y2={y}
                  stroke={branch.color}
                  strokeWidth={isSelected ? '3.5' : '2'}
                  strokeLinecap="round"
                  className="transition-all duration-200"
                />

                {/* Bifurcation origin node */}
                <g>
                  <circle
                    cx={startX}
                    cy={y}
                    r={isSelected ? '6' : '4'}
                    fill={branch.color}
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                  {branch.bifurcation_origin_step > 0 && (
                    <text
                      x={startX}
                      y={y - 8}
                      fill="#94a3b8"
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      Bifurc: T={branch.bifurcation_origin_step}
                    </text>
                  )}
                </g>

                {/* End node (Extinction or Surviving) */}
                {branch.status === 'extinct' || branch.status === 'transient' ? (
                  <g>
                    <circle
                      cx={endX}
                      cy={y}
                      r="5"
                      fill="#ef4444"
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    <text
                      x={endX + 6}
                      y={y + 3}
                      fill="#f87171"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      Extinct T={branch.extinction_step}
                    </text>
                  </g>
                ) : (
                  <g>
                    <circle
                      cx={endX}
                      cy={y}
                      r="5"
                      fill="#10b981"
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    <text
                      x={endX + 6}
                      y={y + 3}
                      fill="#34d399"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      Surviving T=1000
                    </text>
                  </g>
                )}

                {/* Label on left or above */}
                <text
                  x={startX + 8}
                  y={y - 6}
                  fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  {branch.name}
                  {evalResult && (
                    <tspan
                      fill="#38bdf8"
                      fontSize="9"
                      fontFamily="monospace"
                      dx="8"
                    >
                      [Score: {evalResult.convergence_score.toFixed(2)}]
                    </tspan>
                  )}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Quick selection bar below chart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3">
        {branches.map(branch => {
          const isSelected = branch.branch_id === selectedBranchId;
          const status = getStatusBadge(branch.status);
          const evalResult = evaluatedBranches.find(e => e.branch_id === branch.branch_id);

          return (
            <button
              key={`card-${branch.branch_id}`}
              onClick={() => onSelectBranch(branch.branch_id)}
              className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500/60 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono text-xs font-semibold text-slate-200 truncate">
                  {branch.branch_id}
                </span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${status.bg}`}>
                  {status.icon}
                  {status.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mb-1.5">
                {branch.name}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono pt-1.5 border-t border-slate-800/80">
                <span className="text-slate-500">
                  Bifurc: T={branch.bifurcation_origin_step}
                </span>
                <span className={`font-semibold ${
                  (evalResult?.convergence_score || 0) >= 0.85
                    ? 'text-emerald-400'
                    : (evalResult?.convergence_score || 0) >= 0.60
                    ? 'text-cyan-400'
                    : 'text-amber-400'
                }`}>
                  Score: {evalResult ? evalResult.convergence_score.toFixed(2) : '--'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
