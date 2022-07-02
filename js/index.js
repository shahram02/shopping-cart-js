import { productsData } from "./products.js";

// DOM tags
const productsContainer = document.querySelector(".products-center");

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
      <button class="btn add-to-cart" ${product.id}>
      اضافه کردن محصول
      </button>
    </div>`;
      productsContainer.innerHTML = result;
    });
  }
}

// Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  //   Show Ui
  const dataProducts = products.getPtoducts();
  const showUi = new ShowUi();
  showUi.addToDOM(dataProducts);

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
