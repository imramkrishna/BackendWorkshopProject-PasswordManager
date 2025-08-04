import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import TokenModel from "../Schema/tokenSchema.js";
const generateAccessTokenController = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const accessToken = await generateAccessToken(userId);
        const refreshToken = await generateRefreshToken(userId);
        await TokenModel.findOneAndUpdate(
            { userId },
            { refreshToken, expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
            { upsert: true, new: true }
        );
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        console.error("Error generating tokens:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export default generateAccessTokenController;