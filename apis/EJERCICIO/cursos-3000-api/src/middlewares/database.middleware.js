const db = require('../config/database')

// Middleware para compartir la BD (aunque ahora los repositorios acceden directamente)
// Este middleware se mantiene por compatibilidad pero ya no es estrictamente necesario
const databaseMiddleware = (req, res, next) => {
  req.db = db
  next()
}

module.exports = databaseMiddleware
