const { PrismaClient } = require('@prisma/client')

function prisma() {
  return new PrismaClient()
}

module.exports = {
  prisma,
}
