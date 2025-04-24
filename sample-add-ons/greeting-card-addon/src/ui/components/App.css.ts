import { type CSSResult, css } from "lit";

export const style: CSSResult = css`
    .container {
        padding: var(--spectrum-global-dimension-size-300);
        display: flex;
        flex-direction: column;
        gap: var(--spectrum-global-dimension-size-200);
        max-width: 320px;
        box-sizing: border-box;
    }

    .section {
        margin-bottom: var(--spectrum-global-dimension-size-100);
    }

    .section-title {
        font-size: var(--spectrum-heading-size-s);
        font-weight: var(--spectrum-alias-heading-text-font-weight-regular);
        margin-bottom: var(--spectrum-global-dimension-size-100);
        color: var(--spectrum-alias-heading-text-color);
    }

    .card-templates {
        display: flex;
        flex-direction: column;
        gap: var(--spectrum-global-dimension-size-100);
    }

    .template-category {
        font-size: var(--spectrum-body-size-s);
        font-weight: var(--spectrum-alias-heading-text-font-weight-regular);
        color: var(--spectrum-alias-heading-text-color);
        margin-top: var(--spectrum-global-dimension-size-200);
        margin-bottom: var(--spectrum-global-dimension-size-100);
    }

    .templates-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spectrum-global-dimension-size-100);
    }

    .color-controls, .text-controls, .shape-controls {
        display: flex;
        flex-direction: column;
        gap: var(--spectrum-global-dimension-size-100);
    }

    .control-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .control-label {
        font-size: var(--spectrum-body-size-s);
        color: var(--spectrum-alias-label-text-color);
    }

    .color-preview {
        width: var(--spectrum-global-dimension-size-300);
        height: var(--spectrum-global-dimension-size-300);
        border-radius: var(--spectrum-alias-border-radius-small);
        border: 1px solid var(--spectrum-alias-border-color);
        cursor: pointer;
    }

    .button-container {
        display: flex;
        justify-content: center;
        margin-top: var(--spectrum-global-dimension-size-300);
        width: 100%;
    }
    
    .button-container sp-button {
        width: 100%;
    }
    
    .section-divider {
        height: 1px;
        background-color: var(--spectrum-alias-border-color-mid);
        width: 100%;
        margin: var(--spectrum-global-dimension-size-200) 0;
    }

    .template-card {
        border-radius: var(--spectrum-alias-border-radius-small);
        overflow: hidden;
        border: 1px solid var(--spectrum-alias-border-color);
        cursor: pointer;
        transition: border-color 0.2s, transform 0.2s;
    }

    .template-card:hover {
        border-color: var(--spectrum-alias-border-color-hover);
        transform: translateY(-2px);
    }

    .template-card.selected {
        border-color: var(--spectrum-global-color-blue-500);
        box-shadow: 0 0 0 3px var(--spectrum-global-color-blue-500);
    }

    .tabs-container {
        margin-bottom: var(--spectrum-global-dimension-size-200);
    }

    .selected-template-info {
        background-color: var(--spectrum-global-color-gray-100);
        border-radius: var(--spectrum-alias-border-radius-regular);
        padding: var(--spectrum-global-dimension-size-150);
        margin-bottom: var(--spectrum-global-dimension-size-200);
        border-left: 3px solid var(--spectrum-global-color-blue-500);
    }

    .selected-template-name {
        font-size: var(--spectrum-heading-size-xs);
        font-weight: var(--spectrum-alias-heading-text-font-weight-strong);
        margin-bottom: var(--spectrum-global-dimension-size-50);
        color: var(--spectrum-alias-heading-text-color);
    }

    .selected-template-description {
        font-size: var(--spectrum-body-size-s);
        color: var(--spectrum-alias-text-color);
        line-height: var(--spectrum-alias-body-text-line-height);
    }   
`;
