const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')
const prisma = require('./prisma/prisma')

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

passport.use(
  new Strategy(jwtOptions, async (payload, done) => {
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    })
    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  })
)

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    })
    done(null, user)
  } catch (error) {
    done(error)
  }
})

module.exports = passport
