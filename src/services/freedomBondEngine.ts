/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FreedomBondScenario,
  FreedomBondSnapshot,
  BondStageId,
  CompersionObservables,
  StateClassification,
  NodeStateSpace,
  Vector3D
} from '../types/freedomBond';

/**
 * Calculates continuous snapshot at normalized timestamp t in [0.0, 4.0]
 * Stage A: [0, 1) -> Baseline (x)
 * Stage B: [1, 2) -> Applied Influence (V1)
 * Stage C: [2, 3) -> State Delta (z)
 * Stage D: [3, 4] -> Persistence Removal (z')
 */
export function computeBondSnapshot(
  scenario: FreedomBondScenario,
  t: number
): FreedomBondSnapshot {
  const clampedT = Math.max(0, Math.min(4.0, t));

  let stage: BondStageId = 'STAGE_A';
  let progressInStage = 0;

  if (clampedT < 1.0) {
    stage = 'STAGE_A';
    progressInStage = clampedT;
  } else if (clampedT < 2.0) {
    stage = 'STAGE_B';
    progressInStage = clampedT - 1.0;
  } else if (clampedT < 3.0) {
    stage = 'STAGE_C';
    progressInStage = clampedT - 2.0;
  } else {
    stage = 'STAGE_D';
    progressInStage = Math.min(1.0, clampedT - 3.0);
  }

  const {
    initial_node_a,
    initial_node_b,
    vector_v1_peak,
    resonance_coefficient,
    extraction_factor,
    subsumption_risk,
    relaxation_lambda
  } = scenario;

  // Compute Influence Vector V1 at current t
  let v1Factor = 0;
  if (clampedT < 1.0) {
    v1Factor = 0; // Stage A: zero influence
  } else if (clampedT < 2.0) {
    // Stage B: ramps up from 0 to 1
    v1Factor = smoothStep(progressInStage);
  } else if (clampedT < 3.0) {
    // Stage C: sustained influence V1
    v1Factor = 1.0;
  } else {
    // Stage D: persistence removal: ramps down from 1 to 0
    v1Factor = Math.max(0, 1.0 - smoothStep(progressInStage));
  }

  const currentV1: Vector3D = {
    x: vector_v1_peak.x * v1Factor,
    y: vector_v1_peak.y * v1Factor,
    z: vector_v1_peak.z * v1Factor
  };
  const v1Magnitude = Math.sqrt(
    currentV1.x * currentV1.x + currentV1.y * currentV1.y + currentV1.z * currentV1.z
  );

  // Position shifts
  // Under extraction, Node A pulls Node B towards it (loss of distinctness)
  // Under authentic symbiosis, Node B moves outward and resonates safely
  let nodeAPos: Vector3D = { ...initial_node_a.position };
  let nodeBPos: Vector3D = { ...initial_node_b.position };

  if (clampedT >= 1.0) {
    const interactionT = clampedT - 1.0; // [0, 3]
    if (scenario.expected_classification === 'FORCED') {
      // Coercive capture: Node B is dragged towards Node A
      const captureRatio = Math.min(0.65, (interactionT / 3.0) * subsumption_risk);
      nodeBPos.x = initial_node_b.position.x - (initial_node_b.position.x - initial_node_a.position.x) * captureRatio * 0.55;
      nodeBPos.y = initial_node_b.position.y + Math.sin(interactionT * 4) * 0.15;
      nodeBPos.z = initial_node_b.position.z + Math.cos(interactionT * 3) * 0.1;
    } else if (scenario.expected_classification === 'SELF_SUSTAINING') {
      // Harmonic resonance: slight breathing oscillation, pristine stability
      const breath = Math.sin(interactionT * Math.PI) * 0.15;
      nodeAPos.x = initial_node_a.position.x - breath * 0.2;
      nodeBPos.x = initial_node_b.position.x + breath * 0.2;
    } else if (scenario.expected_classification === 'ADAPTED') {
      // Smooth displacement into adapted equilibrium
      const adapt = Math.min(1.0, interactionT / 2.0);
      nodeAPos.y = initial_node_a.position.y + adapt * 0.25;
      nodeBPos.y = initial_node_b.position.y - adapt * 0.25;
    }
  }

  // Node telemetry evolution
  let capA = initial_node_a.capacity_index;
  let capB = initial_node_b.capacity_index;
  let autoA = initial_node_a.autonomy_radius;
  let autoB = initial_node_b.autonomy_radius;
  let entropyA = initial_node_a.entropy_flux;
  let entropyB = initial_node_b.entropy_flux;

  if (clampedT >= 1.0 && clampedT < 3.0) {
    // Stage B and C
    const factor = (clampedT - 1.0) / 2.0;
    if (scenario.expected_classification === 'SELF_SUSTAINING') {
      capB += factor * 0.15 * resonance_coefficient;
      capA += factor * 0.06 * resonance_coefficient;
      entropyB = Math.max(0.04, entropyB - factor * 0.05);
      entropyA = Math.max(0.05, entropyA - factor * 0.03);
    } else if (scenario.expected_classification === 'FORCED') {
      capA += factor * 0.12 * extraction_factor; // parasitic gain for A
      capB = Math.max(0.18, capB - factor * 0.35 * extraction_factor); // severe depletion for B
      autoB = Math.max(0.35, autoB - factor * 0.45 * subsumption_risk); // boundary curtailment
      entropyB += factor * 0.45 * extraction_factor; // high disorder in B
    } else if (scenario.expected_classification === 'ADAPTED') {
      capB += factor * 0.08;
      capA += factor * 0.04;
      autoB = Math.max(0.85, autoB - factor * 0.05);
      entropyB += factor * 0.08;
    }
  } else if (clampedT >= 3.0) {
    // Stage D: persistence removal relaxation
    const relax = progressInStage;
    if (scenario.expected_classification === 'SELF_SUSTAINING') {
      // Retains and crystallizes capacity gain indefinitely (self-sustaining!)
      capB = initial_node_b.capacity_index + 0.15 * resonance_coefficient;
      capA = initial_node_a.capacity_index + 0.06 * resonance_coefficient;
      entropyB = 0.05;
      entropyA = 0.06;
    } else if (scenario.expected_classification === 'FORCED') {
      // Rapid collapse without external coercion holding it
      capB = Math.max(0.15, initial_node_b.capacity_index - 0.35 * (1.0 - relax * 0.5));
      autoB = Math.max(0.30, 0.45 - relax * 0.15);
      entropyB = Math.min(0.95, 0.65 + relax * 0.25);
    } else if (scenario.expected_classification === 'ADAPTED') {
      capB = initial_node_b.capacity_index + 0.06;
      capA = initial_node_a.capacity_index + 0.03;
      entropyB = 0.18;
    }
  }

  // Five Compersion Observables
  let b_gain_verified = 0.5;
  let a_response_positive = 0.5;
  let non_deprivation = 0.5;
  let non_capture = 0.5;
  let distinctness_maintained = 0.5;

  if (clampedT < 1.0) {
    // Stage A Baseline
    b_gain_verified = 0.5;
    a_response_positive = 0.85;
    non_deprivation = 1.0;
    non_capture = 1.0;
    distinctness_maintained = 1.0;
  } else {
    if (scenario.expected_classification === 'SELF_SUSTAINING') {
      b_gain_verified = Math.min(1.0, 0.75 + progressInStage * 0.22 * resonance_coefficient);
      a_response_positive = Math.min(1.0, 0.88 + progressInStage * 0.10);
      non_deprivation = Math.min(1.0, 0.96 + (1 - extraction_factor) * 0.03);
      non_capture = Math.min(1.0, 0.95 + (1 - subsumption_risk) * 0.04);
      distinctness_maintained = 0.98;
    } else if (scenario.expected_classification === 'FORCED') {
      b_gain_verified = Math.max(0.05, 0.40 - extraction_factor * 0.35);
      a_response_positive = Math.max(0.10, 0.25 - extraction_factor * 0.15); // zero-sum extraction
      non_deprivation = Math.max(0.04, 0.80 - clampedT * 0.22 * extraction_factor);
      non_capture = Math.max(0.02, 0.85 - clampedT * 0.26 * subsumption_risk);
      // Topological distance between A and B
      const dist = Math.sqrt(
        Math.pow(nodeAPos.x - nodeBPos.x, 2) +
        Math.pow(nodeAPos.y - nodeBPos.y, 2) +
        Math.pow(nodeAPos.z - nodeBPos.z, 2)
      );
      distinctness_maintained = Math.max(0.05, Math.min(1.0, dist / 4.4));
    } else if (scenario.expected_classification === 'ADAPTED') {
      b_gain_verified = 0.72;
      a_response_positive = 0.75;
      non_deprivation = 0.82;
      non_capture = 0.78;
      distinctness_maintained = 0.88;
    } else {
      b_gain_verified = 0.50;
      a_response_positive = 0.85;
      non_deprivation = 0.99;
      non_capture = 0.99;
      distinctness_maintained = 0.99;
    }
  }

  // Composite Compersion metric (geometric mean)
  const compersion_composite = Number(
    Math.pow(
      Math.max(0.001, b_gain_verified) *
      Math.max(0.001, a_response_positive) *
      Math.max(0.001, non_deprivation) *
      Math.max(0.001, non_capture) *
      Math.max(0.001, distinctness_maintained),
      0.2
    ).toFixed(4)
  );

  // State classification determination
  let state_classification: StateClassification = 'BASELINE';
  if (clampedT < 1.0) {
    state_classification = 'BASELINE';
  } else if (clampedT < 3.0) {
    if (scenario.expected_classification === 'FORCED') {
      state_classification = non_capture < 0.65 || non_deprivation < 0.65 ? 'FORCED' : 'ADAPTED';
    } else if (scenario.expected_classification === 'SELF_SUSTAINING') {
      state_classification = 'SELF_SUSTAINING';
    } else if (scenario.expected_classification === 'ADAPTED') {
      state_classification = 'ADAPTED';
    }
  } else {
    // Stage D determines the terminal classification
    state_classification = scenario.expected_classification;
  }

  const nodeA: NodeStateSpace = {
    ...initial_node_a,
    position: nodeAPos,
    capacity_index: Number(capA.toFixed(4)),
    autonomy_radius: Number(autoA.toFixed(4)),
    entropy_flux: Number(entropyA.toFixed(4))
  };

  const nodeB: NodeStateSpace = {
    ...initial_node_b,
    position: nodeBPos,
    capacity_index: Number(capB.toFixed(4)),
    autonomy_radius: Number(autoB.toFixed(4)),
    entropy_flux: Number(entropyB.toFixed(4))
  };

  const observables: CompersionObservables = {
    b_gain_verified: Number(b_gain_verified.toFixed(4)),
    a_response_positive: Number(a_response_positive.toFixed(4)),
    non_deprivation: Number(non_deprivation.toFixed(4)),
    non_capture: Number(non_capture.toFixed(4)),
    distinctness_maintained: Number(distinctness_maintained.toFixed(4))
  };

  const phase_space_point = {
    autonomy_delta_a: Number((capA - initial_node_a.capacity_index).toFixed(4)),
    autonomy_delta_b: Number((capB - initial_node_b.capacity_index).toFixed(4)),
    lyapunov_exponent: scenario.expected_classification === 'SELF_SUSTAINING'
      ? -0.12
      : scenario.expected_classification === 'FORCED'
      ? 0.42
      : -0.03,
    attractor_distance: scenario.expected_classification === 'SELF_SUSTAINING'
      ? 0.05
      : scenario.expected_classification === 'FORCED'
      ? 0.78
      : 0.22
  };

  return {
    stage,
    progress: Number(progressInStage.toFixed(3)),
    timestamp_normalized: Number(clampedT.toFixed(3)),
    node_a: nodeA,
    node_b: nodeB,
    influence_vector_v1: currentV1,
    influence_magnitude: Number(v1Magnitude.toFixed(4)),
    observables,
    compersion_composite,
    state_classification,
    phase_space_point
  };
}

function smoothStep(x: number): number {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
}
