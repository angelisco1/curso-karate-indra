const { AppError } = require('../utils/http-errors')

// Middleware de manejo centralizado de errores
const errorHandler = (err, req, res, next) => {
  // Si es un error operacional conocido
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message
    })
  }

  // Error no controlado (500)
  console.error('Error no controlado:', err)
  res.status(500).json({
    error: 'Error interno del servidor'
  })
}

module.exports = errorHandler
