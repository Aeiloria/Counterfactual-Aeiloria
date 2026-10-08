/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SimulationBranch,
  SealedReferenceSpecification,
  ComparatorOutput,
} from '../types/simulation';
import { evaluateSimulationDeterministic } from './analyticalEngine';

export async function runComparatorEvaluation(
  branches: SimulationBranch[],
  sealedRef: SealedReferenceSpecification,
  survivingBranchId: string,
  forceDeterministic: boolean = false
): Promise<ComparatorOutput> {
  if (forceDeterministic) {
    return evaluateSimulationDeterministic(branches, sealedRef, survivingBranchId);
  }

  try {
    const res = await fetch('/api/comparator/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        branches,
        sealed_reference: sealedRef,
        surviving_branch_id: survivingBranchId,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return data as ComparatorOutput;
  } catch (error) {
    console.warn('Network or server evaluation error, falling back to local deterministic engine:', error);
    return evaluateSimulationDeterministic(branches, sealedRef, survivingBranchId);
  }
}
