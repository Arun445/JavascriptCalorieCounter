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
      { id: 2, meal: "pancake", calories: 600 },
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
  };
})();

//--------------------------------------------UI controler --------------------------------------------

const UICtrl = (function () {
  //SelectorList
  const UISelectors = {
    mealInput: "#item-name",
    caloriesInput: "#item-calories",
    itemList: "#item-list",
  };
  return {
    showItems: function (items) {
      let html = "";
      items.forEach((item) => {
        html += `
            <li class="collection-item" id='item-${item.id}' ><strong>${item.meal}:</strong> ${item.calories} calories 
            <a class='secondary-content'><i class='edit-item fa fa-pencil-alt'></i></a></li>
            `;
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
  };
})();

//-------------------------------------------- App controler --------------------------------------------

const AppCtrl = (function (ItemCtrl, UICtrl) {
  return {
    init: function () {
      const items = ItemCtrl.getItems();
      UICtrl.showItems(items);
    },
  };
})(ItemCtrl, UICtrl);

AppCtrl.init();
