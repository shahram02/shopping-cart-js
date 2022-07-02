import { productsData } from "./products.js";

// DOM tags
const productsContainer = document.querySelector(".products-center");
const cartItem = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");

let cart = [];
let buttonsDOM = [];

// Get Products
class Products {
  getPtoducts() {
    return productsData;
  }
}

// Show In DOM
class ShowUi {
  addToDOM(products) {
    let result = "";
    products.forEach((product) => {
      result += `
      <div class="product">
      <div class="img-container">
        <img src=${product.imageUrl} class="product-img" />
      </div>
      <div class="product-desc">
        <p class="product-price">تومان ${product.price}</p>
        <p class="product-title">${product.title}</p>
      </div>
      <button class="btn add-to-cart" data-id=${product.id}>
      اضافه کردن محصول
      </button>
    </div>`;
      productsContainer.innerHTML = result;
    });
  }
  getBtns() {
    const addToCarBtn = document.querySelectorAll(".add-to-cart");
    const buttons = [...addToCarBtn];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      const id = button.dataset.id;
      const isInCart = cart.find((p) => p.id === id);
      if (isInCart) {
        button.innerText = "در سبد خرید موجود هست";
        button.disabled = true;
      }
      button.addEventListener("click", (e) => {
        const addProduct = { ...Storage.getProduct(id), quantity: 1 };
        cart = [...cart, addProduct];
        Storage.saveCarts(cart);
        e.target.innerText = "در سبد خرید موجود هست";
        e.target.disabled = true;
        this.setCartValue(cart);
        this.addCartItem(addProduct);
      });
    });
  }
  setCartValue(cart) {
    let totalItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      totalItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartItem.innerText = totalItems;
    cartTotal.innerHTML = `مجموع قیمت${totalPrice.toFixed(2)} تومان`;
  }
  addCartItem(product) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
   <img class="cart-item-img" src=${product.imageUrl} />
   <div class="cart-item-desc">
     <h4>${product.title}</h4>
     <h5>ریال ${product.price}</h5>
   </div>
   <div class="cart-item-conteoller">
     <i class="fas fa-chevron-up" data-id=${product.id}></i>
     <p>1</p>
     <i class="fas fa-chevron-down" ${product.id}></i>
   </div>
   <i class="fas fa-trash-alt" ${product.id}></i>
   `;
    cartContent.appendChild(div);
  }
  setUpApp() {
    cart = Storage.getCart();
    cart.forEach((cItem) => this.addCartItem(cItem)) || [];
    this.setCartValue(cart);
    this.cartLogic();
  }
  cartLogic() {
    clearCart.addEventListener("click", () => this.clearCart());
    cartContent.addEventListener("click", (e) => {
      const item = e.target;
      if (item.classList.contains("fa-chevron-up")) {
        const addQuantity = e.target;
        const addItem = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );
        addItem.quantity++;
        this.setCartValue(cart);
        Storage.saveCarts(cart);
        addQuantity.nextElementSibling.innerText = addItem.quantity;
      }
    });
  }
  clearCart() {
    cart.forEach((cItem) => this.removeItem(cItem.id));
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }
  removeItem(id) {
    cart = cart.filter((cItem) => cItem.id != id);
    this.setCartValue(cart);
    Storage.saveCarts(cart);
    console.log(buttonsDOM);
    const clickButton = buttonsDOM.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    clickButton.innerText = "اضافه کردن به سبد خرید";
    clickButton.disabled = false;
  }
}

// Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const products = JSON.parse(localStorage.getItem("products"));
    return products.find((p) => p.id == parseInt(id));
  }
  static saveCarts(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  //   Show Ui
  const dataProducts = products.getPtoducts();
  const showUi = new ShowUi();
  showUi.addToDOM(dataProducts);
  showUi.getBtns();
  showUi.setUpApp();

  //   Storage
  Storage.saveProducts(productsData);
});

// Modal
const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
