const inscripcionRepository = require('../repositories/inscripcion.repository')
const estudianteRepository = require('../repositories/estudiante.repository')
const cursoRepository = require('../repositories/curso.repository')
const pagoService = require('./pago.service')
const { validateCrearInscripcion, validateActualizarEstado } = require('../validators/inscripcion.validator')
const { NotFoundError, BadRequestError } = require('../utils/http-errors')

const listarInscripciones = async () => {
  const inscripciones = await inscripcionRepository.findAll()

  // Enriquecer con datos del curso y estudiante
  const inscripcionesEnriquecidas = await Promise.all(
    inscripciones.map(async (insc) => {
      const curso = await cursoRepository.findById(insc.cursoId)
      const estudiante = await estudianteRepository.findById(insc.estudianteId)
      return {
        ...insc,
        curso: curso ? { id: curso.id, titulo: curso.titulo, precio: curso.precio } : null,
        estudiante: estudiante ? { id: estudiante.id, nombre: estudiante.nombre, email: estudiante.email } : null
      }
    })
  )

  return inscripcionesEnriquecidas
}

const obtenerInscripcionPorId = async (id) => {
  const inscripcion = await inscripcionRepository.findById(id)
  if (!inscripcion) {
    throw new NotFoundError('Inscripción no encontrada')
  }

  // Enriquecer con datos del curso y estudiante
  const curso = await cursoRepository.findById(inscripcion.cursoId)
  const estudiante = await estudianteRepository.findById(inscripcion.estudianteId)

  return {
    ...inscripcion,
    curso: curso ? { id: curso.id, titulo: curso.titulo, precio: curso.precio } : null,
    estudiante: estudiante ? { id: estudiante.id, nombre: estudiante.nombre, email: estudiante.email } : null
  }
}

const obtenerInscripcionesPorCurso = async (cursoId) => {
  const curso = await cursoRepository.findById(cursoId)
  if (!curso) {
    throw new NotFoundError('Curso no encontrado')
  }

  const inscripciones = await inscripcionRepository.findByCursoId(cursoId)

  // Enriquecer con datos del estudiante
  const inscripcionesEnriquecidas = await Promise.all(
    inscripciones.map(async (insc) => {
      const estudiante = await estudianteRepository.findById(insc.estudianteId)
      return {
        ...insc,
        estudiante: estudiante ? { id: estudiante.id, nombre: estudiante.nombre, email: estudiante.email } : null
      }
    })
  )

  return inscripcionesEnriquecidas
}

const crearInscripcion = async (inscripcionData) => {
  validateCrearInscripcion(inscripcionData)

  const { estudianteId, cursoId, datosPago } = inscripcionData

  // Validar estudiante
  const estudiante = await estudianteRepository.findById(estudianteId)
  if (!estudiante) {
    throw new NotFoundError('Estudiante no encontrado')
  }

  // Validar curso
  const curso = await cursoRepository.findById(cursoId)
  if (!curso) {
    throw new NotFoundError('Curso no encontrado')
  }

  // Verificar capacidad del curso
  if (curso.inscritosCount >= curso.maxEstudiantes) {
    throw new BadRequestError('El curso ha alcanzado la capacidad máxima')
  }

  // Verificar inscripción duplicada
  const yaInscrito = await inscripcionRepository.findActiveByEstudianteCurso(estudianteId, cursoId)
  if (yaInscrito) {
    throw new BadRequestError('El estudiante ya está inscrito en este curso')
  }

  // Procesar pago
  const referencia = `CURSO-${cursoId}-EST-${estudianteId}`
  const pagoData = await pagoService.procesarPago(curso.precio, datosPago, referencia)

  // Crear inscripción
  const nuevaInscripcion = await inscripcionRepository.create({
    estudianteId,
    cursoId,
    estado: 'activo',
    cantidadAbonada: curso.precio,
    transaccionId: pagoData.transaccionId
  })

  // Actualizar contador del curso
  await cursoRepository.incrementInscritosCount(cursoId)

  // Enriquecer respuesta
  return {
    ...nuevaInscripcion,
    curso: { id: curso.id, titulo: curso.titulo },
    pago: {
      transaccionId: pagoData.transaccionId,
      estado: pagoData.estado,
      autorizacion: pagoData.autorizacion
    }
  }
}

const actualizarEstadoInscripcion = async (id, nuevoEstado) => {
  const inscripcion = await inscripcionRepository.findById(id)
  if (!inscripcion) {
    throw new NotFoundError('Inscripción no encontrada')
  }

  validateActualizarEstado(nuevoEstado)

  const estadoAnterior = inscripcion.estado

  // Actualizar estado
  const inscripcionActualizada = await inscripcionRepository.updateEstado(id, nuevoEstado)

  // Si se cancela, decrementar contador del curso
  if (estadoAnterior !== 'cancelado' && nuevoEstado === 'cancelado') {
    await cursoRepository.decrementInscritosCount(inscripcion.cursoId)
  }

  return inscripcionActualizada
}

const cancelarInscripcion = async (id) => {
  const inscripcion = await inscripcionRepository.findById(id)
  if (!inscripcion) {
    throw new NotFoundError('Inscripción no encontrada')
  }

  // Cancelar inscripción
  await inscripcionRepository.cancel(id)

  // Decrementar contador del curso
  await cursoRepository.decrementInscritosCount(inscripcion.cursoId)

  return true
}

module.exports = {
  listarInscripciones,
  obtenerInscripcionPorId,
  obtenerInscripcionesPorCurso,
  crearInscripcion,
  actualizarEstadoInscripcion,
  cancelarInscripcion
}
