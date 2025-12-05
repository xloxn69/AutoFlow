import { Node, Edge } from 'reactflow';
import { d as LintConfig, c as WorkflowLintResult, L as LintIssue, a as AutomaterWorkflow } from '../validator-gjKZUoHp.mjs';
export { V as VariableDefinition, b as WorkflowNode, W as WorkflowTrigger } from '../validator-gjKZUoHp.mjs';

/**
 * React hooks for AutoFlow workflow validation
 *
 * Provides real-time validation integration with ReactFlow
 * CRITICAL: Uses useRef for debounce timers to prevent infinite loops
 */

interface UseWorkflowLintingOptions {
    enabled?: boolean;
    debounceMs?: number;
    config?: Partial<LintConfig>;
}
interface WorkflowLintingState {
    result: WorkflowLintResult | null;
    isLinting: boolean;
    lastLintTime: number | null;
    summary: {
        isValid: boolean;
        message: string;
        canDeploy: boolean;
        total: number;
        errors: number;
        warnings: number;
        infos: number;
        criticals: number;
    };
    issues: LintIssue[];
    errors: LintIssue[];
    warnings: LintIssue[];
    infos: LintIssue[];
    criticals: LintIssue[];
    triggerLint: () => void;
    getNodeIssues: (nodeId: string) => LintIssue[];
    getEdgeIssues: (edgeId: string) => LintIssue[];
}
/**
 * Main hook for real-time workflow linting with ReactFlow
 * FIXED: Uses useRef for debounce timer to prevent infinite loops
 */
declare function useWorkflowLinting(nodes: Node[], edges: Edge[], options?: UseWorkflowLintingOptions): WorkflowLintingState;
/**
 * Hook for node-specific linting state
 * Used to highlight nodes with issues in React Flow
 */
declare function useNodeLinting(nodeId: string, lintingState: WorkflowLintingState): {
    hasIssues: boolean;
    hasErrors: boolean;
    hasWarnings: boolean;
    issues: LintIssue[];
    severity: "info" | "warn" | "error" | "critical" | null;
    borderColor: string | undefined;
    bgColor: string | undefined;
};
/**
 * Hook for edge-specific linting state
 */
declare function useEdgeLinting(edgeId: string, lintingState: WorkflowLintingState): {
    hasIssues: boolean;
    hasErrors: boolean;
    issues: LintIssue[];
    severity: "info" | "warn" | "error" | "critical" | null;
    strokeColor: string | undefined;
};
/**
 * Hook for getting issues grouped by severity
 */
declare function useGroupedIssues(lintingState: WorkflowLintingState): {
    critical: LintIssue[];
    error: LintIssue[];
    warning: LintIssue[];
    info: LintIssue[];
    byNode: Record<string, LintIssue[]>;
};
/**
 * Utility function to convert ReactFlow nodes/edges to workflow format
 */
declare function createWorkflowFromReactFlow(nodes: Node[], edges: Edge[]): Partial<AutomaterWorkflow>;

export { AutomaterWorkflow, LintConfig, LintIssue, type UseWorkflowLintingOptions, WorkflowLintResult, type WorkflowLintingState, createWorkflowFromReactFlow, useEdgeLinting, useGroupedIssues, useNodeLinting, useWorkflowLinting };
