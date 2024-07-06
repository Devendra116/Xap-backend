const express = require('express')
const router = express.Router()
const {
  createUser,
  userLogin,
  setUsername,
  updateUser,
  deleteUser,
  getUser
} = require('../controllers/base')
const { userAuth } = require('../middleware/auth')

router.get('/user', getUser)
router.post('/signup', createUser)
router.post('/login', userLogin)
router.post('/set-username', userAuth, setUsername)
router.post('/update-user', userAuth, updateUser)
router.post('/delete-user', userAuth, deleteUser)

module.exports = router
