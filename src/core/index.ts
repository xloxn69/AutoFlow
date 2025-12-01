/**
 * AutoFlow Core - Pure TypeScript validation engine
 * Zero React dependencies - works in any JavaScript runtime
 */

export {
  // Main validator class
  AutoFlowValidator,
  AutomaterLinter, // Legacy alias

  // Configuration
  DEFAULT_LINT_CONFIG,

  // Core types
  type AutomaterWorkflow,
  type WorkflowTrigger,
  type WorkflowNode,
  type VariableDefinition,
  type LintIssue,
  type WorkflowLintResult,
  type LintConfig,
} from './validator'
