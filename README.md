# @automater/autoflow

Real-time workflow validation system for Automater Discord automation platform.

> **🚀 Future Open Source Package**
> This package is currently part of the Automater monorepo and under active development. We plan to extract it to a standalone open source repository with npm publishing in the next 3-6 months. Stay tuned!

## Features

- ✅ **Pure TypeScript Core** - Zero React dependencies, works in any runtime
- ⚛️ **React Integration** - Seamless ReactFlow hooks with debounced validation
- 🔍 **Comprehensive Analysis** - Graph integrity, performance, security, and style checks
- 📊 **Error Code System** - Structured AUT/SYS error families
- 🎯 **Type-Safe** - Full TypeScript support with exported types
- 🚀 **Performance** - Smart debouncing and efficient validation algorithms

## Installation

```bash
# Using pnpm (recommended for monorepos)
pnpm add @automater/autoflow

# Using npm
npm install @automater/autoflow

# Using yarn
yarn add @automater/autoflow
```

## Usage

### Core Validator (Pure TypeScript)

Use the core validator in any JavaScript environment:

```typescript
import { AutoFlowValidator } from '@automater/autoflow/core'

const validator = new AutoFlowValidator({
  rules: {
    'perf/high-weight': 'error',
    'graph/unreachable-nodes': 'warn'
  }
})

const result = await validator.validateWorkflow({
  id: 'my-workflow',
  name: 'My Workflow',
  version: '1.0.0',
  trigger: { type: 'event', event: 'messageCreate' },
  nodes: [/* ... */]
})

if (result.isValid) {
  console.log('✅ Workflow is valid!')
} else {
  console.error('❌ Validation errors:', result.errors)
}
```

### React Hooks (with ReactFlow)

Integrate with ReactFlow for real-time validation:

```tsx
import { useWorkflowLinting } from '@automater/autoflow/react'
import ReactFlow, { Node, Edge } from 'reactflow'

function WorkflowEditor() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const lintingState = useWorkflowLinting(nodes, edges, {
    enabled: true,
    debounceMs: 500
  })

  return (
    <div>
      <ReactFlow nodes={nodes} edges={edges} />

      {lintingState.summary.errors > 0 && (
        <Alert variant="destructive">
          {lintingState.summary.message}
        </Alert>
      )}

      {lintingState.errors.map(error => (
        <div key={error.id}>
          {error.message} - {error.remediation}
        </div>
      ))}
    </div>
  )
}
```

### Node-Specific Styling

Highlight nodes with validation issues:

```tsx
import { useNodeLinting } from '@automater/autoflow/react'

function CustomNode({ id, data }) {
  const lintingState = useWorkflowLinting(nodes, edges)
  const nodeLinting = useNodeLinting(id, lintingState)

  return (
    <div style={{
      borderColor: nodeLinting.borderColor,
      backgroundColor: nodeLinting.bgColor
    }}>
      {data.label}
      {nodeLinting.hasErrors && <ErrorIcon />}
    </div>
  )
}
```

## API Reference

### Core Types

```typescript
interface AutomaterWorkflow {
  id: string
  name: string
  version: string
  trigger: WorkflowTrigger
  nodes: WorkflowNode[]
  // ... more fields
}

interface LintIssue {
  id: string
  ruleId: string
  errorCode: string
  family: 'AUT' | 'SYS'
  severity: 'info' | 'warn' | 'error' | 'critical'
  message: string
  remediation: string
  location?: {
    nodeId?: string
    path?: string
  }
}
```

### Validation Rules

The validator checks for 20+ rule categories:

- **Schema** - Required fields, type validation, SemVer format
- **Graph** - Missing nodes, unreachable nodes, entry points
- **Variables** - Naming conventions, scope validation
- **Performance** - Rate limit weights, large workflows
- **Security** - Permission checks, PII exposure warnings
- **Style** - Naming conventions, description requirements

### Configuration

Customize validation behavior:

```typescript
const config: LintConfig = {
  rules: {
    'schema/required-fields': 'error',
    'graph/unreachable-nodes': 'warn',
    'perf/missing-weight': 'off'
  },
  settings: {
    rateLimits: {
      maxWorkflowWeight: 1000,
      maxNodeWeight: 100,
      warnThreshold: 0.8
    }
  }
}
```

## Error Codes

AutoFlow uses structured error codes:

- **AUT-3xxx** - Missing/Invalid Resources (unreachable nodes, missing connections)
- **AUT-4xxx** - Policy Limits (rate limits, weight thresholds)
- **SYS-5xxx** - Platform/System Errors (parse errors, schema validation)

## Development

```bash
# Build package
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm typecheck
```

## License

MIT - See LICENSE file for details

## Related Packages

- `@automater/shared-types` - Shared TypeScript types
- `@automater/shared-utils` - Shared utility functions
<!-- YOLO badge -->
