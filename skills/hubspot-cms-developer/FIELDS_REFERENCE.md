# HubSpot CMS Fields Reference

Complete field definitions and patterns for Pike theme modules.

## Complete Grid Field Group

Full responsive grid structure for repeater modules:

```json
{
  "name": "grid",
  "label": "Grid settings",
  "children": [
    {
      "name": "mobile",
      "label": "Mobile grid",
      "children": [
        {
          "name": "align",
          "label": "Alignment",
          "type": "alignment",
          "alignment_direction": "HORIZONTAL"
        },
        {
          "name": "columns",
          "label": "Items per row @mobile",
          "type": "number",
          "display": "slider",
          "step": 1,
          "min": 1,
          "max": 3,
          "placeholder": "Default"
        },
        {
          "name": "gap",
          "label": "Gap between items @mobile",
          "type": "number",
          "display": "slider",
          "step": 1,
          "min": 0,
          "max": 50,
          "placeholder": "Default",
          "suffix": "px"
        }
      ],
      "type": "group"
    },
    {
      "name": "tablet",
      "label": "Tablet grid",
      "children": [
        {
          "name": "align",
          "label": "Alignment",
          "type": "alignment",
          "alignment_direction": "HORIZONTAL"
        },
        {
          "name": "columns",
          "label": "Items per row @tablet",
          "type": "number",
          "display": "slider",
          "step": 1,
          "min": 1,
          "max": 4,
          "placeholder": "Default"
        },
        {
          "name": "gap",
          "label": "Gap between items @tablet",
          "type": "number",
          "display": "slider",
          "step": 1,
          "min": 0,
          "max": 50,
          "placeholder": "Default",
          "suffix": "px"
        }
      ],
      "type": "group"
    },
    {
      "name": "desktop",
      "label": "Desktop grid",
      "children": [
        {
          "name": "align",
          "label": "Alignment",
          "type": "alignment",
          "alignment_direction": "HORIZONTAL"
        },
        {
          "name": "columns",
          "label": "Items per row @desktop",
          "type": "number",
          "display": "slider",
          "step": 1,
          "min": 1,
          "max": 6,
          "placeholder": "Default"
        },
        {
          "name": "gap",
          "label": "Gap between items @desktop",
          "type": "number",
          "display": "slider",
          "step": 1,
          "min": 0,
          "max": 100,
          "placeholder": "Default",
          "suffix": "px"
        }
      ],
      "type": "group"
    },
    {
      "name": "desktop_lg",
      "label": "Wide desktop grid",
      "children": [
        {
          "name": "align",
          "label": "Alignment",
          "type": "alignment",
          "alignment_direction": "HORIZONTAL"
        },
        {
          "name": "columns",
          "label": "Items per row @desktop",
          "type": "number",
          "display": "slider",
          "step": 1,
          "min": 1,
          "max": 6,
          "placeholder": "Default"
        },
        {
          "name": "gap",
          "label": "Gap between items @desktop",
          "type": "number",
          "display": "slider",
          "step": 1,
          "min": 0,
          "max": 100,
          "placeholder": "Default",
          "suffix": "px"
        }
      ],
      "type": "group"
    }
  ],
  "type": "group",
  "tab": "STYLE"
}
```

### Grid Implementation in module.html

```hubl
{# In user styles section #}
{%- set user_styles = [] -%}

{# Alignment #}
{%- do user_styles.append('--alignment-x\\@sm:' ~ css_helpers.alignment_map(grid.mobile.align.horizontal_align)) if grid.mobile.align.horizontal_align -%}
{%- do user_styles.append('--alignment-x\\@md:' ~ css_helpers.alignment_map(grid.tablet.align.horizontal_align)) if grid.tablet.align.horizontal_align -%}
{%- do user_styles.append('--alignment-x\\@lg:' ~ css_helpers.alignment_map(grid.desktop.align.horizontal_align)) if grid.desktop.align.horizontal_align -%}
{%- do user_styles.append('--alignment-x\\@xl:' ~ css_helpers.alignment_map(grid.desktop_lg.align.horizontal_align)) if grid.desktop_lg.align.horizontal_align -%}

{# Columns #}
{%- do user_styles.append('--col-count\\@sm:' ~ grid.mobile.columns) if grid.mobile.columns is defined -%}
{%- do user_styles.append('--col-count\\@md:' ~ grid.tablet.columns) if grid.tablet.columns is defined -%}
{%- do user_styles.append('--col-count\\@lg:' ~ grid.desktop.columns) if grid.desktop.columns is defined -%}
{%- do user_styles.append('--col-count\\@xl:' ~ grid.desktop_lg.columns) if grid.desktop_lg.columns is defined -%}

{# Gap #}
{%- do user_styles.append('--gap\\@sm:' ~ grid.mobile.gap ~ 'px') if grid.mobile.gap is defined -%}
{%- do user_styles.append('--gap\\@md:' ~ grid.tablet.gap ~ 'px') if grid.tablet.gap is defined -%}
{%- do user_styles.append('--gap\\@lg:' ~ grid.desktop.gap ~ 'px') if grid.desktop.gap is defined -%}
{%- do user_styles.append('--gap\\@xl:' ~ grid.desktop_lg.gap ~ 'px') if grid.desktop_lg.gap is defined -%}
```

## Field Type Examples

### Text Field

```json
{
  "name": "title",
  "label": "Title",
  "type": "text",
  "default": "Default title",
  "help_text": "Main heading for the module"
}
```

### Rich Text

```json
{
  "name": "content",
  "label": "Content",
  "type": "richtext",
  "default": {
    "html": "<p>Default content</p>"
  }
}
```

### Image Field

```json
{
  "name": "image",
  "label": "Image",
  "type": "image",
  "default": {
    "src": "",
    "alt": "",
    "loading": "lazy"
  }
}
```

### Link Field

```json
{
  "name": "cta",
  "label": "Call to action",
  "type": "link",
  "default": {
    "url": {
      "href": "",
      "type": "EXTERNAL"
    },
    "open_in_new_tab": false,
    "no_follow": false
  }
}
```

### Choice Field (Select)

```json
{
  "name": "style",
  "label": "Card style",
  "type": "choice",
  "display": "select",
  "choices": [
    ["default", "Default"],
    ["outlined", "Outlined"],
    ["filled", "Filled"]
  ],
  "default": "default"
}
```

### Choice Field (Radio)

```json
{
  "name": "layout",
  "label": "Layout",
  "type": "choice",
  "display": "radio",
  "choices": [
    ["stacked", "Stacked"],
    ["side-by-side", "Side by side"]
  ],
  "default": "stacked"
}
```

### Boolean Field

```json
{
  "name": "show_description",
  "label": "Show description?",
  "type": "boolean",
  "default": true
}
```

### Number Field (Slider)

```json
{
  "name": "columns",
  "label": "Number of columns",
  "type": "number",
  "display": "slider",
  "min": 1,
  "max": 4,
  "step": 1,
  "default": 3
}
```

### Number Field (Text)

```json
{
  "name": "max_items",
  "label": "Maximum items",
  "type": "number",
  "display": "text",
  "min": 1,
  "max": 100,
  "default": 10
}
```

### Color Field

```json
{
  "name": "background_color",
  "label": "Background color",
  "type": "color",
  "default": {
    "color": "#ffffff",
    "opacity": 100
  }
}
```

### Font Field

```json
{
  "name": "custom_font",
  "label": "Custom font",
  "type": "font",
  "load_external_fonts": true
}
```

### Spacing Field

```json
{
  "name": "spacing",
  "label": "Spacing",
  "type": "spacing",
  "default": {
    "padding": {
      "top": 0,
      "right": 0,
      "bottom": 0,
      "left": 0
    },
    "margin": {
      "top": 0,
      "right": 0,
      "bottom": 0,
      "left": 0
    }
  }
}
```

### Alignment Field

```json
{
  "name": "alignment",
  "label": "Content alignment",
  "type": "alignment",
  "alignment_direction": "BOTH",
  "default": {
    "horizontal_align": "CENTER",
    "vertical_align": "MIDDLE"
  }
}
```

### Text Alignment Field

```json
{
  "name": "text_align",
  "label": "Text alignment",
  "type": "textalignment",
  "alignment_direction": "HORIZONTAL",
  "default": {
    "text_align": "LEFT"
  }
}
```

### Icon Field

```json
{
  "name": "icon",
  "label": "Icon",
  "type": "icon",
  "default": {
    "name": "home",
    "unicode": "f015",
    "type": "SOLID"
  }
}
```

### CTA Field

```json
{
  "name": "button",
  "label": "Button",
  "type": "cta",
  "default": {
    "button_text": "Click here",
    "url": {
      "href": "",
      "type": "EXTERNAL"
    },
    "open_in_new_tab": false
  }
}
```

## Repeater Fields

Basic repeater structure:

```json
{
  "name": "items",
  "label": "Items",
  "type": "group",
  "occurrence": {
    "min": 1,
    "max": 12,
    "default": 3
  },
  "children": [
    {
      "name": "title",
      "label": "Title",
      "type": "text",
      "default": "Item title"
    },
    {
      "name": "description",
      "label": "Description",
      "type": "richtext"
    },
    {
      "name": "image",
      "label": "Image",
      "type": "image"
    }
  ]
}
```

### Repeater in module.html

```hubl
{%- for item in module.items -%}
  <div class="grid__item">
    <h3>{{ item.title }}</h3>
    {{ item.description }}
    {%- if item.image.src -%}
      <img src="{{ item.image.src }}" alt="{{ item.image.alt }}">
    {%- endif -%}
  </div>
{%- endfor -%}
```

## Complete Text Style Group

For titles, paragraphs, or any text component:

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

**For paragraphs/descriptions**, use simplified appearance choices:

```json
{
  "choices": [
    ["p-sm", "Small"],
    ["paragraph", "Default"],
    ["p-lg", "Large"]
  ]
}
```

### Text Style Implementation

**In module.html**:

```hubl
{# In user styles section #}
{%- do user_styles.append(css_helpers.font_vars(styles.title.custom_font, 'title')) if styles.title.custom_font -%}

{# After user styles, before general styles #}
{{ css_helpers.text_style_group(styles.title, '.module-example__title') }}
```

**In markup**:

```hubl
<h2 class="module-example__title {{ styles.title.appearance }}">
  {{ module.title }}
</h2>
```

## Conditional Field Visibility

### Using `controlling_field_path`

```json
{
  "name": "link_url",
  "label": "Link URL",
  "type": "url",
  "visibility": {
    "controlling_field_path": "enable_link",
    "operator": "EQUAL",
    "property": "value",
    "controlling_value_regex": "true"
  }
}
```

### Common Operators

| Operator | Description |
|----------|-------------|
| `EQUAL` | Field equals value |
| `NOT_EQUAL` | Field does not equal value |
| `EMPTY` | Field is empty |
| `NOT_EMPTY` | Field is not empty |
| `MATCHES_REGEX` | Field matches regex pattern |

### Multiple Conditions

```json
{
  "visibility": {
    "hidden_subfields": {
      "style": ["option1", "option2"]
    }
  }
}
```

## Field Validation

### Text Validation with Regex

```json
{
  "name": "custom_id",
  "label": "Custom ID",
  "type": "text",
  "validation_regex": "[a-z][\\w-]*",
  "validation_error_message": "ID must start with a letter and contain only valid CSS characters"
}
```

### Number Constraints

```json
{
  "name": "quantity",
  "label": "Quantity",
  "type": "number",
  "min": 1,
  "max": 100,
  "step": 1,
  "required": true
}
```

## Tab Organization

Fields can be organized into tabs:

```json
{
  "name": "styles",
  "label": "Styles",
  "type": "group",
  "tab": "STYLE",
  "children": [
    {
      "name": "background_color",
      "label": "Background color",
      "type": "color"
    }
  ]
}
```

**Common tab names**:
- `CONTENT` (default, no tab property needed)
- `STYLE`
- `ADVANCED`

## Complete Field Group Example

A card repeater with full style controls:

```json
{
  "name": "cards",
  "label": "Cards",
  "type": "group",
  "occurrence": {
    "min": 1,
    "max": 6,
    "default": 3
  },
  "children": [
    {
      "name": "image",
      "label": "Image",
      "type": "image"
    },
    {
      "name": "title",
      "label": "Title",
      "type": "text",
      "default": "Card title"
    },
    {
      "name": "description",
      "label": "Description",
      "type": "richtext"
    },
    {
      "name": "cta",
      "label": "Call to action",
      "type": "link"
    }
  ]
}
```

With corresponding style groups:

```json
{
  "name": "card_styles",
  "label": "Card styles",
  "type": "group",
  "tab": "STYLE",
  "children": [
    {
      "name": "title",
      "label": "Card title",
      "type": "group",
      "children": [
        {
          "name": "appearance",
          "label": "Preset",
          "type": "choice",
          "display": "select",
          "choices": [
            ["h3", "H3"],
            ["h4", "H4"],
            ["h5", "H5"]
          ],
          "default": "h4"
        }
      ]
    },
    {
      "name": "background",
      "label": "Card background",
      "type": "color",
      "default": {
        "color": "#ffffff",
        "opacity": 100
      }
    }
  ]
}
```

## Best Practices

1. **Field ordering**: Content fields first, then animation, settings, and styles
2. **Labels**: Use sentence case, be descriptive
3. **Help text**: Add for complex or non-obvious fields
4. **Defaults**: Always provide sensible defaults
5. **Visibility**: Use `controlling_field_path` for nested field visibility
6. **Validation**: Add validation for user input fields (IDs, classes, URLs)
7. **Tab organization**: Keep content in main tab, styles in STYLE tab
8. **Field names**: Use `snake_case` for consistency

## Preset Appearance Values

When using text appearance presets, apply them as CSS classes:

- `jumbo` - Extra large display text
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Standard heading sizes
- `paragraph` - Default paragraph styling
- `p-sm` - Small text
- `p-lg` - Large text
- `unstyled` - No styling applied

These classes should be defined in your theme's typography styles or reference Pike's typography system.
