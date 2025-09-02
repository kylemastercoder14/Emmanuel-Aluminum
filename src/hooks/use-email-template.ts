"use server";
import nodemailer from "nodemailer";
import { OTPVerificationEmailHTML } from "@/components/email-template/otp-verification";

export const sendAccountToEmail = async (
  email: string,
  name: string,
  otpCode: number
) => {
  const htmlContent = await OTPVerificationEmailHTML({
    otpCode,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kylemastercoder14@gmail.com",
      pass: "nrihffkvfsgfhnbn",
    },
  });

  const message = {
    from: "kylemastercoder14@gmail.com",
    to: email,
    subject: "This is your account details",
    text: `Hello ${name}, your account has been created. Here is your OTP: ${otpCode}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);

    return { success: "Email has been sent." };
  } catch (error) {
    console.error("Error sending notification", error);
    return { message: "An error occurred. Please try again." };
  }
};
