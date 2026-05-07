import React, { useState } from "react";
import { Link } from "react-router-dom";
import LikeButton from "../components/LikeButton";
import "../styles/Home.css";
import { MessageSquare, Repeat2, Send } from 'lucide-react';

const Task = ({ task, deleteTask, isOwner }) => {
  const { title, content, img, uuid, author_name } = task;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const textLimit = 123;
  const shouldShowMore = content.length > textLimit;

  return (
    <div className="taskInputCardBody">
      {/* --- TOP SECTION (Avatar + Name pushed right + Menu) --- */}
      <div className="taskAvatarCardBody" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="taskAvatarcardBackground" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
            alt="profile"
            className="taskAvatarImage"
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="taskAuthorName">
              {author_name || "Unknown User"}
            </div>
            <div className="taskCardTestimonyText">Testimony</div>
          </div>
        </div>

        {/* THREE DOT MENU (Far Right) */}
        {isOwner && (
          <div className="TaskDotMenuPosition" style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="taskDotButton"
            >
              ⋮
            </button>

            {showMenu && (
              <div className="dotMenuDisplay">
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
        <div className={!isExpanded && shouldShowMore ? "clamp-wrapper" : ""}>
          {content}
        </div>
        
        {shouldShowMore && !isExpanded && (
          <button onClick={() => setIsExpanded(true)} className="showMoreText">
            ... see more
          </button>
        )}
      </div>

      {/* --- IMAGE SECTION --- */}
      {img && (
        <div className="taskImageWrapper">
          <img src={img} alt={title} className="taskContentImageCard" />
        </div>
      )}

      {/* --- ACTION BAR (Likes kept inside) --- */}
      <div className="taskActionButtonBar">
        <div className="action-buttons-left">
          <LikeButton task={task} />
          
          <button className="actionButton"> 
            <MessageSquare size={20} strokeWidth={1.5} /> 
            <span>Comment</span>
          </button>

          <button className="actionButton"> 
            <Repeat2 size={20} strokeWidth={1.5} /> 
            <span>Repost</span>
          </button>

          <button className="actionButton"> 
            <Send size={20} strokeWidth={1.5} /> 
            <span>Send</span>
          </button>
        </div>
        
        <div className="total-likes-count">
           24 likes
        </div>
      </div>
    </div>
  );
};

export default Task;
