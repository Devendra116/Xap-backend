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
const { addTxn, getAllTxns, getUserTxns } = require('../controllers/txn')
const { userAuth } = require('../middleware/auth')

router.get('/user', getUser)
router.get('/all-txns', getAllTxns)
router.get('/txns', getUserTxns)
router.post('/signup', createUser)
router.post('/update-user', updateUser)
router.post('/add-txn', addTxn)
// router.post('/login', userLogin)
// router.post('/set-username', userAuth, setUsername)
// router.post('/delete-user', userAuth, deleteUser)

module.exports = router
