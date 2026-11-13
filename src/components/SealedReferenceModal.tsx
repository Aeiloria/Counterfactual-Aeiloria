/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SealedReferenceSpecification } from '../types/simulation';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, Lock, X, Hash, CheckCircle } from 'lucide-react';

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
  const { isLight } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-2xl rounded-2xl border p-6 shadow-2xl max-h-[90vh] overflow-y-auto transition-colors ${
        isLight
          ? 'bg-white border-purple-300 text-slate-900 shadow-purple-900/10'
          : 'bg-slate-900 border-purple-500/40 text-slate-100 shadow-purple-950/40'
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

        <div className="flex items-start gap-3 mb-5">
          <div className={`p-3 rounded-xl border ${
            isLight
              ? 'bg-purple-50 border-purple-300 text-purple-700'
              : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
          }`}>
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                isLight
                  ? 'bg-purple-100 border-purple-300 text-purple-900'
                  : 'bg-purple-950 border-purple-500/50 text-purple-300'
              }`}>
                CRYPTOGRAPHICALLY SEALED
              </span>
              <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {sealedRef.pipeline_stage}
              </span>
            </div>
            <h2 className={`text-xl font-bold font-sans mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Sealed Reference Specification: {sealedRef.target_name} ({sealedRef.specification_id})
            </h2>
          </div>
        </div>

        {/* Cryptographic Seal Badge */}
        <div className={`p-3 rounded-lg border font-mono text-xs mb-5 space-y-1 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className={`flex items-center justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <span className="flex items-center gap-1 font-semibold">
              <Hash className="w-3.5 h-3.5 text-purple-500" />
              Cryptographic Seal Hash:
            </span>
            <span className={`flex items-center gap-1 text-[11px] font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Immutable
            </span>
          </div>
          <div className={`p-2 rounded border break-all select-all text-[11px] ${
            isLight
              ? 'bg-white border-purple-200 text-purple-900 font-semibold'
              : 'bg-slate-900 border-slate-800/80 text-purple-300'
          }`}>
            {sealedRef.cryptographic_seal_hash}
          </div>
          <div className={`flex items-center justify-between text-[11px] pt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            <span>Sealed Epoch: {sealedRef.sealed_epoch}</span>
            <span>Target Endpoint: Absolute Freedom Ground Truth</span>
          </div>
        </div>

        {/* 5 Sealed Target Dimensions */}
        <div className="mb-5 space-y-3">
          <h3 className={`text-xs font-mono font-semibold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            Canonical Dimension Thresholds
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(sealedRef.thresholds).map(([key, val]) => (
              <div key={key} className={`p-3 rounded-lg border text-xs ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between font-mono mb-1">
                  <span className={`capitalize font-medium ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded font-bold border ${
                    isLight
                      ? 'bg-purple-100 border-purple-300 text-purple-900'
                      : 'bg-purple-950/80 border-purple-500/40 text-purple-300'
                  }`}>
                    ≥ {val.toFixed(2)}
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {sealedRef.dimension_descriptions[key]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Invariance Constraints */}
        <div className={`p-3.5 rounded-lg border text-xs font-mono mb-5 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <div className={`font-semibold mb-2 uppercase text-[11px] tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            Pipeline Invariance Constraints (Core Rules)
          </div>
          <ul className={`space-y-1.5 text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {sealedRef.invariance_constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-mono text-xs cursor-pointer transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
