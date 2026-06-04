const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, '../data/pagalo3000.db')

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message)
  } else {
    console.log('Conectado a la base de datos SQLite3')
  }
})

// Crear tabla de transacciones si no existe
const initDatabase = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS transacciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaccionId TEXT UNIQUE NOT NULL,
      estado TEXT NOT NULL,
      cantidad REAL NOT NULL,
      moneda TEXT DEFAULT 'EUR',
      fechaTransaccion TEXT NOT NULL,
      ultimosDigitos TEXT NOT NULL,
      referencia TEXT,
      autorizacion TEXT,
      codigoError TEXT,
      mensaje TEXT,
      reembolsado INTEGER DEFAULT 0,
      cantidadReembolsado REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error al crear tabla transacciones:', err.message)
    } else {
      console.log('Tabla transacciones lista')
    }
  })
}

// Inicializar base de datos al cargar el módulo
initDatabase()

module.exports = db
