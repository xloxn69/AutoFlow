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

export {
  // Permission mappings
  ACTION_PERMISSION_MAPPINGS,
  TRIGGER_PERMISSION_MAPPINGS,
  PERMISSION_SEVERITY,
  PERMISSION_DESCRIPTIONS,

  // Permission utility functions
  hasActionPermissionMapping,
  hasTriggerPermissionMapping,
  getPermissionSeverity,
  getPermissionDescription,
} from './permission-mappings'

export {
  // Pack permission aggregator
  PackPermissionAggregator,
  type AutomaterPack,
  type PermissionSummary,
} from './pack-aggregator'
