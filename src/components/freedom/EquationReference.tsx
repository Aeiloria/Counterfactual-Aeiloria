/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BookOpen, ChevronDown, ChevronUp, Code, Sigma, Lock } from 'lucide-react';

export const EquationReference: React.FC = () => {
  const { isLight } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const equations = [
    {
      title: 'State Transition Pipeline Operator',
      formula: 'x \\xrightarrow{V_1} z = x + \\int_0^{\\tau} \\mathbf{V}_1(t) \\, dt \\xrightarrow{\\text{persist. rem.}} z\' = \\lim_{t \\to \\infty} \\mathcal{T}(z)',
      description: 'Stage A (baseline x), Stage B (applied influence V1), Stage C (perturbed delta z), and Stage D (relaxation z\').'
    },
    {
      title: 'Compersion Observables Product Metric',
      formula: '\\mathcal{C}(A, B) = \\prod_{k=1}^5 \\mathcal{O}_k^{\\omega_k} = \\left( b_{\\text{gain}} \\cdot a_{\\text{resp}} \\cdot \\text{non\\_dep} \\cdot \\text{non\\_cap} \\cdot \\text{dist\\_maint} \\right)^{\\frac{1}{5}}',
      description: 'Zero-tolerance metric: any single observable failing toward zero triggers catastrophic collapse of the non-coercive bond classification.'
    },
    {
      title: 'Non-Capture Sovereignty Constraint',
      formula: '\\forall t \\in [0, \\infty), \\quad \\| \\nabla_{\\text{ext}} \\Phi_B(t) \\| < \\varepsilon_{\\text{sovereign}} \\implies \\text{rank}(J_B) = 3',
      description: 'Guarantees that recipient Node B retains full rank state control and cannot be trapped inside Node A potential well.'
    },
    {
      title: 'Persistence Removal Asymptotic Condition',
      formula: '\\mathcal{L}_{\\text{lattice}} = \\lim_{t \\to \\infty} \\left| \\frac{\\partial z\'}{\\partial t} \\right| = 0 \\quad \\land \\quad \\lambda_{\\text{Lyapunov}} < 0 \\implies \\text{SELF\\_SUSTAINING}',
      description: 'Authentic bonds do not require ongoing enforcement: the iridescent crystal lattice maintains dynamic stability indefinitely.'
    }
  ];

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md shadow-md transition-colors ${
      isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between cursor-pointer text-left"
      >
        <div className="flex items-center gap-2">
          <Sigma className="w-4 h-4 text-cyan-500" />
          <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Mathematical Formulation & Equation Reference (AEILORIA.CORE)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
          }`}>
            LABORATORY SPECIFICATION
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          {equations.map((eq, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border space-y-1.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                <span>{eq.title}</span>
                <span className="opacity-60 text-[10px]">EQ-{i + 1}</span>
              </div>
              <div className={`p-2 rounded font-mono text-[11px] overflow-x-auto ${
                isLight ? 'bg-white text-slate-800 border border-slate-200' : 'bg-slate-900 text-cyan-200 border border-slate-700/60'
              }`}>
                <code>{eq.formula}</code>
              </div>
              <p className={`text-[10px] font-sans leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {eq.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
