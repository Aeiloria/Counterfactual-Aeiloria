/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { SimulationBranch, SealedReferenceSpecification, StateSnapshot } from '../types/simulation';
import { Play, Pause, RotateCcw, FastForward, Rewind, Activity, Target } from 'lucide-react';

interface TimelineScrubberProps {
  currentStep: number;
  onStepChange: React.Dispatch<React.SetStateAction<number>>;
  branches: SimulationBranch[];
  sealedRef: SealedReferenceSpecification;
  selectedBranchId: string;
  onSelectBranch: (id: string) => void;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  currentStep,
  onStepChange,
  branches,
  sealedRef,
  selectedBranchId,
  onSelectBranch
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        onStepChange(prev => {
          if (prev >= 1000) {
            setIsPlaying(false);
            return 1000;
          }
          return Math.min(1000, prev + 20);
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onStepChange]);

  // Find closest state snapshot for a branch at currentStep
  const getBranchStateAtStep = (branch: SimulationBranch, step: number): StateSnapshot | null => {
    if (step < branch.bifurcation_origin_step) return null; // Not born yet
    if (branch.extinction_step !== null && step > branch.extinction_step) {
      // Return extinction state
      return branch.state_history[branch.state_history.length - 1] || null;
    }

    // Find closest snapshot <= step
    const pastSnaps = branch.state_history.filter(s => s.step <= step);
    if (pastSnaps.length === 0) return branch.state_history[0] || null;
    return pastSnaps[pastSnaps.length - 1];
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide font-mono uppercase">
            Simulation Timeline Scrubber & State Matrix
          </h3>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => onStepChange(Math.max(0, currentStep - 50))}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Step Back 50"
          >
            <Rewind className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/40 border border-cyan-500/40 text-cyan-200 text-xs font-mono transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate</span>
              </>
            )}
          </button>
          <button
            onClick={() => onStepChange(Math.min(1000, currentStep + 50))}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Step Forward 50"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              onStepChange(0);
            }}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Reset to Step 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Slider Bar */}
      <div className="mb-5 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Timestep Horizon: T=0 to T=1000</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Observation:</span>
            <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold text-sm">
              T={currentStep}
            </span>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={1000}
          step={10}
          value={currentStep}
          onChange={e => onStepChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>T=0 (Baseline Seed)</span>
          <span>T=250</span>
          <span>T=500 (Mid-Cycle)</span>
          <span>T=750</span>
          <span>T=1000 (Terminal Horizon)</span>
        </div>
      </div>

      {/* Parallel State Matrix at this timestep */}
      <div className="overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950/60">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Branch ID</th>
              <th className="py-2.5 px-3">Life Status @ T={currentStep}</th>
              <th className="py-2.5 px-3">
                Autonomy (≥{sealedRef.thresholds.autonomy_index})
              </th>
              <th className="py-2.5 px-3">
                Coercion Resist (≥{sealedRef.thresholds.coercion_resistance})
              </th>
              <th className="py-2.5 px-3">
                Decentral Sovereignty (≥{sealedRef.thresholds.decentralized_sovereignty})
              </th>
              <th className="py-2.5 px-3">
                Cognitive Emancip (≥{sealedRef.thresholds.cognitive_emancipation})
              </th>
              <th className="py-2.5 px-3">Nodes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {branches.map(branch => {
              const state = getBranchStateAtStep(branch, currentStep);
              const isSelected = branch.branch_id === selectedBranchId;
              const isPreBifurcation = currentStep < branch.bifurcation_origin_step;
              const isExtinct = branch.extinction_step !== null && currentStep > branch.extinction_step;

              return (
                <tr
                  key={`matrix-row-${branch.branch_id}`}
                  onClick={() => onSelectBranch(branch.branch_id)}
                  className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-cyan-950/30 font-medium' : ''
                  }`}
                >
                  <td className="py-2 px-3 text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: branch.color }}
                      />
                      <span className="font-semibold">{branch.branch_id}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    {isPreBifurcation ? (
                      <span className="text-slate-500">Unbifurcated (Starts T={branch.bifurcation_origin_step})</span>
                    ) : isExtinct ? (
                      <span className="text-rose-400 flex items-center gap-1">
                        Terminated (Extinct T={branch.extinction_step})
                      </span>
                    ) : (
                      <span className="text-emerald-400">Active Evolving</span>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {state ? (
                      <span className={state.autonomy_index >= sealedRef.thresholds.autonomy_index ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                        {state.autonomy_index.toFixed(2)}
                      </span>
                    ) : '--'}
                  </td>
                  <td className="py-2 px-3">
                    {state ? (
                      <span className={state.coercion_resistance >= sealedRef.thresholds.coercion_resistance ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                        {state.coercion_resistance.toFixed(2)}
                      </span>
                    ) : '--'}
                  </td>
                  <td className="py-2 px-3">
                    {state ? (
                      <span className={state.decentralized_sovereignty >= sealedRef.thresholds.decentralized_sovereignty ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                        {state.decentralized_sovereignty.toFixed(2)}
                      </span>
                    ) : '--'}
                  </td>
                  <td className="py-2 px-3">
                    {state ? (
                      <span className={state.cognitive_emancipation >= sealedRef.thresholds.cognitive_emancipation ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                        {state.cognitive_emancipation.toFixed(2)}
                      </span>
                    ) : '--'}
                  </td>
                  <td className="py-2 px-3 text-slate-400">
                    {state ? state.population_nodes.toLocaleString() : '--'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
