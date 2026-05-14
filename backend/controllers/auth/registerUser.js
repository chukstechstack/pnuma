import RegistrationError from "../../utils/registrationError.js";
import bcryptjs from "bcryptjs";
import { findUserRegistration, registerNewUser } from "../../services/auth/authService.js";

const saltRound = 10;

export const registerUser = async (req, res, next) => {
  let { password, first_name, last_name, email, google_id, avatar_url } = req.body;

  password = password?.trim();
  first_name = first_name?.trim();
  last_name = last_name?.trim();
  email = email?.trim();
  google_id = google_id?.trim();
  avatar_url = avatar_url?.trim();

  try {
    if (!password) throw new RegistrationError("Password is required", 400);
    if (!first_name) throw new RegistrationError("First name is required", 400);
    if (!last_name) throw new RegistrationError("Last name is required", 400);
    if (!email) throw new RegistrationError("Email is required", 400);

    const user = await findUserRegistration(email);
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hash = await bcryptjs.hash(password, saltRound);

    const newUser = await registerNewUser({
      password: hash,
      first_name,
      last_name,
      email,
      google_id,
      avatar_url,
    });

    req.login(newUser, (err) => {
      if (err) return next(err);
      return res.status(201).json({ message: "user registered successfully" });
    });
  } catch (err) {
    if (err.code === "23505") {
      return next(new RegistrationError("Email already exists", 400));
    }
    next(err);
  }
};
