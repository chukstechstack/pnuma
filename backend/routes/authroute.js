import express from "express";
import passport from "../config/passport.js";
import { registerUser } from "../controllers/auth/registerUser.js";
import { loginUser } from "../controllers/auth/loginUser.js";
import { logoutUser } from "../controllers/auth/logoutUser.js";
import { googleLogin, googleCallBack } from "../controllers/auth/googleAuth.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser); 
authRouter.post("/logout", logoutUser);
authRouter.get("/google/callback", googleCallBack);

// Cleaned: This automatically maps to http://localhost:3000/auth/google
authRouter.get("/google", googleLogin);

export { authRouter };
