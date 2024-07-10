const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const userSchema = mongoose.Schema(
  {
    userId: { type: ObjectId, default: new ObjectId },
    userName: { type: String,index: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    bio: { type: String },
    cryptoPaymentMethod: [
      {
        chain: String,
        accountAddress: String
      }
    ],
    socials: [
      {
        platformName: String,
        url: String
      }
    ],
    isProfileComplete: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)
module.exports = mongoose.model('User', userSchema)
