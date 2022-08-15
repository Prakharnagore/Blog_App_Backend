import express from "express";
import { sendEmailMsgCtrl } from "../../controllers/emailMsg/emailMsgCtrl.js";
import { authMiddleware } from "../../middlewares/auth/authMiddleware.js";
const route = express.Router();

route.post("/", authMiddleware, sendEmailMsgCtrl);

export default route;
