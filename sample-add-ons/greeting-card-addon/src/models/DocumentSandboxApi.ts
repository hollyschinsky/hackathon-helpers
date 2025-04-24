// This interface declares all the APIs that the document sandbox runtime (i.e. code.ts) exposes to the UI/iframe runtime
export interface DocumentSandboxApi {
    // Apply a card template to the document
    applyCardTemplate(templateId: string): void;
    
    // Create a new card with custom settings
    createGreetingCard(cardSettings: CardSettings): void;

    // Text operations
    addText(text: string, styles: TextStyles): void;
    updateTextStyles(textId: string, styles: TextStyles): void;

    // Shape operations
    addRectangle(rect: RectangleProps): void;
    addEllipse(ellipse: EllipseProps): void;
    addLine(line: LineProps): void;
}

// Types for the card settings
export interface CardSettings {
    width: number;
    height: number;
    backgroundColor: ColorProps;
    borderColor?: ColorProps;
    borderWidth?: number;
    hasRoundedCorners?: boolean;
    cornerRadius?: number;
}

// Types for text styling
export interface TextStyles {
    text: string;
    fontFamily?: string;
    fontSize?: number;
    fontColor?: ColorProps;
    alignment?: 'left' | 'center' | 'right';
    position?: PositionProps;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderlined?: boolean;
}

// Types for shapes
export interface RectangleProps {
    width: number;
    height: number;
    position: PositionProps;
    fill?: ColorProps;
    stroke?: StrokeProps;
    cornerRadius?: number;
}

export interface EllipseProps {
    radiusX: number;
    radiusY: number;
    position: PositionProps;
    fill?: ColorProps;
    stroke?: StrokeProps;
}

export interface LineProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    stroke: StrokeProps;
}

// Common props
export interface PositionProps {
    x: number;
    y: number;
}

export interface ColorProps {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

export interface StrokeProps {
    color: ColorProps;
    width: number;
    dashPattern?: number[];
}
// Model for card templates
export interface CardTemplate {
    id: string;
    name: string;
    description: string;
    previewImageUrl?: string;
    category: string;
    order: number;
}