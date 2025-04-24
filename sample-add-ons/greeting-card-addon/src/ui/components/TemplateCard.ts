import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CardTemplate } from "../../models/DocumentSandboxApi";

import "@spectrum-web-components/card/sp-card.js";

@customElement("template-card")
export class TemplateCard extends LitElement {
    static styles = css`
        :host {
            display: block;
        }
        
        sp-card {
            --spectrum-card-body-header-height: auto;
            width: 100%;
            margin-bottom: var(--spectrum-global-dimension-size-100);
            cursor: pointer;
        }

        sp-card[selected] {
            border-color: var(--spectrum-global-color-blue-500);            
        }

        .card-content {
            padding: var(--spectrum-global-dimension-size-100);
            text-align: center;
        }

        .card-title {
            font-size: var(--spectrum-body-size-s);
            font-weight: var(--spectrum-alias-heading-text-font-weight-regular);
            margin-bottom: var(--spectrum-global-dimension-size-50);
            color: var(--spectrum-alias-heading-text-color);
        }

        .card-description {
            font-size: var(--spectrum-body-size-xs);
            color: var(--spectrum-alias-text-color);
            height: 2.4em;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        /* Placeholder styling for template preview */
        .preview-placeholder {
            height: 90%;
            width: 90%;
            background-color: var(--spectrum-alias-background-color-default);
            display: flex;
            align-items: center;
            justify-content: center;            
        }

        .preview-placeholder.birthday {
            background-color: rgb(250, 212, 62, 0.3);
        }

        .preview-placeholder.thank-you {
            background-color: rgb(34, 94, 168, 0.3);
        }

        .preview-placeholder.congratulations {
            background-color: rgb(69, 27, 121, 0.3);
        }

        .preview-placeholder.holiday {
            background-color: rgb(27, 95, 55, 0.3);
        }

        .preview-placeholder.valentine {
            background-color: rgb(254, 236, 236, 1);
        }
    `;

    @property({ type: Object })
    template!: CardTemplate;

    @property({ type: Boolean })
    selected = false;

    render() {
        return html`
            <sp-card 
                variant="quiet" 
                ?selected=${this.selected}
                @click=${this._handleClick}
            >
                <div class="preview-placeholder ${this.template.id}" slot="preview">
                    ${this.template.name.charAt(0)}
                </div>
                <div class="card-content">
                    <div class="card-title">${this.template.name}</div>
                    <div class="card-description">${this.template.description}</div>
                </div>
            </sp-card>
        `;
    }

    private _handleClick() {
        this.dispatchEvent(new CustomEvent("template-selected", {
            detail: {
                templateId: this.template.id
            },
            bubbles: true,
            composed: true
        }));
    }
} 