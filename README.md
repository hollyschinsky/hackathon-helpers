# Hackathon Helpers

This repository provides resources, samples, and tools to help developers build Adobe Express Add-ons and effectively use Cursor rules for maintaining code quality and following best practices.

## Contents

- [Working with Add-ons](#working-with-add-ons)
- [Sample Add-ons](#sample-add-ons)
- [Cursor Rules](#cursor-rules)
- [Getting Started](#getting-started)
- [Resources](#resources)

## Working with Add-ons

An overview of patterns and best practices for working with add-ons in Adobe Express that you should read before you start building your own add-ons.

## Sample Add-ons

The repository includes sample Adobe Express add-ons that serve as starting points for your add-on development:

### Basic Spectrum Web Components Add-on (JavaScript)

A simple add-on demonstrating how to use Spectrum Web Components (SWC) in a JavaScript-based project:

- Proper theme integration for Adobe Express
- Implementation of various Spectrum Web Components
- Webpack configuration for SWC compatibility
- No document sandbox implementation

### Greeting Card Generator (TypeScript)

A more complex add-on using TypeScript, Lit, and Document Sandbox:

- Template gallery with multiple card types
- Custom card design capabilities
- Color customization with the Express color picker
- Document Sandbox API implementation
- TypeScript interfaces for type safety

## Cursor Rules

The repository contains a collection of Cursor rules in the `.cursor/rules` directory that can be used to guide development and maintain quality:

### Technology Rules

- **Adobe Spectrum Web Components**: Guidelines for using Spectrum Web Components correctly
- **Lit Framework**: Rules for building web components with Lit
- **React Spectrum**: Usage guidelines for React Spectrum components

### Configuration Rules

- **Add-on Webpack Configuration**: Ready-to-use webpack configurations for various tech stacks:
  - React + JavaScript (with/without Document Sandbox)
  - React + TypeScript (with/without Document Sandbox)
  - Spectrum Web Components + JavaScript (with/without Document Sandbox)
  - Spectrum Web Components + TypeScript (with/without Document Sandbox)

### Coding Guidelines

- **General Coding Rules**: Best practices for clean, readable code
- **JavaScript Specific Rules**: JavaScript coding conventions
- **React Guidelines**: Best practices for React development
- **Documentation Guidelines**: How to write effective documentation

## Getting Started

### Using the Sample Add-ons

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/hackathon-helpers.git
   cd hackathon-helpers
   ```

2. Navigate to a sample add-on:
   ```
   cd sample-add-ons/swc-basic-js-addon
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run start
   ```

5. Load the add-on in Adobe Express:
   - Open Adobe Express
   - Navigate to the Add-ons panel
   - Click on "Your Add-ons"
   - Enable Developer Mode
   - Click "Load Local Add-on" and enter the localhost URL

### Using Cursor Rules

To use the Cursor rules in your project:

1. Create a `.cursor/rules` directory in your project root
2. Copy the relevant rule files from this repository
3. Configure your Cursor editor to use these rules

## Resources

- [Adobe Express Add-ons Documentation](https://developer.adobe.com/express/add-ons/docs/)
- [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/)
- [Lit Framework Documentation](https://lit.dev/)
- [React Spectrum](https://react-spectrum.adobe.com/react-spectrum/index.html)
- [Cursor Editor](https://cursor.sh/)

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details. 