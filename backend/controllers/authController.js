const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");


// ==========================================
// USER REGISTRATION
// ==========================================

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // ------------------------------
        // VALIDATION
        // ------------------------------

        if (!name || !email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, email and password are required."

            });

        }


        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters long."

            });

        }


        // ------------------------------
        // CHECK EXISTING USER
        // ------------------------------

        const [existingUsers] =
            await pool.query(

                "SELECT id FROM users WHERE email = ?",

                [email]

            );


        if (existingUsers.length > 0) {

            return res.status(409).json({

                success: false,

                message:
                    "An account with this email already exists."

            });

        }


        // ------------------------------
        // HASH PASSWORD
        // ------------------------------

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ------------------------------
        // INSERT USER
        // ------------------------------

        const [result] =
            await pool.query(

                `INSERT INTO users
                (name, email, password)
                VALUES (?, ?, ?)`,

                [
                    name,
                    email,
                    hashedPassword
                ]

            );


        // ------------------------------
        // RESPONSE
        // ------------------------------

        res.status(201).json({

            success: true,

            message:
                "User registered successfully!",

            user: {

                id: result.insertId,

                name: name,

                email: email

            }

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error during registration."

        });

    }

};



// ==========================================
// USER LOGIN
// ==========================================

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ------------------------------
        // VALIDATION
        // ------------------------------

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });

        }


        // ------------------------------
        // FIND USER
        // ------------------------------

        const [users] =
            await pool.query(

                "SELECT * FROM users WHERE email = ?",

                [email]

            );


        if (users.length === 0) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        const user = users[0];


        // ------------------------------
        // CHECK PASSWORD
        // ------------------------------

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        // ------------------------------
        // CREATE JWT TOKEN
        // ------------------------------

        const token =
            jwt.sign(

                {
                    id: user.id,

                    email: user.email

                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1d"
                }

            );


        // ------------------------------
        // RESPONSE
        // ------------------------------

        res.status(200).json({

            success: true,

            message:
                "Login successful!",

            token: token,

            user: {

                id: user.id,

                name: user.name,

                email: user.email

            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error during login."

        });

    }

};



module.exports = {

    registerUser,

    loginUser

};