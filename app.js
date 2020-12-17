//selectors
const cardBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

//cart
let cart = [];

// getting the product
class Products {
    async getProducts() {
        await fetch('products.json')
            .then(res=>res.json())
            .then(data =>{
                console.log(data)
            })
    }
}

//display product
class UI {

}

//local Storage
class Storage {

}


document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();
})