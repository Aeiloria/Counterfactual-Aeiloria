/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { evaluateSimulationDeterministic } from './src/services/analyticalEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Counterfactual Branch Comparator API',
    gemini_configured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

const COMPARATOR_SYSTEM_INSTRUCTION = `You are the Counterfactual Branch Comparator for the Aeiloria simulation pipeline.

You operate downstream from the simulation core and the primary Reverse-Inference Engine. You are permitted to see:
A. The multi-branch evolutionary tree of simulated worlds (including extinct, transient, and surviving branches).
B. The sealed reference specification for Freedom.

PURPOSE
Measure convergence, divergence, and parallel patterns across the entire tree of counterfactual runs rather than just a single surviving path. Determine whether alternative (extinct or divergent) branches yield stronger matches to the sealed reference than the primary surviving world.

CORE RULES
1. Never modify, rewrite, or discard raw simulation history or branch logs.
2. Treat divergence as valid data; do not penalize branches for failing to match unless measured against the explicit metrics.
3. Distinguish clearly between:
   - Direct convergence (independent structural match to reference)
   - Derived convergence (emergent properties leading to secondary match)
   - Metaphorical resemblance (superficial similarity)
   - No relationship

INPUT STRUCTURE EXPECTED
- Branch Metadata (parent run ID, bifurcation step, altered parameters)
- Aggregated Event & State Histories per Branch
- Blind Inferences per Branch
- Sealed Reference Specification

REQUIRED OUTPUT SCHEMA (JSON)
{
  "evaluated_branches": [
    {
      "branch_id": "string",
      "bifurcation_origin_step": "integer",
      "parameter_deltas": {},
      "convergence_score": "float (0.0 to 1.0)",
      "match_type": "exact | strong | partial | weak | divergent | unsupported",
      "earliest_convergent_timestep": "integer or null",
      "convergence_trajectory": "strengthening | weakening | stable | erratic",
      "key_structural_evidence": [],
      "alternative_explanations": [],
      "divergence_turning_point": "integer or null"
    }
  ],
  "summary_conclusion": "SURVIVING_BRANCH_OPTIMAL | DIVERGENT_BRANCH_SUPERIOR | INDEPENDENT_MULTIPLE_CONVERGENCE | SYSTEMIC_DIVERGENCE",
  "comparative_analysis": "string"
}

SUMMARY CONCLUSION
Conclude with one of the following comparative verdicts:
- SURVIVING_BRANCH_OPTIMAL (The primary survival run matches the target best)
- DIVERGENT_BRANCH_SUPERIOR (An alternate/extinct branch achieved closer convergence)
- INDEPENDENT_MULTIPLE_CONVERGENCE (Multiple separate branches independently hit the target signatures)
- SYSTEMIC_DIVERGENCE (No branch converges meaningfully)

Output machine-readable JSON only. No prose outside the schema structure.`;

// Endpoint: Evaluate counterfactual tree
app.post('/api/comparator/evaluate', async (req, res) => {
  const { branches, sealed_reference, surviving_branch_id } = req.body;

  if (!branches || !Array.isArray(branches) || !sealed_reference) {
    return res.status(400).json({ error: 'Missing branches array or sealed_reference specification' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const promptPayload = JSON.stringify({
        primary_surviving_branch_id: surviving_branch_id || 'BRANCH-PRIME-0',
        sealed_reference_specification: sealed_reference,
        counterfactual_branches_metadata: branches.map(b => ({
          branch_id: b.branch_id,
          name: b.name,
          parent_branch_id: b.parent_branch_id,
          bifurcation_origin_step: b.bifurcation_origin_step,
          extinction_step: b.extinction_step,
          status: b.status,
          parameter_deltas: b.parameter_deltas,
          state_history_sample: b.state_history,
          raw_event_logs: b.raw_event_logs,
          blind_inferences: b.blind_inferences
        }))
      }, null, 2);

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Execute the Counterfactual Branch Comparator on the provided simulation tree against the sealed reference specification:\n\n${promptPayload}`
              }
            ]
          }
        ],
        config: {
          systemInstruction: COMPARATOR_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText);

      return res.json({
        ...parsed,
        timestamp: new Date().toISOString(),
        evaluator_engine: 'gemini-3.8-flash'
      });
    } catch (err: any) {
      console.warn('Gemini API call failed or threw error. Falling back to deterministic analytical engine:', err?.message);
      // Seamless deterministic analytical fallback
      const fallbackResult = evaluateSimulationDeterministic(
        branches,
        sealed_reference,
        surviving_branch_id || 'BRANCH-PRIME-0'
      );
      return res.json({
        ...fallbackResult,
        evaluator_engine: 'deterministic-analytical-engine',
        fallback_notice: `Evaluated via deterministic simulation pipeline engine (${err?.message || 'Gemini fallback'})`
      });
    }
  } else {
    // Deterministic analytical engine when API key is not present
    const fallbackResult = evaluateSimulationDeterministic(
      branches,
      sealed_reference,
      surviving_branch_id || 'BRANCH-PRIME-0'
    );
    return res.json({
      ...fallbackResult,
      evaluator_engine: 'deterministic-analytical-engine'
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Aeiloria Simulation Pipeline] Dev server listening on port ${PORT}`);
  });
}

startServer();
