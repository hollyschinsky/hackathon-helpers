# Spectrum Web Components Add-on Sample

This sample Adobe Express add-on demonstrates how to integrate Spectrum Web Components (SWC) to create a UI that follows Adobe's design system in a basic JavaScript project.

![Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/img/spectrum-web-components.svg)

## Features

- Proper Spectrum theme integration for Adobe Express
- Implementation of various Spectrum Web Components:
  - Buttons and Button Groups
  - Text Fields with Labels
  - Menu and Menu Items
  - Pickers (Dropdown)
  - Switches
- Webpack configuration for SWC compatibility

## Technologies

- HTML5
- JavaScript
- CSS
- [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/)
- Adobe Express Add-on SDK

## Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Adobe Express account

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run start
   ```
4. Load the add-on in Adobe Express by following the [loading instructions](https://developer.adobe.com/express/add-ons/docs/guides/getting_started/quickstart/)

## Build & Package

- Build the add-on:
  ```bash
  npm run build
  ```
- Package the add-on for submission:
  ```bash
  npm run package
  ```

## Project Structure

- `src/index.html` - Main HTML file
- `src/index.js` - JavaScript entry point with SWC imports and initialization
- `src/manifest.json` - Add-on manifest configuration
- `webpack.config.js` - Webpack configuration for SWC compatibility

## Key Implementation Details

### Importing SWC Components

```javascript
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/express/theme-light.js';
import '@spectrum-web-components/theme/express/scale-medium.js';
import '@spectrum-web-components/button/sp-button.js';
// Additional component imports...
```

### Theming

```html
<sp-theme system="express" color="light" scale="medium">
    <!-- Your components here -->
</sp-theme>
```

## Learn More

- [Spectrum Web Components Documentation](https://opensource.adobe.com/spectrum-web-components/)
- [Adobe Express Add-on Documentation](https://developer.adobe.com/express/add-ons/docs/)
- [Spectrum Design System](https://spectrum.adobe.com/)

## License

Apache License 2.0
