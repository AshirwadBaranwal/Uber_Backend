import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const captainSchema = new mongoose.Schema({
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
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      min: [3, "color must be at least of 3 digits"],
    },
    plate: {
      type: String,
      required: true,
      min: [3, "plate number must be at least of 3 digits"],
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "capacity must be at least of 1 "],
    },
    vehicleType: {
      type: String,
      enum: ["car", "moto", "auto"],
    },
  },
  location: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
});

captainSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    console.log("Token generating error:", error);
  }
};

captainSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  try {
    const SaltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, SaltRound);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log("BCRYPT ERROR:", error);
  }
});

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const captainModel = mongoose.model("captain", captainSchema);

export default captainModel;
