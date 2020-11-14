const express = require('express')
const router = express.Router()
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const {
  userById,
  readUser,
  updateUser,
  purchaseHistory,
} = require('../controllers/user')

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({ user: req.profile })
})

router.get('/user/:userId', requireSignin, isAuth, readUser)
router.put('/user/:userId', requireSignin, isAuth, updateUser)
router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory)

router.param('userId', userById)

module.exports = router
