exports.userSignupValidator = (req, res, next) => {
  req.check('name', 'Name is required').notEmpty()
  req
    .check('email', 'Email must be between 3 and 32 charactors')
    .isLength({
      min: 4,
      max: 32,
    })
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @ and . like this : name@doamin.com')
  req
    .check('password', 'Password is required')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must have at least 6 charactor')
    .matches(/\d/)
    .withMessage('Password must contain at least on number')

  const errors = req.validationErrors()
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0]
    return res.status(400).json({ error: firstError })
  }
  next()
}
