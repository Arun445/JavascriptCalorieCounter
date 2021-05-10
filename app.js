//--------------------------------------------Storage controler--------------------------------------------

//--------------------------------------------Item controler --------------------------------------------

const ItemCtrl = (function () {
  // Item constructor
  const Item = function (id, meal, calories) {
    this.id = id;
    this.meal = meal;
    this.calories = calories;
  };
  const data = {
    items: [
      { id: 0, meal: "steak", calories: 500 },
      { id: 1, meal: "cake", calories: 1200 },
      { id: 4, meal: "pancake", calories: 600 },
    ],
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

const AppCtrl = (function (ItemCtrl, UICtrl) {
  const loadEventListeners = function () {
    const UISelectors = UICtrl.getSelectors();

    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", submitInput);

    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", editState);
  };
  const submitInput = function () {
    const items = UICtrl.getInput();
    const meal = items.item;
    const calories = items.calories;
    if (meal !== "" && calories !== "") {
      const newItem = ItemCtrl.addItem(meal, calories);
      UICtrl.addListItem(newItem);
      UICtrl.showTotalCalories();
    }
  };
  const editState = function (e) {
    if (e.target.classList.contains("edit-item")) {
      const listId = e.target.parentElement.parentElement.id;
      const listIdArr = listId.split("-");
      const id = parseInt(listIdArr[1]);
      const itemToEdit = ItemCtrl.getItemById(id);
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.editInput();
      console.log(itemToEdit);
      UICtrl.editState();
    }

    e.preventDefault();
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
})(ItemCtrl, UICtrl);

AppCtrl.init();
