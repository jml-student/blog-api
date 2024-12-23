const express = require('express')
const router = express.Router()
const prisma = require('../prisma/prisma')
const passport = require('../passport')
const { body, validationResult } = require('express-validator')

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const posts = await prisma.post.findMany()
    res.json(posts)
  }
)

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
    })
    if (!post) {
      res.status(404).json({ message: 'Post not found' })
    } else {
      res.json(post)
    }
  }
)

module.exports = router
