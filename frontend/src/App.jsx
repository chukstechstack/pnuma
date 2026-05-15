import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthHome from "./pages/LandingPage.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import HomePage from "./pages/Home.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import EditPost from "./pages/EditTask.jsx";
import { TaskProvider } from "./context/TaskContext";
import LogoutButton from "./pages/Profile.jsx";

const App = () => {
  return (
    <TaskProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/createtask" element={<CreateTask />} />
          <Route path="/edittask/:uuid" element={<EditPost />} />
          <Route path="profile" element={<LogoutButton />} />
        </Routes>
      </Router>
    </TaskProvider>
  );
};

export default App;
