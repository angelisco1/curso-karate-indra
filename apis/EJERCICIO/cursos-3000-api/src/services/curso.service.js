const cursoRepository = require('../repositories/curso.repository')
const inscripcionRepository = require('../repositories/inscripcion.repository')
const { validateCrearCurso, validateActualizarCurso, validateActualizarCursoParcial } = require('../validators/curso.validator')
const { NotFoundError, BadRequestError } = require('../utils/http-errors')
const Curso = require('../models/curso.model')

const listarCursos = async (filters) => {
  return await cursoRepository.findAll(filters)
}

const obtenerCursoPorId = async (id) => {
  const curso = await cursoRepository.findById(id)
  if (!curso) {
    throw new NotFoundError('Curso no encontrado')
  }
  return curso
}

const crearCurso = async (cursoData) => {
  validateCrearCurso(cursoData)
  return await cursoRepository.create(cursoData)
}

const actualizarCurso = async (id, cursoData) => {
  const cursoExistente = await obtenerCursoPorId(id)
  validateActualizarCurso(cursoData)

  const { titulo, descripcion, categoria, nivel, precio, maxEstudiantes, fechaInicio, fechaFin } = cursoData

  return await cursoRepository.update(id, {
    titulo,
    descripcion,
    categoria,
    nivel,
    precio: parseFloat(precio),
    maxEstudiantes: parseInt(maxEstudiantes),
    fechaInicio,
    fechaFin
  })
}

const actualizarCursoParcial = async (id, actualizaciones) => {
  const curso = await obtenerCursoPorId(id)
  validateActualizarCursoParcial(actualizaciones, curso)

  const camposPermitidos = ['titulo', 'descripcion', 'precio', 'maxEstudiantes', 'fechaInicio', 'fechaFin']
  const actualizacionesValidas = {}

  camposPermitidos.forEach(campo => {
    if (actualizaciones[campo] !== undefined) {
      actualizacionesValidas[campo] = actualizaciones[campo]
    }
  })

  return await cursoRepository.update(id, actualizacionesValidas)
}

const eliminarCurso = async (id) => {
  const curso = await obtenerCursoPorId(id)

  // Verificar que no tenga inscripciones
  if (await inscripcionRepository.hasInscripciones(id)) {
    throw new BadRequestError('No se puede eliminar un curso con inscripciones')
  }

  return await cursoRepository.delete(id)
}

module.exports = {
  listarCursos,
  obtenerCursoPorId,
  crearCurso,
  actualizarCurso,
  actualizarCursoParcial,
  eliminarCurso
}
