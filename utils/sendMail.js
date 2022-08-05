import nodeMailer from "nodemailer";

const sendMail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL, //simple mail transport protocol
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_MAIL, // sender address
    to: options.email, // list of receivers
    subject: `${options.subject} ✔`, // Subject line
    html: options.text, // plain text body
  });
};

export default sendMail;
