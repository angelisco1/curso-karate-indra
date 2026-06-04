const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, '../../cursos3000.db')

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message)
  } else {
    console.log('Conectado a la base de datos SQLite')
  }
})

// Función para ejecutar queries con promesas
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err)
      else resolve(this)
    })
  })
}

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

// Inicializar esquema de base de datos
const initializeDatabase = async () => {
  try {
    // Tabla de cursos
    await runQuery(`
      CREATE TABLE IF NOT EXISTS cursos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        categoria TEXT NOT NULL,
        nivel TEXT NOT NULL,
        precio REAL NOT NULL,
        maxEstudiantes INTEGER NOT NULL,
        fechaInicio TEXT NOT NULL,
        fechaFin TEXT NOT NULL,
        inscritosCount INTEGER DEFAULT 0
      )
    `)

    // Tabla de estudiantes
    await runQuery(`
      CREATE TABLE IF NOT EXISTS estudiantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        telefono TEXT,
        direccion TEXT,
        fechaRegistro TEXT NOT NULL
      )
    `)

    // Tabla de inscripciones
    await runQuery(`
      CREATE TABLE IF NOT EXISTS inscripciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudianteId INTEGER NOT NULL,
        cursoId INTEGER NOT NULL,
        estado TEXT NOT NULL,
        fechaInscripcion TEXT NOT NULL,
        cantidadAbonada REAL NOT NULL,
        transaccionId TEXT,
        fechaCancelacion TEXT,
        FOREIGN KEY (estudianteId) REFERENCES estudiantes(id),
        FOREIGN KEY (cursoId) REFERENCES cursos(id)
      )
    `)

    console.log('Esquema de base de datos creado')

    // Verificar si hay datos iniciales
    const cursosCount = await getQuery('SELECT COUNT(*) as count FROM cursos')

    if (cursosCount.count === 0) {
      // Insertar datos iniciales
      await runQuery(`
        INSERT INTO cursos (titulo, descripcion, categoria, nivel, precio, maxEstudiantes, fechaInicio, fechaFin, inscritosCount)
        VALUES
          ('Testing con Karate DSL', 'Aprende a hacer testing de APIs con Karate', 'programacion', 'principiante', 99.99, 30, '2025-01-15', '2025-03-15', 0),
          ('Node.js Avanzado', 'Domina Node.js y Express', 'programacion', 'avanzado', 149.99, 25, '2025-02-01', '2025-04-30', 0)
      `)
      console.log('Datos iniciales insertados')
    }

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message)
    throw error
  }
}

module.exports = {
  db,
  runQuery,
  getQuery,
  allQuery,
  initializeDatabase
}
