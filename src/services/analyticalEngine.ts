/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SimulationBranch,
  SealedReferenceSpecification,
  EvaluatedBranchResult,
  ComparatorOutput,
  ComparativeVerdict,
  MatchType,
  ConvergenceTrajectory,
  ConvergenceClassification,
  StateSnapshot,
  BranchSensitivityMetric,
  ParameterSensitivity
} from '../types/simulation';

export function evaluateBranchDeterministic(
  branch: SimulationBranch,
  sealedRef: SealedReferenceSpecification
): EvaluatedBranchResult {
  const { thresholds } = sealedRef;
  const history = branch.state_history;

  if (!history || history.length === 0) {
    return {
      branch_id: branch.branch_id,
      bifurcation_origin_step: branch.bifurcation_origin_step,
      parameter_deltas: branch.parameter_deltas,
      convergence_score: 0.0,
      match_type: 'unsupported',
      earliest_convergent_timestep: null,
      convergence_trajectory: 'stable',
      key_structural_evidence: ['Zero state history available for evaluation'],
      alternative_explanations: ['Insufficient telemetry records'],
      divergence_turning_point: null,
      convergence_classification: 'none'
    };
  }

  // Calculate scores per snapshot
  const snapshotScores: { step: number; score: number; snapshot: StateSnapshot }[] = history.map(snap => {
    // Distance to target thresholds
    const a = Math.min(1.0, snap.autonomy_index / thresholds.autonomy_index);
    const c = Math.min(1.0, snap.coercion_resistance / thresholds.coercion_resistance);
    const d = Math.min(1.0, snap.decentralized_sovereignty / thresholds.decentralized_sovereignty);
    const e = Math.min(1.0, snap.cognitive_emancipation / thresholds.cognitive_emancipation);
    const t = Math.min(1.0, snap.teleological_coherence / thresholds.teleological_coherence);

    // Weighted harmonic mean or normalized mean (weighted toward non-coercion & decentralized sovereignty)
    const score = (a * 0.25 + c * 0.25 + d * 0.25 + e * 0.15 + t * 0.10);
    return { step: snap.step, score: Number(score.toFixed(3)), snapshot: snap };
  });

  // Peak convergence score during branch lifespan
  const maxScoreObj = snapshotScores.reduce((max, curr) => curr.score > max.score ? curr : max, snapshotScores[0]);
  const finalScoreObj = snapshotScores[snapshotScores.length - 1];
  
  // Use representative peak convergence score (evaluating branch capability before extinction if extinct)
  const convergence_score = maxScoreObj.score;

  // Find earliest convergent timestep (score >= 0.85)
  const earliestHit = snapshotScores.find(s => s.score >= 0.85);
  const earliest_convergent_timestep = earliestHit ? earliestHit.step : null;

  // Determine trajectory
  let convergence_trajectory: ConvergenceTrajectory = 'stable';
  const firstScore = snapshotScores[0].score;
  const lastScore = finalScoreObj.score;
  const delta = lastScore - firstScore;

  let variance = 0;
  for (let i = 1; i < snapshotScores.length; i++) {
    variance += Math.abs(snapshotScores[i].score - snapshotScores[i - 1].score);
  }
  const avgVariance = variance / Math.max(1, snapshotScores.length - 1);

  if (avgVariance > 0.20 && Math.abs(delta) < 0.15) {
    convergence_trajectory = 'erratic';
  } else if (delta > 0.12) {
    convergence_trajectory = 'strengthening';
  } else if (delta < -0.12) {
    convergence_trajectory = 'weakening';
  } else {
    convergence_trajectory = 'stable';
  }

  // Check turning point (where score drops by >= 0.15 from a local high)
  let divergence_turning_point: number | null = null;
  for (let i = 1; i < snapshotScores.length; i++) {
    if (snapshotScores[i - 1].score >= 0.70 && snapshotScores[i].score < snapshotScores[i - 1].score - 0.15) {
      divergence_turning_point = snapshotScores[i].step;
      break;
    }
  }

  // Determine Match Type
  let match_type: MatchType = 'divergent';
  if (convergence_score >= 0.94) match_type = 'exact';
  else if (convergence_score >= 0.84) match_type = 'strong';
  else if (convergence_score >= 0.65) match_type = 'partial';
  else if (convergence_score >= 0.40) match_type = 'weak';
  else match_type = 'divergent';

  // Determine 4-Tier Convergence Classification
  let convergence_classification: ConvergenceClassification = 'none';
  const hasMetaphoricalMarker = branch.blind_inferences.some(inf => 
    inf.structural_markers.includes('metaphorical_resemblance') || inf.observation.toLowerCase().includes('metaphorical')
  );

  if (hasMetaphoricalMarker) {
    convergence_classification = 'metaphorical';
    if (match_type === 'strong' || match_type === 'exact') {
      match_type = 'partial'; // Downgrade per Rule 3
    }
  } else if (convergence_score >= 0.80) {
    // Check if derived or direct
    const isEmergent = Object.keys(branch.parameter_deltas).some(k => k.includes('adaptive') || k.includes('mycelial'));
    convergence_classification = isEmergent ? 'derived' : 'direct';
  } else if (convergence_score >= 0.45) {
    convergence_classification = 'derived';
  } else {
    convergence_classification = 'none';
  }

  // Structural Evidence
  const key_structural_evidence: string[] = [];
  if (earliestHit) {
    key_structural_evidence.push(
      `Crossed target Freedom resonance threshold at Step ${earliestHit.step} with autonomy index ${earliestHit.snapshot.autonomy_index.toFixed(2)}.`
    );
  }
  if (maxScoreObj.snapshot.decentralized_sovereignty >= thresholds.decentralized_sovereignty) {
    key_structural_evidence.push(
      `Decentralized sovereignty peak (${maxScoreObj.snapshot.decentralized_sovereignty.toFixed(2)}) fulfills polycentric non-hierarchy criterion.`
    );
  }
  if (maxScoreObj.snapshot.coercion_resistance >= thresholds.coercion_resistance) {
    key_structural_evidence.push(
      `Coercion resistance (${maxScoreObj.snapshot.coercion_resistance.toFixed(2)}) robustly satisfies anti-monopoly threshold.`
    );
  }
  branch.blind_inferences.forEach(inf => {
    key_structural_evidence.push(`Blind Inference [${inf.observer_id} @ Step ${inf.step}]: ${inf.observation}`);
  });

  // Alternative Explanations
  const alternative_explanations: string[] = [];
  if (convergence_classification === 'metaphorical') {
    alternative_explanations.push(
      'Metaphorical resemblance detected: Superficial institutional decentralization masks underlying oligopolistic or administrative dominance.'
    );
  }
  if (branch.status === 'extinct' && convergence_score >= 0.80) {
    alternative_explanations.push(
      `Physical extinction at Step ${branch.extinction_step} was precipitated by extrinsic resource starvation, not ideological or topological failure.`
    );
  }
  if (divergence_turning_point) {
    alternative_explanations.push(
      `Systemic divergence initiated at Step ${divergence_turning_point} due to rapid destabilization of coordinating manifolds.`
    );
  }
  if (convergence_score < 0.60) {
    alternative_explanations.push(
      'Orthogonal evolution: Parameter space optimized for centralized equilibrium rather than voluntary agency.'
    );
  }

  return {
    branch_id: branch.branch_id,
    bifurcation_origin_step: branch.bifurcation_origin_step,
    parameter_deltas: branch.parameter_deltas,
    convergence_score,
    match_type,
    earliest_convergent_timestep,
    convergence_trajectory,
    key_structural_evidence,
    alternative_explanations,
    divergence_turning_point,
    convergence_classification
  };
}

export function evaluateSimulationDeterministic(
  branches: SimulationBranch[],
  sealedRef: SealedReferenceSpecification,
  survivingBranchId: string
): ComparatorOutput {
  const evaluated_branches = branches.map(b => evaluateBranchDeterministic(b, sealedRef));

  const survivingBranchResult = evaluated_branches.find(b => b.branch_id === survivingBranchId);
  const survivingScore = survivingBranchResult ? survivingBranchResult.convergence_score : 0;

  // Filter divergent or extinct branches
  const alternateBranches = evaluated_branches.filter(b => b.branch_id !== survivingBranchId);
  const highestAltBranch = alternateBranches.reduce(
    (max, curr) => curr.convergence_score > max.convergence_score ? curr : max,
    alternateBranches[0] || { convergence_score: 0 }
  );

  const strongMatches = evaluated_branches.filter(b => b.convergence_score >= 0.84);

  let summary_conclusion: ComparativeVerdict = 'SYSTEMIC_DIVERGENCE';
  let comparative_analysis = '';

  if (strongMatches.length >= 2 && !strongMatches.every(m => m.branch_id === survivingBranchId)) {
    // Check if independent multiple convergence
    summary_conclusion = 'INDEPENDENT_MULTIPLE_CONVERGENCE';
    comparative_analysis = `Multiple distinct evolutionary branches ([${strongMatches.map(m => m.branch_id).join(', ')}]) independently achieved high-resonance structural convergence to the sealed Freedom specification through distinct systemic topological mechanisms.`;
  } else if (highestAltBranch && highestAltBranch.convergence_score > survivingScore + 0.10 && highestAltBranch.convergence_score >= 0.80) {
    summary_conclusion = 'DIVERGENT_BRANCH_SUPERIOR';
    comparative_analysis = `Divergent/extinct branch ${highestAltBranch.branch_id} achieved closer convergence (${highestAltBranch.convergence_score.toFixed(2)}) to the sealed Freedom specification than surviving primary branch ${survivingBranchId} (${survivingScore.toFixed(2)}). The primary surviving run prioritized systemic endurance over emancipated sovereignty.`;
  } else if (survivingScore >= 0.82 && survivingScore >= (highestAltBranch?.convergence_score || 0)) {
    summary_conclusion = 'SURVIVING_BRANCH_OPTIMAL';
    comparative_analysis = `The primary surviving branch ${survivingBranchId} sustained optimal convergence (${survivingScore.toFixed(2)}) across the simulation horizon, successfully balancing non-coercive agency with systemic resilience. Alternate offshoots suffered structural collapse or deviation.`;
  } else {
    summary_conclusion = 'SYSTEMIC_DIVERGENCE';
    comparative_analysis = `No evaluated branch attained sufficient resonance with the sealed Freedom specification. All trajectories succumbed to coercive institutionalization, autocratic backsliding, or entropic collapse.`;
  }

  return {
    evaluated_branches,
    summary_conclusion,
    comparative_analysis,
    timestamp: new Date().toISOString(),
    evaluator_engine: 'deterministic-analytical-engine'
  };
}

export function calculateBranchSensitivity(
  branch: SimulationBranch,
  survivingBranch: SimulationBranch,
  sealedRef: SealedReferenceSpecification,
  perturbationRatio: number = 0.05
): BranchSensitivityMetric {
  const branchEval = evaluateBranchDeterministic(branch, sealedRef);
  const baselineScore = branchEval.convergence_score;

  // Compute parameter-level sensitivity breakdown
  const deltas = branch.parameter_deltas || {};
  const paramKeys = Object.keys(deltas);

  const parameterBreakdown: ParameterSensitivity[] = paramKeys.map(key => {
    const rawVal = deltas[key];
    const numVal = typeof rawVal === 'number' ? rawVal : parseFloat(String(rawVal).replace(/[+]/g, '')) || 0.5;

    // Determine parameter sensitivity coefficient based on simulation dynamics
    let sensitivityCoeff = 1.2;
    let direction: 'positive' | 'negative' | 'neutral' = 'positive';
    let explanation = '';

    if (key.includes('coercion') || key.includes('damping')) {
      sensitivityCoeff = 1.8;
      direction = 'positive';
      explanation = 'High leverage on anti-coercive non-hierarchy invariance.';
    } else if (key.includes('locking') || key.includes('surveillance') || key.includes('emergency')) {
      sensitivityCoeff = 2.1;
      direction = 'negative';
      explanation = 'Severe negative attractor; small increases precipitate authoritarian lock.';
    } else if (key.includes('variance') || key.includes('emancipation')) {
      sensitivityCoeff = 1.4;
      direction = 'positive';
      explanation = 'Direct driver of cognitive plasticity and self-directed agency.';
    } else if (key.includes('redundancy') || key.includes('energy')) {
      sensitivityCoeff = 1.9;
      direction = 'positive';
      explanation = 'Thermodynamic boundary condition; drop below critical floor causes extinction.';
    } else if (key.includes('inertia') || key.includes('friction')) {
      sensitivityCoeff = 0.6;
      direction = 'negative';
      explanation = 'Dampens adaptive topological updates.';
    } else {
      sensitivityCoeff = 1.0;
      direction = numVal >= 0 ? 'positive' : 'negative';
      explanation = 'Secondary operational tuning manifold.';
    }

    // Impact on score for a shift of perturbationRatio
    const impact = Number((sensitivityCoeff * perturbationRatio * Math.max(0.5, Math.abs(numVal))).toFixed(3));
    const elasticity: 'high' | 'moderate' | 'low' = impact >= 0.07 ? 'high' : impact >= 0.035 ? 'moderate' : 'low';

    return {
      parameter_name: key,
      base_value: rawVal,
      delta_impact: impact,
      elasticity,
      direction,
      explanation
    };
  });

  // Calculate overall sensitivity for chosen branch
  const overallSensitivity = parameterBreakdown.length > 0
    ? Number((parameterBreakdown.reduce((sum, p) => sum + p.delta_impact, 0) / Math.max(1, Math.min(3, parameterBreakdown.length))).toFixed(3))
    : Number((0.15 * (perturbationRatio / 0.05)).toFixed(3));

  // Calculate surviving baseline sensitivity
  const survivingDeltas = survivingBranch.parameter_deltas || {};
  const survivingKeys = Object.keys(survivingDeltas);
  let survivingSensitivitySum = 0;
  survivingKeys.forEach(k => {
    if (k.includes('inertia')) survivingSensitivitySum += 0.03 * (perturbationRatio / 0.05);
    else if (k.includes('centralization')) survivingSensitivitySum += 0.05 * (perturbationRatio / 0.05);
    else survivingSensitivitySum += 0.04 * (perturbationRatio / 0.05);
  });
  const survivingSensitivity = Number(Math.max(0.04, survivingSensitivitySum / Math.max(1, survivingKeys.length)).toFixed(3));

  const comparativeRatio = Number((overallSensitivity / Math.max(0.01, survivingSensitivity)).toFixed(1));

  let basin_stability: 'fragile_tipping_point' | 'elastic_adaptive_zone' | 'resilient_attractor_basin' = 'elastic_adaptive_zone';
  if (overallSensitivity >= 0.14) {
    basin_stability = 'fragile_tipping_point';
  } else if (overallSensitivity >= 0.07) {
    basin_stability = 'elastic_adaptive_zone';
  } else {
    basin_stability = 'resilient_attractor_basin';
  }

  const minusShift = Number(Math.max(0, baselineScore - overallSensitivity).toFixed(3));
  const plusShift = Number(Math.min(1.0, baselineScore + overallSensitivity).toFixed(3));

  return {
    branch_id: branch.branch_id,
    overall_sensitivity_score: overallSensitivity,
    comparative_ratio_to_surviving: comparativeRatio,
    basin_stability,
    parameter_breakdown: parameterBreakdown,
    projected_score_range: {
      minus_shift: minusShift,
      baseline: baselineScore,
      plus_shift: plusShift
    },
    perturbation_pct: Math.round(perturbationRatio * 100)
  };
}

