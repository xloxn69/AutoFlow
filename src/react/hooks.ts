/**
 * React hooks for AutoFlow workflow validation
 *
 * Provides real-time validation integration with ReactFlow
 * CRITICAL: Uses useRef for debounce timers to prevent infinite loops
 */

import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { Node, Edge } from 'reactflow'
import {
  AutoFlowValidator,
  WorkflowLintResult,
  LintIssue,
  DEFAULT_LINT_CONFIG,
  LintConfig,
  AutomaterWorkflow,
  WorkflowNode
} from '../core/validator'

export interface UseWorkflowLintingOptions {
  enabled?: boolean
  debounceMs?: number
  config?: Partial<LintConfig>
}

export interface WorkflowLintingState {
  result: WorkflowLintResult | null
  isLinting: boolean
  lastLintTime: number | null
  summary: {
    isValid: boolean
    message: string
    canDeploy: boolean
    total: number
    errors: number
    warnings: number
    infos: number
    criticals: number
  }
  // Quick access arrays
  issues: LintIssue[]
  errors: LintIssue[]
  warnings: LintIssue[]
  infos: LintIssue[]
  criticals: LintIssue[]
  // Methods
  triggerLint: () => void
  getNodeIssues: (nodeId: string) => LintIssue[]
  getEdgeIssues: (edgeId: string) => LintIssue[]
}

/**
 * Main hook for real-time workflow linting with ReactFlow
 * FIXED: Uses useRef for debounce timer to prevent infinite loops
 */
export function useWorkflowLinting(
  nodes: Node[],
  edges: Edge[],
  options: UseWorkflowLintingOptions = {}
): WorkflowLintingState {
  const {
    enabled = true,
    debounceMs = 500,
    config = {}
  } = options

  // State for linting results
  const [result, setResult] = useState<WorkflowLintResult | null>(null)
  const [isLinting, setIsLinting] = useState(false)
  const [lastLintTime, setLastLintTime] = useState<number | null>(null)

  // CRITICAL FIX: Use useRef for debounce timer to prevent re-renders
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const validatorRef = useRef<AutoFlowValidator | null>(null)

  // Initialize validator (stable reference)
  useMemo(() => {
    validatorRef.current = new AutoFlowValidator({
      ...DEFAULT_LINT_CONFIG,
      ...config
    })
  }, [config])

  // Core linting function - stable reference
  const lintWorkflow = useCallback(async (workflowNodes: Node[], workflowEdges: Edge[]) => {
    if (!enabled || !validatorRef.current) return

    try {
      setIsLinting(true)

      // Convert React Flow data to workflow format
      const workflow = createWorkflowFromReactFlow(workflowNodes, workflowEdges)

      // Perform linting
      const lintResult = await validatorRef.current.validateWorkflow(workflow)

      setResult(lintResult)
      setLastLintTime(Date.now())

    } catch (error) {
      console.error('Workflow linting failed:', error)
      // Set error state
      setResult({
        workflowId: 'error',
        isValid: false,
        summary: { total: 1, errors: 1, warnings: 0, infos: 0, criticals: 0 },
        issues: [{
          id: 'lint-error',
          ruleId: 'system/lint-error',
          errorCode: 'SYS-5510',
          family: 'SYS',
          severity: 'error',
          message: `Linting failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          remediation: 'Check workflow structure and try again'
        }],
        errors: [],
        warnings: [],
        infos: [],
        criticals: [],
        fixableCount: 0,
        timestamp: Date.now(),
        performance: { analysisTime: 0, rulesExecuted: 0 }
      })
    } finally {
      setIsLinting(false)
    }
  }, [enabled]) // FIXED: Stable dependency array

  // CRITICAL FIX: Debounced linting with useRef timer
  const debouncedLint = useCallback((workflowNodes: Node[], workflowEdges: Edge[]) => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      lintWorkflow(workflowNodes, workflowEdges)
    }, debounceMs)
  }, [lintWorkflow, debounceMs]) // FIXED: Stable dependencies only

  // Manual lint trigger
  const triggerLint = useCallback(() => {
    // Clear debounce and lint immediately
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    lintWorkflow(nodes, edges)
  }, [lintWorkflow, nodes, edges])

  // CRITICAL FIX: Effect with stable dependencies
  useEffect(() => {
    if (!enabled) {
      // Clear results when disabled
      setResult(null)
      setLastLintTime(null)
      return
    }

    if (nodes.length === 0) {
      // Clear results for empty workflow
      setResult(null)
      setLastLintTime(null)
      return
    }

    // Trigger debounced linting
    debouncedLint(nodes, edges)

    // Cleanup function
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [nodes, edges, enabled, debouncedLint]) // FIXED: Stable dependencies

  // Helper functions for accessing issues
  const getNodeIssues = useCallback((nodeId: string): LintIssue[] => {
    if (!result) return []
    return result.issues.filter(issue => issue.location?.nodeId === nodeId)
  }, [result])

  const getEdgeIssues = useCallback((edgeId: string): LintIssue[] => {
    if (!result) return []
    return result.issues.filter(issue => issue.location?.edgeId === edgeId)
  }, [result])

  // Computed summary
  const summary = useMemo(() => {
    if (!result) {
      return {
        isValid: nodes.length === 0,
        message: nodes.length === 0 ? 'No workflow to validate' : 'Validating...',
        canDeploy: false,
        total: 0,
        errors: 0,
        warnings: 0,
        infos: 0,
        criticals: 0
      }
    }

    const { isValid, summary: resultSummary } = result

    if (isValid) {
      return {
        isValid: true,
        message: 'Workflow is valid and ready to deploy',
        canDeploy: true,
        ...resultSummary
      }
    }

    if (resultSummary.errors > 0 || resultSummary.criticals > 0) {
      const errorCount = resultSummary.errors + resultSummary.criticals
      return {
        isValid: false,
        message: `${errorCount} error${errorCount === 1 ? '' : 's'} must be fixed before deployment`,
        canDeploy: false,
        ...resultSummary
      }
    }

    if (resultSummary.warnings > 0) {
      return {
        isValid: true,
        message: `${resultSummary.warnings} warning${resultSummary.warnings === 1 ? '' : 's'} - deployment allowed`,
        canDeploy: true,
        ...resultSummary
      }
    }

    return {
      isValid: true,
      message: 'Workflow is valid',
      canDeploy: true,
      ...resultSummary
    }
  }, [result, nodes.length])

  return {
    result,
    isLinting,
    lastLintTime,
    summary,
    issues: result?.issues || [],
    errors: result?.errors || [],
    warnings: result?.warnings || [],
    infos: result?.infos || [],
    criticals: result?.criticals || [],
    triggerLint,
    getNodeIssues,
    getEdgeIssues
  }
}

/**
 * Hook for node-specific linting state
 * Used to highlight nodes with issues in React Flow
 */
export function useNodeLinting(nodeId: string, lintingState: WorkflowLintingState) {
  return useMemo(() => {
    const issues = lintingState.getNodeIssues(nodeId)

    const hasErrors = issues.some(issue =>
      issue.severity === 'error' || issue.severity === 'critical'
    )
    const hasWarnings = issues.some(issue => issue.severity === 'warn')
    const hasIssues = issues.length > 0

    // Determine highest severity
    let severity: 'error' | 'warn' | 'info' | 'critical' | null = null
    if (issues.some(i => i.severity === 'critical')) severity = 'critical'
    else if (issues.some(i => i.severity === 'error')) severity = 'error'
    else if (issues.some(i => i.severity === 'warn')) severity = 'warn'
    else if (issues.some(i => i.severity === 'info')) severity = 'info'

    return {
      hasIssues,
      hasErrors,
      hasWarnings,
      issues,
      severity,
      // Quick styling helpers
      borderColor: severity === 'critical' ? '#dc2626' :
                  severity === 'error' ? '#ef4444' :
                  severity === 'warn' ? '#f59e0b' :
                  severity === 'info' ? '#3b82f6' : undefined,
      bgColor: severity === 'critical' ? '#dc262610' :
               severity === 'error' ? '#ef444410' :
               severity === 'warn' ? '#f59e0b10' :
               severity === 'info' ? '#3b82f610' : undefined
    }
  }, [nodeId, lintingState])
}

/**
 * Hook for edge-specific linting state
 */
export function useEdgeLinting(edgeId: string, lintingState: WorkflowLintingState) {
  return useMemo(() => {
    const issues = lintingState.getEdgeIssues(edgeId)

    const hasErrors = issues.some(issue =>
      issue.severity === 'error' || issue.severity === 'critical'
    )
    const hasIssues = issues.length > 0

    // Determine highest severity
    let severity: 'error' | 'warn' | 'info' | 'critical' | null = null
    if (issues.some(i => i.severity === 'critical')) severity = 'critical'
    else if (issues.some(i => i.severity === 'error')) severity = 'error'
    else if (issues.some(i => i.severity === 'warn')) severity = 'warn'
    else if (issues.some(i => i.severity === 'info')) severity = 'info'

    return {
      hasIssues,
      hasErrors,
      issues,
      severity,
      // Quick styling helpers
      strokeColor: severity === 'critical' ? '#dc2626' :
                   severity === 'error' ? '#ef4444' :
                   severity === 'warn' ? '#f59e0b' :
                   severity === 'info' ? '#3b82f6' : undefined
    }
  }, [edgeId, lintingState])
}

/**
 * Hook for getting issues grouped by severity
 */
export function useGroupedIssues(lintingState: WorkflowLintingState) {
  return useMemo(() => {
    const { issues } = lintingState

    return {
      critical: issues.filter(i => i.severity === 'critical'),
      error: issues.filter(i => i.severity === 'error'),
      warning: issues.filter(i => i.severity === 'warn'),
      info: issues.filter(i => i.severity === 'info'),
      byNode: issues.reduce((acc, issue) => {
        const nodeId = issue.location?.nodeId
        if (nodeId) {
          if (!acc[nodeId]) acc[nodeId] = []
          acc[nodeId].push(issue)
        }
        return acc
      }, {} as Record<string, LintIssue[]>)
    }
  }, [lintingState.issues])
}

/**
 * Utility function to convert ReactFlow nodes/edges to workflow format
 */
export function createWorkflowFromReactFlow(nodes: Node[], edges: Edge[]): Partial<AutomaterWorkflow> {
  const workflowNodes: WorkflowNode[] = nodes.map(node => ({
    id: node.id,
    type: (node.data?.type || 'action') as WorkflowNode['type'],
    action: node.data?.action,
    params: node.data?.params,
    connections: edges
      .filter(edge => edge.source === node.id)
      .map(edge => edge.target),
    weight: node.data?.weight
  }))

  return {
    id: 'temp-workflow',
    name: 'Temporary Workflow',
    version: '1.0.0',
    trigger: { type: 'event', event: 'messageCreate' },
    nodes: workflowNodes
  }
}
