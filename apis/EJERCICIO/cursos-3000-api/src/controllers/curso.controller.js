const cursoService = require('../services/curso.service')

const listarCursos = async (req, res, next) => {
  try {
    const { categoria, nivel, precioMax } = req.query
    const cursos = await cursoService.listarCursos({ categoria, nivel, precioMax })
    res.json(cursos)
  } catch (error) {
    next(error)
  }
}

const obtenerCurso = async (req, res, next) => {
  try {
    const curso = await cursoService.obtenerCursoPorId(parseInt(req.params.id))
    res.json(curso)
  } catch (error) {
    next(error)
  }
}

const crearCurso = async (req, res, next) => {
  try {
    const nuevoCurso = await cursoService.crearCurso(req.body)
    res.status(201).json(nuevoCurso)
  } catch (error) {
    next(error)
  }
}

const actualizarCurso = async (req, res, next) => {
  try {
    const cursoActualizado = await cursoService.actualizarCurso(parseInt(req.params.id), req.body)
    res.json(cursoActualizado)
  } catch (error) {
    next(error)
  }
}

const actualizarCursoParcial = async (req, res, next) => {
  try {
    const cursoActualizado = await cursoService.actualizarCursoParcial(parseInt(req.params.id), req.body)
    res.json(cursoActualizado)
  } catch (error) {
    next(error)
  }
}

const eliminarCurso = async (req, res, next) => {
  try {
    await cursoService.eliminarCurso(parseInt(req.params.id))
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listarCursos,
  obtenerCurso,
  crearCurso,
  actualizarCurso,
  actualizarCursoParcial,
  eliminarCurso
}
