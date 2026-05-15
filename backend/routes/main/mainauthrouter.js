import express from "express";
import  authRoute  from "../authroute.js";

const mainAuthRoute = express.Router();

mainAuthRoute.use("/", authRoute);

export default mainAuthRoute;
