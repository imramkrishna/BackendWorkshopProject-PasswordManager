import express from "express"
import User from "./Schema/userSchema.js";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cors from "cors";
import PasswordModel from "./Schema/passwordSchema.js";
import encryptPassword from "./utils/encrypt.js";
dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

app.get("/", (req, res) => {
    res.send("Server is running")
})

app.post("/addPassword", async (req, res) => {
    try {
        const { id, title, password, email, notes, website, category, username } = req.body;
        console.log("Received data:", req.body);
        const encryptedPassword = await encryptPassword(password);
        const newPassword = new PasswordModel({ userId: id, title, password: encryptedPassword, email, notes, website, category, username });
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

        const newUser = new User({ email, password, name });
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
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})