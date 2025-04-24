# Adobe Express Add-on Coding Rules

## General Principles

### Add-on Architecture
Adobe Express add-ons have two key components:
- The iframe UI (HTML, CSS, JS) running in the browser context
- The Document Sandbox (for Document API access) running in a separate JavaScript environment

These components must communicate via the appropriate APIs:
- In iframe UI: use the Add-on UI SDK (addOnUISdk)
- In Document Sandbox: use the Document API (express-document-sdk)
- For communication between them: use runtime.exposeApi() and runtime.apiProxy()

### Import Statements
Use the correct import statements:
- For Add-on UI SDK: `import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js"`
- For Document API: `import { editor, ... } from "express-document-sdk"`
- For Document Sandbox: `import addOnSandboxSdk from "add-on-sdk-document-sandbox"`

### SDK Initialization
Always initialize the SDK properly before using it:

```javascript
addOnUISdk.ready.then(() => {
  // Your code here
});

// OR using async/await:

async function initializeAddon() {
  await addOnUISdk.ready;
  // Your code here
}
```

## Add-on UI SDK (AddOnUISDK)

### Document Manipulation
Use the appropriate methods to add content to the document:
- addOnUISdk.app.document.addImage(blob, options) - Add images
- addOnUISdk.app.document.addText(text, options) - Add text
- addOnUISdk.app.document.addAudio(blob, options) - Add audio
- addOnUISdk.app.document.addVideo(blob, options) - Add video

Example:
```javascript
const imageBlob = await fetch(imageUrl).then(r => r.blob());
await addOnUISdk.app.document.addImage(imageBlob, {
  title: "My Image",
  author: "Author Name"
});
```

### Client Storage
Use clientStorage for persistent data (up to 10MB per add-on):
- addOnUISdk.instance.clientStorage.setItem(key, value)
- addOnUISdk.instance.clientStorage.getItem(key)
- addOnUISdk.instance.clientStorage.removeItem(key)
- addOnUISdk.instance.clientStorage.keys()
- addOnUISdk.instance.clientStorage.clear()

Supports: strings, objects, arrays, numbers, booleans, null, undefined, and Uint8Array.

Example:
```javascript
await addOnUISdk.instance.clientStorage.setItem("settings", { theme: "light" });
const settings = await addOnUISdk.instance.clientStorage.getItem("settings");
```

### Modal Dialogs
For modal dialogs:
1. Call showModalDialog with size and URL parameters
2. In the dialog, use addOnUISdk.instance.runtime.dialog.close(result) to return data
3. Handle the result with the Promise from showModalDialog

Example:
```javascript
// Main add-on code
const result = await addOnUISdk.app.showModalDialog({
  variant: "custom",
  size: { width: 600, height: 400 },
  url: "dialog.html"
});

// In dialog.html
submitButton.addEventListener("click", () => {
  addOnUISdk.instance.runtime.dialog.close({ selected: value });
});
```

## Document APIs

### Document API Editor Access
The Document API provides access through the 'editor' object. Use it to:
- Access the current document (editor.context)
- Create shapes (editor.createRectangle(), editor.createEllipse(), etc.)
- Create text (editor.createText())
- Create fills/strokes (editor.makeColorFill(), editor.makeStroke())

Example:
```javascript
const rectangle = editor.createRectangle();
rectangle.width = 200;
rectangle.height = 150;
rectangle.fill = editor.makeColorFill(colorUtils.fromRGB(1, 0, 0)); // Red fill
```

### Document Model Manipulation
When adding elements to the document:
1. Create the element using editor methods
2. Configure the element's properties
3. Append it to a parent's children collection

Example:
```javascript
const insertionParent = editor.context.insertionParent;
const rectangle = editor.createRectangle();
rectangle.width = 200;
rectangle.height = 100;
rectangle.translation = { x: 50, y: 50 };
rectangle.fill = editor.makeColorFill(colorUtils.fromRGB(0.8, 0.2, 0.2));
insertionParent.children.append(rectangle);
```

### Color Handling
Use colorUtils for working with colors:
- colorUtils.fromRGB(red, green, blue, [alpha]) - values from 0 to 1
- colorUtils.fromHex(hexValue) 

Example:
```javascript
// Red color with 80% opacity
const redColor = colorUtils.fromRGB(1, 0, 0, 0.8);

// Create a fill with the color
const fill = editor.makeColorFill(redColor);
```

### Important Notes
- Don't confuse the `addOnSdk.app.document` as being part of the Document Sandbox - Document API. Be very clear and specific in which reference is used, between the AddOnUISDK from the iframe side vs the Document APIs from the Document Sandbox Runtime, which are used in the code.js of the add-on.
- The Editor class is the main entry point for using the Document APIs.
- `Constants` are now `constants` (lowercase), and their enumerations have changed (e.g., `BlendModeValue` is now `BlendMode`).
- `translateX` and `translateY` have been replaced with the `translation` property (e.g., `rectangle.translation = { x: 100, y: 50 }`).


## Communication Between iframe and Document Sandbox

### Runtime Communication
For iframe and Document Sandbox communication:

In Document Sandbox (code.js):
```javascript
addOnSandboxSdk.ready.then(() => {
  addOnSandboxSdk.instance.runtime.exposeApi({
    method1: () => { /* implementation */ },
    method2: (param) => { /* implementation */ }
  });
});
```

In iframe UI (index.js):
```javascript
const sandboxProxy = await addOnUISdk.instance.runtime.apiProxy("documentSandbox");
const result = await sandboxProxy.method1();
```

## UI and Design

### Spectrum Design System
Use Spectrum Web Components for UI elements:
1. Import components from @spectrum-web-components
2. Use sp-button, sp-slider, sp-dropdown, etc.
3. Wrap your app with <sp-theme> component
4. Prefer the accent variant for buttons, and use the "express" and "light" theme options.

Example:
```html
<sp-theme system="express" scale="medium" color="light">
  <sp-button variant="accent">Click Me</sp-button>
</sp-theme>
```

For Lit applications:
```javascript
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/button/sp-button.js';
```

### Panel Width
Adobe Express add-on panels have a fixed width of 320px.

Design your UI to work within this constraint:
- Use responsive layouts that work within 320px width
- Apply 24px padding on the body's sides (giving 272px of content space)
- Use 16px spacing between internal elements

Follow Spectrum design guidelines for spacing and layout.

## React and swc-react

### Installing swc-react

For React-based add-ons, favor the `swc-react` library instead of using Spectrum Web Components directly or using React Spectrum. The `swc-react` library provides React wrapper components around Spectrum Web Components.

```bash
# Install a swc-react component (example for button)
npm install --save @swc-react/button

# Each component needs to be installed separately
npm install --save @swc-react/theme
npm install --save @swc-react/field-label
npm install --save @swc-react/textfield
# etc.
```

### Using swc-react with React

Import and use the components as regular React components:

```jsx
import React, { useState } from 'react';
import { Button } from '@swc-react/button';
import { Theme } from '@swc-react/theme';
import { TextField } from '@swc-react/textfield';
import { FieldLabel } from '@swc-react/field-label';

// Import necessary theme styles
import '@swc-react/theme/express/theme-light.js';
import '@swc-react/theme/express/scale-medium.js';

function MyComponent() {
  const [value, setValue] = useState('');
  
  return (
    <Theme theme="express" scale="medium" color="light">
      <div className="form-container">
        <FieldLabel for="name-field" required>Enter your name</FieldLabel>
        <TextField 
          id="name-field"
          value={value}
          onInput={(e) => setValue(e.target.value)}
        />
        <Button variant="accent" onClick={() => console.log(value)}>
          Submit
        </Button>
      </div>
    </Theme>
  );
}
```

### Theming Requirements

Always wrap your components with the `Theme` component from `@swc-react/theme` and import the necessary theme styles:

```jsx
import React from 'react';
import { Theme } from '@swc-react/theme';

// Import theme styles
import '@swc-react/theme/express/theme-light.js';
import '@swc-react/theme/express/scale-medium.js';

function App() {
  return (
    <Theme system="express" scale="medium" color="light">
      {/* Your app components */}
    </Theme>
  );
}
```

#### Theme Options

- `system`: Use `"express"` for Adobe Express theme
- `color`: `"light"` or `"dark"`
- `scale`: `"medium"` or `"large"`

### Type Definitions

Each React wrapper component re-exports the underlying SWC component's type definition:

```jsx
import { Button, ButtonType } from '@swc-react/button';
import { useState, useRef } from 'react';

function TypedComponent() {
  const [count, setCount] = useState(0);
  const btnRef = useRef<ButtonType>(null);
  
  return (
    <Button
      variant="accent"
      ref={btnRef}
      onClick={(e) => {
        console.log(e.currentTarget.variant); // Properly typed
        setCount((count) => count + 1);
      }}
    >
      Count is {count}
    </Button>
  );
}
```

### Project Structure for React Add-ons

Organize React files for maintainability and readability:

```
src/
├── components/             # UI Components
│   ├── common/             # Shared components
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   └── features/           # Feature-specific components
│       ├── ImageUploader/
│       │   ├── ImageGrid.jsx
│       │   ├── ImageItem.jsx
│       │   └── UploadButton.jsx
│       └── Settings/
│           ├── SettingsPanel.jsx
│           └── PreferenceToggle.jsx
├── hooks/                  # Custom React hooks
│   ├── useAddOnSDK.js      # Hook for Add-on SDK access
│   ├── useDocumentSandbox.js # Hook for Document Sandbox communication
│   └── useLocalStorage.js  # Hook for client storage
├── services/               # Service functions
│   ├── documentAPI.js      # Document API service
│   └── apiService.js       # External API service
├── utils/                  # Utility functions
│   ├── colorUtils.js
│   └── validators.js
├── App.jsx                 # Main app component
└── index.jsx               # Entry point
```

### Custom Hooks for Add-on SDK

Create custom hooks to encapsulate Add-on SDK functionality:

```jsx
// hooks/useAddOnSDK.js
import { useState, useEffect } from 'react';

export function useAddOnSDK() {
  const [sdk, setSDK] = useState(null);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Import the SDK dynamically
    import('https://new.express.adobe.com/static/add-on-sdk/sdk.js')
      .then((module) => {
        const addOnUISdk = module.default;
        addOnUISdk.ready.then(() => {
          setSDK(addOnUISdk);
          setIsReady(true);
        });
      })
      .catch(error => {
        console.error('Failed to load Add-on SDK:', error);
      });
  }, []);
  
  return { sdk, isReady };
}

// Usage
function MyComponent() {
  const { sdk, isReady } = useAddOnSDK();
  
  if (!isReady) {
    return <div>Loading SDK...</div>;
  }
  
  return <div>SDK is ready!</div>;
}
```

### Document Sandbox Communication Hook

```jsx
// hooks/useDocumentSandbox.js
import { useState, useEffect } from 'react';
import { useAddOnSDK } from './useAddOnSDK';

export function useDocumentSandbox() {
  const { sdk, isReady } = useAddOnSDK();
  const [sandboxProxy, setSandboxProxy] = useState(null);
  const [isSandboxReady, setIsSandboxReady] = useState(false);
  
  useEffect(() => {
    async function initSandbox() {
      if (isReady && sdk) {
        try {
          const proxy = await sdk.instance.runtime.apiProxy('documentSandbox');
          setSandboxProxy(proxy);
          setIsSandboxReady(true);
        } catch (error) {
          console.error('Failed to initialize sandbox proxy:', error);
        }
      }
    }
    
    initSandbox();
  }, [isReady, sdk]);
  
  return { sandboxProxy, isSandboxReady };
}
```

### State Management Patterns

For simple add-ons, React's built-in state management is sufficient:

```jsx
import React, { useState, useReducer, createContext, useContext } from 'react';

// For component-local state
function SimpleComponent() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)}>Toggle</Button>
      {isOpen && <div>Content</div>}
    </div>
  );
}

// For complex state logic, use useReducer
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    default:
      return state;
  }
}

function ComplexComponent() {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  
  return (
    <div>
      <Button onClick={() => dispatch({
        type: 'ADD_ITEM',
        payload: { id: Date.now(), name: 'New Item' }
      })}>
        Add Item
      </Button>
      <ul>
        {state.items.map(item => (
          <li key={item.id}>
            {item.name}
            <Button
              onClick={() => dispatch({
                type: 'REMOVE_ITEM',
                payload: item.id
              })}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// For application-wide state, use Context API
const AppContext = createContext();

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

function ChildComponent() {
  const { state, dispatch } = useContext(AppContext);
  // Use state and dispatch
}
```

### Component Composition

Break down complex UI into smaller, reusable components:

```jsx
// components/ImageUploader/index.jsx
import React from 'react';
import { UploadButton } from './UploadButton';
import { ImageGrid } from './ImageGrid';
import { Heading } from '@swc-react/heading';
import { Divider } from '@swc-react/divider';

function ImageUploader({ onSelect }) {
  // Implementation
  return (
    <div>
      <Heading level={2}>Image Library</Heading>
      <UploadButton />
      <Divider size="s" />
      <ImageGrid onSelect={onSelect} />
    </div>
  );
}

// components/ImageUploader/ImageGrid.jsx
import React from 'react';
import { ImageItem } from './ImageItem';

function ImageGrid({ images, onSelect }) {
  return (
    <div className="image-grid">
      {images.map(image => (
        <ImageItem 
          key={image.id}
          image={image}
          onSelect={() => onSelect(image)}
        />
      ))}
    </div>
  );
}
```

### Drag and Drop Implementation

Implement drag and drop with the Add-on SDK:

```jsx
import React, { useCallback } from 'react';
import { Card } from '@swc-react/card';
import { useAddOnSDK } from '../../hooks/useAddOnSDK';

function DraggableImage({ image }) {
  const { sdk, isReady } = useAddOnSDK();
  
  const handleDragStart = useCallback(async (e) => {
    if (isReady) {
      try {
        await sdk.app.enableDragToDocument(image.url, {
          previewCallback: () => image.thumbnailUrl,
          completeCallback: async () => {
            const response = await fetch(image.url);
            return response.blob();
          }
        });
      } catch (error) {
        console.error('Drag failed:', error);
      }
    }
  }, [isReady, sdk, image]);
  
  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      heading={image.title}
    >
      <img 
        slot="preview"
        src={image.thumbnailUrl} 
        alt={image.title} 
        style={{ width: '100%', height: 'auto' }}
      />
    </Card>
  );
}
```

### Modal Dialog Implementation

Implement modal dialogs with the Add-on SDK:

```jsx
// Main component
import React from 'react';
import { Button } from '@swc-react/button';
import { useAddOnSDK } from '../hooks/useAddOnSDK';

function MainComponent() {
  const { sdk, isReady } = useAddOnSDK();
  
  const openSettingsDialog = async () => {
    if (!isReady) return;
    
    try {
      const result = await sdk.app.showModalDialog({
        variant: 'custom',
        size: { width: 600, height: 400 },
        url: 'dialog.html'
      });
      
      if (result) {
        console.log('Dialog result:', result);
        // Handle the result...
      }
    } catch (error) {
      console.error('Dialog error:', error);
    }
  };
  
  return (
    <Button variant="accent" onClick={openSettingsDialog}>
      Open Settings
    </Button>
  );
}

// dialog.html - React component
import React, { useState } from 'react';
import { Theme } from '@swc-react/theme';
import { Button } from '@swc-react/button';
import { ButtonGroup } from '@swc-react/button-group';
import { Picker } from '@swc-react/picker';
import { useAddOnSDK } from '../hooks/useAddOnSDK';

// Import theme styles
import '@swc-react/theme/express/theme-light.js';
import '@swc-react/theme/express/scale-medium.js';

function DialogComponent() {
  const { sdk, isReady } = useAddOnSDK();
  const [format, setFormat] = useState('jpg');
  
  const handleSave = () => {
    if (isReady) {
      sdk.instance.runtime.dialog.close({ format });
    }
  };
  
  const handleCancel = () => {
    if (isReady) {
      sdk.instance.runtime.dialog.close();
    }
  };
  
  return (
    <Theme system="express" scale="medium" color="light">
      <div style={{ padding: '20px' }}>
        <Picker
          label="Export Format"
          selects="single"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="jpg">JPEG</option>
          <option value="png">PNG</option>
          <option value="pdf">PDF</option>
        </Picker>
        
        <ButtonGroup>
          <Button variant="accent" onClick={handleSave}>Save</Button>
          <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
        </ButtonGroup>
      </div>
    </Theme>
  );
}
```

### Performance Optimization

Optimize React components for better performance:

1. **Use React.memo for pure components**

```jsx
import React from 'react';

const ImageItem = React.memo(function ImageItem({ image, onSelect }) {
  return (
    <div className="image-item" onClick={() => onSelect(image)}>
      <img src={image.thumbnailUrl} alt={image.title} />
      <span>{image.title}</span>
    </div>
  );
});
```

2. **Optimize event handlers with useCallback**

```jsx
import React, { useCallback } from 'react';

function ParentComponent() {
  const handleSelect = useCallback((image) => {
    // Handle selection...
  }, [/* dependencies */]);
  
  return <ImageGrid onSelect={handleSelect} />;
}
```

3. **Optimize expensive calculations with useMemo**

```jsx
import React, { useMemo } from 'react';

function FilteredList({ items, filter }) {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.includes(filter));
  }, [items, filter]);
  
  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

4. **Virtualize long lists**

```jsx
import React from 'react';
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={400}
      width={300}
      itemCount={items.length}
      itemSize={35}
    >
      {Row}
    </FixedSizeList>
  );
}
```

5. **Avoid unnecessary re-renders with proper dependency arrays**

```jsx
import React, { useEffect, useState } from 'react';

function DataFetcher({ userId }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Only re-fetch when userId changes
    fetchData(userId).then(setData);
  }, [userId]); // Dependency array
  
  return <div>{data && data.name}</div>;
}
```

### Error Handling

Implement proper error handling in React components:

```jsx
import React, { useState, useEffect } from 'react';
import { Alert } from '@swc-react/alert';

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  
  // For catching render errors
  if (error) {
    return (
      <Alert variant="error">
        <div slot="header">An error occurred</div>
        <div slot="content">{error.message}</div>
      </Alert>
    );
  }
  
  return (
    <ErrorCatcher setError={setError}>
      {children}
    </ErrorCatcher>
  );
}

// For component with async operations
function AsyncComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return <ProgressCircle />;
  }
  
  if (error) {
    return (
      <Alert variant="error">
        <div slot="header">Failed to load data</div>
        <div slot="content">{error}</div>
        <Button slot="footer" variant="accent" onClick={retry}>
          Retry
        </Button>
      </Alert>
    );
  }
  
  return <DataDisplay data={data} />;
}
```

## Add-on Manifest

### Manifest Configuration
Configure manifest.json correctly:

```json
{
  "id": "com.example.my-addon",
  "name": "My Add-on",
  "version": "1.0.0",
  "manifestVersion": 2,
  "requirements": {
    "apps": [
      {
        "name": "Express",
        "apiVersion": 1
      }
    ],
    "experimentalApis": false
  },
  "entryPoints": [
    {
      "type": "panel",
      "id": "panel1",
      "main": "index.html",
      "documentSandbox": "documentSandbox/code.js"
    }
  ]
}
```

Enable experimentalApis for access to experimental features.

## Best Practices

### Error Handling
Implement proper error handling:

```javascript
try {
  // API calls or operations that might fail
  await addOnUISdk.app.document.addImage(imageBlob);
} catch (error) {
  console.error("Failed to add image:", error);
  // Show user-friendly error message or fallback
}
```

Key areas to handle errors:
- Network requests (fetch)
- File operations
- Document API calls
- Communication between iframe and Document Sandbox

### Performance Considerations
Follow performance best practices:

1. Minimize DOM operations and updates
2. Use efficient selectors
3. Limit use of heavy libraries
4. Batch Document API operations when possible
5. Use debouncing for input handlers
6. Use efficient data structures
7. Optimize image and media assets before adding to documents

Example of inefficient code to avoid:
```javascript
// Bad - multiple sequential Document API operations
shapes.forEach(shape => {
  const rect = editor.createRectangle();
  rect.width = shape.width;
  rect.height = shape.height;
  insertionParent.children.append(rect);
});

// Better - prepare elements then batch append
const rectangles = shapes.map(shape => {
  const rect = editor.createRectangle();
  rect.width = shape.width;
  rect.height = shape.height;
  return rect;
});
insertionParent.children.appendAll(rectangles);
```

### Accessibility
Make add-ons accessible:

1. Use semantic HTML elements
2. Add proper labels and ARIA attributes
3. Ensure keyboard navigation works
4. Maintain sufficient color contrast
5. Support screen readers
6. Use Spectrum components which have accessibility built-in

Example:
```html
<!-- Avoid -->
<div onclick="handleClick()">Click me</div>

<!-- Better -->
<button aria-label="Perform action" onclick="handleClick()">Click me</button>

<!-- Best - Use Spectrum -->
<sp-button aria-label="Perform action">Click me</sp-button>
```

## Dependencies

- If the project requires webpack, make sure the correct dependencies are addein the `package.json` and that the `build`, `start` and `package` scripts have the `--use webpack` option:

Example:
```json
"scripts": {
    "clean": "ccweb-add-on-scripts clean",
    "build": "ccweb-add-on-scripts build --use webpack",
    "start": "ccweb-add-on-scripts start --use webpack",
    "package": "ccweb-add-on-scripts package --use webpack"
},
```

## References and Resources

Key references:
- [Add-on SDK Reference](https://developer.adobe.com/express/add-ons/docs/references/addonsdk/)
- [Document API Reference](https://developer.adobe.com/express/add-ons/docs/references/document-sandbox/document-apis/)
- [Manifest Schema Reference](https://developer.adobe.com/express/add-ons/docs/references/manifest/)
- [Code Samples](https://developer.adobe.com/express/add-ons/docs/samples/)
- [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/)
- [swc-react Documentation](https://opensource.adobe.com/spectrum-web-components/using-swc-react/)

- Use `mocha` and `chai` for testing JavaScript code.
- Use `cypress` for end-to-end testing JavaScript code.

- Use `webpack` for bundling JavaScript code.
