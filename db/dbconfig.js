import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const dbConnectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}`
    );
    console.log(
      `Mongodb is connected on host:${dbConnectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default dbConnect;
