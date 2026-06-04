const express = require('express')
const app = express()
const PORT = 3006
const db = require('./config/database')

// Middleware
app.use(express.json())

// Importar rutas
const pagosRoutes = require('./routes/pagos')

// Usar rutas
app.use('/api/pagos', pagosRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', servicio: 'Pagalo 3000' })
})

// Reset de base de datos (solo para testing)
app.post('/reset', (req, res) => {
  db.run('DELETE FROM transacciones', (err) => {
    if (err) {
      console.error('Error al resetear:', err)
      return res.status(500).json({ error: 'Error al resetear la base de datos' })
    }
    db.run("DELETE FROM sqlite_sequence WHERE name='transacciones'", (err2) => {
      res.json({ status: 'OK', mensaje: 'Base de datos reseteada' })
    })
  })
})

app.listen(PORT, () => {
  console.log(`Pagalo 3000 API escuchando en http://localhost:${PORT}`)
})
