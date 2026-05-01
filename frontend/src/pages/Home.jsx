import { useNavigate, Link } from "react-router-dom";
import TaskContext from "../context/TaskContext.jsx";
import { useContext } from "react";
import api from "../api/axios.js";
import Task from "../components/HomeTaskInput.jsx";
import LikeButton from "../components/LikeButton";
import NavBar from "../components/NavBar";
import "../styles/Home.css";

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
    <div className="homePageBody">
      <NavBar />

      <div className="homebody">
        {/* ---  Profile badge SIDEBAR SECTION (Left) --- */}
        <div className="profileBody">
          <div className="profileBackground">
            {/* Blue Banner */}
            <div className="profileBanner" />

            {/* Profile Pic */}
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg"
              alt="profile"
              className=" profileBannerImage"
            />

            {/* Profile Name */}
            <div className="profileNameBody">
              <h3 className="profileName">Chukwunyelu Ki...</h3>
            </div>

            <div className="profileViewBackground">
              <Link to="/profile" className="profileView">
                View Profile
              </Link>
            </div>
          </div>
        </div>

        {/* --- Feed Card  --- */}
        {/* Moved this OUTSIDE of the sidebar div */}
        <div className="feedCardBodyWidth">
      

          <div className="taskCardBody">
                <div className="feedCardBackground">
         
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg"
              alt="profile"
              className="feedImage"
            />
               <button onClick={() => navigate("/createtask")}   className="shareTestimonyButton">
              Share a testimony...
            </button>
          </div>
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
