// Validaciones reutilizables

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidDateRange = (fechaInicio, fechaFin) => {
  return new Date(fechaInicio) < new Date(fechaFin)
}

const isPositiveNumber = (num) => {
  return !isNaN(num) && parseFloat(num) > 0
}

const isValidEstado = (estado, estadosValidos) => {
  return estadosValidos.includes(estado)
}

module.exports = {
  isValidEmail,
  isValidDateRange,
  isPositiveNumber,
  isValidEstado
}
