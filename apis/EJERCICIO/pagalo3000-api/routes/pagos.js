const express = require('express')
const router = express.Router()
const {
  procesarPagoController,
  consultarTransaccionController,
  procesarReembolsoController,
  listarTransaccionesController
} = require('../controllers/pagos.controller')

// Rutas
router.get('/', listarTransaccionesController)
router.post('/', procesarPagoController)
router.get('/:transaccionId', consultarTransaccionController)
router.post('/:transaccionId/reembolso', procesarReembolsoController)

module.exports = router
