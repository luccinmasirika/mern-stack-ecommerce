const User = require('../models/user')
exports.userById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: 'User not found',
      })
    }
    req.profile = user
    next()
  })
}

/**
 * Read user profile
 */

exports.readUser = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

/**
 * Update user
 */
exports.updateUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile.id },
    { $set: req.body },
    { new: true },
    (error, profile) => {
      if (error) {
        return res.status(400).json({
          error: 'User not found',
        })
      }
      profile.hashed_password = undefined
      profile.salt = undefined
      return res.json(profile)
    }
  )
}
