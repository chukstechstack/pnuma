import { useNavigate, Link } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import { useContext } from "react";
import api from "../api/axios.js";
import Task from "../components/HomeTaskInput.jsx";
import LikeButton from "../components/LikeButton";
import NavBar from "../components/NavBar";

const HomePage = () => {
  const { tasks, deleteTaskFromState, currentUserId } = useContext(TaskContext);
  const navigate = useNavigate();

  // const logout = async () => {
  //   try {
  //     await api.post("/auth/logout");
  //     navigate("/login");
  //   } catch (err) {
  //     const message = err?.response?.data?.error || err.message;
  //     console.log(message);
  //   }
  // };

  const deleteTask = async (uuid) => {
    try {
      await api.delete(`/task/${uuid}`);
      deleteTaskFromState(uuid);
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      console.log(message);
    }
  };
  return (
    <div
      style={{
        backgroundColor: "#f6f2f2",
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center", // Centers the whole 800px block
        alignItems: "flex-start",
        paddingTop: "90px",
        gap: "25px",
      }}
    >
      <NavBar />

      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "1000px", // Align with NavBar max-width
          padding: "0 20px", // Align with NavBar horizontal padding
          gap: "70px", // Standard LinkedIn-style space between items
          alignItems: "flex-start",
        }}
      >
        {/* --- SIDEBAR SECTION (Left) --- */}
        <div style={{ width: "225px" , position: "sticky", top:"90px"}}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #ddd",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column", // BACK TO COLUMN
              alignItems: "center",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* Blue Banner */}
            <div
              style={{
                width: "100%",
                height: "60px",
                backgroundColor: "#061a83",
              }}
            />

            {/* Profile Pic */}
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg"
              alt="profile"
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                border: "3px solid white",
                marginTop: "-35px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "15px", textAlign: "center" }}>
              <h3
                style={{
                  margin: "0",
                  fontSize: "15px",
                  fontWeight: "900",
                  color: "#1c1a1a",
                }}
              >
                Chukwunyelu Ki...
              </h3>
            </div>

            <div
              style={{
                width: "100%",
                borderTop: "1px solid #eee",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <Link
                to="/profile"
                style={{
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#bb8811",
                }}
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>

        {/* --- FEED SECTION (Right) --- */}
        {/* Moved this OUTSIDE of the sidebar div */}
        <div style={{ width: "500px" }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              marginBottom: "15px",
              gap: "10px",
              height: "70px",
              boxShadow: "0 4px 12px rgba(94, 67, 3, 0.15)",
            }}
          >
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg"
              alt="profile"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <button
              onClick={() => navigate("/createtask")}
              style={{
                flex: 1,
                height: "48px",
                textAlign: "left",
                paddingLeft: "16px",
                backgroundColor: "white",
                border: "1px solid #a9a70b",
                borderRadius: "35px",
                color: "#666",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                outline: "none",
              }}
            >
              Share a testimony...
            </button>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                isOwner={task.user_id === currentUserId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
