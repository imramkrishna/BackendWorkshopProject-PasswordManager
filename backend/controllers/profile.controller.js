import jwt from "jsonwebtoken";
import PasswordModel from "../Schema/passwordSchema.js";
import User from "../Schema/userSchema.js";
import decryptPassword from "../utils/decrypt.js";

const profileController = async (req, res) => {
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
}
export default profileController;