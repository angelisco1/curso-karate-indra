const express = require('express')
const router = express.Router()
const inscripcionController = require('../controllers/inscripcion.controller')

// GET /api/inscripciones - Listar todas las inscripciones
router.get('/', inscripcionController.listarInscripciones)

// GET /api/inscripciones/:id - Obtener detalle de inscripción
router.get('/:id', inscripcionController.obtenerInscripcion)

// POST /api/inscripciones - Crear inscripción (matricularse)
router.post('/', inscripcionController.crearInscripcion)

// PATCH /api/inscripciones/:id - Actualizar estado
router.patch('/:id', inscripcionController.actualizarEstado)

// DELETE /api/inscripciones/:id - Cancelar inscripción
router.delete('/:id', inscripcionController.cancelarInscripcion)

module.exports = router
