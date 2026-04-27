import React, { useState } from "react";
import LoginInput from "../components/LoginInput.jsx";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { Link } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import { useContext } from "react";
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
    setIsLoading(true)
    try {
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
      setIsLoading(false)

    }
  };
  return (
    <div>
      {isLoading && <FullPageLoader/>}
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
