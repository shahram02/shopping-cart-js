import { productsData } from "./products.js";

// DOM tags
const productsContainer = document.querySelector(".products-center");
const cartItem = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");

let cart = [];

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
    buttons.forEach((button) => {
      const id = button.dataset.id;
      const isInCart = cart.find((p) => p.id === id);
      if (isInCart) {
        button.innerText = "در سبد خرید موجود هست";
        button.disabled = true;
      }
      button.addEventListener("click", (e) => {
        const addProduct = Storage.getProduct(id);
        console.log(addProduct);
        cart = [...cart, { ...addProduct, quantity: 1 }];
        Storage.saveCarts(cart);
        e.target.innerText = "در سبد خرید موجود هست";
        e.target.disabled = true;
        this.setCartValue(cart);
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
}

// Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    console.log(id);
    const products = JSON.parse(localStorage.getItem("products"));
    return products.find((p) => p.id == parseInt(id));
  }
  static saveCarts(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {}
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  //   Show Ui
  const dataProducts = products.getPtoducts();
  const showUi = new ShowUi();
  showUi.addToDOM(dataProducts);
  showUi.getBtns();

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
