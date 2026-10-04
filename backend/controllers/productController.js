const pool = require("../config/db");

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const [products] = await pool.query(
            "SELECT * FROM products ORDER BY id DESC"
        );

        res.status(200).json({
            success: true,
            count: products.length,
            products: products
        });

    } catch (error) {
        console.error("Error fetching products:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};


// Get one product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const [products] = await pool.query(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product: products[0]
        });

    } catch (error) {
        console.error("Error fetching product:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch product"
        });
    }
};


module.exports = {
    getAllProducts,
    getProductById
};