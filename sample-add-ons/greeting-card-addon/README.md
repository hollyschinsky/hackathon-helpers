# Greeting Card Generator Add-on for Adobe Express

![Adobe Express Add-on](https://img.shields.io/badge/Adobe%20Express-Add--on-blue)
![Spectrum Web Components](https://img.shields.io/badge/Spectrum%20Web%20Components-v1.x-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-v4.x-blue)
![Lit](https://img.shields.io/badge/Lit-v2.x-yellow)

A customizable greeting card generator add-on for Adobe Express that lets users create beautiful greeting cards using pre-defined templates or custom designs. This add-on demonstrates the use of Spectrum Web Components, TypeScript, and Document Sandbox Runtime to interact with Adobe Express documents.

## Features

### Template Gallery
- **Multiple Categories**: Browse cards by celebration, holiday, and gratitude categories
- **Pre-designed Templates**: Choose from birthday, valentine, congratulations, holiday, and thank-you designs
- **One-click Creation**: Apply templates with a single click

### Custom Card Design
- **Dimensions Control**: Adjust card width and height
- **Color Customization**: Set background, text, and accent colors using the color picker
- **Border Styling**: Configure border width and rounded corners
- **Text Customization**: Add custom messages with font selection and size control

### Advanced Design Elements
- **Automatic Decorations**: Templates include themed decorative elements:
  - Birthday cards: Colorful balloons with strings
  - Valentine cards: Heart shapes
  - Holiday cards: Snowflake patterns

## Technology Stack

### Frontend
- **[Lit](https://lit.dev/)**: Web components framework for building the UI
- **[TypeScript](https://www.typescriptlang.org/)**: For type-safe code
- **[Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/)**: Adobe's design system components for a consistent look and feel

### Adobe Express Integration
- **Add-on UI SDK**: Integration with the Adobe Express interface
- **Document Sandbox**: Secure environment for document manipulation
- **Express Document SDK**: API for creating and editing document elements

### Build Tools
- **Webpack**: For bundling and optimization
- **npm**: Package management

## Project Structure

```
/src
  /models             # Shared type definitions
  /sandbox            # Document sandbox implementation
    code.ts           # Main document manipulation logic
  /ui                 # User interface components
    /components       # Custom UI components
      App.ts          # Main application component
      App.css.ts      # Styling for the application
      CardTemplates.ts  # Template definitions
      ColorPicker.ts  # Custom color picker component
      TemplateCard.ts # Card template display component
    index.ts          # UI entry point
```

## Installation

### For Users
1. In Adobe Express, click on the **Add-ons** icon in the left sidebar
2. Browse or search for the "Greeting Card Generator" add-on
3. Click on the add-on to install it
4. Once installed, access it from the Add-ons panel whenever you need to create greeting cards

### For Developers

#### Prerequisites
- Node.js version 18 or newer
- npm (v10 or higher)
- Adobe Express account

#### Setup
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Start the development server:
   ```bash
   npm run start
   ```
5. Enable developer mode in Adobe Express:
   - Navigate to [Adobe Express](https://new.express.adobe.com/)
   - Click on your user avatar in the top-right corner and choose **Settings**
   - Accept the developer terms and enable the add-on development toggle
6. Load the add-on in Adobe Express:
   - Create a new Adobe Express project
   - Click the **Add-ons** icon in the left sidebar
   - Click on **Development** tab
   - Select **Load Local Add-on** and enter the localhost URL

## Usage

1. **Choose a Template**: Browse the template gallery and select a pre-designed template for your card
2. **Or Create Custom**: Switch to the Custom tab to design your own card from scratch
3. **Customize**: Adjust dimensions, colors, borders, and text to your preference
4. **Create Card**: Click the "Create Card" button to generate your greeting card in the Adobe Express document

## Adobe Express Add-on Features Used

- **Document Sandbox**: For secure card generation and manipulation 
- **Color Picker API**: For intuitive color selection
- **Document API**: For creating shapes, text, and other elements
- **Spectrum Web Components**: For UI consistency with Adobe Express
- **Add-on Panel UI**: Custom interface in the Express sidebar

## Development Notes

### Experimental APIs
This add-on uses experimental Adobe Express APIs which require enabling the experimental features flag in your `manifest.json`:

```json
"experimentalApis": true
```

The following experimental features are used:
- **Color Picker API**: Used for selecting colors in the customization interface
- **Advanced Text Styling**: For font selection and text formatting options
- **Font API**: For accessing and applying different fonts to text elements

> **Note:** Experimental APIs may change in future releases of the Adobe Express platform.

### UX Guidelines
This add-on follows the Adobe Express UX Guidelines to provide a seamless and intuitive experience:
- Uses Spectrum Web Components for UI elements
- Maintains a 320px fixed panel width with proper spacing
- Follows Spectrum design principles for color, typography, and component usage

### Debugging Tips
- Enable console logging in Adobe Express by enabling developer mode
- Use the browser developer tools to inspect elements and network traffic
- Check the browser console for error messages

## Additional Resources

- [Adobe Express Add-ons Documentation](https://developer.adobe.com/express/add-ons/docs/)
- [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/)
- [Express Add-on SDK Reference](https://developer.adobe.com/express/add-ons/docs/references/)

## License

This project is licensed under the [MIT License](LICENSE).

---

*This add-on was created with [@adobe/create-ccweb-add-on](https://www.npmjs.com/package/@adobe/create-ccweb-add-on).*
