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

import { AutoFlowValidator } from './validator'
import type { AutomaterWorkflow } from './validator'
import { getPermissionSeverity } from './permission-mappings'

/**
 * Pack interface - represents a collection of related automations
 */
export interface AutomaterPack {
  id: string
  name: string
  description?: string
  version: string
  author?: string
  automations: AutomaterWorkflow[]
  tags?: string[]
  visibility?: 'public' | 'private' | 'unlisted'
  createdAt?: string
  updatedAt?: string
}

/**
 * Detailed permission summary for a pack
 */
export interface PermissionSummary {
  /**
   * Union of all permissions required by all automations in the pack
   */
  totalPermissions: string[]

  /**
   * Permissions broken down by automation ID
   */
  permissionsByAutomation: Record<string, string[]>

  /**
   * Permissions used by 2+ automations (shared permissions)
   */
  sharedPermissions: string[]

  /**
   * Permissions used by only 1 automation (unique permissions)
   * Map of automation ID to array of unique permissions
   */
  uniquePermissions: Record<string, string[]>

  /**
   * Count of automations in the pack
   */
  automationCount: number

  /**
   * Count of total unique permissions
   */
  permissionCount: number
}

/**
 * Pack Permission Aggregator
 *
 * Provides methods to analyze permission requirements across multiple automations
 * in a pack, helping users understand the total permission footprint of a pack.
 */
export class PackPermissionAggregator {
  private validator: AutoFlowValidator

  constructor(validator: AutoFlowValidator) {
    this.validator = validator
  }

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
  public aggregatePackPermissions(pack: AutomaterPack): string[] {
    const allPermissions = new Set<string>()

    // Iterate through all automations in the pack
    for (const automation of pack.automations || []) {
      const workflowPermissions = this.validator.detectRequiredPermissions(automation)
      workflowPermissions.forEach(perm => allPermissions.add(perm))
    }

    // Sort alphabetically for consistent output
    return Array.from(allPermissions).sort()
  }

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
  public generatePermissionSummary(pack: AutomaterPack): PermissionSummary {
    const permissionsByAutomation: Record<string, string[]> = {}
    const permissionUsageCount: Record<string, number> = {}

    // Detect permissions for each automation
    for (const automation of pack.automations || []) {
      const perms = this.validator.detectRequiredPermissions(automation)
      permissionsByAutomation[automation.id] = perms

      // Track usage count
      perms.forEach(perm => {
        permissionUsageCount[perm] = (permissionUsageCount[perm] || 0) + 1
      })
    }

    // Find shared permissions (used by 2+ automations)
    const sharedPermissions = Object.entries(permissionUsageCount)
      .filter(([_, count]) => count > 1)
      .map(([perm, _]) => perm)
      .sort()

    // Find unique permissions (used by only 1 automation)
    const uniquePermissions: Record<string, string[]> = {}
    for (const [automationId, perms] of Object.entries(permissionsByAutomation)) {
      uniquePermissions[automationId] = perms.filter(
        perm => permissionUsageCount[perm] === 1
      )
    }

    const totalPermissions = this.aggregatePackPermissions(pack)

    return {
      totalPermissions,
      permissionsByAutomation,
      sharedPermissions,
      uniquePermissions,
      automationCount: pack.automations?.length || 0,
      permissionCount: totalPermissions.length
    }
  }

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
  public comparePackPermissions(packA: AutomaterPack, packB: AutomaterPack): {
    addedPermissions: string[]      // In B but not in A
    removedPermissions: string[]    // In A but not in B
    commonPermissions: string[]     // In both A and B
    packATotal: string[]
    packBTotal: string[]
  } {
    const permsA = new Set(this.aggregatePackPermissions(packA))
    const permsB = new Set(this.aggregatePackPermissions(packB))

    const addedPermissions = Array.from(permsB).filter(p => !permsA.has(p)).sort()
    const removedPermissions = Array.from(permsA).filter(p => !permsB.has(p)).sort()
    const commonPermissions = Array.from(permsA).filter(p => permsB.has(p)).sort()

    return {
      addedPermissions,
      removedPermissions,
      commonPermissions,
      packATotal: Array.from(permsA).sort(),
      packBTotal: Array.from(permsB).sort()
    }
  }

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
  public calculatePackPermissionWeight(pack: AutomaterPack): number {
    const permissions = this.aggregatePackPermissions(pack)

    let weight = 0
    for (const perm of permissions) {
      const severity = getPermissionSeverity(perm)
      switch (severity) {
        case 'dangerous':
          weight += 10
          break
        case 'moderate':
          weight += 3
          break
        case 'safe':
          weight += 1
          break
      }
    }

    return weight
  }

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
  public getDangerousPermissions(pack: AutomaterPack): string[] {
    const permissions = this.aggregatePackPermissions(pack)

    return permissions.filter(perm =>
      getPermissionSeverity(perm) === 'dangerous'
    )
  }
}
