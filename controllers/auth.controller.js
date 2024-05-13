const db = require('../models');
const User = db.user;
const config = require('../config/auth.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = 'your_secret_jwt_key';  

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role, phone_number } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone_number
        });

        const token = jwt.sign({ user_id: newUser.user_id, role: newUser.role }, config.secret, { expiresIn: '24h' });

        res.status(201).json({ message: "User registered successfully!", token, user_id: newUser.user_id, role: newUser.role });
    } catch (error) {
        res.status(500).send({ message: "Failed to register user.", error: error.message });
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid password." });
        }

        const token = jwt.sign({ user_id: user.user_id, role: user.role }, config.secret, { expiresIn: '24h' });

        res.status(200).json({ message: "User logged in successfully!", token, user_id: user.user_id, role: user.role });
    } catch (error) {
        res.status(500).send({ message: "Login failed.", error: error.message });
    }
};

