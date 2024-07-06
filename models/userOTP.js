const mongoose = require('mongoose')

const userOTPSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
    otp: { type: String, required: [true, 'OTP is required'] },
    expiresAt: { type: Date, required: [true, 'Expire time is required'] }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('userOTP', userOTPSchema)
