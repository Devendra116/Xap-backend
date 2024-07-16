require('dotenv').config()
const Transaction = require('../models/transaction')

// @desc    Create a new user
// @route   POST /add-txn
// @access  Public
const addTxn = async (req, res) => {
  try {
    const {
      network,
      srcChain,
      destChain,
      status,
      srcAmount,
      destAmount,
      isCrossChain,
      fromAddress,
      toAddress,
      srcTxnHash,
      srcTimestamp
    } = req.body

    if (
      !network ||
      !srcChain ||
      !status ||
      !srcAmount ||
      !destAmount ||
      !isCrossChain ||
      !fromAddress ||
      !toAddress ||
      !srcTxnHash ||
      !srcTimestamp
    )
      return res
        .status(400)
        .send({ success: false, message: 'Required fields are missing' })

    const transaction = new Transaction({
      network,
      srcChain,
      destChain,
      status,
      srcAmount,
      destAmount,
      isCrossChain,
      fromAddress,
      toAddress,
      srcTxnHash,
      srcTimestamp
    })
    await transaction.save()

    res.status(200).send({ success: true, message: 'Transaction Added' })
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: `Error Adding Transaction: ${error}` })
  }
}

// @desc    Get All txn fro user
// @route   Get /txns
// @access  Public
const getAllTxns = async (req, res) => {
  try {
    const Txns = await Transaction.find({}).select('-_id -__v')

    res.status(200).send({ success: true, message: Txns })
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: `Error getting All Txns: ${error}` })
  }
}

// @desc    Get fetch All txns for a user
// @route   Get /txns?toAddress=0x1234567890
// @access  Public
const getUserTxns = async (req, res) => {
  try {
    const { toAddress } = req.query
    if (!toAddress)
      return res
        .status(400)
        .send({ success: false, message: 'Plese provide a valid address' })

    const txns = await Transaction.find({ toAddress }).select('-_id -__v')

    res.status(200).send({ success: true, message: txns })
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: `Error getting username: ${error}` })
  }
}
module.exports = {
  addTxn,
  getAllTxns,
  getUserTxns
}
