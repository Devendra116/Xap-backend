const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const isValidEmail = email => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// @desc    Get Avilable User's Detail
// @route   Get /user
// @access  Public
const getUser = async (req, res) => {
  try {
    const { username } = req.query
    if (username && username.length < 3)
      return res
        .status(400)
        .send({ success: false, message: 'Username canot be less than 3 char' })
    const user = await User.findOne({ username: username }).select(
      '-password -_id -userId -__v -isProfileComplete'
    )

    if (!user)
      return res
        .status(400)
        .send({ success: false, message: 'Username Not found' })
    res.status(200).send({ success: true, message: user })
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: `Error getting username: ${error}` })
  }
}

// @desc    Create a new user
// @route   POST /signup
// @access  Public
const createUser = async (req, res) => {
  try {
    const { username, name, bio, account_address, chain_name } = req.body

    if (!username || !account_address || !chain_name)
      return res
        .status(400)
        .send({ success: false, message: 'Please pass required fields' })

    let _user = await User.findOne({ username })
    if (_user)
      return res.status(400).send({
        success: false,
        message: 'This Username already exists'
      })

    let newUser = new User({
      username,
      account_address,
      chain_name
    })

    if (name) newUser.name = name
    if (bio) newUser.bio = bio
    await newUser.save()
    res
      .status(201)
      .send({ success: true, message: 'User Profile Created Successfully' })
  } catch (error) {
    res
      .status(400)
      .send({
        success: false,
        message: `Error Creating User Profile: ${error}`
      })
  }
}

// @desc    Authenticate a user
// @route   POST /login
// @access  Public
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user)
      return res
        .status(400)
        .send({ success: false, message: 'Email not found' })
    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res
        .status(400)
        .send({ success: false, message: 'Invalid Credentials' })
    // Generate a token
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRE_TIME
    })
    // Return the token
    res
      .status(200)
      .send({ success: true, token: token, userName: user.userName })
    // res.cookie('token', token, { httpOnly: true }).send({ success: true })
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: `Error logging in : ${error}` })
  }
}

// @desc    Get Avilable username
// @route   POST /set-username
// @access  Private
const setUsername = async (req, res) => {
  try {
    const { username } = req.body
    if (username && username.length < 3)
      return res
        .status(400)
        .send({ success: false, message: 'Username canot be less than 3 char' })
    const user = await User.findOne({ userName: username })
    if (user)
      return res
        .status(400)
        .send({ success: false, message: 'Username Already Exist' })
    const currentUser = await User.findOne({ userId: req.userId })
    currentUser.userName = username
    currentUser.save()
    res.status(200).send({ success: true, message: 'Username Added' })
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: `Error getting username: ${error}` })
  }
}

// @desc    Update a Basic user info
// @route   POST /update-user
// @access  Private
const updateUser = async (req, res) => {
  try {
    const { username, name, chain_name, account_address, bio } = req.body

    if (!account_address)
      return res
        .status(400)
        .send({ success: false, message: 'Please pass account_address' })

    const user = await User.findOne({ account_address: account_address })
    if (!user) {
      if (!username || !chain_name)
        return res
          .status(400)
          .send({ success: false, message: 'Please pass required fields' })
      let newUser = new User({
        username,
        account_address,
        chain_name
      })

      if (name) newUser.name = name
      if (bio) newUser.bio = bio
      await newUser.save()
      res
        .status(201)
        .send({ success: true, message: 'User Profile Created Successfully' })
    } else {
      if (name) user.name = name
      if (bio) user.bio = bio
      if (username) user.username = username
      if (chain_name) user.chain_name = chain_name

      await user.save()

      res
        .status(200)
        .send({ success: true, message: 'User Profile Updated Successfully' })
    }
  } catch (error) {
    res
      .status(400)
      .send({
        success: false,
        message: `Error Creating/Updating User Profile ${error} `
      })
  }
}

// @desc    Delete a exisiting user acount
// @route   POST /delete-user
// @access  Private
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ userId: req.userId })
    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found' })
    }

    res
      .status(200)
      .send({ success: true, message: 'User Deleted Successfully' })
  } catch (error) {
    console.error(error)
    res.status(400).send({ success: false, message: 'Error deleting user' })
  }
}

module.exports = {
  getUser,
  createUser,
  userLogin,
  setUsername,
  updateUser,
  deleteUser
}
