const { isValidEstado } = require('../utils/validators')
const { BadRequestError } = require('../utils/http-errors')

const validateCrearInscripcion = (data) => {
  const { estudianteId, cursoId, datosPago } = data
  const camposFaltantes = []

  if (!estudianteId) camposFaltantes.push('estudianteId')
  if (!cursoId) camposFaltantes.push('cursoId')
  if (!datosPago) camposFaltantes.push('datosPago')

  if (camposFaltantes.length > 0) {
    throw new BadRequestError(`Faltan campos requeridos: ${camposFaltantes.join(', ')}`)
  }
}

const validateActualizarEstado = (estado) => {
  if (!estado) {
    throw new BadRequestError('Falta el campo: estado')
  }

  const estadosValidos = ['pendiente_pago', 'activo', 'completado', 'cancelado']
  if (!isValidEstado(estado, estadosValidos)) {
    throw new BadRequestError('Estado inválido. Estados válidos: ' + estadosValidos.join(', '))
  }

  return estadosValidos
}

module.exports = {
  validateCrearInscripcion,
  validateActualizarEstado
}
