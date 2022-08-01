// IMPORTS
import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/db/dbConnect.js";
// ROUTES
import userRoutes from "./routes/users/usersRoute.js";
import { errorHandler, notFound } from "./middlewares/error/errorHandler.js";

// env
dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    const data = await dbConnect(process.env.DB_URI);
    app.listen(process.env.PORT, () => {
      console.log(`Mongodb connect with Server: ${data.connection.host}`);
      console.log(
        `Server is Listening on https://localhost:${process.env.PORT}`
      );
    });
  } catch (error) {
    console.log("Server error: " + error.message);
  }
};

start();
