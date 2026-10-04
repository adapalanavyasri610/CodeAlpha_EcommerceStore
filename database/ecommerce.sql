CREATE DATABASE IF NOT EXISTS codealpha_ecommerce;

USE codealpha_ecommerce;

-- =========================
-- USERS TABLE
-- =========================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PRODUCTS TABLE
-- =========================

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    stock INT DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ORDERS TABLE
-- =========================

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Placed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- ORDER ITEMS TABLE
-- =========================

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

-- =========================
-- SAMPLE PRODUCTS
-- =========================

INSERT INTO products
(name, description, price, image, stock, category)
VALUES
(
    'Wireless Headphones',
    'High quality wireless headphones with clear sound and comfortable design.',
    2499.00,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    25,
    'Electronics'
),
(
    'Mechanical Keyboard',
    'RGB mechanical keyboard suitable for gaming and programming.',
    3499.00,
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    20,
    'Electronics'
),
(
    'Wireless Mouse',
    'Ergonomic wireless mouse with smooth tracking.',
    999.00,
    'https://images.unsplash.com/photo-1527814050087-3793815479db',
    30,
    'Accessories'
),
(
    'Smart Watch',
    'Smart watch with fitness tracking and notification support.',
    4999.00,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    15,
    'Wearables'
),
(
    'Laptop Backpack',
    'Water-resistant laptop backpack with multiple compartments.',
    1599.00,
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    40,
    'Bags'
);