const express = require('express')
const routes = require('./routes/index.routes')
const errorHandler = require('./middlewares/error.middleware')
const { runQuery } = require('./config/database')

const app = express()

// Middlewares globales
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', servicio: 'Cursos 3000' })
})

// Reset de base de datos (solo para testing)
app.post('/reset', async (req, res) => {
  try {
    // Borrar todas las tablas
    await runQuery('DELETE FROM inscripciones')
    await runQuery('DELETE FROM estudiantes')
    await runQuery('DELETE FROM cursos')

    // Resetear los autoincrement
    await runQuery("DELETE FROM sqlite_sequence WHERE name='inscripciones'")
    await runQuery("DELETE FROM sqlite_sequence WHERE name='estudiantes'")
    await runQuery("DELETE FROM sqlite_sequence WHERE name='cursos'")

    // Reinsertar datos iniciales
    await runQuery(`
      INSERT INTO cursos (titulo, descripcion, categoria, nivel, precio, maxEstudiantes, fechaInicio, fechaFin, inscritosCount)
      VALUES
        ('Testing con Karate DSL', 'Aprende a hacer testing de APIs con Karate', 'programacion', 'principiante', 99.99, 30, '2025-01-15', '2025-03-15', 0),
        ('Node.js Avanzado', 'Domina Node.js y Express', 'programacion', 'avanzado', 149.99, 25, '2025-02-01', '2025-04-30', 0)
    `)

    res.json({ status: 'OK', mensaje: 'Base de datos reseteada' })
  } catch (error) {
    console.error('Error al resetear:', error)
    res.status(500).json({ error: 'Error al resetear la base de datos' })
  }
})

// Montar todas las rutas bajo /api
app.use('/api', routes)

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler)

module.exports = app
