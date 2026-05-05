import DoveLogo from "../assets/dove-svgrepo-com.svg?react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";
const NavBar = () => {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-logo-section">
          {/* nave  Dove */}
          <div className="nav-dove-container">
            <DoveLogo className="dove-logo-svg" />
            <div className="pneuma-text">Pneuma</div>
          </div>

          {/* search input container*/}
          <div className="search-input-container">
            <svg viewBox="0 0 24 24" className="svg-styling search-svg-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            {/* input search */}
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
          </div>
        </div>

        {/* Home icons  */}
        <div className="nav-home-icons-container">
          <div className="home-container">
            {/* Home Svg */}
            <svg className="home-svg-icon" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="home-font-size">Home</span>
          </div>

          {/* -nav Message icons */}
          <div className="nav-message-icons">
            <svg className="messaging-svg-icon" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="message-font-size">Messaging</span>
          </div>

          {/* Notifications */}
          <div className="notification-icon-container">
            <svg className="notification-svg-styling" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="notification-font-size">Notifications</span>

            {/* THIS IS THE RED BADGE */}
            <span className="notification-red-bar">3</span>
          </div>

          {/* profile-bar-container */}
          <div className="profile-bar-container">
            <Link to="/profile" className="profile-link-styling">
              <img
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg"
                alt="Profile"
                className="profile-image-styling"
              />
              <span className="me-profile-text-me">Me</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
