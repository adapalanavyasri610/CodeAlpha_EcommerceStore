# CodeAlpha E-Commerce Store

A full-stack e-commerce web application developed as part of the CodeAlpha Full Stack Development Internship.

The application allows users to browse products, search and filter products, manage a shopping cart, maintain a wishlist, register and login securely, place orders, and view their order history.

---

## Features

### Product Management
- Product listing
- Product details
- Product search
- Category filtering
- Product sorting
- Stock availability

### Shopping Cart
- Add products to cart
- Increase or decrease quantity
- Remove products
- Account-specific cart
- Automatic cart total calculation
- Shipping calculation
- Free shipping for orders above ₹5000

### Wishlist
- Add products to wishlist
- Remove products from wishlist
- Account-specific wishlist
- Add wishlist products to cart

### User Authentication
- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected order APIs
- Account-specific data

### Checkout and Orders
- Checkout page
- Order processing
- Stock validation
- Automatic stock reduction after successful order
- Order success page
- My Orders page
- Order status

### Database
- MySQL database
- Users table
- Products table
- Orders table
- Order Items table
- Foreign key relationships

---

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Authentication
- bcryptjs
- JSON Web Token (JWT)

### Other Technologies
- CORS
- dotenv
- Postman
- Git
- GitHub

---

## Project Structure

```text
CodeAlpha_EcommerceStore
│
├── frontend
│   ├── css
│   │   └── style.css
│   │
│   ├── js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   ├── login.js
│   │   ├── my-orders.js
│   │   ├── product-details.js
│   │   ├── products.js
│   │   ├── register.js
│   │   └── wishlist.js
│   │
│   ├── cart.html
│   ├── checkout.html
│   ├── index.html
│   ├── login.html
│   ├── my-orders.html
│   ├── order-success.html
│   ├── product-details.html
│   ├── register.html
│   └── wishlist.html
│
├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── middleware
│   │   └── authMiddleware.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── database
│   └── ecommerce.sql
│
└── README.md