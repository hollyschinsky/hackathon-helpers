import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils, fonts } from "express-document-sdk";
import {
    CardSettings,
    ColorProps,
    DocumentSandboxApi,
    EllipseProps,
    LineProps,
    RectangleProps,
    StrokeProps,
    TextStyles
} from "../models/DocumentSandboxApi";

// Get the document sandbox runtime
const { runtime } = addOnSandboxSdk.instance;

// Card Templates - predefined styles for different occasions
const cardTemplates = {
    "birthday": {
        backgroundColor: { red: 0.984, green: 0.831, blue: 0.243, alpha: 1 }, // yellow #FBD43E
        textColor: { red: 0.271, green: 0.106, blue: 0.478, alpha: 1 }, // Deep Purple
        accentColor: { red: 0.925, green: 0.255, blue: 0.478, alpha: 1 }, // Pink
        fontFamily: "ComicSansMS",
        titleText: "Happy Birthday!"
        
    },
    "thank-you": {
        backgroundColor: { red: 0.133, green: 0.369, blue: 0.659, alpha: 1 }, // Royal Blue
        textColor: { red: 1, green: 1, blue: 1, alpha: 1 }, // White
        accentColor: { red: 0.984, green: 0.831, blue: 0.243, alpha: 1 }, // Accessible yellow #FBD43E
        fontFamily: "Georgia-Bold",
        titleText: "Thank You!"
    },
    "congratulations": {
        backgroundColor: { red: 0.271, green: 0.106, blue: 0.478, alpha: 1 }, // Deep Purple
        textColor: { red: 1, green: 1, blue: 1, alpha: 1 }, // White
        accentColor: { red: 0.98, green: 0.831, blue: 0.243, alpha: 1 }, // Yellow
        fontFamily: "AcuminPro-Regular",
        titleText: "Congratulations!"
    },
    "holiday": {
        backgroundColor: { red: 0.105, green: 0.372, blue: 0.215, alpha: 1 }, // Green
        textColor: { red: 0.984, green: 0.831, blue: 0.243, alpha: 1 }, // Yellow
        accentColor: { red: 0.925, green: 0.255, blue: 0.255, alpha: 1 }, // Red
        fontFamily: "Alegreya-Regular",
        titleText: "Season's Greetings!"
    },
    "valentine": {
        backgroundColor: { red: 0.996, green: 0.925, blue: 0.925, alpha: 1 }, // Pale Pink
        textColor: { red: 0.863, green: 0.078, blue: 0.235, alpha: 1 }, // Deep Red
        accentColor: { red: 0.925, green: 0.569, blue: 0.569, alpha: 1 }, // Light Red
        fontFamily: "BrushScriptStd",
        titleText: "Happy Valentine's Day!"
    }
};

// Convert our color props to the editor's color object
function convertColor(color: ColorProps) {
    return colorUtils.fromRGB(color.red, color.green, color.blue, color.alpha);
}

// Helper to create stroke
function createStroke(stroke: StrokeProps) {
    return editor.makeStroke({
        color: convertColor(stroke.color),
        width: stroke.width,
        dashPattern: stroke.dashPattern || []
    });
}

// Helper to get available font
async function getAvailableFont(fontFamily: string) {
    try {
        // A fallback system will be better, but we'll use a simple approach for now
        const font = await fonts.fromPostscriptName(fontFamily);
        return font;
    } catch (error) {
        console.error(`Font ${fontFamily} not available, using default font`, error);
        return undefined;
    }
}

// Implementation of the sandbox API
const sandboxApi: DocumentSandboxApi = {
    applyCardTemplate: async (templateId: string) => {
        try {
            const template = cardTemplates[templateId];
            if (!template) {
                console.error(`Template ${templateId} not found`);
                return;
            }

            // Create a card with the template settings
            const cardSettings: CardSettings = {
                width: 1200,
                height: 1600,
                backgroundColor: template.backgroundColor,
                borderColor: template.accentColor,
                borderWidth: 10,
                hasRoundedCorners: true,
                cornerRadius: 30
            };

            // Create the base card
            const rectangle = editor.createRectangle();
            rectangle.width = cardSettings.width;
            rectangle.height = cardSettings.height;
            rectangle.fill = editor.makeColorFill(convertColor(cardSettings.backgroundColor));
            
            if (cardSettings.borderColor && cardSettings.borderWidth) {
                rectangle.stroke = editor.makeStroke({
                    color: convertColor(cardSettings.borderColor),
                    width: cardSettings.borderWidth
                });
            }

            if (cardSettings.hasRoundedCorners && cardSettings.cornerRadius) {
                rectangle.setUniformCornerRadius(cardSettings.cornerRadius);
            }
            
            // Position the rectangle with slight offset from edges to prevent border cutoff
            rectangle.setPositionInParent(
                { x: cardSettings.borderWidth * 1.5, y: cardSettings.borderWidth * 1.5 },
                { x: 0, y: 0 }
            );

            // SourceSans3-Regular
            const fontObj = await getAvailableFont(template.fontFamily);
                
            // Add & style the text
            await editor.queueAsyncEdit(async () => {
                // Add the title text
                const titleText = editor.createText();
                const textContent = titleText.fullContent;
                textContent.text = template.titleText;                            
                
                if (fontObj) {
                    textContent.applyCharacterStyles({
                        fontSize: 24,
                        color: convertColor(template.textColor),
                        font: fontObj
                    });
                } else {
                    textContent.applyCharacterStyles({
                        fontSize: 24,
                        color: convertColor(template.textColor)
                    });
                }
                // Position the text in the center top of the card
                titleText.textAlignment = 3; // Center alignment
                
                // Calculate position with offset to match the card
                const borderOffset = cardSettings.borderWidth ? cardSettings.borderWidth * 1.5 : 10;
                titleText.setPositionInParent(
                    { x: cardSettings.width / 2 + borderOffset, y: 70 + borderOffset },
                    { x: 0, y: -100 }
                );
                // Add all elements to the document
                const insertionParent = editor.context.insertionParent;
                insertionParent.children.append(rectangle);
                insertionParent.children.append(titleText);
                // Add decorative elements based on the template
                if (templateId === "birthday") {
                    // Add some festive elements like balloons or confetti
                    addBirthdayDecoration(cardSettings);
                } else if (templateId === "valentine") {
                    // Add hearts
                    addValentineDecoration(cardSettings);
                } else if (templateId === "holiday") {
                    // Add holiday decorations
                    addHolidayDecoration(cardSettings);
                }
            });
            
        } catch (error) {
            console.error("Error applying card template:", error);
        }
    },
    createGreetingCard: async (cardSettings: CardSettings) => {
        try {
            
            // Create the base card rectangle
            const rectangle = editor.createRectangle();
            rectangle.width = cardSettings.width;
            rectangle.height = cardSettings.height;
            rectangle.fill = editor.makeColorFill(convertColor(cardSettings.backgroundColor));
            
            if (cardSettings.borderColor && cardSettings.borderWidth) {
                rectangle.stroke = editor.makeStroke({
                    color: convertColor(cardSettings.borderColor),
                    width: cardSettings.borderWidth
                });
            }

            if (cardSettings.hasRoundedCorners && cardSettings.cornerRadius) {
                rectangle.setUniformCornerRadius(cardSettings.cornerRadius);
            }
            
            // Position the rectangle with slight offset from edges to prevent border cutoff
            const borderOffset = cardSettings.borderWidth ? cardSettings.borderWidth * 1.5 : 10;
            rectangle.setPositionInParent(
                { x: borderOffset, y: borderOffset },
                { x: 0, y: 0 }
            );

            // Add the rectangle to the document
            const insertionParent = editor.context.insertionParent;
            insertionParent.children.append(rectangle);            
        } catch (error) {
            console.error("Error creating greeting card:", error);
        }
    },

    addText: async (text: string, styles: TextStyles) => {
        try {         
            const fontObj = await getAvailableFont(styles.fontFamily);
   
            // Apply text styles
            await editor.queueAsyncEdit(async () => {
                const textNode = editor.createText();
                const textContent = textNode.fullContent;
                textContent.text = text;
                
                if (styles.fontFamily) {                                    
                    if (fontObj) {
                        textContent.applyCharacterStyles({
                            fontSize: styles.fontSize || 24,
                            color: styles.fontColor ? convertColor(styles.fontColor) : colorUtils.fromRGB(0, 0, 0, 1),
                            font: fontObj
                        });
                    } else {
                        textContent.applyCharacterStyles({
                            fontSize: styles.fontSize || 24,
                            color: styles.fontColor ? convertColor(styles.fontColor) : colorUtils.fromRGB(0, 0, 0, 1)
                        });
                    }
                } else {
                    textContent.applyCharacterStyles({
                        fontSize: styles.fontSize || 24,
                        color: styles.fontColor ? convertColor(styles.fontColor) : colorUtils.fromRGB(0, 0, 0, 1)
                    });
                }
            

                // Set alignment
                if (styles.alignment === 'left') {
                    textNode.textAlignment = 1; // Left
                } else if (styles.alignment === 'right') {
                    textNode.textAlignment = 2; // Right
                } else {
                    textNode.textAlignment = 3; // Center (default)
                }

                // Set position
                if (styles.position) {
                    textNode.setPositionInParent(
                        { x: styles.position.x, y: styles.position.y },
                        { x: 0, y: 0 }
                    );
                }

                // Add the text to the document
                const insertionParent = editor.context.insertionParent;
                insertionParent.children.append(textNode);
            });
        } catch (error) {
            console.error("Error adding text:", error);
        }
    },

    updateTextStyles: async (textId: string, styles: TextStyles) => {
        try {
            // This is a simplified implementation - in a real-world scenario,
            // we would need to find the correct text node by ID, which would require
            // some kind of metadata tracking system
            console.warn("updateTextStyles is not fully implemented yet");
        } catch (error) {
            console.error("Error updating text styles:", error);
        }
    },

    addRectangle: (rect: RectangleProps) => {
        try {
            const rectangle = editor.createRectangle();
            rectangle.width = rect.width;
            rectangle.height = rect.height;
            
            if (rect.fill) {
                rectangle.fill = editor.makeColorFill(convertColor(rect.fill));
            }
            
            if (rect.stroke) {
                rectangle.stroke = createStroke(rect.stroke);
            }
            
            if (rect.cornerRadius) {
                rectangle.setUniformCornerRadius(rect.cornerRadius);
            }
            
            // Set position
            rectangle.setPositionInParent(
                { x: rect.position.x, y: rect.position.y },
                { x: 0, y: 0 }
            );
            
            // Add the rectangle to the document
            const insertionParent = editor.context.insertionParent;
            insertionParent.children.append(rectangle);
        } catch (error) {
            console.error("Error adding rectangle:", error);
        }
    },

    addEllipse: (ellipse: EllipseProps) => {
        try {
            const ellipseNode = editor.createEllipse();
            ellipseNode.rx = ellipse.radiusX;
            ellipseNode.ry = ellipse.radiusY;
            
            if (ellipse.fill) {
                ellipseNode.fill = editor.makeColorFill(convertColor(ellipse.fill));
            }
            
            if (ellipse.stroke) {
                ellipseNode.stroke = createStroke(ellipse.stroke);
            }
            
            // Set position
            ellipseNode.setPositionInParent(
                { x: ellipse.position.x, y: ellipse.position.y },
                { x: 0, y: 0 }
            );
            
            // Add the ellipse to the document
            const insertionParent = editor.context.insertionParent;
            insertionParent.children.append(ellipseNode);
        } catch (error) {
            console.error("Error adding ellipse:", error);
        }
    },

    addLine: (line: LineProps) => {
        try {
            const lineNode = editor.createLine();
            lineNode.setEndPoints(line.startX, line.startY, line.endX, line.endY);
            
            lineNode.stroke = createStroke(line.stroke);
            
            // Add the line to the document
            const insertionParent = editor.context.insertionParent;
            insertionParent.children.append(lineNode);
        } catch (error) {
            console.error("Error adding line:", error);
        }
    }
};

// Decorative elements for different card types
function addBirthdayDecoration(cardSettings: CardSettings) {
    try {
        // Add balloon decorations
        const colors = [
            { red: 0.925, green: 0.255, blue: 0.255, alpha: 1 }, // Red
            { red: 0.255, green: 0.569, blue: 0.925, alpha: 1 }, // Blue
            { red: 0.925, green: 0.749, blue: 0.255, alpha: 1 }, // Yellow
            { red: 0.255, green: 0.749, blue: 0.478, alpha: 1 }  // Green
        ];
        
        // Create balloons on the corners
        for (let i = 0; i < 4; i++) {
            const ellipse = editor.createEllipse();
            ellipse.rx = 40;
            ellipse.ry = 50;
            
            // Position in corners
            const x = i % 2 === 0 ? 60 : cardSettings.width - 100;
            // Position balloons higher in the card (especially the bottom ones)
            const y = i < 2 ? 150 : cardSettings.height - 300;
            
            // Position the ellipse (balloon)
            ellipse.setPositionInParent({ x, y }, { x: 0, y: 0 });
            ellipse.fill = editor.makeColorFill(convertColor(colors[i]));
            
            // Add string to balloon - place elements in document first, then set endpoints
            const line = editor.createLine();
            
            // First, add both elements to the document so they're properly registered
            const insertionParent = editor.context.insertionParent;
            insertionParent.children.append(ellipse);
            insertionParent.children.append(line);
            
            // Now set the line endpoints to connect exactly to the balloon's bottom center
            // Use a very precise calculation for the string connection point
            const stringWidth = 5; // Line stroke width
            // If the string appears to be offset to the left, add a small correction to the right
            const stringStartX = x + (stringWidth/2) + 32; // Small offset to the right to center the line properly
            const stringStartY = y + ellipse.ry+100; // Bottom of the balloon
            const stringEndY = y + 100; // How far down the string goes
            
            line.setEndPoints(stringStartX, stringStartY, stringStartX, stringEndY);
            line.stroke = editor.makeStroke({
                color: colorUtils.fromRGB(0.2, 0.2, 0.2, 1),
                width: stringWidth
            });
        }
    } catch (error) {
        console.error("Error adding birthday decoration:", error);
    }
}

function addValentineDecoration(cardSettings: CardSettings) {
    try {
        // Add heart decorations
        const heartColor = { red: 0.863, green: 0.078, blue: 0.235, alpha: 1 }; // Deep Red          
        const heartPath = "M118.688,218.122l0.387,0.488c105.47-42.577,146.111-141.276,99.665-183.853c-46.45-42.577-99.665,15.476-99.665,15.476h-0.387c0,0-53.22-58.054-99.665-15.476C-27.422,76.546,13.219,175.546,118.688,218.122z";
        const heartNode = editor.createPath(heartPath);
        heartNode.fill = editor.makeColorFill(colorUtils.fromHex("#FF0000"));
        
        // Center the heart in the card
        heartNode.setPositionInParent(
            { x: cardSettings.width / 2-100, y: heartNode.centerPointLocal.y+100 }, 
            { x: 0, y: 0 }  // Use center point as registration point
        );
        
        editor.context.insertionParent.children.append(heartNode);

    } catch (error) {
        console.error("Error adding valentine decoration:", error);
    }
}

function addHolidayDecoration(cardSettings: CardSettings) {
    try {
        // Add snowflakes or other holiday decorations
        const snowflakeColor = { red: 1, green: 1, blue: 1, alpha: 0.8 }; // white
        //const snowflakeColor = { red: 0.984, green: 0.831, blue: 0.243, alpha: 1 }
        
        // Create simple snowflakes using lines
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * cardSettings.width;
            const y = Math.random() * cardSettings.height;
            const size = 15 + Math.random() * 15;
            
            // Create snowflake lines
            for (let j = 0; j < 3; j++) {
                const line = editor.createLine();
                const angle = j * Math.PI / 3;
                const startX = x - Math.cos(angle) * size;
                const startY = y - Math.sin(angle) * size;
                const endX = x + Math.cos(angle) * size;
                const endY = y + Math.sin(angle) * size;
                
                line.setEndPoints(startX, startY, endX, endY);
                line.stroke = editor.makeStroke({
                    color: convertColor(snowflakeColor),
                    width: 2
                });
                
                // Add to document
                const insertionParent = editor.context.insertionParent;
                insertionParent.children.append(line);
            }
        }
    } catch (error) {
        console.error("Error adding holiday decoration:", error);
    }
}

// Expose the API to the UI
function start(): void {
    runtime.exposeApi(sandboxApi);
}

start();
