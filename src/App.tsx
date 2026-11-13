/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { SIMULATION_SCENARIOS } from './data/scenarios';
import { SimulationBranch, ComparatorOutput } from './types/simulation';
import { evaluateSimulationDeterministic } from './services/analyticalEngine';
import { runComparatorEvaluation } from './services/comparatorApi';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { SummaryVerdictCard } from './components/SummaryVerdictCard';
import { BranchTreeVisualizer } from './components/BranchTreeVisualizer';
import { TimelineScrubber } from './components/TimelineScrubber';
import { ConvergenceCharts } from './components/ConvergenceCharts';
import { EvaluatedBranchesTable } from './components/EvaluatedBranchesTable';
import { SealedReferenceModal } from './components/SealedReferenceModal';
import { RawHistoryLedgerModal } from './components/RawHistoryLedgerModal';
import { CounterfactualSandboxModal } from './components/CounterfactualSandboxModal';
import { JsonExportModal } from './components/JsonExportModal';

function MainAppContent() {
  const { isLight } = useTheme();
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SIMULATION_SCENARIOS[0].id);
  const activeScenario = useMemo(() => {
    return SIMULATION_SCENARIOS.find(s => s.id === activeScenarioId) || SIMULATION_SCENARIOS[0];
  }, [activeScenarioId]);

  const [branches, setBranches] = useState<SimulationBranch[]>(activeScenario.branches);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    activeScenario.branches[1]?.branch_id || activeScenario.branches[0].branch_id
  );
  const [currentStep, setCurrentStep] = useState<number>(460);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals state
  const [isSealedRefOpen, setIsSealedRefOpen] = useState(false);
  const [isRawLedgerOpen, setIsRawLedgerOpen] = useState(false);
  const [ledgerBranchId, setLedgerBranchId] = useState<string>(selectedBranchId);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isJsonExportOpen, setIsJsonExportOpen] = useState(false);

  // Comparator output
  const [comparatorOutput, setComparatorOutput] = useState<ComparatorOutput>(() => {
    return evaluateSimulationDeterministic(
      activeScenario.branches,
      activeScenario.sealed_reference,
      activeScenario.surviving_branch_id
    );
  });

  // When scenario changes, update local state
  const handleSelectScenario = useCallback((scenarioId: string) => {
    const sc = SIMULATION_SCENARIOS.find(s => s.id === scenarioId) || SIMULATION_SCENARIOS[0];
    setActiveScenarioId(sc.id);
    setBranches(sc.branches);
    const defaultSelect = sc.branches[1]?.branch_id || sc.branches[0].branch_id;
    setSelectedBranchId(defaultSelect);
    setCurrentStep(sc.id === 'scenario-aeiloria-awakening' ? 460 : 500);

    // Recompute evaluation
    const initialEval = evaluateSimulationDeterministic(sc.branches, sc.sealed_reference, sc.surviving_branch_id);
    setComparatorOutput(initialEval);
  }, []);

  // Run live evaluation via server / Gemini API
  const handleRunEvaluation = async () => {
    setIsLoading(true);
    try {
      const output = await runComparatorEvaluation(
        branches,
        activeScenario.sealed_reference,
        activeScenario.surviving_branch_id
      );
      setComparatorOutput(output);
    } catch (err) {
      console.error('Failed to run live evaluation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // User forks a new counterfactual branch in Sandbox
  const handleAddBranch = (newBranch: SimulationBranch) => {
    const updatedBranches = [...branches, newBranch];
    setBranches(updatedBranches);
    setSelectedBranchId(newBranch.branch_id);
    setCurrentStep(newBranch.bifurcation_origin_step);

    // Re-evaluate
    const updatedEval = evaluateSimulationDeterministic(
      updatedBranches,
      activeScenario.sealed_reference,
      activeScenario.surviving_branch_id
    );
    setComparatorOutput(updatedEval);
  };

  const handleOpenLedgerForBranch = (branchId: string) => {
    setLedgerBranchId(branchId);
    setIsRawLedgerOpen(true);
  };

  const branchForLedger = branches.find(b => b.branch_id === ledgerBranchId) || branches[0];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isLight
        ? 'bg-slate-100 text-slate-900 selection:bg-cyan-200 selection:text-cyan-900'
        : 'bg-[#080d1a] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200'
    }`}>
      {/* Top Navbar with White UI Theme Toggle */}
      <Navbar
        scenarios={SIMULATION_SCENARIOS}
        activeScenarioId={activeScenarioId}
        onSelectScenario={handleSelectScenario}
        onOpenSealedRef={() => setIsSealedRefOpen(true)}
        onOpenRawLedger={() => handleOpenLedgerForBranch(selectedBranchId)}
        onOpenSandbox={() => setIsSandboxOpen(true)}
        onOpenJsonExport={() => setIsJsonExportOpen(true)}
        isLoading={isLoading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Scenario Context Banner */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border text-xs font-mono transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800 shadow-xs'
            : 'bg-slate-900/60 border-slate-800 text-slate-200'
        }`}>
          <div>
            <span className={`font-bold uppercase tracking-wider ${
              isLight ? 'text-cyan-800' : 'text-cyan-400'
            }`}>
              Simulation Scenario:
            </span>{' '}
            <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{activeScenario.title}</span>
            <span className={`ml-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>— {activeScenario.description}</span>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Primary Surviving:</span>
            <span className={`px-2 py-0.5 rounded font-bold border ${
              isLight
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-blue-950/80 border-blue-500/30 text-blue-300'
            }`}>
              {activeScenario.surviving_branch_id}
            </span>
          </div>
        </div>

        {/* Comparative Verdict Banner with Comparative Sensitivity Metric */}
        <SummaryVerdictCard
          comparatorOutput={comparatorOutput}
          isLoading={isLoading}
          onRunLiveEvaluation={handleRunEvaluation}
          chosenBranch={branches.find(b => b.branch_id === selectedBranchId) || branches[0]}
          survivingBranch={branches.find(b => b.branch_id === activeScenario.surviving_branch_id) || branches[0]}
          allBranches={branches}
          sealedRef={activeScenario.sealed_reference}
          onSelectChosenBranch={setSelectedBranchId}
        />

        {/* Bifurcation Tree Visualizer with Deviation Heatmap Overlay */}
        <BranchTreeVisualizer
          branches={branches}
          evaluatedBranches={comparatorOutput.evaluated_branches}
          selectedBranchId={selectedBranchId}
          onSelectBranch={setSelectedBranchId}
          currentStep={currentStep}
          sealedRef={activeScenario.sealed_reference}
          onStepChange={setCurrentStep}
        />

        {/* Timeline Scrubber & State Matrix */}
        <TimelineScrubber
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          branches={branches}
          sealedRef={activeScenario.sealed_reference}
          selectedBranchId={selectedBranchId}
          onSelectBranch={setSelectedBranchId}
        />

        {/* Trajectory Curves & Sealed Freedom Radar */}
        <ConvergenceCharts
          branches={branches}
          sealedRef={activeScenario.sealed_reference}
          evaluatedBranches={comparatorOutput.evaluated_branches}
          selectedBranchId={selectedBranchId}
          onSelectBranch={setSelectedBranchId}
          currentStep={currentStep}
        />

        {/* Evaluated Branches Table & Evidence Breakdown */}
        <EvaluatedBranchesTable
          evaluatedBranches={comparatorOutput.evaluated_branches}
          branches={branches}
          survivingBranchId={activeScenario.surviving_branch_id}
          selectedBranchId={selectedBranchId}
          onSelectBranch={setSelectedBranchId}
          onOpenLedger={handleOpenLedgerForBranch}
        />
      </main>

      {/* Footer */}
      <footer className={`border-t py-4 text-center text-xs font-mono transition-colors ${
        isLight
          ? 'border-slate-200 text-slate-500 bg-white'
          : 'border-slate-800/80 text-slate-500 bg-slate-950/60'
      }`}>
        <p>Aeiloria Simulation Pipeline • Downstream Counterfactual Branch Comparator • Freedom Sealed Specification Protocol</p>
      </footer>

      {/* Modals */}
      <SealedReferenceModal
        isOpen={isSealedRefOpen}
        onClose={() => setIsSealedRefOpen(false)}
        sealedRef={activeScenario.sealed_reference}
      />

      <RawHistoryLedgerModal
        isOpen={isRawLedgerOpen}
        onClose={() => setIsRawLedgerOpen(false)}
        branch={branchForLedger}
      />

      <CounterfactualSandboxModal
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
        branches={branches}
        onAddBranch={handleAddBranch}
      />

      <JsonExportModal
        isOpen={isJsonExportOpen}
        onClose={() => setIsJsonExportOpen(false)}
        comparatorOutput={comparatorOutput}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}
