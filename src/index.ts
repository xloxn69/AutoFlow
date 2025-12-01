/**
 * @automater/autoflow
 *
 * Real-time workflow validation system for Automater
 *
 * @example Core usage (Node.js, browser, Deno)
 * ```ts
 * import { AutoFlowValidator } from '@automater/autoflow/core'
 *
 * const validator = new AutoFlowValidator()
 * const result = await validator.validateWorkflow(workflow)
 * ```
 *
 * @example React integration (with ReactFlow)
 * ```tsx
 * import { useWorkflowLinting } from '@automater/autoflow/react'
 *
 * const lintingState = useWorkflowLinting(nodes, edges)
 * ```
 */

// Core exports (pure TypeScript)
export {
  AutoFlowValidator,
  AutomaterLinter,
  DEFAULT_LINT_CONFIG,
  type AutomaterWorkflow,
  type WorkflowTrigger,
  type WorkflowNode,
  type VariableDefinition,
  type LintIssue,
  type WorkflowLintResult,
  type LintConfig,
} from './core/validator'

// React exports (requires React + ReactFlow)
export {
  useWorkflowLinting,
  useNodeLinting,
  useEdgeLinting,
  useGroupedIssues,
  createWorkflowFromReactFlow,
  type UseWorkflowLintingOptions,
  type WorkflowLintingState,
} from './react/hooks'
