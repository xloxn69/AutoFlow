/**
 * Validator Permission Detection Tests
 *
 * Tests for AutoFlowValidator's automatic permission detection capabilities.
 * Validates that workflows are analyzed correctly to extract required permissions.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { AutoFlowValidator } from './validator'
import type { AutomaterWorkflow } from './validator'

describe('AutoFlowValidator - Permission Detection', () => {
  let validator: AutoFlowValidator

  beforeEach(() => {
    validator = new AutoFlowValidator()
  })

  describe('detectRequiredPermissions()', () => {
    it('should detect permissions from simple workflows', () => {
      const workflow: AutomaterWorkflow = {
        id: 'test-workflow-1',
        name: 'Test Workflow',
        version: '1.0.0',
        trigger: {
          type: 'event',
          event: 'send_message',
        },
        nodes: [
          {
            id: 'node-1',
            type: 'action',
            action: 'send_message',
            params: { channel: '123', message: 'Hello' },
          },
        ],
      }

      const permissions = validator.detectRequiredPermissions(workflow)

      expect(permissions).toContain('VIEW_CHANNEL')
      expect(permissions).toContain('SEND_MESSAGES')
      expect(permissions.length).toBeGreaterThan(0)
    })

    it('should detect permissions from moderation workflows', () => {
      const workflow: AutomaterWorkflow = {
        id: 'test-workflow-2',
        name: 'Moderation Workflow',
        version: '1.0.0',
        trigger: {
          type: 'event',
          event: 'send_message',
        },
        nodes: [
          {
            id: 'node-1',
            type: 'action',
            action: 'ban_user',
            params: { user: '123', reason: 'Spam' },
          },
          {
            id: 'node-2',
            type: 'action',
            action: 'kick_user',
            params: { user: '456', reason: 'Warning' },
          },
        ],
      }

      const permissions = validator.detectRequiredPermissions(workflow)

      expect(permissions).toContain('BAN_MEMBERS')
      expect(permissions).toContain('KICK_MEMBERS')
      expect(permissions).toContain('VIEW_CHANNEL')
    })

    it('should return empty array for data-only workflows without trigger', () => {
      const workflow: AutomaterWorkflow = {
        id: 'test-workflow-3',
        name: 'Data Workflow',
        version: '1.0.0',
        trigger: {
          type: 'event',
        },
        nodes: [
          {
            id: 'node-1',
            type: 'action',
            action: 'variable_update',
            params: { name: 'counter', value: '1' },
          },
          {
            id: 'node-2',
            type: 'action',
            action: 'database_insert',
            params: { table: 'logs', data: {} },
          },
        ],
      }

      const permissions = validator.detectRequiredPermissions(workflow)

      // No trigger event and no permissions from data-only actions
      expect(permissions).toEqual([])
    })

    it('should handle workflows with no trigger', () => {
      const workflow: AutomaterWorkflow = {
        id: 'test-workflow-4',
        name: 'No Trigger Workflow',
        version: '1.0.0',
        trigger: {
          type: 'event',
        },
        nodes: [
          {
            id: 'node-1',
            type: 'action',
            action: 'send_message',
            params: { channel: '123', message: 'Test' },
          },
        ],
      }

      const permissions = validator.detectRequiredPermissions(workflow)

      expect(permissions).toContain('SEND_MESSAGES')
      expect(permissions).toContain('VIEW_CHANNEL')
    })

    it('should handle workflows with no nodes', () => {
      const workflow: AutomaterWorkflow = {
        id: 'test-workflow-5',
        name: 'Empty Workflow',
        version: '1.0.0',
        trigger: {
          type: 'event',
        },
        nodes: [],
      }

      const permissions = validator.detectRequiredPermissions(workflow)

      // No event on trigger, no nodes
      expect(permissions).toEqual([])
    })

    it('should deduplicate permissions from multiple nodes', () => {
      const workflow: AutomaterWorkflow = {
        id: 'test-workflow-6',
        name: 'Duplicate Permission Workflow',
        version: '1.0.0',
        trigger: {
          type: 'event',
          event: 'send_message',
        },
        nodes: [
          {
            id: 'node-1',
            type: 'action',
            action: 'send_message',
            params: { channel: '123', message: 'Message 1' },
          },
          {
            id: 'node-2',
            type: 'action',
            action: 'send_message',
            params: { channel: '456', message: 'Message 2' },
          },
          {
            id: 'node-3',
            type: 'action',
            action: 'edit_message',
            params: { messageId: '789', content: 'Edited' },
          },
        ],
      }

      const permissions = validator.detectRequiredPermissions(workflow)

      // Should deduplicate: VIEW_CHANNEL appears in all 3 actions, SEND_MESSAGES in 2
      expect(permissions.filter(p => p === 'VIEW_CHANNEL').length).toBe(1)
      expect(permissions.filter(p => p === 'SEND_MESSAGES').length).toBe(1)
    })

    it('should sort permissions alphabetically', () => {
      const workflow: AutomaterWorkflow = {
        id: 'test-workflow-7',
        name: 'Multi-Permission Workflow',
        version: '1.0.0',
        trigger: {
          type: 'event',
          event: 'send_message',
        },
        nodes: [
          {
            id: 'node-1',
            type: 'action',
            action: 'send_message',
            params: { channel: '123', message: 'Test' },
          },
          {
            id: 'node-2',
            type: 'action',
            action: 'ban_user',
            params: { user: '456', reason: 'Test' },
          },
          {
            id: 'node-3',
            type: 'action',
            action: 'add_role',
            params: { user: '789', role: '101' },
          },
        ],
      }

      const permissions = validator.detectRequiredPermissions(workflow)

      // Verify alphabetical sorting
      const sortedPermissions = [...permissions].sort()
      expect(permissions).toEqual(sortedPermissions)
    })

    it('should handle workflows with condition nodes', () => {
      const workflow: AutomaterWorkflow = {
        id: 'test-workflow-8',
        name: 'Conditional Workflow',
        version: '1.0.0',
        trigger: {
          type: 'event',
          event: 'send_message',
        },
        nodes: [
          {
            id: 'node-1',
            type: 'condition',
            params: { condition: 'message.content === "test"' },
          },
          {
            id: 'node-2',
            type: 'action',
            action: 'send_message',
            params: { channel: '123', message: 'Condition met' },
          },
        ],
      }

      const permissions = validator.detectRequiredPermissions(workflow)

      expect(permissions).toContain('SEND_MESSAGES')
      expect(permissions).toContain('VIEW_CHANNEL')
    })

    it('should handle unknown actions gracefully', () => {
      const workflow: AutomaterWorkflow = {
        id: 'test-workflow-9',
        name: 'Unknown Action Workflow',
        version: '1.0.0',
        trigger: {
          type: 'event',
          event: 'send_message',
        },
        nodes: [
          {
            id: 'node-1',
            type: 'action',
            action: 'unknown_action_xyz',
            params: { test: 'value' },
          },
          {
            id: 'node-2',
            type: 'action',
            action: 'send_message',
            params: { channel: '123', message: 'Test' },
          },
        ],
      }

      const permissions = validator.detectRequiredPermissions(workflow)

      // Should still detect known action permissions
      expect(permissions).toContain('SEND_MESSAGES')
      expect(permissions).toContain('VIEW_CHANNEL')
    })
  })

  describe('getPermissionBreakdown()', () => {
    it('should provide detailed permission breakdown', () => {
      const workflow: AutomaterWorkflow = {
        id: 'test-workflow-10',
        name: 'Breakdown Test',
        version: '1.0.0',
        trigger: {
          type: 'event',
          event: 'send_message',
        },
        nodes: [
          {
            id: 'node-1',
            type: 'action',
            action: 'send_message',
            params: { channel: '123', message: 'Test' },
          },
          {
            id: 'node-2',
            type: 'action',
            action: 'ban_user',
            params: { user: '456', reason: 'Test' },
          },
        ],
      }

      const breakdown = validator.getPermissionBreakdown(workflow)

      expect(breakdown).toHaveProperty('totalPermissions')
      expect(breakdown).toHaveProperty('triggerPermissions')
      expect(breakdown).toHaveProperty('nodePermissions')
      expect(breakdown).toHaveProperty('unknownActions')

      expect(breakdown.totalPermissions).toContain('SEND_MESSAGES')
      expect(breakdown.totalPermissions).toContain('BAN_MEMBERS')
      expect(breakdown.triggerPermissions).toContain('VIEW_CHANNEL')

      expect(breakdown.nodePermissions.size).toBe(2)
      expect(breakdown.nodePermissions.get('node-1')).toContain('SEND_MESSAGES')
      expect(breakdown.nodePermissions.get('node-2')).toContain('BAN_MEMBERS')

      expect(breakdown.unknownActions).toEqual([])
    })

    it('should track unknown actions', () => {
      const workflow: AutomaterWorkflow = {
        id: 'test-workflow-11',
        name: 'Unknown Actions Test',
        version: '1.0.0',
        trigger: {
          type: 'event',
          event: 'send_message',
        },
        nodes: [
          {
            id: 'node-1',
            type: 'action',
            action: 'unknown_action_1',
            params: {},
          },
          {
            id: 'node-2',
            type: 'action',
            action: 'unknown_action_2',
            params: {},
          },
        ],
      }

      const breakdown = validator.getPermissionBreakdown(workflow)

      expect(breakdown.unknownActions).toContain('unknown_action_1')
      expect(breakdown.unknownActions).toContain('unknown_action_2')
      expect(breakdown.unknownActions.length).toBe(2)
    })

    it('should handle empty workflows', () => {
      const workflow: AutomaterWorkflow = {
        id: 'test-workflow-12',
        name: 'Empty Workflow',
        version: '1.0.0',
        trigger: {
          type: 'event',
        },
        nodes: [],
      }

      const breakdown = validator.getPermissionBreakdown(workflow)

      expect(breakdown.totalPermissions).toEqual([])
      expect(breakdown.triggerPermissions).toEqual([])
      expect(breakdown.nodePermissions.size).toBe(0)
      expect(breakdown.unknownActions).toEqual([])
    })
  })

  // Note: validateWorkflow() integration tests are omitted as permission detection
  // is tested through the public APIs (detectRequiredPermissions and getPermissionBreakdown).
  // These provide more reliable test coverage without depending on internal mutation behavior.
})
