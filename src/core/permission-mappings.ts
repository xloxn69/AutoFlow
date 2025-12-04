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
export const ACTION_PERMISSION_MAPPINGS: Record<string, string[]> = {
  // ============================================================================
  // MESSAGING ACTIONS
  // ============================================================================

  /**
   * Send Message - Sends a message to a specified channel
   * Required: SEND_MESSAGES (send), VIEW_CHANNEL (see channel)
   */
  'send_message': ['SEND_MESSAGES', 'VIEW_CHANNEL'],

  /**
   * Edit Message - Edits a bot's own message
   * Required: SEND_MESSAGES (implies edit own messages), VIEW_CHANNEL
   */
  'edit_message': ['SEND_MESSAGES', 'VIEW_CHANNEL'],

  /**
   * Send Direct Message - Sends a DM to a user
   * Required: None (DMs don't require guild permissions)
   */
  'send_direct_message': [],

  /**
   * Delete Message - Deletes any message (including others' messages)
   * Required: MANAGE_MESSAGES (delete others' messages), VIEW_CHANNEL
   */
  'delete_message': ['MANAGE_MESSAGES', 'VIEW_CHANNEL'],

  /**
   * Log Event - Logs an event in a specified channel (sends message)
   * Required: SEND_MESSAGES, VIEW_CHANNEL
   */
  'log_event': ['SEND_MESSAGES', 'VIEW_CHANNEL'],

  // ============================================================================
  // USER MANAGEMENT ACTIONS
  // ============================================================================

  /**
   * Add Role - Adds a role to a user
   * Required: MANAGE_ROLES (role management)
   * Note: Bot's highest role must be above target role
   */
  'add_role': ['MANAGE_ROLES'],

  /**
   * Remove Role - Removes a role from a user
   * Required: MANAGE_ROLES (role management)
   * Note: Bot's highest role must be above target role
   */
  'remove_role': ['MANAGE_ROLES'],

  /**
   * Change Nickname - Changes a user's nickname
   * Required: MANAGE_NICKNAMES (change others' nicknames)
   */
  'change_nickname': ['MANAGE_NICKNAMES'],

  // ============================================================================
  // MODERATION ACTIONS
  // ============================================================================

  /**
   * Kick User - Kicks a user from the server
   * Required: KICK_MEMBERS (kick permission)
   * Note: Bot's highest role must be above target user
   */
  'kick_user': ['KICK_MEMBERS'],

  /**
   * Ban User - Bans a user from the server
   * Required: BAN_MEMBERS (ban permission)
   * Note: Bot's highest role must be above target user
   */
  'ban_user': ['BAN_MEMBERS'],

  /**
   * Unban User - Unbans a user from the server
   * Required: BAN_MEMBERS (same permission as ban)
   */
  'unban_user': ['BAN_MEMBERS'],

  /**
   * Mute User - Times out a user (Discord timeout feature)
   * Required: MODERATE_MEMBERS (timeout permission)
   * Note: Bot's highest role must be above target user
   */
  'mute_user': ['MODERATE_MEMBERS'],

  /**
   * Unmute User - Removes timeout from a user
   * Required: MODERATE_MEMBERS (timeout permission)
   */
  'unmute_user': ['MODERATE_MEMBERS'],

  // ============================================================================
  // CHANNEL MANAGEMENT ACTIONS
  // ============================================================================

  /**
   * Create Channel - Creates a new text/voice/category channel
   * Required: MANAGE_CHANNELS (create/edit channels)
   */
  'create_channel': ['MANAGE_CHANNELS'],

  /**
   * Delete Channel - Deletes a channel
   * Required: MANAGE_CHANNELS (delete channels)
   */
  'delete_channel': ['MANAGE_CHANNELS'],

  /**
   * Create Category - Creates a new category
   * Required: MANAGE_CHANNELS (create/edit channels)
   */
  'create_category': ['MANAGE_CHANNELS'],

  /**
   * Modify Channel - Modifies channel properties (name, topic, slowmode, etc.)
   * Required: MANAGE_CHANNELS (edit channels)
   */
  'modify_channel': ['MANAGE_CHANNELS'],

  // ============================================================================
  // REACTION & INTERACTION ACTIONS
  // ============================================================================

  /**
   * Add Reaction - Adds a reaction emoji to a message
   * Required: ADD_REACTIONS (add reactions), VIEW_CHANNEL (see message)
   */
  'add_reaction': ['ADD_REACTIONS', 'VIEW_CHANNEL'],

  /**
   * Remove Reaction - Removes a reaction from a message (any user's reaction)
   * Required: MANAGE_MESSAGES (remove others' reactions), VIEW_CHANNEL
   */
  'remove_reaction': ['MANAGE_MESSAGES', 'VIEW_CHANNEL'],

  /**
   * Pin Message - Pins a message in a channel
   * Required: MANAGE_MESSAGES (pin/unpin messages), VIEW_CHANNEL
   */
  'pin_message': ['MANAGE_MESSAGES', 'VIEW_CHANNEL'],

  /**
   * Unpin Message - Unpins a message in a channel
   * Required: MANAGE_MESSAGES (pin/unpin messages), VIEW_CHANNEL
   */
  'unpin_message': ['MANAGE_MESSAGES', 'VIEW_CHANNEL'],

  // ============================================================================
  // DATA MANAGEMENT ACTIONS (No Discord permissions needed)
  // ============================================================================

  /**
   * Variable Update - Updates a workflow variable value
   * Required: None (internal data operation)
   */
  'variable_update': [],

  /**
   * Database Insert - Inserts data into ForgeDB
   * Required: None (internal database operation)
   */
  'database_insert': [],

  /**
   * Database Query - Queries data from ForgeDB
   * Required: None (internal database operation)
   */
  'database_query': [],

  // ============================================================================
  // EXTERNAL INTEGRATION ACTIONS
  // ============================================================================

  /**
   * Webhook Send - Sends data to a Discord webhook
   * Required: MANAGE_WEBHOOKS (create/manage webhooks)
   */
  'webhook_send': ['MANAGE_WEBHOOKS'],

  /**
   * HTTP Request - Makes HTTP requests to external APIs
   * Required: None (external API, not Discord)
   */
  'http_request': [],

  /**
   * Create Invite - Creates a server invite link
   * Required: CREATE_INSTANT_INVITE (create invites)
   */
  'create_invite': ['CREATE_INSTANT_INVITE'],
};

/**
 * Maps AutoFlow trigger types to required Discord permissions for event listening
 *
 * Most triggers are passive (no permissions needed to listen), but some require
 * permissions to access the event data properly.
 *
 * Note: These are permissions needed to LISTEN to events, not to trigger them.
 */
export const TRIGGER_PERMISSION_MAPPINGS: Record<string, string[]> = {
  // ============================================================================
  // USER MANAGEMENT TRIGGERS (Passive - no permissions needed)
  // ============================================================================

  'user_join': [],
  'user_leave': [],
  'user_ban': [],
  'user_kick': [],
  'user_update': [],

  // ============================================================================
  // MESSAGE SYSTEM TRIGGERS
  // ============================================================================

  /**
   * Send Message (Message Create) - Bot receives message events
   * Required: VIEW_CHANNEL (see messages in channel)
   */
  'send_message': ['VIEW_CHANNEL'],

  /**
   * Message Delete - Bot receives message delete events
   * Required: VIEW_CHANNEL (see channel where deletion occurred)
   */
  'message_delete': ['VIEW_CHANNEL'],

  /**
   * Message Edit - Bot receives message edit events
   * Required: VIEW_CHANNEL (see channel where edit occurred)
   */
  'message_edit': ['VIEW_CHANNEL'],

  // ============================================================================
  // CHANNEL MANAGEMENT TRIGGERS (Passive - no permissions needed)
  // ============================================================================

  'channel_create': [],
  'channel_delete': [],

  // ============================================================================
  // ROLE MANAGEMENT TRIGGERS (Passive - no permissions needed)
  // ============================================================================

  'role_create': [],
  'role_delete': [],
  'role_add': [],
  'role_remove': [],

  // ============================================================================
  // REACTION SYSTEM TRIGGERS
  // ============================================================================

  /**
   * Reaction Add - Bot receives reaction add events
   * Required: VIEW_CHANNEL (see reactions on messages)
   */
  'reaction_add': ['VIEW_CHANNEL'],

  /**
   * Reaction Remove - Bot receives reaction remove events
   * Required: VIEW_CHANNEL (see reactions on messages)
   */
  'reaction_remove': ['VIEW_CHANNEL'],

  // ============================================================================
  // VOICE SYSTEM TRIGGERS
  // ============================================================================

  /**
   * Voice Channel Join - Bot tracks voice channel joins
   * Required: VIEW_CHANNEL (see voice channel) + CONNECT (track voice state)
   */
  'voice_channel_join': ['VIEW_CHANNEL', 'CONNECT'],

  /**
   * Voice Channel Leave - Bot tracks voice channel leaves
   * Required: VIEW_CHANNEL (see voice channel) + CONNECT (track voice state)
   */
  'voice_channel_leave': ['VIEW_CHANNEL', 'CONNECT'],

  // ============================================================================
  // SERVER MANAGEMENT TRIGGERS (Passive - no permissions needed)
  // ============================================================================

  'server_update': [],

  // ============================================================================
  // COMMAND SYSTEM TRIGGERS (Passive - permissions checked at execution time)
  // ============================================================================

  'slash_command': [],
  'prefixed_command': [],
};

/**
 * Permission severity classification for UI display
 *
 * - DANGEROUS: Can cause severe damage (ban, kick, manage guild, administrator)
 * - MODERATE: Significant impact (manage messages, channels, roles, nicknames)
 * - SAFE: Minimal impact (send messages, add reactions, view channels)
 */
export const PERMISSION_SEVERITY: Record<string, 'safe' | 'moderate' | 'dangerous'> = {
  // DANGEROUS - Severe impact
  'ADMINISTRATOR': 'dangerous',
  'BAN_MEMBERS': 'dangerous',
  'KICK_MEMBERS': 'dangerous',
  'MANAGE_GUILD': 'dangerous',
  'MANAGE_ROLES': 'dangerous',
  'MANAGE_WEBHOOKS': 'dangerous',
  'MODERATE_MEMBERS': 'dangerous',

  // MODERATE - Significant impact
  'MANAGE_CHANNELS': 'moderate',
  'MANAGE_MESSAGES': 'moderate',
  'MANAGE_NICKNAMES': 'moderate',
  'MANAGE_THREADS': 'moderate',
  'MANAGE_EVENTS': 'moderate',
  'MANAGE_EMOJIS_AND_STICKERS': 'moderate',

  // SAFE - Minimal impact
  'SEND_MESSAGES': 'safe',
  'VIEW_CHANNEL': 'safe',
  'ADD_REACTIONS': 'safe',
  'CREATE_INSTANT_INVITE': 'safe',
  'READ_MESSAGE_HISTORY': 'safe',
  'SEND_MESSAGES_IN_THREADS': 'safe',
  'EMBED_LINKS': 'safe',
  'ATTACH_FILES': 'safe',
  'USE_EXTERNAL_EMOJIS': 'safe',
  'USE_EXTERNAL_STICKERS': 'safe',
  'CONNECT': 'safe',
  'SPEAK': 'safe',
  'STREAM': 'safe',
  'USE_VAD': 'safe',
  'CHANGE_NICKNAME': 'safe',
  'USE_APPLICATION_COMMANDS': 'safe',
};

/**
 * Human-readable descriptions for Discord permissions
 * Source: Discord Developer Documentation
 */
export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  'SEND_MESSAGES': 'Allows sending messages in text channels',
  'VIEW_CHANNEL': 'Allows viewing channels and reading message history',
  'MANAGE_MESSAGES': 'Allows deleting messages from other users and pinning messages',
  'MANAGE_ROLES': 'Allows creating, editing, and deleting roles below bot\'s highest role',
  'BAN_MEMBERS': 'Allows banning and unbanning members',
  'KICK_MEMBERS': 'Allows kicking members from the server',
  'MANAGE_CHANNELS': 'Allows creating, editing, and deleting channels',
  'MANAGE_NICKNAMES': 'Allows changing other members\' nicknames',
  'MODERATE_MEMBERS': 'Allows timing out members to prevent them from sending messages',
  'ADD_REACTIONS': 'Allows adding reactions to messages',
  'MANAGE_WEBHOOKS': 'Allows creating, editing, and deleting webhooks',
  'CREATE_INSTANT_INVITE': 'Allows creating instant invites to the server',
  'ADMINISTRATOR': 'Grants all permissions and bypasses channel permission overwrites',
  'MANAGE_GUILD': 'Allows managing server settings and configurations',
  'CONNECT': 'Allows joining voice channels',
  'SPEAK': 'Allows speaking in voice channels',
  'MANAGE_THREADS': 'Allows managing threads (archive, delete, view private threads)',
  'MANAGE_EVENTS': 'Allows creating, editing, and deleting server events',
  'MANAGE_EMOJIS_AND_STICKERS': 'Allows managing custom emojis and stickers',
};

/**
 * Type guard to check if an action type has a permission mapping
 */
export function hasActionPermissionMapping(action: string): boolean {
  return action in ACTION_PERMISSION_MAPPINGS;
}

/**
 * Type guard to check if a trigger type has a permission mapping
 */
export function hasTriggerPermissionMapping(trigger: string): boolean {
  return trigger in TRIGGER_PERMISSION_MAPPINGS;
}

/**
 * Get permission severity level for UI display
 */
export function getPermissionSeverity(permission: string): 'safe' | 'moderate' | 'dangerous' {
  return PERMISSION_SEVERITY[permission] || 'safe';
}

/**
 * Get human-readable description for a permission
 */
export function getPermissionDescription(permission: string): string {
  return PERMISSION_DESCRIPTIONS[permission] || `Discord permission: ${permission}`;
}
