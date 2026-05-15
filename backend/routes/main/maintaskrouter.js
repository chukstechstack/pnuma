import express from "express";
import taskRoute from "../taskroute.js";

const mainTaskRoute = express.Router();

mainTaskRoute.use("/", taskRoute);


export default mainTaskRoute ;