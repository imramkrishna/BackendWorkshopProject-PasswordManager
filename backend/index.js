import express from "express"
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cors from "cors";
import profileController from "./controllers/profile.controller.js";
import deletePasswordController from "./controllers/deletepassword.controller.js";
import updatePasswordController from "./controllers/updatepassword.controller.js";
import addPasswordController from "./controllers/addpassword.controller.js";
import registerController from "./controllers/register.controller.js";
import loginController from "./controllers/login.controller.js";
import generateAccessTokenController from "./controllers/generateAccessToken.controller.js";
import verifyRefreshToken from "./middlewares/verifyRefreshToken.js";
dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

app.get("/", (req, res) => {
    res.send("Server is running")
})

// User management routes
app.get("/profile", profileController)

// Password management routes
app.delete("/deletePassword", deletePasswordController)
app.put("/updatePassword", updatePasswordController)
app.post("/addPassword", addPasswordController)

//Login and Register routes
app.post("/register", registerController)
app.post("/login", loginController)


//token generation and verification
app.get("/generateAccessToken", verifyRefreshToken, generateAccessTokenController);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})