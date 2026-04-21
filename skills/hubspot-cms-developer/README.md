# HubSpot CMS Developer Skill

Comprehensive guidance for building HubSpot CMS themes and modules using HubL templating, Pike theme patterns, and editor-focused best practices.

## What This Skill Covers

This skill teaches the agent to build HubSpot CMS components following your Pike theme architecture:

- **HubL templating language** - Variables, filters, control structures, macros
- **Module architecture** - Proper structure for module.html, fields.json, module.css
- **Pike theme patterns** - Grid system, snippets, css_helpers, theme variables
- **Fields.json patterns** - Animation, settings, styles tab (layout, visibility, grid)
- **Content editor UX** - Build for editors, not just end users
- **Responsive design** - Mobile-first, breakpoint-specific controls
- **Performance** - Lazy loading, scoped styles, progressive enhancement

## When This Skill Is Used

The agent automatically applies this skill when:
- Creating or modifying HubSpot modules
- Working with `module.html`, `fields.json`, `module.css`, `module.js`
- Using HubL templating syntax
- Implementing Pike theme patterns
- Building theme templates
- Configuring module fields or style groups

## Skill Structure

### SKILL.md (Main Reference - 537 lines)

The primary skill file covering:

1. **Core Principles** - DRY, editor-first, Pike consistency
2. **Pike Theme Architecture** - Directory structure, tools, child themes
3. **Module Development** - Complete module.html structure and ordering
4. **Fields Architecture** - Required groups (animation, settings, styles)
5. **Pike Grid System** - Flexbox-based grid with custom properties
6. **CSS Best Practices** - Theme variables, scoped styles, responsive patterns
7. **JavaScript Practices** - Avoid HubL in JS, module patterns
8. **Common Patterns** - Repeaters, images, conditional content

**Use this for**: Understanding patterns, module structure, best practices

### FIELDS_REFERENCE.md (Detailed Field Specs)

Complete field definitions including:
- Full grid field group (all breakpoints)
- Every field type (text, richtext, image, link, color, font, etc.)
- Repeater patterns
- Text style groups (title, description components)
- Visibility and validation patterns
- Tab organization

**Use this for**: Copying exact field definitions, understanding field types

### EXAMPLES.md (Working Code)

Production-ready module examples:
- Simple card module (basic structure)
- Card grid with repeater (full grid system)
- Hero module (background image, overlay, alignment)
- Interactive module (JavaScript accordion)
- HubL macros and Pike snippets

**Use this for**: Starting points, reference implementations, code patterns

## Pike Theme Patterns

### Required Module Structure Order

1. Info comment (`{# module base class name: module-name #}`)
2. Imports (snippets, css_helpers)
3. Shorthand variables
4. Logic and macros
5. Class names
6. Markup
7. User styles (from fields)
8. General styles (component styles)
9. JavaScript (if needed)

### Required Field Groups

**Every module must have**:
- `settings` - custom_id and custom_classes
- `styles.layout` - Spacing control
- `styles.visibility` - Hide at breakpoints, z-index

**Common additions**:
- `animation` - If animation is needed
- `styles.grid` - For repeaters
- `styles.text_alignment` or `styles.alignment` - Based on layout

### Pike's Grid System

**Key points**:
- Not CSS Grid - it's flexbox with custom properties
- Parent needs `grid` class
- Children need `grid__item` class
- Sets CSS vars: `--col-count@sm`, `--gap@lg`, `--alignment-x@md`
- Pike's `layout.css` consumes these variables

## HubL Quick Reference

### Whitespace Control

```hubl
{# ✅ Strip whitespace with - #}
{%- if condition -%}content{%- endif -%}

{# ❌ Don't strip when whitespace matters #}
<span class="{% if active %}active{% endif %}">Text</span>
```

### Common Filters

```hubl
{{ module.title|upper }}           {# UPPERCASE #}
{{ module.title|lower }}           {# lowercase #}
{{ module.date|datetimeformat }}   {# Format date #}
{{ module.config|tojson }}         {# JSON encode #}
{{ name|replace('_', '-') }}       {# Replace chars #}
```

### Loops

```hubl
{%- for item in items -%}
  {{ loop.index }}      {# 1, 2, 3 #}
  {{ loop.index0 }}     {# 0, 1, 2 #}
  {{ loop.first }}      {# True on first #}
  {{ loop.last }}       {# True on last #}
{%- endfor -%}
```

### Macros

```hubl
{%- macro render_card(title, desc) -%}
  <div class="card">
    <h3>{{ title }}</h3>
    <p>{{ desc }}</p>
  </div>
{%- endmacro -%}

{{ render_card(module.title, module.desc) }}
```

## CSS Patterns

### Theme Variables

```css
/* Use Pike's variables from css-variables.css */
color: var(--color-primary);
padding: var(--spacing-md);
border-radius: var(--border-radius);
box-shadow: var(--shadow-sm);
```

### Scoped Styles

```hubl
{%- require_css -%}
<style>
{% scope_css %}
.module-name {
  /* Scoped to this module instance */
}
{% end_scope_css %}
</style>
{%- end_require_css -%}
```

### Responsive

```css
/* Mobile first */
.module { padding: 16px; }

@media (min-width: 768px) {
  .module { padding: 24px; }  /* Tablet */
}

@media (min-width: 1024px) {
  .module { padding: 32px; }  /* Desktop */
}
```

## Common Workflows

### Creating a New Module

1. Create directory: `module-name.module/`
2. Add `meta.json` with label and availability
3. Create `fields.json` starting with content fields
4. Build `module.html` following structure order
5. Add CSS to `module.html` if < 50 lines, else `module.css`
6. Add JS if needed to `module.html` or `module.js`
7. Test in page editor

### Adding Animation

1. Add animation field group to `fields.json`
2. Import at top of `module.html`: `{%- set animation = module.animation -%}`
3. Add to markup: `data-mh-animation="{{ animation.type }}"`
4. Add delay to user styles: `animation-delay: {{ animation.delay }}ms`
5. For repeaters, add stagger field and calculate: `(loop.index0 * stagger)`

### Implementing Grid

1. Add grid field group to `styles` tab in `fields.json`
2. Import: `{%- set grid = styles.grid -%}`
3. Add `grid` to module classes
4. Wrap repeater items in elements with `grid__item` class
5. Add grid CSS vars to user styles (see SKILL.md)

## Pike Tools Usage

### Importing

```hubl
{# Always at top of module.html #}
{%- import '../../tools/snippets.html' as snippets -%}
{%- import '../../tools/css-helpers.html' as css_helpers -%}
```

### CSS Helpers

```hubl
{# Font variables #}
{%- do user_styles.append(
  css_helpers.font_vars(styles.title.custom_font, 'title')
) if styles.title.custom_font -%}

{# Text style group #}
{{ css_helpers.text_style_group(styles.title, '.module__title') }}

{# Alignment mapping #}
{%- do user_styles.append(
  '--alignment-x\\@md:' ~ css_helpers.alignment_map(grid.tablet.align.horizontal_align)
) if grid.tablet.align.horizontal_align -%}
```

### Snippets

```hubl
{# Use Pike's pre-built snippets #}
{{ snippets.responsive_image(module.image, 'module__image') }}
{{ snippets.button(module.cta, 'btn--primary') }}
```

## Validation Checklist

Before considering a module complete:

- [ ] Imports at top (snippets, css_helpers)
- [ ] Module ID with fallback: `module.settings.custom_id or 'moduleName...'`
- [ ] Classes built with `do append`
- [ ] All HubL tags use `-` for whitespace stripping
- [ ] Required field groups: settings, layout, visibility
- [ ] Grid parent has `grid` class, children have `grid__item`
- [ ] User styles in user styles section
- [ ] Component styles in general styles section
- [ ] Styles wrapped in `scope_css`
- [ ] No HubL in JavaScript
- [ ] Theme variables used instead of hardcoded values
- [ ] Animation delay applied if animation field exists
- [ ] Text appearance presets applied as classes
- [ ] Responsive at all breakpoints

## Anti-Patterns to Avoid

❌ **Don't hardcode styles** - Use theme variables  
❌ **Don't nest logic deeply** - Use macros  
❌ **Don't use HubL in JS** - Use data attributes  
❌ **Don't forget whitespace control** - Use `-` in tags  
❌ **Don't skip imports** - Import snippets and css_helpers  
❌ **Don't ignore editor UX** - Fields affect content creators  
❌ **Don't use `controlling_field`** - Use `controlling_field_path`  
❌ **Don't mix CSS Grid terminology** - Pike's "grid" is flexbox  

## Quick Command Reference

```bash
# Create new module (if using CLI)
hs create module module-name

# Watch and upload
hs watch pike/src/ pike

# Upload theme
hs upload pike/ pike

# Theme preview
hs theme preview
```

## Key Differences from CRM Development

| Aspect | CMS Development | CRM Development |
|--------|----------------|-----------------|
| Language | HubL | React/JSX |
| Components | HTML + HubL | @hubspot/ui-extensions |
| Styling | CSS + theme variables | Component props (no style prop) |
| State | Server-rendered | React state/hooks |
| API calls | HubL/server-side | hubspot.fetch |
| Focus | Content editors | CRM users |
| Structure | module.html + fields.json | .tsx + -hsmeta.json |

## Updating This Skill

When adding new patterns:

1. **Fundamental patterns** → Add to SKILL.md (keep under 500 lines)
2. **Field definitions** → Add to FIELDS_REFERENCE.md
3. **Working examples** → Add to EXAMPLES.md
4. **Quick reference** → Update this README

## Related Documentation

- [HubL Documentation](https://developers.hubspot.com/docs/cms/hubl)
- [Module Development](https://developers.hubspot.com/docs/cms/building-blocks/modules)
- [HubSpot CLI](https://developers.hubspot.com/docs/cms/developer-reference/cli-commands)
- [Theme Development](https://developers.hubspot.com/docs/cms/themes)

---

**Note**: This skill focuses on HubSpot **CMS** development (themes, modules, HubL). For HubSpot **CRM** development (UI Extensions, cards, settings), see the `hubspot-crm-react` skill.
