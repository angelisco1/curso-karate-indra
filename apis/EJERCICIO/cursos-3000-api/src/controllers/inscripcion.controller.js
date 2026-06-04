const inscripcionService = require('../services/inscripcion.service')

const listarInscripciones = async (req, res, next) => {
  try {
    const inscripciones = await inscripcionService.listarInscripciones()
    res.json(inscripciones)
  } catch (error) {
    next(error)
  }
}

const obtenerInscripcion = async (req, res, next) => {
  try {
    const inscripcion = await inscripcionService.obtenerInscripcionPorId(parseInt(req.params.id))
    res.json(inscripcion)
  } catch (error) {
    next(error)
  }
}

const obtenerInscripcionesPorCurso = async (req, res, next) => {
  try {
    const inscripciones = await inscripcionService.obtenerInscripcionesPorCurso(parseInt(req.params.id))
    res.json(inscripciones)
  } catch (error) {
    next(error)
  }
}

const crearInscripcion = async (req, res, next) => {
  try {
    const nuevaInscripcion = await inscripcionService.crearInscripcion(req.body)
    res.status(201).json(nuevaInscripcion)
  } catch (error) {
    next(error)
  }
}

const actualizarEstado = async (req, res, next) => {
  try {
    const { estado } = req.body
    const inscripcionActualizada = await inscripcionService.actualizarEstadoInscripcion(parseInt(req.params.id), estado)
    res.json(inscripcionActualizada)
  } catch (error) {
    next(error)
  }
}

const cancelarInscripcion = async (req, res, next) => {
  try {
    await inscripcionService.cancelarInscripcion(parseInt(req.params.id))
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listarInscripciones,
  obtenerInscripcion,
  obtenerInscripcionesPorCurso,
  crearInscripcion,
  actualizarEstado,
  cancelarInscripcion
}
