/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FreedomBondScenario, FreedomBondSnapshot } from '../../types/freedomBond';
import { FREEDOM_BOND_SCENARIOS } from '../../data/bondScenarios';
import { computeBondSnapshot } from '../../services/freedomBondEngine';
import { BondCanvas3D } from './BondCanvas3D';
import { TelemetryPanel } from './TelemetryPanel';
import { PlaybackBar } from './PlaybackBar';
import { PhaseSpacePlot } from './PhaseSpacePlot';
import { ScenarioSelector } from './ScenarioSelector';
import { NodeInspector } from './NodeInspector';
import { EquationReference } from './EquationReference';
import { useTheme } from '../../context/ThemeContext';
import { Activity, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

export const FreedomBondVisualizer: React.FC = () => {
  const { isLight } = useTheme();

  // Selected scenario
  const [selectedScenario, setSelectedScenario] = useState<FreedomBondScenario>(FREEDOM_BOND_SCENARIOS[0]);

  // Current continuous timestamp [0.0, 4.0]
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Playback timer ref to avoid render loops
  const lastTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Compute live snapshot
  const currentSnapshot: FreedomBondSnapshot = useMemo(() => {
    return computeBondSnapshot(selectedScenario, currentTimestamp);
  }, [selectedScenario, currentTimestamp]);

  // Handle scenario switch
  const handleSelectScenario = useCallback((sc: FreedomBondScenario) => {
    setSelectedScenario(sc);
    setCurrentTimestamp(0.0);
    setIsPlaying(false);
  }, []);

  // Animation loop for timeline playback
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let active = true;

    const tick = (now: number) => {
      if (!active) return;
      if (lastTimeRef.current !== null) {
        const deltaSec = (now - lastTimeRef.current) / 1000;
        // Progress rate: 1.0 unit of normalized time per 4 seconds at 1x
        const advance = (deltaSec * 0.4) * playbackSpeed;
        setCurrentTimestamp(prev => {
          const next = prev + advance;
          if (next >= 4.0) {
            return 4.0; // clamp at end
          }
          return next;
        });
      }
      lastTimeRef.current = now;
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // Auto-pause when reaching end
  useEffect(() => {
    if (currentTimestamp >= 4.0 && isPlaying) {
      setIsPlaying(false);
    }
  }, [currentTimestamp, isPlaying]);

  return (
    <div className="space-y-6">
      {/* Top Protocol Status Banner */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs transition-colors ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800 shadow-xs'
          : 'bg-slate-900/80 border-slate-800 text-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                AEILORIA.CORE // FREEDOM BOND VISUALIZATION SPECIFICATION
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                isLight ? 'bg-cyan-100 text-cyan-800 border-cyan-300' : 'bg-cyan-950 text-cyan-300 border-cyan-600'
              }`}>
                LABORATORY RIGOR
              </span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              State-Space Pipeline: x (Baseline) → V₁ (Applied Influence) → z (State Delta) → z' (Persistence Removal)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-[11px] opacity-75">Active Regime:</span>
          <span className={`px-2.5 py-1 rounded font-bold border ${
            isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
          }`}>
            {selectedScenario.code}
          </span>
        </div>
      </div>

      {/* Main Visualizer Area: 3D Canvas + Phase-Space Plot & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 3D Canvas & Playback Bar */}
        <div className="lg:col-span-2 space-y-4">
          <BondCanvas3D snapshot={currentSnapshot} />

          <PlaybackBar
            currentTimestamp={currentTimestamp}
            onTimestampChange={setCurrentTimestamp}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            playbackSpeed={playbackSpeed}
            onChangeSpeed={setPlaybackSpeed}
            snapshot={currentSnapshot}
          />
        </div>

        {/* Right Column: Phase-Space Plot & Node Inspector */}
        <div className="space-y-4">
          <PhaseSpacePlot
            scenario={selectedScenario}
            currentSnapshot={currentSnapshot}
          />

          <NodeInspector
            snapshot={currentSnapshot}
          />
        </div>
      </div>

      {/* Telemetry Tracking Array (Real-time tracking of all 5 observables) */}
      <TelemetryPanel snapshot={currentSnapshot} />

      {/* Lower Row: Scenario Selector & Equation Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScenarioSelector
          selectedScenarioId={selectedScenario.id}
          onSelectScenario={handleSelectScenario}
        />

        <EquationReference />
      </div>
    </div>
  );
};
