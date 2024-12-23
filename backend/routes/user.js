const express = require('express')
const router = express.Router()
const prisma = require('../prisma/prisma')
const passport = require('../passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { body, validationResult } = require('express-validator')

router.post(
  '/',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      })
      if (!user) {
        res.status(404).json({ message: 'User not found' })
      } else {
        const passwordCorrect = await bcrypt.compare(
          req.body.password,
          user.password
        )
        if (!passwordCorrect) {
          res.status(401).json({ message: 'Incorrect password' })
        } else {
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
          res.json({ token })
          res.redirect('/posts')
        }
      }
    }
  }
)

module.exports = router
