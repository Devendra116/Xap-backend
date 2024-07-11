const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const userSchema = mongoose.Schema(
  {
    userId: { type: ObjectId, default: new ObjectId() },
    userName: { type: String, index: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    bio: { type: String },
    chainName: { type: String },
    accountAddress: { type: String },
    twitterLink: { type: String },
    instagramLink: { type: String },
    discordLink: { type: String },
    telegramLink: { type: String },
    linkedinLink: { type: String },
    websiteLink: { type: String },
    isProfileComplete: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)
module.exports = mongoose.model('User', userSchema)
