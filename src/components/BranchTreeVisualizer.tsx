/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  SimulationBranch,
  EvaluatedBranchResult,
  BranchStatus,
  SealedReferenceSpecification,
  StateSnapshot
} from '../types/simulation';
import { useTheme } from '../context/ThemeContext';
import {
  GitBranch,
  Skull,
  CheckCircle,
  Zap,
  Flame,
  AlertTriangle,
  Eye,
  Sliders,
  Sparkles,
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';

interface BranchTreeVisualizerProps {
  branches: SimulationBranch[];
  evaluatedBranches: EvaluatedBranchResult[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
  currentStep: number;
  sealedRef?: SealedReferenceSpecification;
  onStepChange?: (step: number) => void;
}

interface HeatmapNode {
  branch_id: string;
  branch_name: string;
  branch_color: string;
  step: number;
  x: number;
  y: number;
  deviation: number; // 0.0 to 1.0 (0% to 100%)
  resonanceScore: number;
  severity: 'resonant' | 'moderate' | 'significant' | 'critical';
  autonomy: number;
  coercion: number;
  sovereignty: number;
  cognitive: number;
  teleology: number;
  primaryDeviationReason: string;
  isTurningPoint: boolean;
}

export const BranchTreeVisualizer: React.FC<BranchTreeVisualizerProps> = ({
  branches,
  evaluatedBranches,
  selectedBranchId,
  onSelectBranch,
  currentStep,
  sealedRef,
  onStepChange
}) => {
  // Heatmap Overlay state
  const { isLight } = useTheme();
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [filterSignificantOnly, setFilterSignificantOnly] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<HeatmapNode | null>(null);

  // Default fallback thresholds if sealedRef is not provided
  const thresholds = sealedRef?.thresholds || {
    autonomy_index: 0.88,
    coercion_resistance: 0.85,
    decentralized_sovereignty: 0.90,
    cognitive_emancipation: 0.82,
    teleological_coherence: 0.75,
  };

  // Dynamic SVG Canvas dimensions
  const svgWidth = 860;
  const svgHeight = Math.max(260, branches.length * 56 + 50);
  const paddingX = 65;
  const availableWidth = svgWidth - paddingX * 2;
  const maxStep = 1000;

  const stepToX = (step: number) => {
    return paddingX + (step / maxStep) * availableWidth;
  };

  // Assign Y tracks to branches for clear visual hierarchy
  const branchYPositions: Record<string, number> = {};
  const trackHeight = svgHeight / (branches.length + 1);

  branches.forEach((b, index) => {
    branchYPositions[b.branch_id] = trackHeight * (index + 1);
  });

  // Calculate Heatmap Nodes for every state snapshot across all branches
  const heatmapNodes = useMemo(() => {
    const nodes: HeatmapNode[] = [];

    branches.forEach(branch => {
      const y = branchYPositions[branch.branch_id] || 60;
      const evalResult = evaluatedBranches.find(e => e.branch_id === branch.branch_id);

      branch.state_history.forEach(snap => {
        // Compute deviation from the Freedom sealed specification
        const dAutonomy = Math.max(0, thresholds.autonomy_index - snap.autonomy_index) / thresholds.autonomy_index;
        const dCoercion = Math.max(0, thresholds.coercion_resistance - snap.coercion_resistance) / thresholds.coercion_resistance;
        const dSovereignty = Math.max(0, thresholds.decentralized_sovereignty - snap.decentralized_sovereignty) / thresholds.decentralized_sovereignty;
        const dCognitive = Math.max(0, thresholds.cognitive_emancipation - snap.cognitive_emancipation) / thresholds.cognitive_emancipation;
        const dTeleology = Math.max(0, thresholds.teleological_coherence - snap.teleological_coherence) / thresholds.teleological_coherence;

        // Weighted deviation index
        const weightedDeviation = (
          dAutonomy * 0.25 +
          dCoercion * 0.25 +
          dSovereignty * 0.25 +
          dCognitive * 0.15 +
          dTeleology * 0.10
        );

        const deviation = Math.min(1.0, Math.max(0, weightedDeviation));
        const resonanceScore = 1.0 - deviation;

        // Determine primary deviation driver
        const gaps = [
          { name: 'Decentralized Sovereignty', gap: dSovereignty, val: snap.decentralized_sovereignty, target: thresholds.decentralized_sovereignty },
          { name: 'Coercion Resistance', gap: dCoercion, val: snap.coercion_resistance, target: thresholds.coercion_resistance },
          { name: 'Autonomy Index', gap: dAutonomy, val: snap.autonomy_index, target: thresholds.autonomy_index },
          { name: 'Cognitive Emancipation', gap: dCognitive, val: snap.cognitive_emancipation, target: thresholds.cognitive_emancipation },
          { name: 'Teleological Coherence', gap: dTeleology, val: snap.teleological_coherence, target: thresholds.teleological_coherence },
        ];
        gaps.sort((a, b) => b.gap - a.gap);
        const topGap = gaps[0];

        let reason = 'Resonant with sealed specification targets.';
        if (deviation >= 0.15) {
          reason = `${topGap.name} deficit (${topGap.val.toFixed(2)} vs ≥${topGap.target.toFixed(2)} target)`;
        }

        let severity: 'resonant' | 'moderate' | 'significant' | 'critical' = 'resonant';
        if (deviation >= 0.50 || (branch.extinction_step !== null && snap.step === branch.extinction_step)) {
          severity = 'critical';
        } else if (deviation >= 0.35) {
          severity = 'significant';
        } else if (deviation >= 0.15) {
          severity = 'moderate';
        } else {
          severity = 'resonant';
        }

        const isTurningPoint = evalResult?.divergence_turning_point === snap.step;

        nodes.push({
          branch_id: branch.branch_id,
          branch_name: branch.name,
          branch_color: branch.color,
          step: snap.step,
          x: stepToX(snap.step),
          y,
          deviation,
          resonanceScore,
          severity,
          autonomy: snap.autonomy_index,
          coercion: snap.coercion_resistance,
          sovereignty: snap.decentralized_sovereignty,
          cognitive: snap.cognitive_emancipation,
          teleology: snap.teleological_coherence,
          primaryDeviationReason: reason,
          isTurningPoint
        });
      });
    });

    return nodes;
  }, [branches, evaluatedBranches, thresholds, branchYPositions]);

  // Count significant and critical deviation nodes
  const deviationCounts = useMemo(() => {
    let critical = 0;
    let significant = 0;
    let moderate = 0;
    let resonant = 0;

    heatmapNodes.forEach(n => {
      if (n.severity === 'critical') critical++;
      else if (n.severity === 'significant') significant++;
      else if (n.severity === 'moderate') moderate++;
      else resonant++;
    });

    return { critical, significant, moderate, resonant, totalSignificant: critical + significant };
  }, [heatmapNodes]);

  const visibleHeatmapNodes = useMemo(() => {
    if (!filterSignificantOnly) return heatmapNodes;
    return heatmapNodes.filter(n => n.severity === 'significant' || n.severity === 'critical');
  }, [heatmapNodes, filterSignificantOnly]);

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { fill: '#f43f5e', stroke: '#fda4af', halo: 'rgba(244, 63, 94, 0.45)', badge: 'bg-rose-950 text-rose-300 border-rose-500/50' };
      case 'significant':
        return { fill: '#f97316', stroke: '#fdba74', halo: 'rgba(249, 115, 22, 0.40)', badge: 'bg-orange-950 text-orange-300 border-orange-500/50' };
      case 'moderate':
        return { fill: '#eab308', stroke: '#fde047', halo: 'rgba(234, 179, 8, 0.25)', badge: 'bg-amber-950 text-amber-300 border-amber-500/50' };
      case 'resonant':
      default:
        return { fill: '#10b981', stroke: '#6ee7b7', halo: 'rgba(16, 185, 129, 0.25)', badge: 'bg-emerald-950 text-emerald-300 border-emerald-500/50' };
    }
  };

  return (
    <div className={`rounded-xl border p-5 shadow-xl relative transition-colors ${
      isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-slate-900/90 border-slate-800 text-slate-100'
    }`}>
      {/* Visualizer Header with Heatmap Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className={`w-4 h-4 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
            <h3 className={`text-sm font-semibold tracking-wide font-mono uppercase ${
              isLight ? 'text-slate-900' : 'text-slate-200'
            }`}>
              Multi-Branch Evolutionary Bifurcation Tree
            </h3>
            {showHeatmap && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                isLight ? 'bg-rose-100 border border-rose-300 text-rose-900' : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
              }`}>
                <Flame className={`w-3 h-3 ${isLight ? 'text-rose-600' : 'text-rose-400'} animate-pulse`} />
                HEATMAP OVERLAY ACTIVE
              </span>
            )}
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Evaluates surviving vs extinct parallel worlds against SPEC-FREEDOM-7A. Heatmap nodes highlight significant trajectory deviations.
          </p>
        </div>

        {/* Heatmap Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Heatmap Toggle Button */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              showHeatmap
                ? isLight
                  ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold shadow-xs'
                  : 'bg-gradient-to-r from-rose-900/40 to-amber-900/40 border-rose-500/60 text-rose-200 shadow-md shadow-rose-950/30 font-bold'
                : isLight
                ? 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
                : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${showHeatmap ? (isLight ? 'text-rose-600 animate-pulse' : 'text-rose-400 animate-pulse') : 'text-slate-400'}`} />
            <span>Heatmap Overlay: {showHeatmap ? 'ON' : 'OFF'}</span>
          </button>

          {/* Filter Significant Only Toggle */}
          {showHeatmap && (
            <button
              onClick={() => setFilterSignificantOnly(!filterSignificantOnly)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                filterSignificantOnly
                  ? isLight
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                    : 'bg-amber-900/30 border-amber-500/50 text-amber-200 font-bold'
                  : isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Show only nodes with significant deviation (≥35%)"
            >
              <Filter className="w-3 h-3" />
              <span>Significant Only (≥35%)</span>
            </button>
          )}

          {/* Deviation Stats Counter */}
          {showHeatmap && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-950/80 border-slate-800 text-slate-400'
            }`}>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>
                <strong className={isLight ? 'text-rose-700' : 'text-rose-400'}>{deviationCounts.totalSignificant}</strong> Deviant Nodes
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Spectrum Legend Bar */}
      {showHeatmap && (
        <div className={`mb-3 p-2 rounded-lg border flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/70 border-slate-800/80 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`uppercase text-[10px] tracking-wider font-semibold ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}>
              Freedom Spec Deviation Heatmap:
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`flex items-center gap-1 ${isLight ? 'text-emerald-800 font-medium' : 'text-emerald-400'}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span>Resonant (&lt;15% Dev)</span>
            </div>
            <div className={`flex items-center gap-1 ${isLight ? 'text-amber-800 font-medium' : 'text-amber-400'}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <span>Moderate (15-35%)</span>
            </div>
            <div className={`flex items-center gap-1 ${isLight ? 'text-orange-800 font-medium' : 'text-orange-400'}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
              <span>Significant (35-50%)</span>
            </div>
            <div className={`flex items-center gap-1 font-bold ${isLight ? 'text-rose-800' : 'text-rose-400'}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping opacity-75" />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md shadow-rose-500" />
              <span>Critical Deviation (&gt;50%)</span>
            </div>
          </div>
          <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            Hover node for audit • Click to scrub timeline
          </span>
        </div>
      )}

      {/* Interactive SVG Tree with Heatmap Overlay */}
      <div className={`relative overflow-x-auto overflow-y-hidden rounded-lg border p-2 transition-colors ${
        isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950/90 border-slate-800/80'
      }`}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[750px] select-none"
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="grid-pattern-heat" width="60" height="40" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 40" fill="none" stroke={isLight ? '#e2e8f0' : '#1e293b'} strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>

            {/* Glowing heat filters */}
            <filter id="glow-rose" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background grid */}
          <rect width={svgWidth} height={svgHeight} fill={isLight ? '#f8fafc' : 'url(#grid-pattern-heat)'} />

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
                  stroke={isLight ? '#e2e8f0' : '#334155'}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={x}
                  y={svgHeight - 6}
                  fill={isLight ? '#64748b' : '#64748b'}
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

                {/* Base branch line */}
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
                      r="5.5"
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
                      r="5.5"
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

                {/* Branch name label */}
                <text
                  x={startX + 8}
                  y={y - 7}
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

          {/* VISUAL HEATMAP OVERLAY NODES */}
          {showHeatmap && visibleHeatmapNodes.map((node, idx) => {
            const isHovered = hoveredNode?.branch_id === node.branch_id && hoveredNode?.step === node.step;
            const colors = getSeverityColor(node.severity);
            const isSignificantOrCritical = node.severity === 'significant' || node.severity === 'critical';

            return (
              <g
                key={`heatnode-${node.branch_id}-${node.step}-${idx}`}
                className="cursor-pointer transition-transform duration-150"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBranch(node.branch_id);
                  if (onStepChange) {
                    onStepChange(node.step);
                  }
                }}
              >
                {/* Pulsing aura for critical nodes */}
                {node.severity === 'critical' && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered ? '13' : '9.5'}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeOpacity="0.6"
                    className="animate-ping"
                    style={{ animationDuration: '2.5s' }}
                  />
                )}

                {/* Heat Halo Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? '12' : isSignificantOrCritical ? '8' : '5.5'}
                  fill={colors.halo}
                  filter={node.severity === 'critical' ? 'url(#glow-rose)' : node.severity === 'significant' ? 'url(#glow-orange)' : undefined}
                />

                {/* Node Core Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? '6.5' : isSignificantOrCritical ? '5' : '3.5'}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isHovered ? '2.5' : '1.5'}
                />

                {/* Turning Point Marker Badge */}
                {node.isTurningPoint && (
                  <g transform={`translate(${node.x - 4}, ${node.y - 14})`}>
                    <polygon
                      points="4,0 8,8 0,8"
                      fill="#f59e0b"
                      stroke="#0f172a"
                      strokeWidth="1"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Rich Interactive Tooltip on Node Hover */}
        {hoveredNode && (
          <div
            className={`absolute z-30 pointer-events-none transition-all duration-150 rounded-xl p-3 shadow-2xl backdrop-blur-md max-w-xs font-mono text-xs ${
              isLight
                ? 'bg-white/95 border border-slate-300 text-slate-800 shadow-xl'
                : 'bg-slate-900/95 border border-slate-700/80 text-slate-200'
            }`}
            style={{
              left: Math.min(window.innerWidth - 320, Math.max(20, hoveredNode.x - 140)),
              top: Math.max(10, hoveredNode.y - 125)
            }}
          >
            <div className={`flex items-center justify-between gap-2 mb-1.5 border-b pb-1.5 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredNode.branch_color }} />
                {hoveredNode.branch_id}
              </span>
              <span className={`text-[11px] font-semibold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                T={hoveredNode.step}
              </span>
            </div>

            <div className="space-y-1.5 mb-2">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Spec Deviation:</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getSeverityColor(hoveredNode.severity).badge}`}>
                  {(hoveredNode.deviation * 100).toFixed(1)}% Deviation
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Freedom Resonance:</span>
                <span className={`font-bold text-[11px] ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  {(hoveredNode.resonanceScore * 100).toFixed(1)}%
                </span>
              </div>
              <p className={`text-[10px] font-sans border-t pt-1 leading-snug ${
                isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800/80 text-slate-300'
              }`}>
                {hoveredNode.primaryDeviationReason}
              </p>
            </div>

            <div className={`pt-1.5 border-t text-[10px] grid grid-cols-2 gap-x-2 gap-y-0.5 ${
              isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
            }`}>
              <div>Autonomy: <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}>{hoveredNode.autonomy.toFixed(2)}</strong></div>
              <div>Sovereignty: <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}>{hoveredNode.sovereignty.toFixed(2)}</strong></div>
              <div>Coercion Res: <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}>{hoveredNode.coercion.toFixed(2)}</strong></div>
              <div>Cognitive: <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}>{hoveredNode.cognitive.toFixed(2)}</strong></div>
            </div>

            <div className={`mt-2 pt-1 border-t text-[10px] text-center ${
              isLight ? 'border-slate-200 text-cyan-800' : 'border-slate-800/80 text-cyan-300/80'
            }`}>
              Click node to jump timeline to T={hoveredNode.step}
            </div>
          </div>
        )}
      </div>

      {/* Quick selection bar below chart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3">
        {branches.map(branch => {
          const isSelected = branch.branch_id === selectedBranchId;
          const status = getStatusBadge(branch.status);
          const evalResult = evaluatedBranches.find(e => e.branch_id === branch.branch_id);

          // Find branch specific severe nodes count
          const branchDeviantNodes = heatmapNodes.filter(
            n => n.branch_id === branch.branch_id && (n.severity === 'significant' || n.severity === 'critical')
          );

          return (
            <button
              key={`card-${branch.branch_id}`}
              onClick={() => onSelectBranch(branch.branch_id)}
              className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? isLight
                    ? 'bg-cyan-50 border-cyan-400 ring-1 ring-cyan-300 shadow-sm'
                    : 'bg-slate-800/90 border-cyan-500/60 ring-1 ring-cyan-500/30'
                  : isLight
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className={`font-mono text-xs font-semibold truncate ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}>
                  {branch.branch_id}
                </span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${status.bg}`}>
                  {status.icon}
                  {status.label}
                </span>
              </div>
              <p className={`text-xs truncate mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {branch.name}
              </p>
              <div className={`flex items-center justify-between text-[11px] font-mono pt-1.5 border-t ${
                isLight ? 'border-slate-200' : 'border-slate-800/80'
              }`}>
                <span className={`flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  Bifurc: T={branch.bifurcation_origin_step}
                </span>
                <div className="flex items-center gap-1.5">
                  {showHeatmap && branchDeviantNodes.length > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                        isLight
                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                          : 'bg-rose-950 text-rose-300 border-rose-500/30'
                      }`}
                      title={`${branchDeviantNodes.length} deviant nodes`}
                    >
                      🔥 {branchDeviantNodes.length}
                    </span>
                  )}
                  <span className={`font-semibold ${
                    (evalResult?.convergence_score || 0) >= 0.85
                      ? isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400'
                      : (evalResult?.convergence_score || 0) >= 0.60
                      ? isLight ? 'text-cyan-700' : 'text-cyan-400'
                      : isLight ? 'text-amber-700' : 'text-amber-400'
                  }`}>
                    {evalResult ? evalResult.convergence_score.toFixed(2) : '--'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
