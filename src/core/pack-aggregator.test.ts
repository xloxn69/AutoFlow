/**
 * Pack Permission Aggregator Tests
 *
 * Tests for aggregating permissions across multiple automations in a pack.
 * Validates shared/unique permission analysis and risk scoring.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { PackPermissionAggregator } from './pack-aggregator'
import { AutoFlowValidator } from './validator'
import type { AutomaterPack } from './pack-aggregator'
import type { AutomaterWorkflow } from './validator'

describe('PackPermissionAggregator', () => {
  let validator: AutoFlowValidator
  let aggregator: PackPermissionAggregator

  beforeEach(() => {
    validator = new AutoFlowValidator()
    aggregator = new PackPermissionAggregator(validator)
  })

  describe('aggregatePackPermissions()', () => {
    it('should aggregate permissions from multiple automations', () => {
      const workflow1: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Workflow 1',
        trigger: { id: 'trigger-1', event: 'message_create' },
        nodes: [
          {
            id: 'node-1',
            type: 'action',
            action: 'send_message',
            parameters: { channel: '123', message: 'Test' },
            position: { x: 0, y: 0 },
          },
        ],
        edges: [],
      }

      const workflow2: AutomaterWorkflow = {
        id: 'workflow-2',
        name: 'Workflow 2',
        trigger: { id: 'trigger-1', event: 'message_create' },
        nodes: [
          {
            id: 'node-1',
            type: 'action',
            action: 'ban_user',
            parameters: { user: '456', reason: 'Test' },
            position: { x: 0, y: 0 },
          },
        ],
        edges: [],
      }

      const pack: AutomaterPack = {
        id: 'test-pack-1',
        name: 'Test Pack',
        version: '1.0.0',
        automations: [workflow1, workflow2],
      }

      const permissions = aggregator.aggregatePackPermissions(pack)

      expect(permissions).toContain('SEND_MESSAGES')
      expect(permissions).toContain('BAN_MEMBERS')
      expect(permissions).toContain('VIEW_CHANNEL')
      expect(permissions.length).toBeGreaterThan(0)
    })

    it('should return empty array for pack with no automations', () => {
      const pack: AutomaterPack = {
        id: 'test-pack-2',
        name: 'Empty Pack',
        version: '1.0.0',
        automations: [],
      }

      const permissions = aggregator.aggregatePackPermissions(pack)

      expect(permissions).toEqual([])
    })

    it('should deduplicate permissions across automations', () => {
      const workflow1: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Workflow 1',
        trigger: { id: 'trigger-1', event: 'message_create' },
        nodes: [
          {
            id: 'node-1',
            type: 'action',
            action: 'send_message',
            parameters: { channel: '123', message: 'Test' },
            position: { x: 0, y: 0 },
          },
        ],
        edges: [],
      }

      const workflow2: AutomaterWorkflow = {
        id: 'workflow-2',
        name: 'Workflow 2',
        trigger: { id: 'trigger-1', event: 'message_create' },
        nodes: [
          {
            id: 'node-1',
            type: 'action',
            action: 'send_message',
            parameters: { channel: '456', message: 'Test 2' },
            position: { x: 0, y: 0 },
          },
        ],
        edges: [],
      }

      const pack: AutomaterPack = {
        id: 'test-pack-3',
        name: 'Duplicate Pack',
        version: '1.0.0',
        automations: [workflow1, workflow2],
      }

      const permissions = aggregator.aggregatePackPermissions(pack)

      // Should deduplicate SEND_MESSAGES and VIEW_CHANNEL
      const sendMessagesCount = permissions.filter(p => p === 'SEND_MESSAGES').length
      const viewChannelCount = permissions.filter(p => p === 'VIEW_CHANNEL').length

      expect(sendMessagesCount).toBe(1)
      expect(viewChannelCount).toBe(1)
    })

    it('should sort permissions alphabetically', () => {
      const workflow1: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Workflow 1',
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const workflow2: AutomaterWorkflow = {
        id: 'workflow-2',
        name: 'Workflow 2',
        nodes: [
          { id: 'node-1', type: 'action', action: 'ban_user', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const workflow3: AutomaterWorkflow = {
        id: 'workflow-3',
        name: 'Workflow 3',
        nodes: [
          { id: 'node-1', type: 'action', action: 'add_role', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const pack: AutomaterPack = {
        id: 'test-pack-4',
        name: 'Sorted Pack',
        version: '1.0.0',
        automations: [workflow1, workflow2, workflow3],
      }

      const permissions = aggregator.aggregatePackPermissions(pack)

      const sortedPermissions = [...permissions].sort()
      expect(permissions).toEqual(sortedPermissions)
    })
  })

  describe('generatePermissionSummary()', () => {
    it('should generate detailed permission summary', () => {
      const workflow1: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Workflow 1',
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const workflow2: AutomaterWorkflow = {
        id: 'workflow-2',
        name: 'Workflow 2',
        nodes: [
          { id: 'node-1', type: 'action', action: 'ban_user', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const pack: AutomaterPack = {
        id: 'test-pack-5',
        name: 'Summary Pack',
        version: '1.0.0',
        automations: [workflow1, workflow2],
      }

      const summary = aggregator.generatePermissionSummary(pack)

      expect(summary).toHaveProperty('totalPermissions')
      expect(summary).toHaveProperty('permissionsByAutomation')
      expect(summary).toHaveProperty('sharedPermissions')
      expect(summary).toHaveProperty('uniquePermissions')
      expect(summary).toHaveProperty('automationCount')
      expect(summary).toHaveProperty('permissionCount')

      expect(summary.automationCount).toBe(2)
      expect(summary.permissionCount).toBeGreaterThan(0)
      expect(summary.permissionsByAutomation['workflow-1']).toBeDefined()
      expect(summary.permissionsByAutomation['workflow-2']).toBeDefined()
    })

    it('should identify shared permissions correctly', () => {
      const workflow1: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Workflow 1',
        trigger: { id: 'trigger-1', event: 'message_create' },
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const workflow2: AutomaterWorkflow = {
        id: 'workflow-2',
        name: 'Workflow 2',
        trigger: { id: 'trigger-1', event: 'message_create' },
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const pack: AutomaterPack = {
        id: 'test-pack-6',
        name: 'Shared Pack',
        version: '1.0.0',
        automations: [workflow1, workflow2],
      }

      const summary = aggregator.generatePermissionSummary(pack)

      // SEND_MESSAGES and VIEW_CHANNEL should be shared (used by both)
      expect(summary.sharedPermissions).toContain('SEND_MESSAGES')
      expect(summary.sharedPermissions).toContain('VIEW_CHANNEL')
    })

    it('should identify unique permissions correctly', () => {
      const workflow1: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Workflow 1',
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const workflow2: AutomaterWorkflow = {
        id: 'workflow-2',
        name: 'Workflow 2',
        nodes: [
          { id: 'node-1', type: 'action', action: 'ban_user', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const pack: AutomaterPack = {
        id: 'test-pack-7',
        name: 'Unique Pack',
        version: '1.0.0',
        automations: [workflow1, workflow2],
      }

      const summary = aggregator.generatePermissionSummary(pack)

      // BAN_MEMBERS should be unique to workflow-2
      expect(summary.uniquePermissions['workflow-2']).toContain('BAN_MEMBERS')

      // SEND_MESSAGES should be unique to workflow-1
      expect(summary.uniquePermissions['workflow-1']).toContain('SEND_MESSAGES')
    })

    it('should handle packs with single automation', () => {
      const workflow1: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Single Workflow',
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const pack: AutomaterPack = {
        id: 'test-pack-8',
        name: 'Single Pack',
        version: '1.0.0',
        automations: [workflow1],
      }

      const summary = aggregator.generatePermissionSummary(pack)

      expect(summary.automationCount).toBe(1)
      expect(summary.sharedPermissions).toEqual([]) // No shared permissions with only 1 automation
      expect(summary.uniquePermissions['workflow-1'].length).toBeGreaterThan(0)
    })
  })

  describe('comparePackPermissions()', () => {
    it('should identify added permissions in new version', () => {
      const oldWorkflow: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Old Workflow',
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const newWorkflow: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'New Workflow',
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
          { id: 'node-2', type: 'action', action: 'ban_user', parameters: {}, position: { x: 100, y: 0 } },
        ],
        edges: [],
      }

      const packV1: AutomaterPack = {
        id: 'test-pack',
        name: 'Test Pack',
        version: '1.0.0',
        automations: [oldWorkflow],
      }

      const packV2: AutomaterPack = {
        id: 'test-pack',
        name: 'Test Pack',
        version: '2.0.0',
        automations: [newWorkflow],
      }

      const comparison = aggregator.comparePackPermissions(packV1, packV2)

      expect(comparison.addedPermissions).toContain('BAN_MEMBERS')
      expect(comparison.removedPermissions).toEqual([])
      expect(comparison.commonPermissions).toContain('SEND_MESSAGES')
    })

    it('should identify removed permissions in new version', () => {
      const oldWorkflow: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Old Workflow',
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
          { id: 'node-2', type: 'action', action: 'ban_user', parameters: {}, position: { x: 100, y: 0 } },
        ],
        edges: [],
      }

      const newWorkflow: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'New Workflow',
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const packV1: AutomaterPack = {
        id: 'test-pack',
        name: 'Test Pack',
        version: '1.0.0',
        automations: [oldWorkflow],
      }

      const packV2: AutomaterPack = {
        id: 'test-pack',
        name: 'Test Pack',
        version: '2.0.0',
        automations: [newWorkflow],
      }

      const comparison = aggregator.comparePackPermissions(packV1, packV2)

      expect(comparison.removedPermissions).toContain('BAN_MEMBERS')
      expect(comparison.addedPermissions).toEqual([])
      expect(comparison.commonPermissions).toContain('SEND_MESSAGES')
    })

    it('should identify common permissions', () => {
      const workflow: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Workflow',
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const packV1: AutomaterPack = {
        id: 'test-pack',
        name: 'Test Pack',
        version: '1.0.0',
        automations: [workflow],
      }

      const packV2: AutomaterPack = {
        id: 'test-pack',
        name: 'Test Pack',
        version: '2.0.0',
        automations: [workflow],
      }

      const comparison = aggregator.comparePackPermissions(packV1, packV2)

      expect(comparison.addedPermissions).toEqual([])
      expect(comparison.removedPermissions).toEqual([])
      expect(comparison.commonPermissions).toContain('SEND_MESSAGES')
      expect(comparison.packATotal).toEqual(comparison.packBTotal)
    })
  })

  describe('calculatePackPermissionWeight()', () => {
    it('should calculate weight based on permission severity', () => {
      const safeWorkflow: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Safe Workflow',
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const dangerousWorkflow: AutomaterWorkflow = {
        id: 'workflow-2',
        name: 'Dangerous Workflow',
        nodes: [
          { id: 'node-1', type: 'action', action: 'ban_user', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const safePack: AutomaterPack = {
        id: 'safe-pack',
        name: 'Safe Pack',
        version: '1.0.0',
        automations: [safeWorkflow],
      }

      const dangerousPack: AutomaterPack = {
        id: 'dangerous-pack',
        name: 'Dangerous Pack',
        version: '1.0.0',
        automations: [dangerousWorkflow],
      }

      const safeWeight = aggregator.calculatePackPermissionWeight(safePack)
      const dangerousWeight = aggregator.calculatePackPermissionWeight(dangerousPack)

      // Dangerous permissions should have higher weight
      expect(dangerousWeight).toBeGreaterThan(safeWeight)
    })

    it('should return 0 for packs with no permissions', () => {
      const dataOnlyWorkflow: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Data Only Workflow',
        nodes: [
          { id: 'node-1', type: 'action', action: 'variable_set', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const pack: AutomaterPack = {
        id: 'data-pack',
        name: 'Data Pack',
        version: '1.0.0',
        automations: [dataOnlyWorkflow],
      }

      const weight = aggregator.calculatePackPermissionWeight(pack)

      expect(weight).toBe(0)
    })

    it('should accumulate weight across multiple permissions', () => {
      const workflow: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Multi-Permission Workflow',
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
          { id: 'node-2', type: 'action', action: 'ban_user', parameters: {}, position: { x: 100, y: 0 } },
          { id: 'node-3', type: 'action', action: 'delete_message', parameters: {}, position: { x: 200, y: 0 } },
        ],
        edges: [],
      }

      const pack: AutomaterPack = {
        id: 'multi-pack',
        name: 'Multi Permission Pack',
        version: '1.0.0',
        automations: [workflow],
      }

      const weight = aggregator.calculatePackPermissionWeight(pack)

      // Weight should be sum of: dangerous (10) + safe (1) + moderate (3) + safe (1) = 15+
      expect(weight).toBeGreaterThan(10)
    })
  })

  describe('getDangerousPermissions()', () => {
    it('should identify dangerous permissions in pack', () => {
      const workflow: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Moderation Workflow',
        nodes: [
          { id: 'node-1', type: 'action', action: 'ban_user', parameters: {}, position: { x: 0, y: 0 } },
          { id: 'node-2', type: 'action', action: 'kick_user', parameters: {}, position: { x: 100, y: 0 } },
          { id: 'node-3', type: 'action', action: 'send_message', parameters: {}, position: { x: 200, y: 0 } },
        ],
        edges: [],
      }

      const pack: AutomaterPack = {
        id: 'mod-pack',
        name: 'Moderation Pack',
        version: '1.0.0',
        automations: [workflow],
      }

      const dangerous = aggregator.getDangerousPermissions(pack)

      expect(dangerous).toContain('BAN_MEMBERS')
      expect(dangerous).toContain('KICK_MEMBERS')
      expect(dangerous).not.toContain('SEND_MESSAGES') // Safe permission
    })

    it('should return empty array for packs with no dangerous permissions', () => {
      const workflow: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Safe Workflow',
        nodes: [
          { id: 'node-1', type: 'action', action: 'send_message', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const pack: AutomaterPack = {
        id: 'safe-pack',
        name: 'Safe Pack',
        version: '1.0.0',
        automations: [workflow],
      }

      const dangerous = aggregator.getDangerousPermissions(pack)

      expect(dangerous).toEqual([])
    })

    it('should deduplicate dangerous permissions', () => {
      const workflow1: AutomaterWorkflow = {
        id: 'workflow-1',
        name: 'Workflow 1',
        nodes: [
          { id: 'node-1', type: 'action', action: 'ban_user', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const workflow2: AutomaterWorkflow = {
        id: 'workflow-2',
        name: 'Workflow 2',
        nodes: [
          { id: 'node-1', type: 'action', action: 'ban_user', parameters: {}, position: { x: 0, y: 0 } },
        ],
        edges: [],
      }

      const pack: AutomaterPack = {
        id: 'duplicate-pack',
        name: 'Duplicate Pack',
        version: '1.0.0',
        automations: [workflow1, workflow2],
      }

      const dangerous = aggregator.getDangerousPermissions(pack)

      const banMembersCount = dangerous.filter(p => p === 'BAN_MEMBERS').length
      expect(banMembersCount).toBe(1)
    })
  })
})
