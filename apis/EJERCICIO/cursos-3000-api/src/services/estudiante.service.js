const estudianteRepository = require('../repositories/estudiante.repository')
const inscripcionRepository = require('../repositories/inscripcion.repository')
const cursoRepository = require('../repositories/curso.repository')
const { validateCrearEstudiante, validateActualizarEstudiante, validateActualizarEstudianteParcial } = require('../validators/estudiante.validator')
const { NotFoundError, BadRequestError } = require('../utils/http-errors')
const Estudiante = require('../models/estudiante.model')

const listarEstudiantes = async () => {
  const estudiantes = await estudianteRepository.findAll()

  // Devolver sin passwords
  return estudiantes.map(est => {
    const estudianteModel = new Estudiante(est)
    return estudianteModel.toSafeObject()
  })
}

const obtenerEstudiantePorId = async (id) => {
  const estudiante = await estudianteRepository.findById(id)
  if (!estudiante) {
    throw new NotFoundError('Estudiante no encontrado')
  }

  // Crear instancia del modelo para usar toSafeObject
  const estudianteModel = new Estudiante(estudiante)
  return estudianteModel.toSafeObject()
}

const obtenerInscripcionesEstudiante = async (id) => {
  const estudiante = await estudianteRepository.findById(id)
  if (!estudiante) {
    throw new NotFoundError('Estudiante no encontrado')
  }

  const inscripciones = await inscripcionRepository.findByEstudianteId(id)

  // Enriquecer con datos del curso
  const inscripcionesEnriquecidas = await Promise.all(
    inscripciones.map(async (insc) => {
      const curso = await cursoRepository.findById(insc.cursoId)
      return {
        ...insc,
        curso: curso ? { id: curso.id, titulo: curso.titulo, precio: curso.precio } : null
      }
    })
  )

  return inscripcionesEnriquecidas
}

const crearEstudiante = async (estudianteData) => {
  validateCrearEstudiante(estudianteData)

  // Validar email único
  if (await estudianteRepository.emailExists(estudianteData.email)) {
    throw new BadRequestError('El email ya está registrado')
  }

  const nuevoEstudiante = await estudianteRepository.create(estudianteData)

  // Devolver sin password
  const estudianteModel = new Estudiante(nuevoEstudiante)
  return estudianteModel.toSafeObject()
}

const actualizarEstudiante = async (id, estudianteData) => {
  const estudianteExistente = await estudianteRepository.findById(id)
  if (!estudianteExistente) {
    throw new NotFoundError('Estudiante no encontrado')
  }

  validateActualizarEstudiante(estudianteData)

  // Validar email único solo si ha cambiado
  if (estudianteData.email !== estudianteExistente.email) {
    if (await estudianteRepository.emailExists(estudianteData.email)) {
      throw new BadRequestError('El email ya está en uso por otro estudiante')
    }
  }

  const { nombre, email, telefono, direccion } = estudianteData
  const estudianteActualizado = await estudianteRepository.update(id, {
    nombre,
    email,
    telefono: telefono || estudianteExistente.telefono,
    direccion: direccion || estudianteExistente.direccion
  })

  const estudianteModel = new Estudiante(estudianteActualizado)
  return estudianteModel.toSafeObject()
}

const actualizarEstudianteParcial = async (id, actualizaciones) => {
  const estudianteExistente = await estudianteRepository.findById(id)
  if (!estudianteExistente) {
    throw new NotFoundError('Estudiante no encontrado')
  }

  validateActualizarEstudianteParcial(actualizaciones)

  const camposPermitidos = ['nombre', 'email', 'telefono', 'direccion']
  const actualizacionesValidas = {}

  camposPermitidos.forEach(campo => {
    if (actualizaciones[campo] !== undefined) {
      actualizacionesValidas[campo] = actualizaciones[campo]
    }
  })

  // Validar email si se está actualizando y ha cambiado
  if (actualizacionesValidas.email && actualizacionesValidas.email !== estudianteExistente.email) {
    if (await estudianteRepository.emailExists(actualizacionesValidas.email)) {
      throw new BadRequestError('El email ya está en uso por otro estudiante')
    }
  }

  const estudianteActualizado = await estudianteRepository.update(id, actualizacionesValidas)
  const estudianteModel = new Estudiante(estudianteActualizado)
  return estudianteModel.toSafeObject()
}

const eliminarEstudiante = async (id) => {
  const estudiante = await estudianteRepository.findById(id)
  if (!estudiante) {
    throw new NotFoundError('Estudiante no encontrado')
  }

  // Verificar que no tenga inscripciones activas
  if (await inscripcionRepository.hasActiveInscripciones(id)) {
    throw new BadRequestError('No se puede eliminar un estudiante con inscripciones activas')
  }

  return await estudianteRepository.delete(id)
}

module.exports = {
  listarEstudiantes,
  obtenerEstudiantePorId,
  obtenerInscripcionesEstudiante,
  crearEstudiante,
  actualizarEstudiante,
  actualizarEstudianteParcial,
  eliminarEstudiante
}
