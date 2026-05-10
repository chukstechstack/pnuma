import React, { useContext } from "react";
import TaskContext from "../context/TaskContext";
import api from "../api/axios";
import { toast } from "react-toastify";
// Import the icon
import { ThumbsUp } from 'lucide-react';

const LikeButton = ({ task }) => {
  const { toggleLikeInState } = useContext(TaskContext);

  const handleLike = async (e) => {
    e.stopPropagation(); // Prevents clicking the post accidentally
    try {
      const res = await api.post(`/task/${task.uuid}/likes`);
      toggleLikeInState(task.uuid, res.data.liked);
    } catch (err) {
      toast.error("Could not process like", err);
    }
  };

  return (
    <button
      className={`actionButton ${task.is_liked ? "isLiked" : ""}`}
      onClick={handleLike}
      style={{ color: task.is_liked ? "#0a66c2" : "#666666" }} // LinkedIn Blue when liked
    >
      <ThumbsUp 
        size={20} 
        strokeWidth={1.5} 
        fill={task.is_liked ? "#0a66c2" : "none"} // Fills the icon when liked
      />
      <span>Like</span>
    </button>
  );
};

export default LikeButton;
