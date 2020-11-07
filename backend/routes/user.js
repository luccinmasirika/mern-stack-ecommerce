const express = require('express')
const router = express.Router()
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const { userById, readUser, updateUser } = require('../controllers/user')

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({ user: req.profile })
})

router.get('/user/:userId', requireSignin, isAuth, readUser)
router.put('/user/:userId', requireSignin, isAuth, updateUser)

router.param('userId', userById)

module.exports = router
