const express = require('express')
const router = express.Router()
const estudianteController = require('../controllers/estudiante.controller')

// GET /api/estudiantes - Listar todos los estudiantes
router.get('/', estudianteController.listarEstudiantes)

// GET /api/estudiantes/:id - Obtener perfil de estudiante
router.get('/:id', estudianteController.obtenerEstudiante)

// GET /api/estudiantes/:id/inscripciones - Inscripciones del estudiante
router.get('/:id/inscripciones', estudianteController.obtenerInscripciones)

// POST /api/estudiantes - Crear cuenta de estudiante
router.post('/', estudianteController.crearEstudiante)

// PUT /api/estudiantes/:id - Actualizar perfil completo
router.put('/:id', estudianteController.actualizarEstudiante)

// PATCH /api/estudiantes/:id - Actualizar parcialmente
router.patch('/:id', estudianteController.actualizarEstudianteParcial)

// DELETE /api/estudiantes/:id - Eliminar cuenta
router.delete('/:id', estudianteController.eliminarEstudiante)

module.exports = router
