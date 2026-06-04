const { isValidEmail } = require('../utils/validators')
const { BadRequestError } = require('../utils/http-errors')

const validateCrearEstudiante = (data) => {
  const { nombre, email, password } = data
  const camposFaltantes = []

  if (!nombre) camposFaltantes.push('nombre')
  if (!email) camposFaltantes.push('email')
  if (!password) camposFaltantes.push('password')

  if (camposFaltantes.length > 0) {
    throw new BadRequestError(`Faltan campos requeridos: ${camposFaltantes.join(', ')}`)
  }

  if (!isValidEmail(email)) {
    throw new BadRequestError('Email inválido')
  }
}

const validateActualizarEstudiante = (data) => {
  const { nombre, email } = data
  const camposFaltantes = []

  if (!nombre) camposFaltantes.push('nombre')
  if (!email) camposFaltantes.push('email')

  if (camposFaltantes.length > 0) {
    throw new BadRequestError(`Faltan campos requeridos: ${camposFaltantes.join(', ')}`)
  }

  if (!isValidEmail(email)) {
    throw new BadRequestError('Email inválido')
  }
}

const validateActualizarEstudianteParcial = (data) => {
  if (data.email && !isValidEmail(data.email)) {
    throw new BadRequestError('Email inválido')
  }
}

module.exports = {
  validateCrearEstudiante,
  validateActualizarEstudiante,
  validateActualizarEstudianteParcial
}
