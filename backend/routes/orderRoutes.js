const express = require("express");


const {
    createOrder,
    getMyOrders
} = require("../controllers/orderController");


const protect =
    require("../middleware/authMiddleware");


const router =
    express.Router();


// ==========================================
// CREATE ORDER
// ==========================================

router.post(
    "/",
    protect,
    createOrder
);


// ==========================================
// GET LOGGED-IN USER'S ORDERS
// ==========================================

router.get(
    "/my-orders",
    protect,
    getMyOrders
);


module.exports = router;