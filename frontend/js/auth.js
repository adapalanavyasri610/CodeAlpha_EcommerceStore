// ==========================================
// AUTHENTICATION UI
// ==========================================

function updateAuthenticationUI() {

    const loginLink =
        document.getElementById(
            "login-link"
        );


    const registerLink =
        document.getElementById(
            "register-link"
        );


    const ordersLink =
        document.getElementById(
            "orders-link"
        );


    const wishlistLink =
        document.getElementById(
            "wishlist-link"
        );


    const userInfo =
        document.getElementById(
            "user-info"
        );


    const logoutButton =
        document.getElementById(
            "logout-button"
        );


    const currentUserData =
        localStorage.getItem(
            "currentUser"
        );


    // ==========================================
    // USER IS NOT LOGGED IN
    // ==========================================

    if (!currentUserData) {

        if (loginLink) {

            loginLink.style.display =
                "inline";

        }


        if (registerLink) {

            registerLink.style.display =
                "inline";

        }


        if (ordersLink) {

            ordersLink.style.display =
                "none";

        }


        if (wishlistLink) {

            wishlistLink.style.display =
                "none";

        }


        if (userInfo) {

            userInfo.style.display =
                "none";

        }


        if (logoutButton) {

            logoutButton.style.display =
                "none";

        }


        return;

    }


    // ==========================================
    // READ CURRENT USER
    // ==========================================

    let user;


    try {

        user =
            JSON.parse(
                currentUserData
            );

    } catch (error) {

        console.error(
            "Invalid currentUser data:",
            error
        );


        // --------------------------------------
        // REMOVE ONLY INVALID LOGIN DATA
        // --------------------------------------

        localStorage.removeItem(
            "currentUser"
        );


        localStorage.removeItem(
            "authToken"
        );


        // --------------------------------------
        // RETURN TO LOGGED-OUT UI
        // --------------------------------------

        if (loginLink) {

            loginLink.style.display =
                "inline";

        }


        if (registerLink) {

            registerLink.style.display =
                "inline";

        }


        if (ordersLink) {

            ordersLink.style.display =
                "none";

        }


        if (wishlistLink) {

            wishlistLink.style.display =
                "none";

        }


        if (userInfo) {

            userInfo.style.display =
                "none";

        }


        if (logoutButton) {

            logoutButton.style.display =
                "none";

        }


        return;

    }


    // ==========================================
    // CHECK USER ID
    // ==========================================

    if (!user || !user.id) {

        console.error(
            "Invalid user information."
        );


        localStorage.removeItem(
            "currentUser"
        );


        localStorage.removeItem(
            "authToken"
        );


        if (loginLink) {

            loginLink.style.display =
                "inline";

        }


        if (registerLink) {

            registerLink.style.display =
                "inline";

        }


        if (ordersLink) {

            ordersLink.style.display =
                "none";

        }


        if (wishlistLink) {

            wishlistLink.style.display =
                "none";

        }


        if (userInfo) {

            userInfo.style.display =
                "none";

        }


        if (logoutButton) {

            logoutButton.style.display =
                "none";

        }


        return;

    }


    // ==========================================
    // USER IS LOGGED IN
    // ==========================================


    // ------------------------------------------
    // HIDE LOGIN
    // ------------------------------------------

    if (loginLink) {

        loginLink.style.display =
            "none";

    }


    // ------------------------------------------
    // HIDE REGISTER
    // ------------------------------------------

    if (registerLink) {

        registerLink.style.display =
            "none";

    }


    // ------------------------------------------
    // SHOW MY ORDERS
    // ------------------------------------------

    if (ordersLink) {

        ordersLink.style.display =
            "inline";

    }


    // ------------------------------------------
    // SHOW WISHLIST
    // ------------------------------------------

    if (wishlistLink) {

        wishlistLink.style.display =
            "inline";

    }


    // ------------------------------------------
    // SHOW USER INFORMATION
    // ------------------------------------------

    if (userInfo) {

        userInfo.style.display =
            "inline";


        userInfo.textContent =
            `Hi, ${user.name}`;

    }


    // ------------------------------------------
    // SHOW LOGOUT BUTTON
    // ------------------------------------------

    if (logoutButton) {

        logoutButton.style.display =
            "inline";

    }


    // ==========================================
    // DEBUG INFORMATION
    // ==========================================

    console.log(
        "Logged-in user:",
        user
    );


    console.log(
        "User cart:",
        `shoppingCart_user_${user.id}`
    );


    console.log(
        "User wishlist:",
        `wishlist_user_${user.id}`
    );

}


// ==========================================
// LOGOUT
// ==========================================

function logoutUser() {

    // IMPORTANT:
    // DO NOT DELETE:
    //
    // shoppingCart_user_ID
    //
    // wishlist_user_ID
    //
    // These belong to the user's account
    // and must remain saved.


    // ==========================================
    // REMOVE LOGIN INFORMATION
    // ==========================================

    localStorage.removeItem(
        "authToken"
    );


    localStorage.removeItem(
        "currentUser"
    );


    // ==========================================
    // REMOVE ONLY GUEST CART
    // ==========================================

    localStorage.removeItem(
        "shoppingCart_guest"
    );


    // ==========================================
    // REMOVE OLD GLOBAL CART
    // ==========================================

    localStorage.removeItem(
        "shoppingCart"
    );


    // ==========================================
    // DO NOT REMOVE:
    //
    // shoppingCart_user_1
    // shoppingCart_user_2
    //
    // wishlist_user_1
    // wishlist_user_2
    //
    // ==========================================


    alert(
        "You have been logged out."
    );


    window.location.href =
        "index.html";

}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ======================================
        // UPDATE AUTHENTICATION UI
        // ======================================

        updateAuthenticationUI();


        // ======================================
        // GET LOGOUT BUTTON
        // ======================================

        const logoutButton =
            document.getElementById(
                "logout-button"
            );


        // ======================================
        // ADD LOGOUT EVENT
        // ======================================

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logoutUser
            );

        }


    }
);