const estudianteService = require('../services/estudiante.service')

const listarEstudiantes = async (req, res, next) => {
  try {
    const estudiantes = await estudianteService.listarEstudiantes()
    res.json(estudiantes)
  } catch (error) {
    next(error)
  }
}

const obtenerEstudiante = async (req, res, next) => {
  try {
    const estudiante = await estudianteService.obtenerEstudiantePorId(parseInt(req.params.id))
    res.json(estudiante)
  } catch (error) {
    next(error)
  }
}

const obtenerInscripciones = async (req, res, next) => {
  try {
    const inscripciones = await estudianteService.obtenerInscripcionesEstudiante(parseInt(req.params.id))
    res.json(inscripciones)
  } catch (error) {
    next(error)
  }
}

const crearEstudiante = async (req, res, next) => {
  try {
    const nuevoEstudiante = await estudianteService.crearEstudiante(req.body)
    res.status(201).json(nuevoEstudiante)
  } catch (error) {
    next(error)
  }
}

const actualizarEstudiante = async (req, res, next) => {
  try {
    const estudianteActualizado = await estudianteService.actualizarEstudiante(parseInt(req.params.id), req.body)
    res.json(estudianteActualizado)
  } catch (error) {
    next(error)
  }
}

const actualizarEstudianteParcial = async (req, res, next) => {
  try {
    const estudianteActualizado = await estudianteService.actualizarEstudianteParcial(parseInt(req.params.id), req.body)
    res.json(estudianteActualizado)
  } catch (error) {
    next(error)
  }
}

const eliminarEstudiante = async (req, res, next) => {
  try {
    await estudianteService.eliminarEstudiante(parseInt(req.params.id))
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listarEstudiantes,
  obtenerEstudiante,
  obtenerInscripciones,
  crearEstudiante,
  actualizarEstudiante,
  actualizarEstudianteParcial,
  eliminarEstudiante
}
