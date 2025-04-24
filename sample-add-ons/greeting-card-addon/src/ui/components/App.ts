// To support: system="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import "@spectrum-web-components/theme/scale-medium.js";
import "@spectrum-web-components/theme/theme-light.js";

// To learn more about using "spectrum web components" visit:
// https://opensource.adobe.com/spectrum-web-components/
import "@spectrum-web-components/button/sp-button.js";
import "@spectrum-web-components/theme/sp-theme.js";
import "@spectrum-web-components/field-label/sp-field-label.js";
import "@spectrum-web-components/tabs/sp-tabs.js";
import "@spectrum-web-components/tabs/sp-tab.js";
import "@spectrum-web-components/tabs/sp-tab-panel.js";
import "@spectrum-web-components/slider/sp-slider.js";
import "@spectrum-web-components/switch/sp-switch.js";
import "@spectrum-web-components/textfield/sp-textfield.js";
import "@spectrum-web-components/picker/sp-picker.js";
import "@spectrum-web-components/menu/sp-menu.js";
import "@spectrum-web-components/menu/sp-menu-item.js";
import "@spectrum-web-components/swatch/sp-swatch.js";

import { LitElement, TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DocumentSandboxApi } from "../../models/DocumentSandboxApi";
import { style } from "./App.css";

import { AddOnSDKAPI, RuntimeType } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

// Import the CardTemplate models
import { cardTemplates, getAllCategories, getTemplatesByCategory } from "./CardTemplates";

// Import the custom components
import "./TemplateCard";
import "./ColorPicker";

@customElement("add-on-app")
export class App extends LitElement {
    @property({ type: Object })
    addOnUISdk!: AddOnSDKAPI;

    @state()
    private _sandboxProxy!: DocumentSandboxApi;

    @state()
    private _selectedTabId: string = "templates";

    @state()
    private _selectedTemplateId: string | null = null;

    @state()
    private _categories: string[] = [];

    @state()
    private _cardWidth: number = 1200;

    @state()
    private _cardHeight: number = 800;

    @state()
    private _backgroundColor = { red: 0.133, green: 0.369, blue: 0.659, alpha: 1 }; // Royal Blue
    
    @state()
    private _textColor = { red: 1, green: 1, blue: 1, alpha: 1 }; // White

    @state()
    private _accentColor = { red: 0.984, green: 0.831, blue: 0.243, alpha: 1 } // Accessible yellow #FBD43E

    @state()
    private _hasRoundedCorners: boolean = false;

    @state()
    private _cornerRadius: number = 10;

    @state()
    private _borderWidth: number = 10;

    @state()
    private _customText: string = "Your Custom Text";

    @state()
    private _fontFamily: string = "Alegreya-Regular";

    @state()
    private _fontSize: number = 24;

    static get styles() {
        return style;
    }

    async firstUpdated(): Promise<void> {
        // Get the UI runtime
        const { runtime } = this.addOnUISdk.instance;

        // Get the proxy object for the Document Sandbox
        this._sandboxProxy = await runtime.apiProxy(RuntimeType.documentSandbox);
        
        // Initialize categories
        this._categories = getAllCategories();
    }

    private _handleTabChange(e: CustomEvent) {
        // Access the selected property from detail instead of target
        this._selectedTabId = (e.target as HTMLElement & { selected: string }).selected;
    }

    private _handleTemplateSelection(e: CustomEvent) {
        this._selectedTemplateId = e.detail.templateId;
        
        // Find the selected template
        const template = cardTemplates.find(t => t.id === this._selectedTemplateId);
        if (template) {
            // Apply the template to show a preview
            this._applyTemplate(template.id);
        }
    }

    private _applyTemplate(templateId: string) {
        if (this._sandboxProxy) {
            this._sandboxProxy.applyCardTemplate(templateId);
        }
    }

    private _handleCreateCustomCard() {
        if (this._sandboxProxy) {
            this._sandboxProxy.createGreetingCard({
                width: this._cardWidth,
                height: this._cardHeight,
                backgroundColor: this._backgroundColor,
                borderColor: this._accentColor,
                borderWidth: this._borderWidth,
                hasRoundedCorners: this._hasRoundedCorners,
                cornerRadius: this._cornerRadius
            });

            // Add custom text if provided
            if (this._customText) {
                this._sandboxProxy.addText(this._customText, {
                    text: this._customText,
                    fontFamily: this._fontFamily,
                    fontSize: this._fontSize,
                    fontColor: this._textColor,
                    alignment: 'center',
                    position: {
                        x: this._cardWidth / 2,
                        y: this._cardHeight / 2
                    }
                });
            }
        }
    }
    
    private _renderTemplatesTab(): TemplateResult {
        // Find the selected template to display its description
        const selectedTemplate = this._selectedTemplateId 
            ? cardTemplates.find(t => t.id === this._selectedTemplateId) 
            : null;
            
        return html`
            <div class="section">
                <div class="section-title">Template Gallery</div>
                
                ${selectedTemplate ? html`
                    <div class="selected-template-info">
                        <div class="selected-template-name">${selectedTemplate.name}</div>
                        <div class="selected-template-description">${selectedTemplate.description}</div>
                    </div>
                ` : ''}
                
                <div class="card-templates">
                    ${this._categories.map(category => html`
                        <div class="template-category">${category.charAt(0).toUpperCase() + category.slice(1)}</div>                        
                         <div class="templates-grid">
                             ${getTemplatesByCategory(category).map(template => html`
                                 <template-card 
                                     .template=${template} 
                                     ?selected=${this._selectedTemplateId === template.id}
                                     @template-selected=${this._handleTemplateSelection}
                                 ></template-card>
                             `)}
                         </div>
                    `)}
                </div>
            </div>
        `;
    }

    private _renderCustomizeTab(): TemplateResult {
        return html`
            <div class="section">
                <div class="section-title">Card Dimensions</div>
                <div class="control-row">
                    <sp-field-label for="card-width" class="control-label" size="m">Width</sp-field-label>
                    <sp-slider 
                        id="card-width"
                        min="400" 
                        max="1200" 
                        value="${this._cardWidth}" 
                        @input=${(e: any) => this._cardWidth = Number(e.target.value)}
                        style="width: 180px;"
                    ></sp-slider>
                </div>
                <div class="control-row">
                    <sp-field-label for="card-height" class="control-label" size="m">Height</sp-field-label>
                    <sp-slider 
                        id="card-height"
                        min="300" 
                        max="1200" 
                        value="${this._cardHeight}" 
                        @input=${(e: any) => this._cardHeight = Number(e.target.value)}
                        style="width: 180px;"
                    ></sp-slider>
                </div>
            </div>

            <div class="section-divider"></div>

            <div class="section">
                <div class="section-title">Colors</div>
                <div class="color-controls">
                    <color-picker 
                        label="Background"
                        .color=${this._backgroundColor}
                        .addOnSdk=${this.addOnUISdk}
                        @color-changed=${(e: CustomEvent) => this._backgroundColor = e.detail.color}
                    ></color-picker>
                    <color-picker 
                        label="Text"
                        .color=${this._textColor}
                        .addOnSdk=${this.addOnUISdk}
                        @color-changed=${(e: CustomEvent) => this._textColor = e.detail.color}
                    ></color-picker>
                    <color-picker 
                        label="Accent"
                        .color=${this._accentColor}
                        .addOnSdk=${this.addOnUISdk}
                        @color-changed=${(e: CustomEvent) => this._accentColor = e.detail.color}
                    ></color-picker>
                </div>
            </div>

            <div class="section-divider"></div>

            <div class="section">
                <div class="section-title">Border</div>
                <div class="control-row">
                    <sp-field-label for="border-width" class="control-label" size="m">Width</sp-field-label>
                    <sp-slider 
                        id="border-width"
                        min="0" 
                        max="10" 
                        value="${this._borderWidth}" 
                        @input=${(e: any) => this._borderWidth = Number(e.target.value)}
                        style="width: 180px;"
                    ></sp-slider>
                </div>
                <div class="control-row">
                    <sp-field-label for="rounded-corners" class="control-label" size="m">Rounded Corners</sp-field-label>
                    <sp-switch 
                        id="rounded-corners"
                        ?checked=${this._hasRoundedCorners} 
                        @change=${(e: any) => this._hasRoundedCorners = e.target.checked}
                    ></sp-switch>
                </div>
                ${this._hasRoundedCorners ? html`
                    <div class="control-row">
                        <sp-field-label for="corner-radius" class="control-label" size="m">Corner Radius</sp-field-label>
                        <sp-slider 
                            id="corner-radius"
                            min="1" 
                            max="20" 
                            value="${this._cornerRadius}" 
                            @input=${(e: any) => this._cornerRadius = Number(e.target.value)}
                            style="width: 180px;"
                        ></sp-slider>
                    </div>
                ` : ''}
            </div>

            <div class="section-divider"></div>

            <div class="section">
                <div class="section-title">Text</div>
                <div class="text-controls">
                    <sp-field-label for="custom-text" class="control-label" size="m">Custom Text</sp-field-label>
                    <sp-textfield 
                        id="custom-text"
                        placeholder="Enter your message" 
                        .value=${this._customText} 
                        @input=${(e: any) => this._customText = e.target.value}
                    ></sp-textfield>
                    
                    <sp-field-label for="font-family" class="control-label" size="m" style="margin-top: 8px;">Font</sp-field-label>
                    <sp-picker 
                        id="font-family"
                        label="Font Family" 
                        placement="bottom"                         
                        value=${this._fontFamily}
                        @change=${(e: any) => this._fontFamily = e.target.value}
                    >
                        <sp-menu>
                            <sp-menu-item value="Alegreya-Regular">Alegreya-Regular</sp-menu-item>
                            <sp-menu-item value="ComicSansMS">Comic Sans</sp-menu-item>
                            <sp-menu-item value="Alegreya-Regular>Alegreya-Regular</sp-menu-item>
                            <sp-menu-item value="Georgia-Bold">Georgia</sp-menu-item>
                            <sp-menu-item value="Verdana">Verdana</sp-menu-item>
                            <sp-menu-item value="SourceSans3-Regular">SourceSans3-Regular</sp-menu-item>
                        </sp-menu>
                    </sp-picker>
                    
                    <div class="control-row" style="margin-top: 8px;">
                        <sp-field-label for="font-size" class="control-label" size="m">Size</sp-field-label>
                        <sp-slider 
                            id="font-size"
                            min="12" 
                            max="72" 
                            value="${this._fontSize}" 
                            @input=${(e: any) => this._fontSize = Number(e.target.value)}
                            style="width: 180px;"
                        ></sp-slider>
                    </div>
                </div>
            </div>

            <div class="button-container">
                <sp-button 
                    variant="accent"
                    @click=${this._handleCreateCustomCard}
                >
                    Create Card
                </sp-button>
            </div>
        `;
    }

    render(): TemplateResult {
        return html`
            <sp-theme system="express" color="light" scale="medium">
                <div class="container">
                    <div class="tabs-container">
                        <sp-tabs 
                            selected="${this._selectedTabId}" 
                            @change=${this._handleTabChange}
                            size="m"
                        >
                            <sp-tab value="templates" label="Templates"></sp-tab>
                            <sp-tab value="customize" label="Custom"></sp-tab>
                        </sp-tabs>
                    </div>

                    ${this._selectedTabId === "templates" 
                        ? this._renderTemplatesTab() 
                        : this._renderCustomizeTab()}
                </div>
            </sp-theme>
        `;
    }
}

