---
name: hubspot-cms-developer
description: Develop HubSpot CMS themes and modules using HubL templating, Pike theme patterns, and content editor best practices. Use when creating or modifying HubSpot modules, themes, templates, or working with module.html, fields.json, HubL, CSS, or Pike theme architecture.
---

# HubSpot CMS Developer

Expert guidance for building HubSpot CMS themes and modules with HubL, following Pike theme architecture and content editor-focused development.

## Core Principles

1. **Keep code DRY** - Use snippets and helpers
2. **Editor-first mindset** - Content editors are as important as end users
3. **Progressive enhancement** - Start with working HTML, enhance with JS
4. **Theme consistency** - Leverage Pike's variables and patterns
5. **Responsive by default** - Mobile-first development

## Pike Theme Architecture

### Theme Structure

```
pike/
├── src/
│   ├── modules/          # Custom modules
│   ├── templates/        # Page templates
│   ├── css/
│   │   ├── css-variables.css
│   │   ├── layout.css    # Grid system
│   │   └── partials/
│   └── tools/
│       ├── snippets.html      # Reusable HubL macros
│       └── css-helpers.html   # CSS utility macros
└── theme.json

child-theme/
├── src/
│   ├── css/
│   │   └── child.css     # Child theme overrides
│   └── modules/          # Child-specific modules
└── theme.json
```

### Using Pike's Tools

**Always import at the top of module.html**:
```hubl
{# imports #}
{%- import '../../tools/snippets.html' as snippets -%}
{%- import '../../tools/css-helpers.html' as css_helpers -%}
```

## Module Development

### Module Structure (module.html)

**Order matters** - follow this exact structure:

```hubl
{# module base class name: module-example #}

{# imports #}
{%- import '../../tools/snippets.html' as snippets -%}
{%- import '../../tools/css-helpers.html' as css_helpers -%}

{# shorthand vars #}
{%- set animation = module.animation -%}
{%- set styles = module.styles -%}
{%- set grid = styles.grid -%}
{%- set ta = styles.text_alignment -%}
{%- set layout = styles.layout -%}
{%- set visibility = styles.visibility -%}
{%- set module_id = module.settings.custom_id or 'moduleExample' ~ name|replace('module_','')|replace('widget_','') -%}

{# logic and macros #}
{# Your custom logic here #}

{# class names #}
{%- set module_classes = ['module-example'] -%}
{%- do module_classes.append(module.settings.custom_classes) if module.settings.custom_classes -%}
{%- do module_classes.append('text-' ~ ta.default.text_align|lower) if ta.default.text_align -%}
{%- do module_classes.append('text-' ~ ta.tablet.text_align|lower ~ '--tablet') if ta.tablet.text_align -%}
{%- do module_classes.append('text-' ~ ta.desktop.text_align|lower ~ '--desktop') if ta.desktop.text_align -%}
{%- do module_classes.append('hide--mobile') if visibility.hidden_mobile -%}
{%- do module_classes.append('hide--tablet') if visibility.hidden_tablet -%}
{%- do module_classes.append('hide--desktop') if visibility.hidden_desktop -%}
{%- set module_classes = module_classes|join(' ') -%}

{# markup #}
<div id="{{ module_id }}" class="{{ module_classes }}" {{ 'data-mh-animation="' ~ animation.type ~ '"' if animation.type }}>
  {# Module content here #}
</div>

{# user styles #}
{%- set user_styles = [] -%}
{%- do user_styles.append('animation-delay:' ~ animation.delay ~ 'ms') if animation.delay and animation.type -%}
{%- do user_styles.append(layout.spacing.css) if layout.spacing.css -%}
{%- do user_styles.append('z-index:' ~ visibility.z_index) if visibility.z_index -%}

{# Grid styles if using grid system #}
{%- do user_styles.append('--alignment-x\\@sm:' ~ css_helpers.alignment_map(grid.mobile.align.horizontal_align)) if grid.mobile.align.horizontal_align -%}
{%- do user_styles.append('--alignment-x\\@md:' ~ css_helpers.alignment_map(grid.tablet.align.horizontal_align)) if grid.tablet.align.horizontal_align -%}
{%- do user_styles.append('--alignment-x\\@lg:' ~ css_helpers.alignment_map(grid.desktop.align.horizontal_align)) if grid.desktop.align.horizontal_align -%}
{%- do user_styles.append('--alignment-x\\@xl:' ~ css_helpers.alignment_map(grid.desktop_lg.align.horizontal_align)) if grid.desktop_lg.align.horizontal_align -%}

{%- do user_styles.append('--col-count\\@sm:' ~ grid.mobile.columns) if grid.mobile.columns is defined -%}
{%- do user_styles.append('--col-count\\@md:' ~ grid.tablet.columns) if grid.tablet.columns is defined -%}
{%- do user_styles.append('--col-count\\@lg:' ~ grid.desktop.columns) if grid.desktop.columns is defined -%}
{%- do user_styles.append('--col-count\\@xl:' ~ grid.desktop_lg.columns) if grid.desktop_lg.columns is defined -%}

{%- do user_styles.append('--gap\\@sm:' ~ grid.mobile.gap ~ 'px') if grid.mobile.gap is defined -%}
{%- do user_styles.append('--gap\\@md:' ~ grid.tablet.gap ~ 'px') if grid.tablet.gap is defined -%}
{%- do user_styles.append('--gap\\@lg:' ~ grid.desktop.gap ~ 'px') if grid.desktop.gap is defined -%}
{%- do user_styles.append('--gap\\@xl:' ~ grid.desktop_lg.gap ~ 'px') if grid.desktop_lg.gap is defined -%}

{%- set user_styles = user_styles|join(';')|replace(';;', ';') -%}

{%- if user_styles -%}
{%- require_css -%}
<style>
{% scope_css %}
.module-example {
  {{ user_styles }}
}
{% end_scope_css %}
</style>
{%- end_require_css -%}
{%- endif -%}

{# general styles (if under 50 lines) #}
{%- require_css -%}
<style>
{% scope_css %}
.module-example {
  /* Component styles here */
}
{% end_scope_css %}
</style>
{%- end_require_css -%}

{# js (if module is under 500 lines and js is needed) #}
{%- require_js -%}
<script>
(function() {
  // Module JavaScript here
  // Avoid HubL in JavaScript
})();
</script>
{%- end_require_js -%}
```

### When to Use Separate Files

| Condition | Action |
|-----------|--------|
| CSS < 50 lines AND module < 500 lines | Include in `module.html` with `require_css` |
| CSS ≥ 50 lines | Create `module.css` |
| JS needed AND module < 500 lines | Include in `module.html` with `require_js` |
| JS > simple logic OR module ≥ 500 lines | Create `module.js` |

### HubL Best Practices

**Use `-` in HubL tags** to strip whitespace:
```hubl
{# ✅ GOOD - strips whitespace #}
{%- if foo -%}Bar{%- endif -%}

{# ❌ BAD - preserves whitespace #}
{% if foo %}Bar{% endif %}

{# Exception: when whitespace is needed (text, class names) #}
<span class="{% if active %}active{% endif %}">Text</span>
```

**Avoid deeply nested logic**:
```hubl
{# ✅ GOOD - use macros #}
{%- macro render_card(item) -%}
  <div class="card">{{ item.title }}</div>
{%- endmacro -%}

{%- for item in items -%}
  {{ render_card(item) }}
{%- endfor -%}

{# ❌ BAD - nested loops and conditionals #}
{%- for item in items -%}
  {%- if item.show -%}
    {%- for tag in item.tags -%}
      {# ... deeply nested logic #}
    {%- endfor -%}
  {%- endif -%}
{%- endfor -%}
```

## Fields Architecture (fields.json)

### Field Group Order

**Standard order** (use only what's needed):

1. **Content fields** (text, images, etc.)
2. **Repeaters** (if applicable)
3. **Animation** group (if applicable)
4. **Settings** group (required)
5. **Styles** tab with:
   - Component-specific style groups
   - Grid (if repeater)
   - Layout (spacing) - required
   - Alignment or Text alignment
   - Visibility - required

### Required Field Groups

#### Animation (when needed)

```json
{
  "name": "animation",
  "label": "Animation settings",
  "children": [
    {
      "name": "type",
      "label": "Animation type",
      "type": "choice",
      "display": "select",
      "choices": [
        ["mh-animation--fadeIn", "Fade in"],
        ["mh-animation--fadeInUp", "Fade in up"],
        ["mh-animation--fadeInDown", "Fade in down"],
        ["mh-animation--fadeInRight", "Fade in right"],
        ["mh-animation--fadeInLeft", "Fade in left"],
        ["mh-animation--pulse", "Pulse"],
        ["mh-animation--headShake", "Headshake"],
        ["mh-animation--backInDown", "Back in down"],
        ["mh-animation--backInUp", "Back in up"]
      ],
      "placeholder": "None"
    },
    {
      "name": "delay",
      "label": "Animation delay",
      "type": "number",
      "display": "slider",
      "min": 0,
      "max": 1500,
      "step": 100,
      "suffix": "ms",
      "visibility": {
        "controlling_field_path": "animation.type",
        "operator": "NOT_EMPTY"
      }
    }
  ],
  "type": "group"
}
```

**Animation stagger** (for repeaters):
```json
{
  "name": "stagger",
  "label": "Animation stagger",
  "type": "number",
  "display": "slider",
  "help_text": "Timing between each element's animation",
  "min": 0,
  "max": 1500,
  "step": 100,
  "suffix": "ms",
  "visibility": {
    "controlling_field_path": "animation.type",
    "operator": "NOT_EMPTY"
  },
  "default": 150
}
```

#### Settings (required)

```json
{
  "name": "settings",
  "label": "Advanced settings",
  "children": [
    {
      "name": "custom_id",
      "label": "Custom ID",
      "type": "text",
      "help_text": "Cannot start with a number. Only use valid css characters.",
      "validation_regex": "[a-z][\\w-]*",
      "validation_error_message": "Custom ID cannot start with a number. Only use valid css characters (no spaces)."
    },
    {
      "name": "custom_classes",
      "label": "Custom classes",
      "type": "text",
      "help_text": "Multiple classes allowed. Names should not start with a number."
    }
  ],
  "type": "group"
}
```

### Styles Tab Structure

#### Layout (Spacing) - Required

```json
{
  "name": "layout",
  "label": "Spacing",
  "children": [
    {
      "name": "spacing",
      "label": "",
      "type": "spacing"
    }
  ],
  "type": "group",
  "tab": "STYLE"
}
```

#### Visibility - Required

```json
{
  "name": "visibility",
  "label": "Visibility",
  "children": [
    {
      "name": "z_index",
      "label": "Z Index",
      "type": "number",
      "display": "text",
      "step": 1,
      "help_text": "Negative pushes back, positive brings forward"
    },
    {
      "name": "hidden_mobile",
      "label": "Hide Mobile?",
      "type": "boolean"
    },
    {
      "name": "hidden_tablet",
      "label": "Hide Tablet?",
      "type": "boolean"
    },
    {
      "name": "hidden_desktop",
      "label": "Hide Desktop?",
      "type": "boolean"
    }
  ],
  "type": "group",
  "tab": "STYLE"
}
```

#### Text Alignment

```json
{
  "name": "text_alignment",
  "label": "Text alignment",
  "children": [
    {
      "name": "default",
      "label": "Default text alignment",
      "type": "textalignment",
      "alignment_direction": "HORIZONTAL"
    },
    {
      "name": "tablet",
      "label": "Tablet text alignment",
      "type": "textalignment",
      "alignment_direction": "HORIZONTAL"
    },
    {
      "name": "desktop",
      "label": "Desktop text alignment",
      "type": "textalignment",
      "alignment_direction": "HORIZONTAL"
    }
  ],
  "type": "group",
  "tab": "STYLE"
}
```

#### Alignment (for flex/grid layouts)

```json
{
  "name": "alignment",
  "label": "Alignment",
  "children": [
    {
      "name": "default",
      "label": "Horizontal alignment",
      "type": "alignment",
      "alignment_direction": "HORIZONTAL"
    },
    {
      "name": "tablet",
      "label": "Horizontal alignment @tablet",
      "type": "alignment",
      "alignment_direction": "HORIZONTAL"
    },
    {
      "name": "desktop",
      "label": "Horizontal alignment @desktop",
      "type": "alignment",
      "alignment_direction": "HORIZONTAL"
    }
  ],
  "type": "group",
  "tab": "STYLE"
}
```

**Note**: `alignment_direction` can be `HORIZONTAL`, `VERTICAL`, or `BOTH`.

#### Grid (for repeaters)

Full grid structure in [FIELDS_REFERENCE.md](FIELDS_REFERENCE.md).

**Key points**:
- Uses Pike's `.grid` and `.grid__item` classes
- Actually flexbox, not CSS grid
- Responsive columns, gap, and alignment per breakpoint
- CSS custom properties: `--col-count@sm`, `--gap@lg`, etc.

### Component-Level Style Groups

#### Text Component

```json
{
  "name": "title",
  "label": "Title",
  "children": [
    {
      "name": "appearance",
      "label": "Preset",
      "type": "choice",
      "display": "select",
      "choices": [
        ["jumbo", "Jumbo"],
        ["h1", "H1"],
        ["h2", "H2"],
        ["h3", "H3"],
        ["h4", "H4"],
        ["h5", "H5"],
        ["h6", "H6"],
        ["paragraph", "Paragraph"],
        ["unstyled", "Div"]
      ],
      "placeholder": "Default"
    },
    {
      "name": "custom_font",
      "label": "Custom font",
      "type": "font"
    },
    {
      "name": "line_height",
      "label": "Line height",
      "display": "slider",
      "step": 0.1,
      "type": "number",
      "min": 0.5,
      "max": 2.5,
      "placeholder": "Default"
    },
    {
      "name": "custom_font_size_mobile",
      "label": "Custom font size @mobile",
      "type": "number",
      "display": "text",
      "step": 1,
      "min": 0,
      "placeholder": "Default",
      "suffix": "px"
    }
  ],
  "type": "group",
  "tab": "STYLE"
}
```

**Use Pike's font macros** in module.html:
```hubl
{%- do user_styles.append(css_helpers.font_vars(styles.title.custom_font, 'title')) if styles.title.custom_font -%}
{{ css_helpers.text_style_group(styles.title, '.module-example__title') }}
```

**Apply preset as class**:
```hubl
<h2 class="module-example__title {{ styles.title.appearance }}">
  {{ module.title }}
</h2>
```

### Field Visibility

**Prefer `controlling_field_path`** over `controlling_field`:
```json
{
  "visibility": {
    "controlling_field_path": "animation.type",
    "operator": "NOT_EMPTY"
  }
}
```

## Pike Grid System

**Not CSS Grid** - it's flexbox-based using custom properties.

### Usage in module.html

**Parent element** needs `grid` class:
```hubl
{%- set module_classes = ['module-cards', 'grid'] -%}
```

**Child elements** need `grid__item` class:
```hubl
{%- for card in module.cards -%}
  <div class="grid__item">
    {# Card content #}
  </div>
{%- endfor -%}
```

**Grid styles** in user styles section:
```hubl
{# Already shown in module structure above #}
{# These set CSS custom properties that layout.css consumes #}
```

## CSS Best Practices

### Leverage Theme Variables

**Check Pike's `css-variables.css`** before adding custom styles:
```css
/* Use theme variables */
.module-example {
  color: var(--color-text);
  background: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
}

/* Instead of hardcoded values */
.module-example {
  color: #333;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}
```

### Scoped Styles

**Always use `scope_css`** in module.html:
```hubl
{%- require_css -%}
<style>
{% scope_css %}
.module-example {
  /* Styles scoped to this module instance */
}
{% end_scope_css %}
</style>
{%- end_require_css -%}
```

### Responsive Patterns

```css
.module-example {
  /* Mobile first */
  padding: var(--spacing-sm);
}

@media (min-width: 768px) {
  .module-example {
    /* Tablet */
    padding: var(--spacing-md);
  }
}

@media (min-width: 1024px) {
  .module-example {
    /* Desktop */
    padding: var(--spacing-lg);
  }
}
```

## JavaScript Practices

### Avoid HubL in JavaScript

```javascript
// ❌ BAD - HubL in JS is fragile
const title = "{{ module.title }}";

// ✅ GOOD - use data attributes
const title = element.dataset.title;
```

```hubl
<div 
  class="module-example" 
  data-title="{{ module.title }}"
  data-config='{{ module.config|tojson }}'
>
```

### Module JS Pattern

```javascript
{%- require_js -%}
<script>
(function() {
  'use strict';
  
  const MODULE_CLASS = 'module-example';
  
  function init() {
    const modules = document.querySelectorAll('.' + MODULE_CLASS);
    
    modules.forEach(function(module) {
      const config = JSON.parse(module.dataset.config || '{}');
      setupModule(module, config);
    });
  }
  
  function setupModule(element, config) {
    // Module logic here
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
{%- end_require_js -%}
```

### When to Use module.js

- Module > 500 lines total
- JS > 50 lines
- JS needs to be shared across multiple modules
- Complex logic that benefits from separate file

## Common Patterns

### Repeater with Grid

```hubl
{%- set items = module.items -%}

<div class="module-cards grid">
  {%- for item in items -%}
    <div class="grid__item">
      <div class="card">
        <h3 class="{{ styles.card_title.appearance }}">{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </div>
  {%- endfor -%}
</div>
```

### Image with Responsive Sizing

```hubl
{%- set img = module.image -%}

{%- if img.src -%}
  <img 
    src="{{ img.src }}" 
    alt="{{ img.alt }}"
    width="{{ img.width }}"
    height="{{ img.height }}"
    loading="{{ img.loading }}"
  >
{%- endif -%}
```

### Conditional Content

```hubl
{%- set show_cta = module.show_cta -%}

{%- if show_cta and module.cta.href -%}
  <a href="{{ module.cta.href }}" class="btn">
    {{ module.cta.text }}
  </a>
{%- endif -%}
```

## Module Organization

```
module-name.module/
├── module.html       # Required - main template
├── module.css        # Optional - if > 50 lines
├── module.js         # Optional - if needed
├── fields.json       # Required - field definitions
└── meta.json         # Required - module metadata
```

### meta.json

```json
{
  "label": "Module Name",
  "is_available_for_new_content": true,
  "host_template_types": ["PAGE", "BLOG_POST"],
  "icon": "ICON_NAME"
}
```

## Quick Reference

**Module structure order**: info → imports → vars → logic → classes → markup → user styles → general styles → js

**Field order**: content → repeaters → animation → settings → styles tab

**Styles tab order**: component styles → grid → layout → alignment/text alignment → visibility

**Use `-` in HubL**: `{%- if -%}` not `{% if %}`

**Import tools**: snippets and css_helpers at top

**Grid system**: `.grid` parent, `.grid__item` children, flexbox-based

**Theme variables**: Check `css-variables.css` first

**Visibility**: Use `controlling_field_path` not `controlling_field`
