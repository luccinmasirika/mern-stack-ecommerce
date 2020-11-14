const Product = require('../models/product') // Category Schema
const { errorHandler } = require('../helpers/dbErrorHandler') // Authorizations
const formidable = require('formidable') // Formidable to upload images
const _ = require('lodash')
const fs = require('fs') // Fs for system files
const { json } = require('body-parser')

// Read product
exports.read = (req, res) => {
  req.product.photo = undefined
  return res.json(req.product)
}

// Product by Id
exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .populate('category')
    .exec((error, product) => {
      if (error || !product) {
        return res.status(400).json({ error: 'Product not found' })
      }
      req.product = product
      next()
    })
}

exports.create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({ error: 'Image could not be uploaded' })
    }
    // Check all fields
    const { name, description, price, category, quantity, shipping } = fields

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      res.status(400).json({ error: 'All fields are required' })
    }

    // Creating a new product
    const product = new Product(fields)
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res
          .status(400)
          .json({ error: 'Image should be less than 1mb in size' })
      }
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type
    }
    product.save((error, product) => {
      if (error) {
        return res.status(400).json({ error: errorHandler })
      }
      req.product = product
      res.json({ product })
    })
  })
}

// Update a product
exports.update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({ error: 'Image could not be uploaded' })
    }
    // Check all fields
    const { name, description, price, category, quantity, shipping } = fields

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      res.status(400).json({ error: 'All fields are required' })
    }

    // Updating the product
    let product = req.product
    product = _.extend(product, fields)

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res
          .status(400)
          .json({ error: 'Image should be less than 1mb in size' })
      }
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type
    }
    product.save((error, product) => {
      if (error) {
        return res.status(400).json({ error: errorHandler })
      }
      req.product = product
      res.json({ product })
    })
  })
}

// Remove a product
exports.remove = (req, res) => {
  const product = req.product
  product.remove((error, deletedProduct) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler,
      })
    }
    res.json({
      message: 'Product deleted successfully',
    })
  })
}

/*
 ** Sort products by Sell and/or by Arriaval
 ** By Sell = /products?sortBy=sold&order=desc&limit=4
 ** By Arrival = /products?sortBy=createdAt&order=desc&limit=4
 ** If no query, return all products
 */

exports.productList = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc'
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
  let limit = req.query.limit ? parseInt(req.query.limit) : 6

  Product.find()
    .select('-photo')
    .populate('category', '_id name')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((error, productList) => {
      if (error) {
        return res.status(400).json({ error: 'Products not found' })
      }
      return res.json(productList)
    })
}

/**
 * Show all products by category
 */

exports.productListRealated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .exec((error, productListRealeáted) => {
      if (error) {
        return res.status(400).json({ error: 'Products not found' })
      }
      return res.json(productListRealeáted)
    })
}

/**
 * Show categories used by products
 */
exports.productsCategories = (req, res) => {
  Product.distinct('category', {}, (error, categories) => {
    if (error) {
      return res.status(400).json({ error: 'Products not found' })
    }
    res.json(categories)
  })
}

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : 'desc'
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id'
  let limit = req.body.limit ? parseInt(req.body.limit) : 100
  let skip = parseInt(req.body.skip)
  let findArgs = {}

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        }
      } else {
        findArgs[key] = req.body.filters[key]
      }
    }
  }

  Product.find(findArgs)
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        })
      }
      res.json({
        size: data.length,
        data,
      })
    })
}

/**
 * Show product's images
 */

exports.productPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.data.contentType)
    return res.send(req.product.photo.data)
  }
  next()
}

/**
 * Get product after search and/or filter by categories
 */

exports.listSearch = (req, res) => {
  // create query object to hold search value and category value
  const query = {}
  // assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' }
    // assigne category value to query.category
    if (req.query.category && req.query.category != 'All') {
      query.category = req.query.category
    }
    // find the product based on query object with 2 properties
    // search and category
    Product.find(query, (error, products) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        })
      }
      res.json(products)
    }).select('-photo')
  }
}

exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    }
  })

  Product.bulkWrite(bulkOps, {}, (error, products) => {
    if (error) {
      return res.status(400).json({
        error: 'Could not update product',
      })
    }
    next()
  })
}
