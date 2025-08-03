import express from "express"
import User from "./Schema/userSchema.js";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cors from "cors";
import PasswordModel from "./Schema/passwordSchema.js";
import encryptPassword from "./utils/encrypt.js";
import decryptPassword from "./utils/decrypt.js";
import { generateAccessToken, generateRefreshToken } from "./utils/token.js";
import jwt from 'jsonwebtoken';
import TokenModel from "./Schema/tokenSchema.js";
import { hashPassword } from "./utils/hashPassword.js";
import bcrypt from 'bcryptjs';
dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

app.get("/", (req, res) => {
    res.send("Server is running")
})
app.get("/profile", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header is missing" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token is missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const encryptedPasswords = await PasswordModel.find({ userId: userId });

        // Fix: Properly await the decryption and handle the async function
        const passwords = await Promise.all(
            encryptedPasswords.map(async (password) => {
                try {
                    const decryptedPassword = await decryptPassword(password.password);
                    return {
                        _id: password._id,
                        userId: password.userId,
                        title: password.title,
                        website: password.website,
                        email: password.email,
                        username: password.username,
                        password: decryptedPassword, // This should now be a string
                        notes: password.notes,
                        category: password.category,
                        createdAt: password.createdAt,
                        updatedAt: password.updatedAt
                    };
                } catch (decryptError) {
                    console.error('Error decrypting password for ID:', password._id, decryptError);
                    return {
                        ...password._doc,
                        password: 'Error decrypting' // Fallback
                    };
                }
            })
        );

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(`Returning ${passwords.length} passwords for user ${userId}`);
        console.log('Sample password object:', passwords[0]); // Debug log

        res.status(200).json({ passwords, user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})
app.delete("/deletePassword", async (req, res) => {
    try {
        const { id } = req.body;
        await PasswordModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Password deleted successfully" });
    } catch (error) {
        console.error("Error deleting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})
app.put("/updatePassword", async (req, res) => {
    try {
        const { id, newPassword } = req.body;
        const encryptedPassword = await encryptPassword(newPassword);
        await PasswordModel.findByIdAndUpdate(id, { password: encryptedPassword });
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})
app.post("/addPassword", async (req, res) => {
    try {
        const { userId, title, password, email, notes, website, category, username } = req.body;
        console.log("Received data:", req.body);
        const encryptedPassword = await encryptPassword(password);
        const newPassword = new PasswordModel({ userId, title, password: encryptedPassword, email, notes, website, category, username });
        await newPassword.save();
        res.status(201).json({ message: "Password added successfully", password: newPassword });
    } catch (error) {
        console.error("Error adding password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})
app.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await hashPassword(password);
        if (!hashedPassword) {
            return res.status(500).json({ message: "Error hashing password" });
        }

        const newUser = new User({ email, password: hashedPassword, name });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);
        await TokenModel.findOneAndUpdate(
            { userId: user._id },
            { refreshToken, expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
            { upsert: true, new: true }
        );
        res.status(200).json({ accessToken, user })
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})