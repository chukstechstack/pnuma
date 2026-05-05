import React, { useState } from "react";
import { Link } from "react-router-dom";
import LikeButton from "../components/LikeButton";
import "../styles/Home.css";

const Task = ({ task, deleteTask, isOwner }) => {
  const { title, content, img, uuid, author_name } = task;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const textLimit = 123;
  const shouldShowMore = content.length > textLimit;

  // Simple style for the buttons inside the menu

  return (
    <div className="taskInputCardBody">
      {/* --- TOP SECTION (Avatar + Menu) --- */}
      <div className="taskAvatarCardBody">
        <div className="avatarCardBackground">
          <img
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
            alt="profile"
            className="taskAvatarImage"
          />
          <div>
            <div className="taskAuthorName">
              {author_name || "Unknown User"}
            </div>
            <div className="taskCardTestimonyTex">Testimony</div>
          </div>
        </div>

        {/* THREE DOT MENU MOVED HERE (TOP RIGHT) */}
        {isOwner && (
          <div className="TaskDotMenuPosition">
            <button
              onClick={() => setShowMenu(!showMenu)} // Corrected to onClick (Capital C)
              className="taskDotButton"
            >
              ⋮
            </button>

            {showMenu && (
              <div className="dotMenuDisplay">
                {/* Link styled as a button */}
                <Link to={`/edittask/${uuid}`} className="menuEditButtonStyle">
                  Edit Post
                </Link>

                <button
                  onClick={() => deleteTask(uuid)}
                  className="menuDeleteButtonStyle"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      
  {/* --- POST CONTENT --- */}
<div className="postTextContent">
  {/* Changed from span to div */}
  <div className={!isExpanded && shouldShowMore ? "clamp-wrapper" : ""}>
    {content}
  </div>
  
  {shouldShowMore && !isExpanded && (
    <button onClick={() => setIsExpanded(true)} className="showMoreText">
      ... see more
    </button>
  )}
</div>



      {img && (
        <div style={{ margin: "0 -16px" }}>
          <img src={img} alt={title} className="taskContentImageCard" />
        </div>
      )}

      {/* --- BOTTOM SECTION (Like Button) --- */}
      <div className="taskActionButtonBar">
        <LikeButton task={task} />
        <button className="actionButton" onClick={() => {}}> <span> 💬</span> <span> Comment</span></button>
          <button className="actionButton" onClick={() => {}}> <span> 🔄</span> <span> Repost</span></button>
          <button className="actionButton" onClick={() => {}}> <span> ✈️</span> <span> Send</span></button>
      </div>
    </div>
  );
};

export default Task;
