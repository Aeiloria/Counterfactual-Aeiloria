/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SimulationScenario } from '../types/simulation';
import {
  GitBranch,
  Shield,
  FileCode2,
  Database,
  Sliders,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  scenarios: SimulationScenario[];
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  onOpenSealedRef: () => void;
  onOpenRawLedger: () => void;
  onOpenSandbox: () => void;
  onOpenJsonExport: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  onOpenSealedRef,
  onOpenRawLedger,
  onOpenSandbox,
  onOpenJsonExport,
  isLoading
}) => {
  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Pipeline Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-900/30 border border-cyan-400/40">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight font-sans">
                  Counterfactual Branch Comparator
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/40">
                  AEILORIA PIPELINE
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Downstream from Simulation Core & Reverse-Inference Engine
              </p>
            </div>
          </div>

          {/* Controls: Scenario Selector & Modals */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Scenario Dropdown */}
            <div className="relative">
              <select
                value={activeScenarioId}
                onChange={e => onSelectScenario(e.target.value)}
                disabled={isLoading}
                aria-label="Simulation Scenario"
                className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-mono focus:border-cyan-500 focus:outline-none cursor-pointer disabled:opacity-50"
              >
                {scenarios.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.expected_verdict.replace(/_/g, ' ')})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sealed Ref Spec Button */}
            <button
              onClick={onOpenSealedRef}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-mono transition-colors cursor-pointer"
              title="Inspect Sealed Reference for Freedom"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Sealed Spec</span>
            </button>

            {/* Raw History Ledger Button */}
            <button
              onClick={onOpenRawLedger}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
              title="Audit Rule 1: Immutable Raw History"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Rule 1 Ledger</span>
            </button>

            {/* Sandbox Button */}
            <button
              onClick={onOpenSandbox}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
              title="Fork Counterfactual What-If Sandbox"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Fork Sandbox</span>
            </button>

            {/* JSON Export Button */}
            <button
              onClick={onOpenJsonExport}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
              title="View Machine-Readable Output Schema"
            >
              <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
              <span>JSON Output</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
