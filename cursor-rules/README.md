# Cursor Rules

This folder contains a collection of Cursor IDE rules that help enforce coding standards and best practices for web development projects and Adobe Express Add-ons.

## Repository Structure

```plaintext
.cursor/rules/
|-- add-on-webpack-configuration/  # Webpack configurations for various add-on setups
|   |-- react-javascript-doc-sandbox.mdc       # Webpack config for React + JavaScript with Document Sandbox
|   |-- react-javascript.mdc                   # Webpack config for React + JavaScript without Document Sandbox
|   |-- react-typescript-doc-sandbox.mdc       # Webpack config for React + TypeScript with Document Sandbox
|   |-- react-typescript.mdc                   # Webpack config for React + TypeScript without Document Sandbox
|   |-- swc-javascript-doc-sandbox.mdc         # Webpack config for Spectrum Web Components + JavaScript with Document Sandbox
|   |-- swc-javascript.mdc                     # Webpack config for Spectrum Web Components + JavaScript without Document Sandbox
|   |-- swc-typescript-doc-sandbox.mdc         # Webpack config for Spectrum Web Components + TypeScript with Document Sandbox
|   |-- swc-typescript.mdc                     # Webpack config for Spectrum Web Components + TypeScript without Document Sandbox
|-- adobe-spectrum/                 # Rules specific to Adobe Spectrum projects
|   |-- components-spectrum.mdc               # Rules for Spectrum Web Components usage
|   |-- lit-framework.mdc                     # Rules for Lit framework best practices
|   |-- scaffold-spectrum.mdc                 # Project scaffolding rules for Spectrum Web Components
|-- react-spectrum/                 # Placeholder for React Spectrum-specific rules (to be added)
|-- coding-general.mdc             # General coding guidelines and best practices
|-- express-add-on-dev-pattern-rules.mdc           # LLM pattern rules for Express add-on development
|-- express-add-on-development.md           # Readable rules and guidelines for Adobe Express add-on development

|-- javascript-general.mdc         # JavaScript-specific coding rules
|-- reactjs-general.mdc            # React.js-specific coding rules
|-- rules.mdc                      # Centralized rules for enforcing standards across the repository
```

## Additional Details

### Centralized Rules
- `rules.mdc`: A centralized file containing overarching rules for the repository.

### Adobe Express Add-on Development
- `express-add-on-development.md`: Rules and guidelines for Adobe Express add-on development.
- The `add-on-webpack-configuration` folder contains detailed Webpack configurations for various setups, including React, Spectrum Web Components, JavaScript, and TypeScript. Each file specifies whether it supports the Document Sandbox or not.

### Adobe Spectrum Rules
The `adobe-spectrum` folder includes rules for projects using Adobe Spectrum Web Components and the Lit framework. It also provides scaffolding guidelines to ensure consistency in project setup.

### React Spectrum Rules
The `react-spectrum` folder is reserved for rules specific to React Spectrum projects. Currently, it serves as a placeholder for future additions.

### General Rules
- `documentation-general.mdc`: Guidelines for writing clear and concise technical documentation.
- `coding-general.mdc`: General coding best practices, including naming conventions and performance optimization.
- `javascript-general.mdc`: JavaScript-specific rules for clean and modern code.
- `reactjs-general.mdc`: React.js-specific rules for component structure, hooks, and state management.

## Usage

These rules are stored in `.mdc` files within the `.cursor/rules/` directory and can be enforced by Cursor IDE when used to provide:

- Automated code checks
- Suggestions for improvements
- Error prevention
- Best practice enforcement

## Contributing
If you have suggestions for new rules or improvements to existing ones, please submit a pull request or open an issue in this repository. Your contributions are welcome!
