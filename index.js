import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./db/dbconfig.js";
import userRouter from "./router/userRouter.js";
import cookieParser from "cookie-parser";
import captainRouter from "./router/captainRouter.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Your React app URL
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());  

const PORT = process.env.PORT || 4000;

app.use("/api/auth/user", userRouter);
app.use("/api/auth/captain", captainRouter);

app.get("/", (req, res) => {
  res.send("<h1>Welcome Home.</h1>");
});

dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
  });
});
