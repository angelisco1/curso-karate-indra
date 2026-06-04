const db = require('../config/database')

// Crear transacción
const crearTransaccion = (transaccion) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO transacciones (
        transaccionId, estado, cantidad, moneda, fechaTransaccion,
        ultimosDigitos, referencia, autorizacion, codigoError, mensaje
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      transaccion.transaccionId,
      transaccion.estado,
      transaccion.cantidad,
      transaccion.moneda,
      transaccion.fechaTransaccion,
      transaccion.ultimosDigitos,
      transaccion.referencia || null,
      transaccion.autorizacion || null,
      transaccion.codigoError || null,
      transaccion.mensaje || null
    ]

    db.run(query, params, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve({ ...transaccion, id: this.lastID })
      }
    })
  })
}

// Buscar transacción por ID
const buscarPorTransaccionId = (transaccionId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM transacciones WHERE transaccionId = ?'

    db.get(query, [transaccionId], (err, row) => {
      if (err) {
        reject(err)
      } else {
        // Convertir reembolsado de 0/1 a boolean
        if (row) {
          row.reembolsado = Boolean(row.reembolsado)
        }
        resolve(row)
      }
    })
  })
}

// Actualizar transacción (para reembolsos)
const actualizarTransaccion = (transaccionId, datos) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE transacciones
      SET reembolsado = ?, cantidadReembolsado = ?
      WHERE transaccionId = ?
    `

    db.run(query, [1, datos.cantidadReembolsado, transaccionId], function(err) {
      if (err) {
        reject(err)
      } else {
        resolve({ success: true, changes: this.changes })
      }
    })
  })
}

// Listar todas las transacciones (útil para debugging)
const listarTodas = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM transacciones ORDER BY createdAt DESC'

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        // Convertir reembolsado de 0/1 a boolean
        rows = rows.map(row => ({
          ...row,
          reembolsado: Boolean(row.reembolsado)
        }))
        resolve(rows)
      }
    })
  })
}

module.exports = {
  crearTransaccion,
  buscarPorTransaccionId,
  actualizarTransaccion,
  listarTodas
}
