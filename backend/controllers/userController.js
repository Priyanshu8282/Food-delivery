import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import dotenv from 'dotenv';
dotenv.config(); 
// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User Not Found", success: false });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
       

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials", success: false });
        }

        const token = createToken(user._id);
        res.json({ success: true, token, message: "Login successfully" });
    } catch (error) {
        console.error("Login error:", error); // Log the error
        res.status(500).json({ message: "Server Error", success: false });
    }
};

const createToken = (id) => {
    try {
        const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return token;
    } catch (error) {
        console.error("Token creation error:", error); // Log the error
        return null;
    }
};

// Register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User Already Exists", success: false });
        }
        // Validate email & strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email", success: false });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters", success: false });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Original password:", password);
        console.log("Hashed password:", hashedPassword);

        // Create user
        const newUser = await userModel.create({ name, email, password: hashedPassword });

        // Create token
        const token = createToken(newUser._id);
        res.status(200).json({ message: "User Registered Successfully", success: true, token, user: { name: newUser.name, email: newUser.email } });
    } catch (error) {
        console.error("Registration error:", error); // Log the error
        res.status(500).json({ message: "Server Error", success: false });
    }
};

export { loginUser, registerUser };