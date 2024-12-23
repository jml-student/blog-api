require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('./passport')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const commentRouter = require('./routes/comment')
const port = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

app.use('/', userRouter)
app.use('/posts', postRouter)
app.use('/posts/:id/comments', commentRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
