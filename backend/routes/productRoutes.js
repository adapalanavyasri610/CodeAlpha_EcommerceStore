const express = require("express");

const {
    getAllProducts,
    getProductById
} = require("../controllers/productController");

const router = express.Router();


// GET all products
router.get("/", getAllProducts);


// GET one product
router.get("/:id", getProductById);


module.exports = router;