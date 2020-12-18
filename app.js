//selectors
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//cart
let cart = [];
//buttons
let buttonsDOM = [];


// getting the product
class Products {
    async getProduct() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();

            let products = data.items;
            products = products.map((item) => {
                const {title, price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;

                return {title, price, id, image};
            });

            return products;
        } catch (err) {
            console.log(err);
        }
    }
}

//display product
class UI {
    //display all products
    displayProducts(products) {
        // console.log(typeof products)
        let result = "";
        products.forEach((product) => {
            result += `
        <!--        single product-->
        <article class="product">
            <div class="img-container">
                <img alt="product"
                    class="product-img"
                    src="${product.image}">
                <button class="bag-btn"
                        data-id="${product.id}"><i class="fas fa-shopping-cart"></i> add to bag
                </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${product.price}</h4>
        </article>
        <!--     end of  single product-->
            `;
        });
        productsDOM.innerHTML = result;
    }

    //bag buttons
    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;

        buttons.forEach((button) => {
            let id = button.dataset.id;
            let inCart = cart.find((item) => item.id === id);

            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            }

            button.addEventListener("click", (event) => {
                event.target.innerText = 'In Cart';
                event.target.disabled = true;

                //get product from products
                let cartItem = {...Storage.getProduct(id), amount: 1};

                //add product to cart
                cart = [...cart, cartItem];
                //save cart in local storage
                Storage.saveCart(cart);
                //set cart value
                this.setCartValues(cart);
                //display cart item
                this.addCartItem(cartItem);
                //show the cart
                this.showCart()
            });
        });
    }

    //set cart values
    setCartValues(cart) {
        let tempTotal = 0;
        let itemTotal = 0;

        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemTotal;
    }

    //add cart item
    addCartItem(item) {
        console.log(item)
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img alt="product"
                     src="${item.image}">
                <div>
                    <h4>${item.title}</h4>
                    <h5>$${item.price}</h5>
                    <span class="remove-item" data-id="${item.id}">remove</span>
                </div>
                <div>
                    <i class="fas fa-chevron-up" data-id="${item.id}"></i>
                    <p class="item-amount">${item.amount}</p>
                    <i class="fas fa-chevron-down" data-id="${item.id}"></i>
                </div>
        `;

        cartContent.appendChild(div);
        console.log(cartContent)
    }

    //show cart
    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart')
    }

    //setup app
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }

    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }

    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart')
    }
}

//local Storage
class Storage {
    static saveProduct(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find((product) => product.id === id);
    }

    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    //set up application
    ui.setupAPP();

    //get all product
    products
        .getProduct()
        .then((products) => {
            ui.displayProducts(products);
            Storage.saveProduct(products);
        })
        .then(() => {
            ui.getBagButtons();
        });
});
