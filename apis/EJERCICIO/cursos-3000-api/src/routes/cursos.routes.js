const express = require('express')
const router = express.Router()
const cursoController = require('../controllers/curso.controller')
const inscripcionController = require('../controllers/inscripcion.controller')

// GET /api/cursos - Listar todos los cursos con filtros opcionales
router.get('/', cursoController.listarCursos)

// GET /api/cursos/:id - Obtener detalle de un curso
router.get('/:id', cursoController.obtenerCurso)

// GET /api/cursos/:id/inscripciones - Inscripciones de un curso
router.get('/:id/inscripciones', inscripcionController.obtenerInscripcionesPorCurso)

// POST /api/cursos - Crear nuevo curso
router.post('/', cursoController.crearCurso)

// PUT /api/cursos/:id - Actualizar curso completo
router.put('/:id', cursoController.actualizarCurso)

// PATCH /api/cursos/:id - Actualizar curso parcialmente
router.patch('/:id', cursoController.actualizarCursoParcial)

// DELETE /api/cursos/:id - Eliminar curso
router.delete('/:id', cursoController.eliminarCurso)

module.exports = router
