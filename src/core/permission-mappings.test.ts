/**
 * Permission Mappings Tests
 *
 * Tests for the action-to-permission mapping registry and utility functions.
 * Validates that all actions have correct Discord permission mappings.
 */

import { describe, it, expect } from 'vitest'
import {
  ACTION_PERMISSION_MAPPINGS,
  TRIGGER_PERMISSION_MAPPINGS,
  PERMISSION_SEVERITY,
  PERMISSION_DESCRIPTIONS,
  hasActionPermissionMapping,
  hasTriggerPermissionMapping,
  getPermissionSeverity,
  getPermissionDescription,
} from './permission-mappings'

describe('ACTION_PERMISSION_MAPPINGS', () => {
  it('should have mappings for all known actions', () => {
    const expectedActions = [
      'send_message',
      'edit_message',
      'delete_message',
      'send_direct_message',
      'log_event',
      'add_role',
      'remove_role',
      'change_nickname',
      'kick_user',
      'ban_user',
      'unban_user',
      'mute_user',
      'unmute_user',
      'create_channel',
      'delete_channel',
      'create_category',
      'modify_channel',
      'add_reaction',
      'remove_reaction',
      'pin_message',
      'unpin_message',
      'variable_update',
      'database_insert',
      'database_query',
      'webhook_send',
      'http_request',
      'create_invite',
    ]

    expectedActions.forEach(action => {
      expect(ACTION_PERMISSION_MAPPINGS).toHaveProperty(action)
    })

    expect(Object.keys(ACTION_PERMISSION_MAPPINGS).length).toBe(expectedActions.length)
  })

  it('should return arrays of permission strings', () => {
    Object.entries(ACTION_PERMISSION_MAPPINGS).forEach(([action, permissions]) => {
      expect(Array.isArray(permissions)).toBe(true)
      permissions.forEach(perm => {
        expect(typeof perm).toBe('string')
        expect(perm).toMatch(/^[A-Z_]+$/) // Discord permissions are uppercase with underscores
      })
    })
  })

  it('should have empty arrays for data-only actions', () => {
    const dataOnlyActions = ['send_direct_message', 'variable_update', 'database_insert', 'database_query', 'http_request']

    dataOnlyActions.forEach(action => {
      expect(ACTION_PERMISSION_MAPPINGS[action]).toEqual([])
    })
  })

  it('should have correct permissions for moderation actions', () => {
    expect(ACTION_PERMISSION_MAPPINGS['kick_user']).toContain('KICK_MEMBERS')
    expect(ACTION_PERMISSION_MAPPINGS['ban_user']).toContain('BAN_MEMBERS')
    expect(ACTION_PERMISSION_MAPPINGS['mute_user']).toContain('MODERATE_MEMBERS')
  })

  it('should have VIEW_CHANNEL for channel-dependent actions', () => {
    const channelActions = ['send_message', 'edit_message', 'delete_message', 'log_event']

    channelActions.forEach(action => {
      expect(ACTION_PERMISSION_MAPPINGS[action]).toContain('VIEW_CHANNEL')
    })
  })
})

describe('TRIGGER_PERMISSION_MAPPINGS', () => {
  it('should have mappings for all known triggers', () => {
    const expectedTriggers = [
      'user_join',
      'user_leave',
      'user_ban',
      'user_kick',
      'user_update',
      'send_message',
      'message_delete',
      'message_edit',
      'channel_create',
      'channel_delete',
      'role_create',
      'role_delete',
      'role_add',
      'role_remove',
      'reaction_add',
      'reaction_remove',
      'voice_channel_join',
      'voice_channel_leave',
      'server_update',
      'slash_command',
      'prefixed_command',
    ]

    expectedTriggers.forEach(trigger => {
      expect(TRIGGER_PERMISSION_MAPPINGS).toHaveProperty(trigger)
    })
  })

  it('should return arrays of permission strings', () => {
    Object.entries(TRIGGER_PERMISSION_MAPPINGS).forEach(([trigger, permissions]) => {
      expect(Array.isArray(permissions)).toBe(true)
      permissions.forEach(perm => {
        expect(typeof perm).toBe('string')
      })
    })
  })

  it('should have VIEW_CHANNEL for message triggers', () => {
    const messageTriggers = ['send_message', 'message_delete', 'message_edit', 'reaction_add', 'reaction_remove']

    messageTriggers.forEach(trigger => {
      expect(TRIGGER_PERMISSION_MAPPINGS[trigger]).toContain('VIEW_CHANNEL')
    })
  })

  it('should have CONNECT for voice triggers', () => {
    expect(TRIGGER_PERMISSION_MAPPINGS['voice_channel_join']).toContain('CONNECT')
    expect(TRIGGER_PERMISSION_MAPPINGS['voice_channel_leave']).toContain('CONNECT')
  })
})

describe('PERMISSION_SEVERITY', () => {
  it('should classify all Discord permissions', () => {
    const allPermissions = new Set<string>()

    // Collect all permissions from action mappings
    Object.values(ACTION_PERMISSION_MAPPINGS).forEach(perms => {
      perms.forEach(perm => allPermissions.add(perm))
    })

    // Collect all permissions from trigger mappings
    Object.values(TRIGGER_PERMISSION_MAPPINGS).forEach(perms => {
      perms.forEach(perm => allPermissions.add(perm))
    })

    // All used permissions should have severity classification
    allPermissions.forEach(perm => {
      expect(PERMISSION_SEVERITY).toHaveProperty(perm)
      expect(['safe', 'moderate', 'dangerous']).toContain(PERMISSION_SEVERITY[perm])
    })
  })

  it('should classify dangerous permissions correctly', () => {
    const dangerousPermissions = ['ADMINISTRATOR', 'BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS']

    dangerousPermissions.forEach(perm => {
      expect(PERMISSION_SEVERITY[perm]).toBe('dangerous')
    })
  })

  it('should classify moderate permissions correctly', () => {
    const moderatePermissions = ['MANAGE_MESSAGES', 'MANAGE_CHANNELS', 'MANAGE_THREADS', 'MANAGE_NICKNAMES', 'MANAGE_EVENTS']

    moderatePermissions.forEach(perm => {
      expect(PERMISSION_SEVERITY[perm]).toBe('moderate')
    })
  })

  it('should classify safe permissions correctly', () => {
    const safePermissions = ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'CONNECT', 'SPEAK']

    safePermissions.forEach(perm => {
      expect(PERMISSION_SEVERITY[perm]).toBe('safe')
    })
  })
})

describe('PERMISSION_DESCRIPTIONS', () => {
  it('should have descriptions for common permissions', () => {
    const commonPermissions = [
      'SEND_MESSAGES',
      'VIEW_CHANNEL',
      'MANAGE_MESSAGES',
      'BAN_MEMBERS',
      'KICK_MEMBERS',
      'MANAGE_ROLES',
      'MANAGE_CHANNELS',
      'MODERATE_MEMBERS',
    ]

    commonPermissions.forEach(perm => {
      expect(PERMISSION_DESCRIPTIONS).toHaveProperty(perm)
      expect(typeof PERMISSION_DESCRIPTIONS[perm]).toBe('string')
      expect(PERMISSION_DESCRIPTIONS[perm].length).toBeGreaterThan(10) // Meaningful descriptions
    })
  })

  it('should have well-formatted descriptions', () => {
    Object.values(PERMISSION_DESCRIPTIONS).forEach(desc => {
      // Descriptions should be non-empty strings
      expect(typeof desc).toBe('string')
      expect(desc.length).toBeGreaterThan(0)
    })
  })
})

describe('hasActionPermissionMapping()', () => {
  it('should return true for known actions', () => {
    expect(hasActionPermissionMapping('send_message')).toBe(true)
    expect(hasActionPermissionMapping('ban_user')).toBe(true)
    expect(hasActionPermissionMapping('variable_update')).toBe(true)
  })

  it('should return false for unknown actions', () => {
    expect(hasActionPermissionMapping('unknown_action')).toBe(false)
    expect(hasActionPermissionMapping('fake_action_123')).toBe(false)
    expect(hasActionPermissionMapping('')).toBe(false)
  })

  it('should handle edge cases', () => {
    expect(hasActionPermissionMapping('SEND_MESSAGE')).toBe(false) // Case sensitive
    expect(hasActionPermissionMapping('send-message')).toBe(false) // Wrong format
    expect(hasActionPermissionMapping('send_message ')).toBe(false) // Trailing space
  })
})

describe('hasTriggerPermissionMapping()', () => {
  it('should return true for known triggers', () => {
    expect(hasTriggerPermissionMapping('send_message')).toBe(true)
    expect(hasTriggerPermissionMapping('user_join')).toBe(true)
    expect(hasTriggerPermissionMapping('voice_channel_join')).toBe(true)
  })

  it('should return false for unknown triggers', () => {
    expect(hasTriggerPermissionMapping('unknown_trigger')).toBe(false)
    expect(hasTriggerPermissionMapping('fake_trigger_123')).toBe(false)
    expect(hasTriggerPermissionMapping('')).toBe(false)
  })
})

describe('getPermissionSeverity()', () => {
  it('should return correct severity for known permissions', () => {
    expect(getPermissionSeverity('ADMINISTRATOR')).toBe('dangerous')
    expect(getPermissionSeverity('MANAGE_MESSAGES')).toBe('moderate')
    expect(getPermissionSeverity('SEND_MESSAGES')).toBe('safe')
  })

  it('should return "safe" for unknown permissions (default)', () => {
    expect(getPermissionSeverity('UNKNOWN_PERMISSION')).toBe('safe')
    expect(getPermissionSeverity('FAKE_PERM_123')).toBe('safe')
    expect(getPermissionSeverity('')).toBe('safe')
  })

  it('should handle all permissions in registry', () => {
    const allPermissions = Object.keys(PERMISSION_SEVERITY)

    allPermissions.forEach(perm => {
      const severity = getPermissionSeverity(perm)
      expect(['safe', 'moderate', 'dangerous']).toContain(severity)
    })
  })
})

describe('getPermissionDescription()', () => {
  it('should return correct description for known permissions', () => {
    expect(getPermissionDescription('SEND_MESSAGES')).toContain('sending messages')
    expect(getPermissionDescription('BAN_MEMBERS')).toContain('banning')
    expect(getPermissionDescription('VIEW_CHANNEL')).toContain('viewing')
  })

  it('should return fallback for unknown permissions', () => {
    const fallback = getPermissionDescription('UNKNOWN_PERMISSION')
    expect(fallback).toContain('UNKNOWN_PERMISSION')
    expect(fallback).toMatch(/Discord permission/)
  })

  it('should return non-empty strings', () => {
    const allPermissions = Object.keys(PERMISSION_SEVERITY)

    allPermissions.forEach(perm => {
      const description = getPermissionDescription(perm)
      expect(typeof description).toBe('string')
      expect(description.length).toBeGreaterThan(0)
    })
  })
})

describe('Permission Mapping Consistency', () => {
  it('should have all action permissions in severity registry', () => {
    const usedPermissions = new Set<string>()

    Object.values(ACTION_PERMISSION_MAPPINGS).forEach(perms => {
      perms.forEach(perm => usedPermissions.add(perm))
    })

    usedPermissions.forEach(perm => {
      expect(PERMISSION_SEVERITY).toHaveProperty(perm)
    })
  })

  it('should have all trigger permissions in severity registry', () => {
    const usedPermissions = new Set<string>()

    Object.values(TRIGGER_PERMISSION_MAPPINGS).forEach(perms => {
      perms.forEach(perm => usedPermissions.add(perm))
    })

    usedPermissions.forEach(perm => {
      expect(PERMISSION_SEVERITY).toHaveProperty(perm)
    })
  })

  it('should not have duplicate permissions in action mappings', () => {
    Object.entries(ACTION_PERMISSION_MAPPINGS).forEach(([action, perms]) => {
      const uniquePerms = new Set(perms)
      expect(uniquePerms.size).toBe(perms.length)
    })
  })

  it('should not have duplicate permissions in trigger mappings', () => {
    Object.entries(TRIGGER_PERMISSION_MAPPINGS).forEach(([trigger, perms]) => {
      const uniquePerms = new Set(perms)
      expect(uniquePerms.size).toBe(perms.length)
    })
  })
})
