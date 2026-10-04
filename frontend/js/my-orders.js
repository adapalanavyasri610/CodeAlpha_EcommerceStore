// ==========================================
// MY ORDERS
// ==========================================

const ordersContainer =
    document.getElementById("orders-container");


// ==========================================
// LOAD ORDERS
// ==========================================

async function loadOrders() {

    const token =
        localStorage.getItem("authToken");


    // ------------------------------------------
    // CHECK LOGIN
    // ------------------------------------------

    if (!token) {

        ordersContainer.innerHTML = `

            <div class="login-message">

                <h3>
                    Please login to view your orders.
                </h3>

                <a href="./login.html">
                    Login
                </a>

            </div>

        `;

        return;
    }


    // ------------------------------------------
    // FETCH ORDERS FROM BACKEND
    // ------------------------------------------

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/orders/my-orders",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        // ------------------------------------------
        // CHECK RESPONSE
        // ------------------------------------------

        if (!response.ok) {

            if (response.status === 401) {

                localStorage.removeItem("authToken");
                localStorage.removeItem("currentUser");

                ordersContainer.innerHTML = `

                    <div class="login-message">

                        <h3>
                            Your login session has expired.
                        </h3>

                        <a href="./login.html">
                            Login Again
                        </a>

                    </div>

                `;

                return;
            }

            throw new Error(
                data.message ||
                "Unable to load orders."
            );
        }


        // ------------------------------------------
        // CHECK IF ORDERS EXIST
        // ------------------------------------------

        if (
            !data.orders ||
            data.orders.length === 0
        ) {

            ordersContainer.innerHTML = `

                <div class="empty-orders">

                    <h3>
                        No Orders Yet
                    </h3>

                    <p>
                        You have not placed any orders yet.
                    </p>

                    <br>

                    <a href="./index.html">
                        Start Shopping
                    </a>

                </div>

            `;

            return;
        }


        // ------------------------------------------
        // DISPLAY ORDERS
        // ------------------------------------------

        ordersContainer.innerHTML = "";


        data.orders.forEach(
            function (order) {

                const orderCard =
                    document.createElement("div");


                orderCard.className =
                    "order-card";


                const formattedDate =
                    new Date(
                        order.created_at
                    ).toLocaleString();


                orderCard.innerHTML = `

                    <h3>
                        Order #${order.id}
                    </h3>

                    <p>

                        <strong>
                            Total Amount:
                        </strong>

                        ₹${Number(
                    order.total_amount
                ).toFixed(2)}

                    </p>

                    <p>

                        <strong>
                            Status:
                        </strong>

                        <span class="order-status">
                            ${order.status}
                        </span>

                    </p>

                    <p>

                        <strong>
                            Order Date:
                        </strong>

                        ${formattedDate}

                    </p>

                `;


                ordersContainer.appendChild(
                    orderCard
                );

            }
        );


    } catch (error) {

        console.error(
            "Load orders error:",
            error
        );


        ordersContainer.innerHTML = `

            <div class="empty-orders">

                <h3>
                    Unable to Load Orders
                </h3>

                <p>
                    ${error.message}
                </p>

                <br>

                <a href="./index.html">
                    Back to Home
                </a>

            </div>

        `;

    }

}


// ==========================================
// START
// ==========================================

loadOrders();