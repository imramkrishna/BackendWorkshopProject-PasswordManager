import encryptPassword from "../utils/encrypt.js";
import PasswordModel from "../Schema/passwordSchema.js";
const addPasswordController = async (req, res) => {
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
}

export default addPasswordController;
