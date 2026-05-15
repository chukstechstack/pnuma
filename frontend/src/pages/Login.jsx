import React, { useState,  useContext } from "react";
import LoginInput from "../components/LoginInput.jsx";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import TaskContext from "../context/TaskContext.jsx";
import "../styles/Login.css";
import FullPageLoader from "../components/Loader.jsx";
import "../styles/Loader.css";

const Login = () => {
  const [login, setLogin] = useState({
    password: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { getTasks } = useContext(TaskContext);
  const navigate = useNavigate();

  const { email, password } = login;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await api.post("/auth/login", login);
      setLogin({
        email: "",
        password: "",
      });
      await getTasks();
      navigate("/home");
      console.log(res);
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      console.log(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {isLoading && <FullPageLoader />}
      <div className="login-body">
        <div className="login-text">
          <h1> Welcome Back </h1>
        </div>
        <LoginInput
          handleChange={handleChange}
          email={email}
          password={password}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Login;
