import { blackListTokenModel } from "../models/BlackListTokenModel.js";
import userModel from "../models/UserModel.js";

// ********************
// REGISTER_USER
// ********************

const registerUser = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const fullname = { firstname: firstname, lastname: lastname };
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists." });
    }

    const user = await userModel.create({
      fullname,
      email,
      password,
    });

    return res.status(200).json({
      message: "User successfully created.",
      token: await user.generateJWT(),
      userId: user._id.toString(),
    });
  } catch (error) {
    console.log("User register error:", error);
  }
};

// ********************
// LOGIN_USER
// ********************

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "email or password is incorrect." });
    }

    const isMatch = user.comparepassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "email or password is incorrect." });
    }

    const token = await user.generateJWT();
    res.cookie("token", token);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login Error:", error);
  }
};

// ********************
// PROFILE_USER
// ********************

const getProfile = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};

// ********************
// LOGOUT_USER
// ********************

const logoutUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    await blackListTokenModel.create({ token: token });
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.log("Something error while logging out:", error);
  }
};

export default { registerUser, loginUser, getProfile, logoutUser };
