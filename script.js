const sketchBoard = document.querySelector("#sketchBoard");
const colorPicker = document.querySelector('#colorPicker');
const gridSize = document.querySelector('#gridSize');
const gridSizeLabel = document.querySelector("#gridLabel");
const menuButtons = document.querySelectorAll(".menuButton");
const colorButton = document.querySelector('#colorPickerButton');
const eraserButton = document.querySelector("#eraserButton");
// const clearButton = document.querySelector("#clearButton");
const themes = document.querySelectorAll(".themeSelector");
const themeButton = document.querySelector("#themeContainer");
const lightIcon = document.querySelector("#light");
const darkIcon = document.querySelector("#dark");
const bgColorItems = document.querySelectorAll(".bglight");
const textColorItems = document.querySelectorAll(".textlight");
const hfColorItems = document.querySelectorAll(".hflight");
const menuColorItems = document.querySelectorAll(".menulight");
const borderColorItems = document.querySelectorAll(".borderlight");
const buttonColorItems = document.querySelectorAll(".buttonlight");
// let bgColor = document.querySelector("body").style.backgroundColor;
// let textColor = document.querySelector("body").style.color;

const DEFAULT_COL = sketchBoard.style.backgroundColor; 
let color = colorPicker.value;
// let theme = themeButton.classList[0];
let currentFocusedButton;
let theme = themes[0].id;
let mode = 'color';

focusButton(colorButton);
currentFocusedButton = colorButton;
setGrid(gridSize.value);
gridSize.addEventListener('input', ()=>{gridSizeLabel.innerText = `${gridSize.value} x ${gridSize.value}`;});
gridSize.addEventListener('click', ()=>{clearGrid();
    setGrid(gridSize.value)});
colorPicker.addEventListener('input', () => {color = colorPicker.value});
colorButton.addEventListener('click', (e) => {mode = 'color';
    focusButton(e.target);
    currentFocusedButton = e.target});
eraserButton.addEventListener('click', (e) => {mode = 'eraser';
    focusButton(e.target);
    currentFocusedButton = e.target});
clearButton.addEventListener('click', ()=> {clearGrid();
    setGrid(gridSize.value);});
themeButton.addEventListener('click', toggleTheme);

function setGrid(size){for(let i=0; i<size; i++){
    const row = document.createElement('div');
    row.setAttribute('class', 'gridRow'); 
    for(let j=0; j<size; j++){
            const gridItem = document.createElement('div');
            gridItem.setAttribute('class', 'gridItem');
            gridItem.addEventListener('mouseover', sketch);
            row.appendChild(gridItem);}
    sketchBoard.appendChild(row);}}           
function sketch(element){switch(mode){
    case 'color':
        element.target.style.backgroundColor = color;
        break;
    case 'eraser':
        element.target.style.backgroundColor = DEFAULT_COL;
        break;}}
function focusButton(target){menuButtons.forEach(b => {b.classList.remove("modeactivelight", "modeactivedark")});
    if(theme === 'light') target.classList.add("modeactivelight");
    else target.classList.add("modeactivedark")}
function clearGrid() {sketchBoard.innerHTML ='';}
function toggleTheme()
{
    if(theme == 'light'){
        darkIcon.style.opacity = 0;
        lightIcon.style.opacity = 1;
        theme = 'dark';
        bgColorItems.forEach(i => switchClass(i, 'bgdark', 'bglight'));
        textColorItems.forEach(i => switchClass(i, 'textdark', 'textlight'));
        hfColorItems.forEach(i => switchClass(i, 'hfdark', 'hflight'));
        menuColorItems.forEach(i => switchClass(i, 'menudark', 'menulight'));
        borderColorItems.forEach(i => switchClass(i, 'borderdark', 'borderlight'));
        buttonColorItems.forEach(i => switchClass(i, 'buttondark', 'buttonlight'));
        switchClass(currentFocusedButton, 'modeactivedark', 'modeactivelight');
        switchClass(gridSize, 'sliderdark', 'sliderlight');
    }
    else
    {
        lightIcon.style.opacity = 0;
        darkIcon.style.opacity = 1;
        theme = 'light';
        bgColorItems.forEach(i => switchClass(i, 'bglight', 'bgdark'));
        textColorItems.forEach(i => switchClass(i, 'textlight', 'textdark'));
        hfColorItems.forEach(i => switchClass(i, 'hflight', 'hfdark'));
        menuColorItems.forEach(i => switchClass(i, 'menulight', 'menudark'));
        borderColorItems.forEach(i => switchClass(i, 'borderlight', 'borderdark'));
        buttonColorItems.forEach(i => switchClass(i, 'buttonlight', 'buttondark'));
        switchClass(currentFocusedButton, 'modeactivelight', 'modeactivedark');
        switchClass(gridSize, 'sliderlight', 'sliderdark');
    }
}
function switchClass(element, newClass, oldClass)
{
    element.classList.remove(oldClass);
    element.classList.add(newClass);
}