import nodemailer from "nodemailer";
import { expressError } from "./expressError.js";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});
export const sendEmail = (otp, email) => {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "IMPORTANT! Reset Password Pustak Sansar",
    text: `Your Otp is ${otp} .Please, Do not share this otp with anyone.`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new expressError(400, "Unable to send Otp");
    }
  });
  return otp;
};
