//--------------------------------------------Storage controler--------------------------------------------
const StorageCtrl = (function () {
  return {
    storeItem: function (item) {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getStorageItems: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateStorageItem: function (meal, calories) {
      const currentItem = ItemCtrl.getCurrentItem();
      const items = StorageCtrl.getStorageItems();
      items.forEach((item) => {
        if (item.id === currentItem.id) {
          item.meal = meal;
          item.calories = parseInt(calories);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteStorageItem: function () {
      const currentItem = ItemCtrl.getCurrentItem();
      const items = StorageCtrl.getStorageItems();
      items.forEach((item, index) => {
        if (currentItem.id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearallStorageitems: function () {
      localStorage.removeItem("items");
    },
  };
})();
//--------------------------------------------Item controler --------------------------------------------

const ItemCtrl = (function () {
  // Item constructor
  const Item = function (id, meal, calories) {
    this.id = id;
    this.meal = meal;
    this.calories = calories;
  };
  const data = {
    items: StorageCtrl.getStorageItems(),
    currentItem: null,
    totalCalories: 0,
  };
  return {
    logData: function () {
      return data;
    },
    getItems: function () {
      const items = data.items;
      return items;
    },
    addItem: function (meal, calories) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      calories = parseInt(calories);
      const newItem = new Item(ID, meal, calories);
      data.items.push(newItem);

      UICtrl.clearInput();
      return newItem;
    },
    updateItem: function (item) {
      const currentItem = data.currentItem;
      const index = data.items.indexOf(currentItem);
      currentItem.meal = item.item;
      currentItem.calories = parseInt(item.calories);
      data.items.splice(index, 1, currentItem);
      StorageCtrl.updateStorageItem(item.item, parseInt(item.calories));
    },
    calculateTotalCalories: function () {
      let totalCalories = 0;
      data.items.forEach((item) => {
        totalCalories += item.calories;
      });
      data.totalCalories = totalCalories;
      return totalCalories;
    },
    getItemById: function (id) {
      let found;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    deleteCurrentItem: function () {
      data.items.forEach((item, index) => {
        if (item.id === data.currentItem.id) {
          data.items.splice(index, 1);
        }
      });
    },
    clearAllItems: function () {
      data.items = [];
    },
  };
})();

//--------------------------------------------UI controler --------------------------------------------

const UICtrl = (function () {
  //SelectorList
  const UISelectors = {
    mealInput: "#item-name",
    caloriesInput: "#item-calories",
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    totalCalories: ".total-calories",
    clearBtn: ".clear-btn",
  };
  return {
    showItems: function (items) {
      let html = "";
      items.forEach((item) => {
        html += `
            <li class="collection-item" id='item-${item.id}' ><strong>${item.meal}:</strong> ${item.calories} calories 
            <a href='#' class='secondary-content'><i class='edit-item fa fa-pencil-alt'></i></a></li>
            `;
      });

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    showTotalCalories: function () {
      const calories = ItemCtrl.calculateTotalCalories();
      document.querySelector(UISelectors.totalCalories).textContent = calories;
    },
    notEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.addBtn).style.display = "inline";
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
    },
    editState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function () {
      return UISelectors;
    },
    getInput: function () {
      return {
        item: document.querySelector(UISelectors.mealInput).value,
        calories: document.querySelector(UISelectors.caloriesInput).value,
      };
    },
    addListItem: function (item) {
      document.querySelector(UISelectors.itemList).style.display = "block";
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.meal}:</strong> ${item.calories} calories 
      <a href='#' class='secondary-content'><i class='edit-item fa fa-pencil-alt'></i></a>`;
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: function () {
      document.querySelector(UISelectors.mealInput).value = "";
      document.querySelector(UISelectors.caloriesInput).value = "";
    },
    editInput: function () {
      document.querySelector(
        UISelectors.mealInput
      ).value = ItemCtrl.getCurrentItem().meal;
      document.querySelector(
        UISelectors.caloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
  };
})();

//-------------------------------------------- App controler --------------------------------------------

const AppCtrl = (function (ItemCtrl, StorageCtrl, UICtrl) {
  const loadEventListeners = function () {
    const UISelectors = UICtrl.getSelectors();

    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", submitInput);

    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", editState);

    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", updateSubmit);

    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", deleteMeal);

    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", returnBack);

    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAll);
  };
  const submitInput = function () {
    const items = UICtrl.getInput();
    const meal = items.item;
    const calories = items.calories;
    if (meal !== "" && calories !== "") {
      const newItem = ItemCtrl.addItem(meal, calories);
      UICtrl.addListItem(newItem);
      UICtrl.showTotalCalories();

      StorageCtrl.storeItem(newItem);
    }
  };
  const editState = function (e) {
    if (e.target.classList.contains("edit-item")) {
      //Get the id of a li element thats is the same as the meal item
      const listId = e.target.parentElement.parentElement.id;
      const listIdArr = listId.split("-");
      //Make it an integer
      const id = parseInt(listIdArr[1]);
      const itemToEdit = ItemCtrl.getItemById(id);
      //function sets the current item to the item you wanna edit
      ItemCtrl.setCurrentItem(itemToEdit);
      //takes the current item and fills in the input of the item you wanna edit
      UICtrl.editInput();
      //Changes the buttons to submit your edit
      UICtrl.editState();
    }

    e.preventDefault();
  };
  const updateSubmit = function (e) {
    //get updated input from UI
    const newInput = UICtrl.getInput();
    //update that data to data  Structure
    ItemCtrl.updateItem(newInput);
    //show all meals in UI
    UICtrl.showItems(ItemCtrl.getItems());
    //update total calories in UI
    UICtrl.showTotalCalories();
    //disable the edit state
    UICtrl.notEditState();

    e.preventDefault();
  };
  const deleteMeal = function (e) {
    StorageCtrl.deleteStorageItem();
    //delete the current item you want to edit
    ItemCtrl.deleteCurrentItem();
    //update total calories in UI
    UICtrl.showTotalCalories();
    //show all meals UI
    UICtrl.showItems(ItemCtrl.getItems());
    //disable the edit state in UI
    UICtrl.notEditState();
    e.preventDefault();
  };
  const returnBack = function () {
    UICtrl.notEditState();
  };
  const clearAll = function () {
    StorageCtrl.clearallStorageitems();
    ItemCtrl.clearAllItems();
    //update total calories in UI
    UICtrl.showTotalCalories();
    //show all meals UI
    UICtrl.showItems(ItemCtrl.getItems());
    // Hides the list
    UICtrl.hideList();
  };
  return {
    init: function () {
      const items = ItemCtrl.getItems();
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.showItems(items);
      }
      UICtrl.notEditState();
      UICtrl.showTotalCalories();

      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

AppCtrl.init();
