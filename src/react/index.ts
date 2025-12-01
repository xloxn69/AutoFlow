'use client'

/**
 * AutoFlow React - ReactFlow integration hooks
 * Requires React 18+ and ReactFlow 11+
 */

export {
  // Main hook
  useWorkflowLinting,

  // Node/edge-specific hooks
  useNodeLinting,
  useEdgeLinting,

  // Utility hooks
  useGroupedIssues,

  // Helper functions
  createWorkflowFromReactFlow,

  // Types
  type UseWorkflowLintingOptions,
  type WorkflowLintingState,
} from './hooks'

// Re-export core types for convenience
export type {
  AutomaterWorkflow,
  WorkflowTrigger,
  WorkflowNode,
  VariableDefinition,
  LintIssue,
  WorkflowLintResult,
  LintConfig,
} from '../core/validator'
