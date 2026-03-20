# OpenCode Agents

Custom agents and skills for the DailySAT project.

## Installation

Copy skill files to the global agents directory:

```bash
# Create global skills directory if not exists
mkdir -p ~/.agents/skills

# Copy skills
cp -r .opencode/skills/* ~/.agents/skills/
```

## Available Agents

| Agent             | Description                                  |
| ----------------- | -------------------------------------------- |
| `nextjs-dev`      | Next.js 15, React 18, TypeScript development |
| `database-dev`    | MongoDB operations and data modeling         |
| `frontend-design` | UI/UX patterns and component design          |
| `git-workflow`    | Git operations and best practices            |
| `testing`         | Testing strategies and test implementation   |

## Plugin

The `dailysat-plugin.mjs` provides custom CLI tools:

- `dev` - Start development server
- `build` - Build for production
- `lint` - Run ESLint
- `seed` - Seed database with test data
- `cleanup` - Remove build artifacts
- `genkey` - Generate secret keys

To use the plugin, add it to your OpenCode configuration:

```json
{
  "plugins": [".opencode/dailysat-plugin.mjs"]
}
```

## Usage

Agents are automatically loaded when relevant tasks are requested. For example:

- Ask about Next.js patterns → loads `nextjs-dev` skill
- Ask about database operations → loads `database-dev` skill
- Ask about styling or UI → loads `frontend-design` skill
- Ask about git operations → loads `git-workflow` skill
- Ask about testing → loads `testing` skill
