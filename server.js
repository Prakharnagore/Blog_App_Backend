// IMPORTS
import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/db/dbConnect.js";
dotenv.config();

const app = express();

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
