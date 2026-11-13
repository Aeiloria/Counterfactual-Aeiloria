/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { BOND_STAGES } from '../../data/bondScenarios';
import { BondStageId, FreedomBondSnapshot } from '../../types/freedomBond';
import { useTheme } from '../../context/ThemeContext';
import { Play, Pause, RotateCcw, FastForward, SkipBack, SkipForward, Clock } from 'lucide-react';

interface PlaybackBarProps {
  currentTimestamp: number; // [0.0, 4.0]
  onTimestampChange: (newT: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  snapshot: FreedomBondSnapshot;
}

export const PlaybackBar: React.FC<PlaybackBarProps> = ({
  currentTimestamp,
  onTimestampChange,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
  snapshot
}) => {
  const { isLight } = useTheme();

  // Handle stage tab click
  const handleJumpToStage = (stageId: BondStageId) => {
    switch (stageId) {
      case 'STAGE_A':
        onTimestampChange(0.0);
        break;
      case 'STAGE_B':
        onTimestampChange(1.0);
        break;
      case 'STAGE_C':
        onTimestampChange(2.0);
        break;
      case 'STAGE_D':
        onTimestampChange(3.0);
        break;
    }
  };

  const handleReset = () => {
    onTimestampChange(0.0);
  };

  const speeds = [0.5, 1.0, 2.0];

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md shadow-md space-y-3 transition-colors ${
      isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
    }`}>
      {/* 4-Stage Transition Pipeline Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {BOND_STAGES.map((st, idx) => {
          const isActive = snapshot.stage === st.id;
          const isPassed = currentTimestamp >= (idx + 1);

          return (
            <button
              key={st.id}
              onClick={() => handleJumpToStage(st.id)}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer font-mono ${
                isActive
                  ? isLight
                    ? 'bg-cyan-50 border-cyan-400 text-cyan-950 ring-2 ring-cyan-400/40 shadow-xs'
                    : 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/30 shadow-md'
                  : isPassed
                  ? isLight
                    ? 'bg-slate-100/80 border-slate-300 text-slate-700'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                  : 'bg-slate-950/20 border-slate-800/60 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isActive ? (isLight ? 'text-cyan-700' : 'text-cyan-400') : ''
                }`}>
                  {st.label}
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                  isActive
                    ? isLight ? 'bg-cyan-200 text-cyan-900 border-cyan-300' : 'bg-cyan-900 text-cyan-200 border-cyan-600'
                    : isLight ? 'bg-slate-200 text-slate-600 border-slate-300' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {st.mathSymbol}
                </span>
              </div>
              <div className={`text-xs font-semibold truncate ${
                isActive ? (isLight ? 'text-slate-900' : 'text-white') : ''
              }`}>
                {st.subLabel}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Continuous Scrubber */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              PIPELINE POSITION:
            </span>
            <span className={`px-2 py-0.5 rounded border font-bold ${
              isLight ? 'bg-cyan-50 border-cyan-300 text-cyan-900' : 'bg-cyan-950 border-cyan-600/40 text-cyan-300'
            }`}>
              t = {currentTimestamp.toFixed(2)} / 4.00
            </span>
          </div>

          <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Stage Progress: {Math.round(snapshot.progress * 100)}%
          </div>
        </div>

        {/* Range Slider */}
        <div className="relative py-1">
          <input
            type="range"
            min="0"
            max="4"
            step="0.01"
            value={currentTimestamp}
            onChange={e => onTimestampChange(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-700/30 accent-cyan-500 cursor-pointer appearance-none"
            aria-label="Simulation continuous timeline scrubber"
          />

          {/* Tick markers at Stage boundaries */}
          <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1 pt-1">
            <span>x (0.0)</span>
            <span>V₁ (1.0)</span>
            <span>z (2.0)</span>
            <span>z' (3.0)</span>
            <span>Asymptote (4.0)</span>
          </div>
        </div>
      </div>

      {/* Control Buttons & Playback Mechanics */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200/40">
        <div className="flex items-center gap-2 font-mono">
          {/* Play / Pause */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs transition-all cursor-pointer shadow-xs ${
              isPlaying
                ? isLight
                  ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                  : 'bg-amber-950/80 border-amber-500/60 text-amber-300 hover:bg-amber-900'
                : isLight
                ? 'bg-cyan-600 border-cyan-700 text-white hover:bg-cyan-500'
                : 'bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-500'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Play Mechanics</span>
              </>
            )}
          </button>

          {/* Step Back / Step Forward */}
          <button
            onClick={() => onTimestampChange(Math.max(0, currentTimestamp - 0.25))}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title="Step Back -0.25t"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onTimestampChange(Math.min(4, currentTimestamp + 0.25))}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title="Step Forward +0.25t"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title="Reset to Stage A Baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Multiplier Selector */}
        <div className="flex items-center gap-1 font-mono text-xs">
          <span className={`text-[11px] mr-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            SPEED:
          </span>
          {speeds.map(sp => (
            <button
              key={sp}
              onClick={() => onChangeSpeed(sp)}
              className={`px-2 py-1 rounded border text-[11px] font-bold cursor-pointer transition-colors ${
                playbackSpeed === sp
                  ? isLight
                    ? 'bg-cyan-100 border-cyan-400 text-cyan-900'
                    : 'bg-cyan-950 border-cyan-500 text-cyan-300'
                  : isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-600'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}
            >
              {sp}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
