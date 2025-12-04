/**
 * AutoFlow Core Validator
 *
 * Pure TypeScript workflow validation engine with zero React dependencies
 * Can run in Node.js, browser, Deno, or any JavaScript runtime
 */
interface AutomaterWorkflow {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    version: string;
    category?: string;
    tags?: string[];
    trigger: WorkflowTrigger;
    nodes: WorkflowNode[];
    permissions?: string[];
    variables?: VariableDefinition[];
    visibility?: 'public' | 'private' | 'unlisted';
    createdAt?: string;
    updatedAt?: string;
}
interface WorkflowTrigger {
    type: 'event' | 'slash_command' | 'prefixed_command' | 'schedule';
    event?: string;
    command?: string;
    prefix?: string;
    schedule?: string;
}
interface WorkflowNode {
    id: string;
    type: 'trigger' | 'action' | 'condition' | 'transformer' | 'end';
    action?: string;
    params?: Record<string, unknown>;
    connections?: string[];
    onError?: string;
    weight?: number;
    permissions?: string[];
}
interface VariableDefinition {
    name: string;
    type: 'guild' | 'member' | 'custom';
    scope: 'guild' | 'global';
    description?: string;
    default?: unknown;
}
interface LintIssue {
    id: string;
    ruleId: string;
    errorCode: string;
    family: 'AUT' | 'SYS';
    severity: 'info' | 'warn' | 'error' | 'critical';
    message: string;
    remediation: string;
    devHint?: string;
    location?: {
        nodeId?: string;
        edgeId?: string;
        path?: string;
        line?: number;
        column?: number;
    };
    context?: Record<string, unknown>;
    fixable?: boolean;
    suggestions?: string[];
    timestamp?: number;
}
interface WorkflowLintResult {
    workflowId: string;
    isValid: boolean;
    summary: {
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
    fixableCount: number;
    timestamp: number;
    performance: {
        analysisTime: number;
        rulesExecuted: number;
    };
}
interface LintConfig {
    rules: Record<string, 'off' | 'warn' | 'error'>;
    settings?: {
        rateLimits?: {
            maxWorkflowWeight: number;
            maxNodeWeight: number;
            warnThreshold: number;
        };
        naming?: {
            workflowIdPattern: string;
            nodeIdPattern: string;
            variableNamePattern: string;
        };
    };
}
declare const DEFAULT_LINT_CONFIG: LintConfig;
/**
 * Main AutoFlow validator class
 * Pure TypeScript - no React dependencies
 */
declare class AutoFlowValidator {
    private config;
    private nextIssueId;
    constructor(config?: Partial<LintConfig>);
    /**
     * Main validation method - analyzes a complete workflow
     */
    validateWorkflow(workflow: Partial<AutomaterWorkflow>): Promise<WorkflowLintResult>;
    /**
     * Quick validation for minimal node structure
     * Accepts any object with id, type, action, params, connections, weight
     */
    validateNodes(nodes: Array<{
        id: string;
        type?: string;
        action?: string;
        params?: Record<string, unknown>;
        connections?: string[];
        weight?: number;
    }>): LintIssue[];
    private validateWorkflowStructure;
    private validateGraphIntegrity;
    private validateNodeList;
    private validateVariables;
    private validatePerformance;
    /**
     * Automatically detects required Discord permissions by analyzing workflow graph
     * This method populates workflow.permissions and node.permissions fields
     *
     * @param workflow - The workflow to analyze
     * @returns Array of validation issues (warnings for unknown actions)
     */
    private detectAndValidatePermissions;
    /**
     * Public API: Detect required permissions for a workflow without mutating it
     * Returns sorted array of permission flags
     *
     * @param workflow - The workflow to analyze
     * @returns Array of required Discord permission flags (e.g., ['SEND_MESSAGES', 'BAN_MEMBERS'])
     */
    detectRequiredPermissions(workflow: AutomaterWorkflow): string[];
    /**
     * Public API: Get detailed permission breakdown by node
     * Useful for debugging and UI displays
     *
     * @param workflow - The workflow to analyze
     * @returns Detailed permission information
     */
    getPermissionBreakdown(workflow: AutomaterWorkflow): {
        totalPermissions: string[];
        triggerPermissions: string[];
        nodePermissions: Map<string, string[]>;
        unknownActions: string[];
    };
    private filterIssues;
    private isRuleEnabled;
    private createIssue;
    private createSystemError;
}

export { AutoFlowValidator as A, DEFAULT_LINT_CONFIG as D, type LintIssue as L, type VariableDefinition as V, type WorkflowTrigger as W, type AutomaterWorkflow as a, type WorkflowNode as b, type WorkflowLintResult as c, type LintConfig as d };
