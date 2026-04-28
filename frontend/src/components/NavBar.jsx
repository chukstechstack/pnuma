import DoveLogo from "../assets/dove-svgrepo-com.svg?react";
import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <nav
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        zIndex: "100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "4px 40px",
        borderBottom: "1px solid #ddd",
        backgroundColor: "white",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              lineHeight: "1.5",
            }}
          >
            <DoveLogo
              style={{
                width: "25px",
                height: "25px",
                fill: "#19191a",
                stroke: "none",
                marginBottom: "-5px",
              }}
            />
            <div
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "rgb(113, 81, 6)",
                letterSpacing: "1px",
              }}
            >
              Pneuma
            </div>
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg
              style={{
                position: "absolute",
                left: "12px",
                color: "#777879",
              }}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>

            <input
              type="text"
              placeholder="Search..."
              style={{
                padding: "4px 15px 8px 35px",
                borderRadius: "20px",
                border: "1px solid #8c8c90",
                backgroundColor: "white",
                width: "250px",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="#bb8811"
              stroke="#bb8811"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span style={{ fontSize: "12px" }}>Home</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#bb8811"
              stroke="#bb8811"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span style={{ fontSize: "12px" }}>Messaging</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#bb8811"
              stroke="#bb8811"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span style={{ fontSize: "12px" }}>Notifications</span>

            {/* THIS IS THE RED BADGE */}
            <span
              style={{
                position: "absolute",
                top: "-2px",
                right: "8px",
                backgroundColor: "#cc0000",
                color: "white",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                fontSize: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              3
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Link
              to="/profile"
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg"
                alt="Profile"
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #bb8811",
                }}
              />
              <span
                style={{ fontSize: "12px", color: "black", marginTop: "2px" }}
              >
                Me
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
