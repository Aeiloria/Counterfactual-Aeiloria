/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BranchStatus = 'surviving' | 'extinct' | 'transient' | 'divergent';

export type MatchType = 
  | 'exact' 
  | 'strong' 
  | 'partial' 
  | 'weak' 
  | 'divergent' 
  | 'unsupported';

export type ConvergenceTrajectory = 
  | 'strengthening' 
  | 'weakening' 
  | 'stable' 
  | 'erratic';

export type ComparativeVerdict = 
  | 'SURVIVING_BRANCH_OPTIMAL'
  | 'DIVERGENT_BRANCH_SUPERIOR'
  | 'INDEPENDENT_MULTIPLE_CONVERGENCE'
  | 'SYSTEMIC_DIVERGENCE';

export type ConvergenceClassification = 
  | 'direct' 
  | 'derived' 
  | 'metaphorical' 
  | 'none';

export interface StateSnapshot {
  step: number;
  autonomy_index: number;
  coercion_resistance: number;
  decentralized_sovereignty: number;
  cognitive_emancipation: number;
  teleological_coherence: number;
  structural_entropy: number;
  population_nodes: number;
  system_integrity: number;
}

export interface ImmutableEventLog {
  event_id: string;
  step: number;
  event_code: string;
  description: string;
  raw_hash: string;
  immutable_verified: boolean;
}

export interface BlindInference {
  inference_id: string;
  step: number;
  observer_id: string;
  observation: string;
  confidence_score: number;
  structural_markers: string[];
}

export interface SimulationBranch {
  branch_id: string;
  name: string;
  parent_branch_id: string | null;
  bifurcation_origin_step: number;
  extinction_step: number | null;
  status: BranchStatus;
  color: string;
  parameter_deltas: Record<string, string | number>;
  narrative_context: string;
  state_history: StateSnapshot[];
  raw_event_logs: ImmutableEventLog[];
  blind_inferences: BlindInference[];
}

export interface SealedReferenceSpecification {
  specification_id: string;
  target_name: string; // e.g., "Freedom"
  cryptographic_seal_hash: string;
  sealed_epoch: string;
  pipeline_stage: string;
  thresholds: {
    autonomy_index: number;
    coercion_resistance: number;
    decentralized_sovereignty: number;
    cognitive_emancipation: number;
    teleological_coherence: number;
  };
  dimension_descriptions: Record<string, string>;
  invariance_constraints: string[];
}

export interface EvaluatedBranchResult {
  branch_id: string;
  bifurcation_origin_step: number;
  parameter_deltas: Record<string, any>;
  convergence_score: number; // 0.0 to 1.0
  match_type: MatchType;
  earliest_convergent_timestep: number | null;
  convergence_trajectory: ConvergenceTrajectory;
  key_structural_evidence: string[];
  alternative_explanations: string[];
  divergence_turning_point: number | null;
  // Metadata for UI richness
  convergence_classification?: ConvergenceClassification;
}

export interface ComparatorOutput {
  evaluated_branches: EvaluatedBranchResult[];
  summary_conclusion: ComparativeVerdict;
  comparative_analysis: string;
  timestamp?: string;
  evaluator_engine?: 'gemini-3.8-flash' | 'deterministic-analytical-engine';
}

export interface ParameterSensitivity {
  parameter_name: string;
  base_value: string | number;
  delta_impact: number;
  elasticity: 'high' | 'moderate' | 'low';
  direction: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

export interface BranchSensitivityMetric {
  branch_id: string;
  overall_sensitivity_score: number;
  comparative_ratio_to_surviving: number;
  basin_stability: 'fragile_tipping_point' | 'elastic_adaptive_zone' | 'resilient_attractor_basin';
  parameter_breakdown: ParameterSensitivity[];
  projected_score_range: {
    minus_shift: number;
    baseline: number;
    plus_shift: number;
  };
  perturbation_pct: number;
}

export interface SimulationScenario {
  id: string;
  title: string;
  subtitle: string;
  expected_verdict: ComparativeVerdict;
  description: string;
  surviving_branch_id: string;
  sealed_reference: SealedReferenceSpecification;
  branches: SimulationBranch[];
}
