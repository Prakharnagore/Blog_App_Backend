// IMPORTS
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// env
import dbConnect from "./config/db/dbConnect.js";
dotenv.config();
// ROUTES
import userRoutes from "./routes/users/usersRoute.js";
import postRoutes from "./routes/posts/postRoute.js";
import commentRoutes from "./routes/comments/commentsRoute.js";
import emailRoutes from "./routes/emailMsg/emailMsgRoute.js";
import categoryRoutes from "./routes/category/categoryRoute.js";
import { errorHandler, notFound } from "./middlewares/error/errorHandler.js";
import cloudinary from "cloudinary";
// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

dbConnect();

const upate = () => {};

app.get("/", (req, res) => {
  res.json({ msg: "API for blog Application..." });
});

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/category", categoryRoutes);

// ERROR HANDLERS

app.use(notFound);
app.use(errorHandler);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running ${PORT}`));
