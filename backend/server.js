const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const productRoutes =
    require("./routes/productRoutes");

const authRoutes =
    require("./routes/authRoutes");

const orderRoutes =
    require("./routes/orderRoutes");


const app = express();

const PORT =
    process.env.PORT || 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// ROUTES
// ==========================================

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);


// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.json({

        message:
            "CodeAlpha E-commerce API is running successfully!"

    });

});


// ==========================================
// DATABASE TEST
// ==========================================

app.get(
    "/api/test-db",
    async (req, res) => {

        try {

            const [rows] =
                await pool.query(
                    "SELECT 1 AS result"
                );


            res.json({

                success: true,

                message:
                    "Database connection is working!",

                data:
                    rows

            });


        } catch (error) {

            console.error(error);


            res.status(500).json({

                success: false,

                message:
                    "Database connection failed"

            });

        }

    }
);


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);