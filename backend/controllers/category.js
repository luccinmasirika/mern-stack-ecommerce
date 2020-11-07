const Category = require('../models/category') // Category Schema
const { errorHandler } = require('../helpers/dbErrorHandler') // Authorizations
const _ = require('lodash')

// Category by id

exports.categoryById = (req, res, next, id) => {
  Category.findById(id).exec((error, category) => {
    if (error || !category) {
      return res.status(400).json({ error: 'Category not found' })
    }
    req.category = category
    next()
  })
}

// Read category
exports.read = (req, res) => {
  return res.json(req.category)
}

// Create a new category
exports.create = (req, res) => {
  const category = new Category(req.body)
  category.save((error, category) => {
    if (error) {
      return res.status(400).json({ error: errorHandler(error) })
    }
    res.json({ category })
  })
}

// Update a category
exports.update = (req, res) => {
  // let category = req.category
  // category = _.extend(category, req.body)
  const category = req.category
  category.name = req.body.name
  category.save((error, category) => {
    if (error) {
      return res.status(400).json({ error: errorHandler(error) })
    }
    res.json({ category })
  })
}

// Remove category
exports.remove = (req, res) => {
  const category = req.category
  category.remove((error) => {
    if (error) {
      res.status(400).json({ error: 'Category does not exist' })
    }
    res.json({ message: 'Category removed successfully' })
  })
}

// Show all categories
exports.listCategories = (req, res) => {
  Category.find().exec((error, categories) => {
    if (error) {
      return res.status(400).json({ error: errorHandler(error) })
    }
    res.json(categories)
  })
}
