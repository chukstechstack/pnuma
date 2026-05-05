import React, { useState, useEffect, useContext } from "react";
import TaskInput from "../components/CreateTaskInput";
import { useNavigate, Link } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import api from "../api/axios.js";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    img: null,
    category: "",
    tags: "",
  });

  const { addTaskToState } = useContext(TaskContext);
  const navigate = useNavigate();

  const { content, img} = formData;
  const handleFormData = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const submitTask = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    try {
      const res = await api.post("/task", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData({
        title: "",
        content: "",
        img: null,
        category: "",
        tags: "",
        user_id: "",
      });
      addTaskToState(res.data.newTask);
      navigate("/home");
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      console.error(message);
    }
  };

  useEffect(() => {
    return () => {
      if (img) URL.revokeObjectURL(img);
    };
  }, [img]);

  return (
    <div>
      <h1> Create A Testimony </h1>

     
      <TaskInput
        content={content}
        img={img}
        handleFormData={handleFormData}
        submitTask={submitTask}
      />
    </div>
  );
};

export default CreateTask;
