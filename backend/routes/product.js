const express = require('express')
const router = express.Router()
const { userById } = require('../controllers/user')
const {
  create,
  productById,
  read,
  update,
  remove,
  productList,
  productListRealated,
  productsCategories,
  listBySearch,
  listSearch,
  productPhoto,
} = require('../controllers/product')
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create)
router.get('/product/:productId', read)
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update)
router.delete(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin, remove
)

router.get('/products', productList)
router.get('/products/related/:productId', productListRealated)
router.get('/products/categories', productsCategories)
router.get('/product/photo/:productId', productPhoto)

router.post('/products/by/search', listBySearch)

router.get('/products/search', listSearch)

router.param('userId', userById)
router.param('productId', productById)

module.exports = router
