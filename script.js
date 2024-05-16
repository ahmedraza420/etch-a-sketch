const sketchBoard = document.querySelector("#sketchBoard");
const colorPicker = document.querySelector('#colorPicker');
const gridSize = document.querySelector('#gridSize');
const gridSizeLabel = document.querySelector("#gridLabel");
const menuButtons = document.querySelectorAll(".menuButton");
const colorButton = document.querySelector('#colorPickerButton');
const eraserButton = document.querySelector("#eraserButton");
const clearButton = document.querySelector("#clearButton");
let bgColor = document.querySelector("body").style.backgroundColor;
let textColor = document.querySelector("body").style.color;

const DEFAULT_COL = sketchBoard.style.backgroundColor; 
let color = colorPicker.value;
let theme = document.querySelector('body').classList[0];
let mode = 'color';

focusButton(colorButton);
setGrid(gridSize.value);
gridSize.addEventListener('input', ()=>{gridSizeLabel.innerText = `${gridSize.value} x ${gridSize.value}`;});
gridSize.addEventListener('click', ()=>{clearGrid();
    setGrid(gridSize.value)});
colorPicker.addEventListener('input', () => {color = colorPicker.value});
colorButton.addEventListener('click', (e) => {mode = 'color';
    focusButton(e.target)});
eraserButton.addEventListener('click', (e) => {mode = 'eraser';
    focusButton(e.target)});
clearButton.addEventListener('click', ()=> {clearGrid();
    setGrid(gridSize.value);});

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
    if(theme === 'light') target.classList.add("modeactivelight")
    else target.classList.add("modeactivedark")}
function clearGrid() {sketchBoard.innerHTML ='';}