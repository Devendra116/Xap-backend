const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const isValidEmail = email => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// @desc    Create a new user
// @route   POST /signup
// @access  Public
const createUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!isValidEmail(email))
      return res
        .status(400)
        .send({ success: false, message: 'Invalid Email Format' })

    let user = await User.findOne({ email })
    if (user)
      return res
        .status(400)
        .send({
          success: false,
          message: 'User with this Email already exists'
        })
    if (password.length < 8)
      return res
        .status(400)
        .send({
          success: false,
          message: 'Password must be at least 8 characters long'
        })

    // Create the user
    let newUser = new User({
      email
    })

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    newUser.password = await bcrypt.hash(password, salt)

    // Save the user
    await newUser.save()
    res
      .status(201)
      .send({ success: true, message: 'User Created Successfully' })
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: `Error Creating User: ${error}` })
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
        .send({ success: false, message: 'Invalid Credentials' })
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
    res.cookie('token', token, { httpOnly: true }).send({ success: true })
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
    const user = await User.findOne({ username })
    if (user)
      return res
        .status(400)
        .send({ success: false, message: 'Username Already Exist' })
    const currentUser = await User.findOne({userId:req.userId})
    currentUser.username = username
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
    const { email, name, password, bio } = req.body
    const user = await User.findOne({ userId: req.userId })
    if (!user)
      return res.status(404).send({ success: false, message: 'User not found' })

    // Update the user information
    if (email) user.email = email
    if (name) user.name = name
    if (bio) user.bio = bio

    // Hash the password if it was updated
    if (password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
    }
    await user.save()

    res
      .status(200)
      .send({ success: true, message: 'User updated Successfully' })
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: `Error Updating User ${error} ` })
  }
}

// @desc    Delete a exisiting user acount
// @route   POST /delete-user
// @access  Private
const deleteUser = async (req, res) => {
    try {
      const user = await User.findOneAndDelete({ userId: req.userId });
      if (!user) {
        return res.status(404).send({ success: false, message: 'User not found' });
      }
  
      res.status(200).send({ success: true, message: 'User Deleted Successfully' });
    } catch (error) {
      console.error(error);
      res.status(400).send({ success: false, message: 'Error deleting user' });
    }
  };
  

module.exports = { createUser, userLogin, setUsername, updateUser, deleteUser }
