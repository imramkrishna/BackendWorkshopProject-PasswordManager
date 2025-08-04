import PasswordModel from "../Schema/passwordSchema.js";
const deletePasswordController = async (req, res) => {
    try {
        const { id } = req.body;
        await PasswordModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Password deleted successfully" });
    } catch (error) {
        console.error("Error deleting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export default deletePasswordController;