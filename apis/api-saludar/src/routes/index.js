const express = require('express')
const router = express.Router()
const saludoRoutes = require('./saludo.routes')
const healthRoutes = require('./health.routes')

router.use('/api', saludoRoutes)
router.use('/health', healthRoutes)

module.exports = router
