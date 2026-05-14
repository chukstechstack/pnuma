import LoginError from "../../utils/loginError.js";
import passport from "passport";

export const googleLogin = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
};

export const googleCallBack = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("http://localhost:5173/login");
    
    req.login(user, (err) => {
      if (err) return next(new LoginError("session creation failed", 500));
      return res.redirect("http://localhost:5173/home");
    });
  })(req, res, next);
};
