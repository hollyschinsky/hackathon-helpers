import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ColorProps } from "../../models/DocumentSandboxApi";
import { ColorPickerPlacement } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

@customElement("color-picker")
export class ColorPicker extends LitElement {
    static styles = css`
        :host {
            display: block;
        }
        
        sp-swatch {
            cursor: pointer;
            --mod-swatch-border-thickness: var(--spectrum-divider-thickness-small);
            --mod-swatch-border-color: var(--spectrum-transparent-black-500);
        }

        .row {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .label {
            font-size: var(--spectrum-body-size-s);
            color: var(--spectrum-alias-label-text-color);
        }
    `;

    @property({ type: Object })
    addOnSdk: any;

    @property({ type: String })
    label = "";

    @property({ type: Object })
    color: ColorProps = { red: 0, green: 0, blue: 0, alpha: 1 };

    @property({ type: Boolean })
    showAlpha = false;

    @state()
    private _lastPickerResult: ColorProps | null = null;

    get colorHex() {
        // Convert RGB 0-1 to hex format
        const r = Math.round(this.color.red * 255).toString(16).padStart(2, '0');
        const g = Math.round(this.color.green * 255).toString(16).padStart(2, '0');
        const b = Math.round(this.color.blue * 255).toString(16).padStart(2, '0');
        const a = Math.round(this.color.alpha * 255).toString(16).padStart(2, '0');
        return `#${r}${g}${b}${a}`;
    }

    render() {
        return html`
            <div class="row">
                <span class="label">${this.label}</span>
                <sp-swatch 
                    color=${this.colorHex}
                    @click=${this._openColorPicker}
                ></sp-swatch>
            </div>
        `;
    }

    private async _openColorPicker(e: Event) {
        if (!this.addOnSdk) {
            console.error("Add-on SDK not available");
            return;
        }

        try {
            // Convert our 0-1 range to 0-255 for the color picker
            const initialColor = 0x0000ff;

            const swatchElement = e.currentTarget as HTMLElement;
            
            // Create bound event handler to ensure we can remove the same function reference
            const boundColorChangeHandler = this._handleColorChange.bind(this);
            
            // Show the color picker
            this.addOnSdk.app.showColorPicker(swatchElement, {
                title: this.label,
                placement: ColorPickerPlacement.left,
                initialColor: initialColor,
                // Whether the eyedropper hides the color picker
                eyedropperHidesPicker: true,
                disableAlphaChannel: !this.showAlpha
            });

            // Add event listener for color change
            swatchElement.addEventListener("colorpicker-color-change", boundColorChangeHandler);
            
            // Add event listener for when the color picker is closed
            swatchElement.addEventListener("colorpicker-close", () => {
                // Remove the event listener when the color picker is closed
                swatchElement.removeEventListener("colorpicker-color-change", boundColorChangeHandler);
            });
        } catch (error) {
            console.error("Error opening color picker:", error);
        }
    }

    private _handleColorChange(e: CustomEvent) {
        // The color from the event is in hex format like "#F0EDD8FF"
        const hexColor = e.detail.color;
        
        // Convert hex to our RGB 0-1 format
        const r = parseInt(hexColor.slice(1, 3), 16) / 255;
        const g = parseInt(hexColor.slice(3, 5), 16) / 255;
        const b = parseInt(hexColor.slice(5, 7), 16) / 255;
        const a = hexColor.length > 7 ? parseInt(hexColor.slice(7, 9), 16) / 255 : 1;
        
        const newColor: ColorProps = {
            red: r,
            green: g,
            blue: b,
            alpha: a
        };

        this._lastPickerResult = newColor;
        
        // Dispatch the color-changed event with the new color
        this.dispatchEvent(new CustomEvent("color-changed", {
            detail: {
                color: newColor
            },
            bubbles: true,
            composed: true
        }));
    }
} 