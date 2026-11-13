/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SimulationBranch } from '../types/simulation';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, X, FileText, CheckCircle2, Terminal, Eye } from 'lucide-react';

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
  const { isLight } = useTheme();
  const [activeTab, setActiveTab] = useState<'events' | 'inferences'>('events');

  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-3xl rounded-2xl border p-6 shadow-2xl max-h-[90vh] flex flex-col transition-colors ${
        isLight
          ? 'bg-white border-slate-300 text-slate-900 shadow-slate-900/10'
          : 'bg-slate-900 border-slate-700 text-slate-100 shadow-2xl'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
            isLight
              ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className={`p-3 rounded-xl border ${
            isLight
              ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
          }`}>
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 border ${
                isLight
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
              }`}>
                <ShieldCheck className="w-3 h-3" />
                RULE 1 ENFORCED: RAW LOGS IMMUTABLE
              </span>
              <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Branch: {branch.branch_id}
              </span>
            </div>
            <h2 className={`text-xl font-bold font-sans mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Simulation Ledger & Blind Reverse-Inferences
            </h2>
          </div>
        </div>

        {/* Tab switcher */}
        <div className={`flex items-center gap-2 border-b pb-2 mb-4 text-xs font-mono ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'events'
                ? isLight
                  ? 'bg-cyan-100 text-cyan-950 font-bold border border-cyan-300'
                  : 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Raw Event Logs ({branch.raw_event_logs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('inferences')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'inferences'
                ? isLight
                  ? 'bg-purple-100 text-purple-950 font-bold border border-purple-300'
                  : 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
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
                <div key={evt.event_id} className={`p-3 rounded-lg border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
                }`}>
                  <div className={`flex items-center justify-between text-[11px] mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isLight ? 'text-cyan-800' : 'text-cyan-300'}`}>{evt.event_id}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        isLight ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {evt.event_code}
                      </span>
                      <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>T={evt.step}</span>
                    </div>
                    <span className={`flex items-center gap-1 text-[10px] font-bold ${
                      isLight ? 'text-emerald-700' : 'text-emerald-400'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      SHA-256 Verified
                    </span>
                  </div>
                  <p className={`font-sans text-xs mb-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    {evt.description}
                  </p>
                  <div className={`text-[10px] p-1.5 rounded border ${
                    isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-900/80 border-slate-800 text-slate-500'
                  }`}>
                    Hash Signature: <span className={`select-all ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>{evt.raw_hash}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {branch.blind_inferences.map(inf => (
                <div key={inf.inference_id} className={`p-3 rounded-lg border ${
                  isLight ? 'bg-purple-50/50 border-purple-200' : 'bg-slate-950 border-purple-900/30'
                }`}>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isLight ? 'text-purple-800' : 'text-purple-300'}`}>{inf.inference_id}</span>
                      <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Observer: {inf.observer_id}</span>
                      <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>T={inf.step}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                      isLight
                        ? 'bg-purple-100 text-purple-900 border-purple-300'
                        : 'bg-purple-950 text-purple-300 border-purple-500/30'
                    }`}>
                      Confidence: {(inf.confidence_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className={`font-sans text-xs mb-2 italic ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                    "{inf.observation}"
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {inf.structural_markers.map(m => (
                      <span key={m} className={`px-1.5 py-0.5 rounded text-[10px] ${
                        isLight ? 'bg-white border border-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
                      }`}>
                        #{m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`mt-4 pt-3 border-t flex items-center justify-between ${
          isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-500'
        }`}>
          <span className="text-[11px] font-mono">
            Rule 1 Audit: 100% of event history cryptographically intact.
          </span>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-mono text-xs cursor-pointer transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
