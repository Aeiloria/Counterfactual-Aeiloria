/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FreedomBondSnapshot } from '../../types/freedomBond';
import { useTheme } from '../../context/ThemeContext';
import { Layers, ArrowRight, Activity, CircleDot } from 'lucide-react';

interface NodeInspectorProps {
  snapshot: FreedomBondSnapshot;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({ snapshot }) => {
  const { isLight } = useTheme();
  const { node_a, node_b, influence_vector_v1, influence_magnitude } = snapshot;

  // Inter-node spatial distance
  const distance = Math.sqrt(
    Math.pow(node_a.position.x - node_b.position.x, 2) +
    Math.pow(node_a.position.y - node_b.position.y, 2) +
    Math.pow(node_a.position.z - node_b.position.z, 2)
  );

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md shadow-md space-y-3 font-mono transition-colors ${
      isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
    }`}>
      {/* Title */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-500" />
          <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
            State-Space Node & Vector Inspector
          </h4>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded border ${
          isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
        }`}>
          D(A,B) = {distance.toFixed(3)}
        </span>
      </div>

      {/* Node A vs Node B Readout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Node A Card */}
        <div className={`p-3 rounded-lg border space-y-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-600 dark:text-cyan-400">Node A (Initiator)</span>
            <span className="text-[10px] opacity-75">ID: {node_a.id}</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="opacity-70">Coordinates (x, y, z):</span>
              <span className="font-semibold">
                [{node_a.position.x.toFixed(2)}, {node_a.position.y.toFixed(2)}, {node_a.position.z.toFixed(2)}]
              </span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Capacity Index:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {(node_a.capacity_index * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Autonomy Hull Radius:</span>
              <span className="font-semibold">{node_a.autonomy_radius.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Entropy Flux:</span>
              <span className="font-semibold">{node_a.entropy_flux.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Node B Card */}
        <div className={`p-3 rounded-lg border space-y-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-600 dark:text-blue-400">Node B (Recipient)</span>
            <span className="text-[10px] opacity-75">ID: {node_b.id}</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="opacity-70">Coordinates (x, y, z):</span>
              <span className="font-semibold">
                [{node_b.position.x.toFixed(2)}, {node_b.position.y.toFixed(2)}, {node_b.position.z.toFixed(2)}]
              </span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Capacity Index:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {(node_b.capacity_index * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Autonomy Hull Radius:</span>
              <span className="font-semibold">{node_b.autonomy_radius.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Entropy Flux:</span>
              <span className="font-semibold">{node_b.entropy_flux.toFixed(3)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vector V1 Coupling State */}
      <div className={`p-2.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
        isLight ? 'bg-cyan-50/70 border-cyan-200 text-cyan-950' : 'bg-cyan-950/40 border-cyan-900/60 text-cyan-200'
      }`}>
        <div className="flex items-center gap-2">
          <CircleDot className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
          <span className="font-bold">Applied Influence Vector V₁:</span>
          <span>
            [{influence_vector_v1.x.toFixed(2)}, {influence_vector_v1.y.toFixed(2)}, {influence_vector_v1.z.toFixed(2)}]
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="opacity-75">Magnitude:</span>
          <span className="font-bold">{influence_magnitude.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
};
