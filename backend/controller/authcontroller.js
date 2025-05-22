const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createLogger = require('../config/logger'); // ✅ Winston logger
const logger = createLogger('AUTH_CONTROLLER');

// === Register ===
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();
        logger.info(`👤 New user registered: ${email}`);

        res.status(200).json({
            message: "User Created Successfully",
            user
        });

    } catch (error) {
        logger.error(`❌ Error in register: ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// === Login ===
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`⚠️ Login failed — User not found: ${email}`);
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`⚠️ Login failed — Incorrect password: ${email}`);
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

        user.token = token;
        user.password = undefined; // Hide password before sending

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        };

        logger.info(`✅ Login successful: ${email}`);

        res.cookie("token", token, options).status(200).json({
            message: "Login Successful",
            token,
            user
        });

    } catch (error) {
        logger.error(`❌ Error in login: ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    register,
    login
};
