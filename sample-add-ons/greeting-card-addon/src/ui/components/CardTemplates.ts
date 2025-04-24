import { CardTemplate } from "../../models/DocumentSandboxApi";

// Available card templates
export const cardTemplates: CardTemplate[] = [
    {
        id: "birthday",
        name: "Birthday Card",
        description: "A festive birthday card with a bright design",
        category: "celebration",
        order: 1
    },
    {
        id: "congratulations",
        name: "Congratulations Card",
        description: "Celebrate achievements with this vibrant card",
        category: "celebration",
        order: 2
    },
    {
        id: "valentine",
        name: "Valentine's Day",
        description: "Share your affection with this romantic design",
        category: "holiday",
        order: 3
    },   
    {
        id: "holiday",
        name: "Holiday Greetings",
        description: "Send warm wishes for the holiday season",
        category: "holiday",
        order: 4
    },    
    {
        id: "thank-you",
        name: "Thank You Card",
        description: "Express your gratitude with this elegant design",
        category: "gratitude",
        order: 5
    }, 
    
];

// Helper function to get templates by category
export function getTemplatesByCategory(category: string): CardTemplate[] {
    return cardTemplates.filter(template => template.category === category)
        .sort((a, b) => a.order - b.order);
}

// Helper function to get all categories
export function getAllCategories(): string[] {
    const categories = new Set<string>();
    
    cardTemplates.forEach(template => {
        categories.add(template.category);
    });
    
    return Array.from(categories);
} 