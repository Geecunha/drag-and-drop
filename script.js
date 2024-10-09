const store = [
  { name: "Produto 1", id: 1, price: 10 },
  { name: "Produto 2", id: 2, price: 20 },
  { name: "Produto 3", id: 3, price: 30 },
];

const cart = [];

const storeComponent = document.getElementById("store");
const cartComponent = document.getElementById("cart");
const totalComponent = document.getElementById("total");

const reloadPrices = () => {
  totalComponent.innerText = "R$ " + cart.reduce((acc, v) => acc + v.price * v.qtd, 0).toFixed(2);
};

const createCardElement = (item, isCart = false) => {
  const div = document.createElement("div");
  div.classList.add("card");
  div.id = isCart ? `cart-card-${item.id}` : `card-${item.id}`;
  div.draggable = true;
  div.innerHTML = `<p>${item.name} - R$ ${item.price}${isCart ? ` - ${item.qtd}x` : ''}</p>`;

  div.addEventListener("dragstart", (e) => e.dataTransfer.setData("id", e.target.id));

  return div;
};

const updateStoreView = () => {
  store.forEach((item) => {
      const itemDiv = document.getElementById(`card-${item.id}`);
      if (itemDiv) {
          itemDiv.style.display = "flex";
          itemDiv.classList.remove("highlight");
          if (cart.some(cartItem => cartItem.id === item.id)) {
              itemDiv.classList.remove("highlight");
          }
      }
  });
};

const updateCartView = () => {
  cartComponent.innerHTML = ""; 
  cart.forEach((item) => {
      const cartItemDiv = createCardElement(item, true);
      cartItemDiv.classList.add("highlight");
      cartComponent.append(cartItemDiv);
  });
};

const updateView = () => {
  updateStoreView();
  updateCartView();
  reloadPrices();
};

const moveItem = (type, itemId) => {
  const itemIdNum = parseInt(itemId.replace(/cart-card-|card-/, ""));
  const itemIndex = store.findIndex((item) => item.id === itemIdNum);
  const itemInCartIndex = cart.findIndex((item) => item.id === itemIdNum);

  if (itemIndex === -1) return;

  if (type === "add") {
      if (itemInCartIndex === -1) {
          cart.push({ ...store[itemIndex], qtd: 1 });
      } else {
          cart[itemInCartIndex].qtd += 1;
      }
  } else if (type === "remove" && itemInCartIndex !== -1) {
      cart[itemInCartIndex].qtd -= 1; 

      if (cart[itemInCartIndex].qtd <= 0) {
          cart.splice(itemInCartIndex, 1); 
      }
  }

  updateView();
};

const load = () => {
  store.forEach((item) => storeComponent.append(createCardElement(item)));

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (type) => (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("id");
      moveItem(type === "cart" ? "add" : "remove", data);
  };

  storeComponent.addEventListener("dragover", handleDragOver);
  storeComponent.addEventListener("drop", handleDrop("store"));

  cartComponent.addEventListener("dragover", handleDragOver);
  cartComponent.addEventListener("drop", handleDrop("cart"));

  reloadPrices();
};

window.addEventListener("load", load);
