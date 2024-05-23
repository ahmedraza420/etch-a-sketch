const sketchBoard = document.querySelector("#sketchBoard");
const colorPicker = document.querySelector('#colorPicker');
const gridSize = document.querySelector('#gridSize');
const gridSizeLabel = document.querySelector("#gridLabel");
const gridSizeButton = document.querySelector("#gridSizeButton");
const colorButton = document.querySelector('#colorPickerButton');
const eraserButton = document.querySelector("#eraserButton");
const softEraserButton = document.querySelector('#softEraserButton');
const colorIntensity = document.querySelector("#colorIntensity");
const intensityButton = document.querySelector("#intensityButton");
const intensityDisplay = document.querySelector("#intensityDisplay");
const rainbowButton = document.querySelector("#rainbowButton");
const clearButton = document.querySelector("#clearButton");
const themeButton = document.querySelector("#themeContainer");
const lightIcon = document.querySelector("#light");
const darkIcon = document.querySelector("#dark");
const menuButtons = document.querySelectorAll(".menuButton");
const themes = document.querySelectorAll(".themeSelector");
const bgColorItems = document.querySelectorAll(".bglight");
const textColorItems = document.querySelectorAll(".textlight");
const menuColorItems = document.querySelectorAll(".menulight");
const sliders = document.querySelectorAll(".slider");
const borderColorItems = document.querySelectorAll(".borderlight");
const buttonColorItems = document.querySelectorAll(".buttonlight");

const DEFAULT_COL = sketchBoard.style.backgroundColor; 
const SOFT_ERASER_INTENSITY = 0.20;
let color, currentFocusedButton, pixelStart = null, pixelEnd = null, pixelClicked = false, clickReleased = false;
let theme = themes[0].id;
let mode = 'color';
let currentRainbow = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
let intensity = colorIntensity.value/100;
let currTarget = null, prevTarget = null;
let beforeMouseHover = {
    backgroundColor : null,
    opacity : 1, 
}, 
currModeColor = {
    color : null,
    eraser : DEFAULT_COL,
    rainbow : getCloseRandom(),
    intensity : color,
    soft : SOFT_ERASER_INTENSITY,
    opacity : 1,
};

focusButton(colorButton);
currentFocusedButton = colorButton;
setNewGrid(gridSize.value);
intensityDisplay.innerText = intensity * 100 + `%`;
gridSize.addEventListener('input', ()=>{
gridSizeButton.innerText = `${gridSize.value} x ${gridSize.value}`});
gridSize.addEventListener('click', ()=>{setNewGrid(gridSize.value);
    pixelClicked = false;
});
gridSizeButton.addEventListener('click', () => {setNewGrid(gridSize.value)
    pixelClicked = false;
});
colorPicker.addEventListener('input', () => {color = toRGB(colorPicker.value); currModeColor.color = color; pixelClicked = false});
colorButton.addEventListener('click', e => {mode = 'color';
    focusButton(e.target);
    });
eraserButton.addEventListener('click', e => {mode = 'eraser';
    focusButton(e.target);
    currentFocusedButton = e.target});
softEraserButton.addEventListener('click', e => {mode = 'soft';
    focusButton(e.target);
    currentFocusedButton = e.target});
rainbowButton.addEventListener('click', e => {mode = 'rainbow';
    focusButton(e.target);
    currentFocusedButton = e.target
    currModeColor.rainbow = getCloseRandom(255)});
intensityButton.addEventListener('click', e => {mode = 'intensity';
    focusButton(e.target);
    currentFocusedButton = e.target
    colorIntensity.style.display = 'flex';
});
    colorIntensity.addEventListener('input', () => {
    intensity = colorIntensity.value / 100;
    currModeColor.intensity = intensity;
});
clearButton.addEventListener('click', () => {setNewGrid(gridSize.value)
    pixelClicked = false;
});
themeButton.addEventListener('click', toggleTheme);
sketchBoard.addEventListener('touchstart', e=> {
    e.preventDefault();
    sketch(e.target, false, true);});
    sketchBoard.addEventListener('touchmove', e =>{
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    prevTarget = currTarget;
    currTarget = target;
    ((prevTarget !== currTarget) && target && sketchBoard.contains(target)) ? sketch(target, false, true) : null;});
sketchBoard.addEventListener('touchend', e => {
    pixelStart = null, pixelEnd = null;
});
sketchBoard.addEventListener('mouseleave', e => {
    pixelStart = null, pixelEnd = null;
});

const toRGB = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgb(${r}, ${g}, ${b})`;
}    
function setNewGrid(size){sketchBoard.innerHTML = '';
    for(let i=0; i<size; i++){
    const row = document.createElement('div');
    row.setAttribute('class', 'gridRow'); 
    for(let j=0; j<size; j++){
            const gridItem = document.createElement('div');
            gridItem.setAttribute('class', 'gridItem');
            gridItem.addEventListener('click', () => {
                pixelClicked == true ? pixelClicked = false : pixelClicked = true;
                pixelStart = null, pixelEnd = null;
            });
            gridItem.addEventListener('mouseover', e=> sketch(e.target));
            gridItem.addEventListener('mouseleave', e => {
                if (!pixelClicked && !clickReleased) {
                    gridItem.style.backgroundColor = beforeMouseHover.backgroundColor;
                    gridItem.style.opacity = beforeMouseHover.opacity;
                }
                clickReleased = false;
            });
            gridItem.addEventListener('mouseup', e => {clickReleased = true});
            gridItem.currOpacity = 0;
            gridItem.x = j;
            gridItem.y = i; 
            row.appendChild(gridItem);}
    sketchBoard.appendChild(row);}}           
function sketch(element, est = false, tch=false){
    if (!pixelClicked && !tch) {
        beforeMouseHover.backgroundColor = element.style.backgroundColor;
        beforeMouseHover.opacity = element.style.opacity;
        if (mode == 'intensity') {
            element.style.opacity = currModeColor.intensity + element.currOpacity;
            element.style.backgroundColor = currModeColor.color;
        }
        else if (mode == 'soft'){
            element.style.opacity = element.style.opacity - currModeColor.soft;
        }
        else {
            element.style.opacity = 1;
            element.style.backgroundColor = currModeColor[mode];    
        }
        return;}    
        if (!est)
            {
                pixelStart = pixelEnd;
                pixelEnd = element;
                if (pixelEnd != null && pixelStart != null)
                    {
                        estimate(pixelStart.x, pixelStart.y, pixelEnd.x, pixelEnd.y);
                    }
            }
    switch(mode){
    case 'color':
        element.style.backgroundColor = color;
        element.currOpacity = 0;
        element.style.opacity = 1;
        break;
    case 'eraser':
        element.style.backgroundColor = DEFAULT_COL;
        element.currOpacity = 0;
        element.style.opacity = 1;
        break;
    case 'rainbow':
        element.currOpacity = 0;
        element.style.opacity = 1;
        currModeColor.rainbow = getCloseRandom();
        element.style.backgroundColor = currModeColor.rainbow;
        break;
    case 'intensity':
        element.style.backgroundColor != color ? element.currOpacity = 0 : null;
        if (element.currOpacity + intensity <= 1)
        {
            element.currOpacity = element.currOpacity + intensity;
            currModeColor.intensity = intensity;
            element.style.backgroundColor = currModeColor.color;
        }
        else element.currOpacity = 1;
            element.style.opacity = element.currOpacity;
        break;
    case 'soft':
        if (element.style.opacity - SOFT_ERASER_INTENSITY >= 0 && element.style.backgroundColor != DEFAULT_COL){
            element.currOpacity = element.style.opacity - SOFT_ERASER_INTENSITY;
            element.style.opacity = element.currOpacity;}
        else {element.style.backgroundColor = DEFAULT_COL; element.style.opacity = 1;}}
}
function getCloseRandom (delta = 64) {
    currentRainbow[0] = Math.max(0, Math.min(255, Math.floor(currentRainbow[0] + (Math.random() - 0.5) * delta)));
    currentRainbow[1] = Math.max(0, Math.min(255, Math.floor(currentRainbow[1] + (Math.random() - 0.5) * delta)));
    currentRainbow[2] = Math.max(0, Math.min(255, Math.floor(currentRainbow[2] + (Math.random() - 0.5) * delta)));
    return `rgb(${currentRainbow[0]}, ${currentRainbow[1]}, ${currentRainbow[2]})`;
}
function estimate(x1, y1, x2, y2) // A function to interpolate pixels
{
    // similar method to DDA Line Algorithm 
    const delx = Math.abs(x1-x2), dely = Math.abs(y1 - y2);
            const maxPix = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
            const incX = delx/maxPix, incY = dely/maxPix;
            const sinx = x1 - x2 < 0 ? 1 : -1;
            const siny = y1 - y2 < 0 ? 1 : -1;
            let i = 0;
            while (i < maxPix - 1)
            {
                x1 = x1 + sinx * incX;
                y1 = y1 + siny * incY;
                sketch(getPixel(Math.floor(x1), Math.floor(y1)), true);
                i++;
            }
}
function getPixel (x, y)
{
    return sketchBoard.children[y].children[x];
}
function focusButton(target){menuButtons.forEach(b => {currentFocusedButton == target? null : b.classList.remove("modeactivelight", "modeactivedark")});
    pixelClicked = false;
    colorIntensity.style.display = 'none';
    if(theme === 'light') target.classList.add("modeactivelight");
    else target.classList.add("modeactivedark");
    currentFocusedButton = target;}
function toggleTheme()
{
    if(theme == 'light'){
        darkIcon.style.opacity = 0;
        lightIcon.style.opacity = 1;
        theme = 'dark';
        bgColorItems.forEach(i => switchClass(i, 'bgdark', 'bglight'));
        textColorItems.forEach(i => switchClass(i, 'textdark', 'textlight'));
        menuColorItems.forEach(i => switchClass(i, 'menudark', 'menulight'));
        borderColorItems.forEach(i => switchClass(i, 'borderdark', 'borderlight'));
        buttonColorItems.forEach(i => switchClass(i, 'buttondark', 'buttonlight'));
        switchClass(currentFocusedButton, 'modeactivedark', 'modeactivelight');
        sliders.forEach(i => switchClass(i, 'sliderdark', 'sliderlight'));
    }
    else
    {
        lightIcon.style.opacity = 0;
        darkIcon.style.opacity = 1;
        theme = 'light';    
        bgColorItems.forEach(i => switchClass(i, 'bglight', 'bgdark'));
        textColorItems.forEach(i => switchClass(i, 'textlight', 'textdark'));
        menuColorItems.forEach(i => switchClass(i, 'menulight', 'menudark'));
        borderColorItems.forEach(i => switchClass(i, 'borderlight', 'borderdark'));
        buttonColorItems.forEach(i => switchClass(i, 'buttonlight', 'buttondark'));
        switchClass(currentFocusedButton, 'modeactivelight', 'modeactivedark');
        sliders.forEach(i => switchClass(i, 'sliderlight', 'sliderdark'));
    }
}
function switchClass(element, newClass, oldClass)
{
    element.classList.remove(oldClass);
    element.classList.add(newClass);
}
color = toRGB(colorPicker.value);
currModeColor.color = color;
currModeColor.intensity = intensity;