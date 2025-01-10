import jwt from "jsonwebtoken";
import userModel from "../models/UserModel.js";
import { blackListTokenModel } from "../models/BlackListTokenModel.js";

export const authUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ message: "Unautherised Access" });
  }

  const isBlackListed = await blackListTokenModel.findOne({ token });
  if (isBlackListed) {
    return res.status(400).json({ message: "Unautherised Access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded._id);

    req.user = user;

    return next();
  } catch (error) {
    return res.status(400).json({ message: "Unautherised Access" });
  }
};
