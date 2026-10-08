/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SealedReferenceSpecification } from '../types/simulation';
import { ShieldCheck, Lock, X, Hash, CheckCircle, FileCode } from 'lucide-react';

interface SealedReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sealedRef: SealedReferenceSpecification;
}

export const SealedReferenceModal: React.FC<SealedReferenceModalProps> = ({
  isOpen,
  onClose,
  sealedRef
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-purple-500/40 bg-slate-900 p-6 shadow-2xl shadow-purple-950/40 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3 mb-5">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 border border-purple-500/50 text-purple-300">
                CRYPTOGRAPHICALLY SEALED
              </span>
              <span className="text-xs font-mono text-slate-400">
                {sealedRef.pipeline_stage}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-sans mt-0.5">
              Sealed Reference Specification: {sealedRef.target_name} ({sealedRef.specification_id})
            </h2>
          </div>
        </div>

        {/* Cryptographic Seal Badge */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs mb-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-purple-400" />
              Cryptographic Seal Hash:
            </span>
            <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Immutable
            </span>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-purple-300 break-all select-all text-[11px]">
            {sealedRef.cryptographic_seal_hash}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Sealed Epoch: {sealedRef.sealed_epoch}</span>
            <span>Target Endpoint: Absolute Freedom Ground Truth</span>
          </div>
        </div>

        {/* 5 Sealed Target Dimensions */}
        <div className="mb-5 space-y-3">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            Canonical Dimension Thresholds
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(sealedRef.thresholds).map(([key, val]) => (
              <div key={key} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                <div className="flex items-center justify-between font-mono mb-1">
                  <span className="text-slate-300 capitalize font-medium">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold">
                    ≥ {val.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {sealedRef.dimension_descriptions[key]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Invariance Constraints */}
        <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono mb-5">
          <div className="text-slate-300 font-semibold mb-2 uppercase text-[11px] tracking-wider">
            Pipeline Invariance Constraints (Core Rules)
          </div>
          <ul className="space-y-1.5 text-slate-400 text-[11px]">
            {sealedRef.invariance_constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs cursor-pointer transition-colors"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
