// ==========================================
// ORDER CONTROLLER
// ==========================================

const pool = require("../config/db");


// ==========================================
// CREATE ORDER
// ==========================================

const createOrder = async (req, res) => {

    const connection =
        await pool.getConnection();


    try {

        // ------------------------------------------
        // GET LOGGED-IN USER
        // ------------------------------------------

        const userId =
            req.user.id;


        // ------------------------------------------
        // GET CART ITEMS
        // ------------------------------------------

        const { items } =
            req.body;


        // ------------------------------------------
        // VALIDATE CART
        // ------------------------------------------

        if (
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Cart is empty."

            });

        }


        // ------------------------------------------
        // START TRANSACTION
        // ------------------------------------------

        await connection.beginTransaction();


        let subtotal = 0;

        const orderItems = [];


        // ==========================================
        // CHECK EACH PRODUCT
        // ==========================================

        for (
            const item of items
        ) {

            const productId =
                item.product_id;


            const quantity =
                Number(item.quantity);


            // ------------------------------------------
            // VALIDATE PRODUCT AND QUANTITY
            // ------------------------------------------

            if (
                !productId ||
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {

                await connection.rollback();


                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid product or quantity."

                });

            }


            // ------------------------------------------
            // GET PRODUCT
            // ------------------------------------------

            const [products] =
                await connection.query(

                    `SELECT *
                     FROM products
                     WHERE id = ?
                     FOR UPDATE`,

                    [productId]

                );


            // ------------------------------------------
            // PRODUCT NOT FOUND
            // ------------------------------------------

            if (
                products.length === 0
            ) {

                await connection.rollback();


                return res.status(404).json({

                    success: false,

                    message:
                        `Product ${productId} not found.`

                });

            }


            const product =
                products[0];


            // ------------------------------------------
            // CHECK STOCK
            // ------------------------------------------

            if (
                product.stock < quantity
            ) {

                await connection.rollback();


                return res.status(400).json({

                    success: false,

                    message:
                        `${product.name} does not have enough stock.`

                });

            }


            // ------------------------------------------
            // CALCULATE ITEM TOTAL
            // ------------------------------------------

            const itemTotal =
                Number(product.price) *
                quantity;


            subtotal +=
                itemTotal;


            // ------------------------------------------
            // STORE ORDER ITEM
            // ------------------------------------------

            orderItems.push({

                productId:
                    product.id,

                quantity:
                    quantity,

                price:
                    Number(product.price)

            });

        }


        // ==========================================
        // CALCULATE SHIPPING
        // ==========================================

        const shipping =
            subtotal >= 5000
                ? 0
                : 100;


        // ==========================================
        // CALCULATE FINAL TOTAL
        // ==========================================

        const totalAmount =
            subtotal + shipping;


        // ==========================================
        // CREATE ORDER
        // ==========================================

        const [orderResult] =
            await connection.query(

                `INSERT INTO orders
                (
                    user_id,
                    total_amount,
                    status
                )
                VALUES (?, ?, ?)`,

                [
                    userId,
                    totalAmount,
                    "Placed"
                ]

            );


        const orderId =
            orderResult.insertId;


        // ==========================================
        // CREATE ORDER ITEMS
        // ==========================================

        for (
            const item of orderItems
        ) {

            await connection.query(

                `INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    quantity,
                    price
                )
                VALUES (?, ?, ?, ?)`,

                [
                    orderId,
                    item.productId,
                    item.quantity,
                    item.price
                ]

            );


            // ------------------------------------------
            // REDUCE STOCK
            // ------------------------------------------

            await connection.query(

                `UPDATE products
                 SET stock = stock - ?
                 WHERE id = ?`,

                [
                    item.quantity,
                    item.productId
                ]

            );

        }


        // ==========================================
        // COMMIT TRANSACTION
        // ==========================================

        await connection.commit();


        // ==========================================
        // SEND SUCCESS RESPONSE
        // ==========================================

        res.status(201).json({

            success: true,

            message:
                "Order placed successfully!",

            order: {

                id:
                    orderId,

                subtotal:
                    Number(subtotal.toFixed(2)),

                shipping:
                    Number(shipping.toFixed(2)),

                total_amount:
                    Number(totalAmount.toFixed(2)),

                status:
                    "Placed"

            }

        });


    } catch (error) {

        // ------------------------------------------
        // ROLLBACK IF ERROR
        // ------------------------------------------

        await connection.rollback();


        console.error(
            "Order creation error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to place order."

        });


    } finally {

        connection.release();

    }

};


// ==========================================
// GET MY ORDERS
// ==========================================

const getMyOrders = async (req, res) => {

    try {

        const userId =
            req.user.id;


        const [orders] =
            await pool.query(

                `SELECT *
                 FROM orders
                 WHERE user_id = ?
                 ORDER BY created_at DESC`,

                [userId]

            );


        res.status(200).json({

            success: true,

            orders:
                orders

        });


    } catch (error) {

        console.error(
            "Error fetching orders:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch orders."

        });

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    createOrder,

    getMyOrders

};