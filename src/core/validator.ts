/**
 * AutoFlow Core Validator
 *
 * Pure TypeScript workflow validation engine with zero React dependencies
 * Can run in Node.js, browser, Deno, or any JavaScript runtime
 */

import {
  ACTION_PERMISSION_MAPPINGS,
  TRIGGER_PERMISSION_MAPPINGS,
  hasActionPermissionMapping,
  hasTriggerPermissionMapping
} from './permission-mappings'

// Core workflow interfaces
export interface AutomaterWorkflow {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  version: string
  category?: string
  tags?: string[]
  trigger: WorkflowTrigger
  nodes: WorkflowNode[]
  permissions?: string[]
  variables?: VariableDefinition[]
  visibility?: 'public' | 'private' | 'unlisted'
  createdAt?: string
  updatedAt?: string
}

export interface WorkflowTrigger {
  type: 'event' | 'slash_command' | 'prefixed_command' | 'schedule'
  event?: string
  command?: string
  prefix?: string
  schedule?: string
}

export interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'transformer' | 'end'
  action?: string
  params?: Record<string, unknown>
  connections?: string[]
  onError?: string
  weight?: number
  permissions?: string[]
}

export interface VariableDefinition {
  name: string
  type: 'guild' | 'member' | 'custom'
  scope: 'guild' | 'global'
  description?: string
  default?: unknown
}

// Lint result interfaces
export interface LintIssue {
  id: string
  ruleId: string
  errorCode: string
  family: 'AUT' | 'SYS'
  severity: 'info' | 'warn' | 'error' | 'critical'
  message: string
  remediation: string
  devHint?: string
  location?: {
    nodeId?: string
    edgeId?: string
    path?: string
    line?: number
    column?: number
  }
  context?: Record<string, unknown>
  fixable?: boolean
  suggestions?: string[]
  timestamp?: number
}

export interface WorkflowLintResult {
  workflowId: string
  isValid: boolean
  summary: {
    total: number
    errors: number
    warnings: number
    infos: number
    criticals: number
  }
  issues: LintIssue[]
  errors: LintIssue[]
  warnings: LintIssue[]
  infos: LintIssue[]
  criticals: LintIssue[]
  fixableCount: number
  timestamp: number
  performance: {
    analysisTime: number
    rulesExecuted: number
  }
}

export interface LintConfig {
  rules: Record<string, 'off' | 'warn' | 'error'>
  settings?: {
    rateLimits?: {
      maxWorkflowWeight: number
      maxNodeWeight: number
      warnThreshold: number
    }
    naming?: {
      workflowIdPattern: string
      nodeIdPattern: string
      variableNamePattern: string
    }
  }
}

// Default configuration
export const DEFAULT_LINT_CONFIG: LintConfig = {
  rules: {
    // Schema validation rules
    'schema/required-fields': 'error',
    'schema/field-types': 'error',
    'schema/semver': 'error',
    'schema/enum-values': 'error',

    // Graph integrity rules
    'graph/missing-nodes': 'error',
    'graph/entry-points': 'error',
    'graph/unreachable-nodes': 'warn',
    'graph/infinite-loops': 'error',
    'graph/dead-ends': 'warn',

    // Variable and template rules
    'variable/undefined-reference': 'error',
    'variable/invalid-interpolation': 'error',
    'variable/scope-mismatch': 'warn',
    'variable/naming-convention': 'warn',

    // Trigger and action rules
    'trigger/unknown-event': 'error',
    'trigger/invalid-command': 'error',
    'action/unknown-type': 'error',
    'action/missing-params': 'error',

    // Security rules
    'security/missing-permissions': 'error',
    'security/excessive-permissions': 'warn',
    'security/hardcoded-secrets': 'error',
    'security/pii-exposure': 'warn',

    // Performance rules
    'perf/missing-weight': 'warn',
    'perf/high-weight': 'warn',
    'perf/deep-nesting': 'warn',
    'perf/large-workflow': 'info',

    // Style rules
    'style/naming-convention': 'warn',
    'style/description-required': 'warn',
    'style/icon-color-consistency': 'info',
    'style/deprecated-features': 'warn'
  },
  settings: {
    rateLimits: {
      maxWorkflowWeight: 1000,
      maxNodeWeight: 100,
      warnThreshold: 0.8
    },
    naming: {
      workflowIdPattern: '^automation-[A-Za-z0-9]{15}$',
      nodeIdPattern: '^[a-zA-Z][a-zA-Z0-9_-]*$',
      variableNamePattern: '^[a-zA-Z][a-zA-Z0-9_]*$'
    }
  }
}

// Error catalog - AUT and SYS families
const ERROR_CATALOG = {
  // AUT family - 3xxx range (Missing/Invalid Resources)
  3310: {
    family: 'AUT' as const,
    key: 'AUT_WORKFLOW_UNREACHABLE_NODES',
    severity: 'warn' as const,
    message: 'Workflow contains unreachable nodes',
    remediation: 'Remove unreachable nodes or add connections to make them reachable'
  },
  3311: {
    family: 'AUT' as const,
    key: 'AUT_NODE_MISSING_CONNECTIONS',
    severity: 'error' as const,
    message: 'Node is missing required connections',
    remediation: 'Add connections array to node or connect to valid target nodes'
  },
  3312: {
    family: 'AUT' as const,
    key: 'AUT_VARIABLE_INVALID_INTERPOLATION',
    severity: 'error' as const,
    message: 'Invalid variable interpolation syntax',
    remediation: 'Use correct syntax: {variable.name} or {member.displayName}'
  },
  3313: {
    family: 'AUT' as const,
    key: 'AUT_ICON_NOT_APPROVED',
    severity: 'warn' as const,
    message: 'Icon is not in the approved icon catalog',
    remediation: 'Choose from approved icons in Icon System PRD'
  },

  // AUT family - 4xxx range (Policy Limits)
  4120: {
    family: 'AUT' as const,
    key: 'AUT_RATE_LIMIT_HIGH_WEIGHT',
    severity: 'warn' as const,
    message: 'Workflow weight may cause rate limiting',
    remediation: 'Reduce node weight or optimize workflow to use fewer resources'
  },
  4121: {
    family: 'AUT' as const,
    key: 'AUT_NODE_MISSING_WEIGHT',
    severity: 'warn' as const,
    message: 'Action node missing rate limit weight',
    remediation: 'Add weight property to action node for accurate rate limiting'
  },

  // SYS family - 5xxx range (Platform & External Failures)
  5510: {
    family: 'SYS' as const,
    key: 'SYS_WORKFLOW_PARSE_ERROR',
    severity: 'error' as const,
    message: 'Unable to parse workflow file',
    remediation: 'Check JSON syntax and workflow structure'
  },
  5511: {
    family: 'SYS' as const,
    key: 'SYS_SCHEMA_VALIDATION_FAILED',
    severity: 'error' as const,
    message: 'Workflow schema validation failed',
    remediation: 'Fix schema violations listed in validation errors'
  }
} as const

/**
 * Main AutoFlow validator class
 * Pure TypeScript - no React dependencies
 */
export class AutoFlowValidator {
  private config: LintConfig
  private nextIssueId = 1

  constructor(config: Partial<LintConfig> = {}) {
    this.config = {
      ...DEFAULT_LINT_CONFIG,
      ...config,
      rules: {
        ...DEFAULT_LINT_CONFIG.rules,
        ...config.rules
      },
      settings: {
        ...DEFAULT_LINT_CONFIG.settings,
        ...config.settings
      }
    }
  }

  /**
   * Main validation method - analyzes a complete workflow
   */
  async validateWorkflow(workflow: Partial<AutomaterWorkflow>): Promise<WorkflowLintResult> {
    const startTime = Date.now()
    const issues: LintIssue[] = []
    let rulesExecuted = 0

    try {
      // 1. Basic structure validation
      const structureIssues = this.validateWorkflowStructure(workflow)
      issues.push(...structureIssues)
      rulesExecuted += 4

      // 2. Graph integrity validation (only if we have nodes)
      if (workflow.nodes && workflow.nodes.length > 0) {
        const graphIssues = this.validateGraphIntegrity(workflow.nodes)
        issues.push(...graphIssues)
        rulesExecuted += 5
      }

      // 3. Node-specific validation
      if (workflow.nodes) {
        const nodeIssues = this.validateNodes(workflow.nodes)
        issues.push(...nodeIssues)
        rulesExecuted += workflow.nodes.length * 3
      }

      // 4. Variable validation
      if (workflow.variables) {
        const variableIssues = this.validateVariables(workflow.variables, workflow)
        issues.push(...variableIssues)
        rulesExecuted += workflow.variables.length * 2
      }

      // 5. Performance analysis
      const performanceIssues = this.validatePerformance(workflow)
      issues.push(...performanceIssues)
      rulesExecuted += 3

      // 6. Automatic permission detection
      if (workflow.trigger && workflow.nodes) {
        const permissionIssues = this.detectAndValidatePermissions(workflow as AutomaterWorkflow)
        issues.push(...permissionIssues)
        rulesExecuted += 1
      }

      // Filter issues based on configuration
      const filteredIssues = this.filterIssues(issues)

      // Categorize issues
      const errors = filteredIssues.filter(i => i.severity === 'error')
      const warnings = filteredIssues.filter(i => i.severity === 'warn')
      const infos = filteredIssues.filter(i => i.severity === 'info')
      const criticals = filteredIssues.filter(i => i.severity === 'critical')

      return {
        workflowId: workflow.id || 'unknown',
        isValid: errors.length === 0 && criticals.length === 0,
        summary: {
          total: filteredIssues.length,
          errors: errors.length,
          warnings: warnings.length,
          infos: infos.length,
          criticals: criticals.length
        },
        issues: filteredIssues,
        errors,
        warnings,
        infos,
        criticals,
        fixableCount: filteredIssues.filter(i => i.fixable).length,
        timestamp: Date.now(),
        performance: {
          analysisTime: Date.now() - startTime,
          rulesExecuted
        }
      }

    } catch (error) {
      return {
        workflowId: workflow.id || 'unknown',
        isValid: false,
        summary: { total: 1, errors: 1, warnings: 0, infos: 0, criticals: 0 },
        issues: [this.createSystemError(error)],
        errors: [this.createSystemError(error)],
        warnings: [],
        infos: [],
        criticals: [],
        fixableCount: 0,
        timestamp: Date.now(),
        performance: {
          analysisTime: Date.now() - startTime,
          rulesExecuted
        }
      }
    }
  }

  /**
   * Quick validation for minimal node structure
   * Accepts any object with id, type, action, params, connections, weight
   */
  async validateNodes(nodes: Array<{
    id: string
    type?: string
    action?: string
    params?: Record<string, unknown>
    connections?: string[]
    weight?: number
  }>): Promise<LintIssue[]> {
    const issues: LintIssue[] = []

    // Convert minimal nodes to WorkflowNode format
    const workflowNodes: WorkflowNode[] = nodes.map(node => ({
      id: node.id,
      type: (node.type || 'action') as WorkflowNode['type'],
      action: node.action,
      params: node.params,
      connections: node.connections || [],
      weight: node.weight
    }))

    // Basic graph validation
    const graphIssues = this.validateGraphIntegrity(workflowNodes)
    issues.push(...graphIssues)

    const nodeIssues = this.validateNodeList(workflowNodes)
    issues.push(...nodeIssues)

    return this.filterIssues(issues)
  }

  // Validation methods
  private validateWorkflowStructure(workflow: Partial<AutomaterWorkflow>): LintIssue[] {
    const issues: LintIssue[] = []

    // Required fields validation
    if (!this.isRuleEnabled('schema/required-fields')) return issues

    const requiredFields: (keyof AutomaterWorkflow)[] = ['id', 'name', 'version', 'trigger']

    for (const field of requiredFields) {
      if (!workflow[field]) {
        issues.push(this.createIssue('schema/required-fields', 5511, {
          message: `Required field '${field}' is missing`,
          location: { path: field }
        }))
      }
    }

    // Version format validation
    if (workflow.version && this.isRuleEnabled('schema/semver')) {
      const semverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/
      if (!semverPattern.test(workflow.version)) {
        issues.push(this.createIssue('schema/semver', 5511, {
          message: 'Version must be valid SemVer (e.g., 1.2.3)',
          location: { path: 'version' }
        }))
      }
    }

    return issues
  }

  private validateGraphIntegrity(nodes: WorkflowNode[]): LintIssue[] {
    const issues: LintIssue[] = []

    if (!nodes || nodes.length === 0) return issues

    // Build adjacency lists
    const nodeIds = new Set(nodes.map(n => n.id))
    const adjacencyList = new Map<string, string[]>()
    const reverseAdjacencyList = new Map<string, string[]>()

    // Initialize
    for (const node of nodes) {
      adjacencyList.set(node.id, [])
      reverseAdjacencyList.set(node.id, [])
    }

    // Build connections
    for (const node of nodes) {
      const connections = node.connections || []
      for (const targetId of connections) {
        // Check for missing nodes
        if (!nodeIds.has(targetId) && this.isRuleEnabled('graph/missing-nodes')) {
          issues.push(this.createIssue('graph/missing-nodes', 3311, {
            message: `Node '${node.id}' connects to non-existent node '${targetId}'`,
            location: { nodeId: node.id }
          }))
          continue
        }

        adjacencyList.get(node.id)?.push(targetId)
        reverseAdjacencyList.get(targetId)?.push(node.id)
      }
    }

    // Find entry points (trigger nodes or nodes with no incoming connections)
    const entryNodes = nodes.filter(node =>
      node.type === 'trigger' ||
      (reverseAdjacencyList.get(node.id)?.length || 0) === 0
    )

    // Validate entry points
    if (this.isRuleEnabled('graph/entry-points')) {
      if (entryNodes.length === 0) {
        issues.push(this.createIssue('graph/entry-points', 3311, {
          message: 'Workflow must have at least one entry point (trigger node)',
          location: { path: 'nodes' }
        }))
      }
    }

    // Find unreachable nodes
    if (this.isRuleEnabled('graph/unreachable-nodes')) {
      const reachable = new Set<string>()

      const dfs = (nodeId: string): void => {
        if (reachable.has(nodeId)) return
        reachable.add(nodeId)

        for (const connected of adjacencyList.get(nodeId) || []) {
          dfs(connected)
        }
      }

      entryNodes.forEach(node => dfs(node.id))

      const unreachableNodes = nodes.filter(node => !reachable.has(node.id))
      for (const node of unreachableNodes) {
        issues.push(this.createIssue('graph/unreachable-nodes', 3310, {
          message: `Node '${node.id}' is unreachable from entry points`,
          location: { nodeId: node.id }
        }))
      }
    }

    return issues
  }

  private validateNodeList(nodes: WorkflowNode[]): LintIssue[] {
    const issues: LintIssue[] = []

    for (const node of nodes) {
      // Action type validation
      if (node.type === 'action' && this.isRuleEnabled('action/unknown-type')) {
        if (!node.action) {
          issues.push(this.createIssue('action/missing-params', 3311, {
            message: `Action node '${node.id}' is missing action type`,
            location: { nodeId: node.id }
          }))
        }
      }

      // Weight validation for performance
      if (node.type === 'action' && this.isRuleEnabled('perf/missing-weight')) {
        if (typeof node.weight !== 'number') {
          issues.push(this.createIssue('perf/missing-weight', 4121, {
            message: `Action node '${node.id}' is missing rate limit weight`,
            location: { nodeId: node.id },
            suggestions: ['Add weight property (typical values: 5-30)']
          }))
        }
      }

      // High weight warning
      if (typeof node.weight === 'number' && this.isRuleEnabled('perf/high-weight')) {
        const maxWeight = this.config.settings?.rateLimits?.maxNodeWeight || 100
        if (node.weight > maxWeight) {
          issues.push(this.createIssue('perf/high-weight', 4120, {
            message: `Node '${node.id}' weight (${node.weight}) exceeds recommended maximum (${maxWeight})`,
            location: { nodeId: node.id }
          }))
        }
      }
    }

    return issues
  }

  private validateVariables(variables: VariableDefinition[], workflow: Partial<AutomaterWorkflow>): LintIssue[] {
    const issues: LintIssue[] = []

    if (!this.isRuleEnabled('variable/naming-convention')) return issues

    const pattern = this.config.settings?.naming?.variableNamePattern || '^[a-zA-Z][a-zA-Z0-9_]*$'
    const regex = new RegExp(pattern)

    for (const variable of variables) {
      if (!regex.test(variable.name)) {
        issues.push(this.createIssue('variable/naming-convention', 3312, {
          message: `Variable name '${variable.name}' doesn't follow naming convention`,
          location: { path: `variables.${variable.name}` },
          suggestions: ['Use camelCase or snake_case naming']
        }))
      }
    }

    return issues
  }

  private validatePerformance(workflow: Partial<AutomaterWorkflow>): LintIssue[] {
    const issues: LintIssue[] = []

    if (!workflow.nodes) return issues

    // Large workflow warning
    if (this.isRuleEnabled('perf/large-workflow')) {
      if (workflow.nodes.length > 50) {
        issues.push(this.createIssue('perf/large-workflow', 4120, {
          message: `Large workflow (${workflow.nodes.length} nodes) may be difficult to maintain`,
          location: { path: 'nodes' }
        }))
      }
    }

    // Calculate total workflow weight
    if (this.isRuleEnabled('perf/high-weight')) {
      const totalWeight = workflow.nodes.reduce((sum, node) => sum + (node.weight || 0), 0)
      const maxWeight = this.config.settings?.rateLimits?.maxWorkflowWeight || 1000
      const warnThreshold = this.config.settings?.rateLimits?.warnThreshold || 0.8

      if (totalWeight > maxWeight * warnThreshold) {
        issues.push(this.createIssue('perf/high-weight', 4120, {
          message: `Total workflow weight (${totalWeight}) approaches rate limit threshold`,
          location: { path: 'nodes' }
        }))
      }
    }

    return issues
  }

  /**
   * Automatically detects required Discord permissions by analyzing workflow graph
   * This method populates workflow.permissions and node.permissions fields
   *
   * @param workflow - The workflow to analyze
   * @returns Array of validation issues (warnings for unknown actions)
   */
  private detectAndValidatePermissions(workflow: AutomaterWorkflow): LintIssue[] {
    const issues: LintIssue[] = []
    const requiredPermissions = new Set<string>()

    // 1. Check trigger permissions
    const triggerEvent = workflow.trigger?.event
    if (triggerEvent && hasTriggerPermissionMapping(triggerEvent)) {
      const triggerPerms = TRIGGER_PERMISSION_MAPPINGS[triggerEvent]
      triggerPerms.forEach(perm => requiredPermissions.add(perm))
    }

    // 2. Check action permissions for each node in workflow
    for (const node of workflow.nodes) {
      if (node.type === 'action' && node.action) {
        if (hasActionPermissionMapping(node.action)) {
          const actionPerms = ACTION_PERMISSION_MAPPINGS[node.action]
          actionPerms.forEach(perm => requiredPermissions.add(perm))

          // Auto-populate node-level permissions for granular tracking
          node.permissions = actionPerms
        } else {
          // Unknown action - add warning if security rules are enabled
          if (this.isRuleEnabled('security/missing-permissions')) {
            issues.push(this.createIssue('security/missing-permissions', 3311, {
              message: `Unknown action '${node.action}' - cannot detect required permissions`,
              location: { nodeId: node.id },
              suggestions: [
                'Check if action is implemented in permission-mappings.ts',
                'Add permission mapping for this action type'
              ]
            }))
          }

          // Set empty permissions array for unknown actions
          node.permissions = []
        }
      }
    }

    // 3. Auto-populate workflow-level permissions (union of all node permissions)
    workflow.permissions = Array.from(requiredPermissions).sort()

    return issues
  }

  /**
   * Public API: Detect required permissions for a workflow without mutating it
   * Returns sorted array of permission flags
   *
   * @param workflow - The workflow to analyze
   * @returns Array of required Discord permission flags (e.g., ['SEND_MESSAGES', 'BAN_MEMBERS'])
   */
  public detectRequiredPermissions(workflow: AutomaterWorkflow): string[] {
    const requiredPermissions = new Set<string>()

    // Check trigger permissions
    const triggerEvent = workflow.trigger?.event
    if (triggerEvent && hasTriggerPermissionMapping(triggerEvent)) {
      const triggerPerms = TRIGGER_PERMISSION_MAPPINGS[triggerEvent]
      triggerPerms.forEach(perm => requiredPermissions.add(perm))
    }

    // Check action permissions for each node
    for (const node of workflow.nodes) {
      if (node.type === 'action' && node.action) {
        if (hasActionPermissionMapping(node.action)) {
          const actionPerms = ACTION_PERMISSION_MAPPINGS[node.action]
          actionPerms.forEach(perm => requiredPermissions.add(perm))
        }
      }
    }

    // Return sorted array for consistent output
    return Array.from(requiredPermissions).sort()
  }

  /**
   * Public API: Get detailed permission breakdown by node
   * Useful for debugging and UI displays
   *
   * @param workflow - The workflow to analyze
   * @returns Detailed permission information
   */
  public getPermissionBreakdown(workflow: AutomaterWorkflow): {
    totalPermissions: string[]
    triggerPermissions: string[]
    nodePermissions: Map<string, string[]>
    unknownActions: string[]
  } {
    const triggerPermissions: string[] = []
    const nodePermissions = new Map<string, string[]>()
    const unknownActions: string[] = []

    // Analyze trigger
    const triggerEvent = workflow.trigger?.event
    if (triggerEvent && hasTriggerPermissionMapping(triggerEvent)) {
      triggerPermissions.push(...TRIGGER_PERMISSION_MAPPINGS[triggerEvent])
    }

    // Analyze each node
    for (const node of workflow.nodes) {
      if (node.type === 'action' && node.action) {
        if (hasActionPermissionMapping(node.action)) {
          nodePermissions.set(node.id, ACTION_PERMISSION_MAPPINGS[node.action])
        } else {
          unknownActions.push(node.action)
          nodePermissions.set(node.id, [])
        }
      }
    }

    return {
      totalPermissions: this.detectRequiredPermissions(workflow),
      triggerPermissions,
      nodePermissions,
      unknownActions
    }
  }

  // Helper methods
  private filterIssues(issues: LintIssue[]): LintIssue[] {
    return issues.filter(issue => {
      const ruleConfig = this.config.rules[issue.ruleId]
      return ruleConfig && ruleConfig !== 'off'
    })
  }

  private isRuleEnabled(ruleId: string): boolean {
    const config = this.config.rules[ruleId]
    return config && config !== 'off'
  }

  private createIssue(
    ruleId: string,
    errorCode: keyof typeof ERROR_CATALOG,
    options: {
      message?: string
      location?: LintIssue['location']
      suggestions?: string[]
    }
  ): LintIssue {
    const catalog = ERROR_CATALOG[errorCode]

    return {
      id: `issue-${this.nextIssueId++}`,
      ruleId,
      errorCode: `${catalog.family}-${errorCode}`,
      family: catalog.family,
      severity: catalog.severity,
      message: options.message || catalog.message,
      remediation: catalog.remediation,
      location: options.location,
      suggestions: options.suggestions,
      fixable: false,
      timestamp: Date.now()
    }
  }

  private createSystemError(error: unknown): LintIssue {
    return {
      id: `system-error-${this.nextIssueId++}`,
      ruleId: 'system/parse-error',
      errorCode: 'SYS-5510',
      family: 'SYS',
      severity: 'error',
      message: `System error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      remediation: 'Check workflow structure and try again',
      fixable: false,
      timestamp: Date.now()
    }
  }
}

// Legacy class name alias for backward compatibility
export { AutoFlowValidator as AutomaterLinter }
