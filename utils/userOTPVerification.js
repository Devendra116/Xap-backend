const bcrypt = require('bcryptjs')
const UserOtpModel = require("../models/userOTP");
const { sendEmail } = require("./sendEmail");
require('dotenv').config()

const userVerificationOTP = async (userId, email) => {
  try {
    if (!email) {
      throw Error("Empty fields provided");
    }

    const otp = Math.floor(Math.random() * 900000) + 100000;
    const subject = `Xap Login OTP`;
    const message = `
        <div style="margin:auto;text-align:center;">
          <img src="https://avatars.githubusercontent.com/u/81143673?s=100&v=4">
          <h4>Your One Time Password for Xap login is: </h4>
          <p style="font-size:20px;letter-spacing:2px;">
            <b>${otp}</b>
          </p>
          <p>Note: OTP is valid for <b>15 mins</b> only</p>
        </div>
        `;

    // send email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject,
      html: message,
    };

    await sendEmail(mailOptions);

    // Save OTP record
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp.toString(), salt);
    const OTP = new UserOtpModel({
      userId,
      otp: hashedOTP,
      expiresAt: new Date(new Date().getTime() + 15 * 60000), // 15 min,
    });

    await OTP.save();
    return true
  } catch (error) {
    throw error;
  }
};

module.exports = {
  userVerificationOTP
};
