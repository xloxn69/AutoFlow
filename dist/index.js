"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AutoFlowValidator: () => AutoFlowValidator,
  AutomaterLinter: () => AutoFlowValidator,
  DEFAULT_LINT_CONFIG: () => DEFAULT_LINT_CONFIG,
  createWorkflowFromReactFlow: () => createWorkflowFromReactFlow,
  useEdgeLinting: () => useEdgeLinting,
  useGroupedIssues: () => useGroupedIssues,
  useNodeLinting: () => useNodeLinting,
  useWorkflowLinting: () => useWorkflowLinting
});
module.exports = __toCommonJS(src_exports);

// src/core/permission-mappings.ts
var ACTION_PERMISSION_MAPPINGS = {
  // ============================================================================
  // MESSAGING ACTIONS
  // ============================================================================
  /**
   * Send Message - Sends a message to a specified channel
   * Required: SEND_MESSAGES (send), VIEW_CHANNEL (see channel)
   */
  "send_message": ["SEND_MESSAGES", "VIEW_CHANNEL"],
  /**
   * Edit Message - Edits a bot's own message
   * Required: SEND_MESSAGES (implies edit own messages), VIEW_CHANNEL
   */
  "edit_message": ["SEND_MESSAGES", "VIEW_CHANNEL"],
  /**
   * Send Direct Message - Sends a DM to a user
   * Required: None (DMs don't require guild permissions)
   */
  "send_direct_message": [],
  /**
   * Delete Message - Deletes any message (including others' messages)
   * Required: MANAGE_MESSAGES (delete others' messages), VIEW_CHANNEL
   */
  "delete_message": ["MANAGE_MESSAGES", "VIEW_CHANNEL"],
  /**
   * Log Event - Logs an event in a specified channel (sends message)
   * Required: SEND_MESSAGES, VIEW_CHANNEL
   */
  "log_event": ["SEND_MESSAGES", "VIEW_CHANNEL"],
  // ============================================================================
  // USER MANAGEMENT ACTIONS
  // ============================================================================
  /**
   * Add Role - Adds a role to a user
   * Required: MANAGE_ROLES (role management)
   * Note: Bot's highest role must be above target role
   */
  "add_role": ["MANAGE_ROLES"],
  /**
   * Remove Role - Removes a role from a user
   * Required: MANAGE_ROLES (role management)
   * Note: Bot's highest role must be above target role
   */
  "remove_role": ["MANAGE_ROLES"],
  /**
   * Change Nickname - Changes a user's nickname
   * Required: MANAGE_NICKNAMES (change others' nicknames)
   */
  "change_nickname": ["MANAGE_NICKNAMES"],
  // ============================================================================
  // MODERATION ACTIONS
  // ============================================================================
  /**
   * Kick User - Kicks a user from the server
   * Required: KICK_MEMBERS (kick permission)
   * Note: Bot's highest role must be above target user
   */
  "kick_user": ["KICK_MEMBERS"],
  /**
   * Ban User - Bans a user from the server
   * Required: BAN_MEMBERS (ban permission)
   * Note: Bot's highest role must be above target user
   */
  "ban_user": ["BAN_MEMBERS"],
  /**
   * Unban User - Unbans a user from the server
   * Required: BAN_MEMBERS (same permission as ban)
   */
  "unban_user": ["BAN_MEMBERS"],
  /**
   * Mute User - Times out a user (Discord timeout feature)
   * Required: MODERATE_MEMBERS (timeout permission)
   * Note: Bot's highest role must be above target user
   */
  "mute_user": ["MODERATE_MEMBERS"],
  /**
   * Unmute User - Removes timeout from a user
   * Required: MODERATE_MEMBERS (timeout permission)
   */
  "unmute_user": ["MODERATE_MEMBERS"],
  // ============================================================================
  // CHANNEL MANAGEMENT ACTIONS
  // ============================================================================
  /**
   * Create Channel - Creates a new text/voice/category channel
   * Required: MANAGE_CHANNELS (create/edit channels)
   */
  "create_channel": ["MANAGE_CHANNELS"],
  /**
   * Delete Channel - Deletes a channel
   * Required: MANAGE_CHANNELS (delete channels)
   */
  "delete_channel": ["MANAGE_CHANNELS"],
  /**
   * Create Category - Creates a new category
   * Required: MANAGE_CHANNELS (create/edit channels)
   */
  "create_category": ["MANAGE_CHANNELS"],
  /**
   * Modify Channel - Modifies channel properties (name, topic, slowmode, etc.)
   * Required: MANAGE_CHANNELS (edit channels)
   */
  "modify_channel": ["MANAGE_CHANNELS"],
  // ============================================================================
  // REACTION & INTERACTION ACTIONS
  // ============================================================================
  /**
   * Add Reaction - Adds a reaction emoji to a message
   * Required: ADD_REACTIONS (add reactions), VIEW_CHANNEL (see message)
   */
  "add_reaction": ["ADD_REACTIONS", "VIEW_CHANNEL"],
  /**
   * Remove Reaction - Removes a reaction from a message (any user's reaction)
   * Required: MANAGE_MESSAGES (remove others' reactions), VIEW_CHANNEL
   */
  "remove_reaction": ["MANAGE_MESSAGES", "VIEW_CHANNEL"],
  /**
   * Pin Message - Pins a message in a channel
   * Required: MANAGE_MESSAGES (pin/unpin messages), VIEW_CHANNEL
   */
  "pin_message": ["MANAGE_MESSAGES", "VIEW_CHANNEL"],
  /**
   * Unpin Message - Unpins a message in a channel
   * Required: MANAGE_MESSAGES (pin/unpin messages), VIEW_CHANNEL
   */
  "unpin_message": ["MANAGE_MESSAGES", "VIEW_CHANNEL"],
  // ============================================================================
  // DATA MANAGEMENT ACTIONS (No Discord permissions needed)
  // ============================================================================
  /**
   * Variable Update - Updates a workflow variable value
   * Required: None (internal data operation)
   */
  "variable_update": [],
  /**
   * Database Insert - Inserts data into ForgeDB
   * Required: None (internal database operation)
   */
  "database_insert": [],
  /**
   * Database Query - Queries data from ForgeDB
   * Required: None (internal database operation)
   */
  "database_query": [],
  // ============================================================================
  // EXTERNAL INTEGRATION ACTIONS
  // ============================================================================
  /**
   * Webhook Send - Sends data to a Discord webhook
   * Required: MANAGE_WEBHOOKS (create/manage webhooks)
   */
  "webhook_send": ["MANAGE_WEBHOOKS"],
  /**
   * HTTP Request - Makes HTTP requests to external APIs
   * Required: None (external API, not Discord)
   */
  "http_request": [],
  /**
   * Create Invite - Creates a server invite link
   * Required: CREATE_INSTANT_INVITE (create invites)
   */
  "create_invite": ["CREATE_INSTANT_INVITE"]
};
var TRIGGER_PERMISSION_MAPPINGS = {
  // ============================================================================
  // USER MANAGEMENT TRIGGERS (Passive - no permissions needed)
  // ============================================================================
  "user_join": [],
  "user_leave": [],
  "user_ban": [],
  "user_kick": [],
  "user_update": [],
  // ============================================================================
  // MESSAGE SYSTEM TRIGGERS
  // ============================================================================
  /**
   * Send Message (Message Create) - Bot receives message events
   * Required: VIEW_CHANNEL (see messages in channel)
   */
  "send_message": ["VIEW_CHANNEL"],
  /**
   * Message Delete - Bot receives message delete events
   * Required: VIEW_CHANNEL (see channel where deletion occurred)
   */
  "message_delete": ["VIEW_CHANNEL"],
  /**
   * Message Edit - Bot receives message edit events
   * Required: VIEW_CHANNEL (see channel where edit occurred)
   */
  "message_edit": ["VIEW_CHANNEL"],
  // ============================================================================
  // CHANNEL MANAGEMENT TRIGGERS (Passive - no permissions needed)
  // ============================================================================
  "channel_create": [],
  "channel_delete": [],
  // ============================================================================
  // ROLE MANAGEMENT TRIGGERS (Passive - no permissions needed)
  // ============================================================================
  "role_create": [],
  "role_delete": [],
  "role_add": [],
  "role_remove": [],
  // ============================================================================
  // REACTION SYSTEM TRIGGERS
  // ============================================================================
  /**
   * Reaction Add - Bot receives reaction add events
   * Required: VIEW_CHANNEL (see reactions on messages)
   */
  "reaction_add": ["VIEW_CHANNEL"],
  /**
   * Reaction Remove - Bot receives reaction remove events
   * Required: VIEW_CHANNEL (see reactions on messages)
   */
  "reaction_remove": ["VIEW_CHANNEL"],
  // ============================================================================
  // VOICE SYSTEM TRIGGERS
  // ============================================================================
  /**
   * Voice Channel Join - Bot tracks voice channel joins
   * Required: VIEW_CHANNEL (see voice channel) + CONNECT (track voice state)
   */
  "voice_channel_join": ["VIEW_CHANNEL", "CONNECT"],
  /**
   * Voice Channel Leave - Bot tracks voice channel leaves
   * Required: VIEW_CHANNEL (see voice channel) + CONNECT (track voice state)
   */
  "voice_channel_leave": ["VIEW_CHANNEL", "CONNECT"],
  // ============================================================================
  // SERVER MANAGEMENT TRIGGERS (Passive - no permissions needed)
  // ============================================================================
  "server_update": [],
  // ============================================================================
  // COMMAND SYSTEM TRIGGERS (Passive - permissions checked at execution time)
  // ============================================================================
  "slash_command": [],
  "prefixed_command": []
};
function hasActionPermissionMapping(action) {
  return action in ACTION_PERMISSION_MAPPINGS;
}
function hasTriggerPermissionMapping(trigger) {
  return trigger in TRIGGER_PERMISSION_MAPPINGS;
}

// src/core/validator.ts
var DEFAULT_LINT_CONFIG = {
  rules: {
    // Schema validation rules
    "schema/required-fields": "error",
    "schema/field-types": "error",
    "schema/semver": "error",
    "schema/enum-values": "error",
    // Graph integrity rules
    "graph/missing-nodes": "error",
    "graph/entry-points": "error",
    "graph/unreachable-nodes": "warn",
    "graph/infinite-loops": "error",
    "graph/dead-ends": "warn",
    // Variable and template rules
    "variable/undefined-reference": "error",
    "variable/invalid-interpolation": "error",
    "variable/scope-mismatch": "warn",
    "variable/naming-convention": "warn",
    // Trigger and action rules
    "trigger/unknown-event": "error",
    "trigger/invalid-command": "error",
    "action/unknown-type": "error",
    "action/missing-params": "error",
    // Security rules
    "security/missing-permissions": "error",
    "security/excessive-permissions": "warn",
    "security/hardcoded-secrets": "error",
    "security/pii-exposure": "warn",
    // Performance rules
    "perf/missing-weight": "warn",
    "perf/high-weight": "warn",
    "perf/deep-nesting": "warn",
    "perf/large-workflow": "warn",
    // Style rules
    "style/naming-convention": "warn",
    "style/description-required": "warn",
    "style/icon-color-consistency": "warn",
    "style/deprecated-features": "warn"
  },
  settings: {
    rateLimits: {
      maxWorkflowWeight: 1e3,
      maxNodeWeight: 100,
      warnThreshold: 0.8
    },
    naming: {
      workflowIdPattern: "^automation-[A-Za-z0-9]{15}$",
      nodeIdPattern: "^[a-zA-Z][a-zA-Z0-9_-]*$",
      variableNamePattern: "^[a-zA-Z][a-zA-Z0-9_]*$"
    }
  }
};
var ERROR_CATALOG = {
  // AUT family - 3xxx range (Missing/Invalid Resources)
  3310: {
    family: "AUT",
    key: "AUT_WORKFLOW_UNREACHABLE_NODES",
    severity: "warn",
    message: "Workflow contains unreachable nodes",
    remediation: "Remove unreachable nodes or add connections to make them reachable"
  },
  3311: {
    family: "AUT",
    key: "AUT_NODE_MISSING_CONNECTIONS",
    severity: "error",
    message: "Node is missing required connections",
    remediation: "Add connections array to node or connect to valid target nodes"
  },
  3312: {
    family: "AUT",
    key: "AUT_VARIABLE_INVALID_INTERPOLATION",
    severity: "error",
    message: "Invalid variable interpolation syntax",
    remediation: "Use correct syntax: {variable.name} or {member.displayName}"
  },
  3313: {
    family: "AUT",
    key: "AUT_ICON_NOT_APPROVED",
    severity: "warn",
    message: "Icon is not in the approved icon catalog",
    remediation: "Choose from approved icons in Icon System PRD"
  },
  // AUT family - 4xxx range (Policy Limits)
  4120: {
    family: "AUT",
    key: "AUT_RATE_LIMIT_HIGH_WEIGHT",
    severity: "warn",
    message: "Workflow weight may cause rate limiting",
    remediation: "Reduce node weight or optimize workflow to use fewer resources"
  },
  4121: {
    family: "AUT",
    key: "AUT_NODE_MISSING_WEIGHT",
    severity: "warn",
    message: "Action node missing rate limit weight",
    remediation: "Add weight property to action node for accurate rate limiting"
  },
  // SYS family - 5xxx range (Platform & External Failures)
  5510: {
    family: "SYS",
    key: "SYS_WORKFLOW_PARSE_ERROR",
    severity: "error",
    message: "Unable to parse workflow file",
    remediation: "Check JSON syntax and workflow structure"
  },
  5511: {
    family: "SYS",
    key: "SYS_SCHEMA_VALIDATION_FAILED",
    severity: "error",
    message: "Workflow schema validation failed",
    remediation: "Fix schema violations listed in validation errors"
  }
};
var AutoFlowValidator = class {
  constructor(config = {}) {
    this.nextIssueId = 1;
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
    };
  }
  /**
   * Main validation method - analyzes a complete workflow
   */
  async validateWorkflow(workflow) {
    const startTime = Date.now();
    const issues = [];
    let rulesExecuted = 0;
    try {
      const structureIssues = this.validateWorkflowStructure(workflow);
      issues.push(...structureIssues);
      rulesExecuted += 4;
      if (workflow.nodes && workflow.nodes.length > 0) {
        const graphIssues = this.validateGraphIntegrity(workflow.nodes);
        issues.push(...graphIssues);
        rulesExecuted += 5;
      }
      if (workflow.nodes) {
        const nodeIssues = this.validateNodes(workflow.nodes);
        issues.push(...nodeIssues);
        rulesExecuted += workflow.nodes.length * 3;
      }
      if (workflow.variables) {
        const variableIssues = this.validateVariables(workflow.variables, workflow);
        issues.push(...variableIssues);
        rulesExecuted += workflow.variables.length * 2;
      }
      const performanceIssues = this.validatePerformance(workflow);
      issues.push(...performanceIssues);
      rulesExecuted += 3;
      if (workflow.trigger && workflow.nodes) {
        const permissionIssues = this.detectAndValidatePermissions(workflow);
        issues.push(...permissionIssues);
        rulesExecuted += 1;
      }
      const filteredIssues = this.filterIssues(issues);
      const errors = filteredIssues.filter((i) => i.severity === "error");
      const warnings = filteredIssues.filter((i) => i.severity === "warn");
      const infos = filteredIssues.filter((i) => i.severity === "info");
      const criticals = filteredIssues.filter((i) => i.severity === "critical");
      return {
        workflowId: workflow.id || "unknown",
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
        fixableCount: filteredIssues.filter((i) => i.fixable).length,
        timestamp: Date.now(),
        performance: {
          analysisTime: Date.now() - startTime,
          rulesExecuted
        }
      };
    } catch (error) {
      return {
        workflowId: workflow.id || "unknown",
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
      };
    }
  }
  /**
   * Quick validation for minimal node structure
   * Accepts any object with id, type, action, params, connections, weight
   */
  validateNodes(nodes) {
    const issues = [];
    const workflowNodes = nodes.map((node) => ({
      id: node.id,
      type: node.type || "action",
      action: node.action,
      params: node.params,
      connections: node.connections || [],
      weight: node.weight
    }));
    const graphIssues = this.validateGraphIntegrity(workflowNodes);
    issues.push(...graphIssues);
    const nodeIssues = this.validateNodeList(workflowNodes);
    issues.push(...nodeIssues);
    return this.filterIssues(issues);
  }
  // Validation methods
  validateWorkflowStructure(workflow) {
    const issues = [];
    if (!this.isRuleEnabled("schema/required-fields")) return issues;
    const requiredFields = ["id", "name", "version", "trigger"];
    for (const field of requiredFields) {
      if (!workflow[field]) {
        issues.push(this.createIssue("schema/required-fields", 5511, {
          message: `Required field '${field}' is missing`,
          location: { path: field }
        }));
      }
    }
    if (workflow.version && this.isRuleEnabled("schema/semver")) {
      const semverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
      if (!semverPattern.test(workflow.version)) {
        issues.push(this.createIssue("schema/semver", 5511, {
          message: "Version must be valid SemVer (e.g., 1.2.3)",
          location: { path: "version" }
        }));
      }
    }
    return issues;
  }
  validateGraphIntegrity(nodes) {
    const issues = [];
    if (!nodes || nodes.length === 0) return issues;
    const nodeIds = new Set(nodes.map((n) => n.id));
    const adjacencyList = /* @__PURE__ */ new Map();
    const reverseAdjacencyList = /* @__PURE__ */ new Map();
    for (const node of nodes) {
      adjacencyList.set(node.id, []);
      reverseAdjacencyList.set(node.id, []);
    }
    for (const node of nodes) {
      const connections = node.connections || [];
      for (const targetId of connections) {
        if (!nodeIds.has(targetId) && this.isRuleEnabled("graph/missing-nodes")) {
          issues.push(this.createIssue("graph/missing-nodes", 3311, {
            message: `Node '${node.id}' connects to non-existent node '${targetId}'`,
            location: { nodeId: node.id }
          }));
          continue;
        }
        adjacencyList.get(node.id)?.push(targetId);
        reverseAdjacencyList.get(targetId)?.push(node.id);
      }
    }
    const entryNodes = nodes.filter(
      (node) => node.type === "trigger" || (reverseAdjacencyList.get(node.id)?.length || 0) === 0
    );
    if (this.isRuleEnabled("graph/entry-points")) {
      if (entryNodes.length === 0) {
        issues.push(this.createIssue("graph/entry-points", 3311, {
          message: "Workflow must have at least one entry point (trigger node)",
          location: { path: "nodes" }
        }));
      }
    }
    if (this.isRuleEnabled("graph/unreachable-nodes")) {
      const reachable = /* @__PURE__ */ new Set();
      const dfs = (nodeId) => {
        if (reachable.has(nodeId)) return;
        reachable.add(nodeId);
        for (const connected of adjacencyList.get(nodeId) || []) {
          dfs(connected);
        }
      };
      entryNodes.forEach((node) => dfs(node.id));
      const unreachableNodes = nodes.filter((node) => !reachable.has(node.id));
      for (const node of unreachableNodes) {
        issues.push(this.createIssue("graph/unreachable-nodes", 3310, {
          message: `Node '${node.id}' is unreachable from entry points`,
          location: { nodeId: node.id }
        }));
      }
    }
    return issues;
  }
  validateNodeList(nodes) {
    const issues = [];
    for (const node of nodes) {
      if (node.type === "action" && this.isRuleEnabled("action/unknown-type")) {
        if (!node.action) {
          issues.push(this.createIssue("action/missing-params", 3311, {
            message: `Action node '${node.id}' is missing action type`,
            location: { nodeId: node.id }
          }));
        }
      }
      if (node.type === "action" && this.isRuleEnabled("perf/missing-weight")) {
        if (typeof node.weight !== "number") {
          issues.push(this.createIssue("perf/missing-weight", 4121, {
            message: `Action node '${node.id}' is missing rate limit weight`,
            location: { nodeId: node.id },
            suggestions: ["Add weight property (typical values: 5-30)"]
          }));
        }
      }
      if (typeof node.weight === "number" && this.isRuleEnabled("perf/high-weight")) {
        const maxWeight = this.config.settings?.rateLimits?.maxNodeWeight || 100;
        if (node.weight > maxWeight) {
          issues.push(this.createIssue("perf/high-weight", 4120, {
            message: `Node '${node.id}' weight (${node.weight}) exceeds recommended maximum (${maxWeight})`,
            location: { nodeId: node.id }
          }));
        }
      }
    }
    return issues;
  }
  validateVariables(variables, workflow) {
    const issues = [];
    if (!this.isRuleEnabled("variable/naming-convention")) return issues;
    const pattern = this.config.settings?.naming?.variableNamePattern || "^[a-zA-Z][a-zA-Z0-9_]*$";
    const regex = new RegExp(pattern);
    for (const variable of variables) {
      if (!regex.test(variable.name)) {
        issues.push(this.createIssue("variable/naming-convention", 3312, {
          message: `Variable name '${variable.name}' doesn't follow naming convention`,
          location: { path: `variables.${variable.name}` },
          suggestions: ["Use camelCase or snake_case naming"]
        }));
      }
    }
    return issues;
  }
  validatePerformance(workflow) {
    const issues = [];
    if (!workflow.nodes) return issues;
    if (this.isRuleEnabled("perf/large-workflow")) {
      if (workflow.nodes.length > 50) {
        issues.push(this.createIssue("perf/large-workflow", 4120, {
          message: `Large workflow (${workflow.nodes.length} nodes) may be difficult to maintain`,
          location: { path: "nodes" }
        }));
      }
    }
    if (this.isRuleEnabled("perf/high-weight")) {
      const totalWeight = workflow.nodes.reduce((sum, node) => sum + (node.weight || 0), 0);
      const maxWeight = this.config.settings?.rateLimits?.maxWorkflowWeight || 1e3;
      const warnThreshold = this.config.settings?.rateLimits?.warnThreshold || 0.8;
      if (totalWeight > maxWeight * warnThreshold) {
        issues.push(this.createIssue("perf/high-weight", 4120, {
          message: `Total workflow weight (${totalWeight}) approaches rate limit threshold`,
          location: { path: "nodes" }
        }));
      }
    }
    return issues;
  }
  /**
   * Automatically detects required Discord permissions by analyzing workflow graph
   * This method populates workflow.permissions and node.permissions fields
   *
   * @param workflow - The workflow to analyze
   * @returns Array of validation issues (warnings for unknown actions)
   */
  detectAndValidatePermissions(workflow) {
    const issues = [];
    const requiredPermissions = /* @__PURE__ */ new Set();
    const triggerEvent = workflow.trigger?.event;
    if (triggerEvent && hasTriggerPermissionMapping(triggerEvent)) {
      const triggerPerms = TRIGGER_PERMISSION_MAPPINGS[triggerEvent];
      triggerPerms.forEach((perm) => requiredPermissions.add(perm));
    }
    for (const node of workflow.nodes) {
      if (node.type === "action" && node.action) {
        if (hasActionPermissionMapping(node.action)) {
          const actionPerms = ACTION_PERMISSION_MAPPINGS[node.action];
          actionPerms.forEach((perm) => requiredPermissions.add(perm));
          node.permissions = actionPerms;
        } else {
          if (this.isRuleEnabled("security/missing-permissions")) {
            issues.push(this.createIssue("security/missing-permissions", 3311, {
              message: `Unknown action '${node.action}' - cannot detect required permissions`,
              location: { nodeId: node.id },
              suggestions: [
                "Check if action is implemented in permission-mappings.ts",
                "Add permission mapping for this action type"
              ]
            }));
          }
          node.permissions = [];
        }
      }
    }
    workflow.permissions = Array.from(requiredPermissions).sort();
    return issues;
  }
  /**
   * Public API: Detect required permissions for a workflow without mutating it
   * Returns sorted array of permission flags
   *
   * @param workflow - The workflow to analyze
   * @returns Array of required Discord permission flags (e.g., ['SEND_MESSAGES', 'BAN_MEMBERS'])
   */
  detectRequiredPermissions(workflow) {
    const requiredPermissions = /* @__PURE__ */ new Set();
    const triggerEvent = workflow.trigger?.event;
    if (triggerEvent && hasTriggerPermissionMapping(triggerEvent)) {
      const triggerPerms = TRIGGER_PERMISSION_MAPPINGS[triggerEvent];
      triggerPerms.forEach((perm) => requiredPermissions.add(perm));
    }
    for (const node of workflow.nodes) {
      if (node.type === "action" && node.action) {
        if (hasActionPermissionMapping(node.action)) {
          const actionPerms = ACTION_PERMISSION_MAPPINGS[node.action];
          actionPerms.forEach((perm) => requiredPermissions.add(perm));
        }
      }
    }
    return Array.from(requiredPermissions).sort();
  }
  /**
   * Public API: Get detailed permission breakdown by node
   * Useful for debugging and UI displays
   *
   * @param workflow - The workflow to analyze
   * @returns Detailed permission information
   */
  getPermissionBreakdown(workflow) {
    const triggerPermissions = [];
    const nodePermissions = /* @__PURE__ */ new Map();
    const unknownActions = [];
    const triggerEvent = workflow.trigger?.event;
    if (triggerEvent && hasTriggerPermissionMapping(triggerEvent)) {
      triggerPermissions.push(...TRIGGER_PERMISSION_MAPPINGS[triggerEvent]);
    }
    for (const node of workflow.nodes) {
      if (node.type === "action" && node.action) {
        if (hasActionPermissionMapping(node.action)) {
          nodePermissions.set(node.id, ACTION_PERMISSION_MAPPINGS[node.action]);
        } else {
          unknownActions.push(node.action);
          nodePermissions.set(node.id, []);
        }
      }
    }
    return {
      totalPermissions: this.detectRequiredPermissions(workflow),
      triggerPermissions,
      nodePermissions,
      unknownActions
    };
  }
  // Helper methods
  filterIssues(issues) {
    return issues.filter((issue) => {
      const ruleConfig = this.config.rules[issue.ruleId];
      return ruleConfig && ruleConfig !== "off";
    });
  }
  isRuleEnabled(ruleId) {
    const config = this.config.rules[ruleId];
    return config && config !== "off";
  }
  createIssue(ruleId, errorCode, options) {
    const catalog = ERROR_CATALOG[errorCode];
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
    };
  }
  createSystemError(error) {
    return {
      id: `system-error-${this.nextIssueId++}`,
      ruleId: "system/parse-error",
      errorCode: "SYS-5510",
      family: "SYS",
      severity: "error",
      message: `System error: ${error instanceof Error ? error.message : "Unknown error"}`,
      remediation: "Check workflow structure and try again",
      fixable: false,
      timestamp: Date.now()
    };
  }
};

// src/react/hooks.ts
var import_react = require("react");
function useWorkflowLinting(nodes, edges, options = {}) {
  const {
    enabled = true,
    debounceMs = 500,
    config = {}
  } = options;
  const [result, setResult] = (0, import_react.useState)(null);
  const [isLinting, setIsLinting] = (0, import_react.useState)(false);
  const [lastLintTime, setLastLintTime] = (0, import_react.useState)(null);
  const debounceTimer = (0, import_react.useRef)(null);
  const validatorRef = (0, import_react.useRef)(null);
  (0, import_react.useMemo)(() => {
    validatorRef.current = new AutoFlowValidator({
      ...DEFAULT_LINT_CONFIG,
      ...config
    });
  }, [config]);
  const lintWorkflow = (0, import_react.useCallback)(async (workflowNodes, workflowEdges) => {
    if (!enabled || !validatorRef.current) return;
    try {
      setIsLinting(true);
      const workflow = createWorkflowFromReactFlow(workflowNodes, workflowEdges);
      const lintResult = await validatorRef.current.validateWorkflow(workflow);
      setResult(lintResult);
      setLastLintTime(Date.now());
    } catch (error) {
      console.error("Workflow linting failed:", error);
      setResult({
        workflowId: "error",
        isValid: false,
        summary: { total: 1, errors: 1, warnings: 0, infos: 0, criticals: 0 },
        issues: [{
          id: "lint-error",
          ruleId: "system/lint-error",
          errorCode: "SYS-5510",
          family: "SYS",
          severity: "error",
          message: `Linting failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          remediation: "Check workflow structure and try again"
        }],
        errors: [],
        warnings: [],
        infos: [],
        criticals: [],
        fixableCount: 0,
        timestamp: Date.now(),
        performance: { analysisTime: 0, rulesExecuted: 0 }
      });
    } finally {
      setIsLinting(false);
    }
  }, [enabled]);
  const debouncedLint = (0, import_react.useCallback)((workflowNodes, workflowEdges) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      lintWorkflow(workflowNodes, workflowEdges);
    }, debounceMs);
  }, [lintWorkflow, debounceMs]);
  const triggerLint = (0, import_react.useCallback)(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    lintWorkflow(nodes, edges);
  }, [lintWorkflow, nodes, edges]);
  (0, import_react.useEffect)(() => {
    if (!enabled) {
      setResult(null);
      setLastLintTime(null);
      return;
    }
    if (nodes.length === 0) {
      setResult(null);
      setLastLintTime(null);
      return;
    }
    debouncedLint(nodes, edges);
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [nodes, edges, enabled, debouncedLint]);
  const getNodeIssues = (0, import_react.useCallback)((nodeId) => {
    if (!result) return [];
    return result.issues.filter((issue) => issue.location?.nodeId === nodeId);
  }, [result]);
  const getEdgeIssues = (0, import_react.useCallback)((edgeId) => {
    if (!result) return [];
    return result.issues.filter((issue) => issue.location?.edgeId === edgeId);
  }, [result]);
  const summary = (0, import_react.useMemo)(() => {
    if (!result) {
      return {
        isValid: nodes.length === 0,
        message: nodes.length === 0 ? "No workflow to validate" : "Validating...",
        canDeploy: false,
        total: 0,
        errors: 0,
        warnings: 0,
        infos: 0,
        criticals: 0
      };
    }
    const { isValid, summary: resultSummary } = result;
    if (isValid) {
      return {
        isValid: true,
        message: "Workflow is valid and ready to deploy",
        canDeploy: true,
        ...resultSummary
      };
    }
    if (resultSummary.errors > 0 || resultSummary.criticals > 0) {
      const errorCount = resultSummary.errors + resultSummary.criticals;
      return {
        isValid: false,
        message: `${errorCount} error${errorCount === 1 ? "" : "s"} must be fixed before deployment`,
        canDeploy: false,
        ...resultSummary
      };
    }
    if (resultSummary.warnings > 0) {
      return {
        isValid: true,
        message: `${resultSummary.warnings} warning${resultSummary.warnings === 1 ? "" : "s"} - deployment allowed`,
        canDeploy: true,
        ...resultSummary
      };
    }
    return {
      isValid: true,
      message: "Workflow is valid",
      canDeploy: true,
      ...resultSummary
    };
  }, [result, nodes.length]);
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
  };
}
function useNodeLinting(nodeId, lintingState) {
  return (0, import_react.useMemo)(() => {
    const issues = lintingState.getNodeIssues(nodeId);
    const hasErrors = issues.some(
      (issue) => issue.severity === "error" || issue.severity === "critical"
    );
    const hasWarnings = issues.some((issue) => issue.severity === "warn");
    const hasIssues = issues.length > 0;
    let severity = null;
    if (issues.some((i) => i.severity === "critical")) severity = "critical";
    else if (issues.some((i) => i.severity === "error")) severity = "error";
    else if (issues.some((i) => i.severity === "warn")) severity = "warn";
    else if (issues.some((i) => i.severity === "info")) severity = "info";
    return {
      hasIssues,
      hasErrors,
      hasWarnings,
      issues,
      severity,
      // Quick styling helpers
      borderColor: severity === "critical" ? "#dc2626" : severity === "error" ? "#ef4444" : severity === "warn" ? "#f59e0b" : severity === "info" ? "#3b82f6" : void 0,
      bgColor: severity === "critical" ? "#dc262610" : severity === "error" ? "#ef444410" : severity === "warn" ? "#f59e0b10" : severity === "info" ? "#3b82f610" : void 0
    };
  }, [nodeId, lintingState]);
}
function useEdgeLinting(edgeId, lintingState) {
  return (0, import_react.useMemo)(() => {
    const issues = lintingState.getEdgeIssues(edgeId);
    const hasErrors = issues.some(
      (issue) => issue.severity === "error" || issue.severity === "critical"
    );
    const hasIssues = issues.length > 0;
    let severity = null;
    if (issues.some((i) => i.severity === "critical")) severity = "critical";
    else if (issues.some((i) => i.severity === "error")) severity = "error";
    else if (issues.some((i) => i.severity === "warn")) severity = "warn";
    else if (issues.some((i) => i.severity === "info")) severity = "info";
    return {
      hasIssues,
      hasErrors,
      issues,
      severity,
      // Quick styling helpers
      strokeColor: severity === "critical" ? "#dc2626" : severity === "error" ? "#ef4444" : severity === "warn" ? "#f59e0b" : severity === "info" ? "#3b82f6" : void 0
    };
  }, [edgeId, lintingState]);
}
function useGroupedIssues(lintingState) {
  return (0, import_react.useMemo)(() => {
    const { issues } = lintingState;
    return {
      critical: issues.filter((i) => i.severity === "critical"),
      error: issues.filter((i) => i.severity === "error"),
      warning: issues.filter((i) => i.severity === "warn"),
      info: issues.filter((i) => i.severity === "info"),
      byNode: issues.reduce((acc, issue) => {
        const nodeId = issue.location?.nodeId;
        if (nodeId) {
          if (!acc[nodeId]) acc[nodeId] = [];
          acc[nodeId].push(issue);
        }
        return acc;
      }, {})
    };
  }, [lintingState.issues]);
}
function createWorkflowFromReactFlow(nodes, edges) {
  const workflowNodes = nodes.map((node) => ({
    id: node.id,
    type: node.data?.type || "action",
    action: node.data?.action,
    params: node.data?.params,
    connections: edges.filter((edge) => edge.source === node.id).map((edge) => edge.target),
    weight: node.data?.weight
  }));
  return {
    id: "temp-workflow",
    name: "Temporary Workflow",
    version: "1.0.0",
    trigger: { type: "event", event: "messageCreate" },
    nodes: workflowNodes
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AutoFlowValidator,
  AutomaterLinter,
  DEFAULT_LINT_CONFIG,
  createWorkflowFromReactFlow,
  useEdgeLinting,
  useGroupedIssues,
  useNodeLinting,
  useWorkflowLinting
});
//# sourceMappingURL=index.js.map