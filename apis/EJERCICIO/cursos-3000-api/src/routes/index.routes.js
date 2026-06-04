const express = require('express')
const router = express.Router()

const cursosRoutes = require('./cursos.routes')
const estudiantesRoutes = require('./estudiantes.routes')
const inscripcionesRoutes = require('./inscripciones.routes')

// Montar rutas
router.use('/cursos', cursosRoutes)
router.use('/estudiantes', estudiantesRoutes)
router.use('/inscripciones', inscripcionesRoutes)

module.exports = router
