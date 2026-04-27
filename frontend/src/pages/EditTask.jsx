import { useEffect, useState, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TaskInput from "../components/EditInput.jsx";
import api from "../api/axios.js";
import TaskContext from "../context/TaskContext.jsx";

const EditPost = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { tasks, updateTaskInState } = useContext(TaskContext);
  const taskToEdit = tasks.find((t) => t.uuid === uuid);

  const [formData, setFormData] = useState({
    content: taskToEdit?.content || "",
    img: taskToEdit?.img || "",
  });

  const {content, img} = formData;
  const isInitialized = useRef(false);
  useEffect(() => {
    if (taskToEdit && !isInitialized.current) {
      setFormData({
        content: taskToEdit.content || "",
        img: taskToEdit.img || "",
      });
      isInitialized.current = true;
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (content) data.append("content", content);
    if (img instanceof File) {
      data.append("img", img);
    }
    try {
      const res = await api.patch(`/task/${uuid}`, data);
      setFormData({
        content: "",
        img: "",
      });
      updateTaskInState(res.data.updatedTask);
      navigate("/home");
    } catch (err) {
      const message = err.response?.data?.error || "Update failed";
      console.log(message);
    }
  };

  useEffect(() => {
    return () => {
      if (img) URL.revokeObjectURL(img);
    };
  }, [img]);

  return (
    <div>
      <h1> Edit Post </h1>

      <Link to="/taskhome/home"> Back</Link>
      <div>
        <TaskInput
          handleChange={handleChange}
          {...formData}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
export default EditPost;
