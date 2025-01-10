import express from "express";
import UserController from "../controllers/UserController.js";
import { authUser } from "../middleware/AuthMiddleware.js";

const userRouter = express.Router();

userRouter.route("/register").post(UserController.registerUser);
userRouter.route("/login").post(UserController.loginUser);
userRouter.route("/profile").get(authUser, UserController.getProfile);
userRouter.route("/logout").get(UserController.logoutUser);

export default userRouter;
