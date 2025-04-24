import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

// Import Spectrum Web Components
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/express/theme-light.js';
import '@spectrum-web-components/theme/express/scale-medium.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/button-group/sp-button-group.js';
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/menu/sp-menu.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/picker/sp-picker.js';
import '@spectrum-web-components/switch/sp-switch.js';

addOnUISdk.ready.then(() => {
    console.log("addOnUISdk is ready for use.");
    const clickMeButton = document.getElementById("clickMe");
    clickMeButton.addEventListener("click", () => {
        clickMeButton.innerHTML = "Clicked";
    });

    // Enable the button only when:
    // 1. `addOnUISdk` is ready, and
    // 2. `click` event listener is registered.
    clickMeButton.disabled = false;

    // Create the main container with theme
    const container = document.createElement('div');
    container.innerHTML = `
        <sp-theme system="express" color="light" scale="medium">
            <div class="container">
                <sp-field-label for="textfield">Text Field</sp-field-label>
                <sp-textfield id="textfield" placeholder="Enter text"></sp-textfield>

                <sp-button-group>
                    <sp-button variant="primary">Primary</sp-button>
                    <sp-button variant="Accent">Accent</sp-button>
                    <sp-button variant="secondary">Secondary</sp-button>
                </sp-button-group>

                <sp-picker>
                    <sp-menu>
                        <sp-menu-item>Option 1</sp-menu-item>
                        <sp-menu-item>Option 2</sp-menu-item>
                        <sp-menu-item>Option 3</sp-menu-item>
                    </sp-menu>
                </sp-picker>

                <sp-switch>Switch</sp-switch>
            </div>
        </sp-theme>
    `;
    document.body.appendChild(container);

    // Add some basic styling
    const style = document.createElement('style');
    style.textContent = `
        .container {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
    `;
    document.head.appendChild(style);
});
