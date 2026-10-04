// ==========================================
// CHECKOUT PAGE
// ==========================================


// ==========================================
// GET CURRENT USER
// ==========================================

function getCheckoutUser() {

    const userData =
        localStorage.getItem(
            "currentUser"
        );


    if (!userData) {

        return null;

    }


    try {

        return JSON.parse(
            userData
        );

    } catch (error) {

        console.error(
            "Checkout user error:",
            error
        );

        return null;

    }

}


// ==========================================
// GET USER CART
// ==========================================

function getCheckoutCart() {

    const user =
        getCheckoutUser();


    if (!user || !user.id) {

        return [];

    }


    const cartKey =
        `shoppingCart_user_${user.id}`;


    const cart =
        localStorage.getItem(
            cartKey
        );


    if (!cart) {

        return [];

    }


    try {

        return JSON.parse(cart);

    } catch (error) {

        console.error(
            "Checkout cart error:",
            error
        );

        return [];

    }

}


// ==========================================
// DISPLAY CHECKOUT
// ==========================================

function displayCheckout() {

    const cart =
        getCheckoutCart();


    const checkoutItems =
        document.getElementById(
            "checkout-items"
        );


    const subtotalElement =
        document.getElementById(
            "checkout-subtotal"
        );


    const shippingElement =
        document.getElementById(
            "checkout-shipping"
        );


    const totalElement =
        document.getElementById(
            "checkout-total"
        );


    const placeOrderButton =
        document.getElementById(
            "place-order-button"
        );


    // ------------------------------------------
    // EMPTY CART
    // ------------------------------------------

    if (cart.length === 0) {

        checkoutItems.innerHTML = `

            <p>
                Your cart is empty.
            </p>

            <br>

            <a href="index.html#products">
                Continue Shopping
            </a>

        `;


        subtotalElement.textContent =
            "₹0.00";


        shippingElement.textContent =
            "₹0.00";


        totalElement.textContent =
            "₹0.00";


        placeOrderButton.disabled =
            true;


        return;

    }


    // ------------------------------------------
    // SUBTOTAL
    // ------------------------------------------

    const subtotal =
        cart.reduce(
            (total, item) => {

                return total +
                    (
                        Number(item.price) *
                        Number(item.quantity)
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
    // DISPLAY PRODUCTS
    // ------------------------------------------

    checkoutItems.innerHTML =
        cart.map(
            function (item) {

                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                return `

                    <div class="checkout-item">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                            class="checkout-item-image"
                        >


                        <div class="checkout-item-info">

                            <h3>
                                ${item.name}
                            </h3>


                            <p>
                                Category:
                                ${item.category ||
                    "Product"
                    }
                            </p>


                            <p>
                                Price:
                                ₹${Number(
                        item.price
                    ).toFixed(2)}
                            </p>


                            <p>
                                Quantity:
                                ${item.quantity}
                            </p>

                        </div>


                        <div class="checkout-item-total">

                            ₹${itemTotal.toFixed(2)}

                        </div>

                    </div>

                `;

            }
        ).join("");


    // ------------------------------------------
    // DISPLAY SUMMARY
    // ------------------------------------------

    subtotalElement.textContent =
        `₹${subtotal.toFixed(2)}`;


    shippingElement.textContent =
        shipping === 0
            ? "FREE"
            : `₹${shipping.toFixed(2)}`;


    totalElement.textContent =
        `₹${total.toFixed(2)}`;

}


// ==========================================
// PLACE ORDER
// ==========================================

async function placeOrder() {

    const token =
        localStorage.getItem(
            "authToken"
        );


    // ------------------------------------------
    // CHECK LOGIN
    // ------------------------------------------

    if (!token) {

        alert(
            "Please login before placing your order."
        );


        window.location.href =
            "login.html";


        return;

    }


    // ------------------------------------------
    // GET CURRENT USER
    // ------------------------------------------

    const user =
        getCheckoutUser();


    if (!user || !user.id) {

        alert(
            "Please login before placing your order."
        );


        window.location.href =
            "login.html";


        return;

    }


    // ------------------------------------------
    // GET USER CART
    // ------------------------------------------

    const cart =
        getCheckoutCart();


    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    const placeOrderButton =
        document.getElementById(
            "place-order-button"
        );


    const checkoutMessage =
        document.getElementById(
            "checkout-message"
        );


    placeOrderButton.disabled =
        true;


    placeOrderButton.textContent =
        "Placing Order...";


    try {

        // ------------------------------------------
        // CONVERT CART TO ORDER ITEMS
        // ------------------------------------------

        const items =
            cart.map(
                function (item) {

                    return {

                        product_id:
                            item.id,

                        quantity:
                            item.quantity

                    };

                }
            );


        // ------------------------------------------
        // SEND ORDER
        // ------------------------------------------

        const response =
            await fetch(
                "http://localhost:5000/api/orders",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        items:
                            items

                    })

                }
            );


        const data =
            await response.json();


        // ------------------------------------------
        // BACKEND ERROR
        // ------------------------------------------

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to place order."
            );

        }


        // ------------------------------------------
        // SUCCESS
        // ------------------------------------------

        console.log(
            "Order created:",
            data
        );


        // ------------------------------------------
        // SAVE LAST ORDER
        // ------------------------------------------

        localStorage.setItem(
            "lastOrder",
            JSON.stringify(
                data.order
            )
        );


        // ------------------------------------------
        // CLEAR ONLY THIS USER'S CART
        // ------------------------------------------

        const cartKey =
            `shoppingCart_user_${user.id}`;


        localStorage.removeItem(
            cartKey
        );


        // ------------------------------------------
        // OPEN SUCCESS PAGE
        // ------------------------------------------

        window.location.href =
            "order-success.html";


    } catch (error) {

        console.error(
            "Order error:",
            error
        );


        checkoutMessage.textContent =
            error.message;


        placeOrderButton.disabled =
            false;


        placeOrderButton.textContent =
            "Place Order";

    }

}


// ==========================================
// BUTTON EVENT
// ==========================================

const placeOrderButton =
    document.getElementById(
        "place-order-button"
    );


if (placeOrderButton) {

    placeOrderButton.addEventListener(
        "click",
        placeOrder
    );

}


// ==========================================
// INITIALIZE
// ==========================================

displayCheckout();