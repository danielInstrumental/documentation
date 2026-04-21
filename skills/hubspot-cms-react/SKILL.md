---
name: hubspot-cms-react
description: Develop React modules for HubSpot CMS using JSX field definitions, Islands architecture, and senior React patterns. Use when building interactive CMS React modules (not CRM), working with @hubspot/cms-components, or creating modules in /components/modules directory.
---

# HubSpot CMS React Developer

Expert guidance for building React modules for HubSpot CMS with JSX fields, Islands, and modern React patterns.

## Core Architecture

HubSpot CMS React modules are **server-rendered React components** with optional client-side hydration via Islands.

**Key differences from traditional modules**:
- Located in `/components/modules/` (not `.module` directories)
- Three required exports: `Component`, `meta`, `fields`
- Fields defined in JSX (not `fields.json`)
- Server-rendered with optional Islands for interactivity
- GraphQL data fetching built-in

**Key differences from CRM React**:
- For CMS pages/blogs (not CRM cards)
- Uses `@hubspot/cms-components` (not `@hubspot/ui-extensions`)
- Server-rendered (not client-only)
- No HubL wrapper needed (module IS the component)

## Module Structure

```
/components/modules/
├── WeatherModule/
│   ├── index.jsx          # Required - exports Component, meta, fields
│   ├── WeatherIsland.jsx  # Optional - interactive island
│   ├── query.graphql      # Optional - GraphQL query
│   └── styles.module.css  # Optional - CSS modules
└── SimpleModule.jsx       # Or single file with all exports
```

### Three Required Exports

Every module must export:

```javascript
// Component - the React component
export function Component({ fieldValues }) {
  return <div>{fieldValues.title}</div>;
}

// meta - module metadata
export const meta = {
  label: 'Weather Module'
};

// fields - JSX field definitions
import { ModuleFields, TextField } from '@hubspot/cms-components/fields';

export const fields = (
  <ModuleFields>
    <TextField 
      label="Title" 
      name="title" 
      default="Weather Forecast"
    />
  </ModuleFields>
);
```

## JSX Fields

Fields are defined using JSX components from `@hubspot/cms-components/fields`.

### Available Field Components

- `TextField` - Single-line text input
- `RichTextField` - WYSIWYG editor
- `NumberField` - Number input with slider/text display
- `BooleanField` - Checkbox or toggle
- `ChoiceField` - Select dropdown or radio buttons
- `ImageField` - Image picker
- `LinkField` - URL/page link selector
- `ColorField` - Color picker
- `FontField` - Font selector
- `SpacingField` - Margin/padding controls
- `AlignmentField` - Alignment controls
- `IconField` - Icon picker
- `FieldGroup` - Group fields together
- `RepeatedFieldGroup` - Repeater for multiple items

### Basic Fields Example

```javascript
import {
  ModuleFields,
  TextField,
  RichTextField,
  BooleanField,
  ChoiceField
} from '@hubspot/cms-components/fields';

export const fields = (
  <ModuleFields>
    <TextField 
      label="Title" 
      name="title" 
      default="Default Title"
      required
    />
    
    <RichTextField 
      label="Content" 
      name="content"
      default="<p>Default content</p>"
    />
    
    <BooleanField 
      label="Show Description?" 
      name="show_description"
      default={true}
    />
    
    <ChoiceField 
      label="Style" 
      name="style"
      choices={[
        ['default', 'Default'],
        ['outlined', 'Outlined'],
        ['filled', 'Filled']
      ]}
      default="default"
    />
  </ModuleFields>
);
```

### Field Groups

```javascript
import { ModuleFields, FieldGroup, TextField, BooleanField } from '@hubspot/cms-components/fields';

export const fields = (
  <ModuleFields>
    <TextField 
      label="Main Title" 
      name="main_title" 
      default="Page Title"
    />
    
    <FieldGroup 
      name="settings" 
      label="Settings"
    >
      <BooleanField 
        label="Enable Feature" 
        name="enabled"
        default={false}
      />
      
      <TextField 
        label="Custom Class" 
        name="custom_class"
        default=""
      />
    </FieldGroup>
  </ModuleFields>
);
```

**Accessing grouped fields**:
```javascript
export function Component({ fieldValues }) {
  const { main_title, settings } = fieldValues;
  
  return (
    <div className={settings.custom_class}>
      <h1>{main_title}</h1>
      {settings.enabled && <p>Feature enabled!</p>}
    </div>
  );
}
```

### Repeated Field Groups (Repeaters)

```javascript
import { ModuleFields, RepeatedFieldGroup, TextField, RichTextField, ImageField } from '@hubspot/cms-components/fields';

export const fields = (
  <ModuleFields>
    <TextField 
      label="Section Title" 
      name="section_title"
      default="Our Services"
    />
    
    <RepeatedFieldGroup 
      name="cards"
      label="Cards"
      occurrence={{
        min: 1,
        max: 12,
        default: 3
      }}
      default={[
        { title: 'Card 1', description: 'First card' },
        { title: 'Card 2', description: 'Second card' }
      ]}
    >
      <ImageField 
        label="Image" 
        name="image"
      />
      
      <TextField 
        label="Title" 
        name="title"
        default="Card Title"
        required
      />
      
      <RichTextField 
        label="Description" 
        name="description"
        default="<p>Card description</p>"
      />
    </RepeatedFieldGroup>
  </ModuleFields>
);
```

**Using repeater in component**:
```javascript
export function Component({ fieldValues }) {
  const { section_title, cards } = fieldValues;
  
  return (
    <section>
      <h2>{section_title}</h2>
      <div className="cards-grid">
        {cards.map((card, index) => (
          <div key={index} className="card">
            {card.image?.src && (
              <img src={card.image.src} alt={card.image.alt} />
            )}
            <h3>{card.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: card.description }} />
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Custom Field Components

Abstract common field patterns into reusable components:

```javascript
// CustomFields.jsx
import { FieldGroup, TextField, BooleanField } from '@hubspot/cms-components/fields';

export const SeoFields = () => (
  <FieldGroup name="seo" label="SEO Settings">
    <TextField 
      label="Meta Title" 
      name="meta_title"
      default=""
    />
    
    <TextField 
      label="Meta Description" 
      name="meta_description"
      default=""
    />
    
    <BooleanField 
      label="No Index?" 
      name="no_index"
      default={false}
    />
  </FieldGroup>
);

// Use in module
import { ModuleFields, TextField } from '@hubspot/cms-components/fields';
import { SeoFields } from '../../../shared/CustomFields';

export const fields = (
  <ModuleFields>
    <TextField label="Title" name="title" />
    <SeoFields />
  </ModuleFields>
);
```

## Islands Architecture

Islands enable **client-side interactivity** on server-rendered modules.

### Why Islands?

- **Server-first**: Page loads fast with static HTML
- **Progressive hydration**: JavaScript loads only for interactive parts
- **Performance**: Reduces JavaScript bundle size
- **SEO**: Content is server-rendered and crawlable

### Implementing Islands

**1. Create island component** (note `?island` suffix):

```javascript
// WeatherIsland.jsx
import { useState, useEffect } from 'react';

export default function WeatherIsland({ location }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.weather.com/${location}`)
      .then(res => res.json())
      .then(setWeather)
      .finally(() => setLoading(false));
  }, [location]);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="weather-widget">
      <h3>Weather in {location}</h3>
      <p>Temperature: {weather.temp}°F</p>
      <p>Conditions: {weather.conditions}</p>
    </div>
  );
}
```

**2. Import with `?island` and wrap with `Island`**:

```javascript
// index.jsx
import { Island } from '@hubspot/cms-components';
import WeatherIsland from './WeatherIsland.jsx?island';
import { ModuleFields, TextField } from '@hubspot/cms-components/fields';

export function Component({ fieldValues }) {
  return (
    <div className="weather-module">
      <h2>{fieldValues.title}</h2>
      
      {/* This part is server-rendered AND client-hydrated */}
      <Island 
        module={WeatherIsland} 
        location={fieldValues.location}
        hydrateOn="visible"
      />
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField label="Title" name="title" default="Weather" />
    <TextField label="Location" name="location" default="Boston" />
  </ModuleFields>
);

export const meta = {
  label: 'Weather Module'
};
```

### Island Props

| Prop | Type | Description |
|------|------|-------------|
| `module` | Component | Island component (with `?island` suffix) |
| `hydrateOn` | string | `"load"` (default), `"visible"`, `"idle"` |
| `clientOnly` | boolean | Skip server render (browser-only code) |
| `id` | string | Custom island ID (auto-generated if omitted) |
| `wrapperTag` | string | HTML tag for wrapper (default: `"div"`) |
| `wrapperClassName` | string | CSS class for wrapper |
| `wrapperStyle` | object | Inline styles for wrapper |

### Hydration Strategies

**Load (default)** - Hydrates immediately on page load:
```javascript
<Island module={MyIsland} hydrateOn="load" />
```

**Visible** - Hydrates when scrolled into view (Intersection Observer):
```javascript
<Island module={MyIsland} hydrateOn="visible" />
```

**Idle** - Hydrates when browser is idle (requestIdleCallback):
```javascript
<Island module={MyIsland} hydrateOn="idle" />
```

**Client Only** - Skips server render (browser-only libraries):
```javascript
<Island module={MyIsland} clientOnly={true} />
```

## GraphQL Data Fetching

Bind GraphQL queries to fetch data from HubDB, CRM objects, or custom objects.

### Adding GraphQL Query

**1. Create query file**:

```graphql
# query.graphql
query GetBlogPosts {
  CMS {
    blog_posts(limit: 5) {
      items {
        id
        name
        post_summary
        published_date
      }
    }
  }
}
```

**2. Export as `query`**:

```javascript
// index.jsx
import { ModuleFields, TextField } from '@hubspot/cms-components/fields';
import myQuery from './query.graphql';

export function Component({ fieldValues, dataQueryResult }) {
  // Access GraphQL data via dataQueryResult
  const posts = dataQueryResult?.data?.CMS?.blog_posts?.items || [];
  
  return (
    <div>
      <h2>{fieldValues.title}</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h3>{post.name}</h3>
            <p>{post.post_summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField label="Title" name="title" default="Recent Posts" />
  </ModuleFields>
);

export const meta = {
  label: 'Blog Posts Module'
};

// Export query
export const query = myQuery;
```

**GraphQL result shape**:
```javascript
dataQueryResult = {
  data: {
    CMS: {
      blog_posts: {
        items: [ /* posts */ ]
      }
    }
  }
}
```

## HubL Data Template

Pass HubL variables/functions to React modules using `hublDataTemplate`.

```javascript
export function Component({ fieldValues, hublData }) {
  return (
    <div>
      <h2>{fieldValues.title}</h2>
      <p>Total posts: {hublData.totalBlogPostCount}</p>
      <a href={hublData.blogAllPostsUrl}>View all posts</a>
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField label="Title" name="title" />
  </ModuleFields>
);

export const meta = {
  label: 'Blog Stats Module'
};

// HubL data template
export const hublDataTemplate = `
{% set blogId = module.blog_field %}
{% set hublData = {
  "totalBlogPostCount": blog_total_post_count(blogId),
  "blogAllPostsUrl": blog_all_posts_url(blogId)
} %}
`;
```

**Available in component props as `hublData`.**

## Senior React Patterns

### Custom Hooks

```javascript
// hooks/useFetch.js
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Use in island
import { useFetch } from '../hooks/useFetch';

export default function DataIsland({ apiUrl }) {
  const { data, loading, error } = useFetch(apiUrl);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### Component Composition

```javascript
// Composable components
const Card = ({ children, className = '' }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, subtitle }) => (
  <div className="card__header">
    <h3>{title}</h3>
    {subtitle && <p>{subtitle}</p>}
  </div>
);

const CardBody = ({ children }) => (
  <div className="card__body">{children}</div>
);

// Use in module
export function Component({ fieldValues }) {
  return (
    <Card>
      <CardHeader 
        title={fieldValues.title} 
        subtitle={fieldValues.subtitle}
      />
      <CardBody>
        <p>{fieldValues.content}</p>
      </CardBody>
    </Card>
  );
}
```

### Memoization

```javascript
import { useMemo } from 'react';

export default function FilteredListIsland({ items, filter }) {
  // Expensive calculation - only recompute when dependencies change
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.title.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}
```

## CSS Modules

HubSpot CMS React supports CSS Modules for scoped styling.

```css
/* styles.module.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md);
}

.title {
  font-size: 2rem;
  color: var(--color-primary);
}

.card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}
```

```javascript
// index.jsx
import styles from './styles.module.css';

export function Component({ fieldValues }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{fieldValues.title}</h1>
      <div className={styles.card}>
        <p>{fieldValues.content}</p>
      </div>
    </div>
  );
}
```

## Embedding Modules in Templates

Modules are embedded in HubL templates using standard module syntax:

```hubl
{# In your template file #}
{% module "weather_module"
  path="@projects/my-project/components/modules/WeatherModule"
%}

{# With overrides #}
{% module "weather_module"
  path="@projects/my-project/components/modules/WeatherModule",
  title="Custom Title",
  location="New York"
%}
```

## Local Development

Use `@hubspot/cms-dev-server` for local development with hot reloading.

### Setup

```bash
npm install @hubspot/cms-dev-server --save-dev
```

```json
// package.json
{
  "scripts": {
    "dev": "cms-dev-server"
  }
}
```

### Run Dev Server

```bash
npm run dev
```

Access modules at `https://hslocal.net:3000/module/...`

**For `hublDataTemplate` to work locally**, use:
```
https://hslocal.net:3000/preview/module/...
```

## TypeScript Support

```typescript
// index.tsx
import { ModuleFields, TextField } from '@hubspot/cms-components/fields';

interface FieldValues {
  title: string;
  description?: string;
}

interface Props {
  fieldValues: FieldValues;
}

export function Component({ fieldValues }: Props) {
  return (
    <div>
      <h1>{fieldValues.title}</h1>
      {fieldValues.description && <p>{fieldValues.description}</p>}
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField label="Title" name="title" default="Title" />
    <TextField label="Description" name="description" default="" />
  </ModuleFields>
);

export const meta = {
  label: 'Typed Module'
};
```

## Common Patterns

### Conditional Rendering

```javascript
export function Component({ fieldValues }) {
  const { show_cta, cta_text, cta_url } = fieldValues;
  
  return (
    <div>
      <h1>{fieldValues.title}</h1>
      
      {show_cta && cta_url && (
        <a href={cta_url} className="btn">
          {cta_text || 'Learn More'}
        </a>
      )}
    </div>
  );
}
```

### Loading States

```javascript
export default function DataIsland({ apiUrl }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [apiUrl]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return <div className="data-display">{/* render data */}</div>;
}
```

### Error Boundaries

```javascript
import { Component, ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }

    return this.props.children;
  }
}

// Use in module
export function Component({ fieldValues }) {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## Quick Reference

**Module location**: `/components/modules/ModuleName/index.jsx`

**Required exports**: `Component`, `meta`, `fields`

**Optional exports**: `query`, `hublDataTemplate`

**Field components**: From `@hubspot/cms-components/fields`

**Islands**: From `@hubspot/cms-components`, import with `?island`

**Hydration**: `hydrateOn="load|visible|idle"`

**GraphQL**: Export `query`, access via `dataQueryResult` prop

**HubL data**: Export `hublDataTemplate`, access via `hublData` prop

**CSS**: CSS Modules with `styles.module.css`

**Dev server**: `npm run cms-dev-server` → `hslocal.net:3000`
