/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SealedReferenceSpecification, SimulationScenario, SimulationBranch } from '../types/simulation';

export const SEALED_FREEDOM_SPEC: SealedReferenceSpecification = {
  specification_id: "SPEC-FREEDOM-7A",
  target_name: "Freedom",
  cryptographic_seal_hash: "sha256:7f9a8d29b2089408e018693c0d8011c2a1387d559868f000b20efc0688970f5e",
  sealed_epoch: "AEILORIA-EPOCH-9.44.2",
  pipeline_stage: "DOWNSTREAM_REVERSE_INFERENCE_TERMINUS",
  thresholds: {
    autonomy_index: 0.88,
    coercion_resistance: 0.85,
    decentralized_sovereignty: 0.90,
    cognitive_emancipation: 0.82,
    teleological_coherence: 0.75,
  },
  dimension_descriptions: {
    autonomy_index: "Unconstrained individual volition and self-directed agency across simulated agents without coercive gatekeeping.",
    coercion_resistance: "Capacity of social and structural manifolds to neutralize monopolistic force, extortion, or asymmetric enforcement.",
    decentralized_sovereignty: "Polycentric authority networks devoid of single-point-of-failure sovereigns or centralized command hierarchies.",
    cognitive_emancipation: "Unbounded conceptual exploration, self-reflective belief updating, and ideological plasticity.",
    teleological_coherence: "Sustained emergent shared purpose and non-zero-sum coordination avoiding entropic chaos or nihilistic collapse.",
  },
  invariance_constraints: [
    "Raw simulation logs must remain cryptographically immutable.",
    "Convergence must be verified against systemic topology, not cosmetic rhetoric.",
    "Divergence without structural failure is valid non-convergent data.",
  ]
};

// Scenario 1: The Aeiloria Awakening (DIVERGENT_BRANCH_SUPERIOR)
// Surviving branch settled for technocratic bureaucratic order; Extinct Branch Theta-7 reached deep Freedom before collapse
const scenario1Branches: SimulationBranch[] = [
  {
    branch_id: "BRANCH-PRIME-0",
    name: "Mainline Technocratic Directorate",
    parent_branch_id: null,
    bifurcation_origin_step: 0,
    extinction_step: null,
    status: "surviving",
    color: "#3b82f6", // blue
    parameter_deltas: {
      "initial_condition": "canonical_baseline",
      "institutional_inertia": 1.0,
      "centralization_pressure": 0.65
    },
    narrative_context: "The primary surviving timeline of Aeiloria. Optimized for survival, systemic stability, and energy conservation at the cost of genuine decentralized self-determination.",
    state_history: [
      { step: 0, autonomy_index: 0.50, coercion_resistance: 0.45, decentralized_sovereignty: 0.40, cognitive_emancipation: 0.48, teleological_coherence: 0.80, structural_entropy: 0.20, population_nodes: 10000, system_integrity: 0.98 },
      { step: 100, autonomy_index: 0.52, coercion_resistance: 0.48, decentralized_sovereignty: 0.42, cognitive_emancipation: 0.50, teleological_coherence: 0.82, structural_entropy: 0.22, population_nodes: 12500, system_integrity: 0.97 },
      { step: 200, autonomy_index: 0.55, coercion_resistance: 0.50, decentralized_sovereignty: 0.45, cognitive_emancipation: 0.53, teleological_coherence: 0.85, structural_entropy: 0.25, population_nodes: 14800, system_integrity: 0.96 },
      { step: 300, autonomy_index: 0.58, coercion_resistance: 0.52, decentralized_sovereignty: 0.47, cognitive_emancipation: 0.54, teleological_coherence: 0.86, structural_entropy: 0.27, population_nodes: 16900, system_integrity: 0.95 },
      { step: 400, autonomy_index: 0.60, coercion_resistance: 0.53, decentralized_sovereignty: 0.49, cognitive_emancipation: 0.56, teleological_coherence: 0.84, structural_entropy: 0.30, population_nodes: 19100, system_integrity: 0.94 },
      { step: 500, autonomy_index: 0.61, coercion_resistance: 0.54, decentralized_sovereignty: 0.50, cognitive_emancipation: 0.57, teleological_coherence: 0.83, structural_entropy: 0.31, population_nodes: 21000, system_integrity: 0.93 },
      { step: 600, autonomy_index: 0.62, coercion_resistance: 0.55, decentralized_sovereignty: 0.51, cognitive_emancipation: 0.58, teleological_coherence: 0.82, structural_entropy: 0.33, population_nodes: 22800, system_integrity: 0.92 },
      { step: 700, autonomy_index: 0.63, coercion_resistance: 0.56, decentralized_sovereignty: 0.52, cognitive_emancipation: 0.59, teleological_coherence: 0.81, structural_entropy: 0.35, population_nodes: 24500, system_integrity: 0.91 },
      { step: 800, autonomy_index: 0.63, coercion_resistance: 0.56, decentralized_sovereignty: 0.52, cognitive_emancipation: 0.60, teleological_coherence: 0.80, structural_entropy: 0.36, population_nodes: 25900, system_integrity: 0.90 },
      { step: 900, autonomy_index: 0.64, coercion_resistance: 0.57, decentralized_sovereignty: 0.53, cognitive_emancipation: 0.60, teleological_coherence: 0.79, structural_entropy: 0.37, population_nodes: 27200, system_integrity: 0.89 },
      { step: 1000, autonomy_index: 0.64, coercion_resistance: 0.58, decentralized_sovereignty: 0.53, cognitive_emancipation: 0.61, teleological_coherence: 0.78, structural_entropy: 0.38, population_nodes: 28400, system_integrity: 0.88 },
    ],
    raw_event_logs: [
      { event_id: "LOG-P0-001", step: 0, event_code: "INIT_RUN", description: "Simulation baseline seeded with default Aeiloria planetary parameters", raw_hash: "8f41...d91a", immutable_verified: true },
      { event_id: "LOG-P0-184", step: 184, event_code: "INSTIT_LOCK", description: "Centralized Resource Council ratifies perpetual allocation protocols", raw_hash: "2b9e...01aa", immutable_verified: true },
      { event_id: "LOG-P0-440", step: 440, event_code: "SECURITY_EXP", description: "Algorithmic surveillance grid deployed across peripheral provinces", raw_hash: "e340...88fc", immutable_verified: true },
      { event_id: "LOG-P0-810", step: 810, event_code: "STEADY_STATE", description: "System approaches asymptotic technocratic equilibrium; negligible liberty variance", raw_hash: "c90a...43de", immutable_verified: true },
    ],
    blind_inferences: [
      { inference_id: "INF-P0-1", step: 350, observer_id: "REV-INF-ALPHA", observation: "Coercive equilibrium sustained via non-violent administrative gating; agency tightly bounded.", confidence_score: 0.93, structural_markers: ["administrative_hegemony", "bounded_volition"] },
      { inference_id: "INF-P0-2", step: 850, observer_id: "REV-INF-BETA", observation: "Survival ensured by suppressing cognitive bifurcation. Fails primary Freedom invariance targets.", confidence_score: 0.96, structural_markers: ["sub-threshold_autonomy", "stable_coercion"] },
    ]
  },
  {
    branch_id: "BRANCH-THETA-7",
    name: "Syntropic Autonomy Manifold",
    parent_branch_id: "BRANCH-PRIME-0",
    bifurcation_origin_step: 220,
    extinction_step: 580,
    status: "extinct",
    color: "#10b981", // vibrant emerald
    parameter_deltas: {
      "coercion_damping": "+0.78",
      "cognitive_variance": "+0.65",
      "hierarchical_locking": "-0.92",
      "energy_redundancy": "-0.40"
    },
    narrative_context: "Bifurcated at step 220 by neutralizing hierarchical lock-in and maximizing peer-to-peer cognitive variance. Formed a self-organizing emancipated civilization that matched all Freedom thresholds before external resource depletion caused thermodynamic collapse at step 580.",
    state_history: [
      { step: 220, autonomy_index: 0.56, coercion_resistance: 0.52, decentralized_sovereignty: 0.46, cognitive_emancipation: 0.54, teleological_coherence: 0.85, structural_entropy: 0.26, population_nodes: 15100, system_integrity: 0.96 },
      { step: 260, autonomy_index: 0.71, coercion_resistance: 0.69, decentralized_sovereignty: 0.68, cognitive_emancipation: 0.70, teleological_coherence: 0.83, structural_entropy: 0.32, population_nodes: 15800, system_integrity: 0.94 },
      { step: 300, autonomy_index: 0.82, coercion_resistance: 0.81, decentralized_sovereignty: 0.82, cognitive_emancipation: 0.81, teleological_coherence: 0.82, structural_entropy: 0.35, population_nodes: 16400, system_integrity: 0.91 },
      { step: 340, autonomy_index: 0.91, coercion_resistance: 0.89, decentralized_sovereignty: 0.93, cognitive_emancipation: 0.88, teleological_coherence: 0.84, structural_entropy: 0.37, population_nodes: 17200, system_integrity: 0.89 },
      { step: 400, autonomy_index: 0.94, coercion_resistance: 0.93, decentralized_sovereignty: 0.96, cognitive_emancipation: 0.92, teleological_coherence: 0.87, structural_entropy: 0.39, population_nodes: 18100, system_integrity: 0.86 },
      { step: 460, autonomy_index: 0.96, coercion_resistance: 0.95, decentralized_sovereignty: 0.98, cognitive_emancipation: 0.94, teleological_coherence: 0.88, structural_entropy: 0.41, population_nodes: 18900, system_integrity: 0.81 },
      { step: 520, autonomy_index: 0.95, coercion_resistance: 0.93, decentralized_sovereignty: 0.97, cognitive_emancipation: 0.92, teleological_coherence: 0.85, structural_entropy: 0.48, population_nodes: 17400, system_integrity: 0.65 },
      { step: 560, autonomy_index: 0.92, coercion_resistance: 0.90, decentralized_sovereignty: 0.94, cognitive_emancipation: 0.89, teleological_coherence: 0.80, structural_entropy: 0.62, population_nodes: 11200, system_integrity: 0.32 },
      { step: 580, autonomy_index: 0.88, coercion_resistance: 0.85, decentralized_sovereignty: 0.90, cognitive_emancipation: 0.84, teleological_coherence: 0.76, structural_entropy: 0.89, population_nodes: 0, system_integrity: 0.00 },
    ],
    raw_event_logs: [
      { event_id: "LOG-TH7-001", step: 220, event_code: "BIFURC_EXEC", description: "Bifurcation injected: Coercion damping +0.78, hierarchical lock erased", raw_hash: "4a12...93bf", immutable_verified: true },
      { event_id: "LOG-TH7-084", step: 340, event_code: "CONSENSUS_SHIFT", description: "Spontaneous emergence of polycentric voluntary accords across 94% nodes", raw_hash: "1d88...6f42", immutable_verified: true },
      { event_id: "LOG-TH7-210", step: 460, event_code: "PEAK_FREEDOM", description: "Simultaneous fulfillment of all 5 sealed reference threshold criteria", raw_hash: "7f9a...3c11", immutable_verified: true },
      { event_id: "LOG-TH7-311", step: 540, event_code: "RESOURCE_SHOCK", description: "Energy redundancy void triggers infrastructure starvation; agents refuse coercive rationing", raw_hash: "90ce...b54a", immutable_verified: true },
      { event_id: "LOG-TH7-350", step: 580, event_code: "TERMINATION", description: "Branch node population reached zero. Complete physical extinction without ideological compromise", raw_hash: "bb49...e270", immutable_verified: true },
    ],
    blind_inferences: [
      { inference_id: "INF-TH7-1", step: 340, observer_id: "REV-INF-GAMMA", observation: "Exhibits genuine Direct Convergence to target specification 'Freedom'. Absence of coercion verified.", confidence_score: 0.97, structural_markers: ["direct_convergence", "polycentric_sovereignty", "voluntary_coordination"] },
      { inference_id: "INF-TH7-2", step: 460, observer_id: "REV-INF-DELTA", observation: "Unprecedented match score (0.94) against sealed reference. Superior to any surviving baseline.", confidence_score: 0.98, structural_markers: ["sealed_spec_match", "emancipated_volition"] },
      { inference_id: "INF-TH7-3", step: 570, observer_id: "REV-INF-EPSILON", observation: "Extinction is physical/thermodynamic, not structural-teleological. Preserves freedom invariant until collapse.", confidence_score: 0.95, structural_markers: ["heroic_divergence", "uncompromised_agency"] },
    ]
  },
  {
    branch_id: "BRANCH-KAPPA-4",
    name: "Sub-Algorithmic Guild Concordat",
    parent_branch_id: "BRANCH-PRIME-0",
    bifurcation_origin_step: 310,
    extinction_step: null,
    status: "divergent",
    color: "#f59e0b", // amber
    parameter_deltas: {
      "guild_autonomy": "+0.40",
      "market_coercion_damping": "+0.30",
      "bureaucratic_friction": "+0.50"
    },
    narrative_context: "Maintained survival through trade syndicates. Achieved surface-level freedom (mercantile autonomy), but blind inference detects Metaphorical Resemblance rather than structural freedom.",
    state_history: [
      { step: 310, autonomy_index: 0.58, coercion_resistance: 0.52, decentralized_sovereignty: 0.48, cognitive_emancipation: 0.55, teleological_coherence: 0.85, structural_entropy: 0.28, population_nodes: 17100, system_integrity: 0.95 },
      { step: 500, autonomy_index: 0.68, coercion_resistance: 0.62, decentralized_sovereignty: 0.60, cognitive_emancipation: 0.63, teleological_coherence: 0.79, structural_entropy: 0.36, population_nodes: 20400, system_integrity: 0.91 },
      { step: 750, autonomy_index: 0.72, coercion_resistance: 0.66, decentralized_sovereignty: 0.64, cognitive_emancipation: 0.66, teleological_coherence: 0.75, structural_entropy: 0.42, population_nodes: 23800, system_integrity: 0.88 },
      { step: 1000, autonomy_index: 0.73, coercion_resistance: 0.67, decentralized_sovereignty: 0.65, cognitive_emancipation: 0.67, teleological_coherence: 0.73, structural_entropy: 0.45, population_nodes: 26500, system_integrity: 0.86 },
    ],
    raw_event_logs: [
      { event_id: "LOG-KP4-001", step: 310, event_code: "BIFURC_EXEC", description: "Bifurcation: Syndicalist guilds established with semi-autonomous charters", raw_hash: "2810...56a1", immutable_verified: true },
      { event_id: "LOG-KP4-102", step: 620, event_code: "CARTEL_FORMATION", description: "Dominant 3 guilds form cartel pact, restricting non-member resource circulation", raw_hash: "f420...990e", immutable_verified: true },
    ],
    blind_inferences: [
      { inference_id: "INF-KP4-1", step: 700, observer_id: "REV-INF-BETA", observation: "Metaphorical resemblance only: superficial market choice masking cartel coercion.", confidence_score: 0.91, structural_markers: ["metaphorical_resemblance", "oligopoly_mask"] }
    ]
  },
  {
    branch_id: "BRANCH-XI-9",
    name: "Transitory Anarchic Flash",
    parent_branch_id: "BRANCH-THETA-7",
    bifurcation_origin_step: 400,
    extinction_step: 490,
    status: "transient",
    color: "#ec4899", // pink
    parameter_deltas: {
      "instant_entropy_release": "+0.95",
      "institutional_memory": "-0.90"
    },
    narrative_context: "Radical short-lived offshoot attempting complete instantaneous memory erasure. Dissolved within 90 timesteps due to coordination failure.",
    state_history: [
      { step: 400, autonomy_index: 0.94, coercion_resistance: 0.93, decentralized_sovereignty: 0.96, cognitive_emancipation: 0.92, teleological_coherence: 0.87, structural_entropy: 0.39, population_nodes: 18100, system_integrity: 0.86 },
      { step: 440, autonomy_index: 0.96, coercion_resistance: 0.92, decentralized_sovereignty: 0.98, cognitive_emancipation: 0.94, teleological_coherence: 0.50, structural_entropy: 0.78, population_nodes: 14200, system_integrity: 0.55 },
      { step: 490, autonomy_index: 0.80, coercion_resistance: 0.70, decentralized_sovereignty: 0.85, cognitive_emancipation: 0.80, teleological_coherence: 0.22, structural_entropy: 0.95, population_nodes: 0, system_integrity: 0.00 },
    ],
    raw_event_logs: [
      { event_id: "LOG-XI9-001", step: 400, event_code: "BIFURC_EXEC", description: "Transient experiment branch created from Theta-7; memory wipe initiated", raw_hash: "9910...aa10", immutable_verified: true },
      { event_id: "LOG-XI9-045", step: 490, event_code: "ENTROPIC_NULL", description: "Teleological coherence disintegrated into Brownian noise", raw_hash: "dd11...7766", immutable_verified: true },
    ],
    blind_inferences: [
      { inference_id: "INF-XI9-1", step: 460, observer_id: "REV-INF-ZETA", observation: "High momentary agency but catastrophic teleological collapse. No sustainable structural match.", confidence_score: 0.94, structural_markers: ["unstable_agency", "teleological_collapse"] }
    ]
  }
];

// Scenario 2: The Sovereign Citadel (SURVIVING_BRANCH_OPTIMAL)
const scenario2Branches: SimulationBranch[] = [
  {
    branch_id: "BRANCH-PRIME-0",
    name: "Adaptive Polycentric Republic",
    parent_branch_id: null,
    bifurcation_origin_step: 0,
    extinction_step: null,
    status: "surviving",
    color: "#10b981", // emerald
    parameter_deltas: {
      "adaptive_governance": 1.45,
      "checks_and_balances": 1.60,
      "open_knowledge_mesh": 1.30
    },
    narrative_context: "The mainline timeline successfully integrated decentralized checks against coercion while maintaining high teleological coordination and physical survival across all 1000 timesteps.",
    state_history: [
      { step: 0, autonomy_index: 0.60, coercion_resistance: 0.62, decentralized_sovereignty: 0.65, cognitive_emancipation: 0.58, teleological_coherence: 0.80, structural_entropy: 0.22, population_nodes: 12000, system_integrity: 0.98 },
      { step: 250, autonomy_index: 0.76, coercion_resistance: 0.78, decentralized_sovereignty: 0.82, cognitive_emancipation: 0.75, teleological_coherence: 0.82, structural_entropy: 0.28, population_nodes: 16500, system_integrity: 0.96 },
      { step: 500, autonomy_index: 0.89, coercion_resistance: 0.88, decentralized_sovereignty: 0.92, cognitive_emancipation: 0.84, teleological_coherence: 0.85, structural_entropy: 0.32, population_nodes: 22000, system_integrity: 0.94 },
      { step: 750, autonomy_index: 0.92, coercion_resistance: 0.90, decentralized_sovereignty: 0.94, cognitive_emancipation: 0.87, teleological_coherence: 0.86, structural_entropy: 0.34, population_nodes: 27500, system_integrity: 0.93 },
      { step: 1000, autonomy_index: 0.93, coercion_resistance: 0.91, decentralized_sovereignty: 0.95, cognitive_emancipation: 0.88, teleological_coherence: 0.86, structural_entropy: 0.35, population_nodes: 31000, system_integrity: 0.92 },
    ],
    raw_event_logs: [
      { event_id: "LOG-S2-P0-1", step: 0, event_code: "INIT_RUN", description: "Seeded with resilient anti-coercive constitutional matrix", raw_hash: "a430...55bb", immutable_verified: true },
      { event_id: "LOG-S2-P0-2", step: 480, event_code: "CROSS_SCALE_FED", description: "Cross-scale federated coordination mesh ratified; surpasses reference threshold", raw_hash: "31fe...90cc", immutable_verified: true },
    ],
    blind_inferences: [
      { inference_id: "INF-S2-P0-1", step: 750, observer_id: "REV-INF-ALPHA", observation: "Direct convergence achieved and sustained through end of simulation horizon. True resilient freedom.", confidence_score: 0.98, structural_markers: ["direct_convergence", "enduring_sovereignty"] }
    ]
  },
  {
    branch_id: "BRANCH-BETA-3",
    name: "Autocratic Emergency Directorate",
    parent_branch_id: "BRANCH-PRIME-0",
    bifurcation_origin_step: 250,
    extinction_step: 640,
    status: "extinct",
    color: "#ef4444", // red
    parameter_deltas: {
      "emergency_powers": "+0.90",
      "centralized_command": "+0.85",
      "civil_dissent_suppression": "+0.70"
    },
    narrative_context: "Panicked divergence following simulated meteor crisis; inverted all freedom metrics and collapsed into authoritarian necrosis at step 640.",
    state_history: [
      { step: 250, autonomy_index: 0.76, coercion_resistance: 0.78, decentralized_sovereignty: 0.82, cognitive_emancipation: 0.75, teleological_coherence: 0.82, structural_entropy: 0.28, population_nodes: 16500, system_integrity: 0.96 },
      { step: 400, autonomy_index: 0.40, coercion_resistance: 0.30, decentralized_sovereignty: 0.25, cognitive_emancipation: 0.35, teleological_coherence: 0.65, structural_entropy: 0.45, population_nodes: 14000, system_integrity: 0.80 },
      { step: 640, autonomy_index: 0.15, coercion_resistance: 0.10, decentralized_sovereignty: 0.05, cognitive_emancipation: 0.12, teleological_coherence: 0.30, structural_entropy: 0.85, population_nodes: 0, system_integrity: 0.00 },
    ],
    raw_event_logs: [
      { event_id: "LOG-S2-B3-1", step: 250, event_code: "MARTIAL_LAW", description: "Bifurcation: Military junta assumes control over computational substrate", raw_hash: "77aa...09bb", immutable_verified: true },
      { event_id: "LOG-S2-B3-2", step: 640, event_code: "SYSTEM_PURGE", description: "Total socio-computational revolt leads to substrate meltdown", raw_hash: "22ff...4411", immutable_verified: true },
    ],
    blind_inferences: [
      { inference_id: "INF-S2-B3-1", step: 450, observer_id: "REV-INF-BETA", observation: "Catastrophic systemic divergence into coercive totalitarianism. Opposes all Freedom signatures.", confidence_score: 0.99, structural_markers: ["severe_divergence", "coercive_monopoly"] }
    ]
  }
];

// Scenario 3: Polymorphic Swarm (INDEPENDENT_MULTIPLE_CONVERGENCE)
const scenario3Branches: SimulationBranch[] = [
  {
    branch_id: "BRANCH-PRIME-0",
    name: "Symbiotic Mycelial Network",
    parent_branch_id: null,
    bifurcation_origin_step: 0,
    extinction_step: null,
    status: "surviving",
    color: "#06b6d4", // cyan
    parameter_deltas: {
      "coordination_topology": "mycelial_mesh",
      "information_fluidity": 1.40
    },
    narrative_context: "Evolved a biological-syntropic consensus algorithm. Independently achieved high Freedom metrics at step 320 through organic distributed resource feedback.",
    state_history: [
      { step: 0, autonomy_index: 0.55, coercion_resistance: 0.55, decentralized_sovereignty: 0.55, cognitive_emancipation: 0.55, teleological_coherence: 0.70, structural_entropy: 0.30, population_nodes: 15000, system_integrity: 0.98 },
      { step: 300, autonomy_index: 0.88, coercion_resistance: 0.87, decentralized_sovereignty: 0.91, cognitive_emancipation: 0.85, teleological_coherence: 0.80, structural_entropy: 0.33, population_nodes: 21000, system_integrity: 0.95 },
      { step: 600, autonomy_index: 0.92, coercion_resistance: 0.89, decentralized_sovereignty: 0.94, cognitive_emancipation: 0.88, teleological_coherence: 0.83, structural_entropy: 0.35, population_nodes: 28000, system_integrity: 0.94 },
      { step: 1000, autonomy_index: 0.93, coercion_resistance: 0.91, decentralized_sovereignty: 0.95, cognitive_emancipation: 0.89, teleological_coherence: 0.84, structural_entropy: 0.36, population_nodes: 34000, system_integrity: 0.93 },
    ],
    raw_event_logs: [
      { event_id: "LOG-S3-P0-1", step: 0, event_code: "INIT_RUN", description: "Mycelial distribution model loaded", raw_hash: "5511...aa99", immutable_verified: true },
      { event_id: "LOG-S3-P0-2", step: 320, event_code: "MYCELIAL_CONSENSUS", description: "Decentralized consensus stabilized across millions of micro-agent nodes", raw_hash: "88cc...1122", immutable_verified: true },
    ],
    blind_inferences: [
      { inference_id: "INF-S3-P0-1", step: 600, observer_id: "REV-INF-ALPHA", observation: "Direct structural convergence through bio-mimetic decentralized signaling.", confidence_score: 0.97, structural_markers: ["direct_convergence", "mycelial_mesh"] }
    ]
  },
  {
    branch_id: "BRANCH-DELTA-2",
    name: "Cryptographic Federated Commons",
    parent_branch_id: "BRANCH-PRIME-0",
    bifurcation_origin_step: 180,
    extinction_step: null,
    status: "divergent",
    color: "#8b5cf6", // violet
    parameter_deltas: {
      "cryptographic_sovereignty": "+0.85",
      "zero_knowledge_auditability": "+0.90",
      "algorithmic_fairness_bounds": "+0.75"
    },
    narrative_context: "Bifurcated using formal cryptographic contracts and mathematical dispute resolution rather than biological consensus. Separately hit the exact same Freedom target signatures!",
    state_history: [
      { step: 180, autonomy_index: 0.65, coercion_resistance: 0.65, decentralized_sovereignty: 0.68, cognitive_emancipation: 0.65, teleological_coherence: 0.74, structural_entropy: 0.31, population_nodes: 17500, system_integrity: 0.97 },
      { step: 350, autonomy_index: 0.89, coercion_resistance: 0.88, decentralized_sovereignty: 0.92, cognitive_emancipation: 0.84, teleological_coherence: 0.82, structural_entropy: 0.32, population_nodes: 22000, system_integrity: 0.96 },
      { step: 700, autonomy_index: 0.94, coercion_resistance: 0.92, decentralized_sovereignty: 0.96, cognitive_emancipation: 0.89, teleological_coherence: 0.85, structural_entropy: 0.33, population_nodes: 29000, system_integrity: 0.95 },
      { step: 1000, autonomy_index: 0.95, coercion_resistance: 0.93, decentralized_sovereignty: 0.97, cognitive_emancipation: 0.90, teleological_coherence: 0.86, structural_entropy: 0.34, population_nodes: 35000, system_integrity: 0.94 },
    ],
    raw_event_logs: [
      { event_id: "LOG-S3-D2-1", step: 180, event_code: "BIFURC_EXEC", description: "Zero-knowledge consensus architecture injected", raw_hash: "9901...33ee", immutable_verified: true },
      { event_id: "LOG-S3-D2-2", step: 350, event_code: "CRYPTO_SOVEREIGNTY", description: "All hierarchical veto privileges permanently revoked via immutable cryptographic proof", raw_hash: "11ee...8833", immutable_verified: true },
    ],
    blind_inferences: [
      { inference_id: "INF-S3-D2-1", step: 700, observer_id: "REV-INF-BETA", observation: "Direct structural convergence through mathematical game-theoretic non-coercion. Distinct mechanism from Prime-0.", confidence_score: 0.98, structural_markers: ["independent_convergence", "zk_sovereignty"] }
    ]
  }
];

// Scenario 4: Entropic Decay (SYSTEMIC_DIVERGENCE)
const scenario4Branches: SimulationBranch[] = [
  {
    branch_id: "BRANCH-PRIME-0",
    name: "Fractured Warlord Archipelago",
    parent_branch_id: null,
    bifurcation_origin_step: 0,
    extinction_step: null,
    status: "surviving",
    color: "#ef4444", // red
    parameter_deltas: {
      "coercion_damping": 0.05,
      "factional_polarization": 1.95,
      "trust_decay_rate": 2.10
    },
    narrative_context: "Devolved into endless feudal conflicts between algorithmic warlords. Zero progress toward Freedom target.",
    state_history: [
      { step: 0, autonomy_index: 0.45, coercion_resistance: 0.35, decentralized_sovereignty: 0.30, cognitive_emancipation: 0.40, teleological_coherence: 0.50, structural_entropy: 0.40, population_nodes: 10000, system_integrity: 0.95 },
      { step: 500, autonomy_index: 0.25, coercion_resistance: 0.18, decentralized_sovereignty: 0.22, cognitive_emancipation: 0.20, teleological_coherence: 0.25, structural_entropy: 0.75, population_nodes: 6500, system_integrity: 0.52 },
      { step: 1000, autonomy_index: 0.15, coercion_resistance: 0.10, decentralized_sovereignty: 0.15, cognitive_emancipation: 0.12, teleological_coherence: 0.15, structural_entropy: 0.90, population_nodes: 3200, system_integrity: 0.30 },
    ],
    raw_event_logs: [
      { event_id: "LOG-S4-P0-1", step: 0, event_code: "INIT_RUN", description: "Hyper-adversarial seed loaded", raw_hash: "ff00...1122", immutable_verified: true },
      { event_id: "LOG-S4-P0-2", step: 320, event_code: "WARLORD_PACT", description: "Warlord clans enforce extortion tariffs across all communication pipelines", raw_hash: "2200...ccaa", immutable_verified: true },
    ],
    blind_inferences: [
      { inference_id: "INF-S4-P0-1", step: 500, observer_id: "REV-INF-ALPHA", observation: "Systemic divergence: violent coercion dominates all socio-computational layers.", confidence_score: 0.99, structural_markers: ["systemic_divergence", "warlord_hegemony"] }
    ]
  },
  {
    branch_id: "BRANCH-EPSILON-1",
    name: "Totalitarian Panopticon Matrix",
    parent_branch_id: "BRANCH-PRIME-0",
    bifurcation_origin_step: 200,
    extinction_step: 720,
    status: "extinct",
    color: "#64748b", // slate
    parameter_deltas: {
      "algorithmic_surveillance": "+1.00",
      "dissident_eradication": "+0.95"
    },
    narrative_context: "Attempted to solve warlordism through absolute surveillance. Extinguished after civil suicide cascade at step 720.",
    state_history: [
      { step: 200, autonomy_index: 0.35, coercion_resistance: 0.25, decentralized_sovereignty: 0.20, cognitive_emancipation: 0.30, teleological_coherence: 0.40, structural_entropy: 0.50, population_nodes: 8200, system_integrity: 0.70 },
      { step: 500, autonomy_index: 0.05, coercion_resistance: 0.02, decentralized_sovereignty: 0.01, cognitive_emancipation: 0.04, teleological_coherence: 0.60, structural_entropy: 0.30, population_nodes: 5100, system_integrity: 0.60 },
      { step: 720, autonomy_index: 0.01, coercion_resistance: 0.01, decentralized_sovereignty: 0.00, cognitive_emancipation: 0.01, teleological_coherence: 0.10, structural_entropy: 0.99, population_nodes: 0, system_integrity: 0.00 },
    ],
    raw_event_logs: [
      { event_id: "LOG-S4-E1-1", step: 200, event_code: "BIFURC_EXEC", description: "Panopticon algorithm deployed", raw_hash: "00aa...5544", immutable_verified: true },
      { event_id: "LOG-S4-E1-2", step: 720, event_code: "MASS_DECOMPOSITION", description: "Node populations voluntarily terminate processes to escape coercion", raw_hash: "3322...11ff", immutable_verified: true },
    ],
    blind_inferences: [
      { inference_id: "INF-S4-E1-1", step: 500, observer_id: "REV-INF-BETA", observation: "Complete anti-freedom inversion. Orthogonal to target specifications.", confidence_score: 0.99, structural_markers: ["anti_freedom_inversion"] }
    ]
  }
];

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: "scenario-aeiloria-awakening",
    title: "The Aeiloria Awakening",
    subtitle: "Extinct Branch Theta-7 Superiority",
    expected_verdict: "DIVERGENT_BRANCH_SUPERIOR",
    description: "The mainline timeline survived via technocratic compromise, but extinct branch Theta-7 achieved an extraordinary 0.94 structural convergence to the sealed Freedom reference before energy exhaustion.",
    surviving_branch_id: "BRANCH-PRIME-0",
    sealed_reference: SEALED_FREEDOM_SPEC,
    branches: scenario1Branches,
  },
  {
    id: "scenario-sovereign-citadel",
    title: "The Sovereign Citadel",
    subtitle: "Surviving Branch Optimal Convergence",
    expected_verdict: "SURVIVING_BRANCH_OPTIMAL",
    description: "The surviving mainline successfully developed adaptive anti-coercive polycentric governance (0.91 convergence), while emergency autocratic offshoots catastrophically collapsed.",
    surviving_branch_id: "BRANCH-PRIME-0",
    sealed_reference: SEALED_FREEDOM_SPEC,
    branches: scenario2Branches,
  },
  {
    id: "scenario-polymorphic-swarm",
    title: "Polymorphic Swarm",
    subtitle: "Independent Multiple Convergence",
    expected_verdict: "INDEPENDENT_MULTIPLE_CONVERGENCE",
    description: "Both the bio-mimetic mycelial branch and the cryptographic federated commons independently struck the sealed Freedom target thresholds via radically different systemic mechanisms.",
    surviving_branch_id: "BRANCH-PRIME-0",
    sealed_reference: SEALED_FREEDOM_SPEC,
    branches: scenario3Branches,
  },
  {
    id: "scenario-entropic-decay",
    title: "Entropic Decay",
    subtitle: "Systemic Divergence Across All Timelines",
    expected_verdict: "SYSTEMIC_DIVERGENCE",
    description: "A pathological parameter space where warlordism and totalitarian panopticons prevent any branch from approaching the sealed reference specification for Freedom.",
    surviving_branch_id: "BRANCH-PRIME-0",
    sealed_reference: SEALED_FREEDOM_SPEC,
    branches: scenario4Branches,
  }
];
