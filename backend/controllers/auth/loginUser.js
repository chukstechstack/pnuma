import LoginError from "../../utils/loginError.js";
import passport from "passport";

export const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return next(new LoginError("user not found Register!!", 404));

    req.login(user, (err) => {
      if (err) return next(new LoginError("login failed", 500));
      return res.json({ message: "Login successful" });
    });
  })(req, res, next);
};
