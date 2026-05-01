import React, { useContext } from "react";
import TaskContext from "../context/TaskContext";
import api from "../api/axios";
import { toast } from "react-toastify";

const LikeButton = ({ task }) => {
  const { toggleLikeInState } = useContext(TaskContext);
  const handleLike = async () => {
    try {
      const res = await api.post(`/task/${task.uuid}/likes`);
      toggleLikeInState(task.uuid, res.data.liked);
    } catch (err) {
      toast.error("could not process like", err.message);
    }
  };

  return (
    <div onClick={handleLike}>
      <button
        className={`actionButton ${task.is_liked ? "isLiked" : ""}`}
        onClick={handleLike}
      >
        <span style={{ fontSize: "14px" }}>
          {" "}
          {task.is_liked ? "👍" : "👍"}{" "}
        </span>
        <span>Like</span>
        {task.like_count > 0 && (
          <span style={{ fontSize: "12px" }}>{task.like_count}</span>
        )}
      </button>
    </div>
  );
};

export default LikeButton;
