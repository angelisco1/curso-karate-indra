const { isValidDateRange, isPositiveNumber } = require('../utils/validators')
const { BadRequestError } = require('../utils/http-errors')

const validateCrearCurso = (data) => {
  const { titulo, descripcion, categoria, nivel, precio, maxEstudiantes, fechaInicio, fechaFin } = data
  const camposFaltantes = []

  if (!titulo) camposFaltantes.push('titulo')
  if (!descripcion) camposFaltantes.push('descripcion')
  if (!categoria) camposFaltantes.push('categoria')
  if (!nivel) camposFaltantes.push('nivel')
  if (precio === undefined) camposFaltantes.push('precio')
  if (!maxEstudiantes) camposFaltantes.push('maxEstudiantes')

  if (camposFaltantes.length > 0) {
    throw new BadRequestError(`Faltan campos requeridos: ${camposFaltantes.join(', ')}`)
  }

  if (!isPositiveNumber(precio)) {
    throw new BadRequestError('El precio debe ser mayor a 0')
  }

  if (!isValidDateRange(fechaInicio, fechaFin)) {
    throw new BadRequestError('La fecha de inicio debe ser anterior a la fecha de fin')
  }
}

const validateActualizarCurso = (data) => {
  const { titulo, descripcion, categoria, nivel, precio, maxEstudiantes } = data
  const camposFaltantes = []

  if (!titulo) camposFaltantes.push('titulo')
  if (!descripcion) camposFaltantes.push('descripcion')
  if (!categoria) camposFaltantes.push('categoria')
  if (!nivel) camposFaltantes.push('nivel')
  if (precio === undefined) camposFaltantes.push('precio')
  if (!maxEstudiantes) camposFaltantes.push('maxEstudiantes')

  if (camposFaltantes.length > 0) {
    throw new BadRequestError(`Faltan campos requeridos: ${camposFaltantes.join(', ')}`)
  }
}

const validateActualizarCursoParcial = (data, cursoActual) => {
  const fechaInicio = data.fechaInicio || cursoActual.fechaInicio
  const fechaFin = data.fechaFin || cursoActual.fechaFin

  if (!isValidDateRange(fechaInicio, fechaFin)) {
    throw new BadRequestError('La fecha de inicio debe ser anterior a la fecha de fin')
  }
}

module.exports = {
  validateCrearCurso,
  validateActualizarCurso,
  validateActualizarCursoParcial
}
