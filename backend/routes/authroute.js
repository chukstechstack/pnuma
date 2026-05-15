import express from "express";
import { registerUser } from "../controllers/auth/registerUser.js";
import { loginUser } from "../controllers/auth/loginUser.js";
import { logoutUser } from "../controllers/auth/logoutUser.js";
import { googleCallBack } from "../controllers/auth/googleCallback.js";
import { googleLogin } from "../controllers/auth/googleLogin.js";

const authRoute = express.Router();

authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);
authRoute.post("/logout", logoutUser);
authRoute.get("/google/callback", googleCallBack);

// Cleaned: This automatically maps to http://localhost:3000/auth/google
authRoute.get("/google", googleLogin);

export default authRoute;
