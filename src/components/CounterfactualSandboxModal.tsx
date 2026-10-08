/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SimulationBranch, StateSnapshot } from '../types/simulation';
import { GitFork, X, Sliders, Play, Sparkles } from 'lucide-react';

interface CounterfactualSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: SimulationBranch[];
  onAddBranch: (newBranch: SimulationBranch) => void;
}

export const CounterfactualSandboxModal: React.FC<CounterfactualSandboxModalProps> = ({
  isOpen,
  onClose,
  branches,
  onAddBranch
}) => {
  const [parentBranchId, setParentBranchId] = useState(branches[0]?.branch_id || 'BRANCH-PRIME-0');
  const [bifurcationStep, setBifurcationStep] = useState(300);
  const [branchName, setBranchName] = useState('Polycentric Synthetic Common');
  const [coercionDamping, setCoercionDamping] = useState(0.75);
  const [cognitiveVariance, setCognitiveVariance] = useState(0.70);
  const [hierarchicalLocking, setHierarchicalLocking] = useState(-0.80);
  const [decentralizedMesh, setDecentralizedMesh] = useState(0.85);

  if (!isOpen) return null;

  const handleSimulateFork = () => {
    const parent = branches.find(b => b.branch_id === parentBranchId) || branches[0];
    const newId = `BRANCH-SIM-${Math.floor(100 + Math.random() * 900)}`;

    // Generate simulated state history for the new branch based on parent + deltas
    const parentSnaps = parent.state_history.filter(s => s.step <= bifurcationStep);
    const lastParentSnap = parentSnaps[parentSnaps.length - 1] || parent.state_history[0];

    const generatedHistory: StateSnapshot[] = [...parentSnaps];

    // Simulate future steps from bifurcationStep to 1000 in steps of 100
    for (let step = bifurcationStep + 100; step <= 1000; step += 100) {
      const progress = (step - bifurcationStep) / (1000 - bifurcationStep);
      
      const autonomy = Math.min(0.98, Math.max(0.1, lastParentSnap.autonomy_index + (coercionDamping * 0.45 + cognitiveVariance * 0.35) * progress));
      const coercion = Math.min(0.96, Math.max(0.1, lastParentSnap.coercion_resistance + coercionDamping * 0.5 * progress));
      const sovereignty = Math.min(0.98, Math.max(0.1, lastParentSnap.decentralized_sovereignty + decentralizedMesh * 0.55 * progress));
      const cognitive = Math.min(0.95, Math.max(0.1, lastParentSnap.cognitive_emancipation + cognitiveVariance * 0.4 * progress));
      const teleology = Math.max(0.2, 0.85 - Math.abs(hierarchicalLocking) * 0.1 * progress);

      generatedHistory.push({
        step,
        autonomy_index: Number(autonomy.toFixed(2)),
        coercion_resistance: Number(coercion.toFixed(2)),
        decentralized_sovereignty: Number(sovereignty.toFixed(2)),
        cognitive_emancipation: Number(cognitive.toFixed(2)),
        teleological_coherence: Number(teleology.toFixed(2)),
        structural_entropy: Number((0.25 + progress * 0.15).toFixed(2)),
        population_nodes: Math.floor(18000 + progress * 12000),
        system_integrity: 0.92
      });
    }

    const newBranch: SimulationBranch = {
      branch_id: newId,
      name: branchName,
      parent_branch_id: parentBranchId,
      bifurcation_origin_step: bifurcationStep,
      extinction_step: null,
      status: 'divergent',
      color: '#ec4899', // pink/magenta
      parameter_deltas: {
        coercion_damping: `+${coercionDamping.toFixed(2)}`,
        cognitive_variance: `+${cognitiveVariance.toFixed(2)}`,
        hierarchical_locking: `${hierarchicalLocking.toFixed(2)}`,
        decentralized_mesh: `+${decentralizedMesh.toFixed(2)}`
      },
      narrative_context: `User-injected counterfactual branch bifurcated from ${parentBranchId} at T=${bifurcationStep}. Injected high anti-coercive damping and distributed mesh parameters.`,
      state_history: generatedHistory,
      raw_event_logs: [
        {
          event_id: `LOG-${newId}-001`,
          step: bifurcationStep,
          event_code: 'USER_BIFURCATION',
          description: `Sandbox fork executed from ${parentBranchId} at T=${bifurcationStep}`,
          raw_hash: `sim-user-${Math.random().toString(36).substring(2, 10)}`,
          immutable_verified: true
        }
      ],
      blind_inferences: [
        {
          inference_id: `INF-${newId}-1`,
          step: bifurcationStep + 100,
          observer_id: 'REV-INF-SANDBOX',
          observation: 'Polycentric coordination emergence observed following manual parameter perturbation.',
          confidence_score: 0.94,
          structural_markers: ['user_counterfactual', 'polycentric_emergence']
        }
      ]
    };

    onAddBranch(newBranch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3 mb-5">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <GitFork className="w-6 h-6" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-500/50 text-cyan-300">
              COUNTERFACTUAL WHAT-IF SANDBOX
            </span>
            <h2 className="text-xl font-bold text-slate-100 font-sans mt-0.5">
              Fork Simulated World & Test Convergence
            </h2>
          </div>
        </div>

        <div className="space-y-4 text-xs font-mono">
          {/* Parent branch selection */}
          <div>
            <label className="block text-slate-300 mb-1">Parent Branch Origin</label>
            <select
              value={parentBranchId}
              onChange={e => setParentBranchId(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            >
              {branches.map(b => (
                <option key={b.branch_id} value={b.branch_id}>
                  {b.branch_id} - {b.name} ({b.status})
                </option>
              ))}
            </select>
          </div>

          {/* Branch Name */}
          <div>
            <label className="block text-slate-300 mb-1">New Branch Name</label>
            <input
              type="text"
              value={branchName}
              onChange={e => setBranchName(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Bifurcation Step */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Bifurcation Origin Step</span>
              <span className="text-cyan-400 font-bold">T={bifurcationStep}</span>
            </div>
            <input
              type="range"
              min={100}
              max={800}
              step={50}
              value={bifurcationStep}
              onChange={e => setBifurcationStep(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Parameter Sliders */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-slate-300 font-semibold uppercase text-[11px] block">
              Parameter Perturbations (Deltas)
            </span>

            <div>
              <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                <span>Coercion Damping</span>
                <span className="text-cyan-300">+{coercionDamping.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={coercionDamping}
                onChange={e => setCoercionDamping(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                <span>Cognitive Variance</span>
                <span className="text-cyan-300">+{cognitiveVariance.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={cognitiveVariance}
                onChange={e => setCognitiveVariance(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                <span>Hierarchical Locking</span>
                <span className="text-purple-300">{hierarchicalLocking.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={-1}
                max={0.5}
                step={0.05}
                value={hierarchicalLocking}
                onChange={e => setHierarchicalLocking(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded cursor-pointer accent-purple-400"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSimulateFork}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-semibold shadow-lg shadow-cyan-900/30 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate & Inject Branch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
