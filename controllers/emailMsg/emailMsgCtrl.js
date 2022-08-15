import expressAsyncHandler from "express-async-handler";
import sendMail from "../../utils/sendMail.js";
import Filter from "bad-words";
import EmailMsg from "../../model/EmailMessaging/EmailMessaging.js";

const sendEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;
  //get the message
  const emailMessage = subject + " " + message;
  //prevent profanity/bad words
  const filter = new Filter();

  const isProfane = filter.isProfane(emailMessage);
  if (isProfane)
    throw new Error("Email sent failed, because it contains profane words.");
  try {
    //send msg
    await sendMail({
      email: to,
      subject,
      text: message,
    });
    //save to our db
    await EmailMsg.create({
      sentBy: req?.user?._id,
      from: req?.user?.email,
      to,
      message,
      subject,
    });
    res.json("Mail sent");
  } catch (error) {
    res.json(error);
  }
});

export { sendEmailMsgCtrl };
