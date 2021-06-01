const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false ;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays =[];

// Drag Functionality
let draggedItem;
let dragging = false ;
let currentColumn;


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays =[backlogListArray,progressListArray,completeListArray,onHoldListArray];
  const arrayNames = ['backlog','progress','complete','onHold'];
  arrayNames.forEach((arrayName,index)=>{
    localStorage.setItem(`${arrayName}Items`,JSON.stringify(listArrays[index]));
  });
  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item ;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart','drag(event)');
  listEl.contentEditable = true;
  listEl.id = index ;
  listEl.setAttribute('onfocusout',`updateItem(${index} , ${column})`);
  // Append 
  columnEl.appendChild(listEl);
}
// Filter array to remove empty items
function filterArray(array){
    const filteredArray = array.filter(item =>item !==null );
    return filteredArray ;
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad){
    getSavedColumns();
  }
  // Backlog Column
  backlogListArray = filterArray(backlogListArray);
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem,index) => {
    createItemEl(backlogList,0,backlogItem,index);
  });
  // Progress Column
  progressListArray = filterArray(progressListArray);
  progressList.textContent = '';
  progressListArray.forEach((progressItem,index) => {
    createItemEl(progressList,1,progressItem,index);
  });

  // Complete Column
  completeListArray = filterArray(completeListArray);
  completeList.textContent = '';
  completeListArray.forEach((completeItem,index) => {
    createItemEl(completeList,2,completeItem,index);
  });
  // On Hold Column
  onHoldListArray = filterArray(onHoldListArray);
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem,index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad =true ;
  updateSavedColumns();
}

// Update item -Delete if its neccessary
function updateItem(id,column){
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children ;
  if(!dragging){
    if(!selectedColumnEl[id].textContent){
      delete selectedArray[id];
    }else{
      selectedArray[id] = selectedColumnEl[id].textContent ;
    }
    updateDOM();
  }
}
// Add text to dom and save
function addToColumn(column){
  const itemText = (addItems[column].textContent);
  const selectedArray = listArrays[column];
  if(addItems[column].textContent){
    selectedArray.push(itemText);
    addItems[column].textContent = '';
    updateDOM();
  }else{
    alert('Please Put Value')
  }

}
// Show add btn box
function showInputBox(column){
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}
// Hide input box
function hideInputBox(column){
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}
// Run and allow drop and drag to reflect 
function rebuildArray(){
  // Using MAP instead of for when we want to clear array then assign new items
  // Array.from changes the HTML object(HTML collection) to the array 
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  completeListArray = Array.from(completeList.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);

  // backlogListArray = [];
  // for(let i = 0; i<backlogList.children.length ; i++){
  //   backlogListArray.push(backlogList.children[i].textContent);
  // }

  // progressListArray = [];
  // for(let i = 0; i<progressList.children.length ; i++){
  //   progressListArray.push(progressList.children[i].textContent);
  // }

  // completeListArray = [];
  // for(let i = 0; i<completeList.children.length ; i++){
  //   completeListArray.push(completeList.children[i].textContent);
  // }

  // onHoldListArray = [];
  // for(let i = 0; i<onHoldList.children.length ; i++){
  //   onHoldListArray.push(onHoldList.children[i].textContent);
  // }
  updateDOM();
}
// When item starts to dargging
function drag(event){
  draggedItem = event.target ;
  dragging = true ;
}
// Allow to drop
function allowDrop(event){
  event.preventDefault();
}
// when item enters area
function dragEnter(column){
  listColumns[column].classList.add('over');
  currentColumn = column ;
}
// Dropping items to column
function drop(event){
  event.preventDefault();
  const parent = listColumns[currentColumn];
  // Remove the over class
  listColumns.forEach(column => column.classList.remove('over'));
  // Add drag Item and drop it 
  parent.appendChild(draggedItem);
  dragging = false ;
  rebuildArray();
}

// On load
updateDOM();
