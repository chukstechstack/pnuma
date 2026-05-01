import express from "express";
import taskRouter from "../taskroute.js";

const mainTaskRouter = express.Router();

mainTaskRouter.use("/", taskRouter);


export default mainTaskRouter ;