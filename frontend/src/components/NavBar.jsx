import DoveLogo from "../assets/dove-svgrepo-com.svg?react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = () => {
  const profileImg = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg";

  return (
    <>
      {/* MOBILE TOP NAV */}
      <nav className="mobile-top-nav">
        <div className="mobile-nav-left">
          <Link to="/profile">
            <img src={profileImg} className="mobile-avatar" alt="Me" />
          </Link>
          <div className="mobile-search-trigger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>Search</span>
          </div>
        </div>
        <div className="mobile-nav-right">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-bottom-nav">
        <Link to="/" className="nav-item active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </Link>

        <Link to="/createtask" className="nav-item post-trigger">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/>
          </svg>
          <span>Post</span>
        </Link>

        <Link to="/notifications" className="nav-item">
          <div className="icon-badge-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="badge">3</span>
          </div>
          <span>Notifications</span>
        </Link>
      </nav>

      {/* DESKTOP NAV */}
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-logo-section">
            <div className="nav-dove-container">
              <DoveLogo className="dove-logo-svg" />
              <div className="pneuma-text">Pneuma</div>
            </div>
            <div className="search-input-container">
              <svg viewBox="0 0 24 24" className="svg-styling search-svg-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search..." className="search-input" />
            </div>
          </div>

          <div className="nav-home-icons-container">
            <div className="home-container">
              <svg className="home-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span className="home-font-size">Home</span>
            </div>

            <div className="nav-message-icons">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              <span className="message-font-size">Messaging</span>
            </div>

            <div className="notification-icon-container">
              <svg className="notification-svg-styling" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="notification-font-size">Notifications</span>
              <span className="notification-red-bar">3</span>
            </div>

            <div className="profile-bar-container">
              <Link to="/profile" className="profile-link-styling">
                <img src={profileImg} alt="Profile" className="profile-image-styling" />
                <span className="me-profile-text-me">Me</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
