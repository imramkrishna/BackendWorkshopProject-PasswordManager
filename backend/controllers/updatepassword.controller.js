import encryptPassword from "../utils/encrypt.js";
import PasswordModel from "../Schema/passwordSchema.js";
const updatePasswordController = async (req, res) => {
    try {
        const { id, newPassword } = req.body;
        const encryptedPassword = await encryptPassword(newPassword);
        await PasswordModel.findByIdAndUpdate(id, { password: encryptedPassword });
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export default updatePasswordController;