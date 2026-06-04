const express = require('express')
const router = express.Router()
const saludoController = require('../controllers/saludo.controllers')

router.get('/hola', saludoController.getSaludoHolaMundo)
router.get('/saludar/:nombre', saludoController.getSaludoPorNombre)
router.post('/saludo', saludoController.crearSaludo)

module.exports = router
