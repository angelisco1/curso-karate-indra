const app = require('./src/app')
const config = require('./src/config/environment')
const { initializeDatabase } = require('./src/config/database')

const PORT = config.port

// Inicializar base de datos y luego arrancar servidor
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Cursos 3000 API escuchando en http://localhost:${PORT}`)
      console.log(`Entorno: ${config.nodeEnv}`)
      console.log(`Base de datos: SQLite3 (cursos3000.db)`)
    })
  })
  .catch((error) => {
    console.error('Error al inicializar la aplicación:', error)
    process.exit(1)
  })
