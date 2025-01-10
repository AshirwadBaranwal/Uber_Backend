import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "firstname must be at least of 3 characters."],
    },
    lastname: {
      type: String,
      required: true,
      minlength: [3, "lastname must be at least of 3 characters."],
    },
  },
  email: {
    type: String,
    required: true,
    minlength: [5, "email must be atleast of 5 characters."],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, saltRound);
    this.password = hashedPassword;
  } catch (error) {
    console.error("BCRYPT ERROR:", error);
  }
});

userSchema.methods.comparepassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    console.error("JSONWEBTOKEN ERROR:", error);
  }
};

const userModel = mongoose.model("user", userSchema);

export default userModel;
