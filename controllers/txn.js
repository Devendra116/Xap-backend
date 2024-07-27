require('dotenv').config()
const Transaction = require('../models/transaction')

// @desc    Create a new user
// @route   POST /add-txn
// @access  Public
const addTxn = async (req, res) => {
  try {
    const {
      network_type,
      sender_username,
      recipient_username,
      src_chain,
      dest_chain,
      status,
      src_amount,
      dest_amount,
      is_cross_chain,
      sender_address,
      recipient_address,
      src_txn_hash,
      dest_txn_hash
    } = req.body

    if (
      !network_type ||
      !sender_username ||
      !src_chain ||
      !dest_chain ||
      !src_amount ||
      !dest_amount ||
      typeof is_cross_chain !== 'boolean' ||
      !sender_address ||
      !recipient_address ||
      !src_txn_hash 
    )
      return res
        .status(400)
        .send({ success: false, message: 'Required fields are missing' })

    let transaction = new Transaction({
      network_type ,
      sender_username ,
      src_chain ,
      dest_chain ,
      src_amount ,
      dest_amount ,
      is_cross_chain ,
      sender_address ,
      recipient_address ,
      src_txn_hash 
    })
    if(status) transaction.status = status
    if(recipient_username) transaction.recipient_username = recipient_username
    if(dest_txn_hash) transaction.dest_txn_hash = dest_txn_hash 
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
    const { recipient_address } = req.query
    if (!recipient_address)
      return res
        .status(400)
        .send({ success: false, message: 'Plese provide recipient_address' })

    const txns = await Transaction.find({ recipient_address }).select('-_id -__v')

    res.status(200).send({ success: true, message: txns })
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: `Error getting User Txns: ${error}` })
  }
}
module.exports = {
  addTxn,
  getAllTxns,
  getUserTxns
}
