// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import { ButtonGroup } from '@swc-react/button-group';
import { FieldLabel } from '@swc-react/field-label';
import { MenuItem } from '@swc-react/menu';
import { Picker } from '@swc-react/picker';
import { Slider } from '@swc-react/slider';
import { Swatch } from '@swc-react/swatch';
import { Switch } from "@swc-react/switch";

import React, { useState, useRef } from "react";
import "./App.css";
import { WC } from "./WC.jsx";

const App = ({ addOnUISdk }) => {    
    // State variables to hold component values
    const [bgColor, setBgColor] = useState("#f2f2f2");
    const [bgColorSwatch, setBgColorSwatch] = useState("#f2f2f2");

    const [fgColor, setFgColor] = useState("#5258e5");
    const [fgColorSwatch, setFgColorSwatch] = useState("#5258e5");

    const [titleColor, setTitleColor] = useState("#000000");
    const [titleColorSwatch, setTitleColorSwatch] = useState("#000000");
    
    const [gridColor, setGridColor] = useState("#5258e5");
    const [gridColorSwatch, setGridColorSwatch] = useState("#5258e5");

    const [fontWeightPicker, setFontWeightPicker] = useState("normal");
    const [freeSpaceToggle, setFreeSpaceToggle] = useState(true);
    const [gridlineSize, setGridlineSize] = useState(5);
    const [addToPageEnabled, setAddToPageEnabled] = useState(false);
    
    // Refs to the UI elements for colors, add button and HTML canvas
    const fgColorInput = useRef(null);
    const bgColorInput = useRef(null);
    const gridColorInput = useRef(null);
    const titleColorInput = useRef(null);
    const bingoCanvas = useRef(null);

    // Function to generate the bingo card using an HTML canvas and drawing context 
    function generateBingoCard() {              
        const ctx = bingoCanvas.current.getContext("2d");

        // Set canvas width and height
        bingoCanvas.current.width = 300;
        bingoCanvas.current.height = 360;
        
        // Set grid properties            
        const numRows = 6;
        const numCols = 5;
        const cellWidth = 60;
        const cellHeight = 60;
                        
        // Fill background boxes with selected bg color
        ctx.fillStyle = bgColor; 
        for (let x = gridlineSize/2; x <= bingoCanvas.current.width; x += cellWidth-gridlineSize) {            
            for (let y = gridlineSize/2; y <= bingoCanvas.current.height; y += cellHeight-gridlineSize) {
                ctx.fillRect(x, y, cellWidth, cellHeight);
            }
        }                        
        
        
        // Draw gridlines
        ctx.lineWidth = gridlineSize; 
        let x=0;
        let y=0;
        for (let i = 0; i <= numCols; i++) {        
            // Need to adjust for left/right gridlines size
            if (i===0) {
                ctx.moveTo(gridlineSize/2, 0);
                ctx.lineTo(gridlineSize/2, bingoCanvas.current.height);
            }
            else {
                ctx.moveTo(i * cellWidth-gridlineSize/2, 0);
                ctx.lineTo(i * cellWidth-gridlineSize/2, bingoCanvas.current.height);
                
            }
        }
        
        for (let i = 0; i <= numRows; i++) { 
            // Need to adjust for top/bottom gridlines size               
            if (i===0) {
                ctx.moveTo(0, gridlineSize/2);
                ctx.lineTo(bingoCanvas.current.height, gridlineSize/2,);
            }
            else {
                ctx.moveTo(0, i * cellWidth-gridlineSize/2);
                ctx.lineTo(bingoCanvas.current.height, i * cellWidth-gridlineSize/2);                    
            }                    
        }
        ctx.strokeStyle = gridColor; // Gridlines color
        ctx.stroke();                        
                            
        // Draw bingo title
        ctx.font = fontWeightPicker +' 28px adobe clean';    
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle'; 
                
        ctx.fillStyle = titleColor; // title font color                       
        let bingoTitle = ['B','I','N','G','O'];
        for (let charCnt = 0; charCnt < bingoTitle.length; charCnt++) {
            let letter = bingoTitle[charCnt];
            ctx.fillText(letter, charCnt * cellWidth + cellWidth / 2, cellHeight / 2 + 6);                
        }       
        
        // Fill in the card with random numbers and a free space if checked
        const freeSpace = [3, 2]; // Coordinates of the FREE space
        const numbers = [];
        const usedNumbers = new Set(); // Track used numbers
        ctx.font = fontWeightPicker +' 22px adobe clean';
        ctx.fillStyle = fgColor; // color of the foreground (numbers)                 
                
        for (let i = 1; i < numRows; i++) {
            numbers[i] = [];
            for (let j = 0; j < numCols; j++) {
                if (freeSpaceToggle) {
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
        if (freeSpaceToggle) {
            ctx.font = fontWeightPicker +' 20px adobe clean';     
            ctx.fillText("FREE", freeSpace[1] * cellWidth + cellWidth / 2 - 3, freeSpace[0] * cellHeight + cellHeight / 2 + 3);            
        }    
            
        // Enable drag and drop for the card
        addOnUISdk.app.enableDragToDocument(bingoCanvas.current, {
            previewCallback: el => new URL(bingoCanvas.current.toDataURL()),
            completionCallback: async el => {
                const r = await fetch(bingoCanvas.current.toDataURL());
                const blob = await r.blob();
                return [{blob}];
            }
        })        

        // Enable add card button
        setAddToPageEnabled(true);        
    }
    
    // Trigger click on the native color picker input for each
    function onBgColorClick(e) {
        bgColorInput.current.click();
    }

    function onFgColorClick(e) {        
        fgColorInput.current.click();
    }
    
    function onTitleColorClick(e) {        
        titleColorInput.current.click();
    }

    function onGridColorClick(e) {        
        gridColorInput.current.click();
    }

    // Update the state values with the color selected from the native color picker for each
    function onFgColorChange(e) {        
        setFgColorSwatch(e.target.value);
        setFgColor(e.target.value);        
    }    

    function onBgColorChange(e) {        
        setBgColorSwatch(e.target.value);
        setBgColor(e.target.value);        
    }

    function onTitleColorChange(e) {        
        setTitleColorSwatch(e.target.value);
        setTitleColor(e.target.value);        
    }        

    function onGridColorChange(e) {        
        setGridColorSwatch(e.target.value);
        setGridColor(e.target.value);        
    }
    
    async function handleAddToPage() {        
        const blob = await new Promise((resolve, reject) => {
            bingoCanvas.current.toBlob(blob => { resolve(blob); })
        })
        addOnUISdk.app.document.addImage(blob);            
    }

    return (
        // Please note that the below "<Theme>" component does not react to theme changes in Express.
        // You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.        
        <Theme theme="express" scale="medium" color="light">
            {/* <h3>Customize a bingo card</h3> */}
            <div className="container">
            <div className="row gap-20">             
                <div className="column">
                    <FieldLabel size="l">Background color</FieldLabel>
                    <WC onChange={onBgColorClick}>
                        <Swatch className="color-well" color={bgColorSwatch}></Swatch>
                    </WC>
                    <input ref={bgColorInput} type="color" style={{display: "none"}}
                        value={bgColor} onChange={onBgColorChange}
                    />
                </div>
                <div className="column">
                    <FieldLabel size="l">Number color</FieldLabel>
                    <WC onChange={onFgColorClick}>
                        <Swatch className="color-well" color={fgColorSwatch}></Swatch>
                    </WC>
                    <input ref={fgColorInput} type="color" style={{display: "none"}}
                        value={fgColor} onChange={onFgColorChange}
                    />                        
                </div>                                                       
                <div className="column">
                    <FieldLabel size="l">Title color</FieldLabel>
                    <WC onChange={onTitleColorClick}>
                        <Swatch className="color-well" color={titleColorSwatch}></Swatch>
                    </WC>
                    <input ref={titleColorInput} type="color" style={{display: "none"}}
                        value ={titleColor} onChange={onTitleColorChange}
                    />                    
                </div>                                
            </div>
            <div className="row gap-20">
                <div className="column margin-top-10">
                    <FieldLabel size="l">Font Weight</FieldLabel>
                    <Picker size="m" value={fontWeightPicker} 
                        change={event => setFontWeightPicker(event.target.value)}>
                        <MenuItem value="normal">Normal</MenuItem>                        
                        <MenuItem value="bold">Bold</MenuItem>                            
                        <MenuItem value="lighter">Lighter</MenuItem>                
                    </Picker>
                </div>  
                <div className="column">
                    <WC onChange={event => setFreeSpaceToggle(event.target.checked)}>
                        <Switch emphasized checked={freeSpaceToggle} size="l">Free space</Switch>
                    </WC>
                </div>         
            </div>
            <div className="row gap-20">                                
                <WC onChange={event => setGridlineSize(event.target.value)}>
                    <Slider label="Gridlines size" variant="filled" editable value={gridlineSize}
                        hide-stepper min="1" max="10"
                        format-options='{"style": "unit", "unit": "px"}' step="1">
                    </Slider>
                </WC>                                 
                <div className="column">
                    <FieldLabel size="l">Color</FieldLabel>
                    <WC onChange={onGridColorClick}>
                        <Swatch className="color-well" color={gridColorSwatch}></Swatch>
                    </WC>
                    <input ref={gridColorInput} type="color" style={{display: "none"}}
                        value={gridColor} onChange={onGridColorChange}
                    />
                </div>                    
            </div>                 
            <div>
                <ButtonGroup horizontal>
                    <Button onClick={generateBingoCard}>Generate card</Button>
                    <Button onClick={handleAddToPage} disabled={!addToPageEnabled} variant="secondary">Add to page</Button>
                </ButtonGroup>              
            </div>                
            <div className="margin-top-10">                        
                <canvas ref={bingoCanvas}/>            
            </div> 
        </div>                                        
        </Theme>
    );
};

export default App;
