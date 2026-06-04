// Clases de errores personalizados

class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404)
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Solicitud inválida') {
    super(message, 400)
  }
}

class PaymentError extends AppError {
  constructor(message = 'Error en el pago', statusCode = 402) {
    super(message, statusCode)
  }
}

class ServiceUnavailableError extends AppError {
  constructor(message = 'Servicio no disponible') {
    super(message, 503)
  }
}

module.exports = {
  AppError,
  NotFoundError,
  BadRequestError,
  PaymentError,
  ServiceUnavailableError
}
