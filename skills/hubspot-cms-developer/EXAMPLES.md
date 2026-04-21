# HubSpot CMS Module Examples

Complete working examples of Pike theme modules.

## Simple Card Module

A basic card with image, title, and description.

### module.html

```hubl
{# module base class name: card-simple #}

{# imports #}
{%- import '../../tools/snippets.html' as snippets -%}
{%- import '../../tools/css-helpers.html' as css_helpers -%}

{# shorthand vars #}
{%- set animation = module.animation -%}
{%- set styles = module.styles -%}
{%- set layout = styles.layout -%}
{%- set visibility = styles.visibility -%}
{%- set module_id = module.settings.custom_id or 'cardSimple' ~ name|replace('module_','')|replace('widget_','') -%}

{# class names #}
{%- set module_classes = ['card-simple'] -%}
{%- do module_classes.append(module.settings.custom_classes) if module.settings.custom_classes -%}
{%- do module_classes.append('hide--mobile') if visibility.hidden_mobile -%}
{%- do module_classes.append('hide--tablet') if visibility.hidden_tablet -%}
{%- do module_classes.append('hide--desktop') if visibility.hidden_desktop -%}
{%- set module_classes = module_classes|join(' ') -%}

{# markup #}
<div id="{{ module_id }}" class="{{ module_classes }}" {{ 'data-mh-animation="' ~ animation.type ~ '"' if animation.type }}>
  {%- if module.image.src -%}
    <div class="card-simple__image">
      <img 
        src="{{ module.image.src }}" 
        alt="{{ module.image.alt }}"
        width="{{ module.image.width }}"
        height="{{ module.image.height }}"
        loading="{{ module.image.loading }}"
      >
    </div>
  {%- endif -%}
  
  <div class="card-simple__content">
    {%- if module.title -%}
      <h3 class="card-simple__title {{ styles.title.appearance }}">
        {{ module.title }}
      </h3>
    {%- endif -%}
    
    {%- if module.description -%}
      <div class="card-simple__description">
        {{ module.description }}
      </div>
    {%- endif -%}
    
    {%- if module.cta.url.href -%}
      <a href="{{ module.cta.url.href }}" class="card-simple__cta btn">
        {{ module.cta.link_text or 'Learn more' }}
      </a>
    {%- endif -%}
  </div>
</div>

{# user styles #}
{%- set user_styles = [] -%}
{%- do user_styles.append('animation-delay:' ~ animation.delay ~ 'ms') if animation.delay and animation.type -%}
{%- do user_styles.append(layout.spacing.css) if layout.spacing.css -%}
{%- do user_styles.append('z-index:' ~ visibility.z_index) if visibility.z_index -%}
{%- do user_styles.append(css_helpers.font_vars(styles.title.custom_font, 'title')) if styles.title.custom_font -%}
{%- set user_styles = user_styles|join(';')|replace(';;', ';') -%}

{%- if user_styles -%}
{%- require_css -%}
<style>
{% scope_css %}
.card-simple {
  {{ user_styles }}
}
{% end_scope_css %}
</style>
{%- end_require_css -%}
{%- endif -%}

{{ css_helpers.text_style_group(styles.title, '.card-simple__title') }}

{# general styles #}
{%- require_css -%}
<style>
{% scope_css %}
.card-simple {
  background: var(--color-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.card-simple__image img {
  width: 100%;
  height: auto;
  display: block;
}

.card-simple__content {
  padding: var(--spacing-md);
}

.card-simple__title {
  margin-bottom: var(--spacing-sm);
}

.card-simple__description {
  margin-bottom: var(--spacing-md);
}

.card-simple__cta {
  display: inline-block;
}
{% end_scope_css %}
</style>
{%- end_require_css -%}
```

### fields.json

```json
[
  {
    "name": "image",
    "label": "Image",
    "type": "image",
    "default": {
      "loading": "lazy"
    }
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
    "type": "richtext",
    "default": {
      "html": "<p>Card description goes here.</p>"
    }
  },
  {
    "name": "cta",
    "label": "Call to action",
    "type": "link",
    "default": {
      "url": {
        "href": "#",
        "type": "EXTERNAL"
      }
    }
  },
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
          ["mh-animation--fadeInUp", "Fade in up"]
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
  },
  {
    "name": "settings",
    "label": "Advanced settings",
    "children": [
      {
        "name": "custom_id",
        "label": "Custom ID",
        "type": "text",
        "validation_regex": "[a-z][\\w-]*"
      },
      {
        "name": "custom_classes",
        "label": "Custom classes",
        "type": "text"
      }
    ],
    "type": "group"
  },
  {
    "name": "styles",
    "label": "Styles",
    "type": "group",
    "children": [
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
              ["h3", "H3"],
              ["h4", "H4"],
              ["h5", "H5"]
            ],
            "default": "h3"
          },
          {
            "name": "custom_font",
            "label": "Custom font",
            "type": "font"
          }
        ],
        "type": "group"
      },
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
        "type": "group"
      },
      {
        "name": "visibility",
        "label": "Visibility",
        "children": [
          {
            "name": "z_index",
            "label": "Z Index",
            "type": "number",
            "display": "text",
            "step": 1
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
        "type": "group"
      }
    ],
    "tab": "STYLE"
  }
]
```

## Card Grid Module (Repeater)

A grid of cards with responsive columns.

### module.html

```hubl
{# module base class name: card-grid #}

{# imports #}
{%- import '../../tools/snippets.html' as snippets -%}
{%- import '../../tools/css-helpers.html' as css_helpers -%}

{# shorthand vars #}
{%- set animation = module.animation -%}
{%- set styles = module.styles -%}
{%- set grid = styles.grid -%}
{%- set layout = styles.layout -%}
{%- set visibility = styles.visibility -%}
{%- set module_id = module.settings.custom_id or 'cardGrid' ~ name|replace('module_','')|replace('widget_','') -%}

{# class names #}
{%- set module_classes = ['card-grid', 'grid'] -%}
{%- do module_classes.append(module.settings.custom_classes) if module.settings.custom_classes -%}
{%- do module_classes.append('hide--mobile') if visibility.hidden_mobile -%}
{%- do module_classes.append('hide--tablet') if visibility.hidden_tablet -%}
{%- do module_classes.append('hide--desktop') if visibility.hidden_desktop -%}
{%- set module_classes = module_classes|join(' ') -%}

{# markup #}
<div id="{{ module_id }}" class="{{ module_classes }}">
  {%- if module.heading -%}
    <h2 class="card-grid__heading {{ styles.heading.appearance }}">
      {{ module.heading }}
    </h2>
  {%- endif -%}
  
  <div class="card-grid__items">
    {%- for card in module.cards -%}
      <div 
        class="grid__item card-grid__card"
        {{ 'data-mh-animation="' ~ animation.type ~ '"' if animation.type }}
        {{ 'style="animation-delay:' ~ (animation.delay + (loop.index0 * animation.stagger)) ~ 'ms"' if animation.type and animation.stagger }}
      >
        {%- if card.image.src -%}
          <div class="card-grid__image">
            <img 
              src="{{ card.image.src }}" 
              alt="{{ card.image.alt }}"
              loading="lazy"
            >
          </div>
        {%- endif -%}
        
        <div class="card-grid__content">
          {%- if card.title -%}
            <h3 class="card-grid__title {{ styles.card_title.appearance }}">
              {{ card.title }}
            </h3>
          {%- endif -%}
          
          {%- if card.description -%}
            <div class="card-grid__description">
              {{ card.description }}
            </div>
          {%- endif -%}
          
          {%- if card.cta.url.href -%}
            <a href="{{ card.cta.url.href }}" class="card-grid__cta btn">
              {{ card.cta.link_text or 'Learn more' }}
            </a>
          {%- endif -%}
        </div>
      </div>
    {%- endfor -%}
  </div>
</div>

{# user styles #}
{%- set user_styles = [] -%}
{%- do user_styles.append(layout.spacing.css) if layout.spacing.css -%}
{%- do user_styles.append('z-index:' ~ visibility.z_index) if visibility.z_index -%}

{# Grid styles #}
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

{%- do user_styles.append(css_helpers.font_vars(styles.heading.custom_font, 'heading')) if styles.heading.custom_font -%}
{%- do user_styles.append(css_helpers.font_vars(styles.card_title.custom_font, 'card-title')) if styles.card_title.custom_font -%}

{%- set user_styles = user_styles|join(';')|replace(';;', ';') -%}

{%- if user_styles -%}
{%- require_css -%}
<style>
{% scope_css %}
.card-grid {
  {{ user_styles }}
}
{% end_scope_css %}
</style>
{%- end_require_css -%}
{%- endif -%}

{{ css_helpers.text_style_group(styles.heading, '.card-grid__heading') }}
{{ css_helpers.text_style_group(styles.card_title, '.card-grid__title') }}

{# general styles #}
{%- require_css -%}
<style>
{% scope_css %}
.card-grid__heading {
  margin-bottom: var(--spacing-lg);
}

.card-grid__card {
  background: var(--color-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.3s ease;
}

.card-grid__card:hover {
  box-shadow: var(--shadow-md);
}

.card-grid__image img {
  width: 100%;
  height: auto;
  display: block;
}

.card-grid__content {
  padding: var(--spacing-md);
}

.card-grid__title {
  margin-bottom: var(--spacing-sm);
}

.card-grid__description {
  margin-bottom: var(--spacing-md);
}
{% end_scope_css %}
</style>
{%- end_require_css -%}
```

### fields.json (key sections)

```json
[
  {
    "name": "heading",
    "label": "Section heading",
    "type": "text",
    "default": "Our Services"
  },
  {
    "name": "cards",
    "label": "Cards",
    "type": "group",
    "occurrence": {
      "min": 1,
      "max": 12,
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
  },
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
          ["mh-animation--fadeInUp", "Fade in up"]
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
      },
      {
        "name": "stagger",
        "label": "Animation stagger",
        "type": "number",
        "display": "slider",
        "help_text": "Timing between each card's animation",
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
    ],
    "type": "group"
  },
  {
    "name": "settings",
    "label": "Advanced settings",
    "children": [
      {
        "name": "custom_id",
        "label": "Custom ID",
        "type": "text",
        "validation_regex": "[a-z][\\w-]*"
      },
      {
        "name": "custom_classes",
        "label": "Custom classes",
        "type": "text"
      }
    ],
    "type": "group"
  },
  {
    "name": "styles",
    "label": "Styles",
    "type": "group",
    "children": [
      {
        "name": "heading",
        "label": "Section heading",
        "children": [
          {
            "name": "appearance",
            "label": "Preset",
            "type": "choice",
            "display": "select",
            "choices": [
              ["h1", "H1"],
              ["h2", "H2"],
              ["h3", "H3"]
            ],
            "default": "h2"
          },
          {
            "name": "custom_font",
            "label": "Custom font",
            "type": "font"
          }
        ],
        "type": "group"
      },
      {
        "name": "card_title",
        "label": "Card title",
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
          },
          {
            "name": "custom_font",
            "label": "Custom font",
            "type": "font"
          }
        ],
        "type": "group"
      },
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
                "default": 1
              },
              {
                "name": "gap",
                "label": "Gap @mobile",
                "type": "number",
                "display": "slider",
                "step": 1,
                "min": 0,
                "max": 50,
                "default": 20,
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
                "default": 3
              },
              {
                "name": "gap",
                "label": "Gap @desktop",
                "type": "number",
                "display": "slider",
                "step": 1,
                "min": 0,
                "max": 100,
                "default": 30,
                "suffix": "px"
              }
            ],
            "type": "group"
          }
        ],
        "type": "group"
      },
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
        "type": "group"
      },
      {
        "name": "visibility",
        "label": "Visibility",
        "children": [
          {
            "name": "z_index",
            "label": "Z Index",
            "type": "number",
            "display": "text"
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
        "type": "group"
      }
    ],
    "tab": "STYLE"
  }
]
```

## Hero Module with Background Image

A hero section with overlay and CTA.

### module.html

```hubl
{# module base class name: hero #}

{# imports #}
{%- import '../../tools/snippets.html' as snippets -%}
{%- import '../../tools/css-helpers.html' as css_helpers -%}

{# shorthand vars #}
{%- set animation = module.animation -%}
{%- set styles = module.styles -%}
{%- set layout = styles.layout -%}
{%- set ta = styles.text_alignment -%}
{%- set visibility = styles.visibility -%}
{%- set module_id = module.settings.custom_id or 'hero' ~ name|replace('module_','')|replace('widget_','') -%}

{# class names #}
{%- set module_classes = ['hero'] -%}
{%- do module_classes.append(module.settings.custom_classes) if module.settings.custom_classes -%}
{%- do module_classes.append('text-' ~ ta.default.text_align|lower) if ta.default.text_align -%}
{%- do module_classes.append('text-' ~ ta.tablet.text_align|lower ~ '--tablet') if ta.tablet.text_align -%}
{%- do module_classes.append('text-' ~ ta.desktop.text_align|lower ~ '--desktop') if ta.desktop.text_align -%}
{%- do module_classes.append('hide--mobile') if visibility.hidden_mobile -%}
{%- do module_classes.append('hide--tablet') if visibility.hidden_tablet -%}
{%- do module_classes.append('hide--desktop') if visibility.hidden_desktop -%}
{%- set module_classes = module_classes|join(' ') -%}

{# markup #}
<section 
  id="{{ module_id }}" 
  class="{{ module_classes }}"
  {{ 'data-mh-animation="' ~ animation.type ~ '"' if animation.type }}
>
  {%- if module.background_image.src -%}
    <div class="hero__background">
      <img 
        src="{{ module.background_image.src }}" 
        alt="{{ module.background_image.alt }}"
        loading="eager"
      >
    </div>
  {%- endif -%}
  
  <div class="hero__overlay"></div>
  
  <div class="hero__content">
    <div class="hero__inner">
      {%- if module.heading -%}
        <h1 class="hero__heading {{ styles.heading.appearance }}">
          {{ module.heading }}
        </h1>
      {%- endif -%}
      
      {%- if module.subheading -%}
        <p class="hero__subheading {{ styles.subheading.appearance }}">
          {{ module.subheading }}
        </p>
      {%- endif -%}
      
      {%- if module.cta.url.href -%}
        <a href="{{ module.cta.url.href }}" class="hero__cta btn btn--primary">
          {{ module.cta.link_text or 'Get started' }}
        </a>
      {%- endif -%}
    </div>
  </div>
</section>

{# user styles #}
{%- set user_styles = [] -%}
{%- do user_styles.append('animation-delay:' ~ animation.delay ~ 'ms') if animation.delay and animation.type -%}
{%- do user_styles.append(layout.spacing.css) if layout.spacing.css -%}
{%- do user_styles.append('z-index:' ~ visibility.z_index) if visibility.z_index -%}
{%- do user_styles.append('--hero-height:' ~ module.height ~ 'vh') if module.height -%}
{%- do user_styles.append('--overlay-opacity:' ~ (styles.overlay_opacity / 100)) if styles.overlay_opacity is defined -%}
{%- do user_styles.append(css_helpers.font_vars(styles.heading.custom_font, 'heading')) if styles.heading.custom_font -%}
{%- do user_styles.append(css_helpers.font_vars(styles.subheading.custom_font, 'subheading')) if styles.subheading.custom_font -%}
{%- set user_styles = user_styles|join(';')|replace(';;', ';') -%}

{%- if user_styles -%}
{%- require_css -%}
<style>
{% scope_css %}
.hero {
  {{ user_styles }}
}
{% end_scope_css %}
</style>
{%- end_require_css -%}
{%- endif -%}

{{ css_helpers.text_style_group(styles.heading, '.hero__heading') }}
{{ css_helpers.text_style_group(styles.subheading, '.hero__subheading') }}

{# general styles #}
{%- require_css -%}
<style>
{% scope_css %}
.hero {
  position: relative;
  min-height: var(--hero-height, 60vh);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero__background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, var(--overlay-opacity, 0.4));
  z-index: 1;
}

.hero__content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--container-width);
  padding: var(--spacing-xl) var(--spacing-md);
}

.hero__inner {
  max-width: 800px;
  margin: 0 auto;
}

.hero__heading {
  color: var(--color-white);
  margin-bottom: var(--spacing-md);
}

.hero__subheading {
  color: var(--color-white);
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-lg);
}

.hero__cta {
  font-size: var(--font-size-md);
}
{% end_scope_css %}
</style>
{%- end_require_css -%}
```

## Module with JavaScript

Interactive accordion module.

### module.html (JS section only)

```hubl
{# ... markup above ... #}

{%- require_js -%}
<script>
(function() {
  'use strict';
  
  const MODULE_CLASS = 'accordion';
  const ITEM_CLASS = 'accordion__item';
  const HEADER_CLASS = 'accordion__header';
  const CONTENT_CLASS = 'accordion__content';
  const ACTIVE_CLASS = 'is-active';
  
  function init() {
    const modules = document.querySelectorAll('.' + MODULE_CLASS);
    modules.forEach(setupAccordion);
  }
  
  function setupAccordion(module) {
    const headers = module.querySelectorAll('.' + HEADER_CLASS);
    
    headers.forEach(function(header) {
      header.addEventListener('click', function() {
        const item = header.closest('.' + ITEM_CLASS);
        const content = item.querySelector('.' + CONTENT_CLASS);
        const isActive = item.classList.contains(ACTIVE_CLASS);
        
        // Close all items
        const allItems = module.querySelectorAll('.' + ITEM_CLASS);
        allItems.forEach(function(i) {
          i.classList.remove(ACTIVE_CLASS);
          const c = i.querySelector('.' + CONTENT_CLASS);
          c.style.maxHeight = null;
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add(ACTIVE_CLASS);
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
    
    // Open first item by default
    const firstItem = module.querySelector('.' + ITEM_CLASS);
    if (firstItem) {
      const firstContent = firstItem.querySelector('.' + CONTENT_CLASS);
      firstItem.classList.add(ACTIVE_CLASS);
      firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
{%- end_require_js -%}
```

## HubL Macro Pattern

Reusable macro for rendering cards:

```hubl
{# Define macro #}
{%- macro render_card(card, classes='', animation='') -%}
  <div class="card {{ classes }}" {{ 'data-mh-animation="' ~ animation ~ '"' if animation }}>
    {%- if card.image.src -%}
      <img src="{{ card.image.src }}" alt="{{ card.image.alt }}">
    {%- endif -%}
    <h3>{{ card.title }}</h3>
    <p>{{ card.description }}</p>
    {%- if card.link -%}
      <a href="{{ card.link }}">Learn more</a>
    {%- endif -%}
  </div>
{%- endmacro -%}

{# Use macro #}
{%- for card in module.cards -%}
  {{ render_card(card, 'grid__item', animation.type) }}
{%- endfor -%}
```

## Using Snippets

From Pike's `tools/snippets.html`:

```hubl
{# Import at top #}
{%- import '../../tools/snippets.html' as snippets -%}

{# Use snippet #}
{{ snippets.responsive_image(module.image, 'hero__image') }}

{# Or #}
{{ snippets.button(module.cta, 'btn--primary') }}
```

## Best Practices Demonstrated

1. **Import tools at top** - snippets and css_helpers
2. **Shorthand variables** - Easy access to common fields
3. **Class name building** - Consistent pattern with do append
4. **User styles** - Custom properties set via fields
5. **Grid system** - `.grid` parent with `.grid__item` children
6. **Animation stagger** - Loop index for delayed animations
7. **Scoped CSS** - All styles wrapped in scope_css
8. **Avoid HubL in JS** - Use data attributes instead
9. **Progressive enhancement** - HTML first, JS enhances
10. **Theme variables** - Use CSS custom properties from Pike
