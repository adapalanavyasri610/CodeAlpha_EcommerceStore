// ==========================================
// LOGIN USER
// ==========================================

const loginForm =
    document.getElementById("login-form");

const loginMessage =
    document.getElementById("login-message");

const loginButton =
    document.getElementById("login-button");


// ==========================================
// FORM SUBMIT
// ==========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        // ------------------------------
        // VALIDATION
        // ------------------------------

        if (!email || !password) {

            showMessage(
                "Please enter your email and password.",
                "error"
            );

            return;

        }


        // ------------------------------
        // DISABLE BUTTON
        // ------------------------------

        loginButton.disabled =
            true;

        loginButton.textContent =
            "Logging in...";


        try {

            // ------------------------------
            // SEND LOGIN REQUEST
            // ------------------------------

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/login",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            email:
                                email,

                            password:
                                password

                        })

                    }
                );


            const data =
                await response.json();


            // ------------------------------
            // CHECK RESPONSE
            // ------------------------------

            if (!response.ok) {

                showMessage(
                    data.message ||
                    "Login failed.",
                    "error"
                );

                return;

            }

            // ==========================================
            // REMOVE ONLY OLD CART DATA
            // ==========================================

            // Old version of application
            localStorage.removeItem(
                "shoppingCart"
            );

            // Guest/testing cart
            localStorage.removeItem(
                "shoppingCart_guest"
            );

            // IMPORTANT:
            // DO NOT REMOVE shoppingCart_user_ID


            // ==========================================
            // REMOVE GUEST CART
            // ==========================================
            // Do not carry a guest/testing cart
            // into the newly logged-in account.
            // ==========================================

            localStorage.removeItem(
                "shoppingCart_guest"
            );


            // ------------------------------
            // SAVE LOGIN INFORMATION
            // ------------------------------

            localStorage.setItem(
                "authToken",
                data.token
            );


            localStorage.setItem(
                "currentUser",
                JSON.stringify(
                    data.user
                )
            );


            // ------------------------------
            // SUCCESS
            // ------------------------------

            showMessage(
                "Login successful! Redirecting...",
                "success"
            );


            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                1000
            );


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            showMessage(
                "Unable to connect to the server. Make sure the backend is running.",
                "error"
            );


        } finally {

            loginButton.disabled =
                false;

            loginButton.textContent =
                "Login";

        }

    }
);


// ==========================================
// DISPLAY MESSAGE
// ==========================================

function showMessage(
    message,
    type
) {

    loginMessage.textContent =
        message;


    loginMessage.className =
        `message ${type}`;

}