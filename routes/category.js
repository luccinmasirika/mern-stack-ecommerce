const express = require('express')
const router = express.Router()

const {
  categoryById,
  create,
  read,
  update,
  remove,
  listCategories,
} = require('../controllers/category')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const { userById } = require('../controllers/user')

router.post('/category/create/:userId', requireSignin, isAuth, create)
router.get('/category/:categoryId', read)
router.put('/category/:categoryId/:userId', requireSignin, isAuth, update)
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, remove)
router.get('/categories', listCategories)

router.param('userId', userById)
router.param('categoryId', categoryById)

module.exports = router
