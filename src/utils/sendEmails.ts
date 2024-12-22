import nodemailer from "nodemailer";

export const sendEmail = async (subject, body, toEmail, pdfBuffer) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    // port: 587,
    // host: "smtp.gmail.com",
    // secure: false,
    // auth: {
    //   user: process.env.GMAIL_USER,
    //   pass: process.env.GMAIL_PASSWORD,
    // },
  });

  const mailOptions = {
    from: "onboarding@resend.dev",
    to: toEmail,
    subject: subject,
    text: body,
    attachments: [
      {
        filename: "CustomerData.pdf",
        content: pdfBuffer,
      },
    ],
  };

  try {
    const res = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", res);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};
