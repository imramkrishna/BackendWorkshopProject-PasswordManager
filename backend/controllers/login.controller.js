import jwt from "jsonwebtoken";
import User from "../Schema/userSchema.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import TokenModel from "../Schema/tokenSchema.js";
import bcrypt from 'bcryptjs';
const loginController = async (req, res) => {
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
        const expDate = new Date(Date.now() + 15 * 60 * 1000);
        await TokenModel.findOneAndUpdate(
            { userId: user._id },
            { refreshToken, expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
            { upsert: true, new: true }
        );
        res.status(200).json({ accessToken, refreshToken, user, expDate });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export default loginController;