import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js"; // Clean middleware import

// Import each of your completely separated controllers
import { getTask } from "../controllers/task/getTask.js";
import { upload, createTask } from "../controllers/task/createTask.js"; // Pulls both function and upload middleware
import { patchTask } from "../controllers/task/patchTask.js";
import { deleteTask } from "../controllers/task/deleteTask.js";
import { getEditPage } from "../controllers/task/fetchEditTask.js";
import { toggleLike } from "../controllers/task/toggleLike.js";

const taskRouter = express.Router();

// 1. Protected Static Feed Read Route
taskRouter.get("/", ensureAuthenticated, getTask);

// 2. Protected Multi-part Media Creation Route (Inject Multer Here)
taskRouter.post("/", ensureAuthenticated, upload.single("img"), createTask);

// 3. Protected Dynamic Resource Parameter Routes
taskRouter.patch("/:uuid", ensureAuthenticated, upload.single("img"), patchTask);
taskRouter.delete("/:uuid", ensureAuthenticated, deleteTask);
taskRouter.get("/:uuid/post", ensureAuthenticated, getEditPage);
taskRouter.post("/:uuid/likes", ensureAuthenticated, toggleLike);

export default taskRouter;
