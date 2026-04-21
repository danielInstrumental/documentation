# HubSpot CRM React Developer Skill

This skill provides comprehensive guidance for building production-quality React components within the HubSpot CRM Projects framework (UI Extensions for cards, settings, and app development).

## What This Skill Provides

- **HubSpot-specific constraints**: Understand `hubspot.fetch`, component restrictions, and environment limitations
- **Senior React patterns**: Composition, custom hooks, memoization, error boundaries
- **TypeScript best practices**: Strict typing, generics, type safety
- **Performance optimization**: Lazy loading, debouncing, efficient rendering
- **Project structure**: Directory organization, naming conventions, configuration
- **Common pitfalls**: Avoid runtime errors and configuration mistakes

## When This Skill Is Used

The agent will automatically apply this skill when:
- Building HubSpot UI extensions (cards, settings pages)
- Working with `@hubspot/ui-extensions` components
- Using the `hubspot.fetch` API
- Creating React components within HubSpot Projects
- Configuring `-hsmeta.json` files

## Files in This Skill

### SKILL.md (Main Reference)

The primary skill file containing:
- Core constraints and API requirements
- Senior React patterns and architecture
- Project structure and naming conventions
- Development workflow
- Common pitfalls and debugging

**Use this for**: General guidance, patterns, and best practices

### EXAMPLES.md (Code Examples)

Complete, production-ready code examples including:
- Dashboard card with data fetching
- Settings page with form handling
- Data table with sorting/filtering
- Pagination hook
- Context provider pattern
- Utility functions

**Use this for**: Reference implementations and copy-paste starting points

## Quick Reference

### Critical HubSpot Rules

✅ **DO**:
- Use `hubspot.fetch('https://full.domain.com/endpoint')`
- Declare all URLs in `permittedUrls.fetch`
- Use components from `@hubspot/ui-extensions`
- Place components in correct directories (`app/cards/`, `app/settings/`, etc.)
- Use `local.json` proxy for local development

❌ **DON'T**:
- Use `window` object, `fetch`, `localStorage`
- Use relative paths in `hubspot.fetch`
- Add style props to HubSpot components
- Nest component directories
- Forget to make UIDs unique

### Common Commands

```bash
# Start local dev server
hs project dev

# Upload and create build
hs project upload

# Deploy specific build
hs project deploy <buildNumber>

# Validate configuration
hs project validate

# View logs
hs project logs
```

## How the Agent Uses This Skill

1. **Automatic Detection**: When you mention HubSpot, React, UI extensions, or cards, the agent reads this skill
2. **Pattern Application**: The agent applies patterns from SKILL.md to your specific use case
3. **Example Reference**: For complex features, the agent consults EXAMPLES.md
4. **Validation**: The agent ensures code follows HubSpot constraints and best practices

## Skill Development

This skill follows Cursor's skill authoring principles:
- **Concise**: SKILL.md is under 500 lines for optimal token usage
- **Progressive disclosure**: Detailed examples live in EXAMPLES.md
- **One-level deep references**: No nested reference chains
- **Specific triggers**: Clear description tells agent when to apply

## Related Documentation

- [HubSpot UI Extensions SDK](https://developers.hubspot.com/docs/platform/ui-extensions-sdk)
- [HubSpot Projects Overview](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/overview)
- [HubSpot CLI Commands](https://developers.hubspot.com/docs/developer-tooling/local-development/hubspot-cli/project-commands)
- [Example Components Repo](https://github.com/HubSpot/hubspot-project-components)

## Updating This Skill

To add new patterns or examples:

1. **Small additions**: Add to SKILL.md if under 500 lines total
2. **New examples**: Add to EXAMPLES.md with clear headings
3. **New utilities**: Add to EXAMPLES.md utilities section
4. **New constraints**: Add to "Core Constraints" in SKILL.md

Keep SKILL.md concise - move detailed content to EXAMPLES.md when needed.
