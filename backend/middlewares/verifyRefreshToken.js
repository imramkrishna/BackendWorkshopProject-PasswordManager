import jwt from "jsonwebtoken";
import TokenModel from "../Schema/tokenSchema.js";
const verifyRefreshToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header is missing" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
    const userId = decoded.userId;
    if (!userId) {
        return res.status(403).json({ message: "User ID not found in token" });
    }
    // Check if the token exists in the database
    const tokenExists = await TokenModel.findOne({ userId, refreshToken: token });
    if (!tokenExists) {
        return res.status(403).json({ message: "Refresh token not found in database" });
    }
    req.userId = userId; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
}
export default verifyRefreshToken;