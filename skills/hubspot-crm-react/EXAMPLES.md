# HubSpot CMS React Examples

Complete examples for common HubSpot React development scenarios.

## Complete Card Example

A production-ready CRM card with data fetching, error handling, and loading states.

### DashboardCard.tsx

```typescript
import React, { useState, useEffect } from 'react';
import {
  Flex,
  Text,
  LoadingSpinner,
  Alert,
  Divider,
  Button,
  ErrorBoundary
} from '@hubspot/ui-extensions';
import { useCRMData } from './hooks/useCRMData';
import { MetricCard } from './components/MetricCard';
import { formatNumber } from './utils/formatters';

interface DashboardMetrics {
  totalContacts: number;
  activeDeals: number;
  revenue: number;
  conversionRate: number;
}

export const DashboardCard = () => {
  const { data, loading, error, refetch } = useCRMData<DashboardMetrics>(
    'https://api.example.com/metrics'
  );

  if (loading) {
    return (
      <Flex direction="column" align="center" gap="md">
        <LoadingSpinner />
        <Text>Loading dashboard metrics...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Failed to load metrics">
        {error.message}
        <Button onClick={refetch}>Retry</Button>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert variant="warning" title="No data available">
        Dashboard metrics are not available at this time.
      </Alert>
    );
  }

  return (
    <ErrorBoundary fallback={<Alert variant="error">Something went wrong</Alert>}>
      <Flex direction="column" gap="md">
        <Text variant="microcopy">Dashboard Overview</Text>
        
        <Flex direction="row" gap="md" wrap="wrap">
          <MetricCard
            label="Total Contacts"
            value={formatNumber(data.totalContacts)}
            variant="primary"
          />
          <MetricCard
            label="Active Deals"
            value={formatNumber(data.activeDeals)}
            variant="success"
          />
          <MetricCard
            label="Revenue"
            value={`$${formatNumber(data.revenue)}`}
            variant="info"
          />
          <MetricCard
            label="Conversion Rate"
            value={`${data.conversionRate}%`}
            variant="default"
          />
        </Flex>
        
        <Divider />
        
        <Flex direction="row" justify="end">
          <Button onClick={refetch}>Refresh</Button>
        </Flex>
      </Flex>
    </ErrorBoundary>
  );
};
```

### hooks/useCRMData.ts

```typescript
import { useState, useEffect, useCallback } from 'react';
import { hubspot } from '@hubspot/ui-extensions';

interface UseCRMDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCRMData<T>(url: string): UseCRMDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await hubspot.fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
```

### components/MetricCard.tsx

```typescript
import React from 'react';
import { Flex, Text, Box } from '@hubspot/ui-extensions';

interface MetricCardProps {
  label: string;
  value: string | number;
  variant?: 'primary' | 'success' | 'info' | 'default';
}

export const MetricCard: React.FC<MetricCardProps> = React.memo(({ 
  label, 
  value, 
  variant = 'default' 
}) => {
  return (
    <Box>
      <Flex direction="column" gap="xs">
        <Text variant="microcopy">{label}</Text>
        <Text format={{ fontWeight: 'bold' }}>{value}</Text>
      </Flex>
    </Box>
  );
});
```

### dashboard-card-hsmeta.json

```json
{
  "uid": "dashboard-card",
  "type": "card",
  "config": {
    "title": "Dashboard Metrics",
    "permittedUrls": {
      "fetch": ["https://api.example.com"]
    },
    "locations": ["crm.record.deal"]
  }
}
```

## Settings Page Example

A complete settings page with form handling and validation.

### Settings.tsx

```typescript
import React, { useState, useEffect } from 'react';
import {
  Flex,
  Form,
  Input,
  Toggle,
  Select,
  Button,
  Alert,
  Text,
  Divider
} from '@hubspot/ui-extensions';
import { hubspot } from '@hubspot/ui-extensions';

interface SettingsData {
  apiKey: string;
  enabled: boolean;
  refreshInterval: string;
  notificationsEnabled: boolean;
}

const REFRESH_INTERVALS = [
  { value: '5', label: '5 minutes' },
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' }
];

export const Settings = () => {
  const [formData, setFormData] = useState<SettingsData>({
    apiKey: '',
    enabled: false,
    refreshInterval: '15',
    notificationsEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Load existing settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await hubspot.fetch('https://api.example.com/settings');
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to load settings'
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await hubspot.fetch('https://api.example.com/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setMessage({
        type: 'success',
        text: 'Settings saved successfully!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save settings'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <Flex direction="column" align="center" gap="md">
        <Text>Loading settings...</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="lg">
      <Text variant="microcopy">
        Configure your integration settings
      </Text>

      {message && (
        <Alert variant={message.type} title={message.text} />
      )}

      <Form onSubmit={handleSubmit}>
        <Flex direction="column" gap="md">
          <Input
            label="API Key"
            name="apiKey"
            description="Your API key from the external service"
            value={formData.apiKey}
            onChange={(value) => updateFormData('apiKey', value)}
            required
          />

          <Toggle
            label="Enable Integration"
            name="enabled"
            checked={formData.enabled}
            onChange={(checked) => updateFormData('enabled', checked)}
          />

          {formData.enabled && (
            <>
              <Select
                label="Refresh Interval"
                name="refreshInterval"
                description="How often to sync data"
                value={formData.refreshInterval}
                onChange={(value) => updateFormData('refreshInterval', value)}
                options={REFRESH_INTERVALS}
              />

              <Toggle
                label="Enable Notifications"
                name="notificationsEnabled"
                checked={formData.notificationsEnabled}
                onChange={(checked) => updateFormData('notificationsEnabled', checked)}
              />
            </>
          )}

          <Divider />

          <Flex direction="row" justify="end" gap="sm">
            <Button
              type="button"
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving || !formData.apiKey}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </Flex>
        </Flex>
      </Form>
    </Flex>
  );
};
```

### settings-hsmeta.json

```json
{
  "uid": "app-settings",
  "type": "settings",
  "config": {
    "permittedUrls": {
      "fetch": ["https://api.example.com"]
    }
  }
}
```

## Data Table with Sorting and Filtering

```typescript
import React, { useState, useMemo } from 'react';
import {
  Flex,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Input,
  Select,
  Text
} from '@hubspot/ui-extensions';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  status: 'active' | 'inactive';
}

interface ContactTableProps {
  contacts: Contact[];
}

type SortField = keyof Contact;
type SortDirection = 'asc' | 'desc';

export const ContactTable: React.FC<ContactTableProps> = ({ contacts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('lastName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedContacts = useMemo(() => {
    let result = [...contacts];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(contact =>
        contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(contact => contact.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;

      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return 1 * modifier;
      return 0;
    });

    return result;
  }, [contacts, searchTerm, statusFilter, sortField, sortDirection]);

  return (
    <Flex direction="column" gap="md">
      <Flex direction="row" gap="md">
        <Input
          label="Search"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        
        <Select
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
          ]}
        />
      </Flex>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader onClick={() => handleSort('firstName')}>
              First Name {sortField === 'firstName' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHeader>
            <TableHeader onClick={() => handleSort('lastName')}>
              Last Name {sortField === 'lastName' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHeader>
            <TableHeader onClick={() => handleSort('email')}>
              Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHeader>
            <TableHeader onClick={() => handleSort('company')}>
              Company {sortField === 'company' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHeader>
            <TableHeader onClick={() => handleSort('status')}>
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAndSortedContacts.map(contact => (
            <TableRow key={contact.id}>
              <TableCell>{contact.firstName}</TableCell>
              <TableCell>{contact.lastName}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.company}</TableCell>
              <TableCell>
                <Text>{contact.status}</Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Text variant="microcopy">
        Showing {filteredAndSortedContacts.length} of {contacts.length} contacts
      </Text>
    </Flex>
  );
};
```

## Pagination Hook

```typescript
import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
}

interface UsePaginationResult<T> {
  currentItems: T[];
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export function usePagination<T>({
  items,
  itemsPerPage = 10
}: UsePaginationProps<T>): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  return {
    currentItems,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1
  };
}

// Usage
const ContactList = ({ contacts }) => {
  const {
    currentItems,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev
  } = usePagination({ items: contacts, itemsPerPage: 20 });

  return (
    <Flex direction="column" gap="md">
      <ContactTable contacts={currentItems} />
      
      <Flex direction="row" justify="between" align="center">
        <Button onClick={prevPage} disabled={!canGoPrev}>
          Previous
        </Button>
        <Text>Page {currentPage} of {totalPages}</Text>
        <Button onClick={nextPage} disabled={!canGoNext}>
          Next
        </Button>
      </Flex>
    </Flex>
  );
};
```

## Context Provider Pattern

```typescript
// contexts/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextValue {
  userId: string | null;
  setUserId: (id: string) => void;
  settings: Record<string, unknown>;
  updateSettings: (settings: Record<string, unknown>) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, unknown>>({});

  const updateSettings = (newSettings: Record<string, unknown>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider
      value={{ userId, setUserId, settings, updateSettings }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Usage in card
export const MyCard = () => (
  <AppProvider>
    <CardContent />
  </AppProvider>
);

const CardContent = () => {
  const { userId, setUserId } = useApp();
  
  // Use context values
  return <Text>User ID: {userId}</Text>;
};
```

## Utilities

### formatters.ts

```typescript
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(d);
};

export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};
```

### validators.ts

```typescript
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};
```
