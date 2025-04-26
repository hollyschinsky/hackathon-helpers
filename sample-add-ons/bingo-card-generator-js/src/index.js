import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

/* Theme and typography imports */
import '@spectrum-web-components/styles/typography.css';
import '@spectrum-web-components/theme/express/theme-light.js';
import '@spectrum-web-components/theme/express/scale-medium.js';
import '@spectrum-web-components/theme/sp-theme.js';

import "@spectrum-web-components/button/sp-button.js";
import "@spectrum-web-components/button-group/sp-button-group.js";
import "@spectrum-web-components/field-label/sp-field-label.js";
import '@spectrum-web-components/menu/sp-menu.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import "@spectrum-web-components/number-field/sp-number-field.js";
import '@spectrum-web-components/picker/sp-picker.js';
import "@spectrum-web-components/slider/sp-slider.js";
import "@spectrum-web-components/swatch/sp-swatch.js";
import '@spectrum-web-components/switch/sp-switch.js';

// Wait for the SDK to be ready
addOnUISdk.ready.then(() => {        
    console.log("addOnUISdk is ready for use.");    
    
    // Refs to the <sp-swatch> and <input> elements for each color
    const gridlinesColorSwatch = document.getElementById("gridlinesColorSwatch");
    const gridlinesColorPicker = document.getElementById("gridlinesColorPicker");
    
    const bgColorSwatch = document.getElementById("bgColorSwatch");        
    const bgColorPicker = document.getElementById("bgColorPicker");
    
    const fgColorSwatch = document.getElementById("fgColorSwatch");
    const fgColorPicker = document.getElementById("fgColorPicker");

    const titleColorSwatch = document.getElementById("titleColorSwatch");
    const titleColorPicker = document.getElementById("titleColorPicker");
    
    // Initialize colors for the above
    gridlinesColorPicker.value = "#5258e5"; // gridline color   
    gridlinesColorSwatch.color = "#5258e5"; // gridline color   
    bgColorPicker.value = "#f2f2f2";        // box background color
    bgColorSwatch.color = "#f2f2f2";        // box background color
    fgColorPicker.value = "#5258e5";        // bingo number color
    fgColorSwatch.color = "#5258e5";        // bingo number color
    titleColorPicker.value = "#000000";     // title color
    titleColorSwatch.color = "#000000";     // title color
  
    // Trigger click on the native color pickers for each
    gridlinesColorSwatch.addEventListener("click", function () {
        gridlinesColorPicker.click();
    });
  
    gridlinesColorPicker.addEventListener("input", function (event) {
      const selectedColor = event.target.value;
      gridlinesColorSwatch.setAttribute("color", selectedColor);
    });

    fgColorSwatch.addEventListener("click", function () {
        fgColorPicker.click();
    });

    fgColorPicker.addEventListener("input", function (event) {
        const selectedColor = event.target.value;
        fgColorSwatch.setAttribute("color", selectedColor);
    });
  
    bgColorSwatch.addEventListener("click", function () {
      bgColorPicker.click();
    });
  
    bgColorPicker.addEventListener("input", function (event) {
      const selectedColor = event.target.value;
      bgColorSwatch.setAttribute("color", selectedColor);
    });
  
    titleColorSwatch.addEventListener("click", function () {
        titleColorPicker.click();
    });
  
    titleColorPicker.addEventListener("input", function (event) {
      const selectedColor = event.target.value;
      titleColorSwatch.setAttribute("color", selectedColor);
    });
  
    // CTA button references
    const generateBtn = document.getElementById("generateBtn");  
    const addBtn = document.getElementById("addBtn");  
  
    // Generate button handler
    generateBtn.onclick = async (event) => {                    
      generateBingoCard();              
    };
  
    /* Enable the generate button now that the SDK is ready and the button event handler has been registered. The add to page button should only be enabled once a card has been generated. */
    generateBtn.disabled = false;        
});

// Function to generate the bingo card using an HTML canvas and drawing context 
function generateBingoCard() {
    const canvas = document.getElementById("bingoCanvas");
    const ctx = canvas.getContext("2d");

    // Set canvas width and height
    canvas.width = 300;
    canvas.height = 360;

    // Set grid properties    
    let gridlineSize = document.getElementById("gridlineSize").value;        
    const numRows = 6;
    const numCols = 5;
    const cellWidth = 60;
    const cellHeight = 60;
    
    // Draw background rects with user selected color
    ctx.fillStyle = bgColorPicker.value; 
    for (let x = gridlineSize/2; x <= canvas.width; x += cellWidth-gridlineSize) {            
        for (let y = gridlineSize/2; y <= canvas.height; y += cellHeight-gridlineSize) {
            ctx.fillRect(x, y, cellWidth, cellHeight);                
        }
    } 
    
    // Draw gridlines
    ctx.lineWidth = gridlineSize;
    for (let i = 0; i <= numCols; i++) {        
        // Need to adjust for left/right gridlines size           
        ctx.moveTo(gridlineSize/2, 0);
        ctx.lineTo(gridlineSize/2, canvas.height);      

        ctx.moveTo(i * cellWidth-gridlineSize/2, 0);
        ctx.lineTo(i * cellWidth-gridlineSize/2, canvas.height);        
    }

    for (let i = 0; i <= numRows; i++) { 
        // Need to adjust for top/bottom gridlines size               
        ctx.moveTo(0, gridlineSize/2);
        ctx.lineTo(canvas.height, gridlineSize/2,);            
    
        ctx.moveTo(0, i * cellWidth-gridlineSize/2);
        ctx.lineTo(canvas.height, i * cellWidth-gridlineSize/2);                    
    }
    
    ctx.strokeStyle = gridlinesColorPicker.value;        
    ctx.stroke();
    
    // Draw bingo title
    ctx.font = fontWeightPicker.value +' 28px adobe clean';    
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle'; 
    ctx.fillStyle = titleColorPicker.value; //font color                        
    let bingoTitle = ['B','I','N','G','O'];
    for (let charCnt = 0; charCnt < bingoTitle.length; charCnt++) {
        let letter = bingoTitle[charCnt];
        ctx.fillText(letter, charCnt * cellWidth + cellWidth / 2 - 4, cellHeight / 2 + 8);    
    }       
    
    // Generate random numbers
    const freeSpace = [3, 2]; // Coordinates of the FREE space
    const numbers = [];
    const usedNumbers = new Set(); // Track used numbers
    ctx.font = fontWeightPicker.value +' 22px adobe clean';
    ctx.fillStyle = fgColorPicker.value; // color of the numbers 
    ctx.textAlign = "center";
    const freeSpaceToggle = document.getElementById("freeSpaceToggle");
    
    for (let i = 1; i < numRows; i++) {
        numbers[i] = [];
        for (let j = 0; j < numCols; j++) {
            if (freeSpaceToggle.checked) {
                if (i === freeSpace[0] && j === freeSpace[1]) {
                    numbers[i][j] = "FREE";
                    continue; // Skip the FREE space
                }
            }

            let num;
            do {
                num = Math.floor(Math.random() * 15) + 1 + (j * 15);
            } while (usedNumbers.has(num)); // Generate unique numbers

            usedNumbers.add(num);
            numbers[i][j] = num;        
            ctx.fillText(num, j * cellWidth + cellWidth / 2 - 3, i * cellHeight + cellHeight / 2 + 3);
        }
    }

    // Draw "FREE" if the toggle is checked
    if (freeSpaceToggle.checked) {
        ctx.font = fontWeightPicker.value +' 20px adobe clean';     
        ctx.fillText("FREE", freeSpace[1] * cellWidth + cellWidth / 2 - 3, freeSpace[0] * cellHeight + cellHeight / 2 + 3);   
        ctx.drawImage(canvas, 0, 0);
    }    

    // Enable drag and drop for the card
    addOnUISdk.app.enableDragToDocument(canvas, {
        previewCallback: el => new URL(canvas.toDataURL()),
        completionCallback: async el => {
            const r = await fetch(canvas.toDataURL());
            const blob = await r.blob();
            return [{blob}];
        }
    })    
            
    // Add button click handler
    addBtn.onclick = async () => {      
        const r = await fetch(canvas.toDataURL());
        const blob = await r.blob();    
        addOnUISdk.app.document.addImage(blob);  
    }

    // Enable the add to page button    
    addBtn.disabled = false;
}
