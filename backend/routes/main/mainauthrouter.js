import express from "express";
import { authRouter } from "../authroute.js";

const mainAuthRouter = express.Router();

mainAuthRouter.use("/", authRouter);

export { mainAuthRouter };
