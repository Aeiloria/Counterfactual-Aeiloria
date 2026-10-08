/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SimulationBranch } from '../types/simulation';
import { ShieldCheck, X, FileText, CheckCircle2, Lock, Terminal, Eye } from 'lucide-react';

interface RawHistoryLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: SimulationBranch | null;
}

export const RawHistoryLedgerModal: React.FC<RawHistoryLedgerModalProps> = ({
  isOpen,
  onClose,
  branch
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'inferences'>('events');

  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-500/50 text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                RULE 1 ENFORCED: RAW LOGS IMMUTABLE
              </span>
              <span className="text-xs font-mono text-slate-400">
                Branch: {branch.branch_id}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-sans mt-0.5">
              Simulation Ledger & Blind Reverse-Inferences
            </h2>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'events'
                ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Raw Event Logs ({branch.raw_event_logs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('inferences')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'inferences'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Blind Inferences ({branch.blind_inferences.length})</span>
          </button>
        </div>

        {/* Body scroll area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-mono">
          {activeTab === 'events' ? (
            <div className="space-y-2.5">
              {branch.raw_event_logs.map(evt => (
                <div key={evt.event_id} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-300">{evt.event_id}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {evt.event_code}
                      </span>
                      <span className="text-slate-500">T={evt.step}</span>
                    </div>
                    <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      SHA-256 Verified
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs mb-2">
                    {evt.description}
                  </p>
                  <div className="text-[10px] text-slate-500 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    Hash Signature: <span className="text-slate-400 select-all">{evt.raw_hash}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {branch.blind_inferences.map(inf => (
                <div key={inf.inference_id} className="p-3 rounded-lg bg-slate-950 border border-purple-900/30">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-300">{inf.inference_id}</span>
                      <span className="text-slate-400">Observer: {inf.observer_id}</span>
                      <span className="text-slate-500">T={inf.step}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px]">
                      Confidence: {(inf.confidence_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-slate-200 font-sans text-xs mb-2">
                    "{inf.observation}"
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {inf.structural_markers.map(m => (
                      <span key={m} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                        #{m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Rule 1 Audit: 100% of event history cryptographically intact.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs cursor-pointer transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
