/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BondStageId = 'STAGE_A' | 'STAGE_B' | 'STAGE_C' | 'STAGE_D';

export interface BondStageDefinition {
  id: BondStageId;
  label: string;
  subLabel: string;
  mathSymbol: 'x' | 'V1' | 'z' | "z'";
  description: string;
}

export type StateClassification = 'SELF_SUSTAINING' | 'FORCED' | 'ADAPTED' | 'BASELINE';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface NodeStateSpace {
  id: 'NODE_A' | 'NODE_B';
  label: string;
  position: Vector3D;
  velocity: Vector3D;
  autonomy_radius: number;
  capacity_index: number;
  entropy_flux: number;
  boundary_charge: number;
}

export interface CompersionObservables {
  b_gain_verified: number; // [0, 1] Net capacity gain of Node B without extraction
  a_response_positive: number; // [0, 1] Node A positive resonance to Node B flourishing
  non_deprivation: number; // [0, 1] Baseline resources preserved without curtailment
  non_capture: number; // [0, 1] Node B sovereignty gradients preserved
  distinctness_maintained: number; // [0, 1] Topological boundary separation preserved
}

export interface FreedomBondSnapshot {
  stage: BondStageId;
  progress: number; // [0, 1] within stage
  timestamp_normalized: number; // [0, 4] continuous
  node_a: NodeStateSpace;
  node_b: NodeStateSpace;
  influence_vector_v1: Vector3D;
  influence_magnitude: number;
  observables: CompersionObservables;
  compersion_composite: number; // geometric or weighted composite
  state_classification: StateClassification;
  phase_space_point: {
    autonomy_delta_a: number;
    autonomy_delta_b: number;
    lyapunov_exponent: number;
    attractor_distance: number;
  };
}

export interface FreedomBondScenario {
  id: string;
  title: string;
  code: string;
  summary: string;
  expected_classification: StateClassification;
  initial_node_a: NodeStateSpace;
  initial_node_b: NodeStateSpace;
  vector_v1_peak: Vector3D;
  vector_v1_decay_rate: number;
  resonance_coefficient: number;
  extraction_factor: number;
  subsumption_risk: number;
  relaxation_lambda: number;
  equation_notes: string;
}
