import { A as AutoFlowValidator, a as AutomaterWorkflow } from '../validator-gjKZUoHp.js';
export { D as DEFAULT_LINT_CONFIG, d as LintConfig, L as LintIssue, V as VariableDefinition, c as WorkflowLintResult, b as WorkflowNode, W as WorkflowTrigger } from '../validator-gjKZUoHp.js';

/**
 * Action-to-Permission Mapping Registry
 *
 * This file serves as the SINGLE SOURCE OF TRUTH for automatic permission detection
 * in the AutoFlow workflow validation system. Each action type is mapped to the
 * Discord permissions required to execute that action.
 *
 * Based on Discord.js PermissionFlagsBits and Discord API documentation.
 * See: https://discord.com/developers/docs/topics/permissions
 *
 * @module permission-mappings
 * @packageDocumentation
 */
/**
 * Maps AutoFlow action types to required Discord permission flags
 *
 * Permission flags correspond to Discord.js PermissionFlagsBits:
 * - SEND_MESSAGES, VIEW_CHANNEL, MANAGE_MESSAGES, etc.
 *
 * Empty arrays [] indicate no Discord permissions required (e.g., database operations)
 */
declare const ACTION_PERMISSION_MAPPINGS: Record<string, string[]>;
/**
 * Maps AutoFlow trigger types to required Discord permissions for event listening
 *
 * Most triggers are passive (no permissions needed to listen), but some require
 * permissions to access the event data properly.
 *
 * Note: These are permissions needed to LISTEN to events, not to trigger them.
 */
declare const TRIGGER_PERMISSION_MAPPINGS: Record<string, string[]>;
/**
 * Permission severity classification for UI display
 *
 * - DANGEROUS: Can cause severe damage (ban, kick, manage guild, administrator)
 * - MODERATE: Significant impact (manage messages, channels, roles, nicknames)
 * - SAFE: Minimal impact (send messages, add reactions, view channels)
 */
declare const PERMISSION_SEVERITY: Record<string, 'safe' | 'moderate' | 'dangerous'>;
/**
 * Human-readable descriptions for Discord permissions
 * Source: Discord Developer Documentation
 */
declare const PERMISSION_DESCRIPTIONS: Record<string, string>;
/**
 * Type guard to check if an action type has a permission mapping
 */
declare function hasActionPermissionMapping(action: string): boolean;
/**
 * Type guard to check if a trigger type has a permission mapping
 */
declare function hasTriggerPermissionMapping(trigger: string): boolean;
/**
 * Get permission severity level for UI display
 */
declare function getPermissionSeverity(permission: string): 'safe' | 'moderate' | 'dangerous';
/**
 * Get human-readable description for a permission
 */
declare function getPermissionDescription(permission: string): string;

/**
 * Pack Permission Aggregator
 *
 * Aggregates permissions from multiple automations in a pack.
 * When users install a pack containing multiple workflows, this provides
 * the union of all required permissions across all automations.
 *
 * @module pack-aggregator
 * @packageDocumentation
 */

/**
 * Pack interface - represents a collection of related automations
 */
interface AutomaterPack {
    id: string;
    name: string;
    description?: string;
    version: string;
    author?: string;
    automations: AutomaterWorkflow[];
    tags?: string[];
    visibility?: 'public' | 'private' | 'unlisted';
    createdAt?: string;
    updatedAt?: string;
}
/**
 * Detailed permission summary for a pack
 */
interface PermissionSummary {
    /**
     * Union of all permissions required by all automations in the pack
     */
    totalPermissions: string[];
    /**
     * Permissions broken down by automation ID
     */
    permissionsByAutomation: Record<string, string[]>;
    /**
     * Permissions used by 2+ automations (shared permissions)
     */
    sharedPermissions: string[];
    /**
     * Permissions used by only 1 automation (unique permissions)
     * Map of automation ID to array of unique permissions
     */
    uniquePermissions: Record<string, string[]>;
    /**
     * Count of automations in the pack
     */
    automationCount: number;
    /**
     * Count of total unique permissions
     */
    permissionCount: number;
}
/**
 * Pack Permission Aggregator
 *
 * Provides methods to analyze permission requirements across multiple automations
 * in a pack, helping users understand the total permission footprint of a pack.
 */
declare class PackPermissionAggregator {
    private validator;
    constructor(validator: AutoFlowValidator);
    /**
     * Aggregates permissions from all automations in a pack
     * Returns the union of all required permissions
     *
     * @param pack - The pack containing multiple automations
     * @returns Array of all unique permissions required (sorted alphabetically)
     *
     * @example
     * ```typescript
     * const aggregator = new PackPermissionAggregator(validator)
     * const permissions = aggregator.aggregatePackPermissions(moderationPack)
     * // Returns: ['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES', 'SEND_MESSAGES']
     * ```
     */
    aggregatePackPermissions(pack: AutomaterPack): string[];
    /**
     * Generates a detailed permission summary for a pack
     * Provides breakdown of shared vs unique permissions, useful for pack analysis
     *
     * @param pack - The pack to analyze
     * @returns Detailed permission breakdown
     *
     * @example
     * ```typescript
     * const summary = aggregator.generatePermissionSummary(moderationPack)
     * console.log(`Total permissions: ${summary.totalPermissions.length}`)
     * console.log(`Shared permissions: ${summary.sharedPermissions.join(', ')}`)
     * ```
     */
    generatePermissionSummary(pack: AutomaterPack): PermissionSummary;
    /**
     * Compare permission requirements between two packs
     * Useful for pack version upgrades or alternative pack comparisons
     *
     * @param packA - First pack to compare
     * @param packB - Second pack to compare
     * @returns Comparison result showing added, removed, and common permissions
     *
     * @example
     * ```typescript
     * const comparison = aggregator.comparePackPermissions(oldVersion, newVersion)
     * if (comparison.addedPermissions.length > 0) {
     *   console.log(`New permissions required: ${comparison.addedPermissions.join(', ')}`)
     * }
     * ```
     */
    comparePackPermissions(packA: AutomaterPack, packB: AutomaterPack): {
        addedPermissions: string[];
        removedPermissions: string[];
        commonPermissions: string[];
        packATotal: string[];
        packBTotal: string[];
    };
    /**
     * Calculates pack permission "weight" based on severity
     * Higher weight = more dangerous permissions
     *
     * Scoring:
     * - Dangerous permission: 10 points (BAN_MEMBERS, KICK_MEMBERS, etc.)
     * - Moderate permission: 3 points (MANAGE_MESSAGES, MANAGE_CHANNELS, etc.)
     * - Safe permission: 1 point (SEND_MESSAGES, VIEW_CHANNEL, etc.)
     *
     * @param pack - The pack to analyze
     * @returns Numeric weight score
     *
     * @example
     * ```typescript
     * const weight = aggregator.calculatePackPermissionWeight(pack)
     * if (weight > 50) {
     *   console.warn('This pack requires dangerous permissions')
     * }
     * ```
     */
    calculatePackPermissionWeight(pack: AutomaterPack): number;
    /**
     * Checks if a pack has any dangerous permissions
     * Returns list of dangerous permissions if found
     *
     * @param pack - The pack to check
     * @returns Array of dangerous permission flags
     *
     * @example
     * ```typescript
     * const dangerous = aggregator.getDangerousPermissions(pack)
     * if (dangerous.length > 0) {
     *   alert(`Warning: This pack requires dangerous permissions: ${dangerous.join(', ')}`)
     * }
     * ```
     */
    getDangerousPermissions(pack: AutomaterPack): string[];
}

export { ACTION_PERMISSION_MAPPINGS, AutoFlowValidator, AutoFlowValidator as AutomaterLinter, type AutomaterPack, AutomaterWorkflow, PERMISSION_DESCRIPTIONS, PERMISSION_SEVERITY, PackPermissionAggregator, type PermissionSummary, TRIGGER_PERMISSION_MAPPINGS, getPermissionDescription, getPermissionSeverity, hasActionPermissionMapping, hasTriggerPermissionMapping };
