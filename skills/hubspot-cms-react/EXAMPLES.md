# HubSpot CMS React Module Examples

Complete working examples of React modules for HubSpot CMS.

## Simple Counter Module

Interactive counter with increment/decrement buttons.

### module.html

```hubl
{# module base class name: react-counter #}

{# imports #}
{%- import '../../tools/snippets.html' as snippets -%}
{%- import '../../tools/css-helpers.html' as css_helpers -%}

{# shorthand vars #}
{%- set styles = module.styles -%}
{%- set layout = styles.layout -%}
{%- set visibility = styles.visibility -%}
{%- set module_id = module.settings.custom_id or 'reactCounter' ~ name|replace('module_','')|replace('widget_','') -%}

{# class names #}
{%- set module_classes = ['react-counter'] -%}
{%- do module_classes.append(module.settings.custom_classes) if module.settings.custom_classes -%}
{%- set module_classes = module_classes|join(' ') -%}

{# React mount point #}
<div 
  id="{{ module_id }}" 
  class="{{ module_classes }}"
  data-react-module="counter"
  data-config='{{ module|tojson }}'
></div>

{# Load React component #}
{{ require_js(get_asset_url('./module.js')) }}

{# user styles #}
{%- set user_styles = [] -%}
{%- do user_styles.append(layout.spacing.css) if layout.spacing.css -%}
{%- set user_styles = user_styles|join(';') -%}

{%- if user_styles -%}
{%- require_css -%}
<style>
{% scope_css %}
.react-counter {
  {{ user_styles }}
}
{% end_scope_css %}
</style>
{%- end_require_css -%}
{%- endif -%}

{# styles #}
{%- require_css -%}
<style>
{% scope_css %}
.react-counter {
  max-width: 400px;
  margin: 0 auto;
}
{% end_scope_css %}
</style>
{%- end_require_css -%}
```

### module.jsx

```javascript
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Counter = ({ config }) => {
  const [count, setCount] = useState(config.initial_value || 0);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(config.initial_value || 0);

  return (
    <div className="counter">
      <h2 className="counter__title">{config.title}</h2>
      
      <div className="counter__display">
        <span className="counter__value">{count}</span>
      </div>
      
      <div className="counter__controls">
        <button 
          onClick={decrement} 
          className="counter__button counter__button--decrement"
          aria-label="Decrement"
        >
          -
        </button>
        
        <button 
          onClick={reset} 
          className="counter__button counter__button--reset"
        >
          Reset
        </button>
        
        <button 
          onClick={increment} 
          className="counter__button counter__button--increment"
          aria-label="Increment"
        >
          +
        </button>
      </div>
    </div>
  );
};

// Mount React component
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-react-module="counter"]');
  
  containers.forEach(container => {
    const config = JSON.parse(container.dataset.config || '{}');
    
    ReactDOM.render(
      <Counter config={config} />,
      container
    );
  });
});
```

### module.css

```css
.counter {
  text-align: center;
  padding: var(--spacing-lg);
  background: var(--color-white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}

.counter__title {
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.counter__display {
  font-size: 48px;
  font-weight: bold;
  color: var(--color-primary);
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--border-radius);
}

.counter__controls {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
}

.counter__button {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 18px;
  border: none;
  border-radius: var(--border-radius);
  background: var(--color-primary);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
}

.counter__button:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.counter__button:active {
  transform: translateY(0);
}

.counter__button--reset {
  background: var(--color-secondary);
}

.counter__button--reset:hover {
  background: var(--color-secondary-dark);
}
```

### fields.json

```json
[
  {
    "name": "title",
    "label": "Title",
    "type": "text",
    "default": "Counter"
  },
  {
    "name": "initial_value",
    "label": "Initial value",
    "type": "number",
    "display": "text",
    "default": 0
  },
  {
    "name": "settings",
    "label": "Advanced settings",
    "children": [
      {
        "name": "custom_id",
        "label": "Custom ID",
        "type": "text"
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

## Data Fetching Module (API Integration)

Fetch and display data from external API.

### module.html

```hubl
{# module base class name: react-data-fetcher #}

{# shorthand vars #}
{%- set module_id = module.settings.custom_id or 'reactDataFetcher' ~ name|replace('module_','')|replace('widget_','') -%}

{# React mount point #}
<div 
  id="{{ module_id }}" 
  class="react-data-fetcher"
  data-react-module="data-fetcher"
  data-config='{{ module|tojson }}'
></div>

{# Load React component #}
{{ require_js(get_asset_url('./module.js')) }}
```

### module.jsx

```javascript
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// Custom hook for data fetching
const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Loading component
const LoadingSpinner = () => (
  <div className="data-fetcher__loading">
    <div className="spinner"></div>
    <p>Loading data...</p>
  </div>
);

// Error component
const ErrorMessage = ({ error }) => (
  <div className="data-fetcher__error">
    <h3>Error</h3>
    <p>{error}</p>
  </div>
);

// Empty state
const EmptyState = () => (
  <div className="data-fetcher__empty">
    <p>No data available</p>
  </div>
);

// Data display
const DataDisplay = ({ data, config }) => {
  const items = Array.isArray(data) ? data : data?.results || [];
  const limitedItems = items.slice(0, config.max_items || 10);

  return (
    <div className="data-fetcher__content">
      <h2>{config.title}</h2>
      {config.description && <p>{config.description}</p>}
      
      <div className="data-fetcher__items">
        {limitedItems.map((item, index) => (
          <div key={item.id || index} className="data-fetcher__item">
            <h3>{item.name || item.title}</h3>
            {item.description && <p>{item.description}</p>}
          </div>
        ))}
      </div>
      
      <p className="data-fetcher__count">
        Showing {limitedItems.length} of {items.length} items
      </p>
    </div>
  );
};

// Main component
const DataFetcher = ({ config }) => {
  const { data, loading, error } = useFetchData(config.api_url);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!data) {
    return <EmptyState />;
  }

  return <DataDisplay data={data} config={config} />;
};

// Mount
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-react-module="data-fetcher"]');
  
  containers.forEach(container => {
    const config = JSON.parse(container.dataset.config || '{}');
    
    ReactDOM.render(
      <DataFetcher config={config} />,
      container
    );
  });
});
```

### module.css

```css
.data-fetcher__loading {
  text-align: center;
  padding: var(--spacing-xl);
}

.spinner {
  border: 4px solid var(--color-background);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.data-fetcher__error {
  padding: var(--spacing-lg);
  background: #fee;
  border: 1px solid #fcc;
  border-radius: var(--border-radius);
  color: #c00;
}

.data-fetcher__empty {
  padding: var(--spacing-lg);
  text-align: center;
  color: var(--color-text-muted);
}

.data-fetcher__content h2 {
  margin-bottom: var(--spacing-md);
}

.data-fetcher__items {
  display: grid;
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.data-fetcher__item {
  padding: var(--spacing-md);
  background: var(--color-white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.data-fetcher__item h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.data-fetcher__count {
  text-align: center;
  color: var(--color-text-muted);
  font-size: 14px;
}
```

## Filterable List Module

Filter and search through items with React state.

### module.jsx

```javascript
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';

const FilterableList = ({ config }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const items = config.items || [];
  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || 
        item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  return (
    <div className="filterable-list">
      <h2>{config.title}</h2>
      
      <div className="filterable-list__filters">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filterable-list__search"
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filterable-list__category-select"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>
      
      <div className="filterable-list__results">
        {filteredItems.length === 0 ? (
          <p className="filterable-list__empty">No items found</p>
        ) : (
          <div className="filterable-list__items">
            {filteredItems.map((item, index) => (
              <div key={index} className="filterable-list__item">
                <h3>{item.title}</h3>
                {item.category && (
                  <span className="filterable-list__category-badge">
                    {item.category}
                  </span>
                )}
                {item.description && <p>{item.description}</p>}
              </div>
            ))}
          </div>
        )}
        
        <p className="filterable-list__count">
          Showing {filteredItems.length} of {items.length} items
        </p>
      </div>
    </div>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-react-module="filterable-list"]');
  
  containers.forEach(container => {
    const config = JSON.parse(container.dataset.config || '{}');
    
    ReactDOM.render(
      <FilterableList config={config} />,
      container
    );
  });
});
```

## Tabs Module

Interactive tabbed interface with React.

### module.jsx

```javascript
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Tabs = ({ config }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = config.tabs || [];

  if (tabs.length === 0) {
    return <p>No tabs configured</p>;
  }

  return (
    <div className="tabs">
      {config.title && <h2 className="tabs__title">{config.title}</h2>}
      
      <div className="tabs__nav" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`tab-panel-${index}`}
            className={`tabs__button ${activeTab === index ? 'tabs__button--active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="tabs__content">
        {tabs.map((tab, index) => (
          <div
            key={index}
            id={`tab-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`tab-${index}`}
            className={`tabs__panel ${activeTab === index ? 'tabs__panel--active' : ''}`}
            hidden={activeTab !== index}
          >
            <h3>{tab.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: tab.content }} />
          </div>
        ))}
      </div>
    </div>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-react-module="tabs"]');
  
  containers.forEach(container => {
    const config = JSON.parse(container.dataset.config || '{}');
    
    ReactDOM.render(
      <Tabs config={config} />,
      container
    );
  });
});
```

### module.css

```css
.tabs__nav {
  display: flex;
  gap: var(--spacing-xs);
  border-bottom: 2px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
}

.tabs__button {
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  color: var(--color-text-muted);
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: -2px;
}

.tabs__button:hover {
  color: var(--color-primary);
}

.tabs__button--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tabs__panel {
  display: none;
}

.tabs__panel--active {
  display: block;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Form with Validation

Interactive form with React state and validation.

### module.jsx

```javascript
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const ContactForm = ({ config }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Submit to HubSpot form or external API
      const response = await fetch(config.submit_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact-form__success">
        <h3>{config.success_title || 'Thank you!'}</h3>
        <p>{config.success_message || 'Your message has been sent.'}</p>
        <button onClick={() => setSubmitted(false)}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="contact-form">
      <h2>{config.title || 'Contact Us'}</h2>
      
      <form onSubmit={handleSubmit} className="contact-form__form">
        <div className="contact-form__field">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'contact-form__input--error' : ''}
          />
          {errors.name && (
            <span className="contact-form__error">{errors.name}</span>
          )}
        </div>
        
        <div className="contact-form__field">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'contact-form__input--error' : ''}
          />
          {errors.email && (
            <span className="contact-form__error">{errors.email}</span>
          )}
        </div>
        
        <div className="contact-form__field">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? 'contact-form__input--error' : ''}
          />
          {errors.message && (
            <span className="contact-form__error">{errors.message}</span>
          )}
        </div>
        
        {errors.submit && (
          <div className="contact-form__error">{errors.submit}</div>
        )}
        
        <button 
          type="submit" 
          disabled={submitting}
          className="contact-form__submit"
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-react-module="contact-form"]');
  
  containers.forEach(container => {
    const config = JSON.parse(container.dataset.config || '{}');
    
    ReactDOM.render(
      <ContactForm config={config} />,
      container
    );
  });
});
```

## Build Configuration Examples

### webpack.config.js

```javascript
const path = require('path');

module.exports = {
  entry: './src/module.jsx',
  output: {
    path: path.resolve(__dirname),
    filename: 'module.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  devtool: 'source-map'
};
```

### package.json

```json
{
  "name": "hubspot-react-module",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0",
    "@babel/preset-react": "^7.22.0",
    "babel-loader": "^9.1.3",
    "css-loader": "^6.8.1",
    "style-loader": "^3.3.3",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### .babelrc

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```

## Best Practices Demonstrated

1. **Island architecture** - HubL wrapper with React mount point
2. **Config via data attributes** - Pass module config as JSON
3. **Custom hooks** - Extract reusable logic (useFetchData)
4. **Component composition** - Small, focused components
5. **Memoization** - useMemo for filtered/sorted data
6. **Error boundaries** - Graceful error handling
7. **Loading states** - Show feedback during async operations
8. **Form validation** - Client-side validation with error messages
9. **Accessibility** - ARIA attributes for tabs
10. **Pike integration** - Use CSS custom properties
11. **External React/ReactDOM** - Don't bundle, use externals
12. **Clean mounting** - Query selector with proper cleanup
