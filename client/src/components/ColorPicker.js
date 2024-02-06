import React, { useState, useEffect } from "react";

function ColorPicker( { onColorChange } ){

    const [color, setColor] = useState('#COLOR');

    function handleColorChange( event ){
        const newColor = event.target.value;
        setColor(newColor);
        onColorChange(newColor); // Seçilen rengi ana bileşene aktar    
    };
    return(<div className="color-picker-container">
        <input 
            type="color"
            placeholder="#Color"
            value={color}
            onChange={handleColorChange}>
        </input>

    </div>)
    
} 


export default ColorPicker;