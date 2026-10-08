/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ComparatorOutput } from '../types/simulation';
import { Code2, X, Copy, Check, Download } from 'lucide-react';

interface JsonExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparatorOutput: ComparatorOutput;
}

export const JsonExportModal: React.FC<JsonExportModalProps> = ({
  isOpen,
  onClose,
  comparatorOutput
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Format exactly conforming to schema
  const cleanJsonPayload = {
    evaluated_branches: comparatorOutput.evaluated_branches.map(b => ({
      branch_id: b.branch_id,
      bifurcation_origin_step: b.bifurcation_origin_step,
      parameter_deltas: b.parameter_deltas,
      convergence_score: b.convergence_score,
      match_type: b.match_type,
      earliest_convergent_timestep: b.earliest_convergent_timestep,
      convergence_trajectory: b.convergence_trajectory,
      key_structural_evidence: b.key_structural_evidence,
      alternative_explanations: b.alternative_explanations,
      divergence_turning_point: b.divergence_turning_point
    })),
    summary_conclusion: comparatorOutput.summary_conclusion,
    comparative_analysis: comparatorOutput.comparative_analysis
  };

  const jsonString = JSON.stringify(cleanJsonPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aeiloria-counterfactual-comparator-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                REQUIRED OUTPUT SCHEMA (JSON)
              </span>
              <span className="text-xs font-mono text-slate-400">
                Machine-Readable Evaluation Output
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-sans mt-0.5">
              Comparator JSON Serialization
            </h2>
          </div>
        </div>

        {/* Code view */}
        <div className="flex-1 overflow-y-auto rounded-lg bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-cyan-200/90 leading-relaxed max-h-[55vh]">
          <pre>{jsonString}</pre>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Strict Schema: 0 prose outside JSON structure
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
