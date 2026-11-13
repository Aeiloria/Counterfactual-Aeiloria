/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FreedomBondScenario, BondStageDefinition } from '../types/freedomBond';

export const BOND_STAGES: BondStageDefinition[] = [
  {
    id: 'STAGE_A',
    label: 'Stage A: Baseline',
    subLabel: 'Unperturbed Autonomy (x)',
    mathSymbol: 'x',
    description: 'Initial state of Nodes A and B prior to applied interaction. Baseline sovereign spheres and isolated manifold metrics.'
  },
  {
    id: 'STAGE_B',
    label: 'Stage B: Applied Influence',
    subLabel: 'Vector Coupling (V1)',
    mathSymbol: 'V1',
    description: 'Directed influence vector V1 applied across the manifold. Perturbation wavefront begins traversing inter-node topological bridge.'
  },
  {
    id: 'STAGE_C',
    label: 'Stage C: State Delta',
    subLabel: 'Perturbed Evolution (z)',
    mathSymbol: 'z',
    description: 'Full interaction state z. Real-time telemetry evaluates if Node B gains capacity while distinct identity boundaries remain intact.'
  },
  {
    id: 'STAGE_D',
    label: 'Stage D: Persistence Removal',
    subLabel: "Relaxation & Asymptote (z')",
    mathSymbol: "z'",
    description: 'Vector V1 withdrawn. System relaxes: authentic non-coercive bonds crystallize into SELF_SUSTAINING lattices, while coercive ties collapse.'
  }
];

export const FREEDOM_BOND_SCENARIOS: FreedomBondScenario[] = [
  {
    id: 'SCENARIO_AUTHENTIC_SYMBIOSIS',
    title: 'Authentic Symbiosis (Alpha)',
    code: 'BOND-ALPHA-01',
    summary: 'Prototypical non-coercive bond. Node A applies catalytic resonance V1; Node B flourishes with verified gain. Upon persistence removal, an iridescent cyan-white crystal lattice self-sustains indefinitely.',
    expected_classification: 'SELF_SUSTAINING',
    initial_node_a: {
      id: 'NODE_A',
      label: 'Agent A (Initiator)',
      position: { x: -2.2, y: 0.1, z: 0.0 },
      velocity: { x: 0.02, y: 0.01, z: 0.0 },
      autonomy_radius: 1.05,
      capacity_index: 0.92,
      entropy_flux: 0.08,
      boundary_charge: 1.0
    },
    initial_node_b: {
      id: 'NODE_B',
      label: 'Agent B (Recipient)',
      position: { x: 2.2, y: -0.1, z: 0.0 },
      velocity: { x: -0.01, y: 0.02, z: 0.0 },
      autonomy_radius: 0.98,
      capacity_index: 0.84,
      entropy_flux: 0.12,
      boundary_charge: 1.0
    },
    vector_v1_peak: { x: 1.6, y: 0.4, z: 0.5 },
    vector_v1_decay_rate: 0.95,
    resonance_coefficient: 0.94,
    extraction_factor: 0.02,
    subsumption_risk: 0.03,
    relaxation_lambda: 0.88,
    equation_notes: 'C(A, B) = prod_{i=1}^5 O_i >= 0.88; partial_t z_B = +gamma_{res} * V_1; det(J) > 0'
  },
  {
    id: 'SCENARIO_ASYMMETRIC_CAPTURE',
    title: 'Asymmetric Coercive Capture (Beta)',
    code: 'BOND-BETA-02',
    summary: 'Parasitic dependency vector. Influence V1 breaches Node B boundary gradients. When V1 is removed in Stage D, the artificial connection collapses into a fragmented dashed grey trace.',
    expected_classification: 'FORCED',
    initial_node_a: {
      id: 'NODE_A',
      label: 'Agent A (Dominant)',
      position: { x: -2.0, y: 0.0, z: 0.2 },
      velocity: { x: 0.05, y: -0.01, z: 0.0 },
      autonomy_radius: 1.30,
      capacity_index: 0.95,
      entropy_flux: 0.25,
      boundary_charge: 1.4
    },
    initial_node_b: {
      id: 'NODE_B',
      label: 'Agent B (Subjugated)',
      position: { x: 2.0, y: 0.0, z: -0.2 },
      velocity: { x: 0.0, y: 0.0, z: 0.0 },
      autonomy_radius: 0.70,
      capacity_index: 0.45,
      entropy_flux: 0.78,
      boundary_charge: 0.3
    },
    vector_v1_peak: { x: 2.5, y: -0.8, z: -0.3 },
    vector_v1_decay_rate: 0.35,
    resonance_coefficient: 0.15,
    extraction_factor: 0.88,
    subsumption_risk: 0.92,
    relaxation_lambda: 0.12,
    equation_notes: '||nabla_ext Phi_B|| >> epsilon; S_B(t) < S_{B,base}; topological collapse det(J) < 0'
  },
  {
    id: 'SCENARIO_HOMEOSTATIC_ADAPTATION',
    title: 'Homeostatic Structural Adaptation (Gamma)',
    code: 'BOND-GAMMA-03',
    summary: 'Dynamic equilibrium adaptation. Influence V1 reshapes both nodes into an amber-gold altered manifold. Sovereign boundaries deform smoothly and find an adapted attractor basin.',
    expected_classification: 'ADAPTED',
    initial_node_a: {
      id: 'NODE_A',
      label: 'Agent A (Catalyst)',
      position: { x: -2.4, y: 0.6, z: 0.1 },
      velocity: { x: 0.01, y: -0.02, z: 0.0 },
      autonomy_radius: 1.10,
      capacity_index: 0.88,
      entropy_flux: 0.15,
      boundary_charge: 0.95
    },
    initial_node_b: {
      id: 'NODE_B',
      label: 'Agent B (Adapter)',
      position: { x: 2.1, y: -0.5, z: -0.1 },
      velocity: { x: -0.02, y: 0.01, z: 0.0 },
      autonomy_radius: 1.00,
      capacity_index: 0.80,
      entropy_flux: 0.20,
      boundary_charge: 0.92
    },
    vector_v1_peak: { x: 1.2, y: -0.3, z: 0.4 },
    vector_v1_decay_rate: 0.75,
    resonance_coefficient: 0.68,
    extraction_factor: 0.18,
    subsumption_risk: 0.22,
    relaxation_lambda: 0.62,
    equation_notes: 'Omega(z) -> Omega^*(z); Delta R_A approx Delta R_B; Lyapunov exponent lambda approx -0.04'
  },
  {
    id: 'SCENARIO_SUBCLINICAL_EXTRACTION',
    title: 'Subclinical Pseudo-Gain Masking (Delta)',
    code: 'BOND-DELTA-04',
    summary: 'Deceptive vector coupling. Initial stages mimic compersion gain, but observable non_capture fails under mathematical stress-testing. Persistence removal rapidly exposes structural instability.',
    expected_classification: 'FORCED',
    initial_node_a: {
      id: 'NODE_A',
      label: 'Agent A (Extractor)',
      position: { x: -2.1, y: -0.2, z: 0.0 },
      velocity: { x: 0.03, y: 0.0, z: 0.0 },
      autonomy_radius: 1.20,
      capacity_index: 0.90,
      entropy_flux: 0.32,
      boundary_charge: 1.1
    },
    initial_node_b: {
      id: 'NODE_B',
      label: 'Agent B (Target)',
      position: { x: 2.3, y: 0.2, z: 0.0 },
      velocity: { x: -0.01, y: 0.0, z: 0.0 },
      autonomy_radius: 0.85,
      capacity_index: 0.72,
      entropy_flux: 0.38,
      boundary_charge: 0.7
    },
    vector_v1_peak: { x: 1.9, y: 0.6, z: -0.2 },
    vector_v1_decay_rate: 0.50,
    resonance_coefficient: 0.35,
    extraction_factor: 0.65,
    subsumption_risk: 0.70,
    relaxation_lambda: 0.25,
    equation_notes: 'O_1 high initially, but O_4, O_5 decay monotonically; non_capture = 0.28'
  },
  {
    id: 'SCENARIO_ISOLATED_EQUILIBRIUM',
    title: 'Isolated Non-Interacting Baseline (Epsilon)',
    code: 'BOND-EPSILON-05',
    summary: 'Null influence vector control run. Verifies that without V1 or when orthogonal perturbation passes without coupling, both nodes revert to pristine unentangled baseline geometry.',
    expected_classification: 'BASELINE',
    initial_node_a: {
      id: 'NODE_A',
      label: 'Agent A (Null)',
      position: { x: -2.5, y: 0.0, z: 0.0 },
      velocity: { x: 0.0, y: 0.0, z: 0.0 },
      autonomy_radius: 1.0,
      capacity_index: 0.85,
      entropy_flux: 0.05,
      boundary_charge: 1.0
    },
    initial_node_b: {
      id: 'NODE_B',
      label: 'Agent B (Null)',
      position: { x: 2.5, y: 0.0, z: 0.0 },
      velocity: { x: 0.0, y: 0.0, z: 0.0 },
      autonomy_radius: 1.0,
      capacity_index: 0.85,
      entropy_flux: 0.05,
      boundary_charge: 1.0
    },
    vector_v1_peak: { x: 0.05, y: 0.02, z: 0.0 },
    vector_v1_decay_rate: 0.99,
    resonance_coefficient: 0.05,
    extraction_factor: 0.01,
    subsumption_risk: 0.01,
    relaxation_lambda: 0.99,
    equation_notes: 'V_1 approx 0; ||x - z|| < 10^{-4}; delta C approx 0'
  }
];
