// ==========================================
// REGISTER USER
// ==========================================

const registerForm =
    document.getElementById("register-form");

const registerMessage =
    document.getElementById("register-message");

const registerButton =
    document.getElementById("register-button");


// ==========================================
// FORM SUBMIT
// ==========================================

registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();


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
        // BASIC VALIDATION
        // ------------------------------

        if (
            !name ||
            !email ||
            !password
        ) {

            showMessage(
                "Please fill in all fields.",
                "error"
            );

            return;

        }


        if (password.length < 6) {

            showMessage(
                "Password must be at least 6 characters.",
                "error"
            );

            return;

        }


        // ------------------------------
        // DISABLE BUTTON
        // ------------------------------

        registerButton.disabled =
            true;


        registerButton.textContent =
            "Creating Account...";


        try {

            // ------------------------------
            // SEND REQUEST
            // ------------------------------

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/register",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            name:
                                name,

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
                    "Registration failed.",
                    "error"
                );

                return;

            }


            // ------------------------------
            // SUCCESS
            // ------------------------------

            showMessage(
                "Account created successfully! Redirecting to login...",
                "success"
            );


            registerForm.reset();


            // ------------------------------------------
            // REMOVE OLD GLOBAL TESTING DATA
            // ------------------------------------------

            localStorage.removeItem(
                "shoppingCart"
            );


            localStorage.removeItem(
                "shoppingCart_guest"
            );


            localStorage.removeItem(
                "lastOrder"
            );


            // ------------------------------------------
            // REDIRECT TO LOGIN
            // ------------------------------------------

            setTimeout(
                function () {

                    window.location.href =
                        "login.html";

                },
                1500
            );


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            showMessage(
                "Unable to connect to the server. Make sure the backend is running.",
                "error"
            );


        } finally {

            registerButton.disabled =
                false;


            registerButton.textContent =
                "Create Account";

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

    registerMessage.textContent =
        message;


    registerMessage.className =
        `message ${type}`;

}