const User = require('../models/user')
const jwt = require('jsonwebtoken')
// Token generator
const expressJwt = require('express-jwt')
// Authorizations
const { errorHandler } = require('../helpers/dbErrorHandler')

// ******* SIGNUP *********
exports.signup = (req, res) => {
  const user = new User(req.body)
  user.save((error, user) => {
    if (error) {
      return res.status(400).json({ error: errorHandler(error) })
    }
    user.salt = undefined
    user.hashed_password = undefined
    res.json({ user })
  })
}

// ******* SIGNIN *********
exports.signin = (req, res) => {
  const { email, password } = req.body
  // Find user in Database
  User.findOne({ email }, (error, user) => {
    // If error or no user found
    if (error || !user) {
      res.status(400).json({
        error: 'The user with this email does not exist. Please Signup.',
      })
    }

    // if user found make sure that email and password are match
    // create authentificate method in user model
    if (!user.authentificate(password)) {
      return res.status(401).json({ error: 'Email and password dont match' })
    }
    // Generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    // Persist token as 't' in cookes and exprire date
    res.cookie('t', token, { expire: new Date() + 9999 })

    // Return the response to fronten client
    const { _id, name, email, role } = user
    return res.json({ token, user: { _id, name, email, role } })
  })
}

// ******* SIGNOUT *********
exports.signout = (req, res) => {
  res.clearCookie('t')
  res.json({ message: 'Signup success' })
}

// ******* FOR PROTECTED ROUTES *********
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  // added later
  userProperty: 'auth',
})

// ******* CHECK IF USER IS AUTH ********
exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id
  if (!user) {
    return res.status(403).json({ error: 'Access danied' })
  }
  next()
}
// ******* CHECK IF USER IS ADMIN *******
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({ error: 'You are not admin. Access danied' })
  }
  next()
}
