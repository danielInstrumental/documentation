---
name: hubspot-crm-react
description: Develop React components for HubSpot CRM using senior-level patterns and best practices. Use when building HubSpot UI extensions, CRM cards, settings pages, or any React component within the HubSpot Projects framework. Covers @hubspot/ui-extensions, hubspot.fetch API, component architecture, and common pitfalls.
---

# HubSpot CRM React Developer

Expert guidance for building production-quality React components in the HubSpot CRM environment (UI Extensions for cards, settings pages, and app extensions).

## Core Constraints

### Environment Limitations

**No `window` object access** in cards and settings components:
- ❌ `window.fetch`, `window.localStorage`, `window.location`
- ✅ Use `hubspot.fetch` from `@hubspot/ui-extensions`
- ✅ Use HubSpot's state management hooks

**Component library restrictions**:
- Only use components from `@hubspot/ui-extensions`
- Style props (`style={{}}`) are NOT supported
- Settings components cannot use `@hubspot/ui-extensions/crm` components

### Critical API Requirements

**`hubspot.fetch` API rules**:
```typescript
// ❌ BAD - Relative paths don't work
hubspot.fetch('/api/endpoint')

// ❌ BAD - localhost not allowed
hubspot.fetch('http://localhost:3000/api')

// ✅ GOOD - Fully qualified HTTPS URL
hubspot.fetch('https://api.example.com/endpoint')
```

**All fetch URLs must be declared** in `app/*-hsmeta.json`:
```json
{
  "config": {
    "permittedUrls": {
      "fetch": ["https://api.example.com", "https://api.hubapi.com"]
    }
  }
}
```

**Local development proxy**: Use `local.json` (in same directory as app's `-hsmeta.json`) to proxy HTTPS URLs to localhost:
```json
{
  "proxy": {
    "https://api.example.com": "http://localhost:8080"
  }
}
```

## Senior React Patterns

### Component Architecture

**Composition over configuration**:
```typescript
// ✅ GOOD - Composable, flexible
export const Card = ({ children }) => (
  <Flex direction="column" gap="md">
    {children}
  </Flex>
);

// Use it
<Card>
  <CardHeader title={title} />
  <CardBody>{content}</CardBody>
  <CardActions>{actions}</CardActions>
</Card>

// ❌ AVOID - Prop explosion
<Card 
  title={title} 
  content={content} 
  actions={actions}
  showHeader={true}
  headerStyle="bold"
  // ... 15 more props
/>
```

### Custom Hooks for Logic Extraction

**Extract complex logic** into reusable hooks:
```typescript
// hooks/useCRMData.ts
export const useCRMData = (objectType: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await hubspot.fetch(
          `https://api.hubapi.com/crm/v3/objects/${objectType}`
        );
        setData(await response.json());
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [objectType]);

  return { data, loading, error };
};

// Component
const ContactsCard = () => {
  const { data, loading, error } = useCRMData('contacts');
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error.message} />;
  
  return <ContactsList contacts={data} />;
};
```

### Memoization for Performance

**Use React.memo for expensive renders**:
```typescript
// Heavy component that doesn't need frequent re-renders
export const DataTable = React.memo(({ rows, columns }) => {
  return (
    <Table>
      {rows.map(row => (
        <TableRow key={row.id} columns={columns} data={row} />
      ))}
    </Table>
  );
}, (prev, next) => {
  // Custom comparison for performance
  return prev.rows.length === next.rows.length &&
         prev.columns.length === next.columns.length;
});
```

**useMemo for expensive computations**:
```typescript
const filteredAndSortedData = useMemo(() => {
  return data
    .filter(item => item.active)
    .sort((a, b) => a.name.localeCompare(b.name));
}, [data]); // Only recompute when data changes
```

### Error Boundaries

**Wrap components** in error boundaries for resilience:
```typescript
import { ErrorBoundary } from '@hubspot/ui-extensions';

export const MyCard = () => (
  <ErrorBoundary fallback={<ErrorState />}>
    <CardContent />
  </ErrorBoundary>
);
```

## Project Structure

### Component Organization

```
app/
├── cards/
│   ├── dashboard-card/
│   │   ├── DashboardCard.tsx
│   │   ├── card-hsmeta.json
│   │   └── components/
│   │       ├── Header.tsx
│   │       ├── MetricCard.tsx
│   │       └── Chart.tsx
│   └── analytics-card/
│       └── ...
├── settings/
│   ├── Settings.tsx
│   └── settings-hsmeta.json
└── app-hsmeta.json
```

### File Naming Conventions

- Component files: `PascalCase.tsx` (e.g., `ContactsList.tsx`)
- Config files: `kebab-case-hsmeta.json` (e.g., `dashboard-card-hsmeta.json`)
- Hooks: `camelCase.ts` prefixed with `use` (e.g., `useCRMData.ts`)
- Utilities: `camelCase.ts` (e.g., `formatters.ts`)

## Configuration

### Component Config (`-hsmeta.json`)

**Key fields**:
```json
{
  "uid": "unique-id-across-project",
  "type": "card",
  "config": {
    "title": "Card Title",
    "permittedUrls": {
      "fetch": ["https://api.example.com"],
      "iframe": [],
      "img": []
    }
  }
}
```

**Component directory restrictions**:
- `card`: Must be in `app/cards/`
- `settings`: Must be in `app/settings/`
- `app-function`: Must be in `app/functions/`
- `app-event`: Must be in `app/app-events/`
- `workflow-action`: Must be in `app/workflow-actions/`

## Development Workflow

### Local Development Server

**Start dev server** for hot reloading:
```bash
hs project dev
```

- Automatically refreshes on JSX file saves
- Shows "Developing locally" tag on UI extensions
- Required for testing cards and settings pages

**Enable request signing** (for secure backend testing):
```bash
CLIENT_SECRET="your-secret" hs project dev
```

### Upload and Deploy

```bash
# Upload project (creates build automatically)
hs project upload

# Deploy specific build
hs project deploy <buildNumber>

# List all builds
hs project list-builds
```

## Common Patterns

### Data Fetching

**Fetch with loading states**:
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await hubspot.fetch('https://api.example.com/data');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

### Form Handling

```typescript
import { Form, Input, Button } from '@hubspot/ui-extensions';

const SettingsForm = () => {
  const [formData, setFormData] = useState({
    apiKey: '',
    enabled: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await hubspot.fetch('https://api.example.com/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        label="API Key"
        value={formData.apiKey}
        onChange={(value) => setFormData({ ...formData, apiKey: value })}
      />
      <Button type="submit">Save</Button>
    </Form>
  );
};
```

### Conditional Rendering

**Early returns for clarity**:
```typescript
const ContactCard = ({ contactId }) => {
  const { data, loading, error } = useCRMData('contacts', contactId);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Alert variant="error">{error.message}</Alert>;
  }

  if (!data) {
    return <EmptyState message="No contact found" />;
  }

  return <ContactDetails contact={data} />;
};
```

## TypeScript Best Practices

### Strict Typing

```typescript
// Define clear interfaces
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  properties?: Record<string, unknown>;
}

interface ContactCardProps {
  contactId: string;
  onUpdate?: (contact: Contact) => void;
}

// Use them
const ContactCard: React.FC<ContactCardProps> = ({ 
  contactId, 
  onUpdate 
}) => {
  // Implementation
};
```

### Generic Hooks

```typescript
function useAPI<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    hubspot.fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Usage with type inference
const { data } = useAPI<Contact[]>('https://api.example.com/contacts');
```

## Performance Optimization

### Lazy Loading

```typescript
import React, { Suspense, lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export const Card = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <HeavyComponent />
  </Suspense>
);
```

### Debouncing User Input

```typescript
import { useState, useEffect } from 'react';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Usage in search
const SearchCard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      // API call with debounced value
    }
  }, [debouncedSearch]);

  return <Input value={searchTerm} onChange={setSearchTerm} />;
};
```

## Common Pitfalls

### ❌ Using Unsupported APIs

```typescript
// ❌ These will fail
window.localStorage.setItem('key', 'value');
document.querySelector('.element');
fetch('/relative/path');

// ✅ Use HubSpot-provided alternatives
// Store in CRM properties or use backend
// Use HubSpot components declaratively
hubspot.fetch('https://full.domain.com/path');
```

### ❌ Forgetting to Declare URLs

```typescript
// Component will fail at runtime
await hubspot.fetch('https://api.newservice.com/data');

// ✅ First add to app-hsmeta.json:
// "permittedUrls": {
//   "fetch": ["https://api.newservice.com"]
// }
```

### ❌ Nested Component Directories

```typescript
// ❌ NOT allowed
app/cards/dashboard/sub-folder/card-hsmeta.json

// ✅ Flat structure only
app/cards/dashboard/card-hsmeta.json
```

### ❌ Non-unique UIDs

```json
// Each -hsmeta.json needs unique uid across entire project
{
  "uid": "dashboard-card-v1"  // Must be unique
}
```

## Validation and Debugging

### Validate Project Configuration

```bash
hs project validate
```

### View Build Logs

```bash
# List builds to find build ID
hs project list-builds

# View logs for specific build
hs project logs --build <buildNumber>
```

### Check Function Logs

```bash
hs cms function logs <functionPath>
```

## Resources

- [HubSpot UI Extensions Components](https://developers.hubspot.com/docs/platform/ui-extensions-sdk)
- [Example Components Repository](https://github.com/HubSpot/hubspot-project-components)
- [HubSpot CLI Reference](https://developers.hubspot.com/docs/cms/developer-reference/cli-commands)
- [React Best Practices](https://react.dev/learn)

## Quick Reference

**Start local dev**: `hs project dev`  
**Upload project**: `hs project upload`  
**Deploy build**: `hs project deploy`  
**Validate config**: `hs project validate`  
**View logs**: `hs project logs`

**Import components**: `import { Component } from '@hubspot/ui-extensions'`  
**Fetch data**: `hubspot.fetch('https://...')`  
**Local proxy**: Create `local.json` in app directory  
**Declare URLs**: Add to `permittedUrls.fetch` in app-hsmeta.json
