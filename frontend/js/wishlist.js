// ==========================================
// SHOP EASY WISHLIST
// ACCOUNT-SPECIFIC WISHLIST
// ==========================================


// ==========================================
// GET CURRENT USER
// ==========================================

function getWishlistUser() {

    const userData =
        localStorage.getItem("currentUser");


    if (!userData) {

        return null;

    }


    try {

        return JSON.parse(userData);

    } catch (error) {

        console.error(
            "Wishlist user error:",
            error
        );

        return null;

    }

}


// ==========================================
// GET WISHLIST STORAGE KEY
// ==========================================

function getWishlistStorageKey() {

    const user =
        getWishlistUser();


    if (user && user.id) {

        return `wishlist_user_${user.id}`;

    }


    return "wishlist_guest";

}


// ==========================================
// GET WISHLIST
// ==========================================

function getWishlist() {

    const wishlistKey =
        getWishlistStorageKey();


    const wishlistData =
        localStorage.getItem(
            wishlistKey
        );


    if (!wishlistData) {

        return [];

    }


    try {

        const wishlist =
            JSON.parse(
                wishlistData
            );


        if (!Array.isArray(wishlist)) {

            return [];

        }


        return wishlist;

    } catch (error) {

        console.error(
            "Wishlist data error:",
            error
        );

        return [];

    }

}


// ==========================================
// SAVE WISHLIST
// ==========================================

function saveWishlist(wishlist) {

    const wishlistKey =
        getWishlistStorageKey();


    localStorage.setItem(
        wishlistKey,
        JSON.stringify(wishlist)
    );


    console.log(
        "Wishlist saved using key:",
        wishlistKey
    );

}


// ==========================================
// ADD PRODUCT TO WISHLIST
// ==========================================

function addToWishlist(product) {

    const user =
        getWishlistUser();


    // ------------------------------------------
    // LOGIN REQUIRED
    // ------------------------------------------

    if (!user || !user.id) {

        alert(
            "Please login before adding products to your wishlist."
        );


        window.location.href =
            "login.html";


        return;

    }


    const wishlist =
        getWishlist();


    // ------------------------------------------
    // CHECK IF ALREADY EXISTS
    // ------------------------------------------

    const existingProduct =
        wishlist.find(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(product.id)
                );

            }
        );


    if (existingProduct) {

        alert(
            "This product is already in your wishlist."
        );


        return;

    }


    // ------------------------------------------
    // ADD PRODUCT
    // ------------------------------------------

    wishlist.push({

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
            Number(product.stock)

    });


    saveWishlist(
        wishlist
    );


    alert(
        `${product.name} added to your wishlist!`
    );


    updateWishlistButtons();

    updateWishlistCount();

}


// ==========================================
// REMOVE FROM WISHLIST
// ==========================================

function removeFromWishlist(productId) {

    let wishlist =
        getWishlist();


    wishlist =
        wishlist.filter(
            function (item) {

                return (
                    Number(item.id) !==
                    Number(productId)
                );

            }
        );


    saveWishlist(
        wishlist
    );


    displayWishlist();

    updateWishlistButtons();

    updateWishlistCount();

}


// ==========================================
// CHECK WHETHER PRODUCT IS WISHLISTED
// ==========================================

function isProductInWishlist(productId) {

    const wishlist =
        getWishlist();


    return wishlist.some(
        function (item) {

            return (
                Number(item.id) ===
                Number(productId)
            );

        }
    );

}


// ==========================================
// UPDATE WISHLIST BUTTONS
// ==========================================

function updateWishlistButtons() {

    const wishlist =
        getWishlist();


    document
        .querySelectorAll(".wishlist-button")
        .forEach(
            function (button) {

                const productId =
                    button.dataset.productId;


                const isWishlisted =
                    wishlist.some(
                        function (item) {

                            return (
                                Number(item.id) ===
                                Number(productId)
                            );

                        }
                    );


                if (isWishlisted) {

                    button.textContent =
                        "♥";

                    button.classList.add(
                        "wishlist-active"
                    );

                    button.title =
                        "Remove from Wishlist";

                } else {

                    button.textContent =
                        "♡";

                    button.classList.remove(
                        "wishlist-active"
                    );

                    button.title =
                        "Add to Wishlist";

                }

            }
        );

}


// ==========================================
// UPDATE WISHLIST COUNT
// ==========================================

function updateWishlistCount() {

    const wishlist =
        getWishlist();


    const wishlistCount =
        document.getElementById(
            "wishlist-count"
        );


    if (!wishlistCount) {

        return;

    }


    wishlistCount.textContent =
        wishlist.length;

}


// ==========================================
// DISPLAY WISHLIST
// ==========================================

function displayWishlist() {

    const container =
        document.getElementById(
            "wishlist-container"
        );


    if (!container) {

        return;

    }


    const user =
        getWishlistUser();


    // ------------------------------------------
    // LOGIN MESSAGE
    // ------------------------------------------

    if (!user || !user.id) {

        container.innerHTML = `

            <div class="empty-wishlist">

                <h2>
                    Please Login
                </h2>

                <p>
                    Login to view and manage your wishlist.
                </p>

                <a
                    href="login.html"
                    class="continue-shopping-button"
                >
                    Login
                </a>

            </div>

        `;


        container.style.display =
            "block";


        return;

    }


    const wishlist =
        getWishlist();


    // ------------------------------------------
    // EMPTY WISHLIST
    // ------------------------------------------

    if (wishlist.length === 0) {

        container.innerHTML = `

            <div class="empty-wishlist">

                <h2>
                    Your Wishlist is Empty ❤️
                </h2>

                <p>
                    Save products you love and come back to them later.
                </p>

                <a
                    href="index.html#products"
                    class="continue-shopping-button"
                >
                    Browse Products
                </a>

            </div>

        `;


        container.style.display =
            "block";


        return;

    }


    // ------------------------------------------
    // DISPLAY WISHLIST PRODUCTS
    // ------------------------------------------

    container.style.display =
        "grid";


    container.innerHTML =
        wishlist.map(
            function (product) {

                return `

                    <div class="wishlist-card">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            class="wishlist-image"
                        >


                        <div class="wishlist-info">

                            <div class="wishlist-category">
                                ${product.category || "Product"}
                            </div>


                            <h3>
                                ${product.name}
                            </h3>


                            <div class="wishlist-price">
                                ₹${Number(
                    product.price
                ).toFixed(2)}
                            </div>


                            <div class="wishlist-actions">

                                <button
                                    class="wishlist-cart-button"
                                    onclick="addWishlistProductToCart(${product.id})"
                                >
                                    Add to Cart
                                </button>


                                <button
                                    class="wishlist-remove-button"
                                    onclick="removeFromWishlist(${product.id})"
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


// ==========================================
// ADD WISHLIST PRODUCT TO CART
// ==========================================

function addWishlistProductToCart(
    productId
) {

    const user =
        getWishlistUser();


    // ------------------------------------------
    // LOGIN REQUIRED
    // ------------------------------------------

    if (!user || !user.id) {

        alert(
            "Please login before adding products to cart."
        );


        window.location.href =
            "login.html";


        return;

    }


    const wishlist =
        getWishlist();


    const product =
        wishlist.find(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(productId)
                );

            }
        );


    if (!product) {

        alert(
            "Product not found in wishlist."
        );

        return;

    }


    // ------------------------------------------
    // CURRENT USER CART
    // ------------------------------------------

    const cartKey =
        `shoppingCart_user_${user.id}`;


    const cartData =
        localStorage.getItem(
            cartKey
        );


    let cart = [];


    if (cartData) {

        try {

            cart =
                JSON.parse(
                    cartData
                );

        } catch (error) {

            console.error(
                "Cart data error:",
                error
            );

            cart = [];

        }

    }


    // ------------------------------------------
    // CHECK IF PRODUCT ALREADY IN CART
    // ------------------------------------------

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

        // --------------------------------------
        // ADD NEW PRODUCT TO CART
        // --------------------------------------

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


    // ------------------------------------------
    // SAVE CART
    // ------------------------------------------

    localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
    );


    alert(
        `${product.name} added to your cart!`
    );

}


// ==========================================
// HANDLE WISHLIST BUTTON CLICK
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".wishlist-button"
            );


        if (!button) {

            return;

        }


        const productId =
            Number(
                button.dataset.productId
            );


        if (!productId) {

            return;

        }


        const user =
            getWishlistUser();


        // --------------------------------------
        // LOGIN REQUIRED
        // --------------------------------------

        if (!user || !user.id) {

            alert(
                "Please login before adding products to your wishlist."
            );


            window.location.href =
                "login.html";


            return;

        }


        // --------------------------------------
        // FIND PRODUCT
        // --------------------------------------

        const product =
            window.allProducts
                ? window.allProducts.find(
                    function (item) {

                        return (
                            Number(item.id) ===
                            Number(productId)
                        );

                    }
                )
                : null;


        if (!product) {

            alert(
                "Product information not available."
            );

            return;

        }


        // --------------------------------------
        // CHECK CURRENT WISHLIST
        // --------------------------------------

        if (
            isProductInWishlist(
                productId
            )
        ) {

            removeFromWishlist(
                productId
            );

            alert(
                `${product.name} removed from your wishlist!`
            );

        } else {

            addToWishlist(
                product
            );

        }

    }
);


// ==========================================
// INITIALIZE WISHLIST
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayWishlist();

        updateWishlistButtons();

        updateWishlistCount();

    }
);