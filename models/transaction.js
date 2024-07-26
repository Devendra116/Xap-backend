const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema(
  {
    sender_username: { type: String, required: true },
    recipient_username: { type: String },
    network_type: { type: String, required: true },
    src_chain: { type: String, required: true },
    dest_chain: { type: String,required: true  },
    status: { type: String },
    src_amount: { type: Number, required: true },
    dest_amount: { type: Number,required: true },
    is_cross_chain: { type: Boolean, default: false },
    sender_address: { type: String, required: true },
    recipient_address: { type: String, required: true },
    src_txn_hash: { type: String, required: true },
    dest_txn_hash: { type: String }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('XapTransactions', transactionSchema)
