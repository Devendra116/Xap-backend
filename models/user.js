const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    username: { type: String, index: true },
    name: { type: String, required: true },
    bio: { type: String },
    chain_name: { type: String, required: true },
    account_address: { type: String, required: true }
  },
  {
    timestamps: true
  }
)
module.exports = mongoose.model('XapUser', userSchema)
