import React from "react";
import { Link } from "react-router-dom";
import LikeButton from "../components/LikeButton";

const Task = ({ task, deleteTask, isOwner }) => {
  const { title, content, img, uuid, author_name } = task;
  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid rgba(0,0,0,0.05)", // Very faint border
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(113, 81, 6, 0.05)",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#eee", // Placeholder for user avatar
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {author_name ? author_name[0] : "U"}
        </div>
        <div>
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>
            {author_name || "Unknown User"}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>Testimony</div>
        </div>
      </div>

      <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#333" }}>
        {content}
      </div>
      {img && (
        <div style={{ margin: "0 -16px" }}>
          {" "}
          {/* Pulls image to edges of card */}
          <img
            src={img}
            alt={title}
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
          />
        </div>
      )}

      <div
        style={{
          borderTop: "1px solid #eee",
          paddingTop: "10px",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <LikeButton task={task} />

        {isOwner && (
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              to={`/edittask/${uuid}`}
              style={{
                fontSize: "13px",
                color: "#bb8811",
                textDecoration: "none",
                fontWeight: "bold",
                marginTop: "15px",
              }}
            >
              Edit
            </Link>
            <button
              onClick={() => deleteTask(uuid)}
              style={{
                background: "none",
                border: "none",
                boxShadow: "none",
                color: "red",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
