import mongoose from 'mongoose'
const { ObjectId } = mongoose.Types

const transactionSchema = mongoose.Schema(
  {
    payer: { type: ObjectId, required: true }, // person who paid the amount
    payee: { type: ObjectId }, // person who received the amount
    network: { type: String, required: true }, // mainnet or testnet
    srcChain: { type: String, required: true },
    destChain: { type: String },
    status: { type: String },
    srcAmount: { type: Number, required: true },
    destAmount: { type: Number },
    isCrossChain: { type: Boolean, default: false },
    fromAddress: { type: String },
    toAddress: { type: String },
    srcTxnHash: { type: String, required: true },
    destTxnHash: { type: String },
    srcTimestamp: { type: String },
    VaaId: { type: String }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Transactions', transactionSchema)
