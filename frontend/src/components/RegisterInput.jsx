import React from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";

const RegisterInput = ({
  handleChange,
  password,
  first_name,
  last_name,
  email,
  handleSubmit,
}) => {
  const navigate = useNavigate();
  return (
    <div className="form-input">
      <form onSubmit={handleSubmit} className="form-wrapper">
        <input
          type="text"
          name="first_name"
          value={first_name}
          onChange={handleChange}
          placeholder="First name"
        />

        <input
          type="text"
          name="last_name"
          value={last_name}
          onChange={handleChange}
          placeholder="Last name"
        />

        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email address"
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
        />

        <button className="register-button" type="submit">
          Continue
        </button>

        <div className="other-login">
          <div className="login">
            <p>
              Have an account?
              <span onClick={() => navigate("/login")} className="login-link">
                Login
              </span>
            </p>
            <div className="google">
              <p className="or">or</p>

              <a
                href="https://pneuma-api-0bvr.onrender.com/auth/google"
                className="google-btn"
              >
                Sign up with Google
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default RegisterInput;
