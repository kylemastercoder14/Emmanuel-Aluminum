"use server";
import nodemailer from "nodemailer";
import { OTPVerificationEmailHTML } from "@/components/email-template/otp-verification";
import { QuotationStatusEmailHTML } from "@/components/email-template/quotation";

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
      user: "aluminumfabricationemmanuel@gmail.com",
      pass: "hkzmfkrdxbuytzum",
    },
  });

  const message = {
    from: "aluminumfabricationemmanuel@gmail.com",
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

export const sendQuotationToEmail = async (
  email: string,
  firstName: string,
  lastName: string,
  serviceType: string,
  size: string,
  unit: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
  note?: string,
  estimatedPrice?: number
) => {
  const htmlContent = await QuotationStatusEmailHTML({
    firstName,
    lastName,
    serviceType,
    size,
    unit,
    status,
    note,
    estimatedPrice,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aluminumfabricationemmanuel@gmail.com", // your Gmail
      pass: "hkzmfkrdxbuytzum", // Gmail App Password
    },
  });

  const subjectMap: Record<typeof status, string> = {
    PENDING: "Your quotation request has been received",
    APPROVED: "Your quotation has been approved!",
    REJECTED: "Update on your quotation request",
  };

  const textMessage =
    status === "PENDING"
      ? `Hello ${firstName} ${lastName}, we’ve received your quotation request for ${serviceType} (${size} ${unit}). Our team is reviewing it and will update you soon.`
      : `Hello ${firstName} ${lastName}, your quotation for ${serviceType} (${size} ${unit}) has been ${status}. ${
          note ? "Note: " + note : ""
        }${status === "APPROVED" && estimatedPrice ? ` Estimated Price: ₱${estimatedPrice}` : ""}`;

  const message = {
    from: "aluminumfabricationemmanuel@gmail.com",
    to: email,
    subject: subjectMap[status],
    text: textMessage,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);
    return { success: "Quotation email has been sent." };
  } catch (error) {
    console.error("Error sending quotation email", error);
    return { message: "An error occurred while sending email." };
  }
};
