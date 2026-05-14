import React from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const LoginInput = ({ handleChange, password, email, handleSubmit }) => {
  const navigate = useNavigate();

  return (
    <div className="form-input">
      <form onSubmit={handleSubmit} className="form-wrapper">
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="email"
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="password"
        />

        <button className="register-button" type="submit">
          Continue
        </button>

        <div className="other-login">
          <div className="login">
            <p>
              create account?
              <span
                onClick={() => navigate("/register")}
                className="login-link"
              >
                Register
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
export default LoginInput;
