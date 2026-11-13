/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { FreedomBondScenario, FreedomBondSnapshot } from '../../types/freedomBond';
import { computeBondSnapshot } from '../../services/freedomBondEngine';
import { useTheme } from '../../context/ThemeContext';
import { Compass, TrendingUp, HelpCircle } from 'lucide-react';

interface PhaseSpacePlotProps {
  scenario: FreedomBondScenario;
  currentSnapshot: FreedomBondSnapshot;
}

export const PhaseSpacePlot: React.FC<PhaseSpacePlotProps> = ({
  scenario,
  currentSnapshot
}) => {
  const { isLight } = useTheme();

  // Precompute Phase Portrait Trajectory: Delta Capacity A vs Delta Capacity B from t=0 to t=4
  const trajectoryPoints = useMemo(() => {
    const points: { t: number; deltaA: number; deltaB: number; x: number; y: number }[] = [];
    const width = 280;
    const height = 220;
    const padding = 32;

    const plotW = width - padding * 2;
    const plotH = height - padding * 2;

    // Range for Delta A and Delta B: [-0.4, +0.4]
    const minVal = -0.4;
    const maxVal = 0.4;

    for (let t = 0; t <= 4.0; t += 0.08) {
      const snap = computeBondSnapshot(scenario, t);
      const deltaA = snap.phase_space_point.autonomy_delta_a;
      const deltaB = snap.phase_space_point.autonomy_delta_b;

      const normX = (deltaB - minVal) / (maxVal - minVal);
      const normY = (deltaA - minVal) / (maxVal - minVal);

      const px = padding + normX * plotW;
      const py = height - padding - normY * plotH;

      points.push({ t, deltaA, deltaB, x: px, y: py });
    }
    return points;
  }, [scenario]);

  // Current dot coordinates
  const currentDot = useMemo(() => {
    const width = 280;
    const height = 220;
    const padding = 32;
    const plotW = width - padding * 2;
    const plotH = height - padding * 2;

    const minVal = -0.4;
    const maxVal = 0.4;

    const deltaA = currentSnapshot.phase_space_point.autonomy_delta_a;
    const deltaB = currentSnapshot.phase_space_point.autonomy_delta_b;

    const normX = (deltaB - minVal) / (maxVal - minVal);
    const normY = (deltaA - minVal) / (maxVal - minVal);

    return {
      x: padding + Math.max(0, Math.min(1, normX)) * plotW,
      y: height - padding - Math.max(0, Math.min(1, normY)) * plotH
    };
  }, [currentSnapshot]);

  // SVG path for trajectory
  const pathD = useMemo(() => {
    if (trajectoryPoints.length === 0) return '';
    return trajectoryPoints.reduce(
      (acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`,
      ''
    );
  }, [trajectoryPoints]);

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md shadow-md space-y-3 font-mono transition-colors ${
      isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
    }`}>
      {/* Title */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-500" />
          <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Phase-Space Portrait (ΔA vs ΔB)
          </h4>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded border ${
          isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
        }`}>
          λ = {currentSnapshot.phase_space_point.lyapunov_exponent.toFixed(2)}
        </span>
      </div>

      {/* SVG Canvas Plot */}
      <div className="flex justify-center">
        <svg width="280" height="220" className="overflow-visible select-none">
          {/* Background grid */}
          <rect
            x="32"
            y="20"
            width="216"
            height="168"
            fill={isLight ? '#f8fafc' : '#090d16'}
            stroke={isLight ? '#e2e8f0' : '#1e293b'}
            rx="6"
          />

          {/* Attractor Basin of Compersion (Top-Right quadrant ΔA>0, ΔB>0) */}
          <rect
            x="140"
            y="20"
            width="108"
            height="84"
            fill={isLight ? 'rgba(6, 182, 212, 0.08)' : 'rgba(6, 182, 212, 0.12)'}
            stroke={isLight ? 'rgba(6, 182, 212, 0.25)' : 'rgba(6, 182, 212, 0.3)'}
            strokeDasharray="3 3"
          />
          <text
            x="146"
            y="35"
            fontSize="9"
            fill={isLight ? '#0891b2' : '#22d3ee'}
            fontWeight="bold"
          >
            Compersion Basin
          </text>

          {/* Axes */}
          {/* X Axis (ΔB = 0) */}
          <line
            x1="32"
            y1="104"
            x2="248"
            y2="104"
            stroke={isLight ? '#94a3b8' : '#475569'}
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          {/* Y Axis (ΔA = 0) */}
          <line
            x1="140"
            y1="20"
            x2="140"
            y2="188"
            stroke={isLight ? '#94a3b8' : '#475569'}
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Axis Labels */}
          <text x="248" y="101" fontSize="9" textAnchor="end" fill={isLight ? '#64748b' : '#94a3b8'}>
            +ΔCap(B) →
          </text>
          <text x="35" y="101" fontSize="9" textAnchor="start" fill={isLight ? '#64748b' : '#94a3b8'}>
            -ΔB
          </text>
          <text x="144" y="29" fontSize="9" fill={isLight ? '#64748b' : '#94a3b8'}>
            +ΔCap(A) ↑
          </text>
          <text x="144" y="184" fontSize="9" fill={isLight ? '#64748b' : '#94a3b8'}>
            -ΔA ↓
          </text>

          {/* Full Trajectory Path */}
          <path
            d={pathD}
            fill="none"
            stroke={
              currentSnapshot.state_classification === 'SELF_SUSTAINING'
                ? '#06b6d4'
                : currentSnapshot.state_classification === 'FORCED'
                ? '#f43f5e'
                : '#f59e0b'
            }
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Start Point (x) */}
          {trajectoryPoints[0] && (
            <circle
              cx={trajectoryPoints[0].x}
              cy={trajectoryPoints[0].y}
              r="4"
              fill="#94a3b8"
            />
          )}

          {/* Current Animated State Dot */}
          <circle
            cx={currentDot.x}
            cy={currentDot.y}
            r="6"
            fill="#ffffff"
            stroke="#0284c7"
            strokeWidth="2"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Numerical Coordinate Readout */}
      <div className={`p-2 rounded-lg border text-[11px] grid grid-cols-2 gap-2 ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/60 border-slate-800 text-slate-300'
      }`}>
        <div>
          <span className="opacity-70">ΔCap(A): </span>
          <span className="font-bold">{currentSnapshot.phase_space_point.autonomy_delta_a > 0 ? '+' : ''}{currentSnapshot.phase_space_point.autonomy_delta_a.toFixed(3)}</span>
        </div>
        <div>
          <span className="opacity-70">ΔCap(B): </span>
          <span className="font-bold">{currentSnapshot.phase_space_point.autonomy_delta_b > 0 ? '+' : ''}{currentSnapshot.phase_space_point.autonomy_delta_b.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
};
