// ==========================================
// PRODUCT API
// ==========================================

const API_URL =
    "http://localhost:5000/api/products";


const productsContainer =
    document.getElementById(
        "products-container"
    );


// ==========================================
// GLOBAL PRODUCT DATA
// ==========================================

window.allProducts = [];


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
// GET CART KEY
// ==========================================

function getCartStorageKey() {

    const user =
        getCurrentUser();


    if (
        user &&
        user.id
    ) {

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


    const cart =
        localStorage.getItem(
            cartKey
        );


    if (!cart) {

        return [];

    }


    try {

        return JSON.parse(
            cart
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

function saveCurrentUserCart(cart) {

    const cartKey =
        getCartStorageKey();


    localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
    );

}


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    try {

        productsContainer.innerHTML = `

            <div class="loading">
                Loading products...
            </div>

        `;


        const response =
            await fetch(
                API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch products"
            );

        }


        const data =
            await response.json();


        console.log(
            "Products received:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load products"
            );

        }


        // ------------------------------------------
        // SAVE PRODUCTS
        // ------------------------------------------

        window.allProducts =
            data.products || [];


        // ------------------------------------------
        // CREATE CATEGORY OPTIONS
        // ------------------------------------------

        createCategoryOptions(
            window.allProducts
        );


        // ------------------------------------------
        // DISPLAY PRODUCTS
        // ------------------------------------------

        displayProducts(
            window.allProducts
        );


        updateFilterResult(
            window.allProducts.length,
            window.allProducts.length
        );


        updateHomeCartCount();


    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );


        productsContainer.innerHTML = `

            <div class="error-message">

                <h3>
                    Unable to load products
                </h3>

                <p>
                    Please make sure the backend
                    server is running on port 5000.
                </p>

            </div>

        `;

    }

}


// ==========================================
// CREATE CATEGORY OPTIONS
// ==========================================

function createCategoryOptions(products) {

    const categoryFilter =
        document.getElementById(
            "category-filter"
        );


    if (!categoryFilter) {

        return;

    }


    // ------------------------------------------
    // GET UNIQUE CATEGORIES
    // ------------------------------------------

    const categories =
        products
            .map(
                function (product) {

                    return product.category;

                }
            )
            .filter(
                function (category) {

                    return category;

                }
            );


    const uniqueCategories =
        [...new Set(categories)]
            .sort();


    // ------------------------------------------
    // CLEAR OLD DYNAMIC OPTIONS
    // ------------------------------------------

    while (
        categoryFilter.options.length > 1
    ) {

        categoryFilter.remove(
            categoryFilter.options.length - 1
        );

    }


    // ------------------------------------------
    // ADD OPTIONS
    // ------------------------------------------

    uniqueCategories.forEach(
        function (category) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category;


            option.textContent =
                category;


            categoryFilter.appendChild(
                option
            );

        }
    );

}


// ==========================================
// SORT PRODUCTS
// ==========================================

function sortProducts(products) {

    const sortFilter =
        document.getElementById(
            "sort-filter"
        );


    const selectedSort =
        sortFilter
            ? sortFilter.value
            : "default";


    // ------------------------------------------
    // CREATE COPY
    // ------------------------------------------

    const sortedProducts =
        [...products];


    // ------------------------------------------
    // DEFAULT
    // ------------------------------------------

    if (
        selectedSort ===
        "default"
    ) {

        return sortedProducts;

    }


    // ------------------------------------------
    // PRICE LOW TO HIGH
    // ------------------------------------------

    if (
        selectedSort ===
        "price-low"
    ) {

        sortedProducts.sort(
            function (a, b) {

                return (
                    Number(a.price) -
                    Number(b.price)
                );

            }
        );

    }


    // ------------------------------------------
    // PRICE HIGH TO LOW
    // ------------------------------------------

    else if (
        selectedSort ===
        "price-high"
    ) {

        sortedProducts.sort(
            function (a, b) {

                return (
                    Number(b.price) -
                    Number(a.price)
                );

            }
        );

    }


    // ------------------------------------------
    // NAME A TO Z
    // ------------------------------------------

    else if (
        selectedSort ===
        "name-az"
    ) {

        sortedProducts.sort(
            function (a, b) {

                return a.name
                    .toLowerCase()
                    .localeCompare(
                        b.name.toLowerCase()
                    );

            }
        );

    }


    // ------------------------------------------
    // NAME Z TO A
    // ------------------------------------------

    else if (
        selectedSort ===
        "name-za"
    ) {

        sortedProducts.sort(
            function (a, b) {

                return b.name
                    .toLowerCase()
                    .localeCompare(
                        a.name.toLowerCase()
                    );

            }
        );

    }


    return sortedProducts;

}


// ==========================================
// FILTER PRODUCTS
// ==========================================

function filterProducts() {

    const searchInput =
        document.getElementById(
            "product-search"
        );


    const categoryFilter =
        document.getElementById(
            "category-filter"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "all";


    // ------------------------------------------
    // FILTER
    // ------------------------------------------

    const filteredProducts =
        window.allProducts.filter(
            function (product) {

                // ------------------------------------------
                // SEARCH MATCH
                // ------------------------------------------

                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(searchText) ||

                    (
                        product.description &&
                        product.description
                            .toLowerCase()
                            .includes(searchText)
                    );


                // ------------------------------------------
                // CATEGORY MATCH
                // ------------------------------------------

                const matchesCategory =
                    selectedCategory === "all" ||
                    product.category === selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    // ------------------------------------------
    // SORT FILTERED PRODUCTS
    // ------------------------------------------

    const sortedProducts =
        sortProducts(
            filteredProducts
        );


    // ------------------------------------------
    // DISPLAY
    // ------------------------------------------

    displayProducts(
        sortedProducts
    );


    updateFilterResult(
        filteredProducts.length,
        window.allProducts.length
    );

}


// ==========================================
// UPDATE FILTER RESULT
// ==========================================

function updateFilterResult(
    visibleCount,
    totalCount
) {

    const filterResult =
        document.getElementById(
            "filter-result"
        );


    if (!filterResult) {

        return;

    }


    if (
        visibleCount ===
        totalCount
    ) {

        filterResult.textContent =
            `Showing all ${totalCount} products`;

    } else {

        filterResult.textContent =
            `Showing ${visibleCount} of ${totalCount} products`;

    }

}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(products) {

    productsContainer.innerHTML = "";


    // ------------------------------------------
    // NO PRODUCTS
    // ------------------------------------------

    if (
        !products ||
        products.length === 0
    ) {

        productsContainer.innerHTML = `

            <div class="no-products-message">

                <h3>
                    No products found
                </h3>

                <p>
                    Try another search term or category.
                </p>

            </div>

        `;

        return;

    }


    // ------------------------------------------
    // CREATE PRODUCT CARDS
    // ------------------------------------------

    products.forEach(
        function (product) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product-card";


            // ------------------------------------------
            // STOCK STATUS
            // ------------------------------------------

            let stockText =
                "";

            let stockClass =
                "";


            if (
                Number(product.stock) <= 0
            ) {

                stockText =
                    "✕ Out of Stock";

                stockClass =
                    "out-of-stock";

            } else if (
                Number(product.stock) <= 10
            ) {

                stockText =
                    `⚠ Only ${product.stock} left`;

                stockClass =
                    "low-stock";

            } else {

                stockText =
                    "✓ In Stock";

                stockClass =
                    "in-stock";

            }


            // ------------------------------------------
            // ADD TO CART BUTTON
            // ------------------------------------------

            const addToCartDisabled =
                Number(product.stock) <= 0
                    ? "disabled"
                    : "";


            const addToCartText =
                Number(product.stock) <= 0
                    ? "Out of Stock"
                    : "Add to Cart";


            // ------------------------------------------
            // PRODUCT CARD
            // ------------------------------------------

            card.innerHTML = `

                <div class="product-image-container">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        class="product-image"
                    >


                    <!-- WISHLIST HEART -->

                    <button
                        type="button"
                        class="wishlist-button"
                        data-product-id="${product.id}"
                        title="Add to Wishlist"
                        aria-label="Add to Wishlist"
                    >
                        ♡
                    </button>

                </div>


                <div class="product-info">


                    <div class="product-category">

                        ${product.category || "Product"}

                    </div>


                    <h3 class="product-name">

                        ${product.name}

                    </h3>


                    <p class="product-description">

                        ${product.description ||
                "No description available."
                }

                    </p>


                    <div
                        class="stock-status ${stockClass}"
                    >

                        ${stockText}

                    </div>


                    <div class="product-bottom">


                        <span class="product-price">

                            ₹${Number(
                    product.price
                ).toFixed(2)}

                        </span>


                        <button
                            class="add-cart-button"
                            onclick="addToCart(${product.id})"
                            ${addToCartDisabled}
                        >

                            ${addToCartText}

                        </button>


                        <!-- WISHLIST BUTTON -->

                        <button
                            id="wishlist-button-${product.id}"
                            class="product-wishlist-button"
                            onclick="handleWishlistClick(${product.id})"
                        >

                            ♡ Wishlist

                        </button>


                    </div>


                    <div
                        class="product-details-button-container"
                    >

                        <a
                            href="product-details.html?id=${product.id}"
                            class="view-details-button"
                        >

                            View Details

                        </a>

                    </div>


                </div>

            `;


            productsContainer.appendChild(
                card
            );


            // ------------------------------------------
            // UPDATE WISHLIST BUTTON
            // ------------------------------------------

            updateProductWishlistButton(
                product.id
            );

        }
    );


    // ------------------------------------------
    // UPDATE HEART BUTTONS
    // ------------------------------------------

    if (
        typeof updateWishlistButtons ===
        "function"
    ) {

        updateWishlistButtons();

    }


    if (
        typeof updateWishlistCount ===
        "function"
    ) {

        updateWishlistCount();

    }

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(productId) {

    const user =
        getCurrentUser();


    // ------------------------------------------
    // LOGIN CHECK
    // ------------------------------------------

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


    // ------------------------------------------
    // FIND PRODUCT
    // ------------------------------------------

    const product =
        window.allProducts.find(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(productId)
                );

            }
        );


    if (!product) {

        alert(
            "Product not found."
        );


        return;

    }


    // ------------------------------------------
    // CHECK STOCK
    // ------------------------------------------

    if (
        Number(product.stock) <= 0
    ) {

        alert(
            "This product is currently out of stock."
        );


        return;

    }


    // ------------------------------------------
    // GET USER CART
    // ------------------------------------------

    const cart =
        getCurrentUserCart();


    // ------------------------------------------
    // FIND EXISTING PRODUCT
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


    // ------------------------------------------
    // EXISTING PRODUCT
    // ------------------------------------------

    if (existingProduct) {

        if (
            Number(existingProduct.quantity) <
            Number(product.stock)
        ) {

            existingProduct.quantity += 1;

        } else {

            alert(
                "You cannot add more than available stock."
            );


            return;

        }

    }


    // ------------------------------------------
    // NEW PRODUCT
    // ------------------------------------------

    else {

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

    saveCurrentUserCart(
        cart
    );


    // ------------------------------------------
    // UPDATE COUNT
    // ------------------------------------------

    updateHomeCartCount();


    // ------------------------------------------
    // SUCCESS MESSAGE
    // ------------------------------------------

    alert(
        `${product.name} added to cart!`
    );

}


// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateHomeCartCount() {

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
// SEARCH EVENT
// ==========================================

const searchInput =
    document.getElementById(
        "product-search"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterProducts
    );

}


// ==========================================
// CATEGORY EVENT
// ==========================================

const categoryFilter =
    document.getElementById(
        "category-filter"
    );


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterProducts
    );

}


// ==========================================
// SORT EVENT
// ==========================================

const sortFilter =
    document.getElementById(
        "sort-filter"
    );


if (sortFilter) {

    sortFilter.addEventListener(
        "change",
        filterProducts
    );

}


// ==========================================
// CLEAR FILTERS
// ==========================================

const clearFiltersButton =
    document.getElementById(
        "clear-filters"
    );


if (clearFiltersButton) {

    clearFiltersButton.addEventListener(
        "click",
        function () {

            // --------------------------------------
            // CLEAR SEARCH
            // --------------------------------------

            if (searchInput) {

                searchInput.value =
                    "";

            }


            // --------------------------------------
            // RESET CATEGORY
            // --------------------------------------

            if (categoryFilter) {

                categoryFilter.value =
                    "all";

            }


            // --------------------------------------
            // RESET SORT
            // --------------------------------------

            if (sortFilter) {

                sortFilter.value =
                    "default";

            }


            // --------------------------------------
            // DISPLAY ALL PRODUCTS
            // --------------------------------------

            displayProducts(
                window.allProducts
            );


            updateFilterResult(
                window.allProducts.length,
                window.allProducts.length
            );

        }
    );

}


// ==========================================
// WISHLIST FUNCTIONS
// ==========================================

function getWishlistKey() {

    const user =
        getCurrentUser();


    if (
        user &&
        user.id
    ) {

        return `wishlist_user_${user.id}`;

    }


    return "wishlist_guest";

}


function getProductWishlist() {

    const wishlistData =
        localStorage.getItem(
            getWishlistKey()
        );


    if (!wishlistData) {

        return [];

    }


    try {

        const wishlist =
            JSON.parse(
                wishlistData
            );


        return Array.isArray(
            wishlist
        )
            ? wishlist
            : [];

    } catch (error) {

        console.error(
            "Wishlist error:",
            error
        );

        return [];

    }

}


function saveProductWishlist(
    wishlist
) {

    localStorage.setItem(
        getWishlistKey(),
        JSON.stringify(wishlist)
    );

}


function handleWishlistClick(
    productId
) {

    const user =
        getCurrentUser();


    if (
        !user ||
        !user.id
    ) {

        alert(
            "Please login before adding products to your wishlist."
        );


        window.location.href =
            "login.html";


        return;

    }


    const product =
        window.allProducts.find(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(productId)
                );

            }
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    let wishlist =
        getProductWishlist();


    const existingIndex =
        wishlist.findIndex(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(product.id)
                );

            }
        );


    // ------------------------------------------
    // REMOVE
    // ------------------------------------------

    if (
        existingIndex !==
        -1
    ) {

        wishlist.splice(
            existingIndex,
            1
        );


        saveProductWishlist(
            wishlist
        );


        updateProductWishlistButton(
            product.id
        );


        if (
            typeof updateWishlistButtons ===
            "function"
        ) {

            updateWishlistButtons();

        }


        if (
            typeof updateWishlistCount ===
            "function"
        ) {

            updateWishlistCount();

        }


        alert(
            `${product.name} removed from wishlist.`
        );


        return;

    }


    // ------------------------------------------
    // ADD
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


    saveProductWishlist(
        wishlist
    );


    updateProductWishlistButton(
        product.id
    );


    if (
        typeof updateWishlistButtons ===
        "function"
    ) {

        updateWishlistButtons();

    }


    if (
        typeof updateWishlistCount ===
        "function"
    ) {

        updateWishlistCount();

    }


    alert(
        `${product.name} added to wishlist!`
    );

}


function updateProductWishlistButton(
    productId
) {

    const button =
        document.getElementById(
            `wishlist-button-${productId}`
        );


    if (!button) {

        return;

    }


    const wishlist =
        getProductWishlist();


    const exists =
        wishlist.some(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(productId)
                );

            }
        );


    if (exists) {

        button.textContent =
            "❤️ Wishlisted";

        button.classList.add(
            "product-wishlist-active"
        );

    } else {

        button.textContent =
            "♡ Wishlist";

        button.classList.remove(
            "product-wishlist-active"
        );

    }

}


// ==========================================
// START APPLICATION
// ==========================================

loadProducts();

updateHomeCartCount();