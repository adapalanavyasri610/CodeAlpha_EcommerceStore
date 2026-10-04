// ==========================================
// PRODUCT DETAILS API
// ==========================================

const API_URL =
    "http://localhost:5000/api/products";


// ==========================================
// GET PRODUCT ID FROM URL
// ==========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const productId =
    urlParams.get("id");


// ==========================================
// GET HTML CONTAINER
// ==========================================

const productDetailsContainer =
    document.getElementById(
        "product-details"
    );


// ==========================================
// GET CURRENT USER
// ==========================================

function getCurrentUser() {

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
            "User data error:",
            error
        );

        return null;
    }
}


// ==========================================
// GET CURRENT USER CART KEY
// ==========================================

function getCartStorageKey() {

    const user =
        getCurrentUser();

    if (user && user.id) {

        return `shoppingCart_user_${user.id}`;

    }

    return "shoppingCart_guest";
}


// ==========================================
// GET CURRENT USER CART
// ==========================================

function getCurrentUserCart() {

    const cartKey =
        getCartStorageKey();

    const cartData =
        localStorage.getItem(
            cartKey
        );

    if (!cartData) {
        return [];
    }

    try {

        return JSON.parse(
            cartData
        );

    } catch (error) {

        console.error(
            "Cart data error:",
            error
        );

        return [];
    }
}


// ==========================================
// SAVE CURRENT USER CART
// ==========================================

function saveCurrentUserCart(
    cart
) {

    const cartKey =
        getCartStorageKey();

    localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
    );
}


// ==========================================
// CHECK PRODUCT ID
// ==========================================

if (!productId) {

    showError(
        "Product ID is missing."
    );

} else {

    loadProduct(
        productId
    );
}


// ==========================================
// LOAD PRODUCT
// ==========================================

async function loadProduct(id) {

    try {

        productDetailsContainer.innerHTML = `
            <div class="loading">
                Loading product details...
            </div>
        `;


        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Product not found"
            );
        }


        const data =
            await response.json();


        console.log(
            "Product received:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Product not found"
            );
        }


        displayProduct(
            data.product
        );


    } catch (error) {

        console.error(
            "Product details error:",
            error
        );


        showError(
            error.message
        );
    }
}


// ==========================================
// DISPLAY PRODUCT
// ==========================================

function displayProduct(
    product
) {

    window.currentProduct =
        product;


    productDetailsContainer.innerHTML = `

        <div class="details-image-container">

            <img
                src="${product.image}"
                alt="${product.name}"
                class="details-image"
            >

        </div>


        <div class="details-information">

            <div class="details-category">
                ${product.category || "Product"}
            </div>


            <h1 class="details-title">
                ${product.name}
            </h1>


            <p class="details-description">
                ${product.description ||
        "No description available."
        }
            </p>


            <div class="details-price">
                ₹${Number(
            product.price
        ).toFixed(2)}
            </div>


            <div class="stock-info">

                ${product.stock > 0
            ? `In Stock: ${product.stock} items`
            : "Out of Stock"
        }

            </div>


            <div class="details-actions">

                ${product.stock > 0

            ? `
                        <button
                            class="details-cart-button"
                            onclick="addToCart(${product.id})"
                        >
                            Add to Cart
                        </button>
                    `

            : `
                        <button
                            class="details-cart-button"
                            disabled
                        >
                            Out of Stock
                        </button>
                    `
        }

            </div>

        </div>

    `;
}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(
    productId
) {

    const user =
        getCurrentUser();


    // User must be logged in
    if (
        !user ||
        !user.id
    ) {

        alert(
            "Please login before adding products to cart."
        );

        window.location.href =
            "login.html";

        return;
    }


    const product =
        window.currentProduct;


    if (!product) {

        alert(
            "Product information is unavailable."
        );

        return;
    }


    const cart =
        getCurrentUserCart();


    const existingProduct =
        cart.find(
            function (item) {

                return (
                    item.id ===
                    product.id
                );

            }
        );


    if (existingProduct) {

        if (
            existingProduct.quantity <
            product.stock
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
                Number(
                    product.price
                ),

            image:
                product.image,

            category:
                product.category,

            stock:
                product.stock,

            quantity:
                1
        });
    }


    saveCurrentUserCart(
        cart
    );


    updateDetailsCartCount();


    alert(
        `${product.name} added to cart!`
    );
}


// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateDetailsCartCount() {

    const cart =
        getCurrentUserCart();


    const cartCount =
        document.getElementById(
            "cart-count"
        );


    if (!cartCount) {
        return;
    }


    const totalQuantity =
        cart.reduce(
            function (
                total,
                item
            ) {

                return (
                    total +
                    Number(
                        item.quantity
                    )
                );

            },
            0
        );


    cartCount.textContent =
        totalQuantity;
}


// ==========================================
// SHOW ERROR
// ==========================================

function showError(
    message
) {

    productDetailsContainer.innerHTML = `

        <div class="error-container">

            <h2>
                Product Not Found
            </h2>

            <p>
                ${message}
            </p>

            <a
                href="index.html"
                class="home-button"
            >
                Back to Home
            </a>

        </div>

    `;
}


// ==========================================
// INITIALIZE
// ==========================================

updateDetailsCartCount();