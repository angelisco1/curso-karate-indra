require('dotenv').config()

const config = {
  port: process.env.PORT || 3005,
  nodeEnv: process.env.NODE_ENV || 'development',
  pagalo3000Url: process.env.PAGALO3000_URL || 'http://localhost:3006/api/pagos'
}

module.exports = config
