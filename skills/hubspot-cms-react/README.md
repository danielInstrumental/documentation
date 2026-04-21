# HubSpot CMS React Developer Skill

Build interactive React modules for HubSpot CMS using modern React patterns and Pike theme integration.

## What This Skill Covers

This skill teaches the agent to build React modules for HubSpot CMS:

- **Island architecture** - HubL wrapper + React hydration
- **Senior React patterns** - Custom hooks, composition, memoization
- **Data fetching** - API integration, loading states, error handling
- **Pike theme integration** - CSS custom properties, theme consistency
- **Build setup** - Webpack/Babel configuration for JSX
- **TypeScript support** - Type-safe React components
- **Performance** - Code splitting, virtualization, lazy loading
- **Testing** - Jest and React Testing Library

## When This Skill Is Used

The agent automatically applies this skill when:
- Building React modules for CMS (pages, blog posts)
- Working with `module.jsx`, `module.tsx`, or React-based `module.js`
- Setting up Webpack/Babel for JSX compilation
- Creating interactive CMS content (forms, tabs, counters, data displays)
- Integrating external APIs in CMS modules

## CMS React vs CRM React vs CMS HubL

| Aspect | CMS React (this skill) | CRM React | CMS HubL |
|--------|------------------------|-----------|----------|
| **Use case** | Interactive CMS content | CRM cards/settings | Static CMS content |
| **Technology** | React + HubL wrapper | React + UI Extensions | HubL templating |
| **Renders** | Client-side (islands) | CRM environment | Server-side |
| **For** | Content editors | CRM users | Content editors |
| **Structure** | module.html + module.jsx | .tsx + -hsmeta.json | module.html only |
| **Styles** | CSS + Pike variables | Component props | CSS + Pike variables |
| **Data** | fetch API | hubspot.fetch | HubL variables |

## Skill Structure

### SKILL.md (Main Reference)

Comprehensive guide covering:

1. **Island Architecture** - HubL wrapper with React mount points
2. **Module Setup** - module.html (HubL) + module.js (React)
3. **Senior React Patterns** - Hooks, composition, memoization, error boundaries
4. **Data Fetching** - API integration, polling, debouncing
5. **Pike Integration** - Using theme variables, responsive patterns
6. **Fields.json** - Same structure as HubL modules
7. **Build Setup** - Webpack, Babel, externals configuration
8. **TypeScript** - Type-safe React components
9. **Performance** - Code splitting, lazy loading, virtualization
10. **Testing** - Jest setup and patterns

**Use this for**: Understanding architecture, patterns, best practices

### EXAMPLES.md (Working Modules)

Complete production-ready examples:
- Counter module (state management, event handlers)
- Data fetching module (API integration, loading states)
- Filterable list (search, filters, memoization)
- Tabs module (accessible, animated)
- Form with validation (validation, submission, error handling)
- Build configurations (Webpack, package.json, Babel)

**Use this for**: Starting points, reference implementations

## Quick Start Pattern

### 1. HubL Wrapper (module.html)

```hubl
{# Mount point with config #}
<div 
  data-react-module="my-module"
  data-config='{{ module|tojson }}'
></div>

{# Load React component #}
{{ require_js(get_asset_url('./module.js')) }}
```

### 2. React Component (module.jsx)

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

const MyModule = ({ config }) => {
  return <div>{config.title}</div>;
};

document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-react-module="my-module"]');
  
  containers.forEach(container => {
    const config = JSON.parse(container.dataset.config || '{}');
    ReactDOM.render(<MyModule config={config} />, container);
  });
});
```

### 3. Build (webpack.config.js)

```javascript
module.exports = {
  entry: './src/module.jsx',
  output: {
    filename: 'module.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: 'babel-loader'
      }
    ]
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
};
```

## Architecture Flow

```
Editor creates page
    ↓
HubL renders module.html (server-side)
    ↓
HTML with mount point + data-config
    ↓
Browser loads page
    ↓
module.js executes
    ↓
React hydrates mount point
    ↓
Interactive component!
```

## Key Concepts

### Island Architecture

- **Static HTML** rendered by HubL (fast, SEO-friendly)
- **React islands** hydrate for interactivity
- Only interactive parts use JavaScript
- Best of both worlds: performance + interactivity

### Config Passing

```hubl
{# Pass all module fields as JSON #}
data-config='{{ module|tojson }}'
```

```javascript
// Access in React
const config = JSON.parse(container.dataset.config);
// config.title, config.api_url, config.items, etc.
```

### External Dependencies

**Critical**: Don't bundle React/ReactDOM

```javascript
// webpack.config.js
externals: {
  react: 'React',           // Use global React
  'react-dom': 'ReactDOM'   // Use global ReactDOM
}
```

HubSpot provides React/ReactDOM globally. Bundling them creates massive files and conflicts.

## Pike Theme Integration

### Using CSS Variables

```css
.my-module {
  padding: var(--spacing-md);
  background: var(--color-white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}
```

### Responsive Breakpoints

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

## Common Patterns

### Custom Hook for Data Fetching

```javascript
const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
};
```

### Component Composition

```javascript
// Small, focused components
const Card = ({ children }) => (
  <div className="card">{children}</div>
);

const CardHeader = ({ title }) => (
  <h3 className="card__title">{title}</h3>
);

// Compose them
<Card>
  <CardHeader title="Title" />
  <p>Content</p>
</Card>
```

### Memoization

```javascript
// Expensive calculation
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// Expensive component
const ExpensiveItem = React.memo(({ item }) => {
  return <div>{item.name}</div>;
});
```

## Build Workflow

### Development

```bash
# Install dependencies
npm install

# Watch for changes
npm run dev

# In another terminal, upload to HubSpot
hs watch pike/src pike
```

### Production

```bash
# Build optimized bundle
npm run build

# Upload to HubSpot
hs upload pike/src pike
```

## TypeScript Setup

### tsconfig.json

```json
{
  "compilerOptions": {
    "jsx": "react",
    "target": "ES2015",
    "module": "ESNext",
    "strict": true
  }
}
```

### Typed Component

```typescript
interface ModuleConfig {
  title: string;
  apiUrl?: string;
}

const MyModule: React.FC<{ config: ModuleConfig }> = ({ config }) => {
  return <h1>{config.title}</h1>;
};
```

## Testing

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
```

### Test Example

```javascript
import { render, screen } from '@testing-library/react';
import MyModule from './module';

test('renders title', () => {
  const config = { title: 'Test' };
  render(<MyModule config={config} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

## Common Pitfalls

### ❌ Bundling React

```javascript
// BAD - Creates huge bundle
module.exports = {
  // Missing externals
};

// GOOD - Uses global React
module.exports = {
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
};
```

### ❌ Hydration Mismatches

```javascript
// BAD - Different on server/client
const now = new Date().toISOString();

// GOOD - Consistent
const [now, setNow] = useState(null);
useEffect(() => setNow(new Date().toISOString()), []);
```

### ❌ Missing Cleanup

```javascript
// BAD - Memory leak
useEffect(() => {
  const interval = setInterval(doSomething, 1000);
}, []);

// GOOD - Cleanup
useEffect(() => {
  const interval = setInterval(doSomething, 1000);
  return () => clearInterval(interval);
}, []);
```

## Validation Checklist

Before deploying:

- [ ] HubL wrapper with data-react-module and data-config
- [ ] React component mounted on DOMContentLoaded
- [ ] Webpack configured with externals for React/ReactDOM
- [ ] Pike CSS variables used for styling
- [ ] fields.json includes settings and layout groups
- [ ] Loading and error states handled
- [ ] Components properly memoized
- [ ] Event listeners cleaned up in useEffect
- [ ] Build produces module.js in module directory
- [ ] Tested in HubSpot page editor

## Project Structure

```
my-react-module.module/
├── src/
│   ├── module.jsx          # React component source
│   ├── components/         # Sub-components
│   └── hooks/              # Custom hooks
├── module.html             # HubL wrapper
├── module.js               # Built React bundle
├── module.css              # Styles (optional)
├── fields.json             # Module fields
├── meta.json               # Module metadata
├── webpack.config.js       # Build config
├── package.json            # Dependencies
└── .babelrc                # Babel config
```

## Resources

- [React Documentation](https://react.dev)
- [HubSpot CMS CLI](https://developers.hubspot.com/docs/cms/developer-reference/cli-commands)
- [Webpack Documentation](https://webpack.js.org/)
- [React Testing Library](https://testing-library.com/react)

## Related Skills

- **hubspot-cms-developer** - For HubL-based (non-React) CMS modules
- **hubspot-crm-react** - For CRM UI Extensions (cards, settings)

---

**Note**: This skill is for **CMS React modules** (interactive content in pages/blogs). For CRM development, use `hubspot-crm-react`. For traditional HubL modules, use `hubspot-cms-developer`.
