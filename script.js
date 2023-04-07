const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const btnClearAll = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector('button');
let editMode = false;

// 5. display local storage data as soon as DOMLoads
function displayItems(e) {
    const itemsFromStorage = getItemsFromStorage();

    // loop through local storage and add to dom
    itemsFromStorage.forEach((item) => addItemToDOM(item));

    clearUI();
}

// 5. delete from local storage when item is removed
function onClickItem(e) {

    // item clicked should be either remove or edited
    if (e.target.parentElement.classList.contains('remove-item')) {
        //remove
        removeItem(e.target.parentElement.parentElement);
    } else if (e.target.tagName === 'LI') {
        //edit
        setItemToEdit(e.target);
    }
}

function setItemToEdit(item) {
    editMode = true;

    //to eliminate select 1 element at a time, first we will remove edit-mode class from previous items before applying it to any new item
    document.querySelectorAll("li").forEach((i) => i.classList.remove("edit-mode"));

    item.classList.add("edit-mode");
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';

    formBtn.style.backgroundColor = "#228B22"

    itemInput.value = item.textContent;
}

//prevent adding duplicate items
function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
}

// 3. clearUI()
function clearUI() {
    // clear the enter item input (especially on reload)
    itemInput.value = '';
    itemFilter.value = '';

    const items = document.querySelectorAll('li');

    if (items.length === 0) {
        itemFilter.style.display = "none";
        btnClearAll.style.display = "none";
    } else {
        itemFilter.style.display = "block";
        btnClearAll.style.display = "block";
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = "#333";
    editMode = false;
}

//1. adding element when add Item is clicked
function createIcon(givenClass) {
    const newIcon = document.createElement('i');
    newIcon.className = givenClass;

    return newIcon;
}

function createButton(givenClass) {
    const newButton = document.createElement('button');

    newButton.className = givenClass;

    const icon = createIcon("fa-solid fa-xmark");

    newButton.appendChild(icon);

    return newButton;
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // validate that input isn't empty
    if (newItem === '') {
        alert("Please enter an item");
        return;
    }

    // check for edit mode(udpate)
    if (editMode === true) {
        // todo : remove orignal item for localStorage and DOM and udpated item to localStorage and DOM

        const orignalItem = document.querySelector(".edit-mode");

        // will remove og item from localStorage
        removeItemFromStorage(orignalItem.textContent);
        orignalItem.classList.remove("edit-mode");
        orignalItem.remove();
        editMode = false;

    } else {
        // we are checking if item already exists here because we don't want to prompt the user if he decides to edit item, but doesn't update the item name
        if (checkIfItemExists(newItem)) {
            alert("item already exists!!");
            return;
        }
    }


    // created DOM element
    addItemToDOM(newItem);

    // add item to local storage
    addItemToStorage(newItem);

    clearUI();

    itemInput.value = '';
}

// here parameter newItem is textContent
function addItemToDOM(newItem) {
    // creating a list item which will be inserted the list
    const li = document.createElement('li');

    const button = createButton("remove-item btn-link text-red");

    li.appendChild(document.createTextNode(newItem));
    li.appendChild(button);

    itemList.append(li);
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem("items") === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    }

    return itemsFromStorage;
}

function addItemToStorage(item) {
    // itemsForStorage is an array
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    // convert to json and set in the local storage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}


//2. removing element when x is clicked and remove all items if clear all button is clicked

//2.1. remove item if x is clicked, event delegation
function removeItem(item) {
    //remove item from DOM
    item.remove();

    //remove item from storage
    removeItemFromStorage(item.textContent);

    clearUI();
}

function removeItemFromStorage(itemText) {
    let itemsFromStorage = getItemsFromStorage();

    // used filter method to remove the item(filter out the item) from the itemsFromStorage array
    itemsFromStorage = itemsFromStorage.filter((i) => i !== itemText);

    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

//2.2. clear button

function clearAllItems() {
    //short method 
    // itemList.innerHTML = '';

    // clear from DOM
    if (confirm("Are you sure?")) {
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild);
        }
    }

    // clear from local storage
    //  "items" is the key all the values will be deleted, values of key "items" are the items added by the user and stored in the local storage
    localStorage.removeItem("items");
    clearUI();
}


//3. we don't want filter input and clear all button to display if list is empty, so we implement clearUI() function

// we define it above create new item function, because whenever an item is created or all elements are cleared clearUI() should run again

clearUI();


//4. make filter work, as we input inside filter, items should filter
function filterItems(e) {
    const items = document.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemText = item.textContent.toLowerCase();

        if (itemText.indexOf(text) != -1) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

// 5. add local storage, so that items won't disappear on reload 
// when an item is added : add to local storage
// when item is remove, all items are cleared or form is submite : clear item(s) from local storage

// initialize app function, so that scope ain't local

function init() {

    //event listeners
    itemForm.addEventListener("submit", onAddItemSubmit);   // will add newItem to local storage
    itemList.addEventListener("click", onClickItem);
    btnClearAll.addEventListener("click", clearAllItems);
    itemFilter.addEventListener("input", filterItems);

    document.addEventListener("DOMContentLoaded", displayItems);   // will load data saved in local storage
}

init();


