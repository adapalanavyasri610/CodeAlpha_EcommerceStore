// ==========================================
// SHOPPING CART
// ACCOUNT-SPECIFIC CART VERSION
// ==========================================


// ==========================================
// GET CURRENT USER
// ==========================================

function getCurrentUser() {

    const userData =
        localStorage.getItem("currentUser");


    if (!userData) {
        return null;
    }


    try {

        const user =
            JSON.parse(userData);


        if (!user || !user.id) {
            return null;
        }


        return user;

    } catch (error) {

        console.error(
            "Current user data error:",
            error
        );

        return null;
    }
}


// ==========================================
// GET CART STORAGE KEY
// ==========================================

function getCartStorageKey() {

    const user =
        getCurrentUser();


    // ------------------------------------------
    // LOGGED-IN USER
    // ------------------------------------------

    if (user && user.id) {

        return `shoppingCart_user_${user.id}`;

    }


    // ------------------------------------------
    // GUEST
    // ------------------------------------------

    return "shoppingCart_guest";
}


// ==========================================
// GET CART
// ==========================================

function getCart() {

    const cartKey =
        getCartStorageKey();


    const cartData =
        localStorage.getItem(cartKey);


    if (!cartData) {

        return [];

    }


    try {

        const cart =
            JSON.parse(cartData);


        if (!Array.isArray(cart)) {

            return [];

        }


        return cart;

    } catch (error) {

        console.error(
            "Cart data error:",
            error
        );

        return [];

    }
}


// ==========================================
// SAVE CART
// ==========================================

function saveCart(cart) {

    const cartKey =
        getCartStorageKey();


    localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
    );


    console.log(
        "Cart saved using key:",
        cartKey
    );

}


// ==========================================
// REMOVE OLD GLOBAL CART
// ==========================================

function removeOldCartData() {

    // Old version of the project used:
    // shoppingCart

    localStorage.removeItem(
        "shoppingCart"
    );

}


// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    const cart =
        getCart();


    const cartCount =
        document.getElementById(
            "cart-count"
        );


    if (!cartCount) {

        return;

    }


    const totalQuantity =
        cart.reduce(
            function (total, item) {

                return (
                    total +
                    Number(item.quantity)
                );

            },
            0
        );


    cartCount.textContent =
        totalQuantity;

}


// ==========================================
// ADD PRODUCT TO CART
// ==========================================

function addProductToCart(product) {

    const cart =
        getCart();


    const existingProduct =
        cart.find(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(product.id)
                );

            }
        );


    if (existingProduct) {

        if (
            existingProduct.quantity <
            existingProduct.stock
        ) {

            existingProduct.quantity += 1;

        } else {

            alert(
                "You cannot add more than available stock."
            );

            return;

        }

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            description:
                product.description,

            price:
                Number(product.price),

            image:
                product.image,

            category:
                product.category,

            stock:
                Number(product.stock),

            quantity:
                1

        });

    }


    saveCart(cart);

    updateCartCount();


    alert(
        `${product.name} added to cart!`
    );

}


// ==========================================
// REMOVE PRODUCT FROM CART
// ==========================================

function removeFromCart(productId) {

    let cart =
        getCart();


    cart =
        cart.filter(
            function (item) {

                return (
                    Number(item.id) !==
                    Number(productId)
                );

            }
        );


    saveCart(cart);

    displayCart();

    updateCartCount();

}


// ==========================================
// INCREASE QUANTITY
// ==========================================

function increaseQuantity(productId) {

    const cart =
        getCart();


    const product =
        cart.find(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(productId)
                );

            }
        );


    if (!product) {

        return;

    }


    if (
        product.quantity <
        product.stock
    ) {

        product.quantity += 1;

    } else {

        alert(
            "You cannot add more than available stock."
        );

        return;

    }


    saveCart(cart);

    displayCart();

    updateCartCount();

}


// ==========================================
// DECREASE QUANTITY
// ==========================================

function decreaseQuantity(productId) {

    const cart =
        getCart();


    const product =
        cart.find(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(productId)
                );

            }
        );


    if (!product) {

        return;

    }


    if (product.quantity > 1) {

        product.quantity -= 1;

    } else {

        removeFromCart(productId);

        return;

    }


    saveCart(cart);

    displayCart();

    updateCartCount();

}


// ==========================================
// DISPLAY CART
// ==========================================

function displayCart() {

    const cartContent =
        document.getElementById(
            "cart-content"
        );


    if (!cartContent) {

        return;

    }


    const cart =
        getCart();


    // ------------------------------------------
    // EMPTY CART
    // ------------------------------------------

    if (cart.length === 0) {

        cartContent.innerHTML = `

            <div class="empty-cart">

                <h2>
                    Your Cart is Empty
                </h2>

                <p>
                    You haven't added any products yet.
                </p>

                <a
                    href="index.html#products"
                    class="continue-shopping"
                >
                    Continue Shopping
                </a>

            </div>

        `;

        return;

    }


    // ------------------------------------------
    // SUBTOTAL
    // ------------------------------------------

    const subtotal =
        cart.reduce(
            function (total, item) {

                return (
                    total +
                    (
                        Number(item.price) *
                        Number(item.quantity)
                    )
                );

            },
            0
        );


    // ------------------------------------------
    // SHIPPING
    // ------------------------------------------

    const shipping =
        subtotal >= 5000
            ? 0
            : 100;


    // ------------------------------------------
    // TOTAL
    // ------------------------------------------

    const total =
        subtotal + shipping;


    // ------------------------------------------
    // DISPLAY CART
    // ------------------------------------------

    cartContent.innerHTML = `

        <div class="cart-layout">

            <div class="cart-items">

                ${cart.map(
        function (item) {

            return `

                            <div class="cart-item">

                                <img
                                    src="${item.image}"
                                    alt="${item.name}"
                                    class="cart-item-image"
                                >


                                <div class="cart-item-info">

                                    <div class="cart-item-category">
                                        ${item.category ||
                "Product"
                }
                                    </div>


                                    <h3>
                                        ${item.name}
                                    </h3>


                                    <div class="cart-item-price">
                                        ₹${Number(
                    item.price
                ).toFixed(2)}
                                    </div>


                                    <div class="quantity-controls">

                                        <button
                                            class="quantity-button"
                                            onclick="decreaseQuantity(${item.id})"
                                        >
                                            −
                                        </button>


                                        <span class="quantity-value">
                                            ${item.quantity}
                                        </span>


                                        <button
                                            class="quantity-button"
                                            onclick="increaseQuantity(${item.id})"
                                        >
                                            +
                                        </button>

                                    </div>


                                    <button
                                        class="remove-button"
                                        onclick="removeFromCart(${item.id})"
                                    >
                                        Remove
                                    </button>

                                </div>


                                <div class="cart-item-total">

                                    ₹${(
                    Number(item.price) *
                    Number(item.quantity)
                ).toFixed(2)}

                                </div>

                            </div>

                        `;

        }
    ).join("")}

            </div>


            <!-- CART SUMMARY -->

            <div class="cart-summary">

                <h2>
                    Order Summary
                </h2>


                <div class="summary-row">

                    <span>
                        Subtotal
                    </span>

                    <span>
                        ₹${subtotal.toFixed(2)}
                    </span>

                </div>


                <div class="summary-row">

                    <span>
                        Shipping
                    </span>

                    <span>

                        ${shipping === 0
            ? "FREE"
            : "₹100.00"
        }

                    </span>

                </div>


                <div class="summary-total">

                    <span>
                        Total
                    </span>

                    <span>
                        ₹${total.toFixed(2)}
                    </span>

                </div>


                <a
                    href="#"
                    class="checkout-button"
                    onclick="startCheckout(event)"
                >
                    Proceed to Checkout
                </a>

            </div>

        </div>

    `;

}


// ==========================================
// START CHECKOUT
// ==========================================

function startCheckout(event) {

    event.preventDefault();


    const cart =
        getCart();


    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    const token =
        localStorage.getItem(
            "authToken"
        );


    const user =
        getCurrentUser();


    if (!token || !user) {

        alert(
            "Please login before checkout."
        );


        window.location.href =
            "login.html";


        return;

    }


    window.location.href =
        "checkout.html";

}


// ==========================================
// INITIALIZE CART
// ==========================================

removeOldCartData();

displayCart();

updateCartCount();